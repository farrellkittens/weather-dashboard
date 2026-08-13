# NWS Weather Dashboard

A static weather and outdoor conditions dashboard with camping, forecast, roadtrip, summit, and surf/dive views. No server, no API key — just open the HTML files in a browser (or visit the Vercel deployment).

## Features

- Hourly forecast chart for any US location (enter lat/lon coordinates)
- Panels: Temperature / Wind Chill / Dewpoint, Sky Cover / Humidity / PoP, Wind Speed & Gusts, Rain, Thunderstorm, and Snow probability
- Dark theme with a hover tooltip showing values at each hour
- Edge-to-edge hourly timeline with 14 days of history and a 7-day forecast
- Summit Weather Rose view for Longs Peak, sampling NWS forecast grids 1, 5, 10, and 20 miles from the summit in 16 directions for temperature, wind, precipitation, sky cover, and thunderstorm signal
- Roadtrip Weather view that routes between a start and destination with optional stops, then shows nearest city/state and five-day high/low forecasts at the endpoints and each 100-mile marker
- Camping Conditions view with county-first fire restriction resources, USFS fire restriction data where available, and a short temperature forecast
- Dispersed Camping map view with draft dispersed-camping road traces, seasonal filters, review-status styling, and CalTopo-friendly exports
- SUP/Float view with Colorado and Oregon paddleboard, river-tubing, and fishing location directories, access links, seven-day weather, and current-week river gauge charts
- Diving Conditions view with Oahu dive-site presets, marine/weather/air-quality data, and NOAA tide predictions

## How to use

1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge), or run `npm run dev` to serve locally.
2. Use the page tabs to switch between camping, hourly forecast, roadtrip, summit weather rose, and diving conditions.
3. Enter coordinates or choose a preset/location for the page you are using.
4. Click **Load** to fetch the forecast.
5. On the hourly page, use the **Start** dropdown + **Go** to jump to a different starting hour.

> **Note:** The NWS API only covers US locations.

## Project structure

```
index.html     # App shell — HTML layout and script/style links
style.css      # All styles (dark theme)
app.js         # All JavaScript — data fetching, chart rendering
roadtrip.html  # Roadtrip Weather view
roadtrip.css   # Roadtrip Weather styling
roadtrip.js    # OSRM routing with optional stops, 100-mile route sampling, nearest-place lookup, and five-day Open-Meteo forecasts
camping.html   # Camping Conditions view
camping.css    # Camping Conditions styling
camping.js     # Camping weather, county-first fire resources, and USFS restriction checks
dispersed.html # Dispersed Camping map view
dispersed.css  # Dispersed Camping map styling
dispersed.js   # Clean map, draft road traces, filters, popups, and exports
data/dispersed # Editable GeoJSON draft/review datasets for dispersed-camping road segments
assets/dispersed # Local MVUM KMZ source assets used for reference/review
water.html     # Paddleboard, tube-float, and fishing directory
water.css      # SUP/Float view styling
water.js       # Water location data, access links, filters, and forecast
peaks.html     # Summit Weather Rose view
peaks.css      # Summit Weather Rose styling
peaks.js       # Summit rose sampling, NWS fetches, legends, and canvas rendering
api/nws-cache.js # Vercel API route for restricted NWS proxy caching via Upstash Redis
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

Hourly forecast and summit data comes from [api.weather.gov](https://api.weather.gov), the free public API provided by NOAA's National Weather Service. The hourly graph prepends 14 days of Open-Meteo historical model data. Roadtrip uses Photon for place and stop lookup, OSRM for routing, NWS/Photon for nearest city labels, and Open-Meteo for five-day high/low forecasts at route samples. Camping uses Open-Meteo for temperature, the FCC Census area API for county lookup, official county/state/federal resource links, and USDA Forest Service fire restriction data where available. SUP/Float uses USGS instantaneous values and NOAA NWPS stageflow data for river gauge height and discharge. Diving conditions use Open-Meteo marine, weather, and air-quality APIs plus NOAA CO-OPS tide predictions. No account or API key is required.

`peaks.html` can use `/api/nws-cache` as a restricted Vercel proxy for NWS `points` and `gridpoints` requests. The route uses `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` when available, and the page falls back to direct NWS calls if the proxy is unavailable.
