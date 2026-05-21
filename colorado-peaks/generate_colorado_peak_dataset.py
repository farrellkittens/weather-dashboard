import pandas as pd
from geopy.distance import geodesic
from geopy.geocoders import Nominatim

# =========================================================
# CONFIG
# =========================================================

INPUT_CSV = "colorado_named_12k_peaks_input.csv"
PEAKS_OUTPUT = "colorado_12k_peaks.csv"
RADIALS_OUTPUT = "colorado_12k_radials.csv"

DISTANCES_MI = [0.5, 1, 5, 10, 20]

DIRECTIONS = {
    "N": 0,
    "NNE": 22.5,
    "NE": 45,
    "ENE": 67.5,
    "E": 90,
    "ESE": 112.5,
    "SE": 135,
    "SSE": 157.5,
    "S": 180,
    "SSW": 202.5,
    "SW": 225,
    "WSW": 247.5,
    "W": 270,
    "WNW": 292.5,
    "NW": 315,
    "NNW": 337.5,
}

# =========================================================
# LOAD INPUT CSV
# =========================================================

peaks = pd.read_csv(INPUT_CSV)

# =========================================================
# NEAREST CITY LOOKUP
# =========================================================

geolocator = Nominatim(user_agent="co_peak_dataset")

def reverse_city(lat, lon):
    try:
        loc = geolocator.reverse((lat, lon), exactly_one=True)

        if not loc:
            return None

        addr = loc.raw.get("address", {})

        return (
            addr.get("city")
            or addr.get("town")
            or addr.get("village")
            or addr.get("hamlet")
            or addr.get("county")
        )

    except Exception:
        return None


nearest_cities = []

for _, row in peaks.iterrows():
    city = reverse_city(row["summit_lat"], row["summit_lon"])
    nearest_cities.append(city)

peaks["nearest_city"] = nearest_cities

# =========================================================
# GENERATE RADIAL COORDINATES
# =========================================================

radial_rows = []

for idx, row in peaks.iterrows():

    summit = (row["summit_lat"], row["summit_lon"])

    for direction_name, bearing in DIRECTIONS.items():

        for dist in DISTANCES_MI:

            destination = geodesic(miles=dist).destination(
                summit,
                bearing
            )

            radial_rows.append(
                {
                    "peak_id": idx + 1,
                    "peak_name": row["peak_name"],
                    "direction": direction_name,
                    "distance_mi": dist,
                    "point_lat": destination.latitude,
                    "point_lon": destination.longitude,
                }
            )

# =========================================================
# EXPORT PEAKS CSV
# =========================================================

peaks.insert(0, "peak_id", range(1, len(peaks) + 1))

peaks_output_cols = [
    "peak_id",
    "peak_name",
    "elevation_ft",
    "summit_lat",
    "summit_lon",
    "nearest_city",
    "trailhead_name",
    "trailhead_lat",
    "trailhead_lon",
]

peaks[peaks_output_cols].to_csv(
    PEAKS_OUTPUT,
    index=False
)

# =========================================================
# EXPORT RADIALS CSV
# =========================================================

radials_df = pd.DataFrame(radial_rows)

radials_df.to_csv(
    RADIALS_OUTPUT,
    index=False
)

print("Done.")
print(f"Wrote: {PEAKS_OUTPUT}")
print(f"Wrote: {RADIALS_OUTPUT}")
