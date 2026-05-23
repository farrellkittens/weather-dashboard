# Weather Dashboard — Claude Context

## What this project is

A weather dashboard with four static frontend views: Camping Conditions, an hourly NOAA/NWS forecast chart, a Summit Weather Rose page, and a Diving Conditions page for Oahu dive sites. Deployed on Vercel. No build tools, no dependencies beyond a local dev server for testing.

## Architecture

The main hourly forecast view is split across three files:

- **`index.html`** — minimal layout: header, controls bar, canvas element, tooltip div, footer. Links to `style.css` and `app.js`. Also includes the Vercel Analytics script tag.
- **`style.css`** — all styles, dark-themed.
- **`app.js`** — all JavaScript, structured into clear sections:
  - `LAYOUT` constants — canvas sizing, scaling, hour window
  - `THEME` (`C`) — color palette
  - `PANELS` array — defines each chart row (temp, sky, wind, rain, thunder, snow)
  - `STATE` — `ALL_DATA` (full 168-hr fetch), `D` (60-hr window slice), `startIdx`
  - `HELPERS` — unit converters, NWS duration parser, `expand()` for interval data
  - `loadForecast()` — fetches NWS API, parses, populates `ALL_DATA`
  - `draw()` — renders everything to the canvas using the Canvas 2D API

Supporting files:
- **`vercel.json`** — Vercel deployment config (`outputDirectory: "."`)
- **`package.json`** — defines `npm run dev` (uses `npx serve .`)
- **`camping.html` / `camping.css` / `camping.js`** — Camping Conditions view. It looks up the selected point's county with the FCC Census area API, shows county-first fire restriction verification language and resources, checks the USFS fire restriction ArcGIS layer where available, and renders a short Open-Meteo temperature forecast.
- **`peaks.html` / `peaks.css` / `peaks.js`** — Summit Weather Rose view linked from the shared page tabs. It samples NWS hourly forecast grids around a selected peak, city, or coordinates at 1, 5, 10, and 20 miles in 16 compass directions, then renders temperature, wind, precip probability, sky cover, and thunderstorm roses with shared legends and explainer samples. Initial load uses generic local placeholder roses until a location is selected.
- **`peaks-test.html` / `peaks-test.js`** — Experimental Summit Weather Rose test page. It reuses `peaks.css`, samples 8 compass directions, and progressively renders from summit data outward through the distance rings.
- **`diving.html` / `diving.css` / `diving.js`** — Diving Conditions view linked from the shared page tabs. It includes alphabetized Oahu dive-site presets, city/coordinate lookup, Open-Meteo marine/weather/air-quality calls, NOAA CO-OPS tide predictions, and summary cards for visibility and risk signals.

## Key things to know

- **No build step.** Edit the files, refresh the browser. Use `npm run dev` to serve locally (required for some browsers that block file:// fetches).
- **All layout is driven by the `SCALE` constant** near the top of `app.js`. Changing it resizes everything proportionally.
- **`expand()`** converts NWS interval-format data (e.g., "value valid for 3 hours") into one entry per hour.
- **The canvas is redrawn from scratch** on every `draw()` call — there is no retained state in the canvas.
- **CORS:** The NWS, Open-Meteo, FCC Census area, and current ArcGIS REST services used here allow browser requests directly. No proxy needed.

## How to test changes

Run `npm run dev` and open the local URL in a browser. The camping page starts empty until a location is selected. The hourly page auto-loads on open (default coords: Denver, CO). The summit page starts with generic placeholder roses until a location is selected. The diving page auto-loads the first Oahu preset.

## Owner context

- The owner is not a software engineer — keep explanations accessible.
- The project was originally built with ChatGPT and is now being maintained/extended with Claude Code.
- Prefer small, focused changes over large rewrites.

## Keeping docs up to date

**Agents must update `README.md` and `CLAUDE.md` whenever they make changes that affect project structure, architecture, file layout, or how to run/test the app.** Do not leave these files describing a state that no longer exists.
