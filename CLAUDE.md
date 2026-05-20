# Weather Dashboard — Claude Context

## What this project is

A single HTML file weather dashboard (`nws-forecast-v6.html`) that fetches hourly forecast data from the free NOAA/NWS public API and renders it as an interactive canvas chart. No build tools, no dependencies, no server — everything is self-contained in one file.

## Architecture

The entire app lives in `nws-forecast-v6.html`:

- **HTML** — minimal layout: header, controls bar, canvas element, tooltip div, footer
- **CSS** — dark-themed, all inline in `<style>`
- **JavaScript** — all inline in `<script>`, structured into clear sections:
  - `LAYOUT` constants — canvas sizing, scaling, hour window
  - `THEME` (`C`) — color palette
  - `PANELS` array — defines each chart row (temp, sky, wind, rain, thunder, snow)
  - `STATE` — `ALL_DATA` (full 168-hr fetch), `D` (60-hr window slice), `startIdx`
  - `HELPERS` — unit converters, NWS duration parser, `expand()` for interval data
  - `loadForecast()` — fetches NWS API, parses, populates `ALL_DATA`
  - `draw()` — renders everything to the canvas using the Canvas 2D API

## Key things to know

- **No build step.** Edit the file, refresh the browser. That's it.
- **All layout is driven by the `SCALE` constant** near the top of the script. Changing it resizes everything proportionally.
- **`expand()`** converts NWS interval-format data (e.g., "value valid for 3 hours") into one entry per hour.
- **The canvas is redrawn from scratch** on every `draw()` call — there is no retained state in the canvas.
- **CORS:** The NWS API allows browser requests directly. No proxy needed.

## How to test changes

Open `nws-forecast-v6.html` in a browser. The app auto-loads on open (default coords: Denver, CO). Any US lat/lon can be entered in the controls bar.

## Owner context

- The owner is not a software engineer — keep explanations accessible.
- The project was originally built with ChatGPT and is now being maintained/extended with Claude Code.
- Prefer small, focused changes over large rewrites.
