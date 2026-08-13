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
// DIRECTIONS — compass points, counterclockwise from North to match canvas drawing
// ════════════════════════════════════════════════════════════
const DIRECTION_SETS = {
  '8': [
    { name: 'N',   bearing:   0 },
    { name: 'NW',  bearing: 315 },
    { name: 'W',   bearing: 270 },
    { name: 'SW',  bearing: 225 },
    { name: 'S',   bearing: 180 },
    { name: 'SE',  bearing: 135 },
    { name: 'E',   bearing:  90 },
    { name: 'NE',  bearing:  45 },
  ],
  '16': [
    { name: 'N',   bearing:   0 },
    { name: 'NNW', bearing: 337.5 },
    { name: 'NW',  bearing: 315 },
    { name: 'WNW', bearing: 292.5 },
    { name: 'W',   bearing: 270 },
    { name: 'WSW', bearing: 247.5 },
    { name: 'SW',  bearing: 225 },
    { name: 'SSW', bearing: 202.5 },
    { name: 'S',   bearing: 180 },
    { name: 'SSE', bearing: 157.5 },
    { name: 'SE',  bearing: 135 },
    { name: 'ESE', bearing: 112.5 },
    { name: 'E',   bearing:  90 },
    { name: 'ENE', bearing:  67.5 },
    { name: 'NE',  bearing:  45 },
    { name: 'NNE', bearing:  22.5 },
  ],
};
let directionMode = '8';
let DIRECTIONS = DIRECTION_SETS[directionMode];

const RELATIVE_TIME_OFFSETS = [0, 3, 6, 12]; // hours from selected start
let forecastStartTimeMs = Date.now();
const TIME_OFFSETS = RELATIVE_TIME_OFFSETS;
const MOBILE_ROSE_MEDIA = '(max-width: 920px)';
const MI_TO_KM = 1.60934;
const DISTANCE_BANDS = [
  { label: '1 mi',  miles: 1,  km: 1 * MI_TO_KM },
  { label: '5 mi',  miles: 5,  km: 5 * MI_TO_KM },
  { label: '10 mi', miles: 10, km: 10 * MI_TO_KM },
  { label: '20 mi', miles: 20, km: 20 * MI_TO_KM },
];
const THUNDER_COLOR_STOPS = ['#d9d9d9', '#6a46ae', '#ff00b7'];

// ════════════════════════════════════════════════════════════
// VARIABLE CONFIG
// ════════════════════════════════════════════════════════════
const VAR_CONFIG = {
  temp:   { label: 'Temp',       unit: '°F',                                  colorFn: tempColor,   legend: 'temp' },
  wind:   { label: 'Wind Speed', unit: 'mph', fixedMax: 50,  fixedMin: 0,    colorFn: windColor,   legend: 'wind' },
  gust:   { label: 'Gusts',      unit: 'mph', fixedMax: 80,  fixedMin: 0,    colorFn: windColor,   legend: 'wind' },
  precip: { label: 'Precip',     unit: '%',   fixedMax: 100, fixedMin: 0,    colorFn: precipColor, legend: 'precip' },
  sky:    { label: 'Sky Cover',  unit: '%',   fixedMax: 100, fixedMin: 0,    colorFn: skyColor,    legend: 'sky' },
  thunder:{ label: 'Thunder',    unit: '%',   fixedMax: 100, fixedMin: 0,    colorFn: thunderColor, legend: 'thunder' },
};

// Ordered list of variables shown as panel rows
const PANEL_VARS = ['temp', 'wind', 'precip', 'sky', 'thunder'];
const SUMMIT_MOBILE_NAV_ITEMS = [
  { id: 'location', label: 'Loc', target: '#controls' },
  { id: 'info', label: 'Info', target: '#rose-explainer' },
  { id: 'map', label: 'Map', target: '#sample-map-card' },
  { id: 'temp', label: 'Temp', target: '#rose-row-temp' },
  { id: 'wind', label: 'Wind', target: '#rose-row-wind' },
  { id: 'precip', label: 'Pcp', target: '#rose-row-precip' },
  { id: 'sky', label: 'Sky', target: '#rose-row-sky' },
  { id: 'thunder', label: 'Storm', target: '#rose-row-thunder' },
];

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
let summitMobileNavReady = false;
let summitMobileNavTargets = [];
let summitMobileNavRaf = null;

const NWS_CACHE_PREFIX = 'summit-weather-rose:nws:v2:';
const LOCATION_LOOKUP_TTL_MS = 12 * 60 * 60 * 1000;
const POINT_CACHE_TTL_MS = LOCATION_LOOKUP_TTL_MS;
const FORECAST_CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_NWS_CONCURRENT_REQUESTS = 6;
const USE_NWS_PROXY_CACHE = true;

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

function directionCount() {
  return DIRECTIONS.length;
}

function directionSampleCount() {
  return directionCount() * DISTANCE_BANDS.length;
}

function directionModeLabel() {
  return `${directionCount()} directions`;
}

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

function tempColor(f, min = f, max = f) {
  const span = max - min;
  const t = span <= 0 ? 0.5 : (f - min) / span;
  return colorRamp(['#91bfdb', '#c6dca8', '#f0d48f', '#e9a06f', '#df714f'], t);
}

function precipColor(pct) {
  return colorRamp(['#f7fbef', '#d9ef8b', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'], clamp01(pct / 100));
}

function skyColor(pct) {
  return colorRamp(['#174d86', '#4f8fc8', '#a7b5c1', '#eef2f6'], clamp01(pct / 100));
}

function thunderColor(pct) {
  return colorRamp(THUNDER_COLOR_STOPS, clamp01(pct / 100));
}

// ════════════════════════════════════════════════════════════
// COORDINATE MATH  (Vincenty-style great-circle offset)
// ════════════════════════════════════════════════════════════
function coordFixed(value, digits) {
  return Number(value).toFixed(digits);
}

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
    lat: +(nlr * 180 / Math.PI).toFixed(2),
    lon: +(nlo * 180 / Math.PI).toFixed(2),
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
  if (USE_NWS_PROXY_CACHE && window.location.protocol !== 'file:') {
    try {
      const proxyUrl = `/api/nws-cache?url=${encodeURIComponent(url)}&ttlSeconds=${Math.max(60, Math.round(ttlMs / 1000))}`;
      return await SharedLocation.fetchJson(proxyUrl, {
        ttlMs,
        fetchOptions: { headers: { Accept: 'application/json' } },
      });
    } catch (_) {
      // Fall back to direct NWS calls if the proxy/cache is unavailable.
    }
  }

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

async function fetchPointUrls(lat, lon, precision = 3) {
  const data = await fetchJsonWithCache(`https://api.weather.gov/points/${coordFixed(lat, precision)},${coordFixed(lon, precision)}`, POINT_CACHE_TTL_MS);
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

const WIND_DIRECTION_BEARINGS = {
  N: 0,
  NNE: 22.5,
  NE: 45,
  ENE: 67.5,
  E: 90,
  ESE: 112.5,
  SE: 135,
  SSE: 157.5,
  S: 180,
  SSW: 202.5,
  SW: 225,
  WSW: 247.5,
  W: 270,
  WNW: 292.5,
  NW: 315,
  NNW: 337.5,
};

function parseWindDirection(value) {
  if (value == null) return null;
  if (typeof value === 'number') return ((value % 360) + 360) % 360;

  const text = String(value).trim().toUpperCase();
  if (!text || text === 'VRB' || text === 'VARIABLE') return null;

  const numeric = text.match(/\d+(?:\.\d+)?/);
  if (numeric) return (+numeric[0] % 360 + 360) % 360;

  return WIND_DIRECTION_BEARINGS[text] ?? null;
}

function bearingToCompass(bearing) {
  if (bearing == null || !Number.isFinite(bearing)) return '';
  const labels = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((((bearing % 360) + 360) % 360) / 22.5) % labels.length;
  return labels[index];
}

function formatWindDirection(bearing) {
  const compass = bearingToCompass(bearing);
  return compass ? `${compass} (${Math.round(bearing)}°)` : '';
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

function forecastDateForOffset(offset) {
  return new Date(forecastStartTimeMs + offset * 3_600_000);
}

function gridValueAt(values, hoursFromStart) {
  if (!values?.length) return null;
  const target = forecastDateForOffset(hoursFromStart);
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

const cToF = c => c == null ? null : Math.round(c * 9 / 5 + 32);

function floorHour(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 0, 0, 0);
}

function ceilHour(d) {
  const floored = floorHour(d);
  if (floored.getTime() >= d.getTime()) return floored;
  return new Date(floored.getTime() + 3_600_000);
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
      fetchPointUrls(peak.lat, peak.lon, 3)
        .catch(() => ({ hourlyUrl: null, gridUrl: null })),
      mapWithConcurrency(samplePoints, MAX_NWS_CONCURRENT_REQUESTS, d =>
        fetchPointUrls(d.coords.lat, d.coords.lon, 2)
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

async function buildRoseDataForPeakProgressive(peak, onStatus = () => {}, onProgress = () => {}) {
  const samplePoints = DIRECTIONS.flatMap((dir, dirIdx) =>
    DISTANCE_BANDS.map((band, bandIdx) => ({
      ...dir,
      dirIdx,
      bandIdx,
      band,
      coords: offsetCoords(peak.lat, peak.lon, dir.bearing, band.km),
    }))
  );

  const data = {
    summit: { coords: { lat: peak.lat, lon: peak.lon }, periods: null, grid: null },
    directions: DIRECTIONS.map((dir, dirIdx) => ({
      ...dir,
      bands: DISTANCE_BANDS.map((band, bandIdx) => {
        const point = samplePoints.find(r => r.dirIdx === dirIdx && r.bandIdx === bandIdx);
        return { ...band, coords: point?.coords ?? null, periods: null, grid: null };
      }),
    })),
    loadTime: new Date(),
  };

  const hourlyMap = new Map();
  const gridMap = new Map();

  onStatus('Fetching summit forecast...');
  const summitResult = await fetchPointUrls(peak.lat, peak.lon, 3)
    .catch(() => ({ hourlyUrl: null, gridUrl: null }));
  await Promise.all([
    summitResult.hourlyUrl
      ? fetchPeriods(summitResult.hourlyUrl).then(p => hourlyMap.set(summitResult.hourlyUrl, p)).catch(() => hourlyMap.set(summitResult.hourlyUrl, null))
      : Promise.resolve(),
    summitResult.gridUrl
      ? fetchGridProperties(summitResult.gridUrl).then(p => gridMap.set(summitResult.gridUrl, p)).catch(() => gridMap.set(summitResult.gridUrl, null))
      : Promise.resolve(),
  ]);
  data.summit.periods = summitResult.hourlyUrl ? hourlyMap.get(summitResult.hourlyUrl) : null;
  data.summit.grid = summitResult.gridUrl ? gridMap.get(summitResult.gridUrl) : null;
  data.loadTime = new Date();
  onProgress(data, `Summit loaded. Loading ${DISTANCE_BANDS[0].label} samples...`);

  for (let bandIdx = 0; bandIdx < DISTANCE_BANDS.length; bandIdx++) {
    const band = DISTANCE_BANDS[bandIdx];
    const bandPoints = samplePoints.filter(point => point.bandIdx === bandIdx);
    onStatus(`Fetching ${band.label} samples...`);

    const pointResults = await mapWithConcurrency(bandPoints, MAX_NWS_CONCURRENT_REQUESTS, point =>
      fetchPointUrls(point.coords.lat, point.coords.lon, 2)
        .then(urls => ({ ...point, ...urls }))
        .catch(() => ({ ...point, hourlyUrl: null, gridUrl: null }))
    );

    const hourlyUrls = [...new Set(pointResults.map(r => r.hourlyUrl).filter(Boolean))].filter(url => !hourlyMap.has(url));
    const gridUrls = [...new Set(pointResults.map(r => r.gridUrl).filter(Boolean))].filter(url => !gridMap.has(url));

    await Promise.all([
      mapWithConcurrency(hourlyUrls, MAX_NWS_CONCURRENT_REQUESTS, url =>
        fetchPeriods(url)
          .then(p => hourlyMap.set(url, p))
          .catch(() => hourlyMap.set(url, null))
      ),
      mapWithConcurrency(gridUrls, MAX_NWS_CONCURRENT_REQUESTS, url =>
        fetchGridProperties(url)
          .then(p => gridMap.set(url, p))
          .catch(() => gridMap.set(url, null))
      ),
    ]);

    pointResults.forEach(point => {
      const target = data.directions[point.dirIdx]?.bands[point.bandIdx];
      if (!target) return;
      target.periods = point.hourlyUrl ? hourlyMap.get(point.hourlyUrl) : null;
      target.grid = point.gridUrl ? gridMap.get(point.gridUrl) : null;
    });

    data.loadTime = new Date();
    const nextBand = DISTANCE_BANDS[bandIdx + 1];
    onProgress(data, nextBand ? `${band.label} loaded. Loading ${nextBand.label} samples...` : 'All samples loaded.');
  }

  return data;
}

async function loadData(peak, options = {}) {
  const { syncUrl = true, urlMode = 'push' } = options;
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
  if (syncUrl) syncPeakLocationToUrl(peak, urlMode);

  let hasDrawnPartial = false;
  try {
    const data = await buildRoseDataForPeakProgressive(peak, setStatus, (partialData, message) => {
      if (loadId !== loadSequence) return;
      roseData = partialData;
      buildStartDropdown(partialData);
      setStatus(message || '');
      drawAll();
      if (!hasDrawnPartial) {
        hasDrawnPartial = true;
        setLoading(false);
      }
    });
    if (loadId !== loadSequence) return;

    roseData = data;

    buildStartDropdown(data);
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
function getPeriodAt(periods, hoursFromStart) {
  if (!periods?.length) return null;
  const target = forecastDateForOffset(hoursFromStart);
  return (
    periods.find(p => target >= new Date(p.startTime) && target < new Date(p.endTime)) ??
    periods[Math.min(Math.max(0, Math.floor(hoursFromStart)), periods.length - 1)]
  );
}

function extractValue(period, variable, grid, hoursFromStart) {
  if (variable === 'temp') return cToF(gridValueAt(grid?.temperature?.values, hoursFromStart));
  if (variable === 'sky') return gridValueAt(grid?.skyCover?.values, hoursFromStart);
  if (!period) return null;
  switch (variable) {
    case 'wind':   return parseWind(period.windSpeed);
    case 'gust':   return parseWind(period.windGust);
    case 'temp':   return null;
    case 'precip': return period.probabilityOfPrecipitation?.value ?? 0;
    case 'sky':    return null;
    case 'thunder':return thunderValue(period);
    default:       return 0;
  }
}

function extractWindDirection(period) {
  return parseWindDirection(period?.windDirection);
}

// ════════════════════════════════════════════════════════════
// DRAWING
// ════════════════════════════════════════════════════════════
const ROSE_PX = 300;
const EXPLAINER_ROSE_PX = 220;
const DPR     = Math.min(4, Math.max(2, window.devicePixelRatio || 1));
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
  ctx.imageSmoothingEnabled = false;
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
  ctx.imageSmoothingEnabled = false;
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
  ctx.imageSmoothingEnabled = false;
  ctx.scale(DPR, DPR);
  return { ctx, width, height };
}

function ringBounds(index, R) {
  return {
    inner: index === 0 ? 0 : R * BAND_FRACTIONS[index - 1],
    outer: R * BAND_FRACTIONS[index],
  };
}

function directionSector(dirIdx) {
  const sector = 360 / DIRECTIONS.length;
  const bearing = DIRECTIONS[dirIdx]?.bearing ?? 0;
  return {
    start: (bearing - sector / 2 - 90) * Math.PI / 180,
    end: (bearing + sector / 2 - 90) * Math.PI / 180,
  };
}

function circularBearingDiff(a, b) {
  return Math.abs((((a - b) + 540) % 360) - 180);
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

  DIRECTIONS.forEach(({ bearing }) => {
    const a = (bearing - 90) * Math.PI / 180;
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
  const fontSize = full && DIRECTIONS.length > 8 ? W * 0.026 : W * 0.033;
  ctx.font = `bold ${Math.round(fontSize)}px Arial`;
  ctx.fillStyle = '#858b97';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const labels = full
    ? DIRECTIONS.map(dir => ({ name: dir.name, b: dir.bearing }))
    : [{ name: 'N', b: 0 }, { name: 'E', b: 90 }, { name: 'S', b: 180 }, { name: 'W', b: 270 }];
  const lr = R + W * 0.040;
  labels.forEach(({ name, b }) => {
    const a = (b - 90) * Math.PI / 180;
    const x = Math.round(cx + Math.cos(a) * lr);
    const y = Math.round(cy + Math.sin(a) * lr);
    ctx.strokeStyle = 'rgba(10,12,18,0.85)';
    ctx.lineWidth = Math.max(1, W * 0.004);
    ctx.strokeText(name, x, y);
    ctx.fillText(name, x, y);
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

function traceRoseCellPath(ctx, cx, cy, R, cell) {
  if (!cell) return false;
  const summitRadius = R * SUMMIT_HIT_FRAC / 0.40;
  if (cell.summit) {
    ctx.beginPath();
    ctx.arc(cx, cy, summitRadius, 0, 2 * Math.PI);
    return true;
  }

  const { inner, outer } = ringBounds(cell.bandIdx, R);
  const highlightInner = Math.max(inner, summitRadius);
  const { start: startA, end: endA } = directionSector(cell.dirIdx);
  ctx.beginPath();
  ctx.arc(cx, cy, outer, startA, endA);
  ctx.arc(cx, cy, highlightInner, endA, startA, true);
  ctx.closePath();
  return true;
}

function drawSelectionOutline(ctx, W, cx, cy, R, cell) {
  if (!traceRoseCellPath(ctx, cx, cy, R, cell)) return;

  ctx.save();
  ctx.strokeStyle = '#fbfdff';
  ctx.lineWidth = Math.max(2.5, W * 0.010);
  ctx.shadowColor = 'rgba(0,0,0,0.72)';
  ctx.shadowBlur = Math.max(3, W * 0.012);
  ctx.stroke();
  ctx.restore();
}

function drawWindDirectionArrow(ctx, W, x, y, bearing) {
  const angle = (bearing - 90) * Math.PI / 180;
  const length = Math.max(13, W * 0.052);
  const head = Math.max(4.5, W * 0.017);
  const half = length / 2;
  const x1 = x - Math.cos(angle) * half;
  const y1 = y - Math.sin(angle) * half;
  const x2 = x + Math.cos(angle) * half;
  const y2 = y + Math.sin(angle) * half;
  const left = angle + Math.PI * 0.78;
  const right = angle - Math.PI * 0.78;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(5,8,14,0.92)';
  ctx.lineWidth = Math.max(3.2, W * 0.012);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2 + Math.cos(left) * head, y2 + Math.sin(left) * head);
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 + Math.cos(right) * head, y2 + Math.sin(right) * head);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.96)';
  ctx.lineWidth = Math.max(1.2, W * 0.0046);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2 + Math.cos(left) * head, y2 + Math.sin(left) * head);
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 + Math.cos(right) * head, y2 + Math.sin(right) * head);
  ctx.stroke();
  ctx.restore();
}

function drawWindDirectionArrows(ctx, W, cx, cy, R, dirBandValues) {
  for (let dirIdx = 0; dirIdx < DIRECTIONS.length; dirIdx++) {
    for (let bandIdx = 0; bandIdx < DISTANCE_BANDS.length; bandIdx++) {
      const bandValue = dirBandValues[dirIdx]?.[bandIdx];
      if (!bandValue || bandValue.missing || bandValue.value === null || bandValue.windDirection == null) continue;

      const { inner, outer } = ringBounds(bandIdx, R);
      const midR = (Math.max(inner, R * SUMMIT_HIT_FRAC / 0.40) + outer) / 2;
      const a = (DIRECTIONS[dirIdx].bearing - 90) * Math.PI / 180;
      drawWindDirectionArrow(
        ctx,
        W,
        cx + Math.cos(a) * midR,
        cy + Math.sin(a) * midR,
        bandValue.windDirection
      );
    }
  }
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
  for (let dirIdx = 0; dirIdx < DIRECTIONS.length; dirIdx++) {
    for (let bandIdx = 0; bandIdx < DISTANCE_BANDS.length; bandIdx++) {
      const bandValue = dirBandValues[dirIdx]?.[bandIdx];
      if (!bandValue || bandValue.missing || bandValue.value === null) continue;

      const { inner, outer } = ringBounds(bandIdx, R);
      const { start: startA, end: endA } = directionSector(dirIdx);
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
  if (variable === 'wind') drawWindDirectionArrows(ctx, W, cx, cy, R, dirBandValues);
  const summitValue = options.summitValue;
  const summitColor = summitValue == null ? '#ffffff' : cfg.colorFn(summitValue, useMin, useMax);
  drawSummitDot(ctx, W, cx, cy, summitColor);
  drawDirectionLabels(ctx, W, cx, cy, R, options.fullDirectionLabels);
  drawSelectionOutline(ctx, W, cx, cy, R, options.selectedCell);

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
    const label = relativeTimeLabel(offset);
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
    const label = relativeTimeLabel(offset);
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

function relativeTimeLabel(offset) {
  const relative = Math.round(offset);
  return `+${relative} hrs`;
}

function relativeOffsetForColumn(timeIdx) {
  return RELATIVE_TIME_OFFSETS[timeIdx] ?? 0;
}

function columnTimeLabel(timeIdx, offset) {
  const relative = relativeOffsetForColumn(timeIdx);
  const label = `+${relative} hrs`;
  const t = forecastDateForOffset(offset);
  return `${label} · ${t.toLocaleString(undefined, { weekday: 'short', hour: 'numeric' })}`;
}

function forecastTimeLabel(offset) {
  const t = forecastDateForOffset(offset);
  return t.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function forecastDateLabel(offset) {
  const t = forecastDateForOffset(offset);
  return t.toLocaleString(undefined, { month: 'short', day: 'numeric' });
}

function forecastClockLabel(offset) {
  const t = forecastDateForOffset(offset);
  return t.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function gradientFor(variable, min, max) {
  if (variable === 'temp') return 'linear-gradient(90deg, #91bfdb 0 20%, #c6dca8 20% 40%, #f0d48f 40% 60%, #e9a06f 60% 80%, #df714f 80% 100%)';
  if (variable === 'wind') return 'linear-gradient(90deg, #f8fafc 0 20%, #f7df72 20% 40%, #f29a3f 40% 60%, #e675ad 60% 80%, #7c3ba6 80% 100%)';
  if (variable === 'precip') return 'linear-gradient(90deg, #f7fbef, #d9ef8b, #7fcdbb, #41b6c4, #1d91c0, #225ea8, #0c2c84)';
  if (variable === 'sky') return 'linear-gradient(90deg, #174d86, #4f8fc8, #a7b5c1, #eef2f6)';
  if (variable === 'thunder') return `linear-gradient(90deg, ${THUNDER_COLOR_STOPS[0]} 0%, ${THUNDER_COLOR_STOPS[1]} 50%, ${THUNDER_COLOR_STOPS[2]} 100%)`;
  return 'linear-gradient(90deg, #555, #aaa)';
}

function legendLabels(variable, min, max) {
  const cfg = VAR_CONFIG[variable];
  if (variable === 'temp') {
    const low = Math.round(min);
    const mid = Math.round((min + max) / 2);
    const high = Math.round(max);
    return [`${low}${cfg.unit}`, `${mid}${cfg.unit}`, `${high}${cfg.unit}`];
  }
  if (variable === 'wind') return ['0-9', '10-19', '20-29', '30-39', '40+ mph'];
  if (variable === 'precip') return ['0%', '50%', '100%'];
  if (variable === 'sky') return ['Clear', 'Mixed', 'Overcast'];
  if (variable === 'thunder') return ['0%', '50%', '100%'];
  return [`${min}`, '', `${max}`];
}

function legendNote(variable) {
  if (variable === 'sky') return `Each panel has ${directionSampleCount()} sky-cover boxes; blue is clear sky, white is overcast.`;
  if (variable === 'precip') return 'Deeper blue means higher chance.';
  if (variable === 'thunder') return 'Gray to purple to pink shows increasing thunderstorm probability.';
  if (variable === 'wind') return 'Bins are >= lower mph and < upper mph; purple is 40+.';
  return 'Shared scale across +0, +3, +6, and +12 hours.';
}

function updateLegend(variable, timeIdx, min, max) {
  const el = document.getElementById(`legend-${variable}-${timeIdx}`);
  if (!el) return;
  const labels = legendLabels(variable, min, max);
  const note = variable === 'temp' || variable === 'wind' ? '' : legendNote(variable);
  el.innerHTML = `
    <div class="rose-legend-bar" style="background:${gradientFor(variable, min, max)}"></div>
    <div class="rose-legend-labels">
      ${labels.map(label => `<span>${label}</span>`).join('')}
    </div>
    ${note ? `<div class="rose-legend-note">${note}</div>` : ''}
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
      const point = { value, missing: value === null };
      if (varKey === 'wind') point.windDirection = extractWindDirection(period);
      return point;
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
  const relativeLabel = relativeTimeLabel(offset);
  const t = forecastDateForOffset(offset);
  return `${relativeLabel} · ${t.toLocaleString(undefined, { weekday: 'short', hour: 'numeric' })}`;
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
  let dirIdx = 0;
  let bestDiff = Infinity;
  DIRECTIONS.forEach((dir, i) => {
    const diff = circularBearingDiff(angle, dir.bearing);
    if (diff < bestDiff) {
      bestDiff = diff;
      dirIdx = i;
    }
  });
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
    ? `Summit · ${currentPeak?.name ?? 'Sample'}`
    : `${DIRECTIONS[cell.dirIdx].name} · ${DISTANCE_BANDS[cell.bandIdx].label} from summit`;
  const windDirectionLine = meta.variable === 'wind' && !cell.summit && point.windDirection != null
    ? `<div class="tooltip-meta">Wind direction: ${formatWindDirection(point.windDirection)}</div>`
    : '';
  tooltip.innerHTML = `
    <div class="tooltip-title">${cfg.label}: ${formattedValue(meta.variable, point.value)}</div>
    <div class="tooltip-meta">${locationLine}</div>
    ${windDirectionLine}
    <div class="tooltip-meta">${meta.isStaticSample ? 'Static sample' : (meta.timeLabel || timeLabel(meta.offset))}</div>
  `;
  tooltip.style.display = 'block';
  positionTooltip(event);
}

function hideRoseTooltip() {
  const tooltip = document.getElementById('rose-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

function selectedRoseSummary(meta, cell) {
  if (!validRoseCell(meta, cell)) return null;
  const point = cell.summit ? meta.summit : meta.values[cell.dirIdx]?.[cell.bandIdx];
  const cfg = VAR_CONFIG[meta.variable];
  return {
    label: cfg.label,
    value: formattedValue(meta.variable, point.value),
    direction: cell.summit ? 'Summit' : DIRECTIONS[cell.dirIdx].name,
    distance: cell.summit ? '' : DISTANCE_BANDS[cell.bandIdx].label,
    windDirection: meta.variable === 'wind' && !cell.summit ? formatWindDirection(point.windDirection) : '',
    time: meta.isStaticSample ? 'Static sample' : (meta.timeLabel || timeLabel(meta.offset)),
  };
}

function updateRoseCellReadout(canvas, meta, cell) {
  const roseCell = canvas?.closest?.('.rose-cell');
  if (!roseCell) return;

  document.querySelectorAll('#roses-wrap .rose-readout').forEach(el => {
    if (!roseCell.contains(el)) el.remove();
  });

  if (!isMobileRoseLayout()) {
    roseCell.querySelector('.rose-readout')?.remove();
    return;
  }

  const summary = selectedRoseSummary(meta, cell);
  if (!summary) {
    roseCell.querySelector('.rose-readout')?.remove();
    return;
  }

  let readout = roseCell.querySelector('.rose-readout');
  if (!readout) {
    readout = document.createElement('div');
    readout.className = 'rose-readout';
    roseCell.appendChild(readout);
  }
  const timeParts = summary.time.split(' · ');
  const locationClass = summary.distance ? 'rose-readout-location' : 'rose-readout-location is-summit';
  readout.innerHTML = `
    <div class="rose-readout-label">${summary.label}</div>
    <div class="rose-readout-value">${summary.value}</div>
    <div class="${locationClass}">
      <span>${summary.direction}</span>
      <span>${summary.distance}</span>
    </div>
    ${summary.windDirection ? `<div>Wind direction: ${summary.windDirection}</div>` : ''}
    ${timeParts.map(part => `<div>${part}</div>`).join('')}
  `;
}

function drawRoseCanvasById(canvasId) {
  const meta = roseCanvasMeta.get(canvasId);
  if (!meta) return;
  const selectedCell = roseSelections.get(canvasId) || roseSelections.get(meta.sourceId);

  if (canvasId === 'sample-modal-canvas') {
    const setup = setupResponsiveCanvas(canvasId);
    if (!setup) return;
    drawRose(setup.ctx, setup.width, meta.values, meta.min, meta.max, meta.variable, {
      showDistanceLabels: true,
      fullDirectionLabels: true,
      showScaleNote: false,
      summitValue: meta.summit.value,
      selectedCell,
    });
    return;
  }

  const ctx = setupCanvas(canvasId);
  drawRose(ctx, ROSE_PX, meta.values, meta.min, meta.max, meta.variable, {
    showDistanceLabels: true,
    fullDirectionLabels: false,
    summitValue: meta.summit.value,
    selectedCell,
  });
}

function selectRoseCell(canvas, event) {
  const meta = roseCanvasMeta.get(canvas.id);
  const cell = cellFromPoint(canvas, event.clientX, event.clientY);
  if (!validRoseCell(meta, cell)) return false;

  roseSelections.set(canvas.id, cell);
  if (meta.sourceId) roseSelections.set(meta.sourceId, cell);
  drawRoseCanvasById(canvas.id);
  if (isMobileRoseLayout()) {
    if (canvas.id === 'sample-modal-canvas') {
      showRoseTooltip(canvas, event);
    } else {
      hideRoseTooltip();
      updateRoseCellReadout(canvas, meta, cell);
    }
  } else {
    updateRoseCellReadout(canvas, meta, null);
    showRoseTooltip(canvas, event);
  }
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
    const x = Math.round(cx + Math.cos(a) * labelRadius);
    const y = Math.round(cy + Math.sin(a) * labelRadius);
    ctx.strokeStyle = 'rgba(10,12,18,0.85)';
    ctx.lineWidth = 1;
    ctx.strokeText(name, x, y);
    ctx.fillText(name, x, y);
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
    const x = Math.round(cx + Math.cos(a) * labelRadius);
    const y = Math.round(cy + Math.sin(a) * labelRadius);
    ctx.strokeStyle = 'rgba(10,12,18,0.85)';
    ctx.lineWidth = 1;
    ctx.strokeText(name, x, y);
    ctx.fillText(name, x, y);
  });

  const status = document.getElementById(statusId);
  if (status) {
    status.textContent = `Generic ${directionModeLabel()} sample layout. Location-specific sample points appear after a peak, city, or coordinates are loaded.`;
  }
}

function drawPlaceholderRoseGrid() {
  updatePlaceholderColumnHeaders();
  roseCanvasMeta.clear();
  roseSelections.clear();

  for (const varKey of PANEL_VARS) {
    const metas = TIME_OFFSETS.map((_, timeIdx) => fallbackRoseValues(varKey, timeIdx));
    const rangeValues = varKey === 'temp'
      ? metas.flatMap(meta => [
          meta.summit.value,
          ...meta.values.flatMap(row => row.map(point => point.value)),
        ])
      : [];
    const sharedMin = rangeValues.length ? Math.min(...rangeValues) : null;
    const sharedMax = rangeValues.length ? Math.max(...rangeValues) : null;

    TIME_OFFSETS.forEach((offset, timeIdx) => {
      const meta = metas[timeIdx];
      const min = sharedMin ?? meta.min;
      const max = sharedMax ?? meta.max;
      const roseCtx = setupCanvas(`rose-${varKey}-${timeIdx}`);
      if (!roseCtx) return;
      drawRose(roseCtx, ROSE_PX, meta.values, min, max, varKey, {
        showDistanceLabels: true,
        fullDirectionLabels: false,
        summitValue: meta.summit.value,
      });
      roseCanvasMeta.set(`rose-${varKey}-${timeIdx}`, {
        variable: varKey,
        offset,
        timeIdx,
        timeLabel: columnTimeLabel(timeIdx, offset),
        values: meta.values,
        summit: meta.summit,
        min,
        max,
      });
      updateLegend(varKey, timeIdx, min, max);
    });
  }
}

function drawNoLocationState() {
  roseData = null;
  setForecastStartTime(new Date());
  buildStartDropdown(null);
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
      roseCanvasMeta.set(`rose-${varKey}-${timeIdx}`, {
        variable: varKey,
        offset,
        timeIdx,
        timeLabel: columnTimeLabel(timeIdx, offset),
        values,
        summit,
        min: globalMin,
        max: globalMax,
      });
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
  note.textContent = `Current location loaded: ${peak.name}. The example roses remain fixed teaching samples; the rose grid below reflects this location.`;
}

function fallbackExplainerValues(variable) {
  return fallbackRoseValues(variable, 0);
}

function fallbackWindDirection(variable, variant, dirIdx, bandIdx) {
  if (variable !== 'wind') return null;
  if (variant === 0) {
    const base = 275;
    const shifts = new Map([
      ['2:2', 42],
      ['3:3', 56],
      ['6:1', -34],
    ]);
    return (base + (shifts.get(`${dirIdx}:${bandIdx}`) ?? 0) + 360) % 360;
  }
  return (DIRECTIONS[dirIdx].bearing + 35 + variant * 45 + bandIdx * 28) % 360;
}

function nearestFallbackRow(matrix, bearing) {
  if (!matrix?.length) return [];
  let bestIdx = 0;
  let bestDiff = Infinity;
  DIRECTION_SETS['8'].forEach((dir, idx) => {
    const diff = circularBearingDiff(bearing, dir.bearing);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = idx;
    }
  });
  return matrix[bestIdx] || matrix[0] || [];
}

function matrixForActiveDirections(matrix) {
  if (!matrix?.length || matrix.length === DIRECTIONS.length) return matrix;
  return DIRECTIONS.map(dir => [...nearestFallbackRow(matrix, dir.bearing)]);
}

function fallbackRoseValues(variable, variant = 0) {
  const matrices = {
    temp: [
      [[34, 38, 48, 58], [33, 39, 50, 62], [35, 41, 53, 66], [36, 43, 56, 68], [34, 40, 52, 64], [33, 38, 49, 60], [35, 42, 54, 65], [34, 39, 51, 61]],
      [[18, 24, 33, 43], [12, 21, 30, 39], [7, 17, 29, 41], [4, 13, 22, 34], [9, 16, 28, 37], [14, 26, 36, 47], [20, 31, 42, 50], [10, 19, 27, 40]],
      [[24, 18, 10, 4], [32, 25, 16, 8], [43, 34, 22, 12], [48, 38, 29, 17], [41, 31, 20, 9], [35, 27, 15, 6], [28, 19, 11, 3], [39, 30, 21, 13]],
      [[5, 11, 19, 28], [8, 14, 24, 36], [12, 22, 34, 44], [17, 29, 39, 49], [21, 32, 42, 51], [15, 25, 35, 45], [9, 18, 31, 41], [4, 13, 23, 33]],
    ],
    wind: [
      [[8, 14, 22, 34], [10, 16, 24, 38], [12, 18, 28, 42], [9, 15, 26, 40], [7, 13, 21, 32], [6, 12, 20, 30], [8, 14, 23, 36], [9, 17, 27, 44]],
      [[12, 22, 34, 45], [6, 16, 27, 38], [9, 19, 29, 43], [14, 24, 36, 49], [4, 11, 21, 33], [18, 30, 40, 50], [7, 17, 28, 37], [10, 20, 31, 42]],
      [[20, 13, 7, 4], [32, 24, 16, 9], [44, 35, 25, 14], [50, 41, 30, 18], [38, 29, 19, 11], [27, 21, 12, 6], [34, 26, 15, 8], [42, 31, 22, 10]],
      [[5, 18, 31, 46], [8, 20, 35, 50], [12, 25, 39, 44], [16, 29, 37, 41], [10, 22, 33, 48], [6, 14, 24, 36], [4, 11, 21, 32], [15, 27, 40, 49]],
    ],
    precip: [
      [[5, 8, 18, 42], [8, 14, 32, 68], [12, 28, 56, 86], [18, 40, 74, 96], [15, 36, 62, 82], [8, 22, 46, 64], [4, 12, 28, 48], [3, 8, 18, 34]],
      [[18, 36, 66, 92], [8, 24, 52, 78], [3, 14, 38, 64], [0, 10, 28, 56], [6, 20, 44, 72], [12, 32, 60, 86], [22, 46, 74, 96], [10, 30, 58, 80]],
      [[78, 58, 30, 12], [92, 70, 44, 18], [98, 82, 55, 24], [84, 62, 36, 14], [72, 48, 26, 8], [64, 38, 18, 4], [88, 66, 42, 16], [96, 74, 50, 22]],
      [[4, 18, 40, 76], [12, 28, 56, 90], [24, 50, 78, 98], [18, 36, 62, 86], [8, 22, 48, 70], [2, 14, 32, 58], [6, 26, 54, 82], [16, 42, 68, 94]],
    ],
    sky: [
      [[8, 16, 36, 68], [14, 28, 58, 86], [22, 48, 78, 96], [36, 66, 92, 100], [30, 58, 82, 94], [18, 42, 70, 88], [10, 24, 52, 76], [6, 18, 40, 64]],
      [[42, 70, 92, 100], [28, 56, 80, 96], [14, 38, 64, 90], [6, 24, 50, 76], [18, 44, 72, 94], [32, 60, 86, 98], [48, 74, 96, 100], [22, 52, 78, 92]],
      [[96, 76, 46, 18], [88, 64, 36, 10], [78, 52, 24, 4], [100, 84, 58, 30], [92, 70, 42, 14], [72, 44, 20, 2], [82, 60, 34, 8], [98, 80, 54, 26]],
      [[4, 26, 56, 88], [10, 38, 68, 96], [22, 50, 78, 100], [34, 62, 90, 98], [18, 44, 72, 94], [8, 28, 52, 82], [2, 20, 48, 74], [14, 40, 66, 92]],
    ],
    thunder: [
      [[0, 2, 8, 20], [2, 6, 18, 44], [4, 16, 42, 78], [8, 28, 68, 94], [6, 22, 50, 82], [2, 10, 28, 52], [0, 4, 14, 30], [0, 2, 8, 18]],
      [[6, 20, 50, 84], [2, 14, 38, 70], [0, 8, 26, 56], [0, 4, 18, 42], [3, 12, 32, 64], [10, 28, 58, 90], [16, 42, 72, 98], [5, 18, 46, 78]],
      [[72, 46, 20, 6], [88, 60, 30, 12], [96, 78, 44, 18], [80, 52, 24, 8], [64, 36, 14, 2], [54, 28, 10, 0], [92, 66, 38, 16], [98, 74, 50, 22]],
      [[0, 12, 36, 72], [5, 22, 52, 88], [14, 44, 76, 98], [8, 30, 62, 90], [2, 18, 42, 70], [0, 8, 24, 54], [4, 26, 56, 84], [10, 38, 68, 96]],
    ],
  };
  const summitValues = {
    temp: [33, 28, 22, 31],
    wind: [18, 26, 20, 30],
    precip: [35, 55, 42, 60],
    sky: [60, 74, 52, 68],
    thunder: [32, 48, 36, 54],
  };
  const selectedBase = matrices[variable]?.[variant % 4] ?? matrices.thunder[variant % 4];
  const selected = matrixForActiveDirections(selectedBase);
  const values = selected.map((row, dirIdx) =>
    row.map((value, bandIdx) => {
      const point = { value, missing: false };
      const windDirection = fallbackWindDirection(variable, variant, dirIdx, bandIdx);
      if (windDirection != null) point.windDirection = windDirection;
      return point;
    })
  );
  const cfg = VAR_CONFIG[variable];
  const flat = selected.flat();
  if (summitValues[variable]?.[variant % 4] != null) flat.push(summitValues[variable][variant % 4]);
  return {
    values,
    min: cfg.fixedMin ?? (flat.length ? Math.min(...flat) : 0),
    max: cfg.fixedMax ?? (flat.length ? Math.max(...flat) : 100),
    summit: { value: summitValues[variable]?.[variant % 4] ?? 45, missing: false },
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

function syncExplainerLegend(canvasId, variable, min, max) {
  const card = document.getElementById(canvasId)?.closest('.explainer-card');
  const bar = card?.querySelector('.legend-bar');
  const labels = card?.querySelector('.legend-labels');
  if (!bar || !labels) return;

  bar.style.background = gradientFor(variable, min, max);
  labels.innerHTML = legendLabels(variable, min, max).map(label => `<span>${label}</span>`).join('');
}

function drawExplainers(data = roseData, peak = currentPeak, isExample = false) {
  samplePreviewMeta.clear();
  const examples = {
    temp: fallbackExplainerValues('temp'),
    wind: fallbackExplainerValues('wind'),
    precip: fallbackExplainerValues('precip'),
    sky: fallbackExplainerValues('sky'),
    thunder: fallbackExplainerValues('thunder'),
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
    syncExplainerLegend(canvasId, variable, meta.min, meta.max);
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
  const selectedCell = roseSelections.get('sample-modal-canvas');
  drawRose(setup.ctx, setup.width, meta.values, meta.min, meta.max, meta.variable, {
    showDistanceLabels: true,
    fullDirectionLabels: true,
    showScaleNote: false,
    summitValue: meta.summitValue,
    selectedCell,
  });
  roseCanvasMeta.set('sample-modal-canvas', {
    variable: meta.variable,
    offset: 0,
    values: meta.values,
    summit: { value: meta.summitValue, missing: meta.summitValue == null },
    min: meta.min,
    max: meta.max,
    isStaticSample: true,
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
  const selectedCell = roseSelections.get(sourceId);
  drawRose(setup.ctx, setup.width, sourceMeta.values, sourceMeta.min, sourceMeta.max, sourceMeta.variable, {
    showDistanceLabels: true,
    fullDirectionLabels: true,
    showScaleNote: false,
    summitValue: sourceMeta.summit.value,
    selectedCell,
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
  title.textContent = `${cfg.label} · ${sourceMeta.timeLabel || timeLabel(sourceMeta.offset)}`;
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
  const canvas = document.getElementById('sample-modal-canvas');
  if (!meta || !modal || !title || !legendWrap || !legend || !labels || !canvas) return;

  modal.dataset.sampleId = canvasId;
  delete modal.dataset.roseSourceId;
  modal.classList.toggle('rose-modal', meta.type === 'rose');
  roseCanvasMeta.delete('sample-modal-canvas');
  roseSelections.delete('sample-modal-canvas');
  canvas.removeAttribute('data-rose-canvas');
  title.textContent = meta.title;
  if (descDiv) {
    descDiv.innerHTML = meta.type === 'rose' ? '' : (meta.description || '');
    descDiv.hidden = meta.type === 'rose' || !meta.description;
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  if (meta.type === 'rose') {
    canvas.dataset.roseCanvas = 'true';
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
  if (variable === 'temp') return min + clamp01(pct) * (max - min);
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

function setForecastStartTime(startTime) {
  const start = startTime instanceof Date && Number.isFinite(startTime.getTime()) ? startTime : new Date();
  forecastStartTimeMs = start.getTime();
}

function getPeakStartFromUrl() {
  const value = new URLSearchParams(window.location.search).get('start');
  if (!value || value === 'now') return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function currentPeakStartParam() {
  return new Date(forecastStartTimeMs).toISOString();
}

function buildStartDropdown(data = roseData) {
  const sel = document.getElementById('startSel');
  if (!sel) return;

  const previousValue = sel.value;
  sel.innerHTML = '';

  const nowOpt = document.createElement('option');
  nowOpt.value = 'now';
  nowOpt.textContent = 'Now';
  sel.appendChild(nowOpt);

  const periods = data?.summit?.periods || [];
  const first = periods[0]?.startTime ? new Date(periods[0].startTime) : new Date();
  const lastPeriod = periods[periods.length - 1];
  const last = lastPeriod?.endTime ? new Date(lastPeriod.endTime) : new Date(Date.now() + 72 * 3_600_000);
  const latestStart = new Date(last.getTime() - Math.max(...RELATIVE_TIME_OFFSETS) * 3_600_000);
  const start = ceilHour(new Date(Math.max(Date.now(), first.getTime())));
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  let lastDateKey = '';
  let dayBand = -1;
  for (let t = start; t <= latestStart; t = new Date(t.getTime() + 3_600_000)) {
    const dateKey = `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;
    if (dateKey !== lastDateKey) {
      dayBand++;
      lastDateKey = dateKey;
    }
    const hr = t.getHours();
    const hr12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    const ampm = hr < 12 ? 'am' : 'pm';
    const opt = document.createElement('option');
    opt.value = String(t.getTime());
    opt.className = `start-option-day-${dayBand % 2}`;
    opt.textContent = `${DAYS[t.getDay()]} ${MONS[t.getMonth()]} ${t.getDate()}  ${hr12}:00${ampm}`;
    sel.appendChild(opt);
  }

  const startValue = String(forecastStartTimeMs);
  if ([...sel.options].some(opt => opt.value === previousValue)) sel.value = previousValue;
  else if ([...sel.options].some(opt => opt.value === startValue)) sel.value = startValue;
  else sel.value = 'now';
}

function applyStart() {
  const sel = document.getElementById('startSel');
  if (!sel) return;
  const value = sel.value;
  setForecastStartTime(value === 'now' ? new Date() : new Date(Number(value)));
  roseSelections.clear();
  if (roseData) drawAll();
  else drawNoLocationState();
  if (currentPeak) syncPeakLocationToUrl(currentPeak);
}

function updateDirectionModeText() {
  const description = document.getElementById('sample-map-description');
  if (description) {
    description.textContent = `Each dot is one forecast sample coordinate used by the panels: ${directionCount()} directions at 1, 5, 10, and 20 miles from the summit.`;
  }
  const footer = document.getElementById('footer-direction-summary');
  if (footer) {
    footer.textContent = `Points sampled 1, 5, 10, and 20 miles from summit in ${directionCount()} directions`;
  }
}

function onDirectionModeChange() {
  const select = document.getElementById('direction-mode-sel');
  const nextMode = select?.value === '16' ? '16' : '8';
  if (nextMode === directionMode) return;

  directionMode = nextMode;
  DIRECTIONS = DIRECTION_SETS[directionMode];
  loadSequence++;
  roseSelections.clear();
  setLoading(false);
  updateDirectionModeText();

  if (currentPeak) {
    setStatus(`Switching to ${directionModeLabel()}...`);
    loadData(currentPeak, { urlMode: 'replace' });
    return;
  }

  drawNoLocationState();
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
  clearPeakUrl();
  drawNoLocationState();
}

function onPeakChange() {
  const value = document.getElementById('peak-sel').value;
  if (value === '') {
    currentPeak = null;
    document.getElementById('coords').value = '';
    document.getElementById('city').value = '';
    updatePeakInfo();
    clearPeakUrl();
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
  const coords = window.SharedLocation?.parseCoordinateText(document.getElementById('coords').value);
  if (!coords) { setStatus('Invalid coordinates'); return; }
  const { lat, lon } = coords;
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

function getPeakLocationFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('lat') && !params.has('lon')) return null;
  const lat = Number(params.get('lat'));
  const lon = Number(params.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return {
    name: params.get('location') || 'Shared location',
    state: '',
    elev: Number(params.get('elev')) || 0,
    lat,
    lon,
    tier: Number(params.get('tier')) || 0,
  };
}

function applyPeakLocationToInputs(peak) {
  currentPeak = peak;
  document.getElementById('peak-sel').value = '';
  document.getElementById('city').value = peak.name || '';
  document.getElementById('coords').value = `${Number(peak.lat).toFixed(4)}, ${Number(peak.lon).toFixed(4)}`;
  updatePeakInfo();
}

function syncPeakLocationToUrl(peak, mode = 'push') {
  if (!peak || !Number.isFinite(peak.lat) || !Number.isFinite(peak.lon)) return;
  const url = new URL(window.location.href);
  url.searchParams.set('lat', Number(peak.lat).toFixed(6));
  url.searchParams.set('lon', Number(peak.lon).toFixed(6));
  const label = String(peak.name || document.getElementById('city').value || '').trim();
  if (label) url.searchParams.set('location', label);
  else url.searchParams.delete('location');
  if (peak.elev) url.searchParams.set('elev', String(peak.elev));
  else url.searchParams.delete('elev');
  if (peak.tier) url.searchParams.set('tier', String(peak.tier));
  else url.searchParams.delete('tier');
  url.searchParams.set('start', currentPeakStartParam());
  if (url.href === window.location.href) return;
  history[mode === 'replace' ? 'replaceState' : 'pushState']({ peakLocation: peak }, '', url);
}

function clearPeakUrl(mode = 'push') {
  const url = new URL(window.location.href);
  for (const key of ['lat', 'lon', 'location', 'elev', 'tier', 'start']) url.searchParams.delete(key);
  if (url.href === window.location.href) return;
  history[mode === 'replace' ? 'replaceState' : 'pushState']({ peakLocation: null }, '', url);
}

function applySharedPeakLocation() {
  const shared = window.SharedLocation?.readLocation();
  if (!window.SharedLocation?.isEnabled() || !shared) return false;
  applyPeakLocationToInputs({
    name: shared.label || 'Shared Location',
    state: 'CO',
    elev: shared.elev || 0,
    lat: Number(shared.lat),
    lon: Number(shared.lon),
    tier: shared.tier || 0,
  });
  loadData(currentPeak, { urlMode: 'replace' });
  return true;
}

function applyUrlPeakLocation() {
  const peak = getPeakLocationFromUrl();
  if (!peak) return false;
  applyPeakLocationToInputs(peak);
  loadData(currentPeak, { syncUrl: false });
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
    const data = await SharedLocation.fetchJson(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en`,
      {
        ttlMs: LOCATION_LOOKUP_TTL_MS,
        fetchOptions: { headers: { 'User-Agent': 'NWS-Weather-Dashboard/1.0' } },
      }
    );
    const us = data.features
      .filter(f => f.properties.countrycode === 'US' && f.properties.name)
      .slice(0, 5);
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
    const choose = e => {
      e.preventDefault();
      peakSelectSuggestion(r.geometry.coordinates[1], r.geometry.coordinates[0], label);
    };
    el.onmousedown = choose;
    el.ontouchstart = choose;
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

async function usePeakBrowserLocation() {
  closePeakSuggestions();
  const button = document.getElementById('use-location');
  if (button) {
    button.disabled = true;
    button.classList.add('is-locating');
    button.setAttribute('aria-label', 'Locating...');
  }
  setStatus('Requesting location permission...');
  try {
    const location = await window.SharedLocation.getBrowserLocation();
    document.getElementById('city').value = location.label;
    document.getElementById('coords').value = `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`;
    document.getElementById('peak-sel').value = '';
    currentPeak = {
      name: location.label,
      state: '',
      elev: 0,
      lat: location.lat,
      lon: location.lon,
      tier: 0,
    };
    updatePeakInfo();
    loadData(currentPeak);
  } catch (error) {
    setStatus(error.message || 'Could not use your location.');
  } finally {
    if (button) {
      button.disabled = false;
      button.classList.remove('is-locating');
      button.setAttribute('aria-label', 'Get my location');
    }
  }
}

function closePeakSuggestions() {
  _activeIdx = -1;
  _suggestions = [];
  const box = document.getElementById('city-suggestions');
  if (box) box.style.display = 'none';
}

// ════════════════════════════════════════════════════════════
// MOBILE SECTION NAV
// ════════════════════════════════════════════════════════════
function setupSummitMobileNav() {
  const nav = document.getElementById('summit-mobile-nav');
  if (!nav) return;

  if (!summitMobileNavReady) {
    nav.innerHTML = '';
    for (const item of SUMMIT_MOBILE_NAV_ITEMS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = item.label;
      btn.dataset.target = item.id;
      btn.setAttribute('aria-label', `Jump to ${item.label === 'Loc' ? 'location entry' : item.label}`);
      btn.addEventListener('click', () => scrollToSummitMobileSection(item.id));
      nav.appendChild(btn);
    }
    window.addEventListener('scroll', queueSummitMobileNavUpdate, { passive: true });
    summitMobileNavReady = true;
  }

  updateSummitMobileNavTargets();
  updateSummitMobileNav();
}

function updateSummitMobileNavTargets() {
  const scrollY = window.scrollY || window.pageYOffset;
  summitMobileNavTargets = SUMMIT_MOBILE_NAV_ITEMS
    .map(item => {
      const el = document.querySelector(item.target);
      if (!el) return null;
      return {
        id: item.id,
        top: el.getBoundingClientRect().top + scrollY,
      };
    })
    .filter(Boolean);
}

function scrollToSummitMobileSection(id) {
  updateSummitMobileNavTargets();
  const target = summitMobileNavTargets.find(t => t.id === id);
  if (!target) return;
  const nav = document.getElementById('summit-mobile-nav');
  const navH = nav?.offsetHeight || 0;
  window.scrollTo({ top: Math.max(0, target.top - navH - 6), behavior: 'auto' });
}

function queueSummitMobileNavUpdate() {
  if (summitMobileNavRaf) return;
  summitMobileNavRaf = requestAnimationFrame(() => {
    summitMobileNavRaf = null;
    updateSummitMobileNav();
  });
}

function updateSummitMobileNav() {
  const nav = document.getElementById('summit-mobile-nav');
  if (!nav || !summitMobileNavTargets.length) return;

  const scrollY = window.scrollY || window.pageYOffset;

  const probe = scrollY + (nav.offsetHeight || 0) + 12;
  let active = summitMobileNavTargets[0].id;
  for (const target of summitMobileNavTargets) {
    if (probe >= target.top) active = target.id;
    else break;
  }

  nav.querySelectorAll('button').forEach(btn => {
    const isActive = btn.dataset.target === active;
    btn.classList.toggle('is-active', isActive);
    if (isActive) btn.setAttribute('aria-current', 'true');
    else btn.removeAttribute('aria-current');
  });
}

function updateRoseHeaderStickyOffset() {
  const controls = document.getElementById('summit-sticky-controls');
  const offset = controls?.offsetHeight || 0;
  document.documentElement.style.setProperty('--summit-sticky-offset', `${offset}px`);
}

function setupRoseHeaderStickyOffset() {
  updateRoseHeaderStickyOffset();
  if (window.ResizeObserver) {
    const controls = document.getElementById('summit-sticky-controls');
    if (controls) new ResizeObserver(updateRoseHeaderStickyOffset).observe(controls);
  }
}

// ════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tier-sel').value = '14';
  directionMode = '8';
  DIRECTIONS = DIRECTION_SETS[directionMode];
  const directionSelect = document.getElementById('direction-mode-sel');
  if (directionSelect) directionSelect.value = directionMode;
  setForecastStartTime(getPeakStartFromUrl() || new Date());
  buildStartDropdown(null);
  updateDirectionModeText();
  buildPeakSelector();
  document.getElementById('peak-sel').value = '';
  document.getElementById('coords').value = '';
  updatePeakInfo();
  window.SharedLocation?.initCheckbox({ getLocation: getCurrentPeakLocation });
  window.addEventListener('popstate', () => {
    setForecastStartTime(getPeakStartFromUrl() || new Date());
    const peak = getPeakLocationFromUrl();
    if (peak) {
      applyPeakLocationToInputs(peak);
      loadData(currentPeak, { syncUrl: false });
    } else {
      currentPeak = null;
      document.getElementById('peak-sel').value = '';
      document.getElementById('coords').value = '';
      document.getElementById('city').value = '';
      updatePeakInfo();
      drawNoLocationState();
    }
  });

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
      if (isMobileRoseLayout()) {
        hideRoseTooltip();
        return;
      }
      const meta = roseCanvasMeta.get(event.target.id);
      const cell = cellFromPoint(event.target, event.clientX, event.clientY);
      event.target.style.cursor = validRoseCell(meta, cell) ? 'crosshair' : 'pointer';
      showRoseTooltip(event.target, event);
    } else {
      hideRoseTooltip();
    }
  });
  let mobileRosePointer = null;
  document.addEventListener('pointerdown', event => {
    if (!event.target?.matches?.('canvas[data-rose-canvas="true"]')) return;
    if (event.target.closest?.('.rose-cell') && isMobileRoseLayout()) {
      hideRoseTooltip();
      mobileRosePointer = {
        id: event.pointerId,
        canvas: event.target,
        x: event.clientX,
        y: event.clientY,
      };
      return;
    }
    if (selectRoseCell(event.target, event)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
  document.addEventListener('pointerup', event => {
    const started = mobileRosePointer;
    mobileRosePointer = null;
    if (!started || started.id !== event.pointerId) return;
    if (!isMobileRoseLayout()) return;

    const moved = Math.hypot(event.clientX - started.x, event.clientY - started.y);
    const canvas = started.canvas;
    if (moved > 10 || !canvas?.matches?.('canvas[data-rose-canvas="true"]')) return;

    if (selectRoseCell(canvas, event)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
  document.addEventListener('pointercancel', event => {
    if (mobileRosePointer?.id === event.pointerId) mobileRosePointer = null;
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
    updateRoseHeaderStickyOffset();
    if (roseData) drawSampleMap('sample-map', 'sample-map-status', roseData, currentPeak, false);
    else drawGenericSampleMap('sample-map', 'sample-map-status');
    updateSummitMobileNavTargets();
    updateSummitMobileNav();
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
  if (!applyUrlPeakLocation()) applySharedPeakLocation();
  setupSummitMobileNav();
  setupRoseHeaderStickyOffset();
});
