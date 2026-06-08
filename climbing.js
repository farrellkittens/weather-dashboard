const DEFAULT_FROM = {
  label: 'Colorado State Capitol, Denver, CO',
  lat: 39.7393,
  lon: -104.9848,
};
const FROM_KEY = 'weather-dashboard:climbing-from';
const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;
const ROUTE_CACHE_TTL_MS = 5 * 60 * 1000;
const LOCATION_LOOKUP_TTL_MS = 12 * 60 * 60 * 1000;

const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['FL', 'Florida'], ['GA', 'Georgia'],
  ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'],
  ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'],
  ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'],
  ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'],
  ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];

const CLIMBING_AREAS = {
  CO: {
    name: 'Colorado',
    mpUrl: 'https://www.mountainproject.com/area/105708956/colorado',
    children: [
      {
        id: 'golden',
        name: 'Golden',
        lat: 39.7555,
        lon: -105.2211,
        mpUrl: 'https://www.mountainproject.com/area/105800295/golden',
        children: [
          {
            id: 'clear-creek-canyon',
            name: 'Clear Creek Canyon',
            lat: 39.7528,
            lon: -105.2344,
            mpUrl: 'https://www.mountainproject.com/area/105744243/clear-creek-canyon',
            children: [
              {
                id: 'the-canal-zone',
                name: 'Canal Zone, The',
                lat: 39.7503,
                lon: -105.2478,
                mpUrl: 'https://www.mountainproject.com/area/106210042/the-canal-zone',
              },
              {
                id: 'river-wall',
                name: 'River Wall',
                lat: 39.7516,
                lon: -105.2424,
                mpUrl: 'https://www.mountainproject.com/area/105744714/river-wall',
              },
            ],
          },
          {
            id: 'north-table-mountain',
            name: 'North Table Mountain/Golden Cliffs',
            lat: 39.7802,
            lon: -105.2171,
            mpUrl: 'https://www.mountainproject.com/area/105744241/north-table-mountaingolden-cliffs',
          },
        ],
      },
    ],
  },
};

let fromLocation = readFromLocation();
let selectedLocation = null;

function byId(id) { return document.getElementById(id); }
function coordForRequest(value) { return Number(value).toFixed(3); }
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function escapeAttr(value) { return escapeHtml(value).replace(/`/g, '&#96;'); }

function readFromLocation() {
  try {
    const saved = JSON.parse(localStorage.getItem(FROM_KEY) || 'null');
    if (saved && Number.isFinite(saved.lat) && Number.isFinite(saved.lon)) return saved;
  } catch (_) {}
  return { ...DEFAULT_FROM };
}

function saveFromLocation(loc) {
  fromLocation = loc;
  localStorage.setItem(FROM_KEY, JSON.stringify(loc));
  byId('from-input').value = loc.label;
}

function setStatus(message) { byId('status').textContent = message || ''; }
function setFromStatus(message) { byId('from-status').textContent = message || ''; }

function fillSelect(select, items, placeholder) {
  select.innerHTML = '';
  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = placeholder;
  select.appendChild(empty);
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id || item[0];
    option.textContent = item.name || item[1];
    select.appendChild(option);
  });
}

function initRegionSelect() {
  const region = byId('region-select');
  region.innerHTML = '';
  [
    ['', 'All locations'],
    ['international', 'International'],
    ...US_STATES,
  ].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    region.appendChild(option);
  });
}

function hideLowerRows(level = 0) {
  const rows = ['area-row', 'subarea-row', 'crag-row'];
  rows.slice(level).forEach(id => { byId(id).hidden = true; });
}

function findChild(parent, id) {
  return (parent?.children || []).find(child => child.id === id) || null;
}

function currentPath() {
  const stateCode = byId('region-select').value;
  if (!stateCode || stateCode === 'international') return [];
  const state = CLIMBING_AREAS[stateCode];
  if (!state) return [];
  const area = findChild(state, byId('area-select').value);
  const subarea = findChild(area, byId('subarea-select').value);
  const crag = findChild(subarea, byId('crag-select').value);
  return [state, area, subarea, crag].filter(Boolean);
}

function pickDeepestLocation() {
  const path = currentPath();
  return [...path].reverse().find(item => Number.isFinite(item.lat) && Number.isFinite(item.lon)) || null;
}

function onRegionChange() {
  hideLowerRows(0);
  selectedLocation = null;
  byId('summary-section').hidden = true;
  byId('weather-section').hidden = true;

  const stateCode = byId('region-select').value;
  if (!stateCode) {
    setStatus('Choose a climbing location.');
    return;
  }
  if (stateCode === 'international') {
    setStatus('International areas are listed here to mirror Mountain Project, but detailed area data is not seeded yet.');
    return;
  }
  const state = CLIMBING_AREAS[stateCode];
  if (!state) {
    setStatus('This state is available in the Mountain Project-style chooser, but detailed area data is not seeded yet.');
    return;
  }
  fillSelect(byId('area-select'), state.children || [], 'Choose an area');
  byId('area-row').hidden = false;
  setStatus('Choose an area.');
}

function onAreaChange() {
  hideLowerRows(1);
  const area = currentPath()[1];
  if (!area) { setStatus('Choose an area.'); return; }
  if (area.children?.length) {
    fillSelect(byId('subarea-select'), area.children, 'Choose a climbing area');
    byId('subarea-row').hidden = false;
  }
  loadSelectedLocation();
}

function onSubareaChange() {
  hideLowerRows(2);
  const subarea = currentPath()[2];
  if (!subarea) { loadSelectedLocation(); return; }
  if (subarea.children?.length) {
    fillSelect(byId('crag-select'), subarea.children, 'Optional: choose a crag');
    byId('crag-row').hidden = false;
  }
  loadSelectedLocation();
}

function onCragChange() {
  loadSelectedLocation();
}

async function loadSelectedLocation() {
  const loc = pickDeepestLocation();
  if (!loc) return;
  selectedLocation = loc;
  renderSummary(loc);
  setStatus('Loading conditions...');
  await Promise.all([
    loadWeather(loc).catch(() => renderWeatherError()),
    loadDriveTime(loc),
  ]);
  setStatus('');
}

function renderSummary(loc) {
  const path = currentPath().map(item => item.name).join(' > ');
  byId('location-title').textContent = loc.name;
  byId('mp-link').href = loc.mpUrl || '#';
  byId('location-meta').innerHTML = `
    <strong>${escapeHtml(path)}</strong><br>
    ${Number(loc.lat).toFixed(4)}, ${Number(loc.lon).toFixed(4)}
  `;
  byId('summary-section').hidden = false;
}

async function loadWeather(loc) {
  const coords = `latitude=${coordForRequest(loc.lat)}&longitude=${coordForRequest(loc.lon)}`;
  const url = `https://api.open-meteo.com/v1/forecast?${coords}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max&timezone=auto&past_days=1&forecast_days=2&temperature_unit=fahrenheit&wind_speed_unit=mph`;
  const data = await SharedLocation.fetchJson(url, { ttlMs: WEATHER_CACHE_TTL_MS });
  const dates = data?.daily?.time || [];
  const today = new Date().toLocaleDateString('sv');
  const wanted = new Set([
    new Date(Date.now() - 864e5).toLocaleDateString('sv'),
    today,
    new Date(Date.now() + 864e5).toLocaleDateString('sv'),
  ]);
  const grid = byId('weather-grid');
  grid.innerHTML = '';
  dates.forEach((dateStr, index) => {
    if (!wanted.has(dateStr)) return;
    const card = document.createElement('div');
    const label = dateStr === today
      ? 'Today'
      : dateStr < today
        ? 'Yesterday'
        : 'Tomorrow';
    const high = Math.round(data.daily.temperature_2m_max?.[index]);
    const low = Math.round(data.daily.temperature_2m_min?.[index]);
    const precip = data.daily.precipitation_probability_max?.[index];
    const wind = data.daily.wind_speed_10m_max?.[index];
    const condition = weatherConditionForCode(data.daily.weather_code?.[index]);
    card.className = 'day-card' + (dateStr < today ? ' day-card-past' : '');
    card.innerHTML = `
      <div class="day-label">${label}</div>
      <div class="day-condition">${escapeHtml(condition)}</div>
      <div class="day-temps">${Number.isFinite(high) ? high + '&deg;' : '&mdash;'} / ${Number.isFinite(low) ? low + '&deg;' : '&mdash;'}</div>
      <div class="day-detail">Max wind ${wind != null ? Math.round(wind) + ' mph' : '&mdash;'}</div>
      <div class="day-precip">Precip ${precip != null ? Math.round(precip) + '%' : '&mdash;'}</div>
    `;
    grid.appendChild(card);
  });
  byId('weather-fetched-at').textContent = formatFetchedAt();
  byId('weather-section').hidden = false;
}

function renderWeatherError() {
  const grid = byId('weather-grid');
  grid.innerHTML = '<div class="weather-error">Weather could not be loaded right now.</div>';
  byId('weather-fetched-at').textContent = '';
  byId('weather-section').hidden = false;
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
  return 'Weather available';
}

function formatFetchedAt(date = new Date()) {
  return `Fetched ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}`;
}

async function loadDriveTime(loc) {
  const drive = byId('drive-card');
  drive.innerHTML = `<strong>Drive</strong><br>Calculating from ${escapeHtml(fromLocation.label)}...`;
  try {
    const route = await routeFromTo(fromLocation, loc);
    drive.innerHTML = `
      <strong>Drive from ${escapeHtml(fromLocation.label)}</strong><br>
      ${Math.round(route.duration / 60)} min · ${Math.round(route.distance / 1609.344)} mi
    `;
  } catch (_) {
    const miles = haversineMiles(fromLocation, loc);
    drive.innerHTML = `
      <strong>Drive from ${escapeHtml(fromLocation.label)}</strong><br>
      Route unavailable. Straight-line distance is about ${Math.round(miles)} mi.
    `;
  }
}

async function routeFromTo(from, to) {
  const coords = `${from.lon},${from.lat};${to.lon},${to.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false&alternatives=false&steps=false`;
  const data = await SharedLocation.fetchJson(url, { ttlMs: ROUTE_CACHE_TTL_MS });
  const route = data?.routes?.[0];
  if (!route) throw new Error('No route found');
  return route;
}

function haversineMiles(a, b) {
  const rad = value => value * Math.PI / 180;
  const R = 3958.8;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const h = s1 * s1 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function geocodeFromLocation() {
  const value = byId('from-input').value.trim();
  if (!value) return;
  const parsed = SharedLocation.parseCoordinateText(value);
  if (parsed) {
    saveFromLocation({ ...parsed, label: value });
    setFromStatus(`From location updated to ${parsed.lat.toFixed(4)}, ${parsed.lon.toFixed(4)}.`);
    if (selectedLocation) loadDriveTime(selectedLocation);
    return;
  }

  const button = byId('from-button');
  button.disabled = true;
  setFromStatus('Looking up from location...');
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=1&lang=en`;
    const data = await SharedLocation.fetchJson(url, {
      ttlMs: LOCATION_LOOKUP_TTL_MS,
      fetchOptions: { headers: { 'User-Agent': 'Weather-Dashboard-Climbing/1.0' } },
    });
    const feature = data?.features?.[0];
    const coords = feature?.geometry?.coordinates;
    if (!coords) throw new Error('No matching location found.');
    const props = feature.properties || {};
    const label = [props.name, props.city || props.state, props.country].filter(Boolean).join(', ') || value;
    saveFromLocation({ label, lat: coords[1], lon: coords[0] });
    setFromStatus(`From location updated to ${label}.`);
    if (selectedLocation) loadDriveTime(selectedLocation);
  } catch (error) {
    setFromStatus(error.message || 'Could not update from location.');
  } finally {
    button.disabled = false;
  }
}

initRegionSelect();
byId('from-input').value = fromLocation.label;
byId('from-button').addEventListener('click', geocodeFromLocation);
byId('from-input').addEventListener('keydown', event => {
  if (event.key === 'Enter') geocodeFromLocation();
});
byId('region-select').addEventListener('change', onRegionChange);
byId('area-select').addEventListener('change', onAreaChange);
byId('subarea-select').addEventListener('change', onSubareaChange);
byId('crag-select').addEventListener('change', onCragChange);
