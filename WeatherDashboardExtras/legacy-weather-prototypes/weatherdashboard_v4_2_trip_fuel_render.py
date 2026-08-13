import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

from fuel_price_providers import MockFuelPriceProvider
from route_providers import MockRouteProvider
from trip_fuel import RangePolicy, Vehicle, plan_fuel_stops

VERSION = "v5.1 NOAA + trip fuel planner"
LAT = 39.7418655
LON = -104.97594
HEADERS = {"User-Agent": "noaa-replica-dashboard/1.0"}
TRIP_FIXTURE = Path("data/trips/stanley_2026.json")


def parse_wind_mph(value):
    if not value:
        return None
    try:
        return float(str(value).split()[0])
    except (TypeError, ValueError):
        return None


def calc_wind_chill(t, w):
    if t is None or w is None:
        return None
    if t > 50 or w <= 3:
        return t
    return (
        35.74
        + 0.6215 * t
        - 35.75 * (w ** 0.16)
        + 0.4275 * t * (w ** 0.16)
    )


def parse_noaa_time(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def build_weather_rows():
    print("Fetching NOAA forecastHourly data...")
    point = requests.get(
        f"https://api.weather.gov/points/{LAT},{LON}",
        headers=HEADERS,
        timeout=30
    ).json()
    hourly_url = point["properties"]["forecastHourly"]
    forecast = requests.get(hourly_url, headers=HEADERS, timeout=30).json()
    periods = forecast["properties"]["periods"]

    rows = [{
        "time": parse_noaa_time(p["startTime"]),
        "temp": p["temperature"],
        "wind": parse_wind_mph(p.get("windSpeed")),
        "gust": parse_wind_mph(p.get("windGust")),
        "humidity": p.get("relativeHumidity", {}).get("value"),
        "precip": p.get("probabilityOfPrecipitation", {}).get("value"),
        "sky": p.get("skyCover"),
    } for p in periods]
    rows = sorted(rows, key=lambda row: row["time"])[:48]
    for row in rows:
        row["windChill"] = calc_wind_chill(row["temp"], row["wind"])

    times = [row["time"] for row in rows]

    for row in rows:
        row["time"] = row["time"].isoformat()
    return rows


def load_trip_fixture():
    with TRIP_FIXTURE.open() as fh:
        return json.load(fh)


def build_fuel_map_payload(route, stations, plan):
    route_points = sorted(route["geometry"], key=lambda point: point["mile"])
    stop_ids = {stop.station.id for stop in plan.stops}
    planned = [station for station in stations if station["id"] in stop_ids]
    candidates = [station for station in stations if station["id"] not in stop_ids]
    return {
        "route_points": route_points,
        "planned": planned,
        "candidates": candidates
    }


def render_trip_summary(plan):
    warning_labels = sorted({warning for warning in plan.warnings})
    warnings_html = "".join(
        f'<span class="badge">{warning}</span>'
        for warning in warning_labels
    ) or '<span class="badge quiet">fixture prices</span>'
    return f"""
        <div class="metric"><span>Total route</span><strong>{plan.total_route_miles:,.0f} mi</strong></div>
        <div class="metric"><span>Fuel needed</span><strong>{plan.total_gallons_needed:,.1f} gal</strong></div>
        <div class="metric"><span>Estimated fuel cost</span><strong>${plan.estimated_total_cost:,.0f}</strong></div>
        <div class="metric"><span>Fuel stops</span><strong>{len(plan.stops)}</strong></div>
        <div class="badge-row">{warnings_html}</div>
    """


def render_stop_rows(plan):
    rows = []
    for index, stop in enumerate(plan.stops, start=1):
        warnings = ", ".join(stop.warnings)
        if stop.forced_early_stop:
            warnings = f"{warnings}, forced early stop".strip(", ")
        price = (
            f"${stop.station.price_per_gal:.2f}"
            if stop.station.price_per_gal is not None
            else f"~${stop.effective_price_per_gal:.2f}"
        )
        rows.append(f"""
            <tr>
                <td>{index}</td>
                <td>{stop.station.name}<small>{stop.station.address}</small></td>
                <td>{stop.miles_since_fill:,.0f}</td>
                <td>{price}</td>
                <td>{stop.gallons_bought:,.1f}</td>
                <td>${stop.cost:,.0f}</td>
                <td>{warnings or "fresh station price"}</td>
            </tr>
        """)
    return "\n".join(rows)


def render_dashboard(weather_rows, fuel_map, fixture, route, stations, plan):
    weather_json = json.dumps(weather_rows)
    fuel_map_json = json.dumps(fuel_map)
    fixture_json = json.dumps(fixture)
    route_json = json.dumps(route)
    stations_json = json.dumps(stations)
    plan_json = json.dumps(plan.to_dict())
    waypoints_text = "\n".join(point["label"] for point in fixture["waypoints"])

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NOAA Weather and Road Trip Fuel Planner</title>
  <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
  <style>
    :root {{
      color-scheme: dark;
      --bg: #0b1220;
      --panel: #101827;
      --panel-2: #162033;
      --line: #2b3a55;
      --text: #e5edf7;
      --muted: #9fb0c8;
      --accent: #5eead4;
      --gold: #ffb703;
      --warn: #fb7185;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }}
    header {{
      padding: 20px clamp(16px, 4vw, 42px) 12px;
      border-bottom: 1px solid var(--line);
      background: #101827;
    }}
    h1 {{
      margin: 0 0 14px;
      font-size: clamp(1.35rem, 2.2vw, 2rem);
      letter-spacing: 0;
    }}
    .tabs {{
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }}
    .tab-button {{
      border: 1px solid var(--line);
      background: #0f172a;
      color: var(--muted);
      border-radius: 8px;
      padding: 10px 14px;
      font-weight: 700;
      cursor: pointer;
    }}
    .tab-button.active {{
      border-color: var(--accent);
      color: var(--text);
      background: #12313a;
    }}
    main {{
      padding: 20px clamp(12px, 3vw, 32px) 40px;
    }}
    .tab-panel {{ display: none; }}
    .tab-panel.active {{ display: block; }}
    .chart-surface {{
      width: 100%;
      min-height: 560px;
    }}
    #weatherChart {{
      min-height: 1200px;
    }}
    .fuel-layout {{
      display: grid;
      grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
      gap: 18px;
      align-items: start;
    }}
    .controls, .summary-band, .table-wrap {{
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 8px;
    }}
    .controls {{
      padding: 16px;
      display: grid;
      gap: 14px;
    }}
    .control-grid {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }}
    label {{
      display: grid;
      gap: 6px;
      color: var(--muted);
      font-size: 0.82rem;
      font-weight: 700;
    }}
    input, select, textarea {{
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #0b1220;
      color: var(--text);
      padding: 10px 11px;
      font: inherit;
    }}
    textarea {{
      min-height: 132px;
      resize: vertical;
      line-height: 1.35;
    }}
    .fuel-main {{
      display: grid;
      gap: 16px;
      min-width: 0;
    }}
    .summary-band {{
      padding: 14px;
      display: grid;
      grid-template-columns: repeat(4, minmax(120px, 1fr));
      gap: 12px;
    }}
    .metric {{
      display: grid;
      gap: 4px;
      padding: 10px 12px;
      border-left: 3px solid var(--accent);
      background: var(--panel-2);
      border-radius: 6px;
    }}
    .metric span {{
      color: var(--muted);
      font-size: 0.78rem;
      font-weight: 700;
    }}
    .metric strong {{
      font-size: 1.2rem;
    }}
    .badge-row {{
      grid-column: 1 / -1;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }}
    .badge {{
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      padding: 4px 9px;
      border-radius: 999px;
      background: rgba(251, 113, 133, 0.16);
      color: #fecdd3;
      border: 1px solid rgba(251, 113, 133, 0.35);
      font-size: 0.78rem;
      font-weight: 700;
    }}
    .badge.quiet {{
      background: rgba(94, 234, 212, 0.12);
      color: #99f6e4;
      border-color: rgba(94, 234, 212, 0.3);
    }}
    .table-wrap {{
      overflow-x: auto;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      min-width: 760px;
    }}
    th, td {{
      border-bottom: 1px solid var(--line);
      padding: 11px 12px;
      text-align: left;
      vertical-align: top;
    }}
    th {{
      color: var(--muted);
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0;
    }}
    td small {{
      display: block;
      color: var(--muted);
      margin-top: 3px;
    }}
    .footer-note {{
      color: var(--muted);
      font-size: 0.86rem;
      line-height: 1.45;
    }}
    @media (max-width: 920px) {{
      .fuel-layout {{
        grid-template-columns: 1fr;
      }}
      .summary-band {{
        grid-template-columns: repeat(2, minmax(120px, 1fr));
      }}
    }}
    @media (max-width: 560px) {{
      main {{
        padding-inline: 10px;
      }}
      .control-grid, .summary-band {{
        grid-template-columns: 1fr;
      }}
      .tab-button {{
        flex: 1 1 140px;
      }}
    }}
  </style>
</head>
<body>
  <header>
    <h1>Weather Dashboard</h1>
    <nav class="tabs" aria-label="Dashboard tabs">
      <button class="tab-button active" data-tab="weather">NOAA Forecast</button>
      <button class="tab-button" data-tab="fuel">Road Trip Fuel</button>
    </nav>
  </header>
  <main>
    <section class="tab-panel active" id="weather-panel">
      <div id="weatherChart" class="chart-surface"></div>
    </section>
    <section class="tab-panel" id="fuel-panel">
      <div class="fuel-layout">
        <aside class="controls">
          <div class="control-grid">
            <label>Tank gallons
              <input id="tankCapacity" type="number" min="1" step="0.1" value="{fixture['vehicle']['tank_capacity_gal']}">
            </label>
            <label>Average MPG
              <input id="avgMpg" type="number" min="1" step="0.1" value="{fixture['vehicle']['avg_mpg']}">
            </label>
            <label>Fuel grade
              <select id="fuelGrade">
                <option value="regular" selected>Regular</option>
              </select>
            </label>
            <label>Initial tank
              <input id="initialTank" type="number" min="0" max="100" step="5" value="100">
            </label>
            <label>Latest buffer
              <select id="latestBuffer">
                <option value="20">20 miles</option>
                <option value="40" selected>40 miles</option>
                <option value="60">60 miles</option>
              </select>
            </label>
            <label>Earliest preference
              <select id="earliestFraction">
                <option value="0.125">1/8 tank</option>
                <option value="0.25" selected>1/4 tank</option>
                <option value="0.5">1/2 tank</option>
              </select>
            </label>
            <label>Max detour miles
              <input id="maxDetour" type="number" min="0" step="0.5" value="{fixture['range_policy']['max_station_detour_miles']}">
            </label>
          </div>
          <label>Route waypoints
            <textarea id="waypoints">{waypoints_text}</textarea>
          </label>
          <p class="footer-note">Fixture route uses pinned mileage and mock station prices. Provider adapters are ready for Mapbox/openrouteservice routing and HERE/Barchart fuel data once keys are available.</p>
        </aside>
        <div class="fuel-main">
          <div class="summary-band" id="fuelSummary">
            {render_trip_summary(plan)}
          </div>
          <div id="fuelMap" class="chart-surface"></div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Stop</th>
                  <th>Miles since fill</th>
                  <th>Price</th>
                  <th>Gallons</th>
                  <th>Cost</th>
                  <th>Flags</th>
                </tr>
              </thead>
              <tbody id="fuelStopRows">
                {render_stop_rows(plan)}
              </tbody>
            </table>
          </div>
          <p class="footer-note">Cost model assumes filling to full at each planned stop. Prices are fixture data and regional averages for offline use; stale, missing, and average-price data are flagged in the stop table.</p>
        </div>
      </div>
    </section>
  </main>
  <script>
    const weatherRows = {weather_json};
    const fuelMap = {fuel_map_json};
    const fixture = {fixture_json};
    const route = {route_json};
    const stations = {stations_json};
    const initialPlan = {plan_json};
    const fixtureNow = new Date("2026-07-22T12:00:00-06:00");

    function renderWeather() {{
      const times = weatherRows.map((row) => row.time);
      const axisBase = {{
        type: "date",
        tickformat: "%a %I%p",
        dtick: 3 * 60 * 60 * 1000,
        showgrid: true,
        gridcolor: "rgba(255,255,255,0.22)",
        showticklabels: true,
        ticks: "outside"
      }};
      const traces = [
        {{
          x: times,
          y: weatherRows.map((row) => row.temp),
          name: "Temperature (F)",
          type: "scatter",
          mode: "lines",
          line: {{ color: "#ff6b6b" }},
          xaxis: "x",
          yaxis: "y"
        }},
        {{
          x: times,
          y: weatherRows.map((row) => row.wind),
          name: "Wind",
          type: "scatter",
          mode: "lines",
          line: {{ color: "#e8eef4" }},
          xaxis: "x2",
          yaxis: "y2"
        }},
        {{
          x: times,
          y: weatherRows.map((row) => row.gust),
          name: "Gust",
          type: "scatter",
          mode: "lines",
          line: {{ color: "#f7b267", dash: "dot" }},
          xaxis: "x2",
          yaxis: "y2"
        }},
        {{
          x: times,
          y: weatherRows.map((row) => row.humidity),
          name: "Humidity",
          type: "scatter",
          mode: "lines",
          line: {{ color: "#4dabf7" }},
          xaxis: "x3",
          yaxis: "y3"
        }},
        {{
          x: times,
          y: weatherRows.map((row) => row.sky),
          name: "Sky Cover",
          type: "scatter",
          mode: "lines",
          line: {{ color: "#adb5bd" }},
          xaxis: "x4",
          yaxis: "y4"
        }},
        {{
          x: times,
          y: weatherRows.map((row) => row.precip),
          name: "Precip %",
          type: "bar",
          marker: {{ color: "rgba(77, 171, 247, 0.72)" }},
          xaxis: "x5",
          yaxis: "y5"
        }}
      ];
      const shapes = weatherRows.map((row) => {{
        const start = new Date(row.time);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        const isDay = start.getHours() >= 6 && start.getHours() < 18;
        return {{
          type: "rect",
          xref: "x",
          yref: "paper",
          x0: start.toISOString(),
          x1: end.toISOString(),
          y0: 0,
          y1: 1,
          line: {{ width: 0 }},
          fillcolor: isDay ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.12)",
          layer: "below"
        }};
      }});
      const layout = {{
        title: "NOAA Replica Dashboard {VERSION}",
        height: 1200,
        paper_bgcolor: "#0b1220",
        plot_bgcolor: "#0b1220",
        font: {{ color: "#e5edf7" }},
        hovermode: "x unified",
        margin: {{ l: 60, r: 30, t: 70, b: 40 }},
        shapes,
        xaxis: {{ ...axisBase, anchor: "y", domain: [0, 1] }},
        yaxis: {{ domain: [0.82, 1], title: "Temp" }},
        xaxis2: {{ ...axisBase, anchor: "y2", domain: [0, 1] }},
        yaxis2: {{ domain: [0.615, 0.795], title: "Wind" }},
        xaxis3: {{ ...axisBase, anchor: "y3", domain: [0, 1] }},
        yaxis3: {{ domain: [0.41, 0.59], title: "Humidity" }},
        xaxis4: {{ ...axisBase, anchor: "y4", domain: [0, 1] }},
        yaxis4: {{ domain: [0.205, 0.385], title: "Sky", range: [0, 100] }},
        xaxis5: {{ ...axisBase, anchor: "y5", domain: [0, 1] }},
        yaxis5: {{ domain: [0, 0.18], title: "Precip" }},
        legend: {{ orientation: "h", y: 1.02, x: 0 }}
      }};
      Plotly.newPlot("weatherChart", traces, layout, {{ responsive: true }});
    }}

    function renderFuelMap(plan) {{
      const plannedIds = new Set(plan.stops.map((stop) => stop.station.id));
      const planned = stations.filter((station) => plannedIds.has(station.id));
      const candidates = stations.filter((station) => !plannedIds.has(station.id));
      const traces = [
        {{
          lat: fuelMap.route_points.map((point) => point.lat),
          lon: fuelMap.route_points.map((point) => point.lon),
          mode: "lines+markers",
          type: "scattergeo",
          name: "Route",
          line: {{ color: "#5eead4", width: 3 }},
          marker: {{ size: 5, color: "#d8f3dc" }},
          text: fuelMap.route_points.map((point) => point.label),
          hovertemplate: "%{{text}}<extra></extra>"
        }},
        {{
          lat: candidates.map((station) => station.lat),
          lon: candidates.map((station) => station.lon),
          mode: "markers",
          type: "scattergeo",
          name: "Candidate fuel",
          marker: {{ size: 8, color: "#94a3b8", opacity: 0.58 }},
          text: candidates.map((station) => `${{station.name}}<br>${{formatStationPrice(station)}}/gal`),
          hovertemplate: "%{{text}}<extra></extra>"
        }},
        {{
          lat: planned.map((station) => station.lat),
          lon: planned.map((station) => station.lon),
          mode: "markers+text",
          type: "scattergeo",
          name: "Planned stop",
          marker: {{ size: 13, color: "#ffb703", line: {{ width: 1, color: "#111827" }} }},
          text: planned.map((station, index) => String(index + 1)),
          textposition: "middle center",
          hovertext: planned.map((station) => `${{station.name}}<br>${{formatStationPrice(station)}}/gal`),
          hovertemplate: "%{{hovertext}}<extra></extra>"
        }}
      ];
      const layout = {{
        height: 560,
        paper_bgcolor: "#0b1220",
        plot_bgcolor: "#0b1220",
        font: {{ color: "#e5edf7" }},
        margin: {{ l: 10, r: 10, t: 10, b: 10 }},
        geo: {{
          scope: "usa",
          projection: {{ type: "albers usa" }},
          showland: true,
          landcolor: "#111827",
          lakecolor: "#0b1220",
          bgcolor: "#0b1220",
          showcountries: false,
          showlakes: true,
          lataxis: {{ range: [38.5, 45.5] }},
          lonaxis: {{ range: [-116.5, -103.5] }}
        }},
        legend: {{ orientation: "h", y: 1.02, x: 0 }}
      }};
      Plotly.newPlot("fuelMap", traces, layout, {{ responsive: true }});
    }}

    document.querySelectorAll(".tab-button").forEach((button) => {{
      button.addEventListener("click", () => {{
        document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        document.getElementById(`${{button.dataset.tab}}-panel`).classList.add("active");
      }});
    }});

    function stationWarnings(station, staleHours) {{
      const warnings = [];
      if (station.price_per_gal === null || station.price_per_gal === undefined) warnings.push("missing price");
      if (station.is_average) warnings.push("regional average");
      if (!station.updated_at) {{
        warnings.push("no timestamp");
      }} else {{
        const updated = new Date(station.updated_at);
        const ageHours = (fixtureNow - updated) / 36e5;
        if (ageHours > staleHours) warnings.push("stale price");
      }}
      return warnings;
    }}

    function candidatePaths(totalMiles, candidates, fullRange, usableInitial, usableFull, preferred) {{
      const nodes = [null, ...candidates, null];
      const miles = [0, ...candidates.map((station) => station.route_mile), totalMiles];
      const destination = nodes.length - 1;
      const memo = new Map();

      function solve(index) {{
        if (index === destination) return [[[], []]];
        if (memo.has(index)) return memo.get(index);
        const maxRange = index === 0 ? usableInitial : usableFull;
        const reachable = [];
        for (let next = index + 1; next < nodes.length; next += 1) {{
          const distance = miles[next] - miles[index];
          if (distance > maxRange + 1e-9) break;
          reachable.push([next, distance]);
        }}
        if (!reachable.length) {{
          memo.set(index, []);
          return [];
        }}

        const buildPaths = (options) => {{
          const paths = [];
          options.forEach(([next, distance]) => {{
            solve(next).forEach(([suffix, segments]) => {{
              const station = nodes[next];
              paths.push([
                station ? [station, ...suffix] : suffix,
                [distance, ...segments]
              ]);
            }});
          }});
          return paths;
        }};

        const preferredReachable = reachable.filter(([next, distance]) => (
          distance >= preferred || next === destination
        ));
        let paths = buildPaths(preferredReachable);
        if (!paths.length && preferredReachable.length !== reachable.length) {{
          paths = buildPaths(reachable);
        }}
        memo.set(index, paths);
        return paths;
      }}
      return solve(0);
    }}

    function buildPlan() {{
      const tank = Number(document.getElementById("tankCapacity").value);
      const mpg = Number(document.getElementById("avgMpg").value);
      const initialFraction = Number(document.getElementById("initialTank").value) / 100;
      const latestBuffer = Number(document.getElementById("latestBuffer").value);
      const earliestFraction = Number(document.getElementById("earliestFraction").value);
      const maxDetour = Number(document.getElementById("maxDetour").value);
      const grade = document.getElementById("fuelGrade").value;
      const fullRange = tank * mpg;
      const usableFull = Math.max(0, fullRange - latestBuffer);
      const usableInitial = Math.max(0, fullRange * initialFraction - latestBuffer);
      const preferred = fullRange * (1 - earliestFraction);
      const candidates = stations
        .filter((station) => station.fuel_grade === grade)
        .filter((station) => station.detour_miles <= maxDetour)
        .filter((station) => station.route_mile > 0 && station.route_mile < route.total_miles)
        .sort((a, b) => a.route_mile - b.route_mile);
      const knownPrices = candidates
        .map((station) => station.price_per_gal)
        .filter((price) => price !== null && price !== undefined);
      const fallbackPrice = knownPrices.length
        ? knownPrices.reduce((sum, price) => sum + price, 0) / knownPrices.length
        : 0;
      const paths = candidatePaths(route.total_miles, candidates, fullRange, usableInitial, usableFull, preferred);
      let best = null;

      paths.forEach(([stops, segments]) => {{
        let gallons = tank * initialFraction;
        let cost = 0;
        const purchases = [];
        let feasible = true;
        stops.forEach((station, index) => {{
          const segment = segments[index];
          gallons -= segment / mpg;
          if (gallons < -1e-6) feasible = false;
          const bought = tank - gallons;
          const effectivePrice = station.price_per_gal ?? fallbackPrice;
          const stopCost = bought * effectivePrice;
          const warnings = stationWarnings(station, 72);
          purchases.push({{
            station,
            miles_since_fill: segment,
            gallons_bought: bought,
            cost: stopCost,
            effective_price_per_gal: effectivePrice,
            forced_early_stop: segment < preferred,
            warnings
          }});
          cost += stopCost;
          gallons = tank;
        }});
        if (segments.length) {{
          gallons -= segments[segments.length - 1] / mpg;
          if (gallons < -1e-6) feasible = false;
        }}
        if (!feasible) return;
        const forced = purchases.filter((stop) => stop.forced_early_stop).length;
        const detour = purchases.reduce((sum, stop) => sum + stop.station.detour_miles, 0);
        const missing = purchases.filter((stop) => stop.warnings.includes("missing price")).length;
        const stale = purchases.filter((stop) => stop.warnings.includes("stale price")).length;
        const average = purchases.filter((stop) => stop.warnings.includes("regional average")).length;
        const score = [purchases.length, cost, detour, missing, stale, average, forced];
        if (!best || score.some((value, index) => value < best.score[index] && score.slice(0, index).every((prior, priorIndex) => prior === best.score[priorIndex]))) {{
          best = {{ score, purchases, cost, segments }};
        }}
      }});

      if (!best) {{
        return {{
          total_route_miles: route.total_miles,
          total_gallons_needed: route.total_miles / mpg,
          estimated_total_cost: 0,
          full_tank_range_miles: fullRange,
          usable_range_miles: usableFull,
          preferred_stop_after_miles: preferred,
          stops: [],
          warnings: ["no feasible plan"]
        }};
      }}

      const warnings = [...new Set(best.purchases.flatMap((stop) => [
        ...stop.warnings,
        ...(stop.forced_early_stop ? [`forced early stop at ${{stop.station.name}}`] : [])
      ]))].sort();
      return {{
        total_route_miles: route.total_miles,
        total_gallons_needed: route.total_miles / mpg,
        estimated_total_cost: best.cost,
        full_tank_range_miles: fullRange,
        usable_range_miles: usableFull,
        preferred_stop_after_miles: preferred,
        stops: best.purchases,
        warnings
      }};
    }}

    function money(value) {{
      return value.toLocaleString(undefined, {{ style: "currency", currency: "USD", maximumFractionDigits: 0 }});
    }}

    function formatStationPrice(station, effectivePrice = null) {{
      const price = station.price_per_gal ?? effectivePrice;
      return price === null || price === undefined ? "price unavailable" : `$${{price.toFixed(2)}}`;
    }}

    function number(value, digits = 0) {{
      return value.toLocaleString(undefined, {{ maximumFractionDigits: digits }});
    }}

    function renderPlan(plan) {{
      const warnings = plan.warnings.length
        ? plan.warnings.map((warning) => `<span class="badge">${{warning}}</span>`).join("")
        : '<span class="badge quiet">fixture prices</span>';
      document.getElementById("fuelSummary").innerHTML = `
        <div class="metric"><span>Total route</span><strong>${{number(plan.total_route_miles)}} mi</strong></div>
        <div class="metric"><span>Fuel needed</span><strong>${{number(plan.total_gallons_needed, 1)}} gal</strong></div>
        <div class="metric"><span>Estimated fuel cost</span><strong>${{money(plan.estimated_total_cost)}}</strong></div>
        <div class="metric"><span>Fuel stops</span><strong>${{plan.stops.length}}</strong></div>
        <div class="badge-row">${{warnings}}</div>
      `;
      document.getElementById("fuelStopRows").innerHTML = plan.stops.length
        ? plan.stops.map((stop, index) => {{
            const flags = [
              ...stop.warnings,
              ...(stop.forced_early_stop ? ["forced early stop"] : [])
            ].join(", ") || "fresh station price";
            return `
              <tr>
                <td>${{index + 1}}</td>
                <td>${{stop.station.name}}<small>${{stop.station.address}}</small></td>
                <td>${{number(stop.miles_since_fill)}} </td>
                <td>${{formatStationPrice(stop.station, stop.effective_price_per_gal)}}</td>
                <td>${{number(stop.gallons_bought, 1)}}</td>
                <td>${{money(stop.cost)}}</td>
                <td>${{flags}}</td>
              </tr>
            `;
          }}).join("")
        : '<tr><td colspan="7">No feasible plan for these settings.</td></tr>';
    }}

    ["tankCapacity", "avgMpg", "initialTank", "fuelGrade", "latestBuffer", "earliestFraction", "maxDetour"].forEach((id) => {{
      document.getElementById(id).addEventListener("input", () => {{
        const plan = buildPlan();
        renderPlan(plan);
        renderFuelMap(plan);
      }});
    }});
    renderWeather();
    renderPlan(initialPlan);
    renderFuelMap(initialPlan);
  </script>
</body>
</html>
"""


def main():
    fixture = load_trip_fixture()
    route = MockRouteProvider(TRIP_FIXTURE).get_route(fixture["waypoints"])
    stations = MockFuelPriceProvider(TRIP_FIXTURE).get_prices(
        route,
        fuel_grade=fixture["vehicle"]["fuel_grade"],
        max_detour_miles=fixture["range_policy"]["max_station_detour_miles"]
    )
    vehicle = Vehicle(**fixture["vehicle"])
    policy = RangePolicy(**fixture["range_policy"])
    plan = plan_fuel_stops(
        route,
        stations,
        vehicle,
        policy,
        initial_tank_fraction=1.0,
        now=datetime(2026, 7, 22, tzinfo=timezone.utc)
    )

    weather_rows = build_weather_rows()
    fuel_map = build_fuel_map_payload(route, stations, plan)
    html = render_dashboard(weather_rows, fuel_map, fixture, route, stations, plan)
    Path("dashboard.html").write_text(html)
    print("Saved dashboard.html with NOAA forecast and road trip fuel planner")


if __name__ == "__main__":
    main()
