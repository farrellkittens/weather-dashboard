# NWS Weather Dashboard

A single-page weather dashboard that pulls hourly forecast data from the [NOAA/NWS public API](https://api.weather.gov) and renders it as an interactive chart. No server, no API key — just open the HTML file in a browser (or visit the Vercel deployment).

## Features

- Hourly forecast chart for any US location (enter lat/lon coordinates)
- Panels: Temperature / Wind Chill / Dewpoint, Sky Cover / Humidity / PoP, Wind Speed & Gusts, Rain, Thunderstorm, and Snow probability
- Dark theme with a hover tooltip showing values at each hour
- Scrollable 60-hour window across a 7-day forecast
- Summit Weather Rose view for Longs Peak, sampling NWS forecast grids 1, 5, 10, and 20 miles from the summit in 16 directions for temperature, wind, precipitation, sky cover, and thunderstorm signal
- Diving Conditions view with Oahu dive-site presets, marine/weather/air-quality data, and NOAA tide predictions

## How to use

1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge), or run `npm run dev` to serve locally.
2. Use the page tabs to switch between hourly forecast, summit weather rose, and diving conditions.
3. Enter coordinates or choose a preset/location for the page you are using.
4. Click **Load** to fetch the forecast.
5. On the hourly page, use the **Start** dropdown + **Go** to jump to a different starting hour.

> **Note:** The NWS API only covers US locations.

## Project structure

```
index.html     # App shell — HTML layout and script/style links
style.css      # All styles (dark theme)
app.js         # All JavaScript — data fetching, chart rendering
peaks.html     # Summit Weather Rose view
peaks.css      # Summit Weather Rose styling
peaks.js       # Summit rose sampling, NWS fetches, legends, and canvas rendering
diving.html    # Diving Conditions view
diving.css     # Diving Conditions styling
diving.js      # Oahu dive presets, marine/weather/air/tide fetching, and condition summaries
vercel.json    # Vercel deployment config
package.json   # Dev script: npm run dev (uses npx serve)
```

## Local development

```bash
npm run dev    # Starts a local server via npx serve
```

Then open `http://localhost:3000` (or whatever port `serve` reports).

## Data sources

Hourly and summit forecast data comes from [api.weather.gov](https://api.weather.gov), the free public API provided by NOAA's National Weather Service. Diving conditions use Open-Meteo marine, weather, and air-quality APIs plus NOAA CO-OPS tide predictions. No account or API key is required.
