# Weather Dashboard — Improvement Suggestions

A review of the current codebase (May 2026). Suggestions are grouped by category and roughly ordered by impact.

---

## Activity Roadmap Ideas

### Shared Features

- Activity readiness score: Good / Caution / Poor based on the hazards that matter for that activity.
- Best time window: highlights the safest or most comfortable hours in the next 24-72 hours.
- Hazard timeline: wind, storms, precipitation, temperature, UV, smoke, and lightning shown hour by hour.
- "What changed?" callout: notable forecast changes since the last check.
- Gear prompts: simple reminders like rain shell, extra water, sun protection, dry bag, insulated layers.
- Microclimate notes: elevation, shade exposure, canyon/valley wind, water temperature, snowpack, or coastal effects.
- Alert stack: NWS alerts, red flag warnings, flood watches, small craft advisories, avalanche advisories where relevant.
- Confidence indicator: forecast confidence for the user's location and time window.

### Camping

- Overnight comfort index: low temp, dew point, wind chill, humidity, and rain chance.
- Tent risk: wind gusts, storm timing, heavy rain, hail, lightning, and flood risk.
- Fire conditions: red flag warnings, wind, humidity, burn bans if available.
- Bug pressure estimate: temperature, humidity, standing water, wind, sunset timing.
- Smoke and air quality: PM2.5, wildfire smoke, visibility.
- Sunrise/sunset and moonlight: useful for setup, cooking, and nighttime visibility.
- Ground conditions: recent rain, snowmelt, mud potential, freezing overnight temps.
- Nearby shelter decision: storm arrival countdown and "break camp by" suggestions.

### Climbing

- Crag condition score: precipitation history, current humidity, sun exposure, wind, and rock drying estimate.
- Lightning risk timeline: especially for exposed routes, alpine climbs, and ridgelines.
- Wind at elevation: sustained wind and gusts, with a "belay comfort" or "exposure" warning.
- Heat/cold stress: wall aspect, sun angle, apparent temperature, freeze risk.
- Rock type drying guidance: sandstone should be flagged after rain or snowmelt.
- Approach hazards: snow, mud, stream crossings, avalanche terrain, icy trails.
- Visibility and cloud ceiling: useful for alpine, multipitch, and route finding.
- Best wall aspect by time: sunny/shady recommendations based on season and temperature.

### Diving

- Marine forecast summary: wind, swell height, swell period, chop, tide, and current.
- Diveability score: combines visibility, wave energy, wind direction, tide/current, storms, and water temp.
- Tide/current windows: slack tide, current strength, and unsafe current periods.
- Surface conditions: boat entry/exit difficulty, shore break, surge, and small craft advisories.
- Water temperature and exposure guidance: wetsuit/drysuit suggestions.
- Visibility estimate: recent wind, swell, runoff, rain, tides, and local reports if available.
- Thunderstorm and lightning risk: surface interval and boat safety.
- Air quality/smoke: relevant for strenuous shore entries or boat days.

### Hiking

- Trail comfort score: apparent temperature, wind, precipitation, UV, and smoke.
- Elevation-aware forecast: trailhead vs summit temps, wind, snow, and storm timing.
- Turnaround-time planner: shows when storms, heat, darkness, or wind become risky.
- Lightning exposure risk: ridges, summits, above-treeline zones.
- Heat illness risk: wet bulb globe temp if available, shade, humidity, water needs estimate.
- Cold exposure risk: wind chill, rain plus cold, overnight survival risk.
- Trail surface estimate: mud, ice, snow, postholing, stream crossings.
- Daylight planner: sunrise, sunset, civil twilight, moon phase.

### Water Sports

For paddleboarding, boating, rafting, and floating, split the page into flatwater, river, and open-water modes.

#### Paddleboarding

- Wind direction and gusts: especially offshore wind warnings.
- Flatwater window: calmest hours with gust thresholds.
- Thunderstorm risk: fast "get off water by" timing.
- Water temperature: cold shock risk, PFD reminder.
- UV and heat: reflection off water makes this more important.
- Launch/return difficulty: wind shift and gust trend.

#### Boating

- Small craft advisory and marine alerts.
- Wind, gusts, wave height, swell period, chop, and visibility.
- Storm arrival radar-style timeline.
- Docking difficulty: crosswind/gust estimate.
- Fuel/range safety: headwind and return-trip warning.
- Fog and low visibility risk.
- Lightning, waterspout, and severe weather alerts where relevant.

#### Rafting

- River flow: CFS, gauge height, trend, and percentile for season.
- Rapid difficulty adjustment: too low, ideal, pushy, dangerous.
- Water temperature and hypothermia risk.
- Flood risk: upstream rain, snowmelt, dam releases if available.
- Thunderstorm timing in canyon sections.
- Wind funneling in canyons.
- Put-in/take-out road weather.

#### Floating

- Comfort float score: temp, sun, wind, water temp, and storm chance.
- River speed estimate: flow-based trip duration.
- Exit-by time: storms, sunset, cold, or wind shift.
- Heat and dehydration risk.
- Water quality advisories if available.
- Flash flood risk for narrow rivers/canyons.
- Alcohol-risk nudge only if the tone fits the app: subtle safety message, not preachy.

### Feature Concepts to Prioritize First

1. Activity-specific go/no-go score.
2. Best time window by activity.
3. Hourly hazard timeline.
4. Elevation or water-condition adjustments.
5. Alerts and "get out by" timing.
6. Gear and safety prompts.

A useful pattern: each activity page has the same core layout, but the scoring inputs and hazard thresholds change. That keeps the product coherent while making each page feel genuinely tailored.

---

## Hosting and API Scale Watchlist

The app is currently a static frontend on Vercel. Vercel serves HTML/CSS/JS/data files, then each user's browser calls public weather/geocoding/fire/tide APIs directly. That keeps hosting simple and cheap, but it means API usage is not centrally counted unless future requests move through a shared backend/cache.

### What to Watch

- **Vercel Edge Requests:** static assets count as CDN/edge requests. A typical page load may request several files, so this can become the first Vercel limit before raw bandwidth does.
- **Vercel bandwidth:** most pages are small, but large data files can dominate bandwidth if deployed and downloaded by users or bots.
- **Open-Meteo free limits:** current free non-commercial guidance is around 10,000 calls/day, 5,000 calls/hour, and 600 calls/minute. If the app becomes commercial, popular, or monetized, plan for a paid/commercial arrangement.
- **NWS API usage:** NWS is free and browser requests are generally reasonable, but it still has practical rate limits and expects cache-friendly behavior.
- **Autocomplete/geocoding:** search-as-you-type can create many requests per user. Debouncing helps, but autocomplete can still become a high-call feature at scale.
- **Bots and crawlers:** repeated downloads of large static files or page assets can consume Vercel usage without representing real users.

### Rough Traffic Thresholds

- **Personal/hobby use:** current static setup is fine.
- **Hundreds of daily users:** still likely fine, especially with browser-side caching and rounded coordinates.
- **1,000-2,000 daily active users:** start watching Open-Meteo autocomplete/weather calls, Vercel edge requests, and bot traffic.
- **3,000-5,000 daily active users:** strongly consider a shared cache/proxy for weather calls and basic usage metrics.
- **5,000-10,000+ daily active users:** expect to think seriously about paid API terms, Vercel Pro, centralized caching, and alerts.

These thresholds are approximate because users may load one page once, or they may search multiple locations and switch between several activity pages.

### Recommended Future Setup

1. Add `.vercelignore` or a deploy-only public folder so unused generated files, especially large CSVs, are not hosted.
2. Keep request coordinates standardized: about 3 decimals for location-specific forecasts and 2 decimals for surrounding sample grids.
3. Add a shared backend/cache before traffic gets large:
   - Browser calls `/api/weather?...`.
   - Server normalizes coordinates and request type.
   - Server checks shared cache first.
   - If fresh, return cached data.
   - If stale/missing, call Open-Meteo/NWS once, cache it, then return it.
4. Suggested shared-cache TTLs:
   - Geocoding: 7-30 days.
   - NWS point/grid mapping: 7-14 days.
   - Hourly/current weather: 15-60 minutes.
   - Camping temperature forecast: 1-3 hours.
   - Fire restriction data/resources: 12-24 hours.
5. Add server-side counters once a proxy exists:
   - API calls by provider and endpoint.
   - Cache hits vs misses.
   - Failed/rate-limited responses.
   - Page/activity type if useful.
6. Add email alerts for practical thresholds:
   - Open-Meteo calls exceed 5,000/day.
   - Cache miss rate exceeds 30%.
   - Vercel bandwidth exceeds 70 GB/month.
   - Vercel edge requests exceed 700k/month.
   - External API failures spike.

### Why a Shared Cache Matters

Browser `localStorage` only helps one returning user. It does not help two different people asking for Denver, Longs Peak, or the same dive site. A shared cache would let many users receive the same recent data for common locations instead of each browser making duplicate API calls.

### Alerting Notes

- Vercel can provide dashboard usage and account/project notifications.
- Direct browser-to-API calls are hard to count accurately from the app alone.
- Real API usage alerts require routing requests through a backend/proxy or using a paid API/provider dashboard.
- Email alerts could be added with a small scheduled check or triggered inside the proxy when thresholds are crossed.

---

## User-Facing

### High Impact

**1. City / ZIP code search**
Right now users must know and type exact lat/lon coordinates — that's real friction. A geocoding lookup (e.g., via the free [Nominatim API](https://nominatim.openstreetmap.org/)) would let users type "Denver, CO" or a ZIP code and have coordinates resolved automatically. The NWS `/points` endpoint already returns a city/state label on success, so the round-trip to confirm the location is already there.

**2. Shareable / bookmarkable URLs**
There's no way to share a specific location. Adding lat/lon to the URL as query parameters (e.g., `?lat=39.74&lon=-104.97`) on load would let users bookmark their location and share a direct link. Reading params on page load and pre-filling the coords input would complete the feature.

**3. Heat index in the temperature panel**
Wind chill is shown for cold weather, but the NWS API also provides `heatIndex` values for warm weather. Adding it as a fourth line (orange, dashed) to the temperature panel would make the chart more useful in summer months. It naturally mirrors the wind chill line — both represent "feels like" in opposite seasons.

**4. Data freshness indicator**
The forecast is fetched once on page load, with no indication of when that happened. A small "Updated: 3:42 PM" timestamp in the controls bar (or near the location label) would let users know if the data is stale and prompt a manual refresh. Bonus: a subtle auto-refresh every 30–60 minutes.

**5. Panel visibility toggles**
Someone in Phoenix doesn't need the Snow panel; someone in a mild climate may not care about thunderstorms. Small toggle buttons per-panel (or a settings popover) to show/hide rows would let users focus on what matters to them. The PANELS array already makes this straightforward to implement.

### Medium Impact

**6. Mobile layout**
The canvas width is fixed at `LEFT + BUFFER*HW + 60*HW + RIGHT` (~960px at current scale), so it scrolls horizontally on narrow screens. This works, but on a phone it's awkward. A smaller default `SCALE` on narrow viewports (detecting `window.innerWidth` on load) would produce a chart that fits without scrolling, or at least scrolls much less.

**7. Keyboard navigation**
There's no keyboard shortcut to scroll the 60-hour window. Left/right arrow keys shifting `startIdx` by 3–6 hours would make it much faster to scan through the forecast without reaching for the dropdown.

**8. "Save as image" button**
`canvas.toDataURL('image/png')` gives a PNG of the current chart in one line. A small download button would let users save or share the chart easily — useful for pasting into a group chat to discuss weekend weather.

**9. Hover crosshair highlight**
When hovering, a subtle vertical highlight bar (semi-transparent, full canvas height) over the hovered hour column would make it much clearer which hour the tooltip refers to, especially when panels are far apart vertically.

### Lower Impact

**10. "Now" indicator label**
The yellow dashed vertical line marks the current time but has no label. A small "Now" text just above or below the line would make it immediately obvious to new users what it represents.

**11. Timezone note**
The footer says "times shown in local browser timezone," but this only matches the forecast location if the user is in the same timezone. Someone in New York looking at Seattle weather will see Seattle times shifted. A note like "Times in your local timezone (ET) — location is PT" would prevent confusion.

**12. Tooltip on mobile / touch**
`onmousemove` doesn't fire on touch devices. A `touchmove` handler that maps touch coordinates to the same tooltip logic would make the chart interactive on phones and tablets.

---

## Technical

### Code Quality

**13. `DAYS` and `MONS` arrays defined three times**
The `['Sun','Mon','Tue',...]` and `['Jan','Feb',...]` arrays are copy-pasted into `buildStartDropdown`, `drawDateStrip`, and `bindHover`. They should be top-level `const` declarations, defined once.

**14. `snow` / `snowfall` key duplication**
In `ALL_DATA`, both `snow` and `snowfall` are set to the same value (`snw[i]?.value`). The `snow` key is referenced only in the tooltip `keyLines` map where it duplicates `snowfall`. One of them should be removed; the panel config uses `snowfall` so `snow` is the dead key.

**15. DOM references looked up on every draw**
`document.getElementById('c')` and `document.getElementById('tip')` are called inside `draw()` and `bindHover()` on every redraw. These should be cached once at startup (e.g., at the bottom of the file alongside `loadForecast()`).

**16. Inline `onclick` attributes**
`index.html` has `onclick="loadForecast()"` and `onclick="applyStart()"`. These couple HTML to specific global function names and are harder to find when refactoring. Moving to `addEventListener` calls in `app.js` (alongside the existing resize listener) would keep event logic in one place.

**17. Magic number `3.6e6` used in multiple places**
The milliseconds-per-hour constant (`3.6e6`) appears at least 4 times. A named constant like `const MS_PER_HOUR = 3_600_000` at the top of the layout section would make the arithmetic clearer.

### Robustness

**18. No fetch abort / race condition**
If the user clicks "Load" twice quickly, two fetches run concurrently. Whichever resolves second wins and overwrites state, which could be the stale one. Wrapping each fetch in an `AbortController` and aborting the previous request on each new load call would prevent this.

**19. Undifferentiated error handling**
The `catch(e)` block shows `"Error: " + e.message` for everything — network failure, a non-US location returning a 404, malformed JSON, or a missing data property all look the same. Distinguishing these cases (e.g., checking `pt.status === 404` to show "Location not found — NWS only covers US coordinates") would make the app much easier to use when something goes wrong.

**20. `expand()` builds then slices**
`expand()` pushes every expanded hour into `out` and then calls `.slice(0, n)` at the end. For the 168-hour case this means potentially expanding a multi-day interval fully before discarding the excess. A simple `if (out.length >= n) break;` inside the outer loop would short-circuit early with no behavior change.

### Infrastructure

**21. `localStorage` caching**
Every page load hits the NWS API twice (points + gridpoints). Caching the parsed `ALL_DATA` in `localStorage` with a timestamp, and skipping the fetch if the data is < 30 minutes old for the same coordinates, would speed up repeat visits and reduce unnecessary API load.

**22. Content Security Policy in `vercel.json`**
`vercel.json` currently only sets `outputDirectory`. Adding a `headers` block with a `Content-Security-Policy` (restricting `connect-src` to `api.weather.gov` and `script-src` to `'self'` plus the Vercel Analytics domain) would be a small hardening win with no visible user impact.

**23. `<meta name="description">` and favicon**
`index.html` has no description meta tag and no favicon. These don't affect functionality but improve how the page appears when shared (link unfurls in Slack, Discord, iMessage) and as a browser tab.

**24. Resize handler doesn't account for pixel ratio changes**
The `window.resize` handler redraws the canvas, but `SCALE` is fixed so the chart dimensions don't actually change with window size. The handler is only useful if `window.devicePixelRatio` changes (moving between displays). It's harmless but adds a redraw on every window resize that changes nothing — could be removed or made conditional on an actual canvas size change.
