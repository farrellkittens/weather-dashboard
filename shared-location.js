(function () {
  const LOCATION_KEY = 'weather-dashboard:shared-location';
  const ENABLED_KEY = 'weather-dashboard:share-location-enabled';
  const CACHE_PREFIX = 'weather-dashboard:api-cache:v2:';
  const DEFAULT_TTL_MS = 10 * 60 * 1000;
  const LOCATION_LOOKUP_TTL_MS = 12 * 60 * 60 * 1000;

  function isEnabled() {
    return localStorage.getItem(ENABLED_KEY) === 'true';
  }

  function setEnabled(enabled) {
    localStorage.setItem(ENABLED_KEY, enabled ? 'true' : 'false');
  }

  function readLocation() {
    try {
      return JSON.parse(localStorage.getItem(LOCATION_KEY) || 'null');
    } catch (error) {
      return null;
    }
  }

  function saveLocation(location) {
    if (!isEnabled() || !location) return;
    const lat = Number(location.lat);
    const lon = Number(location.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    localStorage.setItem(LOCATION_KEY, JSON.stringify({
      ...location,
      lat,
      lon,
      savedAt: Date.now(),
    }));
  }

  function cacheKey(url) {
    return CACHE_PREFIX + url;
  }

  function coordForRequest(value) {
    return Number(value).toFixed(3);
  }

  function parseCoordinateText(value) {
    const raw = String(value || '').trim();
    if (!raw) return null;
    const normalized = raw
      .replace(/[()]/g, ' ')
      .replace(/[−–—]/g, '-')
      .replace(/[′’]/g, "'")
      .replace(/[″”]/g, '"');

    const decimalParts = normalized.split(/[\s,]+/).filter(Boolean).map(Number);
    if (decimalParts.length >= 2 && decimalParts.every(Number.isFinite)) {
      return normalizeCoordinatePair(decimalParts[0], decimalParts[1]);
    }

    const dmsMatches = [...normalized.matchAll(/([NS])?\s*(-?\d+(?:\.\d+)?)\s*(?:°|deg|d)?\s*(?:(\d+(?:\.\d+)?)\s*(?:'|min|m))?\s*(?:(\d+(?:\.\d+)?)\s*(?:"|sec|s))?\s*([NSEW])?/gi)];
    const coords = dmsMatches
      .map(match => dmsMatchToCoordinate(match))
      .filter(Boolean);
    if (coords.length >= 2) {
      const latCoord = coords.find(coord => coord.axis === 'lat');
      const lonCoord = coords.find(coord => coord.axis === 'lon');
      if (latCoord && lonCoord) return normalizeCoordinatePair(latCoord.value, lonCoord.value);
      return normalizeCoordinatePair(coords[0].value, coords[1].value);
    }

    return null;
  }

  function dmsMatchToCoordinate(match) {
    const hemi = String(match[1] || match[5] || '').toUpperCase();
    const deg = Number(match[2]);
    const min = match[3] == null ? 0 : Number(match[3]);
    const sec = match[4] == null ? 0 : Number(match[4]);
    if (!Number.isFinite(deg) || !Number.isFinite(min) || !Number.isFinite(sec)) return null;
    if (!hemi && match[0].trim().length < String(match[2]).length) return null;
    let value = Math.abs(deg) + min / 60 + sec / 3600;
    if (deg < 0 || hemi === 'S' || hemi === 'W') value *= -1;
    return {
      value,
      axis: hemi === 'N' || hemi === 'S' ? 'lat' : hemi === 'E' || hemi === 'W' ? 'lon' : '',
    };
  }

  function normalizeCoordinatePair(lat, lon) {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    if (Math.abs(lat) > 90 && Math.abs(lon) <= 90) {
      [lat, lon] = [lon, lat];
    }
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    return { lat, lon };
  }

  function readCachedJson(url, ttlMs = DEFAULT_TTL_MS) {
    try {
      const raw = localStorage.getItem(cacheKey(url));
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (!cached?.storedAt || Date.now() - cached.storedAt > ttlMs) return null;
      return cached.data ?? null;
    } catch (error) {
      return null;
    }
  }

  function writeCachedJson(url, data) {
    try {
      localStorage.setItem(cacheKey(url), JSON.stringify({
        storedAt: Date.now(),
        data,
      }));
    } catch (error) {
      // Storage can be unavailable or full; live requests still work.
    }
  }

  async function fetchJson(url, options = {}) {
    const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
    const cached = readCachedJson(url, ttlMs);
    if (cached) return cached;
    const res = await fetch(url, options.fetchOptions);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();
    writeCachedJson(url, data);
    return data;
  }

  function geolocationErrorMessage(error) {
    if (error?.code === 1) return 'Location permission was denied.';
    if (error?.code === 2) return 'Could not determine your location.';
    if (error?.code === 3) return 'Location request timed out.';
    return 'Location is not available in this browser.';
  }

  function currentPosition(options = {}) {
    if (!navigator.geolocation) {
      return Promise.reject(new Error('Location is not available in this browser.'));
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, error => {
        reject(new Error(geolocationErrorMessage(error)));
      }, {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 5 * 60 * 1000,
        ...options,
      });
    });
  }

  async function getBrowserLocation(options = {}) {
    const position = await currentPosition(options.positionOptions);
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    let label = 'Current location';

    try {
      const pointUrl = `https://api.weather.gov/points/${coordForRequest(lat)},${coordForRequest(lon)}`;
      const point = await fetchJson(pointUrl, { ttlMs: LOCATION_LOOKUP_TTL_MS });
      const props = point?.properties?.relativeLocation?.properties;
      const city = props?.city || '';
      const state = props?.state || '';
      label = `${city}${city && state ? ', ' : ''}${state}` || label;
    } catch (error) {
      if (options.requireNwsLabel) throw error;
    }

    return { lat, lon, label, accuracy: position.coords.accuracy };
  }

  function initCheckbox(options = {}) {
    const checkbox = document.getElementById('share-location');
    if (!checkbox) return;
    checkbox.checked = isEnabled();
    checkbox.addEventListener('change', () => {
      setEnabled(checkbox.checked);
      if (checkbox.checked && typeof options.getLocation === 'function') {
        saveLocation(options.getLocation());
      }
    });
  }

  window.SharedLocation = {
    isEnabled,
    setEnabled,
    readLocation,
    saveLocation,
    parseCoordinateText,
    LOCATION_LOOKUP_TTL_MS,
    fetchJson,
    getBrowserLocation,
    initCheckbox,
  };
})();
