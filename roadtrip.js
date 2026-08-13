const METERS_PER_MILE = 1609.344;
const ROUTE_STEP_MILES = 100;
const ROUTE_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const FORECAST_CACHE_TTL_MS = 30 * 60 * 1000;
const GEOCODE_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const PLACE_LOOKUP_TTL_MS = 12 * 60 * 60 * 1000;

const byId = id => document.getElementById(id);
let stopCounter = 0;

const US_STATE_ABBREVIATIONS = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

const ROUTE_MAP_STATE_BOUNDS = [
  { abbr: 'AL', minLat: 30.1, maxLat: 35, minLon: -88.5, maxLon: -84.9 },
  { abbr: 'AZ', minLat: 31.3, maxLat: 37, minLon: -114.8, maxLon: -109 },
  { abbr: 'AR', minLat: 33, maxLat: 36.5, minLon: -94.6, maxLon: -89.6 },
  { abbr: 'CA', minLat: 32.5, maxLat: 42, minLon: -124.5, maxLon: -114.1 },
  { abbr: 'CO', minLat: 37, maxLat: 41, minLon: -109.1, maxLon: -102 },
  { abbr: 'CT', minLat: 41, maxLat: 42.1, minLon: -73.7, maxLon: -71.8 },
  { abbr: 'DE', minLat: 38.4, maxLat: 39.9, minLon: -75.8, maxLon: -75 },
  { abbr: 'FL', minLat: 24.5, maxLat: 31, minLon: -87.6, maxLon: -80 },
  { abbr: 'GA', minLat: 30.4, maxLat: 35, minLon: -85.6, maxLon: -80.8 },
  { abbr: 'ID', minLat: 42, maxLat: 49, minLon: -117.2, maxLon: -111 },
  { abbr: 'IL', minLat: 36.9, maxLat: 42.5, minLon: -91.5, maxLon: -87 },
  { abbr: 'IN', minLat: 37.8, maxLat: 41.8, minLon: -88.1, maxLon: -84.8 },
  { abbr: 'IA', minLat: 40.4, maxLat: 43.5, minLon: -96.6, maxLon: -90.1 },
  { abbr: 'KS', minLat: 37, maxLat: 40, minLon: -102.1, maxLon: -94.6 },
  { abbr: 'KY', minLat: 36.5, maxLat: 39.2, minLon: -89.6, maxLon: -81.9 },
  { abbr: 'LA', minLat: 28.9, maxLat: 33, minLon: -94.1, maxLon: -88.8 },
  { abbr: 'ME', minLat: 43.1, maxLat: 47.5, minLon: -71.1, maxLon: -66.9 },
  { abbr: 'MD', minLat: 37.9, maxLat: 39.7, minLon: -79.5, maxLon: -75 },
  { abbr: 'MA', minLat: 41.2, maxLat: 42.9, minLon: -73.5, maxLon: -69.9 },
  { abbr: 'MI', minLat: 41.7, maxLat: 48.3, minLon: -90.4, maxLon: -82.1 },
  { abbr: 'MN', minLat: 43.5, maxLat: 49.4, minLon: -97.2, maxLon: -89.5 },
  { abbr: 'MS', minLat: 30.2, maxLat: 35, minLon: -91.7, maxLon: -88.1 },
  { abbr: 'MO', minLat: 36, maxLat: 40.6, minLon: -95.8, maxLon: -89.1 },
  { abbr: 'MT', minLat: 44.4, maxLat: 49, minLon: -116.1, maxLon: -104 },
  { abbr: 'NE', minLat: 40, maxLat: 43.1, minLon: -104.1, maxLon: -95.3 },
  { abbr: 'NV', minLat: 35, maxLat: 42, minLon: -120, maxLon: -114 },
  { abbr: 'NH', minLat: 42.7, maxLat: 45.3, minLon: -72.6, maxLon: -70.6 },
  { abbr: 'NJ', minLat: 38.9, maxLat: 41.4, minLon: -75.6, maxLon: -73.9 },
  { abbr: 'NM', minLat: 31.3, maxLat: 37, minLon: -109.1, maxLon: -103 },
  { abbr: 'NY', minLat: 40.5, maxLat: 45.1, minLon: -79.8, maxLon: -71.8 },
  { abbr: 'NC', minLat: 33.8, maxLat: 36.6, minLon: -84.4, maxLon: -75.5 },
  { abbr: 'ND', minLat: 45.9, maxLat: 49, minLon: -104.1, maxLon: -96.6 },
  { abbr: 'OH', minLat: 38.4, maxLat: 42.3, minLon: -84.9, maxLon: -80.5 },
  { abbr: 'OK', minLat: 33.6, maxLat: 37, minLon: -103, maxLon: -94.4 },
  { abbr: 'OR', minLat: 42, maxLat: 46.3, minLon: -124.7, maxLon: -116.5 },
  { abbr: 'PA', minLat: 39.7, maxLat: 42.5, minLon: -80.6, maxLon: -74.7 },
  { abbr: 'RI', minLat: 41.1, maxLat: 42, minLon: -71.9, maxLon: -71.1 },
  { abbr: 'SC', minLat: 32, maxLat: 35.2, minLon: -83.4, maxLon: -78.5 },
  { abbr: 'SD', minLat: 42.5, maxLat: 45.9, minLon: -104.1, maxLon: -96.4 },
  { abbr: 'TN', minLat: 35, maxLat: 36.7, minLon: -90.3, maxLon: -81.6 },
  { abbr: 'TX', minLat: 25.8, maxLat: 36.5, minLon: -106.7, maxLon: -93.5 },
  { abbr: 'UT', minLat: 37, maxLat: 42, minLon: -114.1, maxLon: -109 },
  { abbr: 'VT', minLat: 42.7, maxLat: 45, minLon: -73.4, maxLon: -71.5 },
  { abbr: 'VA', minLat: 36.5, maxLat: 39.5, minLon: -83.7, maxLon: -75.2 },
  { abbr: 'WA', minLat: 45.5, maxLat: 49, minLon: -124.8, maxLon: -116.9 },
  { abbr: 'WV', minLat: 37.2, maxLat: 40.7, minLon: -82.7, maxLon: -77.7 },
  { abbr: 'WI', minLat: 42.5, maxLat: 47.1, minLon: -92.9, maxLon: -86.8 },
  { abbr: 'WY', minLat: 41, maxLat: 45, minLon: -111.1, maxLon: -104 },
];

document.addEventListener('DOMContentLoaded', () => {
  byId('load-route').addEventListener('click', loadRoadtripWeather);
  byId('use-location').addEventListener('click', useCurrentLocationAsStart);
  byId('add-stop').addEventListener('click', () => addStopInput());
  byId('from-input').addEventListener('keydown', submitOnEnter);
  byId('to-input').addEventListener('keydown', submitOnEnter);

  const shared = SharedLocation.readLocation();
  if (shared?.lat != null && shared?.lon != null) {
    byId('from-input').value = shared.label || `${shared.lat.toFixed(4)}, ${shared.lon.toFixed(4)}`;
  }
});

function addStopInput(value = '') {
  stopCounter += 1;
  const stopNumber = document.querySelectorAll('.stop-row').length + 1;
  const row = document.createElement('div');
  row.className = 'stop-row';
  row.dataset.stopId = String(stopCounter);
  row.innerHTML = `
    <div class="stop-label">Stop ${stopNumber}</div>
    <label>
      <span class="visually-hidden">Stop ${stopNumber}</span>
      <input class="stop-input" value="${escapeAttr(value)}" autocomplete="off" placeholder="Town, landmark, or lat/lon">
    </label>
    <div class="stop-reorder">
      <button class="move-stop move-stop-up" type="button">Up</button>
      <button class="move-stop move-stop-down" type="button">Down</button>
    </div>
    <button class="remove-stop" type="button">Remove</button>
  `;
  row.querySelector('.stop-input').addEventListener('keydown', submitOnEnter);
  row.querySelector('.move-stop-up').addEventListener('click', () => {
    const previous = row.previousElementSibling;
    if (!previous) return;
    row.parentNode.insertBefore(row, previous);
    renumberStops();
  });
  row.querySelector('.move-stop-down').addEventListener('click', () => {
    const next = row.nextElementSibling;
    if (!next) return;
    row.parentNode.insertBefore(next, row);
    renumberStops();
  });
  row.querySelector('.remove-stop').addEventListener('click', () => {
    row.remove();
    renumberStops();
  });
  byId('stops-list').appendChild(row);
  renumberStops();
  row.querySelector('.stop-input').focus();
}

function renumberStops() {
  const rows = [...document.querySelectorAll('.stop-row')];
  rows.forEach((row, index) => {
    const stopNumber = index + 1;
    const label = row.querySelector('.stop-label');
    const hiddenLabel = row.querySelector('.visually-hidden');
    const moveUp = row.querySelector('.move-stop-up');
    const moveDown = row.querySelector('.move-stop-down');
    if (label) label.textContent = `Stop ${stopNumber}`;
    if (hiddenLabel) hiddenLabel.textContent = `Stop ${stopNumber}`;
    if (moveUp) {
      moveUp.disabled = index === 0;
      moveUp.setAttribute('aria-label', `Move stop ${stopNumber} up`);
      moveUp.title = `Move stop ${stopNumber} up`;
    }
    if (moveDown) {
      moveDown.disabled = index === rows.length - 1;
      moveDown.setAttribute('aria-label', `Move stop ${stopNumber} down`);
      moveDown.title = `Move stop ${stopNumber} down`;
    }
  });
}

function submitOnEnter(event) {
  if (event.key === 'Enter') loadRoadtripWeather();
}

async function useCurrentLocationAsStart() {
  const button = byId('use-location');
  button.disabled = true;
  setStatus('Getting current location...');
  try {
    const location = await SharedLocation.getBrowserLocation();
    byId('from-input').value = location.label || `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`;
    SharedLocation.saveLocation(location);
    setStatus(`Trip start set to ${location.label || 'current location'}.`);
  } catch (error) {
    setStatus(error.message || 'Current location is not available.');
  } finally {
    button.disabled = false;
  }
}

async function loadRoadtripWeather() {
  const loadButton = byId('load-route');
  loadButton.disabled = true;
  byId('summary-section').hidden = true;
  byId('forecast-section').hidden = true;
  byId('forecast-grid').innerHTML = '';
  byId('route-map').innerHTML = '';

  try {
    const fromText = byId('from-input').value.trim();
    const toText = byId('to-input').value.trim();
    if (!fromText || !toText) throw new Error('Enter both a start and destination.');
    const stopTexts = getStopTexts();

    setStatus('Finding route...');
    const locations = await Promise.all([fromText, ...stopTexts, toText].map(resolveLocation));
    const from = locations[0];
    const to = locations[locations.length - 1];
    const stops = locations.slice(1, -1);
    const route = await fetchRoute(locations);
    const routeMiles = route.distance / METERS_PER_MILE;
    let samplePoints = buildForecastPoints(route.geometry.coordinates, routeMiles, stops);
    setStatus(`Finding nearest cities for ${samplePoints.length} route points...`);
    samplePoints = await mapWithConcurrency(samplePoints, 6, async point => ({
      ...point,
      nearestPlace: await nearestPlaceForPoint(point).catch(() => ''),
    }));

    renderSummary(from, to, stops, route, samplePoints);
    renderRouteMap(route.geometry.coordinates, [from, ...stops, to], samplePoints);
    renderForecastPlaceholders(samplePoints);
    byId('forecast-section').hidden = false;

    setStatus(`Fetching five-day forecasts for ${samplePoints.length} route points...`);
    const forecasts = await mapWithConcurrency(samplePoints, 6, async (point, index) => {
      const forecast = await fetchPointForecast(point).catch(error => ({ error }));
      setStatus(`Fetched ${index + 1} of ${samplePoints.length} route forecasts...`);
      return forecast;
    });

    renderForecasts(samplePoints, forecasts);
    byId('forecast-updated').textContent = formatFetchedAt();
    setStatus(`Ready: five-day high/low forecasts at ${samplePoints.length} route points.`);
  } catch (error) {
    setStatus(error.message || 'Roadtrip weather could not be loaded.');
  } finally {
    loadButton.disabled = false;
  }
}

function getStopTexts() {
  return [...document.querySelectorAll('.stop-input')]
    .map(input => input.value.trim())
    .filter(Boolean);
}

async function resolveLocation(input) {
  const parsed = SharedLocation.parseCoordinateText(input);
  if (parsed) return { ...parsed, label: input };

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=1&lang=en`;
  const data = await SharedLocation.fetchJson(url, { ttlMs: GEOCODE_CACHE_TTL_MS });
  const feature = data?.features?.[0];
  const coords = feature?.geometry?.coordinates;
  if (!coords || coords.length < 2) throw new Error(`Could not find "${input}".`);
  const props = feature.properties || {};
  return {
    lat: Number(coords[1]),
    lon: Number(coords[0]),
    label: locationLabel(props, input),
  };
}

function locationLabel(props, fallback) {
  const name = props.name || props.city || props.town || props.village || props.county || fallback;
  const state = props.state || '';
  const country = props.country || '';
  const suffix = state || country;
  return suffix && !String(name).includes(suffix) ? `${name}, ${suffix}` : String(name);
}

async function fetchRoute(locations) {
  const coords = locations.map(location => `${location.lon},${location.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&alternatives=false&steps=false`;
  const data = await SharedLocation.fetchJson(url, { ttlMs: ROUTE_CACHE_TTL_MS });
  const route = data?.routes?.[0];
  if (!route?.geometry?.coordinates?.length) throw new Error('No driving route found.');
  return route;
}

function buildForecastPoints(coordinates, routeMiles, stops) {
  const context = routeMileageContext(coordinates, routeMiles);
  const routePoints = sampleRoutePoints(coordinates, routeMiles, context);
  const stopPoints = stops.map((stop, index) => ({
    lat: stop.lat,
    lon: stop.lon,
    routeMile: routeMileageForPoint(coordinates, context, routeMiles, stop),
    label: `Stop ${index + 1}: ${stop.label}`,
    type: 'stop',
  }));
  return [...routePoints, ...stopPoints].sort((a, b) => a.routeMile - b.routeMile);
}

function sampleRoutePoints(coordinates, routeMiles, context = routeMileageContext(coordinates, routeMiles)) {
  const { cumulative, geometryMiles } = context;
  const targets = [0];
  for (let mile = ROUTE_STEP_MILES; mile < routeMiles; mile += ROUTE_STEP_MILES) {
    targets.push(mile);
  }
  if (routeMiles > 0 && Math.abs(routeMiles - targets[targets.length - 1]) > 0.1) targets.push(routeMiles);

  return targets.map((routeMile, index) => {
    const geometryTarget = routeMiles > 0 ? routeMile / routeMiles * geometryMiles : 0;
    const point = interpolateAtMileage(coordinates, cumulative, geometryTarget);
    const isDestination = Math.abs(routeMile - routeMiles) < 0.5;
    return {
      ...point,
      routeMile,
      label: index === 0 ? 'Start' : isDestination ? 'Destination' : '',
      type: 'route',
    };
  });
}

function routeMileageContext(coordinates, routeMiles) {
  const cumulative = [0];
  for (let i = 1; i < coordinates.length; i += 1) {
    cumulative.push(cumulative[i - 1] + haversineMiles(coordToPoint(coordinates[i - 1]), coordToPoint(coordinates[i])));
  }
  const geometryMiles = cumulative[cumulative.length - 1] || routeMiles;
  return { cumulative, geometryMiles };
}

function routeMileageForPoint(coordinates, context, routeMiles, point) {
  const { cumulative, geometryMiles } = context;
  let closestDistance = Infinity;
  let closestGeometryMile = 0;
  for (let i = 1; i < coordinates.length; i += 1) {
    const a = coordToPoint(coordinates[i - 1]);
    const b = coordToPoint(coordinates[i]);
    const projected = projectPointToSegment(point, a, b);
    if (projected.distanceSquared < closestDistance) {
      closestDistance = projected.distanceSquared;
      closestGeometryMile = cumulative[i - 1] + (cumulative[i] - cumulative[i - 1]) * projected.ratio;
    }
  }
  const routeMile = geometryMiles > 0 ? closestGeometryMile / geometryMiles * routeMiles : 0;
  return clamp(routeMile, 0, routeMiles);
}

function projectPointToSegment(point, a, b) {
  const milesPerDegreeLat = 69;
  const milesPerDegreeLon = Math.cos(point.lat * Math.PI / 180) * milesPerDegreeLat;
  const ax = (a.lon - point.lon) * milesPerDegreeLon;
  const ay = (a.lat - point.lat) * milesPerDegreeLat;
  const bx = (b.lon - point.lon) * milesPerDegreeLon;
  const by = (b.lat - point.lat) * milesPerDegreeLat;
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const ratio = lengthSquared > 0 ? clamp((-(ax * dx + ay * dy)) / lengthSquared, 0, 1) : 0;
  const x = ax + dx * ratio;
  const y = ay + dy * ratio;
  return {
    ratio,
    distanceSquared: x * x + y * y,
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function interpolateAtMileage(coordinates, cumulative, targetMiles) {
  if (targetMiles <= 0) return coordToPoint(coordinates[0]);
  for (let i = 1; i < cumulative.length; i += 1) {
    if (cumulative[i] >= targetMiles) {
      const segmentMiles = cumulative[i] - cumulative[i - 1];
      const ratio = segmentMiles > 0 ? (targetMiles - cumulative[i - 1]) / segmentMiles : 0;
      const a = coordToPoint(coordinates[i - 1]);
      const b = coordToPoint(coordinates[i]);
      return {
        lat: a.lat + (b.lat - a.lat) * ratio,
        lon: a.lon + (b.lon - a.lon) * ratio,
      };
    }
  }
  return coordToPoint(coordinates[coordinates.length - 1]);
}

function coordToPoint(coord) {
  return { lon: Number(coord[0]), lat: Number(coord[1]) };
}

async function nearestPlaceForPoint(point) {
  const nwsPlace = await nearestNwsPlace(point).catch(() => null);
  if (nwsPlace) return nwsPlace;
  const photonPlace = await nearestPhotonPlace(point).catch(() => null);
  return photonPlace || '';
}

async function nearestNwsPlace(point) {
  const url = `https://api.weather.gov/points/${point.lat.toFixed(3)},${point.lon.toFixed(3)}`;
  const data = await SharedLocation.fetchJson(url, { ttlMs: PLACE_LOOKUP_TTL_MS });
  const props = data?.properties?.relativeLocation?.properties;
  const city = props?.city || '';
  const state = props?.state || '';
  if (!city || !state) return '';
  return `${city}, ${state}`;
}

async function nearestPhotonPlace(point) {
  const url = `https://photon.komoot.io/reverse?lat=${point.lat.toFixed(5)}&lon=${point.lon.toFixed(5)}&limit=1&lang=en`;
  const data = await SharedLocation.fetchJson(url, { ttlMs: PLACE_LOOKUP_TTL_MS });
  const props = data?.features?.[0]?.properties || {};
  const city = props.city || props.town || props.village || props.municipality || props.county || props.name || '';
  const state = stateDisplay(props.state || props.country || '');
  if (city && state) return `${city}, ${state}`;
  return city || state || '';
}

function stateDisplay(value) {
  return US_STATE_ABBREVIATIONS[value] || value;
}

async function fetchPointForecast(point) {
  const params = new URLSearchParams({
    latitude: point.lat.toFixed(4),
    longitude: point.lon.toFixed(4),
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '5',
    temperature_unit: 'fahrenheit',
  });
  return SharedLocation.fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`, {
    ttlMs: FORECAST_CACHE_TTL_MS,
  });
}

function renderSummary(from, to, stops, route, samplePoints) {
  const routeMiles = route.distance / METERS_PER_MILE;
  const cards = [
    summaryCard('From', from.label, true),
    summaryCard('To', to.label, true),
    summaryCard('Drive', `${Math.round(route.duration / 360) / 10} hr`),
    summaryCard('Distance', `${Math.round(routeMiles)} mi · ${samplePoints.length} points`),
  ];
  if (stops.length) {
    cards.splice(2, 0, summaryCard('Via', stops.map(stop => stop.label).join(' -> '), true));
  }
  byId('summary-grid').innerHTML = cards.join('');
  const mapsLink = byId('maps-link');
  mapsLink.href = googleMapsRouteUrl(from, to, stops);
  byId('summary-section').hidden = false;
}

function renderRouteMap(coordinates, waypoints, samplePoints) {
  const map = byId('route-map');
  if (!coordinates?.length) {
    map.innerHTML = '';
    return;
  }

  const width = 560;
  const height = 220;
  const padding = 24;
  const points = coordinates.map(coordToPoint);
  const mapBounds = routeMapBounds(geoBounds(points));
  const projectedRoute = projectPoints(points, width, height, padding, mapBounds);
  const projectedWaypoints = projectPoints(waypoints, width, height, padding, mapBounds);
  const projectedSamples = projectPoints(samplePoints, width, height, padding, mapBounds);
  const stateBaselayer = renderStateBaselayer(mapBounds, width, height, padding);
  const routePoints = decimateProjectedPoints(projectedRoute.points, 360)
    .map(point => `${roundSvg(point.x)},${roundSvg(point.y)}`)
    .join(' ');
  const sampleMarkers = projectedSamples.points
    .map((point, index) => ({ ...point, sample: samplePoints[index] }))
    .filter((point, index) => index > 0 && index < samplePoints.length - 1 && point.sample.type !== 'stop')
    .map(point => {
      const label = point.sample.label || `Mile ${Math.round(point.sample.routeMile)}`;
      return `<circle class="route-map-sample" cx="${roundSvg(point.x)}" cy="${roundSvg(point.y)}" r="3"><title>${escapeHtml(label)}</title></circle>`;
    })
    .join('');
  const waypointMarkers = projectedWaypoints.points
    .map((point, index) => {
      const isStart = index === 0;
      const isEnd = index === projectedWaypoints.points.length - 1;
      const label = isStart ? 'Start' : isEnd ? 'Destination' : `Stop ${index}`;
      const textAnchor = isEnd ? 'end' : 'start';
      const labelX = clamp(point.x + (isEnd ? -9 : 9), padding, width - padding);
      const labelY = clamp(point.y - 9, padding - 6, height - padding + 14);
      return `
        <g class="route-map-waypoint ${isStart ? 'is-start' : isEnd ? 'is-end' : 'is-stop'}">
          <circle cx="${roundSvg(point.x)}" cy="${roundSvg(point.y)}" r="${isStart || isEnd ? 6 : 5}"></circle>
          <text x="${roundSvg(labelX)}" y="${roundSvg(labelY)}" text-anchor="${textAnchor}">${escapeHtml(label)}</text>
        </g>
      `;
    })
    .join('');

  map.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="route-map-title" preserveAspectRatio="xMidYMid meet">
      <title id="route-map-title">Route overview map</title>
      <rect class="route-map-bg" x="0" y="0" width="${width}" height="${height}" rx="8"></rect>
      <path class="route-map-grid" d="M70 16V204 M140 16V204 M210 16V204 M280 16V204 M350 16V204 M420 16V204 M490 16V204 M18 55H542 M18 110H542 M18 165H542"></path>
      ${stateBaselayer}
      <polyline class="route-map-line-shadow" points="${routePoints}"></polyline>
      <polyline class="route-map-line" points="${routePoints}"></polyline>
      ${sampleMarkers}
      ${waypointMarkers}
    </svg>
  `;
}

function routeMapBounds(bounds) {
  const latSpan = bounds.maxLat - bounds.minLat || 0.01;
  const lonSpan = bounds.maxLon - bounds.minLon || 0.01;
  const targetLatSpan = Math.max(latSpan * 1.8, 4);
  const targetLonSpan = Math.max(lonSpan * 1.45, 5.5);
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;
  const centerLon = (bounds.minLon + bounds.maxLon) / 2;
  return {
    minLat: centerLat - targetLatSpan / 2,
    maxLat: centerLat + targetLatSpan / 2,
    minLon: centerLon - targetLonSpan / 2,
    maxLon: centerLon + targetLonSpan / 2,
  };
}

function renderStateBaselayer(bounds, width, height, padding) {
  const states = ROUTE_MAP_STATE_BOUNDS
    .filter(state => geoBoxesIntersect(state, bounds))
    .map(state => {
      const topLeft = projectPoints([{ lat: state.maxLat, lon: state.minLon }], width, height, padding, bounds).points[0];
      const bottomRight = projectPoints([{ lat: state.minLat, lon: state.maxLon }], width, height, padding, bounds).points[0];
      const labelPoint = projectPoints([{
        lat: (state.minLat + state.maxLat) / 2,
        lon: (state.minLon + state.maxLon) / 2,
      }], width, height, padding, bounds).points[0];
      const x = clamp(Math.min(topLeft.x, bottomRight.x), padding, width - padding);
      const y = clamp(Math.min(topLeft.y, bottomRight.y), padding, height - padding);
      const right = clamp(Math.max(topLeft.x, bottomRight.x), padding, width - padding);
      const bottom = clamp(Math.max(topLeft.y, bottomRight.y), padding, height - padding);
      const boxWidth = right - x;
      const boxHeight = bottom - y;
      const label = boxWidth > 24 && boxHeight > 16
        ? `<text x="${roundSvg(clamp(labelPoint.x, x + 12, right - 12))}" y="${roundSvg(clamp(labelPoint.y, y + 12, bottom - 7))}">${escapeHtml(state.abbr)}</text>`
        : '';
      return `
        <g class="route-map-state">
          <rect x="${roundSvg(x)}" y="${roundSvg(y)}" width="${roundSvg(boxWidth)}" height="${roundSvg(boxHeight)}"></rect>
          ${label}
        </g>
      `;
    })
    .join('');

  return states ? `<g class="route-map-states">${states}</g>` : '';
}

function geoBoxesIntersect(a, b) {
  return a.minLon <= b.maxLon && a.maxLon >= b.minLon && a.minLat <= b.maxLat && a.maxLat >= b.minLat;
}

function projectPoints(points, width, height, padding, bounds = null) {
  const sourceBounds = bounds || geoBounds(points);
  const lonSpan = sourceBounds.maxLon - sourceBounds.minLon || 0.01;
  const latSpan = sourceBounds.maxLat - sourceBounds.minLat || 0.01;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const scale = Math.min(usableWidth / lonSpan, usableHeight / latSpan);
  const drawWidth = lonSpan * scale;
  const drawHeight = latSpan * scale;
  const offsetX = padding + (usableWidth - drawWidth) / 2;
  const offsetY = padding + (usableHeight - drawHeight) / 2;

  return {
    bounds: sourceBounds,
    points: points.map(point => ({
      x: offsetX + (point.lon - sourceBounds.minLon) * scale,
      y: offsetY + (sourceBounds.maxLat - point.lat) * scale,
    })),
  };
}

function geoBounds(points) {
  return points.reduce((bounds, point) => ({
    minLat: Math.min(bounds.minLat, point.lat),
    maxLat: Math.max(bounds.maxLat, point.lat),
    minLon: Math.min(bounds.minLon, point.lon),
    maxLon: Math.max(bounds.maxLon, point.lon),
  }), {
    minLat: Infinity,
    maxLat: -Infinity,
    minLon: Infinity,
    maxLon: -Infinity,
  });
}

function decimateProjectedPoints(points, maxPoints) {
  if (points.length <= maxPoints) return points;
  const step = Math.ceil(points.length / maxPoints);
  const decimated = points.filter((_, index) => index % step === 0);
  const last = points[points.length - 1];
  if (decimated[decimated.length - 1] !== last) decimated.push(last);
  return decimated;
}

function roundSvg(value) {
  return Math.round(value * 10) / 10;
}

function googleMapsRouteUrl(from, to, stops) {
  const params = new URLSearchParams({
    api: '1',
    origin: from.label,
    destination: to.label,
    travelmode: 'driving',
  });
  if (stops.length) params.set('waypoints', stops.map(stop => stop.label).join('|'));
  return `https://www.google.com/maps/dir/?${params}`;
}

function summaryCard(label, value, compact = false) {
  return `
    <div class="summary-card">
      <div class="summary-label">${escapeHtml(label)}</div>
      <div class="summary-value${compact ? ' summary-small' : ''}">${escapeHtml(value)}</div>
    </div>
  `;
}

function renderForecastPlaceholders(points) {
  byId('forecast-grid').innerHTML = forecastTable(points, null, defaultForecastDates());
}

function renderForecasts(points, forecasts) {
  byId('forecast-grid').innerHTML = forecastTable(points, forecasts, forecastDates(forecasts));
}

function forecastTable(points, forecasts, dates) {
  return `
    <table class="forecast-table">
      <thead>
        <tr>
          <th scope="col">Mileage</th>
          <th scope="col">Nearest City</th>
          ${dates.map(date => `<th scope="col">${escapeHtml(formatDay(date))}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${points.map((point, index) => forecastRow(point, forecasts?.[index], dates)).join('')}
      </tbody>
    </table>
  `;
}

function forecastRow(point, forecast, dates) {
  const coords = `${point.lat.toFixed(3)}, ${point.lon.toFixed(3)}`;
  const city = point.nearestPlace || coords;
  const label = point.label ? `<div class="point-label">${escapeHtml(point.label)}</div>` : '';
  return `
    <tr>
      <th scope="row" class="mileage-cell">
        <div class="point-mile">${point.routeMile === 0 ? 'Mile 0' : `Mile ${Math.round(point.routeMile)}`}</div>
        ${label}
      </th>
      <td class="city-cell">
        <div class="point-city">${escapeHtml(city)}</div>
        <div class="point-coords">${escapeHtml(coords)}</div>
      </td>
      ${dates.map((date, index) => forecastCell(forecast, date, index)).join('')}
    </tr>
  `;
}

function forecastCell(data, date, fallbackIndex) {
  if (!data) return '<td class="weather-cell weather-loading">Loading...</td>';
  if (data.error) return '<td class="weather-cell weather-unavailable">Unavailable</td>';
  const dates = data?.daily?.time || [];
  const highs = data?.daily?.temperature_2m_max || [];
  const lows = data?.daily?.temperature_2m_min || [];
  const codes = data?.daily?.weather_code || [];
  const index = dates.indexOf(date);
  const dayIndex = index >= 0 ? index : fallbackIndex;
  if (!dates.length || dayIndex >= dates.length) return '<td class="weather-cell weather-unavailable">Unavailable</td>';
  return `
    <td class="weather-cell">
      <div class="day-temp">${formatTemp(highs[dayIndex])} / ${formatTemp(lows[dayIndex])}</div>
      <div class="day-condition">${escapeHtml(weatherConditionForCode(codes[dayIndex]))}</div>
    </td>
  `;
}

function forecastDates(forecasts) {
  const forecast = forecasts.find(item => item?.daily?.time?.length);
  return forecast?.daily?.time?.slice(0, 5) || defaultForecastDates();
}

function defaultForecastDates() {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return localDateString(date);
  });
}

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDay(dateStr) {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });
}

function formatTemp(value) {
  const temp = Math.round(Number(value));
  return Number.isFinite(temp) ? `${temp}&deg;` : '&mdash;';
}

function weatherConditionForCode(code) {
  const n = Number(code);
  if (n === 0) return 'Sunny';
  if (n === 1) return 'Mostly sunny';
  if (n === 2) return 'Partly cloudy';
  if (n === 3) return 'Cloudy';
  if (n === 45 || n === 48) return 'Fog';
  if ((n >= 51 && n <= 67) || (n >= 80 && n <= 82)) return 'Rain likely';
  if ((n >= 71 && n <= 77) || n === 85 || n === 86) return 'Snow likely';
  if (n >= 95 && n <= 99) return 'Thunderstorms';
  return 'Forecast';
}

function formatFetchedAt(date = new Date()) {
  return `Updated ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}`;
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

function haversineMiles(a, b) {
  const rad = value => value * Math.PI / 180;
  const earthMiles = 3958.8;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const h = s1 * s1 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * s2 * s2;
  return 2 * earthMiles * Math.asin(Math.sqrt(h));
}

function setStatus(message) {
  byId('status').textContent = message;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#096;');
}
