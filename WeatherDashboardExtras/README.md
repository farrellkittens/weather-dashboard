# WeatherDashboardExtras handoff

This folder is a reorganized staging area for ideas from the original Python/Plotly weather dashboard. Treat it as reference material for the public Vercel site, not as a second deployable app.

## Recommended integration target

The useful work is in `fuel-planning-prototype/`. It should inform the existing `roadtrip.html` / `roadtrip.js` public page rather than replacing it. The live site already has a better browser-native route workflow, OSRM route loading, stop ordering, map rendering, shared location handling, and Vercel-compatible static frontend architecture.

## Folder map

### `fuel-planning-prototype/`

Reusable prototype for trip fuel planning.

- `trip_fuel.py`: core fuel stop planning model and algorithm. This is the strongest candidate for porting to JavaScript or adapting into a Vercel serverless API.
- `providers/route_providers.py`: Python route-provider adapters and route geometry helpers. Mine the provider interface and `geometry_with_cumulative_miles`; do not replace the current OSRM browser route flow without a deliberate design choice.
- `providers/fuel_price_providers.py`: Python fuel price provider adapters. `MockFuelPriceProvider` and the station schema are immediately useful. `BarchartFuelPriceProvider` is a possible future paid/API-backed source. `HereFuelPriceProvider` is only a placeholder.
- `fixtures/trips/stanley_2026.json`: sample route, waypoints, vehicle, range policy, and fuel price data for offline implementation/testing.
- `tests/test_trip_fuel.py`: focused tests for range math, stop feasibility, cheapest-stop scoring, stale/average warning labels, and route geometry mileage.

### `legacy-weather-prototypes/`

Older Python dashboard iterations. These are worse versions of the current public weather UI and should not be merged directly.

Useful to mine:

- NOAA hourly fetch/parsing ideas.
- Plotly layout experiments.
- Trip fuel rendering concepts from `weatherdashboard_v4_2_trip_fuel_render.py`.

Avoid:

- Replacing the current canvas weather graph.
- Reintroducing Streamlit/server-rendered dashboard patterns.
- Copying old styling or tab/page layout.

### `exported-html-reference/`

Static HTML exports from older prototype runs. Use only as visual/reference snapshots. They are not source of truth and should not be deployed.

### `local-generated-do-not-merge/`

Machine-local artifacts moved out of the way so another agent can ignore them.

- Python virtual environment.
- Python bytecode caches.
- Nested Git metadata from the imported folder.
- macOS/iCloud metadata.

These files should stay untracked and can be deleted once the user is comfortable that no local-only state is needed.

## Suggested next-agent tasks

1. Port `fuel-planning-prototype/trip_fuel.py` into browser-safe JavaScript or a Vercel API module.
2. Add vehicle/range controls to the existing `roadtrip.html` page.
3. Feed the current roadtrip route distance/geometry into the fuel planner.
4. Start with `fixtures/trips/stanley_2026.json` as offline data before wiring a real fuel-price provider.
5. Add frontend tests or fixture-based smoke tests around impossible gaps, stop scoring, stale prices, and average-price warnings.

