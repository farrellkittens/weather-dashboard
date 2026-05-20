# NWS Weather Dashboard

A single-page weather dashboard that pulls hourly forecast data from the [NOAA/NWS public API](https://api.weather.gov) and renders it as an interactive chart. No server, no API key — just open the HTML file in a browser.

## Features

- Hourly forecast chart for any US location (enter lat/lon coordinates)
- Panels: Temperature / Wind Chill / Dewpoint, Sky Cover / Humidity / PoP, Wind Speed & Gusts, Rain, Thunderstorm, and Snow probability
- Dark theme with a hover tooltip showing values at each hour
- Scrollable 60-hour window across a 7-day forecast

## How to use

1. Open `nws-forecast-v6.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
2. Enter coordinates in the **Coordinates** field (default is Denver, CO).
3. Click **Load** to fetch the forecast.
4. Use the **Start** dropdown + **Go** to jump to a different starting hour.

> **Note:** The NWS API only covers US locations.

## Project structure

```
nws-forecast-v6.html   # The entire app — HTML, CSS, and JavaScript in one file
```

## Data source

All forecast data comes from [api.weather.gov](https://api.weather.gov), the free public API provided by NOAA's National Weather Service. No account or API key is required.
