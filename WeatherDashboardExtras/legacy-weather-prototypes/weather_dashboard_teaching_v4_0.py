import requests
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

VERSION = "v4.2 (NOAA Stable Time Pipeline)"

print("Fetching NOAA grid data and building dashboard...")

# =========================================================
# LOCATION
# =========================================================
LAT = 39.7418655
LON = -104.97594
HEADERS = {"User-Agent": "aaWeatherDashboard/1.0"}

# =========================================================
# NOAA GRID ENDPOINT
# =========================================================
point = requests.get(
    f"https://api.weather.gov/points/{LAT},{LON}",
    headers=HEADERS
).json()

grid_url = point["properties"]["forecastGridData"]
grid = requests.get(grid_url, headers=HEADERS).json()
properties = grid["properties"]

# =========================================================
# SAFE GRID EXTRACTION
# =========================================================
def extract_series(field):
    if field not in properties:
        return pd.DataFrame(columns=["time", field])

    rows = []
    for v in properties[field]["values"]:
        t = pd.to_datetime(v["validTime"].split("/")[0])
        rows.append((t, v["value"]))

    return pd.DataFrame(rows, columns=["time", field])

temp = extract_series("temperature")
dew = extract_series("dewpoint")
wind = extract_series("windSpeed")
sky = extract_series("skyCover")
precip = extract_series("probabilityOfPrecipitation")

# =========================================================
# BUILD STRICT HOURLY BACKBONE (FIXES ALL GAP ISSUES)
# =========================================================
all_times = pd.concat([
    temp["time"],
    dew["time"],
    wind["time"],
    sky["time"],
    precip["time"]
], ignore_index=True)

all_times = pd.to_datetime(all_times, errors="coerce").dropna()

start = all_times.min().floor("h")   # FIXED: lowercase h
end = start + pd.Timedelta(hours=48)

df = pd.DataFrame({
    "time": pd.date_range(start=start, end=end, freq="1h")
})

# =========================================================
# MERGE ALL VARIABLES INTO SINGLE TIMELINE
# =========================================================
df = df.merge(temp, on="time", how="left")
df = df.merge(dew, on="time", how="left")
df = df.merge(wind, on="time", how="left")
df = df.merge(sky, on="time", how="left")
df = df.merge(precip, on="time", how="left")

# =========================================================
# FORCE CONTINUITY (NO LINE BREAKS)
# =========================================================
df = df.sort_values("time").reset_index(drop=True)

cols = ["temperature", "dewpoint", "windSpeed", "skyCover", "probabilityOfPrecipitation"]

for c in cols:
    if c in df.columns:
        df[c] = df[c].ffill().bfill()

# =========================================================
# WIND CHILL (NOAA STANDARD FORMULA)
# =========================================================
def wind_chill(temp_f, wind_mph):
    if temp_f is None or wind_mph is None:
        return temp_f
    if temp_f > 50 or wind_mph <= 3:
        return temp_f

    return (
        35.74
        + 0.6215 * temp_f
        - 35.75 * (wind_mph ** 0.16)
        + 0.4275 * temp_f * (wind_mph ** 0.16)
    )

df["windChill"] = df.apply(
    lambda r: wind_chill(r.get("temperature"), r.get("windSpeed")),
    axis=1
)

df["date"] = df["time"].dt.date

# =========================================================
# FIGURE
# =========================================================
fig = make_subplots(
    rows=5,
    cols=1,
    shared_xaxes=False,
    vertical_spacing=0.06
)

# =========================================================
# TRACES
# =========================================================
fig.add_trace(go.Scatter(x=df["time"], y=df["temperature"], name="Temp", line=dict(color="red")), row=1, col=1)

fig.add_trace(go.Scatter(x=df["time"], y=df["windSpeed"], name="Wind", line=dict(color="white")), row=2, col=1)
fig.add_trace(go.Scatter(x=df["time"], y=df["windChill"], name="Wind Chill", line=dict(color="cyan")), row=2, col=1)

fig.add_trace(go.Scatter(x=df["time"], y=df["dewpoint"], name="Dewpoint", line=dict(color="green")), row=3, col=1)

fig.add_trace(go.Scatter(x=df["time"], y=df["skyCover"], name="Sky Cover", line=dict(color="gray")), row=4, col=1)

fig.add_trace(go.Bar(x=df["time"], y=df["probabilityOfPrecipitation"], name="Precip %", marker_color="rgba(120,200,255,0.6)"), row=5, col=1)

# =========================================================
# SKY RANGE LOCK (NOAA SCALE)
# =========================================================
fig.update_yaxes(range=[0, 100], row=4, col=1)

# =========================================================
# FIXED 48-HOUR VIEW WINDOW
# =========================================================
fig.update_xaxes(range=[start, end])

# =========================================================
# DAY / NIGHT SHADING (SIMPLE NOAA STYLE)
# =========================================================
for d in df["date"].unique():
    day_start = pd.Timestamp(d)

    fig.add_vrect(
        x0=day_start,
        x1=day_start + pd.Timedelta(hours=6),
        fillcolor="rgba(0,0,0,0.20)",
        layer="below",
        line_width=0
    )

    fig.add_vrect(
        x0=day_start + pd.Timedelta(hours=6),
        x1=day_start + pd.Timedelta(hours=18),
        fillcolor="rgba(255,255,255,0.06)",
        layer="below",
        line_width=0
    )

    fig.add_vrect(
        x0=day_start + pd.Timedelta(hours=18),
        x1=day_start + pd.Timedelta(days=1),
        fillcolor="rgba(0,0,0,0.20)",
        layer="below",
        line_width=0
    )

# =========================================================
# DAY LABELS (MIDNIGHT ANCHOR)
# =========================================================
for d in df["date"].unique():
    fig.add_annotation(
        x=pd.Timestamp(d),
        y=1.02,
        xref="x",
        yref="paper",
        text=pd.to_datetime(d).strftime("%a %b %d"),
        showarrow=False,
        font=dict(size=11, color="rgba(255,255,255,0.75)")
    )

# =========================================================
# AXES STYLE (NOAA GRID FEEL)
# =========================================================
for r in range(1, 6):
    fig.update_xaxes(
        type="date",
        tickformat="%I%p",
        dtick=3 * 60 * 60 * 1000,
        showgrid=True,
        gridcolor="rgba(255,255,255,0.30)",
        minor=dict(
            dtick=60 * 60 * 1000,
            showgrid=True,
            gridcolor="rgba(255,255,255,0.15)"
        ),
        row=r,
        col=1
    )

# =========================================================
# LAYOUT
# =========================================================
fig.update_layout(
    title=f"Weather Dashboard {VERSION}",
    height=1200,
    template="plotly_dark",
    hovermode="x unified"
)

# =========================================================
# OUTPUT
# =========================================================
fig.write_html("dashboard.html")

print("Saved NOAA-style dashboard.html")