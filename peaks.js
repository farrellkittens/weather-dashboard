// ════════════════════════════════════════════════════════════
// PEAKS DATABASE  (tier: 14 = 14er, 13 = 13er, 12 = 12er)
// ════════════════════════════════════════════════════════════
const PEAKS = [
  // ── 14ers (alphabetical) ────────────────────────────────
  { name: 'Antero, Mount',            state: 'CO', elev: 14269, lat: 38.6742, lon: -106.2464, tier: 14 },
  { name: 'Belford, Mount',           state: 'CO', elev: 14197, lat: 38.9606, lon: -106.3608, tier: 14 },
  { name: 'Bierstadt, Mount',         state: 'CO', elev: 14060, lat: 39.5828, lon: -105.7086, tier: 14 },
  { name: 'Bross, Mount',             state: 'CO', elev: 14172, lat: 39.3342, lon: -106.1075, tier: 14 },
  { name: 'Capitol, Peak',            state: 'CO', elev: 14130, lat: 39.1508, lon: -107.0822, tier: 14 },
  { name: 'Castle, Peak',             state: 'CO', elev: 14265, lat: 38.9472, lon: -106.8614, tier: 14 },
  { name: 'Challenger, Point',        state: 'CO', elev: 14081, lat: 37.9800, lon: -105.6067, tier: 14 },
  { name: 'Columbia, Mount',          state: 'CO', elev: 14073, lat: 38.9039, lon: -106.2981, tier: 14 },
  { name: 'Crestone, Needle',         state: 'CO', elev: 14197, lat: 37.9644, lon: -105.5767, tier: 14 },
  { name: 'Crestone, Peak',           state: 'CO', elev: 14294, lat: 37.9667, lon: -105.5853, tier: 14 },
  { name: 'Culebra, Peak',            state: 'CO', elev: 14047, lat: 37.1225, lon: -105.1856, tier: 14 },
  { name: 'Democrat, Mount',          state: 'CO', elev: 14148, lat: 39.3397, lon: -106.1400, tier: 14 },
  { name: 'El Diente, Peak',          state: 'CO', elev: 14159, lat: 37.8350, lon: -107.9806, tier: 14 },
  { name: 'Elbert, Mount',            state: 'CO', elev: 14440, lat: 39.1178, lon: -106.4453, tier: 14 },
  { name: 'Ellingwood, Point',        state: 'CO', elev: 14042, lat: 37.9847, lon: -105.4933, tier: 14 },
  { name: 'Eolus, Mount',             state: 'CO', elev: 14083, lat: 37.6217, lon: -107.6228, tier: 14 },
  { name: 'Evans, Mount',             state: 'CO', elev: 14264, lat: 39.5883, lon: -105.6436, tier: 14 },
  { name: 'Grays, Peak',              state: 'CO', elev: 14270, lat: 39.6337, lon: -105.8176, tier: 14 },
  { name: 'Handies, Peak',            state: 'CO', elev: 14048, lat: 37.9131, lon: -107.5047, tier: 14 },
  { name: 'Harvard, Mount',           state: 'CO', elev: 14421, lat: 38.9244, lon: -106.3208, tier: 14 },
  { name: 'Holy Cross, Mount of the', state: 'CO', elev: 14009, lat: 39.4672, lon: -106.4819, tier: 14 },
  { name: 'Humboldt, Peak',           state: 'CO', elev: 14064, lat: 37.9761, lon: -105.5544, tier: 14 },
  { name: 'Huron, Peak',              state: 'CO', elev: 14005, lat: 38.9456, lon: -106.4347, tier: 14 },
  { name: 'Kit Carson, Peak',         state: 'CO', elev: 14165, lat: 37.9797, lon: -105.6022, tier: 14 },
  { name: 'Lincoln, Mount',           state: 'CO', elev: 14286, lat: 39.3514, lon: -106.1114, tier: 14 },
  { name: 'Lindsey, Mount',           state: 'CO', elev: 14042, lat: 37.5836, lon: -105.4436, tier: 14 },
  { name: 'Little Bear, Peak',        state: 'CO', elev: 14037, lat: 37.5669, lon: -105.4972, tier: 14 },
  { name: 'Longs, Peak',              state: 'CO', elev: 14259, lat: 40.2553, lon: -105.6152, tier: 14 },
  { name: 'Maroon, Peak',             state: 'CO', elev: 14156, lat: 39.0706, lon: -106.9889, tier: 14 },
  { name: 'Massive, Mount',           state: 'CO', elev: 14428, lat: 39.1875, lon: -106.4753, tier: 14 },
  { name: 'Missouri, Mountain',       state: 'CO', elev: 14067, lat: 38.9472, lon: -106.3783, tier: 14 },
  { name: 'North Maroon, Peak',       state: 'CO', elev: 14014, lat: 39.0786, lon: -106.9914, tier: 14 },
  { name: 'Oxford, Mount',            state: 'CO', elev: 14153, lat: 38.9644, lon: -106.3383, tier: 14 },
  { name: 'Pikes, Peak',              state: 'CO', elev: 14115, lat: 38.8409, lon: -105.0442, tier: 14 },
  { name: 'Pyramid, Peak',            state: 'CO', elev: 14018, lat: 39.0717, lon: -106.9503, tier: 14 },
  { name: 'Quandary, Peak',           state: 'CO', elev: 14265, lat: 39.3972, lon: -106.1064, tier: 14 },
  { name: 'Redcloud, Peak',           state: 'CO', elev: 14034, lat: 37.9406, lon: -107.5378, tier: 14 },
  { name: 'San Luis, Peak',           state: 'CO', elev: 14014, lat: 38.2131, lon: -106.9317, tier: 14 },
  { name: 'Shavano, Mount',           state: 'CO', elev: 14229, lat: 38.6192, lon: -106.2392, tier: 14 },
  { name: 'Sherman, Mount',           state: 'CO', elev: 14036, lat: 39.2247, lon: -106.1694, tier: 14 },
  { name: 'Sneffels, Mount',          state: 'CO', elev: 14150, lat: 38.0039, lon: -107.7922, tier: 14 },
  { name: 'Snowmass, Mountain',       state: 'CO', elev: 14092, lat: 39.1189, lon: -107.0664, tier: 14 },
  { name: 'Sunlight, Peak',           state: 'CO', elev: 14059, lat: 37.6272, lon: -107.5961, tier: 14 },
  { name: 'Sunshine, Peak',           state: 'CO', elev: 14001, lat: 37.9222, lon: -107.5772, tier: 14 },
  { name: 'Tabeguache, Peak',         state: 'CO', elev: 14155, lat: 38.6258, lon: -106.2506, tier: 14 },
  { name: 'Torreys, Peak',            state: 'CO', elev: 14267, lat: 39.6431, lon: -105.8212, tier: 14 },
  { name: 'Wetterhorn, Peak',         state: 'CO', elev: 14015, lat: 38.0608, lon: -107.5106, tier: 14 },
  { name: 'Wilson, Mount',            state: 'CO', elev: 14246, lat: 37.8392, lon: -107.9914, tier: 14 },
  { name: 'Wilson, Peak',             state: 'CO', elev: 14017, lat: 37.8597, lon: -107.9847, tier: 14 },
  { name: 'Windom, Peak',             state: 'CO', elev: 14082, lat: 37.6214, lon: -107.5917, tier: 14 },
  { name: 'Yale, Mount',              state: 'CO', elev: 14196, lat: 38.8442, lon: -106.3139, tier: 14 },

  // ── 13ers (alphabetical) ────────────────────────────────
  { name: 'Adams, Mount (Crestone)',  state: 'CO', elev: 13931, lat: 37.9553, lon: -105.6181, tier: 13 },
  { name: 'Apache, Peak',             state: 'CO', elev: 13441, lat: 40.0414, lon: -105.6494, tier: 13 },
  { name: 'Argentine, Peak',          state: 'CO', elev: 13738, lat: 39.6400, lon: -105.7867, tier: 13 },
  { name: 'Arikaree, Peak',           state: 'CO', elev: 13150, lat: 40.0356, lon: -105.6408, tier: 13 },
  { name: 'Arrow, Peak',              state: 'CO', elev: 13803, lat: 37.6333, lon: -107.6167, tier: 13 },
  { name: 'Audubon, Mount',           state: 'CO', elev: 13223, lat: 40.0994, lon: -105.6128, tier: 13 },
  { name: 'Cirque, Mountain',         state: 'CO', elev: 13686, lat: 37.9914, lon: -107.5264, tier: 13 },
  { name: 'Crystal, Peak',            state: 'CO', elev: 13852, lat: 39.3961, lon: -106.0867, tier: 13 },
  { name: 'Dallas, Peak',             state: 'CO', elev: 13809, lat: 38.0114, lon: -107.7797, tier: 13 },
  { name: 'Dolores, Peak',            state: 'CO', elev: 13290, lat: 37.8597, lon: -108.0528, tier: 13 },
  { name: 'Drift, Peak',              state: 'CO', elev: 13900, lat: 39.3719, lon: -106.1283, tier: 13 },
  { name: 'Emerald, Peak',            state: 'CO', elev: 13904, lat: 38.6142, lon: -106.2747, tier: 13 },
  { name: 'Engelmann, Peak',          state: 'CO', elev: 13362, lat: 39.7094, lon: -105.9733, tier: 13 },
  { name: 'Epaulet, Mountain',        state: 'CO', elev: 13523, lat: 39.5703, lon: -105.6181, tier: 13 },
  { name: 'Fairchild, Mountain',      state: 'CO', elev: 13502, lat: 40.4800, lon: -105.6658, tier: 13 },
  { name: 'Fletcher, Mountain',       state: 'CO', elev: 13951, lat: 39.3850, lon: -106.0994, tier: 13 },
  { name: 'Grizzly, Peak (Needles)',  state: 'CO', elev: 13738, lat: 37.6356, lon: -107.5689, tier: 13 },
  { name: 'Grizzly, Peak (Sawatch)',  state: 'CO', elev: 13988, lat: 39.0503, lon: -106.5917, tier: 13 },
  { name: "Hague's, Peak",            state: 'CO', elev: 13560, lat: 40.5131, lon: -105.6494, tier: 13 },
  { name: 'Hesperus, Mountain',       state: 'CO', elev: 13232, lat: 37.4464, lon: -108.0983, tier: 13 },
  { name: 'Horseshoe, Mountain',      state: 'CO', elev: 13898, lat: 39.2367, lon: -106.1708, tier: 13 },
  { name: 'Iowa, Peak',               state: 'CO', elev: 13831, lat: 38.9522, lon: -106.4061, tier: 13 },
  { name: 'Jones, Mountain',          state: 'CO', elev: 13860, lat: 38.0036, lon: -107.5681, tier: 13 },
  { name: 'Kelso, Mountain',          state: 'CO', elev: 13164, lat: 39.6367, lon: -105.8147, tier: 13 },
  { name: 'Matterhorn, Peak',         state: 'CO', elev: 13590, lat: 38.0664, lon: -107.5289, tier: 13 },
  { name: 'Milwaukee, Peak',          state: 'CO', elev: 13522, lat: 37.9825, lon: -105.5575, tier: 13 },
  { name: 'Mummy, Mountain',          state: 'CO', elev: 13425, lat: 40.4861, lon: -105.6422, tier: 13 },
  { name: 'North Star, Mountain',     state: 'CO', elev: 13614, lat: 39.2903, lon: -106.1044, tier: 13 },
  { name: 'North Twilight, Peak',     state: 'CO', elev: 13075, lat: 37.5969, lon: -107.6456, tier: 13 },
  { name: 'Ogalalla, Peak',           state: 'CO', elev: 13138, lat: 40.0222, lon: -105.6189, tier: 13 },
  { name: 'Oso, Mount',               state: 'CO', elev: 13684, lat: 38.0092, lon: -107.4997, tier: 13 },
  { name: 'Ouray, Mount',             state: 'CO', elev: 13971, lat: 38.4231, lon: -106.2236, tier: 13 },
  { name: 'Pacific, Peak',            state: 'CO', elev: 13950, lat: 39.3792, lon: -106.1058, tier: 13 },
  { name: 'Paiute, Peak',             state: 'CO', elev: 13088, lat: 40.0964, lon: -105.6381, tier: 13 },
  { name: 'Pettingell, Peak',         state: 'CO', elev: 13553, lat: 39.7208, lon: -105.9539, tier: 13 },
  { name: 'Potosi, Peak',             state: 'CO', elev: 13786, lat: 38.0331, lon: -107.7661, tier: 13 },
  { name: 'Powell, Mount (Gore)',      state: 'CO', elev: 13534, lat: 39.7689, lon: -106.2758, tier: 13 },
  { name: 'Ptarmigan, Peak',          state: 'CO', elev: 13739, lat: 39.3636, lon: -106.0736, tier: 13 },
  { name: 'Rogers, Peak',             state: 'CO', elev: 13391, lat: 39.5867, lon: -105.6489, tier: 13 },
  { name: 'Rosalie, Peak',            state: 'CO', elev: 13575, lat: 39.5022, lon: -105.6589, tier: 13 },
  { name: 'Sniktau, Mount',           state: 'CO', elev: 13234, lat: 39.6772, lon: -105.7622, tier: 13 },
  { name: 'Spread Eagle, Peak',       state: 'CO', elev: 13523, lat: 37.9969, lon: -105.5478, tier: 13 },
  { name: 'Square Top, Mountain',     state: 'CO', elev: 13794, lat: 39.5683, lon: -105.7189, tier: 13 },
  { name: 'Storm King, Peak',         state: 'CO', elev: 13752, lat: 37.6228, lon: -107.5994, tier: 13 },
  { name: 'Teakettle, Mountain',      state: 'CO', elev: 13819, lat: 38.0156, lon: -107.7519, tier: 13 },
  { name: 'Teocalli, Mountain',       state: 'CO', elev: 13208, lat: 38.9833, lon: -107.0167, tier: 13 },
  { name: 'Trinchera, Peak',          state: 'CO', elev: 13517, lat: 37.2289, lon: -105.3456, tier: 13 },
  { name: 'Trinity, Peak',            state: 'CO', elev: 13805, lat: 37.6264, lon: -107.6142, tier: 13 },
  { name: 'Twilight, Peak',           state: 'CO', elev: 13158, lat: 37.5967, lon: -107.6408, tier: 13 },
  { name: 'Vestal, Peak',             state: 'CO', elev: 13864, lat: 37.6494, lon: -107.6139, tier: 13 },
  { name: 'Ypsilon, Mountain',        state: 'CO', elev: 13514, lat: 40.4661, lon: -105.6717, tier: 13 },

  // ── 12ers (alphabetical) ────────────────────────────────
  { name: 'Andrews, Peak',            state: 'CO', elev: 12565, lat: 40.2756, lon: -105.7222, tier: 12 },
  { name: 'Bethel, Mount',            state: 'CO', elev: 12705, lat: 39.5917, lon: -105.9561, tier: 12 },
  { name: 'Breckenridge, Peak 8',     state: 'CO', elev: 12987, lat: 39.4742, lon: -106.0439, tier: 12 },
  { name: 'Buffalo, Mountain',        state: 'CO', elev: 12777, lat: 39.5172, lon: -106.0439, tier: 12 },
  { name: 'Engineer, Mountain (SJ)',   state: 'CO', elev: 12972, lat: 37.6611, lon: -107.7458, tier: 12 },
  { name: 'Flattop, Mountain (RMNP)', state: 'CO', elev: 12324, lat: 40.3253, lon: -105.7183, tier: 12 },
  { name: 'Ida, Mount',               state: 'CO', elev: 12880, lat: 40.3847, lon: -105.7294, tier: 12 },
  { name: 'Julian, Mount',            state: 'CO', elev: 12928, lat: 40.4028, lon: -105.8250, tier: 12 },
  { name: 'Otis, Peak',               state: 'CO', elev: 12486, lat: 40.2897, lon: -105.6603, tier: 12 },
  { name: 'Porphyry, Peak',           state: 'CO', elev: 12756, lat: 39.2222, lon: -106.1614, tier: 12 },
  { name: 'Richthofen, Mount',        state: 'CO', elev: 12940, lat: 40.5172, lon: -105.9450, tier: 12 },
  { name: 'Stanley, Mountain',        state: 'CO', elev: 12521, lat: 39.7928, lon: -105.7667, tier: 12 },
  { name: 'Thatchtop, Mountain',      state: 'CO', elev: 12668, lat: 40.2736, lon: -105.6656, tier: 12 },
  { name: 'Vasquez, Peak',            state: 'CO', elev: 12947, lat: 39.7789, lon: -105.8797, tier: 12 },
  { name: 'Wuh, Mount',               state: 'CO', elev: 12402, lat: 40.3839, lon: -105.8286, tier: 12 },
  { name: 'Zirkel, Mount',            state: 'CO', elev: 12180, lat: 40.7839, lon: -106.6306, tier: 12 },
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
const MOBILE_ROSE_MEDIA = '(max-width: 920px)';
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
let currentPeak = null;
let roseData    = null;  // { summit, directions: [{name, bearing, bands: [{label, periods}]}] }
const roseCanvasMeta = new Map();
const samplePreviewMeta = new Map();
const roseSelections = new Map();
let loadSequence = 0;
let isLoading = false;

const NWS_CACHE_PREFIX = 'summit-weather-rose:nws:';
const POINT_CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const FORECAST_CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_NWS_CONCURRENT_REQUESTS = 6;

// City autocomplete state
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
  'District of Columbia':'DC','Puerto Rico':'PR',
};
let _suggestTimer = null;
let _suggestions  = [];
let _activeIdx    = -1;

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
function nwsCacheKey(url) {
  return NWS_CACHE_PREFIX + url;
}

function readCachedJson(url, ttlMs) {
  try {
    const raw = localStorage.getItem(nwsCacheKey(url));
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
    localStorage.setItem(nwsCacheKey(url), JSON.stringify({
      storedAt: Date.now(),
      data,
    }));
  } catch (error) {
    // localStorage can fill up or be disabled; the app can still fetch live data.
  }
}

async function fetchJsonWithCache(url, ttlMs) {
  if (window.SharedLocation) {
    return SharedLocation.fetchJson(url, {
      ttlMs,
      fetchOptions: { headers: { Accept: 'application/geo+json, application/json' } },
    });
  }
  const cached = readCachedJson(url, ttlMs);
  if (cached) return cached;

  const r = await fetch(url, {
    headers: { Accept: 'application/geo+json, application/json' },
  });
  if (!r.ok) throw new Error(r.status);
  const data = await r.json();
  writeCachedJson(url, data);
  return data;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;
  const workerCount = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await mapper(items[index], index);
    }
  }));
  return results;
}

async function fetchPointUrls(lat, lon) {
  const data = await fetchJsonWithCache(`https://api.weather.gov/points/${Number(lat).toFixed(4)},${Number(lon).toFixed(4)}`, POINT_CACHE_TTL_MS);
  const props = data.properties;
  return {
    hourlyUrl: props.forecastHourly,
    gridUrl: props.forecastGridData,
  };
}

async function fetchPeriods(url) {
  return (await fetchJsonWithCache(url, FORECAST_CACHE_TTL_MS)).properties.periods;
}

async function fetchGridProperties(url) {
  return (await fetchJsonWithCache(url, FORECAST_CACHE_TTL_MS)).properties;
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
async function buildRoseDataForPeak(peak, onStatus = () => {}) {
  const samplePoints = DIRECTIONS.flatMap((dir, dirIdx) =>
    DISTANCE_BANDS.map((band, bandIdx) => ({
      ...dir,
      dirIdx,
      bandIdx,
      band,
      coords: offsetCoords(peak.lat, peak.lon, dir.bearing, band.km),
    }))
  );

  onStatus(`Fetching NWS grid assignments for summit plus ${samplePoints.length} direction/distance samples...`);
  const [summitResult, pointResults] = await Promise.all([
      fetchPointUrls(peak.lat, peak.lon)
        .catch(() => ({ hourlyUrl: null, gridUrl: null })),
      mapWithConcurrency(samplePoints, MAX_NWS_CONCURRENT_REQUESTS, d =>
        fetchPointUrls(d.coords.lat, d.coords.lon)
          .then(urls => ({ ...d, ...urls }))
          .catch(() => ({ ...d, hourlyUrl: null, gridUrl: null }))
      ),
    ]);

  const hourlyUrlSet = new Set([
    summitResult.hourlyUrl,
    ...pointResults.map(r => r.hourlyUrl),
  ].filter(Boolean));
  const gridUrlSet = new Set([
    summitResult.gridUrl,
    ...pointResults.map(r => r.gridUrl),
  ].filter(Boolean));
  onStatus(`Fetching ${hourlyUrlSet.size} unique NWS hourly forecasts and ${gridUrlSet.size} grid datasets...`);

  const hourlyMap = new Map();
  const gridMap = new Map();
  await Promise.all([
    mapWithConcurrency(Array.from(hourlyUrlSet), MAX_NWS_CONCURRENT_REQUESTS, url =>
      fetchPeriods(url)
        .then(p => hourlyMap.set(url, p))
        .catch(() => hourlyMap.set(url, null))
    ),
    mapWithConcurrency(Array.from(gridUrlSet), MAX_NWS_CONCURRENT_REQUESTS, url =>
      fetchGridProperties(url)
        .then(p => gridMap.set(url, p))
        .catch(() => gridMap.set(url, null))
    ),
  ]);

  return {
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
}

async function loadData(peak) {
  const loadId = ++loadSequence;
  setLoading(true, `Refreshing forecast data for ${peak.name}...`);
  roseData = null;
  roseSelections.clear();
  setStatus('Calculating offset coordinates...');
  window.SharedLocation?.saveLocation({
    lat: peak.lat,
    lon: peak.lon,
    label: peak.name,
    source: 'summit',
    elev: peak.elev || 0,
    tier: peak.tier || 0,
  });

  try {
    const data = await buildRoseDataForPeak(peak, setStatus);
    if (loadId !== loadSequence) return;

    roseData = data;

    setStatus('');
    drawAll();
  } catch (error) {
    if (loadId === loadSequence) {
      setStatus(`Unable to refresh forecast data for ${peak.name}.`);
    }
  } finally {
    if (loadId === loadSequence) setLoading(false);
  }
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

function selectedCellPoint(cell, W, cx, cy, R) {
  if (!cell) return null;
  if (cell.summit) return { x: cx, y: cy };

  const { inner, outer } = ringBounds(cell.bandIdx, R);
  const radius = (inner + outer) / 2;
  const angle = (cell.dirIdx * 22.5 - 90) * Math.PI / 180;
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

function drawSelectionDot(ctx, W, cx, cy, R, cell) {
  const point = selectedCellPoint(cell, W, cx, cy, R);
  if (!point) return;

  ctx.beginPath();
  ctx.arc(point.x, point.y, Math.max(4, W * 0.018), 0, 2 * Math.PI);
  ctx.fillStyle = '#050505';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.86)';
  ctx.lineWidth = Math.max(1.5, W * 0.006);
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
  drawSelectionDot(ctx, W, cx, cy, R, options.selectedCell);

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
    const label = offset === 0 ? 'Now' : `+${offset} hrs`;
    const time = forecastTimeLabel(offset);
    const el = document.getElementById(`col-hdr-${i}`);
    if (el) {
      el.innerHTML = `<span class="col-hdr-main">${label}</span><span class="col-hdr-time">${time}</span>`;
    }
    document.querySelectorAll(`.rose-row .rose-cell:nth-child(${i + 2})`).forEach(cell => {
      cell.dataset.offsetLabel = label;
      cell.dataset.offsetTime = time;
      cell.dataset.offsetDate = forecastDateLabel(offset);
      cell.dataset.offsetClock = forecastClockLabel(offset);
    });
  });
}

function updatePlaceholderColumnHeaders() {
  TIME_OFFSETS.forEach((offset, i) => {
    const label = offset === 0 ? 'Now' : `+${offset} hrs`;
    const el = document.getElementById(`col-hdr-${i}`);
    if (el) {
      el.innerHTML = `<span class="col-hdr-main">${label}</span><span class="col-hdr-time">No data</span>`;
    }
    document.querySelectorAll(`.rose-row .rose-cell:nth-child(${i + 2})`).forEach(cell => {
      cell.dataset.offsetLabel = label;
      cell.dataset.offsetTime = 'No data';
      cell.dataset.offsetDate = '';
      cell.dataset.offsetClock = '';
    });
  });
}

function forecastTimeLabel(offset) {
  const t = new Date(Date.now() + offset * 3_600_000);
  return t.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function forecastDateLabel(offset) {
  const t = new Date(Date.now() + offset * 3_600_000);
  return t.toLocaleString(undefined, { month: 'short', day: 'numeric' });
}

function forecastClockLabel(offset) {
  const t = new Date(Date.now() + offset * 3_600_000);
  return t.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
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
  if (variable === 'sky') return 'Each panel has 64 sky-cover boxes; blue is clear sky, white is overcast.';
  if (variable === 'precip') return 'Deeper blue means higher chance.';
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

function collectValuesFromData(data, varKey, offsets = TIME_OFFSETS) {
  const values = [];
  if (!data) return values;
  for (const offset of offsets) {
    const summitValue = extractValue(getPeriodAt(data.summit?.periods, offset), varKey, data.summit?.grid, offset);
    if (summitValue !== null) values.push(summitValue);
    for (const dir of data.directions) {
      for (const band of dir.bands) {
        const v = extractValue(getPeriodAt(band.periods, offset), varKey, band.grid, offset);
        if (v !== null) values.push(v);
      }
    }
  }
  return values;
}

function collectValues(varKey) {
  return collectValuesFromData(roseData, varKey);
}

function valuesForOffsetFromData(data, varKey, offset) {
  return data.directions.map(dir =>
    dir.bands.map(band => {
      const period = getPeriodAt(band.periods, offset);
      const value = extractValue(period, varKey, band.grid, offset);
      return { value, missing: value === null };
    })
  );
}

function valuesForOffset(varKey, offset) {
  return valuesForOffsetFromData(roseData, varKey, offset);
}

function summitValueForOffsetFromData(data, varKey, offset) {
  const period = getPeriodAt(data.summit?.periods, offset);
  const value = extractValue(period, varKey, data.summit?.grid, offset);
  return { value, missing: value === null };
}

function summitValueForOffset(varKey, offset) {
  return summitValueForOffsetFromData(roseData, varKey, offset);
}

function timeLabel(offset) {
  if (offset === 0) return 'Now';
  const t = new Date(Date.now() + offset * 3_600_000);
  return `+${offset} hrs · ${t.toLocaleString(undefined, { weekday: 'short', hour: 'numeric' })}`;
}

function isMobileRoseLayout() {
  return window.matchMedia?.(MOBILE_ROSE_MEDIA).matches;
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

function validRoseCell(meta, cell) {
  if (!meta || !cell) return false;
  const point = cell.summit ? meta.summit : meta.values[cell.dirIdx]?.[cell.bandIdx];
  return !!point && !point.missing && point.value !== null;
}

function positionTooltip(event) {
  const tooltip = document.getElementById('rose-tooltip');
  if (!tooltip) return;

  const aboveTap = event.pointerType === 'touch';
  const x = aboveTap ? event.clientX - 75 : event.clientX + 14;
  const y = aboveTap ? event.clientY - 96 : event.clientY + 14;
  tooltip.style.left = `${Math.max(8, Math.min(window.innerWidth - 235, x))}px`;
  tooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - 90, y))}px`;
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

  if (!validRoseCell(meta, cell)) {
    hideRoseTooltip();
    return;
  }

  const point = cell.summit ? meta.summit : meta.values[cell.dirIdx]?.[cell.bandIdx];
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
  positionTooltip(event);
}

function hideRoseTooltip() {
  const tooltip = document.getElementById('rose-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

function drawRoseCanvasById(canvasId) {
  const meta = roseCanvasMeta.get(canvasId);
  if (!meta) return;

  if (canvasId === 'sample-modal-canvas') {
    const setup = setupResponsiveCanvas(canvasId);
    if (!setup) return;
    drawRose(setup.ctx, setup.width, meta.values, meta.min, meta.max, meta.variable, {
      showDistanceLabels: true,
      fullDirectionLabels: true,
      showScaleNote: false,
      summitValue: meta.summit.value,
      selectedCell: roseSelections.get(canvasId) || roseSelections.get(meta.sourceId),
    });
    return;
  }

  const ctx = setupCanvas(canvasId);
  drawRose(ctx, ROSE_PX, meta.values, meta.min, meta.max, meta.variable, {
    showDistanceLabels: true,
    fullDirectionLabels: false,
    summitValue: meta.summit.value,
    selectedCell: roseSelections.get(canvasId),
  });
}

function selectRoseCell(canvas, event) {
  const meta = roseCanvasMeta.get(canvas.id);
  const cell = cellFromPoint(canvas, event.clientX, event.clientY);
  if (!validRoseCell(meta, cell)) return false;

  roseSelections.set(canvas.id, cell);
  if (meta.sourceId) roseSelections.set(meta.sourceId, cell);
  drawRoseCanvasById(canvas.id);
  showRoseTooltip(canvas, event);
  return true;
}

function projectSamplePoint(lat, lon, centerLat, centerLon, scale, cx, cy) {
  const latMiles = (lat - centerLat) * 69.0;
  const lonMiles = (lon - centerLon) * 69.0 * Math.cos(centerLat * Math.PI / 180);
  return {
    x: cx + lonMiles * scale,
    y: cy - latMiles * scale,
  };
}

function drawSampleMap(id = 'sample-map', statusId = 'sample-map-status', data = roseData, peak = currentPeak, isExample = false) {
  if (!data || !peak) return;
  const setup = setupResponsiveCanvas(id);
  if (!setup) return;

  const { ctx, width, height } = setup;
  const cx = width / 2;
  const cy = height / 2;
  const maxMiles = Math.max(...DISTANCE_BANDS.map(b => b.miles));
  const scale = Math.min(width, height) * 0.40 / maxMiles;
  const centerLat = peak.lat;
  const centerLon = peak.lon;

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
  data.directions.forEach(dir => {
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
    const prefix = isExample ? 'Generic example sample: ' : '';
    status.textContent = `${prefix}${returned} of ${total} sample points returned forecast data. Green dots are active sample coordinates; gray dots did not return a forecast grid.`;
  }
}

function drawGenericSampleMap(id = 'sample-map', statusId = 'sample-map-status') {
  const setup = setupResponsiveCanvas(id);
  if (!setup) return;
  const { ctx, width, height } = setup;
  const cx = width / 2;
  const cy = height / 2;
  const maxMiles = Math.max(...DISTANCE_BANDS.map(b => b.miles));
  const scale = Math.min(width, height) * 0.40 / maxMiles;

  ctx.fillStyle = '#171724';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
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
    ctx.strokeStyle = band.miles === maxMiles ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.14)';
    ctx.lineWidth = band.miles === maxMiles ? 1.4 : 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(226,233,243,0.72)';
    ctx.font = `${Math.round(width * 0.033)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(band.label, cx + width * 0.08, cy - band.miles * scale - width * 0.025);
  });

  DIRECTIONS.forEach(dir => {
    const a = (dir.bearing - 90) * Math.PI / 180;
    DISTANCE_BANDS.forEach(band => {
      const x = cx + Math.cos(a) * band.miles * scale;
      const y = cy + Math.sin(a) * band.miles * scale;
      ctx.beginPath();
      ctx.arc(x, y, 2.1, 0, 2 * Math.PI);
      ctx.fillStyle = '#6e7480';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.20)';
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
    status.textContent = 'Generic sample layout. Location-specific sample points appear after a peak, city, or coordinates are loaded.';
  }
}

function drawPlaceholderRoseGrid() {
  updatePlaceholderColumnHeaders();
  roseCanvasMeta.clear();
  roseSelections.clear();

  for (const varKey of PANEL_VARS) {
    const meta = fallbackExplainerValues(varKey);
    TIME_OFFSETS.forEach((offset, timeIdx) => {
      const roseCtx = setupCanvas(`rose-${varKey}-${timeIdx}`);
      if (!roseCtx) return;
      drawRose(roseCtx, ROSE_PX, meta.values, meta.min, meta.max, varKey, {
        showDistanceLabels: true,
        fullDirectionLabels: false,
        summitValue: meta.summit.value,
      });
      updateLegend(varKey, timeIdx, meta.min, meta.max);
    });
  }
}

function drawNoLocationState() {
  roseData = null;
  drawExplainers(null, null, false);
  drawGenericSampleMap();
  samplePreviewMeta.delete('sample-map');
  drawPlaceholderRoseGrid();
  updateExplainerNote(true, null, 'No location data selected. Example shown with generic sample colors only; select a peak, city, or coordinates to load live forecast data.');
  setStatus('No location data selected. Generic sample roses are shown until you load a location.');
}

function drawAll() {
  if (!roseData) return;
  updateColumnHeaders();
  drawExplainers(roseData, currentPeak, false);
  drawSampleMap('sample-map', 'sample-map-status', roseData, currentPeak, false);
  updateExplainerNote(false, currentPeak);
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
        selectedCell: roseSelections.get(`rose-${varKey}-${timeIdx}`),
      });
      roseCanvasMeta.set(`rose-${varKey}-${timeIdx}`, { variable: varKey, offset, values, summit, min: globalMin, max: globalMax });
      updateLegend(varKey, timeIdx, globalMin, globalMax);
    });
  }
}

function updateExplainerNote(isExample, peak, fallbackText = '') {
  const note = document.getElementById('explainer-example-note');
  if (!note) return;
  if (fallbackText) {
    note.textContent = fallbackText;
    return;
  }
  if (isExample) {
    note.textContent = `Example shown with generic sample colors. Select a peak, city, or coordinates to load current data for your location.`;
    return;
  }
  note.textContent = `Current location loaded: ${peak.name}. The explainer panels and rose grid now reflect this location.`;
}

function fallbackExplainerValues(variable) {
  if (variable === 'temp') {
    return {
      values: DIRECTIONS.map((_, dirIdx) =>
        DISTANCE_BANDS.map((__, bandIdx) => ({ value: 35 + dirIdx * 2 + bandIdx * 7, missing: false }))
      ),
      min: 35, max: 88, summit: { value: 62, missing: false },
    };
  }
  if (variable === 'wind') {
    return {
      values: DIRECTIONS.map((_, dirIdx) =>
        DISTANCE_BANDS.map((__, bandIdx) => ({ value: 8 + ((dirIdx + bandIdx * 3) % 12) * 4, missing: false }))
      ),
      min: 0, max: 50, summit: { value: 18, missing: false },
    };
  }
  if (variable === 'precip') {
    return {
      values: DIRECTIONS.map((_, dirIdx) =>
        DISTANCE_BANDS.map((__, bandIdx) => ({ value: ((dirIdx * 7 + bandIdx * 18) % 100), missing: false }))
      ),
      min: 0, max: 100, summit: { value: 35, missing: false },
    };
  }
  if (variable === 'sky') {
    return {
      values: DIRECTIONS.map((_, dirIdx) =>
        DISTANCE_BANDS.map((__, bandIdx) => ({ value: ((dirIdx * 5 + bandIdx * 22) % 100), missing: false }))
      ),
      min: 0, max: 100, summit: { value: 60, missing: false },
    };
  }
  return {
    values: DIRECTIONS.map((_, dirIdx) =>
      DISTANCE_BANDS.map((__, bandIdx) => ({ value: ((dirIdx * 3 + bandIdx * 15) % 100), missing: false }))
    ),
    min: 0, max: 100, summit: { value: 45, missing: false },
  };
}

function explainerDataForVariable(data, variable) {
  if (!data) return fallbackExplainerValues(variable);
  const values = valuesForOffsetFromData(data, variable, 0);
  const summit = summitValueForOffsetFromData(data, variable, 0);
  const flat = collectValuesFromData(data, variable, [0]);
  const cfg = VAR_CONFIG[variable];
  const min = cfg.fixedMin ?? (flat.length ? Math.min(...flat) : 0);
  const max = cfg.fixedMax ?? (flat.length ? Math.max(...flat) : 1);
  if (!flat.length) return fallbackExplainerValues(variable);
  return { values, min, max, summit };
}

function drawExplainers(data = roseData, peak = currentPeak, isExample = false) {
  samplePreviewMeta.clear();
  const examples = {
    temp: explainerDataForVariable(data, 'temp'),
    wind: explainerDataForVariable(data, 'wind'),
    precip: explainerDataForVariable(data, 'precip'),
    sky: explainerDataForVariable(data, 'sky'),
    thunder: explainerDataForVariable(data, 'thunder'),
  };

  Object.entries({
    temp: 'explainer-temp',
    wind: 'explainer-wind',
    precip: 'explainer-precip',
    sky: 'explainer-sky',
    thunder: 'explainer-thunder',
  }).forEach(([variable, canvasId]) => {
    const ctx = setupSizedCanvas(canvasId, EXPLAINER_ROSE_PX, EXPLAINER_ROSE_PX);
    const meta = examples[variable];
    drawRose(ctx, EXPLAINER_ROSE_PX, meta.values, meta.min, meta.max, variable, {
      showDistanceLabels: true,
      fullDirectionLabels: true,
      showScaleNote: false,
      summitValue: meta.summit.value,
    });
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

  const titlePrefix = isExample ? 'Generic Example · ' : '';
  samplePreviewMeta.set('explainer-temp', {
    type: 'rose', title: `${titlePrefix}Temperature`, variable: 'temp', values: examples.temp.values, min: examples.temp.min, max: examples.temp.max, summitValue: examples.temp.summit.value,
    description: cardDescription('explainer-temp'),
  });
  samplePreviewMeta.set('explainer-precip', {
    type: 'rose', title: `${titlePrefix}Precipitation`, variable: 'precip', values: examples.precip.values, min: examples.precip.min, max: examples.precip.max, summitValue: examples.precip.summit.value,
    description: cardDescription('explainer-precip'),
  });
  samplePreviewMeta.set('explainer-wind', {
    type: 'rose', title: `${titlePrefix}Wind`, variable: 'wind', values: examples.wind.values, min: examples.wind.min, max: examples.wind.max, summitValue: examples.wind.summit.value,
    description: cardDescription('explainer-wind'),
  });
  samplePreviewMeta.set('explainer-sky', {
    type: 'rose', title: `${titlePrefix}Sky Cover`, variable: 'sky', values: examples.sky.values, min: examples.sky.min, max: examples.sky.max, summitValue: examples.sky.summit.value,
    description: cardDescription('explainer-sky'),
  });
  samplePreviewMeta.set('explainer-thunder', {
    type: 'rose', title: `${titlePrefix}Thunderstorm`, variable: 'thunder', values: examples.thunder.values, min: examples.thunder.min, max: examples.thunder.max, summitValue: examples.thunder.summit.value,
    description: cardDescription('explainer-thunder'),
  });
  samplePreviewMeta.set('sample-map', {
    type: 'map', title: `${titlePrefix}Sample Point Map`, data, peak, isExample,
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
    drawSampleMap('sample-modal-canvas', null, meta.data || roseData, meta.peak || currentPeak, meta.isExample);
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
    selectedCell: roseSelections.get(sourceId),
  });

  roseCanvasMeta.set('sample-modal-canvas', {
    ...sourceMeta,
    sourceId,
  });
  if (roseSelections.has(sourceId)) {
    roseSelections.set('sample-modal-canvas', roseSelections.get(sourceId));
  }
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
  roseSelections.delete('sample-modal-canvas');
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
  roseSelections.delete('sample-modal-canvas');
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
  if (isLoading && msg) {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) loadingMessage.textContent = msg;
  }
}

function setLoading(loading, message = 'Refreshing forecast data...') {
  isLoading = loading;
  document.body.classList.toggle('is-loading', loading);
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.toggle('open', loading);
    overlay.setAttribute('aria-hidden', loading ? 'false' : 'true');
  }
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) loadingMessage.textContent = message;
}

function getFilteredPeaks() {
  const tier = document.getElementById('tier-sel')?.value || 'all';
  if (tier === 'all') return PEAKS;
  return PEAKS.filter(p => p.tier === +tier);
}

function onTierChange() {
  buildPeakSelector();
  currentPeak = null;
  document.getElementById('peak-sel').value = '';
  document.getElementById('coords').value = '';
  document.getElementById('city').value = '';
  updatePeakInfo();
  drawNoLocationState();
}

function onPeakChange() {
  const value = document.getElementById('peak-sel').value;
  if (value === '') {
    currentPeak = null;
    document.getElementById('coords').value = '';
    document.getElementById('city').value = '';
    updatePeakInfo();
    drawNoLocationState();
    return;
  }
  const idx = +value;
  const filtered = getFilteredPeaks();
  currentPeak = filtered[idx];
  document.getElementById('coords').value = `${currentPeak.lat}, ${currentPeak.lon}`;
  document.getElementById('city').value = '';
  updatePeakInfo();
  loadData(currentPeak);
}

function loadFromCoords() {
  const raw = document.getElementById('coords').value.trim().replace(/[()]/g, '');
  const parts = raw.split(/[\s,]+/);
  const lat = parseFloat(parts[0]);
  const lon = parseFloat(parts[1]);
  if (isNaN(lat) || isNaN(lon)) { setStatus('Invalid coordinates'); return; }
  currentPeak = { name: 'Custom Location', state: 'CO', elev: 0, lat, lon, tier: 0 };
  updatePeakInfo();
  loadData(currentPeak);
}

function getCurrentPeakLocation() {
  if (!currentPeak) return null;
  return {
    lat: currentPeak.lat,
    lon: currentPeak.lon,
    label: currentPeak.name || document.getElementById('city').value.trim() || 'Shared location',
    source: 'summit',
    elev: currentPeak.elev || 0,
    tier: currentPeak.tier || 0,
  };
}

function applySharedPeakLocation() {
  const shared = window.SharedLocation?.readLocation();
  if (!window.SharedLocation?.isEnabled() || !shared) return false;
  currentPeak = {
    name: shared.label || 'Shared Location',
    state: 'CO',
    elev: shared.elev || 0,
    lat: Number(shared.lat),
    lon: Number(shared.lon),
    tier: shared.tier || 0,
  };
  document.getElementById('peak-sel').value = '';
  document.getElementById('city').value = shared.label || '';
  document.getElementById('coords').value = `${currentPeak.lat.toFixed(4)}, ${currentPeak.lon.toFixed(4)}`;
  updatePeakInfo();
  loadData(currentPeak);
  return true;
}

function updatePeakInfo() {
  const p = currentPeak;
  if (!p) {
    document.getElementById('peak-info').textContent = 'No location data selected';
    return;
  }
  const elevStr = p.elev ? ` · ${p.elev.toLocaleString()} ft` : '';
  document.getElementById('peak-info').textContent =
    `${p.lat.toFixed(4)}°N, ${Math.abs(p.lon).toFixed(4)}°W${elevStr}`;
}

function buildPeakSelector() {
  const sel = document.getElementById('peak-sel');
  const filtered = getFilteredPeaks();
  sel.innerHTML = '<option value="">Select a peak...</option>' + filtered.map((p, i) =>
    `<option value="${i}">${p.name} — ${p.elev.toLocaleString()} ft</option>`
  ).join('');
}

// ── City autocomplete ──────────────────────────────────────
function cityLabel(r) {
  const p = r.properties;
  const name = /^\d{5}/.test(p.name) ? (p.city || p.town || p.name) : p.name;
  const st = STATE_ABBR[p.state] || '';
  return st ? `${name}, ${st}` : name;
}

function peakDebounceSuggest() {
  clearTimeout(_suggestTimer);
  _suggestTimer = setTimeout(peakFetchSuggestions, 320);
}

async function peakFetchSuggestions() {
  const q = document.getElementById('city').value.trim();
  if (q.length < 2) { closePeakSuggestions(); return; }
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=15&lang=en`,
      { headers: { 'User-Agent': 'NWS-Weather-Dashboard/1.0' } }
    );
    const data = await res.json();
    const us = data.features
      .filter(f => f.properties.countrycode === 'US' && f.properties.name)
      .slice(0, 7);
    renderPeakSuggestions(us);
  } catch(e) { closePeakSuggestions(); }
}

function setPeakActiveItem(idx) {
  _activeIdx = idx;
  document.querySelectorAll('#city-suggestions .sug-item').forEach((el, i) => {
    el.style.background = i === idx ? '#1e4a7a' : '';
  });
}

function renderPeakSuggestions(results) {
  _activeIdx = -1;
  _suggestions = results;
  const box = document.getElementById('city-suggestions');
  if (!results.length) { closePeakSuggestions(); return; }
  box.innerHTML = '';
  for (const r of results) {
    const label = cityLabel(r);
    const el = document.createElement('div');
    el.className = 'sug-item';
    el.textContent = label;
    el.style.cursor = 'pointer';
    el.addEventListener('mouseover', () => { _activeIdx = -1; el.style.background = '#1e4a7a'; });
    el.addEventListener('mouseout',  () => { el.style.background = ''; });
    el.onmousedown = e => {
      e.preventDefault();
      peakSelectSuggestion(r.geometry.coordinates[1], r.geometry.coordinates[0], label);
    };
    box.appendChild(el);
  }
  const rect = document.getElementById('city').getBoundingClientRect();
  box.style.position   = 'fixed';
  box.style.zIndex     = '9999';
  box.style.top        = (rect.bottom + 3) + 'px';
  box.style.left       = rect.left + 'px';
  box.style.background = '#1e1e2a';
  box.style.border     = '1px solid #556';
  box.style.borderRadius = '4px';
  box.style.boxShadow  = '0 6px 20px rgba(0,0,0,0.75)';
  box.style.minWidth   = '220px';
  box.style.overflow   = 'hidden';
  box.style.display    = 'block';
}

function peakSelectSuggestion(lat, lon, label) {
  document.getElementById('city').value = label;
  document.getElementById('coords').value = `${parseFloat(lat).toFixed(4)}, ${parseFloat(lon).toFixed(4)}`;
  closePeakSuggestions();
  currentPeak = { name: label, state: 'CO', elev: 0, lat: parseFloat(lat), lon: parseFloat(lon), tier: 0 };
  updatePeakInfo();
  loadData(currentPeak);
}

function closePeakSuggestions() {
  _activeIdx = -1;
  _suggestions = [];
  const box = document.getElementById('city-suggestions');
  if (box) box.style.display = 'none';
}

// ════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tier-sel').value = '14';
  buildPeakSelector();
  document.getElementById('peak-sel').value = '';
  document.getElementById('coords').value = '';
  updatePeakInfo();
  window.SharedLocation?.initCheckbox({ getLocation: getCurrentPeakLocation });

  // City input keyboard nav
  document.getElementById('city')?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePeakSuggestions(); return; }
    const box = document.getElementById('city-suggestions');
    const open = box?.style.display !== 'none' && _suggestions.length;
    if (e.key === 'ArrowDown') {
      if (!open) return;
      e.preventDefault();
      setPeakActiveItem(Math.min(_activeIdx + 1, _suggestions.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      if (!open) return;
      e.preventDefault();
      setPeakActiveItem(Math.max(_activeIdx - 1, -1));
      return;
    }
    if (e.key === 'Enter') {
      if (open && _suggestions.length) {
        const idx = _activeIdx >= 0 ? _activeIdx : 0;
        const r = _suggestions[idx];
        peakSelectSuggestion(r.geometry.coordinates[1], r.geometry.coordinates[0], cityLabel(r));
      }
    }
  });
  document.addEventListener('click', e => {
    if (e.target !== document.getElementById('city')) closePeakSuggestions();
  });

  document.addEventListener('mousemove', event => {
    if (event.target?.matches?.('canvas[data-rose-canvas="true"]')) {
      const meta = roseCanvasMeta.get(event.target.id);
      const cell = cellFromPoint(event.target, event.clientX, event.clientY);
      event.target.style.cursor = validRoseCell(meta, cell) ? 'crosshair' : 'pointer';
      showRoseTooltip(event.target, event);
    } else {
      hideRoseTooltip();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target?.matches?.('canvas[data-rose-canvas="true"]')) return;
    if (event.target.closest?.('.rose-cell') && isMobileRoseLayout()) {
      hideRoseTooltip();
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (selectRoseCell(event.target, event)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
  document.addEventListener('click', event => {
    const roseCell = event.target?.closest?.('.rose-cell');
    if (roseCell && isMobileRoseLayout()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.target?.matches?.('canvas[data-rose-canvas="true"]')) {
      const meta = roseCanvasMeta.get(event.target.id);
      const cell = cellFromPoint(event.target, event.clientX, event.clientY);
      if (validRoseCell(meta, cell)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    }
    const canvas = roseCell?.querySelector('canvas[data-rose-canvas="true"]');
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
    if (roseData) drawSampleMap('sample-map', 'sample-map-status', roseData, currentPeak, false);
    else drawGenericSampleMap('sample-map', 'sample-map-status');
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
  drawNoLocationState();
  applySharedPeakLocation();
});
