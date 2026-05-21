"""
patch_14er_elevations.py

Updates elevation_ft in colorado_named_12k_peaks_input.csv with official
elevations from 14ers.com for all 53 Colorado fourteeners.
Matches by peak name and reports any that couldn't be matched.

Requires: pip install pandas
"""

import pandas as pd

INPUT_CSV = "colorado_named_12k_peaks_input.csv"

# Official elevations sourced from 14ers.com
FOURTEENERS = {
    "Mount Elbert": 14438,
    "Mount Massive": 14427,
    "Mount Harvard": 14424,
    "Blanca Peak": 14350,
    "La Plata Peak": 14344,
    "Uncompahgre Peak": 14318,
    "Crestone Peak": 14299,
    "Mount Lincoln": 14293,
    "Grays Peak": 14275,
    "Castle Peak": 14274,
    "Quandary Peak": 14272,
    "Torreys Peak": 14272,
    "Mount Antero": 14271,
    "Mount Blue Sky": 14268,  # formerly Mount Evans; GNIS may still list as Mount Evans
    "Longs Peak": 14259,
    "Mount Wilson": 14256,
    "Mount Shavano": 14230,
    "Mount Belford": 14202,
    "Mount Princeton": 14200,
    "Mount Yale": 14200,
    "Crestone Needle": 14196,
    "Mount Bross": 14178,
    "Kit Carson Peak": 14167,
    "Maroon Peak": 14163,
    "Mount Oxford": 14158,
    "Tabeguache Peak": 14158,
    "Mount Sneffels": 14155,
    "Mount Democrat": 14154,
    "Capitol Peak": 14138,
    "Pikes Peak": 14109,
    "Snowmass Mountain": 14105,
    "Windom Peak": 14089,
    "Mount Eolus": 14087,
    "Mount Columbia": 14075,
    "Missouri Mountain": 14071,
    "Humboldt Peak": 14068,
    "Mount Bierstadt": 14066,
    "Sunlight Peak": 14061,
    "Handies Peak": 14058,
    "Ellingwood Point": 14057,
    "Mount Lindsey": 14055,
    "Culebra Peak": 14053,
    "Mount Sherman": 14043,
    "Little Bear Peak": 14041,
    "Redcloud Peak": 14037,
    "Pyramid Peak": 14029,
    "San Luis Peak": 14023,
    "North Maroon Peak": 14022,
    "Wetterhorn Peak": 14021,
    "Wilson Peak": 14021,
    "Mount of the Holy Cross": 14007,
    "Huron Peak": 14006,
    "Sunshine Peak": 14004,
}

# =========================================================
# LOAD & PATCH
# =========================================================

df = pd.read_csv(INPUT_CSV)
print(f"Loaded {len(df)} peaks from {INPUT_CSV}")

matched = []
unmatched = []

for name, elev in FOURTEENERS.items():
    mask = df["peak_name"] == name
    if mask.any():
        df.loc[mask, "elevation_ft"] = elev
        matched.append(name)
    else:
        unmatched.append(name)

df.to_csv(INPUT_CSV, index=False)

print(f"\nPatched {len(matched)} of {len(FOURTEENERS)} fourteeners:")
for name in matched:
    print(f"  {name}: {FOURTEENERS[name]:,} ft")

if unmatched:
    print(f"\nNot found in dataset ({len(unmatched)}) — may need manual review:")
    for name in unmatched:
        print(f"  {name}")
else:
    print("\nAll 53 fourteeners matched successfully.")

# Summary
print(f"\nUpdated elevation breakdown:")
print(f"  12ers (12,000–12,999 ft): {((df['elevation_ft'] >= 12000) & (df['elevation_ft'] < 13000)).sum()}")
print(f"  13ers (13,000–13,999 ft): {((df['elevation_ft'] >= 13000) & (df['elevation_ft'] < 14000)).sum()}")
print(f"  14ers (14,000+ ft):       {(df['elevation_ft'] >= 14000).sum()}")
