const SITES = [
  { name: 'Corsair Wreck, Oahu, HI', lat: 21.2860, lon: -157.6760, tide: '1612340', note: 'Honolulu tide station' },
  { name: 'Electric Beach, Oahu, HI', lat: 21.3544, lon: -158.1307, tide: '1612482', note: 'Waianae tide station' },
  { name: 'Hanauma Bay, Oahu, HI', lat: 21.2690, lon: -157.6938, tide: '1612340', note: 'Honolulu tide station' },
  { name: 'Kaneohe Sandbar, Oahu, HI', lat: 21.4580, lon: -157.8040, tide: '1612480', note: 'Mokuoloe, Kaneohe Bay tide station' },
  { name: 'Koko Craters, Oahu, HI', lat: 21.2580, lon: -157.7010, tide: '1612340', note: 'Honolulu tide station' },
  { name: 'Makaha Caverns, Oahu, HI', lat: 21.4720, lon: -158.2230, tide: '1612482', note: 'Waianae tide station' },
  { name: 'Mahi Wreck, Oahu, HI', lat: 21.3517, lon: -158.1430, tide: '1612482', note: 'Waianae tide station' },
  { name: 'Sea Tiger Wreck, Oahu, HI', lat: 21.2847, lon: -157.8673, tide: '1612340', note: 'Honolulu tide station' },
  { name: "Shark's Cove, Oahu, HI", lat: 21.6498, lon: -158.0637, tide: '1612668', note: 'Haleiwa tide station' },
  { name: 'Three Tables, Oahu, HI', lat: 21.6458, lon: -158.0612, tide: '1612668', note: 'Haleiwa tide station' },
  { name: 'Turtle Canyon, Waikiki, HI', lat: 21.2769, lon: -157.8380, tide: '1612340', note: 'Honolulu tide station' },
  { name: 'YO-257 / San Pedro Wrecks, Oahu, HI', lat: 21.2612, lon: -157.8374, tide: '1612340', note: 'Honolulu tide station' },
  { name: 'Custom location', lat: 21.2690, lon: -157.6938, tide: '', note: 'Enter coordinates and an optional NOAA station' },
];

const WMO = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 80: 'Rain showers', 81: 'Showers',
  82: 'Heavy showers', 95: 'Thunderstorm', 96: 'Thunderstorm hail', 99: 'Thunderstorm hail',
};

const STATE_ABBR = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
  'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
  'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO',
  'Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ',
  'New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH',
  'Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
  'District of Columbia':'DC','Puerto Rico':'PR'
};

let diveSuggestTimer = null;
let diveSuggestions = [];
let diveActiveIdx = -1;

function byId(id) { return document.getElementById(id); }
function fmt(v, unit = '', digits = 0) { return v == null || Number.isNaN(v) ? '—' : `${Number(v).toFixed(digits)}${unit}`; }
function round(v, digits = 0) { return v == null || Number.isNaN(v) ? null : Number(Number(v).toFixed(digits)); }
function ft(m) { return m == null ? null : m * 3.28084; }
function mph(kmh) { return kmh == null ? null : kmh / 1.60934; }
function f(c) { return c == null ? null : c * 9 / 5 + 32; }
function mphToKt(value) { return value == null ? null : value / 1.15078; }
function parseCoords() {
  const parts = byId('coords').value.split(',').map(v => Number(v.trim()));
  if (parts.length !== 2 || parts.some(Number.isNaN)) throw new Error('Enter coordinates as lat, lon.');
  return { lat: parts[0], lon: parts[1] };
}
function selectedSite() {
  return SITES[Number(byId('site-sel').value)];
}
function getCurrentDiveLocation() {
  try {
    const { lat, lon } = parseCoords();
    const site = selectedSite();
    const label = byId('city').value.trim() || site?.name || 'Shared location';
    return {
      lat,
      lon,
      label,
      source: 'diving',
      tideStation: byId('tide-station').value.trim(),
      siteName: site?.name || '',
    };
  } catch (error) {
    return null;
  }
}
function applySharedDiveLocation() {
  const shared = window.SharedLocation?.readLocation();
  if (!window.SharedLocation?.isEnabled() || !shared) return false;
  const customIdx = SITES.findIndex(site => site.name === 'Custom location');
  if (customIdx >= 0) byId('site-sel').value = String(customIdx);
  byId('coords').value = `${Number(shared.lat).toFixed(4)}, ${Number(shared.lon).toFixed(4)}`;
  byId('city').value = shared.label || '';
  byId('tide-station').value = shared.tideStation || '';
  byId('site-info').textContent = shared.siteName
    ? `Shared from ${shared.siteName}`
    : 'Shared location; add a NOAA tide station if needed';
  loadDiveConditions();
  return true;
}
function isoDate(d) { return d.toISOString().slice(0, 10); }
function localTime(s, timezone) {
  const value = s.endsWith('Z') ? s : `${s.replace(' ', 'T')}Z`;
  return new Date(value).toLocaleString([], {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone || undefined,
  });
}

function init() {
  const sel = byId('site-sel');
  sel.innerHTML = SITES.map((s, i) => `<option value="${i}">${s.name}</option>`).join('');
  sel.addEventListener('change', () => {
    const site = SITES[Number(sel.value)];
    byId('city').value = '';
    byId('coords').value = `${site.lat.toFixed(4)}, ${site.lon.toFixed(4)}`;
    byId('tide-station').value = site.tide;
    byId('site-info').textContent = site.note;
    loadDiveConditions();
  });
  sel.value = '0';
  window.SharedLocation?.initCheckbox({ getLocation: getCurrentDiveLocation });
  if (!applySharedDiveLocation()) sel.dispatchEvent(new Event('change'));

  byId('city')?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDiveSuggestions(); return; }
    const open = byId('city-suggestions').style.display !== 'none' && diveSuggestions.length;
    if (e.key === 'ArrowDown') {
      if (!open) return;
      e.preventDefault();
      setDiveActiveItem(Math.min(diveActiveIdx + 1, diveSuggestions.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      if (!open) return;
      e.preventDefault();
      setDiveActiveItem(Math.max(diveActiveIdx - 1, -1));
      return;
    }
    if (e.key === 'Enter') {
      if (open) {
        const r = diveSuggestions[diveActiveIdx >= 0 ? diveActiveIdx : 0];
        selectDiveSuggestion(r.geometry.coordinates[1], r.geometry.coordinates[0], diveCityLabel(r));
      } else {
        lookupDiveCity();
      }
    }
  });

  document.addEventListener('click', e => {
    if (e.target !== byId('city')) closeDiveSuggestions();
  });
}

function diveCityLabel(r) {
  const p = r.properties;
  const name = /^\d{5}/.test(p.name) ? (p.city || p.town || p.name) : p.name;
  const st = STATE_ABBR[p.state] || '';
  return st ? `${name}, ${st}` : name;
}

function diveDebounceSuggest() {
  clearTimeout(diveSuggestTimer);
  diveSuggestTimer = setTimeout(fetchDiveSuggestions, 320);
}

async function fetchDiveSuggestions() {
  const q = byId('city').value.trim();
  if (q.length < 2) { closeDiveSuggestions(); return; }
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=15&lang=en`,
      { headers: { 'User-Agent': 'Weather-Dashboard-Diving/1.0' } }
    );
    const data = await res.json();
    const us = data.features
      .filter(f => f.properties.countrycode === 'US' && f.properties.name)
      .slice(0, 7);
    renderDiveSuggestions(us);
  } catch (e) {
    closeDiveSuggestions();
  }
}

function setDiveActiveItem(idx) {
  diveActiveIdx = idx;
  document.querySelectorAll('#city-suggestions .sug-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
}

function renderDiveSuggestions(results) {
  diveActiveIdx = -1;
  diveSuggestions = results;
  const box = byId('city-suggestions');
  if (!results.length) { closeDiveSuggestions(); return; }
  box.innerHTML = '';
  for (const r of results) {
    const label = diveCityLabel(r);
    const el = document.createElement('div');
    el.className = 'sug-item';
    el.textContent = label;
    el.addEventListener('mouseover', () => {
      diveActiveIdx = -1;
      document.querySelectorAll('#city-suggestions .sug-item').forEach(item => item.classList.remove('active'));
      el.classList.add('active');
    });
    el.addEventListener('mouseout', () => el.classList.remove('active'));
    el.onmousedown = e => {
      e.preventDefault();
      selectDiveSuggestion(r.geometry.coordinates[1], r.geometry.coordinates[0], label);
    };
    box.appendChild(el);
  }
  const rect = byId('city').getBoundingClientRect();
  box.style.position = 'fixed';
  box.style.zIndex = '9999';
  box.style.top = `${rect.bottom + 3}px`;
  box.style.left = `${rect.left}px`;
  box.style.background = '#1f2527';
  box.style.border = '1px solid #566367';
  box.style.borderRadius = '4px';
  box.style.boxShadow = '0 6px 20px rgba(0,0,0,0.65)';
  box.style.minWidth = '220px';
  box.style.overflow = 'hidden';
  box.style.display = 'block';
}

function selectDiveSuggestion(lat, lon, label) {
  byId('city').value = label;
  byId('coords').value = `${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(6)}`;
  setDiveCustomLocation();
  closeDiveSuggestions();
  loadDiveConditions();
}

function closeDiveSuggestions() {
  diveActiveIdx = -1;
  diveSuggestions = [];
  const box = byId('city-suggestions');
  if (box) box.style.display = 'none';
}

function setDiveCustomLocation() {
  const sel = byId('site-sel');
  const customIdx = SITES.findIndex(site => site.name === 'Custom location');
  if (customIdx >= 0) sel.value = String(customIdx);
  byId('tide-station').value = '';
  byId('site-info').textContent = 'Custom city location; add a NOAA tide station if needed';
}

async function lookupDiveCity() {
  const q = byId('city').value.trim();
  if (!q) return;
  closeDiveSuggestions();
  byId('status').textContent = 'Looking up city...';
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10&lang=en`,
      { headers: { 'User-Agent': 'Weather-Dashboard-Diving/1.0' } }
    );
    const data = await res.json();
    const r = data.features.find(f => f.properties.countrycode === 'US' && f.properties.name);
    if (!r) {
      byId('status').textContent = 'City not found';
      return;
    }
    selectDiveSuggestion(r.geometry.coordinates[1], r.geometry.coordinates[0], diveCityLabel(r));
  } catch (e) {
    byId('status').textContent = 'City lookup failed';
  }
}

async function useDiveBrowserLocation() {
  closeDiveSuggestions();
  const button = byId('use-location');
  if (button) {
    button.disabled = true;
    button.classList.add('is-locating');
    button.setAttribute('aria-label', 'Locating...');
  }
  byId('status').textContent = 'Requesting location permission...';
  try {
    const location = await window.SharedLocation.getBrowserLocation();
    byId('city').value = location.label;
    byId('coords').value = `${location.lat.toFixed(6)}, ${location.lon.toFixed(6)}`;
    setDiveCustomLocation();
    loadDiveConditions();
  } catch (error) {
    byId('status').textContent = error.message || 'Could not use your location.';
  } finally {
    if (button) {
      button.disabled = false;
      button.classList.remove('is-locating');
      button.setAttribute('aria-label', 'Use my location');
    }
  }
}

async function loadDiveConditions() {
  try {
    byId('status').textContent = 'Loading marine, weather, air quality, and tide data...';
    const { lat, lon } = parseCoords();
    const tideStation = byId('tide-station').value.trim();
    window.SharedLocation?.saveLocation(getCurrentDiveLocation());
    const [marine, weather, air, tides] = await Promise.all([
      fetchMarine(lat, lon),
      fetchWeather(lat, lon),
      fetchAirQuality(lat, lon),
      tideStation ? fetchTides(tideStation) : Promise.resolve(null),
    ]);
    render({ marine, weather, air, tides, tideStation });
    byId('status').textContent = `Updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } catch (err) {
    byId('status').textContent = err.message || 'Could not load diving conditions.';
  }
}

async function fetchJson(url) {
  if (window.SharedLocation) return SharedLocation.fetchJson(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function fetchMarine(lat, lon) {
  const hourly = [
    'wave_height', 'wave_period', 'swell_wave_height', 'swell_wave_period',
    'wind_wave_height', 'wind_wave_period', 'ocean_current_velocity',
    'ocean_current_direction', 'sea_surface_temperature',
  ].join(',');
  return fetchJson(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=${hourly}&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`);
}

function fetchWeather(lat, lon) {
  const current = 'temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code';
  const hourly = 'wind_speed_10m,wind_gusts_10m,precipitation,rain,weather_code';
  return fetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${current}&hourly=${hourly}&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=3`);
}

function fetchAirQuality(lat, lon) {
  const hourly = 'us_aqi,pm2_5';
  return fetchJson(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=${hourly}&timezone=auto&forecast_days=3`);
}

function fetchTides(station) {
  const now = new Date();
  const start = isoDate(now);
  const end = isoDate(new Date(now.getTime() + 36 * 3600 * 1000));
  return fetchJson(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=weather_dashboard&begin_date=${start}&end_date=${end}&datum=MLLW&station=${encodeURIComponent(station)}&time_zone=gmt&units=english&interval=hilo&format=json`);
}

function firstCurrent(data) {
  return data?.current || {};
}

function nearestHourly(hourly, key) {
  if (!hourly?.time?.length) return null;
  const now = Date.now();
  let best = 0;
  for (let i = 1; i < hourly.time.length; i++) {
    if (Math.abs(new Date(hourly.time[i]) - now) < Math.abs(new Date(hourly.time[best]) - now)) best = i;
  }
  return hourly[key]?.[best] ?? null;
}

function tideDate(row) {
  return new Date(`${row.t.replace(' ', 'T')}Z`);
}

function nextTide(tides, type, timezone) {
  const rows = tides?.predictions || [];
  const now = Date.now();
  const found = rows.find(r => r.type === type && tideDate(r).getTime() > now);
  return found ? `${localTime(found.t, timezone)} · ${Number(found.v).toFixed(1)} ft` : '—';
}

function currentTide(tides, timezone) {
  const rows = tides?.predictions || [];
  if (!rows.length) return { value: '—', note: 'No tide station loaded' };
  const now = Date.now();
  const next = rows.find(r => tideDate(r).getTime() > now);
  const prev = [...rows].reverse().find(r => tideDate(r).getTime() <= now);
  if (!next) return { value: 'Falling/late cycle', note: `Last ${prev?.type || 'tide'} ${prev ? localTime(prev.t, timezone) : ''}` };
  const label = next.type === 'H' ? 'Rising' : 'Falling';
  return { value: label, note: `Next ${next.type === 'H' ? 'high' : 'low'} ${localTime(next.t, timezone)} · ${Number(next.v).toFixed(1)} ft` };
}

function render(data) {
  const c = firstCurrent(data.weather);
  const m = data.marine?.hourly || {};
  const swellH = ft(nearestHourly(m, 'swell_wave_height'));
  const waveH = ft(nearestHourly(m, 'wave_height'));
  const windWaveH = ft(nearestHourly(m, 'wind_wave_height'));
  const swellPeriod = nearestHourly(m, 'swell_wave_period');
  const currentKts = mphToKt(nearestHourly(m, 'ocean_current_velocity'));
  const waterTemp = nearestHourly(m, 'sea_surface_temperature');
  const waterVals = (m.sea_surface_temperature || []).slice(0, 24).filter(v => v != null);
  const waterRange = waterVals.length ? `${fmt(Math.min(...waterVals), '°', 0)}-${fmt(Math.max(...waterVals), '°', 0)}` : '—';
  const timezone = data.weather?.timezone;
  const tide = currentTide(data.tides, timezone);

  byId('summary-window').textContent = tide.note;
  byId('summary-grid').innerHTML = [
    metric('Air Temp', fmt(c.temperature_2m, '°', 0), WMO[c.weather_code] || 'Current weather'),
    metric('Wind', `${fmt(c.wind_speed_10m, ' mph', 0)}`, `${fmt(c.wind_gusts_10m, ' mph gusts', 0)} · ${fmt(c.wind_direction_10m, '°', 0)}`),
    metric('Swell Height', fmt(swellH ?? waveH, ' ft', 1), swellH == null ? 'Using combined wave height' : `Combined waves ${fmt(waveH, ' ft', 1)}`),
    metric('Swell Period', fmt(swellPeriod, ' sec', 0), periodLabel(swellPeriod)),
    metric('Chop', fmt(windWaveH, ' ft', 1), chopLabel(windWaveH, c.wind_speed_10m)),
    metric('Tide', tide.value, `Low ${nextTide(data.tides, 'L', timezone)} · High ${nextTide(data.tides, 'H', timezone)}`),
    metric('Current', fmt(currentKts, ' kt', 1), currentKts == null ? 'Model current unavailable here' : currentLabel(currentKts)),
    metric('Water Temp', fmt(waterTemp, '°', 0), `24h range ${waterRange}`),
  ].join('');

  renderVisibility(data, { swellH, windWaveH, swellPeriod });
  renderRisks(data);
}

function metric(label, value, note) {
  return `<div class="metric-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></div>`;
}

function signal(label, badge, className, note) {
  return `<div class="signal-card"><div class="signal-top"><div class="signal-label">${label}</div><div class="signal-badge ${className}">${badge}</div></div><div class="signal-note">${note}</div></div>`;
}

function periodLabel(sec) {
  if (sec == null) return 'No period data';
  if (sec >= 12) return 'Long-period energy: watch entry and surge';
  if (sec >= 8) return 'Moderate-period swell';
  return 'Short-period, locally choppy feel';
}

function chopLabel(windWaveFt, windMph) {
  if ((windWaveFt ?? 0) >= 2 || (windMph ?? 0) >= 18) return 'Surface chop likely';
  if ((windWaveFt ?? 0) >= 1 || (windMph ?? 0) >= 12) return 'Some texture on the surface';
  return 'Relatively smooth surface signal';
}

function currentLabel(kts) {
  if (kts >= 1.5) return 'Strong current signal';
  if (kts >= 0.7) return 'Moderate current signal';
  return 'Light current signal';
}

function renderVisibility(data, marineBits) {
  const w = data.weather?.hourly || {};
  const recentWind = avgRecent(w, 'wind_speed_10m', 12);
  const rain24 = sumRecent(w, 'rain', 24);
  const precip24 = sumRecent(w, 'precipitation', 24);
  const tide = currentTide(data.tides, data.weather?.timezone);
  const swellBadge = marineBits.swellH >= 4 || marineBits.swellPeriod >= 12 ? ['Watch', 'watch'] : ['OK', 'good'];
  const windBadge = recentWind >= 18 ? ['Poor', 'bad'] : recentWind >= 12 ? ['Watch', 'watch'] : ['OK', 'good'];
  const rainBadge = precip24 >= 0.4 ? ['Poor', 'bad'] : precip24 >= 0.1 ? ['Watch', 'watch'] : ['OK', 'good'];

  byId('visibility-grid').innerHTML = [
    signal('Recent Wind', windBadge[0], windBadge[1], `Last 12h average around ${fmt(recentWind, ' mph', 0)}.`),
    signal('Swell', swellBadge[0], swellBadge[1], `Swell ${fmt(marineBits.swellH, ' ft', 1)} at ${fmt(marineBits.swellPeriod, ' sec', 0)}.`),
    signal('Runoff', rainBadge[0], rainBadge[1], `Using rain as proxy: ${fmt(rain24 || precip24, '"', 2)} in the last 24h.`),
    signal('Rain', rainBadge[0], rainBadge[1], `Recent precipitation total: ${fmt(precip24, '"', 2)}.`),
    signal('Tides', data.tides ? 'Loaded' : 'No data', data.tides ? 'good' : 'watch', tide.note),
    signal('Local Reports', 'Manual', 'watch', 'No public report feed is connected yet. A shop/club note field would fit here.'),
  ].join('');
}

function renderRisks(data) {
  const w = data.weather?.hourly || {};
  const codes = upcoming(w, 'weather_code', 12);
  const thunder = codes.some(v => [95, 96, 99].includes(v));
  const a = data.air?.hourly || {};
  const aqi = nearestHourly(a, 'us_aqi');
  const pm25 = nearestHourly(a, 'pm2_5');
  const smokeClass = aqi >= 101 || pm25 >= 35 ? 'bad' : aqi >= 51 || pm25 >= 12 ? 'watch' : 'good';
  const smokeBadge = smokeClass === 'bad' ? 'Poor' : smokeClass === 'watch' ? 'Watch' : 'OK';
  byId('risk-grid').innerHTML = [
    signal('Thunderstorm / Lightning', thunder ? 'Risk' : 'OK', thunder ? 'bad' : 'good', thunder ? 'Thunderstorm code appears in the next 12h forecast.' : 'No thunderstorm code in the next 12h forecast.'),
    signal('Air Quality / Smoke', smokeBadge, smokeClass, `US AQI ${fmt(aqi, '', 0)} · PM2.5 ${fmt(pm25, ' µg/m³', 1)}.`),
    signal('Entry / Exit Stress', entryRisk(data), entryRisk(data) === 'High' ? 'bad' : entryRisk(data) === 'Watch' ? 'watch' : 'good', 'Uses wind, wind-wave chop, and combined wave height as a rough surface proxy.'),
  ].join('');
}

function avgRecent(hourly, key, hours) {
  const vals = recent(hourly, key, hours);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function sumRecent(hourly, key, hours) {
  const vals = recent(hourly, key, hours);
  return vals.length ? vals.reduce((a, b) => a + b, 0) : null;
}

function recent(hourly, key, hours) {
  if (!hourly?.time || !hourly[key]) return [];
  const cutoff = Date.now() - hours * 3600 * 1000;
  return hourly.time
    .map((t, i) => ({ t: new Date(t).getTime(), v: hourly[key][i] }))
    .filter(x => x.t >= cutoff && x.t <= Date.now() && x.v != null)
    .map(x => x.v);
}

function upcoming(hourly, key, hours) {
  if (!hourly?.time || !hourly[key]) return [];
  const end = Date.now() + hours * 3600 * 1000;
  return hourly.time
    .map((t, i) => ({ t: new Date(t).getTime(), v: hourly[key][i] }))
    .filter(x => x.t >= Date.now() && x.t <= end && x.v != null)
    .map(x => x.v);
}

function entryRisk(data) {
  const wind = firstCurrent(data.weather).wind_speed_10m || 0;
  const wave = ft(nearestHourly(data.marine?.hourly, 'wave_height')) || 0;
  const windWave = ft(nearestHourly(data.marine?.hourly, 'wind_wave_height')) || 0;
  if (wind >= 20 || wave >= 5 || windWave >= 2.5) return 'High';
  if (wind >= 14 || wave >= 3 || windWave >= 1.5) return 'Watch';
  return 'OK';
}

init();
