// ════════════════════════════════════════════════════════════
// PEAKS DATABASE
// ════════════════════════════════════════════════════════════
const PEAKS = [
  { name: 'Longs Peak',   state: 'CO', elev: 14259, lat: 40.2553, lon: -105.6152 },
];

// ════════════════════════════════════════════════════════════
// DIRECTIONS — 16 compass points, clockwise from North
// ════════════════════════════════════════════════════════════
const DIRECTIONS = [
  { name: 'N',   bearing:   0 },
  { name: 'NNE', bearing:  22.5 },
  { name: 'NE',  bearing:  45 },
  { name: 'ENE', bearing:  67.5 },
  { name: 'E',   bearing:  90 },
  { name: 'ESE', bearing: 112.5 },
  { name: 'SE',  bearing: 135 },
  { name: 'SSE', bearing: 157.5 },
  { name: 'S',   bearing: 180 },
  { name: 'SSW', bearing: 202.5 },
  { name: 'SW',  bearing: 225 },
  { name: 'WSW', bearing: 247.5 },
  { name: 'W',   bearing: 270 },
  { name: 'WNW', bearing: 292.5 },
  { name: 'NW',  bearing: 315 },
  { name: 'NNW', bearing: 337.5 },
];

const TIME_OFFSETS = [0, 6, 12, 24]; // hours from now
const MI_TO_KM = 1.60934;
const DISTANCE_BANDS = [
  { label: '1 mi',  miles: 1,  km: 1 * MI_TO_KM },
  { label: '5 mi',  miles: 5,  km: 5 * MI_TO_KM },
  { label: '10 mi', miles: 10, km: 10 * MI_TO_KM },
  { label: '20 mi', miles: 20, km: 20 * MI_TO_KM },
];

// ════════════════════════════════════════════════════════════
// VARIABLE CONFIG
// ════════════════════════════════════════════════════════════
const VAR_CONFIG = {
  temp:   { label: 'Temp',       unit: '°F',  fixedMax: null, fixedMin: null, colorFn: tempColor,   legend: 'relative' },
  wind:   { label: 'Wind Speed', unit: 'mph', fixedMax: 50,  fixedMin: 0,    colorFn: windColor,   legend: 'wind' },
  gust:   { label: 'Gusts',      unit: 'mph', fixedMax: 80,  fixedMin: 0,    colorFn: windColor,   legend: 'wind' },
  precip: { label: 'Precip',     unit: '%',   fixedMax: 100, fixedMin: 0,    colorFn: precipColor, legend: 'precip' },
  sky:    { label: 'Sky Cover',  unit: '%',   fixedMax: 100, fixedMin: 0,    colorFn: skyColor,    legend: 'sky' },
  thunder:{ label: 'Thunder',    unit: '%',   fixedMax: 100, fixedMin: 0,    colorFn: thunderColor, legend: 'thunder' },
};

// Ordered list of variables shown as panel rows
const PANEL_VARS = ['temp', 'wind', 'precip', 'sky', 'thunder'];

// ════════════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════════════
let currentPeak = PEAKS[0];
let roseData    = null;  // { summit, directions: [{name, bearing, bands: [{label, periods}]}] }
const roseCanvasMeta = new Map();
const samplePreviewMeta = new Map();

// ════════════════════════════════════════════════════════════
// COLOR FUNCTIONS
// ════════════════════════════════════════════════════════════
function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function mixHex(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * t,
    g: ca.g + (cb.g - ca.g) * t,
    b: ca.b + (cb.b - ca.b) * t,
  });
}

function colorRamp(stops, t) {
  const x = clamp01(t) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  return mixHex(stops[i], stops[i + 1], x - i);
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function windColor(mph) {
  if (mph >= 40) return '#7c3ba6';
  if (mph >= 30) return '#e675ad';
  if (mph >= 20) return '#f29a3f';
  if (mph >= 10) return '#f7df72';
  return '#f8fafc';
}

function tempColor(f, min = 0, max = 100) {
  const norm = clamp01((f - min) / ((max - min) || 1));
  return colorRamp(['#91bfdb', '#f0eaa4', '#df714f'], norm);
}

function precipColor(pct) {
  return colorRamp(['#f7fbef', '#d9ef8b', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'], clamp01(pct / 100));
}

function skyColor(pct) {
  return colorRamp(['#174d86', '#4f8fc8', '#a7b5c1', '#eef2f6'], clamp01(pct / 100));
}

function thunderColor(pct) {
  return colorRamp(['#2b255a', '#5f4eb2', '#9a4bc1', '#e64da4'], clamp01(pct / 100));
}

// ════════════════════════════════════════════════════════════
// COORDINATE MATH  (Vincenty-style great-circle offset)
// ════════════════════════════════════════════════════════════
function offsetCoords(lat, lon, bearingDeg, distKm) {
  const R   = 6371;
  const br  = bearingDeg * Math.PI / 180;
  const lr  = lat        * Math.PI / 180;
  const d   = distKm / R;
  const nlr = Math.asin(
    Math.sin(lr) * Math.cos(d) + Math.cos(lr) * Math.sin(d) * Math.cos(br)
  );
  const nlo = lon * Math.PI / 180 + Math.atan2(
    Math.sin(br) * Math.sin(d) * Math.cos(lr),
    Math.cos(d)  - Math.sin(lr) * Math.sin(nlr)
  );
  return {
    lat: +(nlr * 180 / Math.PI).toFixed(4),
    lon: +(nlo * 180 / Math.PI).toFixed(4),
  };
}

// ════════════════════════════════════════════════════════════
// NWS API HELPERS
// ════════════════════════════════════════════════════════════
async function fetchPointUrls(lat, lon) {
  const r = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
  if (!r.ok) throw new Error(r.status);
  const props = (await r.json()).properties;
  return {
    hourlyUrl: props.forecastHourly,
    gridUrl: props.forecastGridData,
  };
}

async function fetchPeriods(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status);
  return (await r.json()).properties.periods;
}

async function fetchGridProperties(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status);
  return (await r.json()).properties;
}

function parseWind(s) {
  if (!s) return 0;
  const m = s.match(/(\d+)/);
  return m ? +m[1] : 0;
}

function parseDurationMs(duration) {
  const m = duration.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);
  if (!m) return 0;
  const days = +(m[1] || 0);
  const hours = +(m[2] || 0);
  const minutes = +(m[3] || 0);
  const seconds = +(m[4] || 0);
  return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
}

function gridValueAt(values, hoursFromNow) {
  if (!values?.length) return null;
  const target = new Date(Date.now() + hoursFromNow * 3_600_000);
  const match = values.find(item => {
    const [start, duration] = item.validTime.split('/');
    const startTime = new Date(start).getTime();
    const endTime = startTime + parseDurationMs(duration);
    return target.getTime() >= startTime && target.getTime() < endTime;
  });
  return match?.value ?? null;
}

function thunderValue(period) {
  if (!period) return null;
  const direct = period.probabilityOfThunderstorms?.value ?? period.probabilityOfThunder?.value;
  if (direct != null) return direct;

  const text = `${period.shortForecast ?? ''} ${period.detailedForecast ?? ''}`.toLowerCase();
  if (!text.includes('thunderstorm')) return 0;

  const pop = period.probabilityOfPrecipitation?.value;
  if (pop != null) return pop;
  if (text.includes('slight chance')) return 20;
  if (text.includes('chance')) return 40;
  if (text.includes('likely')) return 70;
  return 50;
}

// ════════════════════════════════════════════════════════════
// DATA LOADING
// ════════════════════════════════════════════════════════════
async function loadData(peak) {
  roseData = null;
  setStatus('Calculating offset coordinates…');

  const samplePoints = DIRECTIONS.flatMap((dir, dirIdx) =>
    DISTANCE_BANDS.map((band, bandIdx) => ({
      ...dir,
      dirIdx,
      bandIdx,
      band,
      coords: offsetCoords(peak.lat, peak.lon, dir.bearing, band.km),
    }))
  );

  setStatus(`Fetching NWS grid assignments for summit plus ${samplePoints.length} direction/distance samples…`);
  const [summitResult, pointResults] = await Promise.all([
    fetchPointUrls(peak.lat, peak.lon)
      .catch(() => ({ hourlyUrl: null, gridUrl: null })),
    Promise.all(samplePoints.map(d =>
      fetchPointUrls(d.coords.lat, d.coords.lon)
        .then(urls => ({ ...d, ...urls }))
        .catch(() => ({ ...d, hourlyUrl: null, gridUrl: null }))
    )),
  ]);

  // Deduplicate forecast/grid URLs — adjacent directions often share a grid cell
  const hourlyUrlSet = new Set([
    summitResult.hourlyUrl,
    ...pointResults.map(r => r.hourlyUrl),
  ].filter(Boolean));
  const gridUrlSet = new Set([
    summitResult.gridUrl,
    ...pointResults.map(r => r.gridUrl),
  ].filter(Boolean));
  setStatus(`Fetching ${hourlyUrlSet.size} unique NWS hourly forecasts and ${gridUrlSet.size} grid datasets…`);

  const hourlyMap = new Map();
  const gridMap = new Map();
  await Promise.all([
    ...Array.from(hourlyUrlSet).map(url =>
      fetchPeriods(url)
        .then(p => hourlyMap.set(url, p))
        .catch(() => hourlyMap.set(url, null))
    ),
    ...Array.from(gridUrlSet).map(url =>
      fetchGridProperties(url)
        .then(p => gridMap.set(url, p))
        .catch(() => gridMap.set(url, null))
    ),
  ]);

  roseData = {
    summit: {
      coords: { lat: peak.lat, lon: peak.lon },
      periods: summitResult.hourlyUrl ? hourlyMap.get(summitResult.hourlyUrl) : null,
      grid: summitResult.gridUrl ? gridMap.get(summitResult.gridUrl) : null,
    },
    directions: DIRECTIONS.map((dir, dirIdx) => ({
      ...dir,
      bands: DISTANCE_BANDS.map((band, bandIdx) => {
        const point = pointResults.find(r => r.dirIdx === dirIdx && r.bandIdx === bandIdx);
        return {
          ...band,
          coords: point?.coords ?? null,
          periods: point?.hourlyUrl ? hourlyMap.get(point.hourlyUrl) : null,
          grid: point?.gridUrl ? gridMap.get(point.gridUrl) : null,
        };
      }),
    })),
    loadTime: new Date(),
  };

  setStatus('');
  drawAll();
}

// ════════════════════════════════════════════════════════════
// VALUE EXTRACTION
// ════════════════════════════════════════════════════════════
function getPeriodAt(periods, hoursFromNow) {
  if (!periods?.length) return null;
  const target = new Date(Date.now() + hoursFromNow * 3_600_000);
  return (
    periods.find(p => target >= new Date(p.startTime) && target < new Date(p.endTime)) ??
    periods[Math.min(hoursFromNow, periods.length - 1)]
  );
}

function extractValue(period, variable, grid, hoursFromNow) {
  if (variable === 'sky') return gridValueAt(grid?.skyCover?.values, hoursFromNow);
  if (!period) return null;
  switch (variable) {
    case 'wind':   return parseWind(period.windSpeed);
    case 'gust':   return parseWind(period.windGust);
    case 'temp':   return period.temperature ?? null;
    case 'precip': return period.probabilityOfPrecipitation?.value ?? 0;
    case 'sky':    return null;
    case 'thunder':return thunderValue(period);
    default:       return 0;
  }
}

// ════════════════════════════════════════════════════════════
// DRAWING
// ════════════════════════════════════════════════════════════
const ROSE_PX = 300;
const EXPLAINER_ROSE_PX = 220;
const DPR     = window.devicePixelRatio || 1;
const BAND_FRACTIONS = [0.31, 0.54, 0.76, 1];
const SUMMIT_HIT_FRAC = 0.051;

// 8 main labels placed around the outer ring
const RING_LABELS = [
  { name: 'N', b: 0 }, { name: 'NE', b: 45 }, { name: 'E', b: 90 }, { name: 'SE', b: 135 },
  { name: 'S', b: 180 }, { name: 'SW', b: 225 }, { name: 'W', b: 270 }, { name: 'NW', b: 315 },
];

function setupCanvas(id, size = ROSE_PX) {
  const el = document.getElementById(id);
  if (!el) return null;
  el.dataset.roseCanvas = 'true';
  el.width  = size * DPR;
  el.height = size * DPR;
  el.style.width  = size + 'px';
  el.style.height = size + 'px';
  const ctx = el.getContext('2d');
  ctx.scale(DPR, DPR);
  return ctx;
}

function setupSizedCanvas(id, width, height) {
  const el = document.getElementById(id);
  if (!el) return null;
  el.width = width * DPR;
  el.height = height * DPR;
  el.style.width = width + 'px';
  el.style.height = height + 'px';
  const ctx = el.getContext('2d');
  ctx.scale(DPR, DPR);
  return ctx;
}

function setupResponsiveCanvas(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const size = Math.max(180, Math.round(Math.min(rect.width || 220, rect.height || 220)));
  const width = size;
  const height = size;
  el.width = width * DPR;
  el.height = height * DPR;
  const ctx = el.getContext('2d');
  ctx.scale(DPR, DPR);
  return { ctx, width, height };
}

function ringBounds(index, R) {
  return {
    inner: index === 0 ? 0 : R * BAND_FRACTIONS[index - 1],
    outer: R * BAND_FRACTIONS[index],
  };
}

function drawBandGrid(ctx, W, cx, cy, R, options = {}) {
  for (let i = 0; i < DISTANCE_BANDS.length; i++) {
    const { inner, outer } = ringBounds(i, R);
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, 2 * Math.PI);
    if (inner > 0) ctx.arc(cx, cy, inner, 2 * Math.PI, 0, true);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.018)' : 'rgba(255,255,255,0.035)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, 2 * Math.PI);
    ctx.strokeStyle = i === DISTANCE_BANDS.length - 1 ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.16)';
    ctx.lineWidth = i === DISTANCE_BANDS.length - 1 ? 1.4 : 1;
    ctx.stroke();
  }

  RING_LABELS.forEach(({ b }) => {
    const a = (b - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  });

  if (options.showDistanceLabels) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.round(W * 0.030)}px Arial`;
    DISTANCE_BANDS.forEach((band, i) => {
      const { outer } = ringBounds(i, R);
      const x = Math.round(cx + 4);
      const y = Math.round(cy - outer + 10);
      const metrics = ctx.measureText(band.label);
      const padX = Math.max(4, Math.round(W * 0.014));
      const padY = Math.max(2, Math.round(W * 0.007));
      const labelW = Math.ceil(metrics.width) + padX * 2;
      const labelH = Math.round(W * 0.046);
      ctx.fillStyle = 'rgba(8,10,16,0.68)';
      ctx.fillRect(Math.round(x - labelW / 2), Math.round(y - labelH / 2), labelW, labelH);
      ctx.fillStyle = '#fbfdff';
      ctx.fillText(band.label, x, y);
    });
  }
}

function drawBandOutlines(ctx, cx, cy, R) {
  for (let i = 0; i < DISTANCE_BANDS.length; i++) {
    const { outer } = ringBounds(i, R);
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, 2 * Math.PI);
    ctx.strokeStyle = i === DISTANCE_BANDS.length - 1 ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.24)';
    ctx.lineWidth = i === DISTANCE_BANDS.length - 1 ? 1.5 : 1;
    ctx.stroke();
  }
}

function drawDirectionLabels(ctx, W, cx, cy, R, full = false) {
  ctx.font = `bold ${Math.round(W * 0.033)}px Arial`;
  ctx.fillStyle = '#858b97';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const labels = full
    ? RING_LABELS
    : [{ name: 'N', b: 0 }, { name: 'E', b: 90 }, { name: 'S', b: 180 }, { name: 'W', b: 270 }];
  const lr = R + W * 0.040;
  labels.forEach(({ name, b }) => {
    const a = (b - 90) * Math.PI / 180;
    ctx.fillText(name, cx + Math.cos(a) * lr, cy + Math.sin(a) * lr);
  });
}

function drawSummitDot(ctx, W, cx, cy, color = '#ffffff') {
  const r = W * SUMMIT_HIT_FRAC;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.fillStyle = rgba(color, 0.92);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.88)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawRose(ctx, W, dirBandValues, globalMin, globalMax, variable, options = {}) {
  if (!ctx) return;
  const cfg  = VAR_CONFIG[variable];
  const useMin = cfg.fixedMin ?? globalMin;
  const useMax = cfg.fixedMax ?? globalMax;

  // Layout
  const cx = W / 2;
  const cy = W / 2;
  const R  = W * 0.40;

  // ── Background ──
  ctx.fillStyle = '#1a1a2a';
  ctx.fillRect(0, 0, W, W);

  drawBandGrid(ctx, W, cx, cy, R, options);

  // ── Direction/distance cells ──
  for (let dirIdx = 0; dirIdx < 16; dirIdx++) {
    for (let bandIdx = 0; bandIdx < DISTANCE_BANDS.length; bandIdx++) {
      const bandValue = dirBandValues[dirIdx]?.[bandIdx];
      if (!bandValue || bandValue.missing || bandValue.value === null) continue;

      const { inner, outer } = ringBounds(bandIdx, R);
      const startA = (dirIdx * 22.5 - 11.25 - 90) * Math.PI / 180;
      const endA   = (dirIdx * 22.5 + 11.25 - 90) * Math.PI / 180;
      const col    = cfg.colorFn(bandValue.value, useMin, useMax);
      const alpha  = variable === 'sky' ? 0.90 : 0.78;

      ctx.beginPath();
      ctx.arc(cx, cy, outer, startA, endA);
      if (inner > 0) ctx.arc(cx, cy, inner, endA, startA, true);
      else ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fillStyle   = rgba(col, alpha);
      ctx.fill();
      if (variable === 'thunder') {
        ctx.strokeStyle = 'rgba(245,248,255,0.46)';
        ctx.lineWidth = 0.95;
      } else {
        ctx.strokeStyle = variable === 'sky' ? 'rgba(20,24,32,0.52)' : rgba(col, 0.95);
        ctx.lineWidth   = variable === 'sky' ? 0.75 : 0.55;
      }
      ctx.stroke();
    }
  }

  drawBandOutlines(ctx, cx, cy, R);
  const summitValue = options.summitValue;
  const summitColor = summitValue == null ? '#ffffff' : cfg.colorFn(summitValue, useMin, useMax);
  drawSummitDot(ctx, W, cx, cy, summitColor);
  drawDirectionLabels(ctx, W, cx, cy, R, options.fullDirectionLabels);

  // ── Scale note ──
  if (options.showScaleNote !== false) {
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    ctx.font         = `${Math.round(W * 0.036)}px Arial`;
    ctx.fillStyle    = '#50566b';
    const scaleText  = cfg.fixedMax != null
      ? `0 – ${cfg.fixedMax} ${cfg.unit}`
      : `${useMin.toFixed(0)} – ${useMax.toFixed(0)} ${cfg.unit}`;
    ctx.fillText(scaleText, cx, W - 5);
  }
}

function updateColumnHeaders() {
  TIME_OFFSETS.forEach((offset, i) => {
    const el = document.getElementById(`col-hdr-${i}`);
    if (!el) return;
    const label = offset === 0 ? 'Now' : `+${offset} hrs`;
    let html = `<span class="col-hdr-main">${label}</span>`;
    if (offset > 0) {
      const t = new Date(Date.now() + offset * 3_600_000);
      html += `<span class="col-hdr-time">${t.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' })}</span>`;
    }
    el.innerHTML = html;
  });
}

function gradientFor(variable, min, max) {
  if (variable === 'temp') return 'linear-gradient(90deg, #91bfdb, #f0eaa4, #df714f)';
  if (variable === 'wind') return 'linear-gradient(90deg, #f8fafc 0 20%, #f7df72 20% 40%, #f29a3f 40% 60%, #e675ad 60% 80%, #7c3ba6 80% 100%)';
  if (variable === 'precip') return 'linear-gradient(90deg, #f7fbef, #d9ef8b, #7fcdbb, #41b6c4, #1d91c0, #225ea8, #0c2c84)';
  if (variable === 'sky') return 'linear-gradient(90deg, #174d86, #4f8fc8, #a7b5c1, #eef2f6)';
  if (variable === 'thunder') return 'linear-gradient(90deg, #2b255a, #5f4eb2, #9a4bc1, #e64da4)';
  return 'linear-gradient(90deg, #555, #aaa)';
}

function legendLabels(variable, min, max) {
  const cfg = VAR_CONFIG[variable];
  if (variable === 'temp') {
    const mid = (min + max) / 2;
    return [`${min.toFixed(0)}${cfg.unit}`, `${mid.toFixed(0)}${cfg.unit}`, `${max.toFixed(0)}${cfg.unit}`];
  }
  if (variable === 'wind') return ['0-10', '10-20', '20-30', '30-40', '40+ mph'];
  if (variable === 'precip') return ['0%', '50%', '100%'];
  if (variable === 'sky') return ['Clear', 'Mixed', 'Overcast'];
  if (variable === 'thunder') return ['0%', '50%', '100%'];
  return [`${min}`, '', `${max}`];
}

function legendNote(variable) {
  if (variable === 'temp') return '';
  if (variable === 'sky') return 'Each rose has 64 sky-cover boxes; blue is clear, white is overcast.';
  if (variable === 'precip') return 'Climate.gov-style green to blue ramp; deeper blue means higher chance.';
  if (variable === 'thunder') return 'Violet to magenta shows increasing thunderstorm probability.';
  if (variable === 'wind') return 'Bins are >= lower mph and < upper mph; purple is 40+.';
  return 'Shared scale across now, +6, +12, and +24 hours.';
}

function updateLegend(variable, timeIdx, min, max) {
  const el = document.getElementById(`legend-${variable}-${timeIdx}`);
  if (!el) return;
  const labels = legendLabels(variable, min, max);
  el.innerHTML = `
    <div class="rose-legend-bar" style="background:${gradientFor(variable, min, max)}"></div>
    <div class="rose-legend-labels">
      ${labels.map(label => `<span>${label}</span>`).join('')}
    </div>
    ${legendNote(variable) ? `<div class="rose-legend-note">${legendNote(variable)}</div>` : ''}
  `;
}

function collectValues(varKey) {
  const values = [];
  for (const offset of TIME_OFFSETS) {
    const summitValue = extractValue(getPeriodAt(roseData.summit?.periods, offset), varKey, roseData.summit?.grid, offset);
    if (summitValue !== null) values.push(summitValue);
    for (const dir of roseData.directions) {
      for (const band of dir.bands) {
        const v = extractValue(getPeriodAt(band.periods, offset), varKey, band.grid, offset);
        if (v !== null) values.push(v);
      }
    }
  }
  return values;
}

function valuesForOffset(varKey, offset) {
  return roseData.directions.map(dir =>
    dir.bands.map(band => {
      const period = getPeriodAt(band.periods, offset);
      const value = extractValue(period, varKey, band.grid, offset);
      return { value, missing: value === null };
    })
  );
}

function summitValueForOffset(varKey, offset) {
  const period = getPeriodAt(roseData.summit?.periods, offset);
  const value = extractValue(period, varKey, roseData.summit?.grid, offset);
  return { value, missing: value === null };
}

function timeLabel(offset) {
  if (offset === 0) return 'Now';
  const t = new Date(Date.now() + offset * 3_600_000);
  return `+${offset} hrs · ${t.toLocaleString(undefined, { weekday: 'short', hour: 'numeric' })}`;
}

function formattedValue(variable, value) {
  const cfg = VAR_CONFIG[variable];
  if (value == null) return 'No data';
  if (variable === 'temp') return `${Math.round(value)}${cfg.unit}`;
  if (variable === 'wind' || variable === 'gust') return `${Math.round(value)} ${cfg.unit}`;
  return `${Math.round(value)}${cfg.unit}`;
}

function cellFromPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const W = rect.width;
  const cx = W / 2;
  const cy = rect.height / 2;
  const R = W * 0.40;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy);

  if (dist <= W * SUMMIT_HIT_FRAC) return { summit: true };
  if (dist > R) return null;
  const bandIdx = BAND_FRACTIONS.findIndex(frac => dist <= R * frac);
  if (bandIdx < 0) return null;

  const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
  const dirIdx = Math.floor(((angle + 11.25) % 360) / 22.5);
  return { dirIdx, bandIdx };
}

function showRoseTooltip(canvas, event) {
  const meta = roseCanvasMeta.get(canvas.id);
  const tooltip = document.getElementById('rose-tooltip');
  if (!meta || !tooltip) {
    hideRoseTooltip();
    return;
  }

  const cell = cellFromPoint(canvas, event.clientX, event.clientY);
  if (!cell) {
    hideRoseTooltip();
    return;
  }

  const point = cell.summit ? meta.summit : meta.values[cell.dirIdx]?.[cell.bandIdx];
  if (!point || point.missing || point.value === null) {
    hideRoseTooltip();
    return;
  }

  const cfg = VAR_CONFIG[meta.variable];
  const locationLine = cell.summit
    ? `Summit · ${currentPeak.name}`
    : `${DIRECTIONS[cell.dirIdx].name} · ${DISTANCE_BANDS[cell.bandIdx].label} from summit`;
  tooltip.innerHTML = `
    <div class="tooltip-title">${cfg.label}: ${formattedValue(meta.variable, point.value)}</div>
    <div class="tooltip-meta">${locationLine}</div>
    <div class="tooltip-meta">${timeLabel(meta.offset)}</div>
  `;
  tooltip.style.display = 'block';
  tooltip.style.left = `${Math.max(8, Math.min(window.innerWidth - 235, event.clientX + 14))}px`;
  tooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - 90, event.clientY + 14))}px`;
}

function hideRoseTooltip() {
  const tooltip = document.getElementById('rose-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

function projectSamplePoint(lat, lon, centerLat, centerLon, scale, cx, cy) {
  const latMiles = (lat - centerLat) * 69.0;
  const lonMiles = (lon - centerLon) * 69.0 * Math.cos(centerLat * Math.PI / 180);
  return {
    x: cx + lonMiles * scale,
    y: cy - latMiles * scale,
  };
}

function drawSampleMap(id = 'sample-map', statusId = 'sample-map-status') {
  if (!roseData) return;
  const setup = setupResponsiveCanvas(id);
  if (!setup) return;

  const { ctx, width, height } = setup;
  const cx = width / 2;
  const cy = height / 2;
  const maxMiles = Math.max(...DISTANCE_BANDS.map(b => b.miles));
  const scale = Math.min(width, height) * 0.40 / maxMiles;
  const centerLat = currentPeak.lat;
  const centerLon = currentPeak.lon;

  ctx.fillStyle = '#171724';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  DIRECTIONS.forEach(dir => {
    const a = (dir.bearing - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * maxMiles * scale, cy + Math.sin(a) * maxMiles * scale);
    ctx.stroke();
  });

  DISTANCE_BANDS.forEach(band => {
    ctx.beginPath();
    ctx.arc(cx, cy, band.miles * scale, 0, 2 * Math.PI);
    ctx.strokeStyle = band.miles === maxMiles ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.13)';
    ctx.lineWidth = band.miles === maxMiles ? 1.4 : 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(226,233,243,0.72)';
    ctx.font = `${Math.round(width * 0.033)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(band.label, cx + width * 0.08, cy - band.miles * scale - width * 0.025);
  });

  let returned = 0;
  let total = 0;
  roseData.directions.forEach(dir => {
    dir.bands.forEach(band => {
      total++;
      const pt = band.coords
        ? projectSamplePoint(band.coords.lat, band.coords.lon, centerLat, centerLon, scale, cx, cy)
        : null;
      if (!pt) return;

      const ok = !!band.periods;
      if (ok) returned++;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, ok ? 2.2 : 1.8, 0, 2 * Math.PI);
      ctx.fillStyle = ok ? '#78d99a' : '#6e7480';
      ctx.fill();
      ctx.strokeStyle = ok ? 'rgba(8,20,15,0.85)' : 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 3.2, 0, 2 * Math.PI);
  ctx.fillStyle = '#171724';
  ctx.fill();

  const labelRadius = maxMiles * scale + 18;
  RING_LABELS.forEach(({ name, b }) => {
    const a = (b - 90) * Math.PI / 180;
    ctx.fillStyle = '#858b97';
    ctx.font = `bold ${Math.round(EXPLAINER_ROSE_PX * 0.033)}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.fillText(name, cx + Math.cos(a) * labelRadius, cy + Math.sin(a) * labelRadius);
  });

  const status = document.getElementById(statusId);
  if (status) {
    status.textContent = `${returned} of ${total} sample points returned forecast data. Green dots are active sample coordinates; gray dots did not return a forecast grid.`;
  }
}

function drawAll() {
  if (!roseData) return;
  updateColumnHeaders();
  drawExplainers();
  drawSampleMap();
  roseCanvasMeta.clear();

  for (const varKey of PANEL_VARS) {
    const values = collectValues(varKey);
    let globalMin = values.length ? Math.min(...values) : 0;
    let globalMax = values.length ? Math.max(...values) : 1;
    if (!isFinite(globalMax)) { globalMax = 1; globalMin = 0; }

    TIME_OFFSETS.forEach((offset, timeIdx) => {
      const roseCtx = setupCanvas(`rose-${varKey}-${timeIdx}`);
      const values = valuesForOffset(varKey, offset);
      const summit = summitValueForOffset(varKey, offset);
      drawRose(roseCtx, ROSE_PX, values, globalMin, globalMax, varKey, {
        showDistanceLabels: true,
        fullDirectionLabels: false,
        summitValue: summit.value,
      });
      roseCanvasMeta.set(`rose-${varKey}-${timeIdx}`, { variable: varKey, offset, values, summit, min: globalMin, max: globalMax });
      updateLegend(varKey, timeIdx, globalMin, globalMax);
    });
  }
}

function drawExplainers() {
  samplePreviewMeta.clear();
  const tempCtx = setupSizedCanvas('explainer-temp', EXPLAINER_ROSE_PX, EXPLAINER_ROSE_PX);
  const windCtx = setupSizedCanvas('explainer-wind', EXPLAINER_ROSE_PX, EXPLAINER_ROSE_PX);
  const precipCtx = setupSizedCanvas('explainer-precip', EXPLAINER_ROSE_PX, EXPLAINER_ROSE_PX);
  const skyCtx = setupSizedCanvas('explainer-sky', EXPLAINER_ROSE_PX, EXPLAINER_ROSE_PX);
  const thunderCtx = setupSizedCanvas('explainer-thunder', EXPLAINER_ROSE_PX, EXPLAINER_ROSE_PX);
  const tempValues = DIRECTIONS.map((_, dirIdx) =>
    DISTANCE_BANDS.map((__, bandIdx) => ({ value: 35 + dirIdx * 2 + bandIdx * 7, missing: false }))
  );
  const windValues = DIRECTIONS.map((_, dirIdx) =>
    DISTANCE_BANDS.map((__, bandIdx) => ({ value: 8 + ((dirIdx + bandIdx * 3) % 12) * 4, missing: false }))
  );
  const precipValues = DIRECTIONS.map((_, dirIdx) =>
    DISTANCE_BANDS.map((__, bandIdx) => ({ value: ((dirIdx * 7 + bandIdx * 18) % 100), missing: false }))
  );
  const skyValues = DIRECTIONS.map((_, dirIdx) =>
    DISTANCE_BANDS.map((__, bandIdx) => ({ value: ((dirIdx * 5 + bandIdx * 22) % 100), missing: false }))
  );
  const thunderValues = DIRECTIONS.map((_, dirIdx) =>
    DISTANCE_BANDS.map((__, bandIdx) => ({ value: ((dirIdx * 3 + bandIdx * 15) % 100), missing: false }))
  );

  drawRose(tempCtx, EXPLAINER_ROSE_PX, tempValues, 35, 88, 'temp', {
    showDistanceLabels: true,
    fullDirectionLabels: true,
    showScaleNote: false,
    summitValue: 62,
  });
  drawRose(windCtx, EXPLAINER_ROSE_PX, windValues, 0, 60, 'wind', {
    showDistanceLabels: true,
    fullDirectionLabels: true,
    showScaleNote: false,
    summitValue: 18,
  });
  drawRose(precipCtx, EXPLAINER_ROSE_PX, precipValues, 0, 100, 'precip', {
    showDistanceLabels: true,
    fullDirectionLabels: true,
    showScaleNote: false,
    summitValue: 35,
  });
  drawRose(skyCtx, EXPLAINER_ROSE_PX, skyValues, 0, 100, 'sky', {
    showDistanceLabels: true,
    fullDirectionLabels: true,
    showScaleNote: false,
    summitValue: 60,
  });
  drawRose(thunderCtx, EXPLAINER_ROSE_PX, thunderValues, 0, 100, 'thunder', {
    showDistanceLabels: true,
    fullDirectionLabels: true,
    showScaleNote: false,
    summitValue: 45,
  });

  function cardDescription(canvasId) {
    const copy = document.getElementById(canvasId)
      ?.closest('.explainer-card, #sample-map-card')
      ?.querySelector('.explainer-copy, .sample-map-copy');
    if (!copy) return '';
    const clone = copy.cloneNode(true);
    clone.querySelector('h2')?.remove();
    return clone.innerHTML;
  }

  samplePreviewMeta.set('explainer-temp', {
    type: 'rose', title: 'Temperature Rose', variable: 'temp', values: tempValues, min: 35, max: 88, summitValue: 62,
    description: cardDescription('explainer-temp'),
  });
  samplePreviewMeta.set('explainer-precip', {
    type: 'rose', title: 'Precipitation Rose', variable: 'precip', values: precipValues, min: 0, max: 100, summitValue: 35,
    description: cardDescription('explainer-precip'),
  });
  samplePreviewMeta.set('explainer-wind', {
    type: 'rose', title: 'Wind Rose', variable: 'wind', values: windValues, min: 0, max: 50, summitValue: 18,
    description: cardDescription('explainer-wind'),
  });
  samplePreviewMeta.set('explainer-sky', {
    type: 'rose', title: 'Sky Cover Rose', variable: 'sky', values: skyValues, min: 0, max: 100, summitValue: 60,
    description: cardDescription('explainer-sky'),
  });
  samplePreviewMeta.set('explainer-thunder', {
    type: 'rose', title: 'Thunderstorm Rose', variable: 'thunder', values: thunderValues, min: 0, max: 100, summitValue: 45,
    description: cardDescription('explainer-thunder'),
  });
  samplePreviewMeta.set('sample-map', {
    type: 'map', title: 'Sample Point Map',
    description: cardDescription('sample-map'),
  });
}

function redrawSampleModal(meta) {
  if (!meta) return;
  const canvas = document.getElementById('sample-modal-canvas');
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    const maxSize = Math.round(window.innerHeight * 0.72);
    const size = Math.max(220, Math.min(Math.round(rect.width || 220), maxSize));
    canvas.style.height = `${size}px`;
  }
  const setup = setupResponsiveCanvas('sample-modal-canvas');
  if (!setup) return;
  if (meta.type === 'map') {
    drawSampleMap('sample-modal-canvas', null);
    return;
  }
  drawRose(setup.ctx, setup.width, meta.values, meta.min, meta.max, meta.variable, {
    showDistanceLabels: true,
    fullDirectionLabels: true,
    showScaleNote: false,
    summitValue: meta.summitValue,
  });
}

function redrawRoseModal(sourceId) {
  const sourceMeta = roseCanvasMeta.get(sourceId);
  if (!sourceMeta) return;

  const canvas = document.getElementById('sample-modal-canvas');
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    const size = Math.max(260, Math.round(Math.min(rect.width || 360, window.innerWidth * 0.50, window.innerHeight * 0.50)));
    canvas.style.height = `${size}px`;
  }

  const setup = setupResponsiveCanvas('sample-modal-canvas');
  if (!setup) return;
  drawRose(setup.ctx, setup.width, sourceMeta.values, sourceMeta.min, sourceMeta.max, sourceMeta.variable, {
    showDistanceLabels: true,
    fullDirectionLabels: true,
    showScaleNote: false,
    summitValue: sourceMeta.summit.value,
  });

  roseCanvasMeta.set('sample-modal-canvas', {
    ...sourceMeta,
    sourceId,
  });
}

function openRoseModal(sourceId) {
  const sourceMeta = roseCanvasMeta.get(sourceId);
  const modal = document.getElementById('sample-modal');
  const title = document.getElementById('sample-modal-title');
  const legendWrap = document.getElementById('sample-modal-legend-wrap');
  const legend = document.getElementById('sample-modal-legend');
  const labels = document.getElementById('sample-modal-labels');
  const descDiv = document.getElementById('sample-modal-description');
  const canvas = document.getElementById('sample-modal-canvas');
  if (!sourceMeta || !modal || !title || !legendWrap || !legend || !labels || !canvas) return;

  const cfg = VAR_CONFIG[sourceMeta.variable];
  title.textContent = `${cfg.label} · ${timeLabel(sourceMeta.offset)}`;
  if (descDiv) {
    descDiv.innerHTML = '';
    descDiv.hidden = true;
  }

  modal.dataset.roseSourceId = sourceId;
  delete modal.dataset.sampleId;
  modal.classList.add('open', 'rose-modal');
  modal.setAttribute('aria-hidden', 'false');

  canvas.dataset.roseCanvas = 'true';
  legendWrap.classList.add('open');
  legend.dataset.variable = sourceMeta.variable;
  legend.dataset.min = sourceMeta.min;
  legend.dataset.max = sourceMeta.max;
  legend.style.background = gradientFor(sourceMeta.variable, sourceMeta.min, sourceMeta.max);
  labels.innerHTML = legendLabels(sourceMeta.variable, sourceMeta.min, sourceMeta.max).map(label => `<span>${label}</span>`).join('');

  requestAnimationFrame(() => redrawRoseModal(sourceId));
}

function openSampleModal(canvasId) {
  const meta = samplePreviewMeta.get(canvasId);
  const modal = document.getElementById('sample-modal');
  const title = document.getElementById('sample-modal-title');
  const legendWrap = document.getElementById('sample-modal-legend-wrap');
  const legend = document.getElementById('sample-modal-legend');
  const labels = document.getElementById('sample-modal-labels');
  const descDiv = document.getElementById('sample-modal-description');
  if (!meta || !modal || !title || !legendWrap || !legend || !labels) return;

  modal.dataset.sampleId = canvasId;
  delete modal.dataset.roseSourceId;
  modal.classList.remove('rose-modal');
  roseCanvasMeta.delete('sample-modal-canvas');
  document.getElementById('sample-modal-canvas')?.removeAttribute('data-rose-canvas');
  title.textContent = meta.title;
  if (descDiv) {
    descDiv.innerHTML = meta.description || '';
    descDiv.hidden = !meta.description;
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  if (meta.type === 'rose') {
    legendWrap.classList.add('open');
    legend.dataset.variable = meta.variable;
    legend.dataset.min = meta.min;
    legend.dataset.max = meta.max;
    legend.style.background = gradientFor(meta.variable, meta.min, meta.max);
    labels.innerHTML = legendLabels(meta.variable, meta.min, meta.max).map(label => `<span>${label}</span>`).join('');
  } else {
    legendWrap.classList.remove('open');
    legend.removeAttribute('data-variable');
    labels.innerHTML = '';
  }

  requestAnimationFrame(() => redrawSampleModal(meta));
}

function closeSampleModal() {
  const modal = document.getElementById('sample-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.classList.remove('rose-modal');
  modal.setAttribute('aria-hidden', 'true');
  delete modal.dataset.roseSourceId;
  roseCanvasMeta.delete('sample-modal-canvas');
  document.getElementById('sample-modal-canvas')?.removeAttribute('data-rose-canvas');
  hideLegendHoverBox();
}

function legendHoverValue(variable, pct, min, max) {
  if (variable === 'temp') return min + (max - min) * pct;
  if (variable === 'wind') return pct * 50;
  return pct * 100;
}

function legendHoverLabel(variable, value) {
  if (variable === 'temp') return `${Math.round(value)}°F`;
  if (variable === 'wind') return `${Math.round(value)} mph`;
  return `${Math.round(value)}%`;
}

function textColorForBackground(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? '#10131a' : '#ffffff';
}

function showLegendHoverBox(event) {
  const legend = event.currentTarget;
  const variable = legend.dataset.variable;
  const box = document.getElementById('legend-hover-box');
  if (!variable || !box) return;

  const rect = legend.getBoundingClientRect();
  const pct = clamp01((event.clientX - rect.left) / rect.width);
  const min = Number(legend.dataset.min || 0);
  const max = Number(legend.dataset.max || 100);
  const value = legendHoverValue(variable, pct, min, max);
  const color = VAR_CONFIG[variable].colorFn(value, min, max);

  box.textContent = legendHoverLabel(variable, value);
  box.style.background = color;
  box.style.color = textColorForBackground(color);
  box.style.display = 'flex';
  box.style.left = `${Math.max(8, Math.min(window.innerWidth - 64, event.clientX - 20))}px`;
  box.style.top = `${Math.max(8, Math.min(window.innerHeight - 48, event.clientY + 16))}px`;
}

function hideLegendHoverBox() {
  const box = document.getElementById('legend-hover-box');
  if (box) box.style.display = 'none';
}

// ════════════════════════════════════════════════════════════
// UI
// ════════════════════════════════════════════════════════════
function setStatus(msg) {
  document.getElementById('status').textContent = msg;
}


function onPeakChange() {
  const idx  = +document.getElementById('peak-sel').value;
  currentPeak = PEAKS[idx];
  updatePeakInfo();
  loadData(currentPeak);
}

function updatePeakInfo() {
  const p = currentPeak;
  document.getElementById('peak-info').textContent =
    `${p.lat.toFixed(4)}°N, ${Math.abs(p.lon).toFixed(4)}°W · ${p.elev.toLocaleString()} ft`;
}

function buildPeakSelector() {
  const sel = document.getElementById('peak-sel');
  sel.innerHTML = PEAKS.map((p, i) =>
    `<option value="${i}">${p.name}, ${p.state} — ${p.elev.toLocaleString()} ft</option>`
  ).join('');
}

// ════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  buildPeakSelector();
  updatePeakInfo();
  document.addEventListener('mousemove', event => {
    if (event.target?.matches?.('canvas[data-rose-canvas="true"]')) {
      event.target.style.cursor = cellFromPoint(event.target, event.clientX, event.clientY) ? 'crosshair' : 'pointer';
      showRoseTooltip(event.target, event);
    } else {
      hideRoseTooltip();
    }
  });
  document.addEventListener('click', event => {
    const cell = event.target?.closest?.('.rose-cell');
    const canvas = cell?.querySelector('canvas[data-rose-canvas="true"]');
    if (canvas && roseCanvasMeta.has(canvas.id)) openRoseModal(canvas.id);
  });
  document.addEventListener('mouseleave', hideRoseTooltip);
  document.getElementById('rose-explainer')?.addEventListener('click', event => {
    const card = event.target.closest('.explainer-card, #sample-map-card');
    const canvas = card?.querySelector('canvas');
    if (canvas) openSampleModal(canvas.id);
  });
  document.getElementById('sample-modal-close')?.addEventListener('click', closeSampleModal);
  document.getElementById('sample-modal')?.addEventListener('click', event => {
    if (event.target.id === 'sample-modal') closeSampleModal();
  });
  document.getElementById('sample-modal-legend')?.addEventListener('mousemove', showLegendHoverBox);
  document.getElementById('sample-modal-legend')?.addEventListener('mouseleave', hideLegendHoverBox);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSampleModal();
  });
  window.addEventListener('resize', () => {
    if (roseData) drawSampleMap();
    const modal = document.getElementById('sample-modal');
    const roseSourceId = modal?.dataset.roseSourceId;
    if (modal?.classList.contains('open') && roseSourceId) {
      redrawRoseModal(roseSourceId);
      return;
    }
    const sampleId = modal?.dataset.sampleId;
    if (modal?.classList.contains('open') && sampleId) {
      redrawSampleModal(samplePreviewMeta.get(sampleId));
    }
  });
  loadData(currentPeak);
});
