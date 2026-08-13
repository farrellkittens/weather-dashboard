import requests
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

VERSION = "v3.1"

print("Fetching NOAA data and building dashboard...")

LAT = 39.7418655
LON = -104.97594
HEADERS = {"User-Agent": "aaWeatherDashboard/1.0"}

# ---------------------------
# FETCH NOAA DATA
# ---------------------------
point = requests.get(
    f"https://api.weather.gov/points/{LAT},{LON}",
    headers=HEADERS
).json()

forecast_url = point["properties"]["forecastHourly"]
forecast = requests.get(forecast_url, headers=HEADERS).json()
periods = forecast["properties"]["periods"]

# ---------------------------
# BUILD DATAFRAME
# ---------------------------
df = pd.DataFrame([{
    "time": pd.to_datetime(p["startTime"]),
    "temp": p["temperature"],
    "wind": int(p["windSpeed"].split()[0]) if p["windSpeed"] else 0,
    "gust": p.get("windGust") or 0,
    "humidity": p["relativeHumidity"]["value"] or 0,
    "precip": p["probabilityOfPrecipitation"]["value"] or 0,
    "sky": p.get("skyCover", 0)
} for p in periods])

df = df.sort_values("time").reset_index(drop=True)
df = df.iloc[:48]

df["date"] = df["time"].dt.date

# ---------------------------
# FIGURE (KEEP SHARED X-AXIS)
# ---------------------------
fig = make_subplots(
    rows=5,
    cols=1,
    shared_xaxes=True,   # IMPORTANT (NOAA STYLE FOUNDATION)
    vertical_spacing=0.06
)

# ---------------------------
# TRACES
# ---------------------------
fig.add_trace(go.Scatter(x=df["time"], y=df["temp"], name="Temp", line=dict(color="red")), row=1, col=1)
fig.add_trace(go.Scatter(x=df["time"], y=df["wind"], name="Wind", line=dict(color="white")), row=2, col=1)
fig.add_trace(go.Scatter(x=df["time"], y=df["gust"], name="Gusts", line=dict(color="orange")), row=2, col=1)
fig.add_trace(go.Scatter(x=df["time"], y=df["humidity"], name="Humidity", line=dict(color="blue")), row=3, col=1)
fig.add_trace(go.Scatter(x=df["time"], y=df["sky"], name="Sky Cover", line=dict(color="gray")), row=4, col=1)
fig.add_trace(go.Bar(x=df["time"], y=df["precip"], name="Precip %", marker_color="rgba(120,200,255,0.6)"), row=5, col=1)

# ---------------------------
# SKY FIX
# ---------------------------
fig.update_yaxes(range=[0, 100], row=4, col=1)

# ---------------------------
# SHADING (UNCHANGED WORKING VERSION)
# ---------------------------
start = df["time"].min().floor("D")
end = df["time"].max().ceil("D")

current = start

while current < end:
    night_start = current + pd.Timedelta(hours=6)
    night_end = current + pd.Timedelta(hours=18)
    next_day = current + pd.Timedelta(days=1)

    # DAY (6am–6pm)
    fig.add_vrect(
        x0=night_start,
        x1=night_end,
        fillcolor="rgba(255,255,255,0.08)",
        layer="below",
        line_width=0
    )

    # NIGHT (6pm–6am)
    fig.add_vrect(
        x0=night_end,
        x1=next_day,
        fillcolor="rgba(0,0,0,0.18)",
        layer="below",
        line_width=0
    )

    current = next_day

# ---------------------------
# DAY LABELS (12AM ANCHOR)
# ---------------------------
for d in df["date"].unique():
    midnight = pd.Timestamp(str(d))

    fig.add_annotation(
        x=midnight,
        y=1.02,
        xref="x",
        yref="paper",
        text=midnight.strftime("%a %b %d"),
        showarrow=False,
        font=dict(size=11, color="rgba(255,255,255,0.75)")
    )

# ---------------------------
# PANEL TITLES (TOP RIGHT)
# ---------------------------
titles = ["Temp", "Wind", "Humidity", "Sky", "Precip"]

for i, t in enumerate(titles, start=1):
    fig.add_annotation(
        x=1,
        y=1.15,
        xref="paper",
        yref="y" + str(i),
        text=t,
        showarrow=False,
        font=dict(size=12, color="white")
    )

# ---------------------------
# NOAA MULTI-PANEL X-AXIS LABEL FIX
# ---------------------------
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

        showticklabels=True,   # 🔥 KEY CHANGE (NOAA PER-PANEL LABELS)
        ticks="outside",

        row=r,
        col=1
    )

# ---------------------------
# LAYOUT
# ---------------------------
fig.update_layout(
    title=f"Weather Dashboard {VERSION}",
    height=1200,
    template="plotly_dark",
    hovermode="x unified"
)

# ---------------------------
# OUTPUT
# ---------------------------
fig.write_html("dashboard.html")

print("Saved NOAA-style dashboard.html")