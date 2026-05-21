# Weather Dashboard — Improvement Suggestions

A review of the current codebase (May 2026). Suggestions are grouped by category and roughly ordered by impact.

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
