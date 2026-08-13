import requests
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

LAT = 39.741694
LON = -104.97618

HEADERS = {"User-Agent": "aaWeatherDashboard/1.0"}

# ---------------------------
# NOAA DATA FETCH
# ---------------------------
point_url = f"https://api.weather.gov/points/{LAT},{LON}"
point = requests.get(point_url, headers=HEADERS).json()

forecast_url = point["properties"]["forecastHourly"]
forecast = requests.get(forecast_url, headers=HEADERS).json()

periods = forecast["properties"]["periods"]

# ---------------------------
# BUILD DATAFRAME
# ---------------------------
rows = []

for p in periods:
    rows.append({
        "time": pd.to_datetime(p["startTime"]),
        "temp": p["temperature"],
        "precip": p["probabilityOfPrecipitation"]["value"] or 0,
        "wind": int(p["windSpeed"].split()[0])
    })

df = pd.DataFrame(rows)

# ---------------------------
# PLOTLY FIGURE
# ---------------------------
fig = make_subplots(
    rows=2,
    cols=1,
    shared_xaxes=True,
    subplot_titles=("Temperature + Precipitation", "Wind Speed")
)

# Temp line
fig.add_trace(
    go.Scatter(
        x=df["time"],
        y=df["temp"],
        name="Temperature (°F)",
        mode="lines"
    ),
    row=1,
    col=1
)

# Precip bars
fig.add_trace(
    go.Bar(
        x=df["time"],
        y=df["precip"],
        name="Precip %"
    ),
    row=1,
    col=1
)

# Wind
fig.add_trace(
    go.Scatter(
        x=df["time"],
        y=df["wind"],
        name="Wind (mph)",
        mode="lines"
    ),
    row=2,
    col=1
)

# ---------------------------
# LAYOUT
# ---------------------------
fig.update_layout(
    title="Denver NOAA Weather Dashboard (V1)",
    height=800,
    template="plotly_dark",
    hovermode="x unified"
)

# ---------------------------
# OUTPUT
# ---------------------------
output_file = "dashboard.html"
fig.write_html(output_file)

print(f"Saved {output_file}")
