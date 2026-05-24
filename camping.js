const FIRE_RESTRICTIONS_URL = 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/USFS_Fire_Restrictions/FeatureServer/0/query';
const COUNTY_LOOKUP_URL = 'https://geo.fcc.gov/api/census/area';
const COLORADO_FIRE_RESTRICTIONS_PAGE = 'https://dfpc.colorado.gov/sections/wildfire-information-center/fire-restriction-information';
const COLORADO_COUNTY_RESTRICTIONS_MAP = 'https://www.google.com/maps/d/u/0/viewer?mid=1cEAhNHqp82AXABF8qU7k6sRFI4392V0e&femb=1&ll=38.98418241661294%2C-106.02354350736165&z=7';
const COLORADO_COUNTY_RESTRICTIONS_KML = 'https://www.google.com/maps/d/kml?mid=1cEAhNHqp82AXABF8qU7k6sRFI4392V0e&forcekml=1';
const COLORADO_BOUNDS = {
  minLon: -109.060253,
  maxLon: -102.041524,
  minLat: 36.992426,
  maxLat: 41.003444,
};
const TEXT_CACHE_PREFIX = 'weather-dashboard:text-cache:';
const FIRE_RESTRICTIONS_TTL_MS = 12 * 60 * 60 * 1000;
const LOCATION_LOOKUP_TTL_MS = 12 * 60 * 60 * 1000;
const COUNTY_LOOKUP_TTL_MS = LOCATION_LOOKUP_TTL_MS;
const WEATHER_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

const STAGE_DESCRIPTIONS = {
  1: 'Stage 1 — Partial restrictions in effect. Campfires are typically restricted to developed fire rings; charcoal and wood briquettes may be prohibited outside those rings. Check specific restrictions below.',
  2: 'Stage 2 — No campfires anywhere, including established fire rings. Wood stoves and gas stoves may be allowed only in developed recreation sites. Check specific restrictions below.',
  3: 'Stage 3 — Complete fire and smoking ban in effect. No open flame of any kind. Gas stoves with shutoff valves may still be allowed in some cases; verify before use.',
};

const STATE_NAMES = {
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  ID: 'Idaho',
  MT: 'Montana',
  NM: 'New Mexico',
  NV: 'Nevada',
  OR: 'Oregon',
  UT: 'Utah',
  WA: 'Washington',
  WY: 'Wyoming',
};

const STATE_FIRE_RESOURCES = {
  CO: [
    { label: 'Colorado Statewide Fire Restriction Info', url: COLORADO_FIRE_RESTRICTIONS_PAGE, note: 'Statewide map and links to county/local/federal restriction sources.' },
    { label: 'Colorado BLM Fire Restrictions', url: 'https://www.arcgis.com/apps/dashboards/88c3fd93c580475abb95ba053f3fe11a', note: 'Current restrictions on BLM-managed lands in Colorado.' },
  ],
  OR: [
    { label: 'Oregon ODF Public Fire Restrictions Map', url: 'https://gisapps.odf.oregon.gov/firerestrictions/PFR.html', note: 'ODF public fire restrictions by clicked/tapped location.' },
    { label: 'Oregon ODF Restrictions & Closures', url: 'https://www.oregon.gov/odf/fire/pages/restrictions.aspx', note: 'State guidance and links for public/industrial restrictions.' },
    { label: 'BLM Oregon/Washington Fire Restrictions', url: 'https://www.blm.gov/programs/fire/regional-info/oregon-washington/fire-restrictions', note: 'BLM restrictions and seasonal fire order details.' },
  ],
  AZ: [
    { label: 'Arizona/New Mexico Interagency Fire Restrictions', url: 'https://wildlandfire.az.gov/fire-restrictions', note: 'Federal and state managed lands; county/municipal restrictions are separate.' },
    { label: 'BLM Arizona Fire Restrictions', url: 'https://www.blm.gov/programs/public-safety-and-fire/fire/regional-info/arizona/fire-restrictions', note: 'BLM Arizona restrictions and district links.' },
  ],
  NM: [
    { label: 'Arizona/New Mexico Interagency Fire Restrictions', url: 'https://wildlandfire.az.gov/fire-restrictions', note: 'Federal and state managed lands; county/municipal restrictions are separate.' },
    { label: 'BLM New Mexico Fire Restrictions', url: 'https://www.blm.gov/programs/fire/fire-restrictions', note: 'BLM regional fire restriction directory.' },
  ],
  UT: [
    { label: 'Utah Fire Restrictions', url: 'https://utahfireinfo.gov/fire-restrictions/', note: 'Interagency restriction map and current restriction information.' },
    { label: 'BLM Utah Fire Restrictions', url: 'https://www.blm.gov/fire-restrictions-bureau-land-management-utah', note: 'BLM Utah fire prevention orders and district information.' },
  ],
  CA: [
    { label: 'CAL FIRE Incidents and Statewide Fire Information', url: 'https://www.fire.ca.gov/incidents', note: 'State wildfire information; check local county and land manager restrictions too.' },
    { label: 'BLM California Fire Restrictions', url: 'https://www.blm.gov/programs/public-safety-and-fire/fire-and-aviation/regional-info/california/fire-restrictions', note: 'BLM California restrictions and prevention orders.' },
  ],
  WA: [
    { label: 'Washington DNR Burn Restrictions', url: 'https://burnportal.dnr.wa.gov/', note: 'Washington DNR burn and fire restriction portal.' },
    { label: 'BLM Oregon/Washington Fire Restrictions', url: 'https://www.blm.gov/programs/fire/regional-info/oregon-washington/fire-restrictions', note: 'BLM restrictions for Oregon/Washington.' },
  ],
  ID: [
    { label: 'Idaho Fire Restrictions', url: 'https://www.idahofireinfo.com/p/fire-restrictions.html', note: 'Interagency fire restriction information for Idaho.' },
    { label: 'BLM Idaho Fire Restrictions', url: 'https://www.blm.gov/programs/fire/fire-restrictions', note: 'BLM regional fire restriction directory.' },
  ],
  MT: [
    { label: 'Montana Fire Restrictions', url: 'https://www.mtfireinfo.org/pages/fire-restrictions', note: 'Statewide restriction information and local links.' },
    { label: 'BLM Montana/Dakotas Fire Restrictions', url: 'https://www.blm.gov/programs/fire/fire-restrictions', note: 'BLM regional fire restriction directory.' },
  ],
  WY: [
    { label: 'Wyoming Fire Restrictions', url: 'https://wsfd.wyo.gov/fire-management/fire-restrictions', note: 'State Forestry fire restriction information.' },
    { label: 'BLM Wyoming Fire Restrictions', url: 'https://www.blm.gov/programs/fire/fire-restrictions', note: 'BLM regional fire restriction directory.' },
  ],
  NV: [
    { label: 'Nevada Fire Restrictions', url: 'https://www.nevadafireinfo.org/restrictions-and-closures', note: 'Interagency restrictions and closures.' },
    { label: 'BLM Nevada Fire Restrictions', url: 'https://www.blm.gov/programs/fire/fire-restrictions', note: 'BLM regional fire restriction directory.' },
  ],
};

const FEDERAL_FIRE_RESOURCES = [
  { label: 'BLM Fire Restrictions', url: 'https://www.blm.gov/programs/fire/fire-restrictions', note: 'BLM national directory for regional fire restriction pages.' },
  { label: 'National Park Service Alerts', url: 'https://www.nps.gov/findapark/index.htm', note: 'Check the specific park/unit alerts page if camping in or near a National Park unit.' },
];

let campSuggestTimer = null;
let campSuggestions = [];
let campActiveIdx = -1;

function byId(id) { return document.getElementById(id); }

function parseCoords() {
  const coords = window.SharedLocation?.parseCoordinateText(byId('coords').value);
  if (!coords) throw new Error('Enter coordinates as lat, lon or paste coordinates like 39°52\'16.1"N 105°11\'03.9"W.');
  return coords;
}

function getCurrentCampLocation() {
  try {
    const { lat, lon } = parseCoords();
    const label = byId('city').value.trim() || 'Custom location';
    return { lat, lon, label };
  } catch (_) {
    return null;
  }
}

function getCampLocationFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const hasLocationParams = params.has('lat') || params.has('lon');
  if (!hasLocationParams) return null;

  const lat = Number(params.get('lat'));
  const lon = Number(params.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  return {
    lat,
    lon,
    label: params.get('location') || 'Shared location',
  };
}

function applyCampLocationToInputs(loc) {
  byId('coords').value = `${Number(loc.lat).toFixed(4)}, ${Number(loc.lon).toFixed(4)}`;
  byId('city').value = loc.label || '';
}

function syncCampLocationToUrl(loc, mode = 'push') {
  if (!loc || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lon)) return;

  const url = new URL(window.location.href);
  url.searchParams.set('lat', Number(loc.lat).toFixed(6));
  url.searchParams.set('lon', Number(loc.lon).toFixed(6));
  const label = String(loc.label || '').trim();
  if (label) url.searchParams.set('location', label);
  else url.searchParams.delete('location');

  if (url.href === window.location.href) return;
  const method = mode === 'replace' ? 'replaceState' : 'pushState';
  history[method]({ campLocation: loc }, '', url);
}

function setStatus(msg) {
  byId('status').textContent = msg;
  byId('status').style.display = msg ? '' : 'none';
}

function hideResults() {
  byId('fire-section').hidden = true;
  byId('weather-section').hidden = true;
  byId('fire-location-summary').innerHTML = '';
  byId('colorado-map-snapshot').innerHTML = '';
  byId('colorado-map-snapshot').hidden = true;
  byId('fire-resources').innerHTML = '';
}

async function loadCampingConditions(options = {}) {
  const { syncUrl = true, urlMode = 'push' } = options;
  const loc = getCurrentCampLocation();
  if (!loc) { setStatus('Enter a location to load camping conditions.'); return; }

  if (syncUrl) syncCampLocationToUrl(loc, urlMode);
  SharedLocation.saveLocation({ ...loc, source: 'camping' });
  setStatus('Loading...');
  hideResults();

  try {
    await Promise.all([
      loadFireRestrictions(loc),
      loadCampingWeather(loc),
    ]);
    setStatus('');
  } catch (err) {
    setStatus('Error: ' + err.message);
  }
}

async function loadFireRestrictions(loc) {
  const place = await loadCountyPlace(loc);
  const countyRestriction = await loadCountyRestriction(place);
  const params = new URLSearchParams({
    geometry: `${loc.lon},${loc.lat}`,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: 'false',
    f: 'json',
  });

  const url = `${FIRE_RESTRICTIONS_URL}?${params}`;
  let data = null;
  let usfsError = '';
  try {
    data = await SharedLocation.fetchJson(url, { ttlMs: FIRE_RESTRICTIONS_TTL_MS });
  } catch (_) {
    usfsError = 'USFS fire restriction layer could not be checked right now.';
  }

  const features = data?.features || [];
  const cardsEl = byId('fire-cards');
  cardsEl.innerHTML = '';

  byId('fire-section').hidden = false;
  renderFireLocationSummary(place);

  renderCountyRestrictionCard(cardsEl, place, countyRestriction);
  await renderColoradoMapSnapshot(place);

  if (usfsError) {
    renderMessageCard(cardsEl, 'Federal land check incomplete', `${usfsError} Use the resources below to verify federal and county restrictions before having a fire.`, 'warning-card');
    renderFireResources(place, countyRestriction);
    return;
  }

  if (features.length === 0) {
    renderUsfsNoRestrictionCard(cardsEl);
    byId('fire-unit-name').textContent = '';
    renderFireResources(place, countyRestriction);
    return;
  }

  // Group by stage so highest stage shows first
  features.sort((a, b) => {
    const sa = getStage(a.attributes);
    const sb = getStage(b.attributes);
    return (sb || 0) - (sa || 0);
  });

  const unitNames = [...new Set(features.map(f => getField(f.attributes, ['UNIT_NAME', 'UnitName', 'unit_name', 'NAME', 'Name'])).filter(Boolean))];
  byId('fire-unit-name').textContent = unitNames.join(', ');

  for (const feature of features) {
    const attrs = feature.attributes;
    const stage = getStage(attrs);
    const unit = getField(attrs, ['UNIT_NAME', 'UnitName', 'unit_name', 'NAME', 'Name']) || 'USFS Area';
    const comments = getField(attrs, ['COMMENTS', 'Comments', 'COMMENT', 'DESCRIPTION', 'Description', 'RESTRICTION_TEXT']) || '';
    const effective = getField(attrs, ['EFFECTIVE_DATE', 'EffectiveDate', 'START_DATE', 'DateEffective']);
    const expiration = getField(attrs, ['EXPIRATION_DATE', 'ExpirationDate', 'END_DATE', 'DateExpiration']);

    const badgeClass = stage === 1 ? 'stage-1' : stage === 2 ? 'stage-2' : stage === 3 ? 'stage-3' : 'no-restriction';
    const badgeLabel = stage ? `Stage ${stage}` : 'Restriction in Effect';
    const stageDesc = STAGE_DESCRIPTIONS[stage] || 'Fire restrictions are active. See details below.';

    const card = document.createElement('div');
    card.className = 'fire-card';
    card.innerHTML = `
      <div class="fire-card-top">
        <span class="fire-badge ${badgeClass}">${badgeLabel}</span>
        <span class="fire-unit">${unit}</span>
      </div>
      <div class="fire-description">${stageDesc}</div>
      ${comments ? `<div class="fire-description" style="margin-top:4px;color:#b0ccd6;">${comments}</div>` : ''}
      ${formatDates(effective, expiration)}
    `;
    cardsEl.appendChild(card);
  }
  renderFireResources(place, countyRestriction);
}

async function loadCountyPlace(loc) {
  const fallback = {
    county: '',
    stateCode: '',
    stateName: '',
    status: 'County could not be identified automatically.',
  };
  const params = new URLSearchParams({
    lat: loc.lat.toFixed(6),
    lon: loc.lon.toFixed(6),
    format: 'json',
  });
  try {
    const data = await SharedLocation.fetchJson(`${COUNTY_LOOKUP_URL}?${params}`, { ttlMs: COUNTY_LOOKUP_TTL_MS });
    const result = data?.results?.[0];
    const stateCode = result?.state_code || result?.state || '';
    const county = cleanCountyName(result?.county_name || result?.county || '');
    return {
      county,
      stateCode,
      stateName: STATE_NAMES[stateCode] || stateCode,
      countyFips: result?.county_fips || '',
      status: county && stateCode
        ? `County identified: ${county} County, ${stateCode}. County restrictions should be treated as the first place to verify.`
        : fallback.status,
    };
  } catch (_) {
    return fallback;
  }
}

function cleanCountyName(name) {
  return String(name || '').replace(/\s+County$/i, '').trim();
}

function renderFireLocationSummary(place) {
  const el = byId('fire-location-summary');
  const location = place?.county && place?.stateCode
    ? `${place.county} County, ${place.stateCode}`
    : 'County unavailable';
  el.innerHTML = `
    <div class="summary-title">${escapeHtml(location)}</div>
    <div class="summary-copy">${escapeHtml(place?.status || 'County could not be identified automatically.')}</div>
  `;
}

async function renderColoradoMapSnapshot(place) {
  const snapshot = byId('colorado-map-snapshot');
  if (place?.stateCode !== 'CO') {
    snapshot.innerHTML = '';
    snapshot.hidden = true;
    return;
  }

  snapshot.hidden = false;
  snapshot.innerHTML = `
    <a class="map-preview-fallback" href="${escapeAttr(COLORADO_FIRE_RESTRICTIONS_PAGE)}" target="_blank" rel="noopener noreferrer">
      Colorado Fire Restriction Map
    </a>
  `;

  try {
    const kml = await fetchTextWithCache(COLORADO_COUNTY_RESTRICTIONS_KML, FIRE_RESTRICTIONS_TTL_MS);
    snapshot.innerHTML = `
      <a class="map-preview-link" href="${escapeAttr(COLORADO_FIRE_RESTRICTIONS_PAGE)}" target="_blank" rel="noopener noreferrer" aria-label="Open Colorado DFPC fire restriction information in a new tab">
        ${buildColoradoRestrictionSvg(kml, place)}
        <span>Colorado Fire Restriction Map</span>
      </a>
    `;
  } catch (_) {
    // Keep the link-only fallback if the live map source cannot be loaded.
  }
}

async function loadCountyRestriction(place) {
  if (place?.stateCode === 'CO' && place?.county) {
    return loadColoradoCountyRestriction(place);
  }
  return {
    status: 'manual',
    label: 'County status requires manual verification',
    description: 'A live county restriction source is not integrated for this state yet.',
    sourceUrl: '',
    sourceLabel: '',
  };
}

async function loadColoradoCountyRestriction(place) {
  try {
    const kml = await fetchTextWithCache(COLORADO_COUNTY_RESTRICTIONS_KML, FIRE_RESTRICTIONS_TTL_MS);
    const doc = new DOMParser().parseFromString(kml, 'application/xml');
    const placemarks = [...doc.getElementsByTagName('Placemark')];
    const match = placemarks.find(pm => {
      const name = pm.getElementsByTagName('name')[0]?.textContent || '';
      return normalizeCountyName(name) === normalizeCountyName(place.county);
    });
    if (!match) {
      return {
        status: 'manual',
        label: 'County not found in Colorado DHSEM map',
        description: 'The Colorado county map loaded, but this county was not found in the layer.',
      };
    }

    const desc = getPlacemarkDescription(match);
    const plain = htmlToText(desc);
    const status = getColoradoCountyRestrictionStatus(plain);
    const links = extractUrls(desc);
    const sourceUrl = links[0] || COLORADO_COUNTY_RESTRICTIONS_MAP;

    return {
      status,
      label: status === 'reported'
        ? 'Fire restrictions reported'
        : status === 'none'
          ? 'No county fire restriction reported by this source'
          : 'County map entry found',
      description: plain || 'Colorado DHSEM county fire restriction map entry found.',
      sourceUrl,
      sourceLabel: sourceUrl === links[0] ? `${place.county} County source` : 'Colorado DHSEM county map',
    };
  } catch (error) {
    return {
      status: 'manual',
      label: 'Colorado county map could not be checked',
      description: 'Use the county resources below to verify restrictions.',
    };
  }
}

function buildColoradoRestrictionSvg(kml, place) {
  const width = 1000;
  const height = 720;
  const doc = new DOMParser().parseFromString(kml, 'application/xml');
  const selectedCounty = normalizeCountyName(place?.county);
  const paths = [...doc.getElementsByTagName('Placemark')]
    .map(pm => {
      const name = pm.getElementsByTagName('name')[0]?.textContent || 'County';
      const status = getColoradoCountyRestrictionStatus(htmlToText(getPlacemarkDescription(pm)));
      const classes = [
        'co-county',
        status === 'reported' ? 'reported' : status === 'none' ? 'clear' : 'unknown',
        normalizeCountyName(name) === selectedCounty ? 'selected' : '',
      ].filter(Boolean).join(' ');
      const d = [...pm.getElementsByTagName('coordinates')]
        .map(node => coordinatesToPath(node.textContent, width, height))
        .filter(Boolean)
        .join(' ');
      if (!d) return '';
      const label = status === 'reported'
        ? `${name}: fire restriction reported`
        : status === 'none'
          ? `${name}: no restriction reported by map`
          : `${name}: status unknown`;
      return `<path class="${classes}" d="${escapeAttr(d)}"><title>${escapeHtml(label)}</title></path>`;
    })
    .filter(Boolean)
    .join('');

  return `
    <svg class="co-restriction-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Colorado county fire restriction map preview" preserveAspectRatio="xMidYMid meet">
      <rect class="co-map-bg" x="0" y="0" width="${width}" height="${height}" rx="18"></rect>
      <g>${paths}</g>
      <rect class="co-state-frame" x="14" y="14" width="${width - 28}" height="${height - 28}" rx="8"></rect>
    </svg>
  `;
}

function coordinatesToPath(value, width, height) {
  const pad = 22;
  const coords = String(value || '').trim().split(/\s+/)
    .map(part => {
      const [lon, lat] = part.split(',').map(Number);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
      return { lon, lat };
    })
    .filter(Boolean);
  if (coords.length < 3) return '';

  const step = coords.length > 180 ? Math.ceil(coords.length / 180) : 1;
  const sampled = coords.filter((_, index) => index === 0 || index === coords.length - 1 || index % step === 0);
  if (sampled[sampled.length - 1] !== coords[coords.length - 1]) sampled.push(coords[coords.length - 1]);

  const points = sampled.map(({ lon, lat }) => {
    const x = pad + ((lon - COLORADO_BOUNDS.minLon) / (COLORADO_BOUNDS.maxLon - COLORADO_BOUNDS.minLon)) * (width - pad * 2);
    const y = pad + ((COLORADO_BOUNDS.maxLat - lat) / (COLORADO_BOUNDS.maxLat - COLORADO_BOUNDS.minLat)) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M${points.join('L')}Z`;
}

function normalizeCountyName(name) {
  return cleanCountyName(name).toLowerCase().replace(/[^a-z]/g, '');
}

function getPlacemarkDescription(placemark) {
  const dataNodes = [...placemark.getElementsByTagName('Data')];
  const descData = dataNodes.find(node => node.getAttribute('name') === 'description');
  const value = descData?.getElementsByTagName('value')[0]?.textContent;
  return value || placemark.getElementsByTagName('description')[0]?.textContent || '';
}

function getColoradoCountyRestrictionStatus(text) {
  if (/no\s+fire\s+restrictions?\s+reported/i.test(text)) return 'none';
  if (/fire\s+restrictions?\s+reported/i.test(text)) return 'reported';
  return 'unknown';
}

function extractUrls(text) {
  return [...new Set(String(text || '').match(/https?:\/\/[^\s<>"']+/gi) || [])]
    .map(url => url.replace(/[).,]+$/g, ''));
}

function htmlToText(value) {
  const div = document.createElement('div');
  div.innerHTML = String(value || '').replace(/\n/g, '<br>');
  return div.textContent.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function fetchTextWithCache(url, ttlMs) {
  const key = TEXT_CACHE_PREFIX + url;
  try {
    const cached = JSON.parse(localStorage.getItem(key) || 'null');
    if (cached?.storedAt && Date.now() - cached.storedAt < ttlMs && typeof cached.text === 'string') {
      return cached.text;
    }
  } catch (_) {
    // Ignore cache read failures; a live request can still work.
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const text = await res.text();
  try {
    localStorage.setItem(key, JSON.stringify({ storedAt: Date.now(), text }));
  } catch (_) {
    // Storage may be unavailable or full.
  }
  return text;
}

function renderCountyRestrictionCard(container, place, countyRestriction) {
  const hasCounty = place?.county && place?.stateCode;
  const countyLabel = hasCounty ? `${place.county} County, ${place.stateCode}` : 'County restrictions';
  const restriction = countyRestriction || {};
  const badgeClass = restriction.status === 'reported'
    ? 'stage-1'
    : restriction.status === 'none'
      ? 'no-restriction'
      : 'county-badge';
  const card = document.createElement('div');
  card.className = `fire-card county-card ${restriction.status === 'reported' ? 'county-reported' : ''}`;
  card.innerHTML = `
    <div class="fire-card-top">
      <span class="fire-badge ${badgeClass}">County</span>
      <span class="fire-unit">${escapeHtml(countyLabel)}</span>
    </div>
    <div class="fire-description"><strong>${escapeHtml(restriction.label || 'County status requires manual verification')}</strong></div>
    <div class="fire-description">
      ${renderLinkedText(restriction.description || (hasCounty
        ? 'County restrictions are the first source to check. This app has identified the county and added county-specific resources below.'
        : 'County restrictions are the first source to check. The county could not be identified automatically, so use the state and federal resources below and verify locally.'))}
    </div>
    ${restriction.sourceUrl ? `<a class="inline-source-link" href="${escapeAttr(restriction.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(restriction.sourceLabel || 'County source')}</a>` : ''}
    <div class="fire-dates">County status: ${escapeHtml(getCountyStatusLine(restriction))}</div>
  `;
  container.appendChild(card);
}

function getCountyStatusLine(restriction) {
  if (restriction.status === 'reported') return 'restriction reported by a live county/state source';
  if (restriction.status === 'none') return 'no restriction reported by the checked live source';
  return 'manual verification required';
}

function renderMessageCard(container, title, message, className) {
  const card = document.createElement('div');
  card.className = className;
  card.innerHTML = `<strong>${escapeHtml(title)}</strong><div>${escapeHtml(message)}</div>`;
  container.appendChild(card);
}

function renderUsfsNoRestrictionCard(container) {
  const card = document.createElement('div');
  card.className = 'fire-card no-restrict-card usfs-card';
  card.innerHTML = `
    <div class="fire-card-top">
      <span class="fire-badge no-restriction">USFS</span>
      <span class="fire-unit">No USFS restriction found at this point</span>
    </div>
    <div class="fire-description">
      No USDA Forest Service fire restriction polygon matched this location. That does not clear county, BLM, state, park, or local fire restrictions. Check the resources below before building a fire.
    </div>
  `;
  container.appendChild(card);
}

function renderLinkedText(value) {
  const text = normalizeCountyDescriptionText(value);
  const urlPattern = /https?:\/\/[^\s<>"']+/gi;
  let html = '';
  let lastIndex = 0;
  for (const match of text.matchAll(urlPattern)) {
    const rawUrl = match[0];
    const url = rawUrl.replace(/[).,]+$/g, '');
    const trailing = rawUrl.slice(url.length);
    html += escapeHtml(text.slice(lastIndex, match.index));
    html += `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`;
    html += escapeHtml(trailing);
    lastIndex = match.index + rawUrl.length;
  }
  html += escapeHtml(text.slice(lastIndex));
  return html;
}

function normalizeCountyDescriptionText(value) {
  return String(value || '')
    .replace(/(?:^|\s*)Link\s+to\s+county\s+website\s*:?\s*https?:\/\/[^\s<>"']+/gi, '')
    .replace(/^\s*Fire\s+restrictions?\s+reported\s*:?\s*/i, '')
    .replace(/Reported\s*Link/gi, 'Reported Link')
    .replace(/:\s*(https?:\/\/)/gi, ': $1')
    .trim();
}

function renderFireResources(place, countyRestriction) {
  const resourcesEl = byId('fire-resources');
  const stateCode = place?.stateCode || '';
  const stateName = place?.stateName || stateCode || 'your state';
  const countySiteLabel = place?.county ? `${place.county} County Site` : 'County Site';
  const mapSource = countyRestriction?.sourceUrl ? [{
    label: countySiteLabel,
    url: countyRestriction.sourceUrl,
  }] : [];
  const countyResources = [
    ...mapSource,
  ];
  const stateResources = STATE_FIRE_RESOURCES[stateCode] || [
    {
      label: `${stateName} fire restrictions search`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`${stateName} fire restrictions official`)}`,
      note: 'State-specific official fire restriction page not yet integrated.',
    },
  ];
  const renderResourceGroup = (title, resources) => `
    <div class="resource-group">
      <h3>${escapeHtml(title)}</h3>
      <div class="resource-list">
        ${resources.map(resource => `
          <a class="resource-link" href="${escapeAttr(resource.url)}" target="_blank" rel="noopener noreferrer">
            <span>${escapeHtml(resource.label)}</span>
            ${resource.note ? `<small>${escapeHtml(resource.note)}</small>` : ''}
          </a>
        `).join('') || '<div class="resource-empty">No direct source is integrated yet.</div>'}
      </div>
    </div>
  `;

  resourcesEl.innerHTML = `
    <h2>Resources to Check</h2>
    <p>Check these even when a restriction is found. County, fire district, and land-manager rules can overlap, and the strictest applicable rule is the one to follow.</p>
    ${renderResourceGroup('County', countyResources)}
    ${renderResourceGroup('State', stateResources)}
    ${renderResourceGroup('Federal', FEDERAL_FIRE_RESOURCES)}
  `;
}

function getStage(attrs) {
  for (const key of ['STAGE', 'Stage', 'stage', 'STAGE_NUMBER', 'StageNumber', 'RESTRICTION_STAGE']) {
    const val = attrs[key];
    if (val != null) {
      const n = parseInt(val, 10);
      if (!isNaN(n)) return n;
    }
  }
  return null;
}

function getField(attrs, keys) {
  for (const key of keys) {
    if (attrs[key] != null && attrs[key] !== '') return String(attrs[key]);
  }
  return null;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function coordForRequest(value) {
  return Number(value).toFixed(3);
}

function formatDates(effective, expiration) {
  const fmt = ts => {
    if (!ts) return null;
    const d = new Date(typeof ts === 'number' ? ts : ts);
    if (isNaN(d)) return null;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const eff = fmt(effective);
  const exp = fmt(expiration);
  if (!eff && !exp) return '';
  const parts = [];
  if (eff) parts.push(`Effective: ${eff}`);
  if (exp) parts.push(`Expires: ${exp}`);
  return `<div class="fire-dates">${parts.join(' &nbsp;·&nbsp; ')}</div>`;
}

function weatherConditionForCode(code) {
  if (code == null || code === '') return { type: 'unknown', label: 'Forecast unavailable' };
  const n = Number(code);
  if (n === 0) return { type: 'sun', label: 'Sunny' };
  if (n === 1) return { type: 'mostly-sun', label: 'Mostly sunny' };
  if (n === 2) return { type: 'mostly-cloud', label: 'Mostly cloudy' };
  if (n === 3) return { type: 'cloud', label: 'Cloudy' };
  if (n === 45 || n === 48) return { type: 'fog', label: 'Fog' };
  if ((n >= 51 && n <= 67) || (n >= 80 && n <= 82)) return { type: 'rain', label: 'Rain' };
  if ((n >= 71 && n <= 77) || n === 85 || n === 86) return { type: 'snow', label: 'Snow' };
  if (n >= 95 && n <= 99) return { type: 'storm', label: 'Thunderstorms' };
  return { type: 'cloud', label: 'Cloudy' };
}

function weatherIconSvg(condition) {
  const label = escapeHtml(condition.label);
  const cloud = `
    <path class="weather-icon-cloud" d="M19.2 34.5H40c4.7 0 8.5-3.6 8.5-8.1 0-4.3-3.5-7.8-7.8-8.1C39.1 13 34.1 9.2 28.4 9.2c-6.9 0-12.5 5.3-13 12-4.2.9-7.3 4.5-7.3 8.7 0 2.6 2.1 4.6 4.7 4.6h6.4Z"/>
  `;
  const sun = `
    <circle class="weather-icon-sun" cx="24" cy="24" r="8"/>
    <g class="weather-icon-rays">
      <path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M37.4 10.6l-4.2 4.2M14.8 33.2l-4.2 4.2"/>
    </g>
  `;

  const bodies = {
    sun,
    'mostly-sun': `${sun}<g transform="translate(11 11) scale(.82)">${cloud}</g>`,
    'mostly-cloud': `<g transform="translate(-5 -3) scale(.75)">${sun}</g>${cloud}`,
    cloud,
    rain: `${cloud}<g class="weather-icon-rain"><path d="M19 41l-2 5M28 41l-2 5M37 41l-2 5"/></g>`,
    snow: `${cloud}<g class="weather-icon-snow"><path d="M20 43h7M23.5 39.5v7M34 43h7M37.5 39.5v7"/></g>`,
    storm: `${cloud}<path class="weather-icon-bolt" d="M28 37l-5 11 8-7-2 9 7-13h-8Z"/>`,
    fog: `${cloud}<g class="weather-icon-fog"><path d="M12 41h30M17 47h22"/></g>`,
    unknown: '<path class="weather-icon-cloud" d="M18 34h20c4 0 7-3 7-7s-3-7-7-7c-1-5-5-8-10-8-6 0-11 5-11 11-4 0-7 3-7 7 0 2 2 4 4 4h4Z"/>',
  };

  return `
    <svg class="weather-icon weather-icon-${condition.type}" viewBox="0 0 56 56" role="img" aria-label="${label}">
      <title>${label}</title>
      ${bodies[condition.type] || bodies.unknown}
    </svg>
  `;
}

function formatForecastFetchedAt(date = new Date()) {
  const time = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  const day = date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
  return `Forecast fetched ${day} at ${time}.`;
}

async function loadCampingWeather(loc) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordForRequest(loc.lat)}&longitude=${coordForRequest(loc.lon)}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&past_days=1&forecast_days=4&temperature_unit=fahrenheit`;
    const data = await SharedLocation.fetchJson(url, { ttlMs: WEATHER_CACHE_TTL_MS });

    const dates = data?.daily?.time || [];
    const highs = data?.daily?.temperature_2m_max || [];
    const lows = data?.daily?.temperature_2m_min || [];
    const weatherCodes = data?.daily?.weather_code || [];
    if (dates.length === 0) return;

    const todayStr = new Date().toLocaleDateString('sv'); // YYYY-MM-DD in local time
    const yesterdayStr = new Date(Date.now() - 864e5).toLocaleDateString('sv');

    const grid = byId('weather-grid');
    grid.innerHTML = '';

    dates.forEach((dateStr, i) => {
      let label;
      if (dateStr === yesterdayStr) label = 'Yesterday';
      else if (dateStr === todayStr) label = 'Today';
      else {
        const d = new Date(dateStr + 'T12:00:00');
        label = d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      }

      const high = highs[i] != null ? Math.round(highs[i]) : null;
      const low = lows[i] != null ? Math.round(lows[i]) : null;
      const condition = weatherConditionForCode(weatherCodes[i]);

      const card = document.createElement('div');
      card.className = 'day-card' + (dateStr === yesterdayStr ? ' day-card-past' : '');
      card.innerHTML = `
        <div class="day-label">${label}</div>
        ${weatherIconSvg(condition)}
        <div class="day-condition">${escapeHtml(condition.label)}</div>
        <div class="day-high">${high != null ? high + '°' : '—'}</div>
        <div class="day-range-label">high</div>
        <div class="day-low">${low != null ? low + '°' : '—'}</div>
        <div class="day-range-label">low</div>
      `;
      grid.appendChild(card);
    });

    byId('weather-fetched-at').textContent = formatForecastFetchedAt();
    byId('weather-section').hidden = false;
  } catch (_) {
    // Weather is supplemental; don't throw if it fails
  }
}

// --- City autocomplete ---

async function campDebounceSuggest() {
  clearTimeout(campSuggestTimer);
  campSuggestTimer = setTimeout(campSuggest, 300);
}

async function campSuggest() {
  const q = byId('city').value.trim();
  if (q.length < 2) { hideCampSuggestions(); return; }
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
    const data = await SharedLocation.fetchJson(url, { ttlMs: LOCATION_LOOKUP_TTL_MS });
    campSuggestions = (data?.results || []).map(r => ({
      label: [r.name, r.admin1, r.country_code].filter(Boolean).join(', '),
      lat: r.latitude,
      lon: r.longitude,
    }));
    campActiveIdx = -1;
    renderCampSuggestions();
  } catch (_) {
    hideCampSuggestions();
  }
}

function renderCampSuggestions() {
  const el = byId('city-suggestions');
  el.innerHTML = '';
  if (campSuggestions.length === 0) { el.style.display = 'none'; return; }
  campSuggestions.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'suggestion-item' + (i === campActiveIdx ? ' active' : '');
    item.textContent = s.label;
    const choose = event => {
      event.preventDefault();
      selectCampSuggestion(i);
    };
    item.addEventListener('mousedown', choose);
    item.addEventListener('touchstart', choose);
    el.appendChild(item);
  });
  el.style.display = '';

  const rect = byId('city').getBoundingClientRect();
  el.style.left = rect.left + 'px';
  el.style.top = (rect.bottom + window.scrollY) + 'px';
  el.style.width = rect.width + 'px';
  el.style.position = 'fixed';
}

function hideCampSuggestions() {
  byId('city-suggestions').style.display = 'none';
  campSuggestions = [];
  campActiveIdx = -1;
}

function selectCampSuggestion(i) {
  const s = campSuggestions[i];
  if (!s) return;
  byId('city').value = s.label;
  byId('coords').value = `${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}`;
  hideCampSuggestions();
  loadCampingConditions();
}

function lookupCampCity() {
  if (campSuggestions.length > 0) { selectCampSuggestion(0); return; }
  loadCampingConditions();
}

async function useCampBrowserLocation() {
  setStatus('Getting your location...');
  try {
    const loc = await SharedLocation.getBrowserLocation();
    byId('city').value = loc.label;
    byId('coords').value = `${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}`;
    hideCampSuggestions();
    loadCampingConditions();
  } catch (err) {
    setStatus('Could not get location: ' + err.message);
  }
}

function applySharedCampLocation() {
  const shared = SharedLocation.readLocation();
  if (!SharedLocation.isEnabled() || !shared) return false;
  applyCampLocationToInputs(shared);
  loadCampingConditions({ urlMode: 'replace' });
  return true;
}

function applyUrlCampLocation() {
  const loc = getCampLocationFromUrl();
  if (!loc) return false;
  applyCampLocationToInputs(loc);
  loadCampingConditions({ syncUrl: false });
  return true;
}

// --- City input keyboard nav ---

byId('city').addEventListener('keydown', e => {
  if (!campSuggestions.length) return;
  if (e.key === 'ArrowDown') { campActiveIdx = Math.min(campActiveIdx + 1, campSuggestions.length - 1); renderCampSuggestions(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { campActiveIdx = Math.max(campActiveIdx - 1, -1); renderCampSuggestions(); e.preventDefault(); }
  else if (e.key === 'Enter') { if (campActiveIdx >= 0) { selectCampSuggestion(campActiveIdx); e.preventDefault(); } }
  else if (e.key === 'Escape') { hideCampSuggestions(); }
});
byId('city').addEventListener('blur', () => setTimeout(hideCampSuggestions, 150));

// --- Init ---

SharedLocation.initCheckbox({ getLocation: getCurrentCampLocation });

window.addEventListener('popstate', () => {
  const loc = getCampLocationFromUrl();
  if (loc) {
    applyCampLocationToInputs(loc);
    loadCampingConditions({ syncUrl: false });
  } else {
    byId('city').value = '';
    byId('coords').value = '';
    hideResults();
    setStatus('Enter a location to load camping conditions.');
  }
});

if (!applyUrlCampLocation() && !applySharedCampLocation()) {
  setStatus('Enter a location to load camping conditions.');
}
