import requests
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

VERSION = "v2.3"

print("Fetching NOAA data and building dashboard...")

LAT = 39.7418655
LON = -104.97594
HEADERS = {"User-Agent": "aaWeatherDashboard/1.0"}

# ---------------------------
# FETCH NOAA HOURLY FORECAST
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
    "precip": p["probabilityOfPrecipitation"]["value"] or 0
} for p in periods])

df = df.sort_values("time").reset_index(drop=True)

# simple derived metric (placeholder)
df["wind_chill"] = df["temp"] - ((100 - df["wind"]) * 0.1)

# ---------------------------
# NOOA X AXIS (3-hour cadence)
# ---------------------------
tick_times = df["time"][::3]
tick_labels = df["time"][::3].dt.strftime("%-I%p").str.lower()

# ---------------------------
# FIGURE SETUP (STACKED PANELS)
# ---------------------------
fig = make_subplots(
    rows=5,
    cols=1,
    shared_xaxes=False,
    vertical_spacing=0.05,
    subplot_titles=[
        "Temperature / Wind Chill",
        "Wind / Gusts",
        "Humidity / Precip Chance",
        "Sky Cover (placeholder)",
        "Precip (placeholder)"
    ]
)

# ---------------------------
# DAY / NIGHT SHADING PER PANEL
# ---------------------------
def add_day_night():
    for i in range(len(df) - 1):
        hour = df.loc[i, "time"].hour
        is_night = (hour >= 18 or hour <= 6)

        if is_night:
            for r in range(1, 6):
                fig.add_vrect(
                    x0=df.loc[i, "time"],
                    x1=df.loc[i + 1, "time"],
                    fillcolor="rgba(0,0,0,0.25)",
                    layer="below",
                    line_width=0,
                    row=r,
                    col=1
                )

add_day_night()

# ---------------------------
# VALUE LABELS (NOAA STYLE SPARSE ANCHORS)
# ---------------------------
def add_value_labels(ycol):
    for i in range(0, len(df), 3):
        fig.add_annotation(
            x=df.loc[i, "time"],
            y=df.loc[i, ycol],
            text=str(round(df.loc[i, ycol], 0)),
            showarrow=False,
            font=dict(size=10, color="white"),
            yshift=8
        )

# ---------------------------
# PANEL 1: TEMP
# ---------------------------
fig.add_trace(go.Scatter(
    x=df["time"],
    y=df["temp"],
    name="Temp",
    line=dict(color="red")
), row=1, col=1)

fig.add_trace(go.Scatter(
    x=df["time"],
    y=df["wind_chill"],
    name="Wind Chill",
    line=dict(color="cyan", dash="dot")
), row=1, col=1)

add_value_labels("temp")

# ---------------------------
# PANEL 2: WIND
# ---------------------------
fig.add_trace(go.Scatter(
    x=df["time"],
    y=df["wind"],
    name="Wind",
    line=dict(color="white")
), row=2, col=1)

fig.add_trace(go.Scatter(
    x=df["time"],
    y=df["gust"],
    name="Gusts",
    line=dict(color="orange", dash="dash")
), row=2, col=1)

add_value_labels("wind")

# ---------------------------
# PANEL 3: HUMIDITY / PRECIP
# ---------------------------
fig.add_trace(go.Scatter(
    x=df["time"],
    y=df["humidity"],
    name="Humidity",
    line=dict(color="blue")
), row=3, col=1)

fig.add_trace(go.Bar(
    x=df["time"],
    y=df["precip"],
    name="Precip %",
    marker_color="rgba(120,200,255,0.5)"
), row=3, col=1)

add_value_labels("humidity")

# ---------------------------
# PANEL 4: SKY (PLACEHOLDER)
# ---------------------------
fig.add_trace(go.Scatter(
    x=df["time"],
    y=[0] * len(df),
    name="Sky Cover"
), row=4, col=1)

# ---------------------------
# PANEL 5: PRECIP TYPES (PLACEHOLDER)
# ---------------------------
fig.add_trace(go.Scatter(
    x=df["time"],
    y=df["precip"],
    name="Precip Proxy"
), row=5, col=1)

# ---------------------------
# APPLY NOAA X AXIS TO EACH PANEL
# ---------------------------
for r in range(1, 6):
    fig.update_xaxes(
        tickmode="array",
        tickvals=tick_times,
        ticktext=tick_labels,
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
output_file = "dashboard.html"
fig.write_html(output_file)

print("Saved NOAA-style dashboard.html")