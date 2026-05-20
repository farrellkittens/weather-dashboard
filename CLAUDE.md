# Weather Dashboard — Claude Context

## What this project is

A weather dashboard that fetches hourly forecast data from the free NOAA/NWS public API and renders it as an interactive canvas chart. Deployed on Vercel. No build tools, no dependencies beyond a local dev server for testing.

## Architecture

The app is split across three files:

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

## Key things to know

- **No build step.** Edit the files, refresh the browser. Use `npm run dev` to serve locally (required for some browsers that block file:// fetches).
- **All layout is driven by the `SCALE` constant** near the top of `app.js`. Changing it resizes everything proportionally.
- **`expand()`** converts NWS interval-format data (e.g., "value valid for 3 hours") into one entry per hour.
- **The canvas is redrawn from scratch** on every `draw()` call — there is no retained state in the canvas.
- **CORS:** The NWS API allows browser requests directly. No proxy needed.

## How to test changes

Run `npm run dev` and open the local URL in a browser. The app auto-loads on open (default coords: Denver, CO). Any US lat/lon can be entered in the controls bar.

## Owner context

- The owner is not a software engineer — keep explanations accessible.
- The project was originally built with ChatGPT and is now being maintained/extended with Claude Code.
- Prefer small, focused changes over large rewrites.

## Keeping docs up to date

**Agents must update `README.md` and `CLAUDE.md` whenever they make changes that affect project structure, architecture, file layout, or how to run/test the app.** Do not leave these files describing a state that no longer exists.
