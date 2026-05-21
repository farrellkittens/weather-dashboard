"""
build_input_csv.py

Builds colorado_named_12k_peaks_input.csv by:
  1. Downloading USGS GNIS Colorado summit names/coords from TNM S3
  2. Fetching summit elevations via Open-Meteo elevation API (DEM-based)
  3. Filtering for summits >= 12,000 ft
  4. Attempting to fetch Colorado trailhead locations from OSM Overpass
  5. Matching each peak to its nearest trailhead
  6. Writing the input CSV

Requires: pip install requests pandas
Note: Overpass API may be unavailable from some networks. If trailhead lookup
      fails, trailhead columns are left empty and can be filled in manually or
      by re-running when Overpass is accessible.
"""

import io
import time
import zipfile

import numpy as np
import pandas as pd
import requests

# =========================================================
# CONFIG
# =========================================================

GNIS_URL = (
    "https://prd-tnm.s3.amazonaws.com"
    "/StagedProducts/GeographicNames/DomesticNames/DomesticNames_CO_Text.zip"
)
OUTPUT_CSV = "colorado_named_12k_peaks_input.csv"

MIN_ELEVATION_FT = 12000
# Use a ~200 ft buffer below the target threshold to account for DEM
# underestimation at sharp summits (Open-Meteo uses ~90m gridded DEM).
MIN_ELEVATION_M = (MIN_ELEVATION_FT - 200) * 0.3048

ELEVATION_API = "https://api.open-meteo.com/v1/elevation"
ELEVATION_BATCH_SIZE = 100  # keep URLs short; 3200 summits = ~33 requests

OVERPASS_MIRRORS = [
    "https://overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
]
COLORADO_BBOX = (37.0, -109.1, 41.0, -102.0)

# =========================================================
# 1. DOWNLOAD GNIS COLORADO SUMMITS
# =========================================================

print("Downloading GNIS Colorado features from TNM S3...")
r = requests.get(GNIS_URL, timeout=90)
r.raise_for_status()

with zipfile.ZipFile(io.BytesIO(r.content)) as z:
    with z.open("Text/DomesticNames_CO.txt") as f:
        gnis = pd.read_csv(f, sep="|", low_memory=False, encoding_errors="replace")

summits = gnis[gnis["feature_class"] == "Summit"].copy()
summits = summits.dropna(subset=["prim_lat_dec", "prim_long_dec"]).reset_index(drop=True)
print(f"  Named Colorado summits in GNIS: {len(summits)}")

# =========================================================
# 2. FETCH ELEVATIONS FROM OPEN-METEO (batched)
# =========================================================

print(f"Fetching elevations from Open-Meteo (batches of {ELEVATION_BATCH_SIZE})...")

lats = summits["prim_lat_dec"].tolist()
lons = summits["prim_long_dec"].tolist()
elevations_m = []

for i in range(0, len(lats), ELEVATION_BATCH_SIZE):
    batch_lats = lats[i : i + ELEVATION_BATCH_SIZE]
    batch_lons = lons[i : i + ELEVATION_BATCH_SIZE]

    for attempt in range(5):
        resp = requests.get(
            ELEVATION_API,
            params={
                "latitude": ",".join(f"{x:.6f}" for x in batch_lats),
                "longitude": ",".join(f"{x:.6f}" for x in batch_lons),
            },
            timeout=30,
        )
        if resp.status_code == 429:
            wait = 10 * (attempt + 1)
            print(f"  Rate limited — waiting {wait}s...")
            time.sleep(wait)
            continue
        resp.raise_for_status()
        break

    elevations_m.extend(resp.json()["elevation"])

    end = min(i + ELEVATION_BATCH_SIZE, len(lats))
    print(f"  {end}/{len(lats)}")
    if end < len(lats):
        time.sleep(2)

summits["elevation_m"] = elevations_m
summits["elevation_ft"] = (summits["elevation_m"] / 0.3048).round().astype(int)

# =========================================================
# 3. FILTER TO >= 12,000 FT
# =========================================================

peaks = summits[summits["elevation_m"] >= MIN_ELEVATION_M].copy().reset_index(drop=True)
print(f"\nSummits at or near {MIN_ELEVATION_FT:,}+ ft: {len(peaks)}")
print(f"  12ers (12,000–12,999 ft): {((peaks['elevation_ft'] >= 12000) & (peaks['elevation_ft'] < 13000)).sum()}")
print(f"  13ers (13,000–13,999 ft): {((peaks['elevation_ft'] >= 13000) & (peaks['elevation_ft'] < 14000)).sum()}")
print(f"  14ers (14,000+ ft):       {(peaks['elevation_ft'] >= 14000).sum()}")

# =========================================================
# 4. FETCH COLORADO TRAILHEADS FROM OVERPASS
# =========================================================

S, W, N, E = COLORADO_BBOX
trailhead_query = f"""
[out:json][timeout:120];
(
  node["highway"="trailhead"]({S},{W},{N},{E});
  node["amenity"="trailhead"]({S},{W},{N},{E});
);
out body;
"""

trailheads = None

for mirror in OVERPASS_MIRRORS:
    try:
        print(f"\nFetching trailheads from {mirror} ...")
        resp = requests.post(mirror, data={"data": trailhead_query}, timeout=130)
        if resp.status_code == 200:
            elements = resp.json().get("elements", [])
            trailheads = pd.DataFrame(
                [
                    {
                        "name": e.get("tags", {}).get("name", "Trailhead"),
                        "lat": e["lat"],
                        "lon": e["lon"],
                    }
                    for e in elements
                    if "lat" in e
                ]
            )
            print(f"  Found {len(trailheads)} trailhead nodes")
            break
        else:
            print(f"  HTTP {resp.status_code} — trying next mirror")
    except Exception as e:
        print(f"  Failed ({type(e).__name__}) — trying next mirror")

# =========================================================
# 5. MATCH PEAKS TO NEAREST TRAILHEAD
# =========================================================

if trailheads is not None and len(trailheads) > 0:
    print("Matching each peak to nearest trailhead (vectorized haversine)...")

    p_lat = np.radians(peaks["prim_lat_dec"].values)[:, np.newaxis]
    p_lon = np.radians(peaks["prim_long_dec"].values)[:, np.newaxis]
    t_lat = np.radians(trailheads["lat"].values)[np.newaxis, :]
    t_lon = np.radians(trailheads["lon"].values)[np.newaxis, :]

    dlat = t_lat - p_lat
    dlon = t_lon - p_lon
    a = np.sin(dlat / 2) ** 2 + np.cos(p_lat) * np.cos(t_lat) * np.sin(dlon / 2) ** 2
    dist = 2 * np.arcsin(np.sqrt(a))

    nearest_idx = np.argmin(dist, axis=1)

    peaks["trailhead_name"] = trailheads.iloc[nearest_idx]["name"].values
    peaks["trailhead_lat"] = trailheads.iloc[nearest_idx]["lat"].values
    peaks["trailhead_lon"] = trailheads.iloc[nearest_idx]["lon"].values

else:
    print(
        "\nWARNING: Overpass API unavailable — trailhead columns will be empty.\n"
        "  Re-run when Overpass is accessible, or populate manually."
    )
    peaks["trailhead_name"] = ""
    peaks["trailhead_lat"] = ""
    peaks["trailhead_lon"] = ""

# =========================================================
# 6. WRITE OUTPUT CSV
# =========================================================

out = peaks.rename(
    columns={
        "feature_name": "peak_name",
        "prim_lat_dec": "summit_lat",
        "prim_long_dec": "summit_lon",
    }
)

out_cols = [
    "peak_name",
    "elevation_ft",
    "summit_lat",
    "summit_lon",
    "trailhead_name",
    "trailhead_lat",
    "trailhead_lon",
]

out[out_cols].to_csv(OUTPUT_CSV, index=False)

print(f"\nDone. Wrote {len(out)} peaks to {OUTPUT_CSV}")
