const OPENBETA_API_URL = 'https://api.openbeta.io';
const OPENBETA_HOME_URL = 'https://openbeta.io';
const DEFAULT_FROM = {
  label: 'Colorado State Capitol, Denver, CO',
  lat: 39.7393,
  lon: -104.9848,
};
const FROM_KEY = 'weather-dashboard:climbing-from';
const GRAPHQL_CACHE_PREFIX = 'weather-dashboard:openbeta-cache:';
const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;
const ROUTE_CACHE_TTL_MS = 5 * 60 * 1000;
const LOCATION_LOOKUP_TTL_MS = 12 * 60 * 60 * 1000;
const OPENBETA_TREE_TTL_MS = 24 * 60 * 60 * 1000;
const OPENBETA_AREA_TTL_MS = 12 * 60 * 60 * 1000;

const AREA_FIELDS = `
  uuid
  area_name
  totalClimbs
  metadata { lat lng mp_id }
  children {
    uuid
    area_name
    totalClimbs
    metadata { lat lng mp_id }
    children { uuid }
  }
`;

const LEVELS = [
  { rowId: 'area-row', selectId: 'area-select', label: 'Area', placeholder: 'Choose an area' },
  { rowId: 'subarea-row', selectId: 'subarea-select', label: 'Climbing area', placeholder: 'Choose a climbing area' },
  { rowId: 'crag-row', selectId: 'crag-select', label: 'Crag', placeholder: 'Optional: choose a crag' },
];

let fromLocation = readFromLocation();
let selectedLocation = null;
let countries = [];
let usaRoot = null;
let selectedPath = [];
let areaCache = new Map();
let pathOffset = 0;

function byId(id) { return document.getElementById(id); }
function coordForRequest(value) { return Number(value).toFixed(3); }
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

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

function gqlCacheKey(query, variables) {
  return GRAPHQL_CACHE_PREFIX + JSON.stringify({ query, variables });
}

function readGqlCache(query, variables, ttlMs) {
  try {
    const cached = JSON.parse(localStorage.getItem(gqlCacheKey(query, variables)) || 'null');
    if (cached?.storedAt && Date.now() - cached.storedAt < ttlMs) return cached.data;
  } catch (_) {}
  return null;
}

function writeGqlCache(query, variables, data) {
  try {
    localStorage.setItem(gqlCacheKey(query, variables), JSON.stringify({ storedAt: Date.now(), data }));
  } catch (_) {}
}

async function fetchOpenBeta(query, variables = {}, ttlMs = OPENBETA_AREA_TTL_MS) {
  const cached = readGqlCache(query, variables, ttlMs);
  if (cached) return cached;

  const res = await fetch(OPENBETA_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`OpenBeta request failed: ${res.status}`);
  const payload = await res.json();
  if (payload.errors?.length) throw new Error(payload.errors[0].message || 'OpenBeta returned an error.');
  writeGqlCache(query, variables, payload.data);
  return payload.data;
}

function normalizeArea(area) {
  if (!area?.area_name) return null;
  const lat = Number(area.metadata?.lat);
  const lon = Number(area.metadata?.lng);
  const rawChildren = Array.isArray(area.children) ? area.children : [];
  const node = {
    uuid: area.uuid,
    name: area.area_name,
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    mpId: String(area.metadata?.mp_id || '').trim(),
    totalClimbs: Number(area.totalClimbs) || 0,
    hasChildren: rawChildren.length > 0,
    children: rawChildren.map(normalizeArea).filter(Boolean),
  };
  if (node.uuid) areaCache.set(node.uuid, node);
  return node;
}

async function loadCountries() {
  const data = await fetchOpenBeta(`
    query Countries {
      countries { ${AREA_FIELDS} }
    }
  `, {}, OPENBETA_TREE_TTL_MS);
  countries = (data.countries || []).map(normalizeArea).filter(Boolean).sort(byName);
  usaRoot = countries.find(country => country.name === 'USA') || null;
  if (!usaRoot) throw new Error('OpenBeta did not return the USA area tree.');
}

async function loadArea(uuid) {
  if (!uuid) return null;
  const cached = areaCache.get(uuid);
  if (cached?.children?.length || cached?.hasChildren === false) return cached;

  const data = await fetchOpenBeta(`
    query Area($uuid: ID) {
      area(uuid: $uuid) { ${AREA_FIELDS} }
    }
  `, { uuid }, OPENBETA_AREA_TTL_MS);
  return normalizeArea(data.area);
}

function byName(a, b) {
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}

function setLevelLabel(levelIndex, label) {
  const level = LEVELS[levelIndex];
  const labelEl = document.querySelector(`label[for="${level.selectId}"]`);
  if (labelEl) labelEl.textContent = label;
}

function fillSelect(select, items, placeholder) {
  select.innerHTML = '';
  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = placeholder;
  select.appendChild(empty);

  items.slice().sort(byName).forEach(item => {
    const option = document.createElement('option');
    option.value = item.uuid;
    option.textContent = item.totalClimbs ? `${item.name} (${item.totalClimbs})` : item.name;
    select.appendChild(option);
  });
}

function hideLevels(fromIndex = 0) {
  LEVELS.slice(fromIndex).forEach(level => {
    byId(level.rowId).hidden = true;
    byId(level.selectId).innerHTML = '';
  });
}

function resetResults() {
  selectedLocation = null;
  selectedPath = [];
  byId('summary-section').hidden = true;
  byId('weather-section').hidden = true;
  byId('drive-card').innerHTML = '';
}

function hasCoordinates(node) {
  return node && Number.isFinite(node.lat) && Number.isFinite(node.lon);
}

function initRegionSelect() {
  const region = byId('region-select');
  region.innerHTML = '';

  [
    { value: '', label: 'All locations' },
    { value: 'international', label: 'International' },
    ...(usaRoot?.children || []).map(state => ({ value: state.uuid, label: state.name })),
  ].forEach(item => {
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.label;
    region.appendChild(option);
  });
}

async function initClimbingPage() {
  byId('from-input').value = fromLocation.label;
  wireEvents();
  setStatus('Loading OpenBeta locations...');
  try {
    await loadCountries();
    initRegionSelect();
    setStatus('Choose a climbing location.');
  } catch (error) {
    setStatus(error.message || 'OpenBeta locations could not be loaded.');
  }
}

function wireEvents() {
  byId('from-button').addEventListener('click', geocodeFromLocation);
  byId('from-input').addEventListener('keydown', event => {
    if (event.key === 'Enter') geocodeFromLocation();
  });
  byId('region-select').addEventListener('change', onRegionChange);
  LEVELS.forEach((level, index) => {
    byId(level.selectId).addEventListener('change', () => onLevelChange(index));
  });
}

async function onRegionChange() {
  hideLevels(0);
  resetResults();
  const value = byId('region-select').value;
  if (!value) {
    setStatus('Choose a climbing location.');
    return;
  }

  if (value === 'international') {
    const international = countries.filter(country => country.name !== 'USA');
    pathOffset = 0;
    setLevelLabel(0, 'Country');
    setLevelLabel(1, 'Area');
    setLevelLabel(2, 'Crag');
    fillSelect(byId('area-select'), international, 'Choose a country');
    byId('area-row').hidden = false;
    setStatus('Choose a country.');
    return;
  }

  const state = await loadArea(value);
  selectedPath = [state].filter(Boolean);
  pathOffset = selectedPath.length;
  setLevelLabel(0, 'Area');
  setLevelLabel(1, 'Climbing area');
  setLevelLabel(2, 'Crag');
  await renderNodeAndChildren(state, 0, 'Choose an area');
}

async function onLevelChange(levelIndex) {
  hideLevels(levelIndex + 1);
  const uuid = byId(LEVELS[levelIndex].selectId).value;
  const pathIndex = pathOffset + levelIndex;
  if (!uuid) {
    selectedPath = selectedPath.slice(0, pathIndex);
    const fallback = selectedPath[selectedPath.length - 1] || null;
    if (fallback) await loadSelectedLocation(fallback);
    return;
  }

  const node = await loadArea(uuid);
  selectedPath = selectedPath.slice(0, pathIndex);
  selectedPath[pathIndex] = node;
  const nextLevel = levelIndex + 1;
  await renderNodeAndChildren(node, nextLevel, LEVELS[nextLevel]?.placeholder);
}

async function renderNodeAndChildren(node, nextLevelIndex, placeholder) {
  if (!node) return;
  await loadSelectedLocation(node);

  if (!node.children?.length || nextLevelIndex >= LEVELS.length) {
    setStatus('');
    return;
  }

  const next = LEVELS[nextLevelIndex];
  fillSelect(byId(next.selectId), node.children, placeholder || next.placeholder);
  byId(next.rowId).hidden = false;
  setStatus(`Showing ${node.children.length} sub-area${node.children.length === 1 ? '' : 's'}.`);
}

async function loadSelectedLocation(loc) {
  if (!hasCoordinates(loc)) {
    setStatus('This OpenBeta location does not have coordinates yet.');
    return;
  }
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
  const path = selectedPath.filter(Boolean).map(item => item.name).join(' > ') || loc.name;
  const mpLink = byId('mp-link');
  byId('location-title').textContent = loc.name;
  byId('source-link').href = OPENBETA_HOME_URL;
  if (loc.mpId) {
    mpLink.href = `https://www.mountainproject.com/area/${encodeURIComponent(loc.mpId)}`;
    mpLink.hidden = false;
  } else {
    mpLink.hidden = true;
  }
  byId('location-meta').innerHTML = `
    <strong>${escapeHtml(path)}</strong><br>
    ${loc.totalClimbs ? `${loc.totalClimbs.toLocaleString()} climbs · ` : ''}${Number(loc.lat).toFixed(4)}, ${Number(loc.lon).toFixed(4)}
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

initClimbingPage();
