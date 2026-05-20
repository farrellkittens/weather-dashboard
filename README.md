# NWS Weather Dashboard

A single-page weather dashboard that pulls hourly forecast data from the [NOAA/NWS public API](https://api.weather.gov) and renders it as an interactive chart. No server, no API key — just open the HTML file in a browser (or visit the Vercel deployment).

## Features

- Hourly forecast chart for any US location (enter lat/lon coordinates)
- Panels: Temperature / Wind Chill / Dewpoint, Sky Cover / Humidity / PoP, Wind Speed & Gusts, Rain, Thunderstorm, and Snow probability
- Dark theme with a hover tooltip showing values at each hour
- Scrollable 60-hour window across a 7-day forecast

## How to use

1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge), or run `npm run dev` to serve locally.
2. Enter coordinates in the **Coordinates** field (default is Denver, CO).
3. Click **Load** to fetch the forecast.
4. Use the **Start** dropdown + **Go** to jump to a different starting hour.

> **Note:** The NWS API only covers US locations.

## Project structure

```
index.html     # App shell — HTML layout and script/style links
style.css      # All styles (dark theme)
app.js         # All JavaScript — data fetching, chart rendering
vercel.json    # Vercel deployment config
package.json   # Dev script: npm run dev (uses npx serve)
```

## Local development

```bash
npm run dev    # Starts a local server via npx serve
```

Then open `http://localhost:3000` (or whatever port `serve` reports).

## Data source

All forecast data comes from [api.weather.gov](https://api.weather.gov), the free public API provided by NOAA's National Weather Service. No account or API key is required.
