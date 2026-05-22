(function () {
  const LOCATION_KEY = 'weather-dashboard:shared-location';
  const ENABLED_KEY = 'weather-dashboard:share-location-enabled';
  const CACHE_PREFIX = 'weather-dashboard:api-cache:';
  const DEFAULT_TTL_MS = 10 * 60 * 1000;

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
    fetchJson,
    initCheckbox,
  };
})();
