// ════════════════════════════════════════════════════════════
// LAYOUT  — tweak these to resize/rescale everything
// ════════════════════════════════════════════════════════════
const SCALE   = 1.15;
const HW_BASE = 14;
const HW      = HW_BASE * SCALE;
const LEFT    = Math.round(58 * SCALE);
const RIGHT   = Math.round(10 * SCALE);
const HOURS   = 60;
const BUFFER  = 1;

const DATE_H  = Math.round(20 * SCALE);
const TIME_H  = Math.round(22 * SCALE);
const LABEL_H = Math.round(25 * SCALE);

// ════════════════════════════════════════════════════════════
// THEME
// ════════════════════════════════════════════════════════════
const C = {
  bg:        '#2b2b2b',
  axisBg:    '#1a1a1a',
  dateBg:    '#161616',
  timeBg:    '#1c1c1c',
  day:       '#333333',
  night:     '#1a1e2a',
  grid1h:    'rgba(255,255,255,0.06)',
  grid6h:    'rgba(255,255,255,0.20)',
  gridH:     'rgba(255,255,255,0.10)',
  sep:       '#444',
  dateTxt:   '#7ab3e0',
  timeTxt:   '#666',
  axisTxt:   '#888',
  labelTxt:  '#bbb',
  midnight:  '#5a8ab0',
  nowLine:   '#ffcc44',
};

// ════════════════════════════════════════════════════════════
// PANEL DEFINITIONS
// ════════════════════════════════════════════════════════════
const PANELS = [
  { id:'temp', label:'Temperature / Wind Chill / Dewpoint (°F)', h: Math.round(115*SCALE), type:'multi',
    lines:[
      {key:'temp',      color:'#e03030', label:'Temp'},
      {key:'windChill', color:'#4488ee', label:'Wind Chill'},
      {key:'dewpoint',  color:'#33bb55', label:'Dewpoint'},
    ],
    tooltipKeys:['temp','windChill','dewpoint'],
  },

  { id:'sky', label:'Sky Cover / Rel. Humidity / Precipitation Potential (%)', h: Math.round(90*SCALE), type:'multi', fixedRange:[0,100],
    lines:[
      {key:'skyCover', color:'#6aaddd', label:'Sky Cover'},
      {key:'rh',       color:'#44bb55', label:'Humidity'},
      {key:'pop',      color:'#cc7722', label:'Precip %'},
    ],
    tooltipKeys:['skyCover','rh','pop'],
  },

  { id:'wind', label:'Wind Speed / Gust (mph)', h: Math.round(85*SCALE), type:'wind',
    tooltipKeys:['windSpeed','windGust','windDir'],
  },

  { id:'rain', label:'Rain (%)', h: Math.round(85*SCALE), type:'precip',
    precipKey:'qpf', popKey:'pop', barColor:'#44bb66', labelColor:'#44bb66',
    tooltipKeys:['pop','qpf'],
  },

  { id:'thunder', label:'Thunderstorm (%)', h: Math.round(85*SCALE), type:'precip',
    precipKey:null, popKey:'thunder', barColor:'#cc4444', labelColor:'#cc4444',
    tooltipKeys:['thunder'],
  },

  { id:'snow', label:'Snow (%)', h: Math.round(85*SCALE), type:'precip',
    precipKey:'snowfall', popKey:'snowPop', barColor:'#5599dd', labelColor:'#5599dd',
    tooltipKeys:['snowPop','snowfall'],
  },

  { id:'uv', label:'UV Index', h: Math.round(90*SCALE), type:'uv',
    tooltipKeys:['uvIndex'],
  },
];

const MOBILE_SECTION_NAV = [
  { id:'location', label:'Loc' },
  ...PANELS.map(p => ({ id:p.id, label:({ temp:'Temp', sky:'Sky', wind:'Wind', rain:'Rain', thunder:'Storm', snow:'Snow', uv:'UV' })[p.id] || p.id })),
];

// ════════════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════════════
let ALL_DATA  = [];
let D         = [];
let startIdx  = 0;
let canvas, ctx, dpr, axisCanvas, axisCtx, chartStage;
let mobileNavReady = false;
let mobileSectionTargets = [];
let mobileNavRaf = null;

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
const parseDur = s => { const m=s.match(/P(?:(\d+)D)?T(?:(\d+)H)?/); return(+(m?.[1]||0))*24+(+(m?.[2]||0)); };

function expand(vals, n) {
  const out=[];
  for (const v of (vals||[])) {
    const [ts,dur]=v.validTime.split('/');
    const t0=new Date(ts), hrs=parseDur(dur);
    for (let h=0;h<hrs;h++) out.push({time:new Date(t0.getTime()+h*3.6e6), value:v.value});
  }
  return out.slice(0,n);
}

// Like expand() but divides value by interval length — use for accumulated quantities
// (QPF, snowfall) so that summing N hours gives the correct N-hour total.
function expandRate(vals, n) {
  const out=[];
  for (const v of (vals||[])) {
    const [ts,dur]=v.validTime.split('/');
    const t0=new Date(ts), hrs=parseDur(dur);
    const rate=v.value/Math.max(hrs,1);
    for (let h=0;h<hrs;h++) out.push({time:new Date(t0.getTime()+h*3.6e6), value:rate});
  }
  return out.slice(0,n);
}

// Converts NWS weather coverage descriptor to a probability percentage
const COVERAGE_PCT = {slight_chance:20, isolated:20, chance:40, scattered:40, likely:70, occasional:70, frequent:80, definite:90};

// Expands NWS `weather` property into per-hour thunderstorm probabilities.
// Each value is an array of condition objects; we pick the max thunder coverage.
function expandThunder(vals, n) {
  const out = [];
  for (const v of (vals||[])) {
    const [ts, dur] = v.validTime.split('/');
    const t0 = new Date(ts), hrs = parseDur(dur);
    const conditions = Array.isArray(v.value) ? v.value : [];
    const pct = conditions
      .filter(c => c.weather && c.weather.toLowerCase().includes('thunderstorm'))
      .reduce((mx, c) => Math.max(mx, COVERAGE_PCT[c.coverage] ?? 0), 0);
    for (let h = 0; h < hrs; h++) out.push({time: new Date(t0.getTime()+h*3.6e6), value: pct||null});
  }
  return out.slice(0, n);
}

const cToF   = c => c==null?null:Math.round(c*9/5+32);
const kToMph = v => v==null?null:Math.round(v/1.60934);
const mmToIn = v => v==null?null:+(v/25.4).toFixed(2);
const coordForRequest = v => Number(v).toFixed(3);
const card   = d => ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round((d??0)/22.5)%16];
const LOCATION_LOOKUP_TTL_MS = 12 * 60 * 60 * 1000;
const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;

function niceStep(mn,mx,ticks){ const r=(mx-mn||1)/ticks,m=Math.pow(10,Math.floor(Math.log10(r))); for(const c of[1,2,5,10])if(c*m>=r)return c*m; return 10; }

function popLabel(p){ if(p==null)return null; if(p>=70)return'Ocnl'; if(p>=55)return'Lkly'; if(p>=40)return'Chc'; if(p>=20)return'SChc'; return null; }

function floor3h(d){ const h=d.getHours(); return new Date(d.getFullYear(),d.getMonth(),d.getDate(),Math.floor(h/3)*3,0,0,0); }

// ════════════════════════════════════════════════════════════
// CITY AUTOCOMPLETE
// ════════════════════════════════════════════════════════════
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

let _suggestTimer = null;
let _suggestions  = [];
let _activeIdx    = -1;

function cityLabel(r) {
  const p = r.properties;
  const name = /^\d{5}/.test(p.name) ? (p.city || p.town || p.name) : p.name;
  const st = STATE_ABBR[p.state] || '';
  return st ? `${name}, ${st}` : name;
}

function debounceSuggest() {
  clearTimeout(_suggestTimer);
  _suggestTimer = setTimeout(fetchSuggestions, 320);
}

async function fetchSuggestions() {
  const q = document.getElementById('city').value.trim();
  if (q.length < 2) { closeSuggestions(); return; }
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
    renderSuggestions(us);
  } catch(e) { closeSuggestions(); }
}

function setActiveItem(idx) {
  _activeIdx = idx;
  document.querySelectorAll('.sug-item').forEach((el, i) => { el.style.background = i === idx ? '#1e4a7a' : ''; });
}

function renderSuggestions(results) {
  _activeIdx = -1;
  _suggestions = results;
  const box = document.getElementById('city-suggestions');
  if (!results.length) { closeSuggestions(); return; }
  box.innerHTML = '';
  for (const r of results) {
    const label = cityLabel(r);
    const el = document.createElement('div');
    el.className = 'sug-item';
    el.textContent = label;
    el.style.cursor = 'pointer';
    el.addEventListener('mouseover', () => { _activeIdx = -1; el.style.background = '#1e4a7a'; });
    el.addEventListener('mouseout',  () => { el.style.background = ''; });
    const choose = e => { e.preventDefault(); selectSuggestion(r.geometry.coordinates[1], r.geometry.coordinates[0], label); };
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

function selectSuggestion(lat, lon, label) {
  document.getElementById('city').value = label;
  document.getElementById('coords').value = `${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(6)}`;
  closeSuggestions();
  loadForecast();
}

function closeSuggestions() {
  _activeIdx = -1;
  _suggestions = [];
  const box = document.getElementById('city-suggestions');
  box.style.display = 'none';
}

document.addEventListener('click', e => {
  if (e.target !== document.getElementById('city')) closeSuggestions();
});

document.getElementById('city').addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeSuggestions(); return; }
  const box = document.getElementById('city-suggestions');
  const open = box.style.display !== 'none' && _suggestions.length;
  if (e.key === 'ArrowDown') {
    if (!open) return;
    e.preventDefault();
    setActiveItem(Math.min(_activeIdx + 1, _suggestions.length - 1));
    return;
  }
  if (e.key === 'ArrowUp') {
    if (!open) return;
    e.preventDefault();
    setActiveItem(Math.max(_activeIdx - 1, -1));
    return;
  }
  if (e.key === 'Enter') {
    if (open) {
      const idx = _activeIdx >= 0 ? _activeIdx : 0;
      const r = _suggestions[idx];
      selectSuggestion(r.geometry.coordinates[1], r.geometry.coordinates[0], cityLabel(r));
    } else {
      lookupCity();
    }
  }
});

async function lookupCity() {
  const q = document.getElementById('city').value.trim();
  if (!q) return;
  closeSuggestions();
  setStatus('Looking up city…');
  try {
    const data = await SharedLocation.fetchJson(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10&lang=en`,
      {
        ttlMs: LOCATION_LOOKUP_TTL_MS,
        fetchOptions: { headers: { 'User-Agent': 'NWS-Weather-Dashboard/1.0' } },
      }
    );
    const r = data.features.find(f => f.properties.countrycode === 'US' && f.properties.name);
    if (!r) { setStatus('City not found'); return; }
    const label = cityLabel(r);
    document.getElementById('city').value = label;
    document.getElementById('coords').value = `${parseFloat(r.geometry.coordinates[1]).toFixed(6)}, ${parseFloat(r.geometry.coordinates[0]).toFixed(6)}`;
    loadForecast();
  } catch(e) {
    setStatus('City lookup failed');
  }
}

async function useDashboardBrowserLocation() {
  closeSuggestions();
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
    document.getElementById('coords').value = `${location.lat.toFixed(6)}, ${location.lon.toFixed(6)}`;
    loadForecast();
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

function parseDashboardCoords() {
  return window.SharedLocation?.parseCoordinateText(document.getElementById('coords').value) || null;
}

function getCurrentDashboardLocation() {
  const coords = parseDashboardCoords();
  if (!coords) return null;
  const label = document.getElementById('city').value.trim()
    || document.getElementById('loc').textContent.trim()
    || 'Shared location';
  return { ...coords, label, source: 'dashboard' };
}

function getDashboardLocationFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('lat') && !params.has('lon')) return null;
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

function applyDashboardLocationToInputs(loc) {
  document.getElementById('coords').value = `${Number(loc.lat).toFixed(6)}, ${Number(loc.lon).toFixed(6)}`;
  document.getElementById('city').value = loc.label || '';
}

function syncDashboardLocationToUrl(loc, mode = 'push') {
  if (!loc || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lon)) return;
  const url = new URL(window.location.href);
  url.searchParams.set('lat', Number(loc.lat).toFixed(6));
  url.searchParams.set('lon', Number(loc.lon).toFixed(6));
  const label = String(loc.label || '').trim();
  if (label) url.searchParams.set('location', label);
  else url.searchParams.delete('location');
  if (url.href === window.location.href) return;
  history[mode === 'replace' ? 'replaceState' : 'pushState']({ dashboardLocation: loc }, '', url);
}

function applySharedDashboardLocation() {
  const shared = window.SharedLocation?.readLocation();
  if (!window.SharedLocation?.isEnabled() || !shared) return false;
  applyDashboardLocationToInputs(shared);
  return true;
}

function applyUrlDashboardLocation() {
  const loc = getDashboardLocationFromUrl();
  if (!loc) return false;
  applyDashboardLocationToInputs(loc);
  return true;
}

// ════════════════════════════════════════════════════════════
// FETCH
// ════════════════════════════════════════════════════════════
async function loadForecast(options = {}) {
  const { syncUrl = true, urlMode = 'push' } = options;
  const coords = parseDashboardCoords();
  const lat = coords?.lat;
  const lon = coords?.lon;
  if(isNaN(lat)||isNaN(lon)){setStatus('Invalid coordinates');return;}

  setStatus('Fetching grid info…');
  try {
    const pointUrl = `https://api.weather.gov/points/${coordForRequest(lat)},${coordForRequest(lon)}`;
    const pt = window.SharedLocation
      ? await SharedLocation.fetchJson(pointUrl, { ttlMs: LOCATION_LOOKUP_TTL_MS })
      : await fetch(pointUrl).then(r=>r.json());
    const {gridId,gridX,gridY,relativeLocation}=pt.properties;
    const city=relativeLocation?.properties?.city||'', state=relativeLocation?.properties?.state||'';
    const label = `${city}${city?', ':''}${state}` || document.getElementById('city').value.trim() || 'Shared location';
    document.getElementById('loc').textContent=`${label}  (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    document.getElementById('grid-ref').textContent=`  ·  ${gridId} ${gridX},${gridY}`;
    if (syncUrl) syncDashboardLocationToUrl({ lat, lon, label }, urlMode);
    window.SharedLocation?.saveLocation({ lat, lon, label, source: 'dashboard' });

    setStatus('Fetching forecast data…');
    const gridUrl = `https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}`;
    const uvUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordForRequest(lat)}&longitude=${coordForRequest(lon)}&hourly=uv_index&timezone=UTC&forecast_days=7`;
    const [gd, uvRes] = await Promise.all([
      window.SharedLocation
        ? SharedLocation.fetchJson(gridUrl, { ttlMs: WEATHER_CACHE_TTL_MS })
        : fetch(gridUrl).then(r=>r.json()),
      (window.SharedLocation
        ? SharedLocation.fetchJson(uvUrl, { ttlMs: WEATHER_CACHE_TTL_MS })
        : fetch(uvUrl).then(r=>r.json())).catch(()=>null),
    ]);
    const p=gd.properties;

    const uvMap=new Map();
    if(uvRes?.hourly?.time && uvRes.hourly.uv_index){
      uvRes.hourly.time.forEach((t,i)=>uvMap.set(t.slice(0,13), uvRes.hourly.uv_index[i]));
    }

    const N=168;
    const tmp=expand(p.temperature?.values,         N).map(x=>({...x,value:cToF(x.value)}));
    const dew=expand(p.dewpoint?.values,            N).map(x=>({...x,value:cToF(x.value)}));
    const wc =expand(p.windChill?.values,           N).map(x=>({...x,value:cToF(x.value)}));
    const rh =expand(p.relativeHumidity?.values,    N);
    const sky=expand(p.skyCover?.values,            N);
    const ws =expand(p.windSpeed?.values,           N).map(x=>({...x,value:kToMph(x.value)}));
    const wd =expand(p.windDirection?.values,       N);
    const wg =expand(p.windGust?.values,            N).map(x=>({...x,value:kToMph(x.value)}));
    const pop=expand(p.probabilityOfPrecipitation?.values,N);
    const thr=p.probabilityOfThunderstorms?.values?.length
      ? expand(p.probabilityOfThunderstorms.values, N)
      : expandThunder(p.weather?.values, N);
    const qpf=expandRate(p.quantitativePrecipitation?.values, N).map(x=>({...x,value:x.value==null?null:x.value/25.4}));
    const snw=expandRate(p.snowfallAmount?.values,      N).map(x=>({...x,value:x.value==null?null:x.value/25.4}));
    const snowPop=expand(p.probabilityOfSnow?.values,N);

    const n=Math.min(tmp.length,N);
    ALL_DATA=Array.from({length:n},(_,i)=>({
      time:      tmp[i]?.time,
      temp:      tmp[i]?.value??null,
      dewpoint:  dew[i]?.value??null,
      windChill: wc[i]?.value??null,
      rh:        rh[i]?.value??null,
      skyCover:  sky[i]?.value??null,
      windSpeed: ws[i]?.value??null,
      windDir:   wd[i]?.value??null,
      windGust:  wg[i]?.value??null,
      pop:       pop[i]?.value??null,
      thunder:   thr[i]?.value??null,
      qpf:       qpf[i]?.value??null,
      snow:      snw[i]?.value??null,
      snowfall:  snw[i]?.value??null,
      snowPop:   snowPop[i]?.value??null,
      uvIndex:   uvMap.get(tmp[i]?.time?.toISOString().slice(0,13))??null,
    }));

    document.getElementById('grid-ref').textContent =
      `  ·  ${gridId} ${gridX},${gridY} · updated ${new Date(p.updateTime || gd.properties.updateTime).toLocaleString()}`;

    buildStartDropdown();

    const now=new Date();
    const target=floor3h(new Date(now.getTime()-6*3.6e6));
    startIdx=findClosestIdx(target);
    setDropdownToIdx(startIdx);

    setStatus('');
    sliceAndDraw();
  } catch(e){setStatus('Error: '+e.message);console.error(e);}
}
const setStatus=m=>document.getElementById('status').textContent=m;

// ════════════════════════════════════════════════════════════
// START DROPDOWN
// ════════════════════════════════════════════════════════════
function buildStartDropdown() {
  const sel=document.getElementById('startSel');
  sel.innerHTML='';
  const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const nowOpt=document.createElement('option');
  nowOpt.value='now'; nowOpt.textContent='Now';
  sel.appendChild(nowOpt);

  const lastStart=Math.max(0, ALL_DATA.length-HOURS);

  for (let i=0;i<lastStart;i++) {
    const t=ALL_DATA[i].time;
    if (t.getHours()%3!==0) continue;
    const hr=t.getHours(), hr12=hr===0?12:hr>12?hr-12:hr;
    const ampm=hr<12?'am':'pm';
    const opt=document.createElement('option');
    opt.value=i;
    opt.textContent=`${DAYS[t.getDay()]} ${MONS[t.getMonth()]} ${t.getDate()}  ${hr12}:00${ampm}`;
    sel.appendChild(opt);
  }
}

function applyStart() {
  const val=document.getElementById('startSel').value;
  if (val==='now') {
    const target=floor3h(new Date(Date.now()-6*3.6e6));
    startIdx=findClosestIdx(target);
    setDropdownToIdx(startIdx);
  } else {
    startIdx=parseInt(val);
  }
  sliceAndDraw();
}

function findClosestIdx(target) {
  let best=0, bestDiff=Infinity;
  for (let i=0;i<ALL_DATA.length;i++){
    const diff=Math.abs(ALL_DATA[i].time-target);
    if(diff<bestDiff){bestDiff=diff;best=i;}
  }
  return best;
}

function setDropdownToIdx(idx) {
  const sel=document.getElementById('startSel');
  for (const opt of sel.options) { if(opt.value==idx){sel.value=idx;return;} }
  sel.value='now';
}

function sliceAndDraw() {
  D=ALL_DATA.slice(startIdx, startIdx+HOURS);
  resetChartScroll();
  if(D.length) draw();
  setTimeout(()=>{ if(resetChartScroll()&&D.length)draw(); },0);
  setTimeout(()=>{ if(resetChartScroll()&&D.length)draw(); },150);
}

function resetChartScroll() {
  const chartWrap=document.getElementById('chart-wrap');
  if(!chartWrap||chartWrap.scrollLeft===0)return false;
  chartWrap.scrollLeft=0;
  return true;
}

// ════════════════════════════════════════════════════════════
// DRAW
// ════════════════════════════════════════════════════════════
function draw() {
  const n=D.length; if(!n)return;
  canvas=document.getElementById('c');
  axisCanvas=document.getElementById('axis-c');
  chartStage=document.getElementById('chart-stage');
  dpr=window.devicePixelRatio||1;

  const W=LEFT+BUFFER*HW+n*HW+RIGHT;
  const H=PANELS.reduce((s,p)=>s+DATE_H+TIME_H+p.h,0);

  if(chartStage){
    chartStage.style.width=W+'px';
    chartStage.style.height=H+'px';
  }

  canvas.width =Math.round(W*dpr);
  canvas.height=Math.round(H*dpr);
  canvas.style.width =W+'px';
  canvas.style.height=H+'px';

  ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);

  ctx.fillStyle=C.bg;
  ctx.fillRect(0,0,W,H);

  for(let i=0;i<n;i++){
    const hr=D[i].time.getHours();
    ctx.fillStyle=(hr>=6&&hr<20)?C.day:C.night;
    ctx.fillRect(LEFT+BUFFER*HW+i*HW,0,HW,H);
  }

  for(let i=0;i<n;i++){
    const hr=D[i].time.getHours();
    const x=LEFT+BUFFER*HW+i*HW+0.5;
    const isMaj=(hr%6===0);
    ctx.strokeStyle=isMaj?C.grid6h:C.grid1h;
    ctx.lineWidth=isMaj?1.1:1;
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();

    if(hr===0){
      ctx.strokeStyle=C.midnight; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,DATE_H+TIME_H);ctx.stroke();
    }
  }

  const now=new Date();
  const nowFrac=(now-D[0].time)/3.6e6;
  if(nowFrac>=0 && nowFrac<=n){
    const nx=LEFT+BUFFER*HW+nowFrac*HW;
    ctx.strokeStyle=C.nowLine; ctx.lineWidth=1.5;
    ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(nx,0);ctx.lineTo(nx,H);ctx.stroke();
    ctx.setLineDash([]);
  }

  let y=0;
  for(const panel of PANELS){
    drawDateStrip(y,n,W);    y+=DATE_H;
    drawTimeStrip(y,n,W);    y+=TIME_H;
    drawPanel(panel,y,n,W);
    ctx.strokeStyle=C.sep;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,y+panel.h-0.5);ctx.lineTo(LEFT+BUFFER*HW+n*HW+RIGHT,y+panel.h-0.5);ctx.stroke();
    y+=panel.h;
  }

  bindHover(n,W);
  drawAxisOverlay(n,H);
  setupMobileSectionNav();
}

// ════════════════════════════════════════════════════════════
// DATE STRIP
// ════════════════════════════════════════════════════════════
function drawDateStrip(y0,n,W){
  const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  ctx.fillStyle=C.dateBg;
  ctx.fillRect(0,y0,W,DATE_H);
  ctx.font=`${Math.round(10.5*SCALE)}px Arial`;
  ctx.fillStyle=C.dateTxt;
  ctx.textAlign='left';ctx.textBaseline='middle';
  let lastDay=-1;
  for(let i=0;i<n;i++){
    const t=D[i].time;
    if((t.getHours()===0||i===0)&&t.getDate()!==lastDay){
      lastDay=t.getDate();
      const x=LEFT+BUFFER*HW+i*HW;
      ctx.strokeStyle=C.midnight;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x+0.5,y0);ctx.lineTo(x+0.5,y0+DATE_H);ctx.stroke();
      ctx.fillText(`${DAYS[t.getDay()]} ${t.getMonth()+1}/${t.getDate()}`,x+3,y0+DATE_H/2);
    }
  }
  ctx.strokeStyle=C.sep;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,y0+DATE_H-0.5);ctx.lineTo(W,y0+DATE_H-0.5);ctx.stroke();
}

// ════════════════════════════════════════════════════════════
// TIME STRIP
// ════════════════════════════════════════════════════════════
function drawTimeStrip(y0,n,W){
  ctx.fillStyle=C.timeBg;
  ctx.fillRect(0,y0,W,TIME_H);
  ctx.font=`${Math.round(9.5*SCALE)}px Arial`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=0;i<n;i++){
    const hr=D[i].time.getHours();
    if(hr%3===0){
      const x=LEFT+BUFFER*HW+i*HW;
      const lbl=hr===0?'12a':hr===12?'12p':hr<12?`${hr}a`:`${hr-12}p`;
      ctx.fillStyle=hr===0?C.dateTxt:C.timeTxt;
      ctx.fillText(lbl,x,y0+TIME_H/2);
      ctx.strokeStyle=hr===0?C.midnight:C.grid6h;
      ctx.lineWidth=hr===0?1.5:1;
      ctx.beginPath();ctx.moveTo(x+0.5,y0+TIME_H-4);ctx.lineTo(x+0.5,y0+TIME_H);ctx.stroke();
    }
  }
  ctx.strokeStyle=C.sep;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,y0+TIME_H-0.5);ctx.lineTo(W,y0+TIME_H-0.5);ctx.stroke();
}

// ════════════════════════════════════════════════════════════
// PANEL ROUTER
// ════════════════════════════════════════════════════════════
function drawPanel(panel,y0,n,W,stickyX=0){
  ctx.fillStyle=C.axisBg;
  ctx.fillRect(stickyX,y0,LEFT,panel.h);

  ctx.font=`bold ${Math.round(10*SCALE)}px Arial`;ctx.textBaseline='middle';

  const dataY=y0+LABEL_H;
  const dataH=panel.h-LABEL_H;

  if     (panel.type==='multi')  drawMulti(panel,dataY,dataH,n,stickyX);
  else if(panel.type==='wind')   drawWind(dataY,dataH,n,stickyX);
  else if(panel.type==='precip') drawPrecip(panel,dataY,dataH,n,stickyX);
  else if(panel.type==='uv')     drawUV(dataY,dataH,n,stickyX);
}

function getPanelLabelItems(panel){
  if(panel.type==='multi')return panel.lines.map(l=>({label:l.label,color:l.color||C.labelTxt}));
  if(panel.type==='wind')return [
    {label:'Speed',color:'#dd44aa'},
    {label:'Gust',color:'#6699ee'},
    {label:'(mph)',color:C.axisTxt},
  ];
  return [{label:panel.label,color:panel.labelColor||C.labelTxt}];
}

function measurePanelLabels(renderCtx,items,labelGap,wordGap){
  let w=0;
  for(let i=0;i<items.length;i++){
    const words=items[i].label.split(' ');
    w+=words.reduce((s,word)=>s+renderCtx.measureText(word).width,0)+wordGap*(words.length-1);
    if(i<items.length-1)w+=labelGap;
  }
  return w;
}

function drawPanelLabels(renderCtx,items,x,yMid,labelGap,wordGap){
  renderCtx.textAlign='left';
  renderCtx.textBaseline='middle';
  let lx=x;
  for(let i=0;i<items.length;i++){
    renderCtx.fillStyle=items[i].color;
    const words=items[i].label.split(' ');
    for(let wi=0;wi<words.length;wi++){
      renderCtx.fillText(words[wi],lx,yMid);
      lx+=renderCtx.measureText(words[wi]).width+(wi<words.length-1?wordGap:0);
    }
    if(i<items.length-1)lx+=labelGap;
  }
}

// ════════════════════════════════════════════════════════════
// MULTI-LINE PANEL
// ════════════════════════════════════════════════════════════
function drawMulti(panel,y0,h,n,stickyX=0){
  const allVals=panel.lines.flatMap(l=>D.map(d=>d[l.key])).filter(v=>v!=null);
  if(!allVals.length)return;
  const axisX=stickyX+LEFT;
  const plotEnd=LEFT+BUFFER*HW+n*HW;
  const mn=panel.fixedRange?panel.fixedRange[0]:Math.min(...allVals);
  const mx=panel.fixedRange?panel.fixedRange[1]:Math.max(...allVals);
  const pad=6, iH=h-pad*2;
  const toY=v=>y0+pad+iH-((v-mn)/(mx-mn||1))*iH;

  const step=panel.fixedRange?25:niceStep(mn,mx,4);
  ctx.font=`${Math.round(9*SCALE)}px Arial`;
  ctx.fillStyle=C.axisTxt;
  ctx.textAlign='right';ctx.textBaseline='middle';
  for(let v=Math.ceil(mn/step)*step;v<=mx+step*0.01;v+=step){
    const y=toY(v);
    if(y<y0||y>y0+h)continue;
    ctx.fillText(v, stickyX+LEFT-Math.round(5*SCALE), y);
    ctx.strokeStyle=C.gridH;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(axisX,y);ctx.lineTo(plotEnd,y);ctx.stroke();
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(axisX,-10000,Math.max(0,plotEnd-axisX),20000);
  ctx.clip();

  for(const [li, line] of panel.lines.entries()){
    const vals=D.map(d=>d[line.key]);
    ctx.strokeStyle=line.color;ctx.lineWidth=1.7;ctx.lineJoin='round';
    if(line.dash)ctx.setLineDash(line.dash);else ctx.setLineDash([]);
    ctx.beginPath();let go=false;
    for(let i=0;i<n;i++){
      const v=vals[i];if(v==null){go=false;continue;}
      const x=LEFT+BUFFER*HW+i*HW+HW/2,y=toY(v);
      go?ctx.lineTo(x,y):(ctx.moveTo(x,y),go=true);
    }
    ctx.stroke();ctx.setLineDash([]);
  }

  // labels after all lines; collision is checked per time column only (same-x overlap is the only real risk)
  ctx.font=`${Math.round(8.5*SCALE)}px Arial`;ctx.textAlign='center';
  const colPlaced=new Map();
  const fh=Math.round(10*SCALE);
  for(const [li,line] of panel.lines.entries()){
    const vals=D.map(d=>d[line.key]);
    const above=li!==1;
    ctx.textBaseline=above?'bottom':'top';ctx.fillStyle=line.color;
    for(let i=0;i<n;i++){
      if(D[i].time.getHours()%3!==0||vals[i]==null)continue;
      const x=LEFT+BUFFER*HW+i*HW+HW/2;
      const ly=toY(vals[i])+(above?-6:6);
      const top=above?ly-fh:ly, bot=above?ly:ly+fh;
      const col=colPlaced.get(i)||[];
      if(col.some(r=>top<r.bot+1&&bot>r.top-1)){col.push({top,bot});colPlaced.set(i,col);continue;}
      ctx.fillText(String(vals[i]),x,ly);
      col.push({top,bot});colPlaced.set(i,col);
    }
  }
  ctx.restore();
}

// ════════════════════════════════════════════════════════════
// WIND PANEL
// ════════════════════════════════════════════════════════════
function drawWind(y0,h,n,stickyX=0){
  const wsV=D.map(d=>d.windSpeed), wgV=D.map(d=>d.windGust);
  const all=[...wsV,...wgV].filter(v=>v!=null);
  if(!all.length)return;
  const axisX=stickyX+LEFT;
  const plotEnd=LEFT+BUFFER*HW+n*HW;

  const arrowH=Math.round(22*SCALE);
  const lineY0=y0+arrowH, lineH=h-arrowH;
  const mx=Math.max(...all);
  const pad=6, iH=lineH-pad*2;
  const toY=v=>lineY0+pad+iH-(v/(mx||1))*iH;

  const step=niceStep(0,mx,3);
  ctx.font=`${Math.round(9*SCALE)}px Arial`;
  ctx.fillStyle=C.axisTxt;ctx.textAlign='right';ctx.textBaseline='middle';
  for(let v=step;v<=mx*1.05;v+=step){
    const y=toY(v);if(y<lineY0)break;
    ctx.fillText(v,stickyX+LEFT-Math.round(5*SCALE),y);
    ctx.strokeStyle=C.gridH;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(axisX,y);ctx.lineTo(plotEnd,y);ctx.stroke();
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(axisX,-10000,Math.max(0,plotEnd-axisX),20000);
  ctx.clip();

  drawLine2(wsV,'#dd44aa',1.7,null,toY,n);
  drawLine2(wgV,'#6699ee',1.4,null,toY,n);

  // speed labels below, gust labels above — they go away from each other so no collision
  ctx.font=`${Math.round(8.5*SCALE)}px Arial`;ctx.textAlign='center';
  ctx.textBaseline='top';ctx.fillStyle='#dd44aa';
  for(let i=0;i<n;i++){
    if(D[i].time.getHours()%3!==0||wsV[i]==null)continue;
    ctx.fillText(String(wsV[i]),LEFT+BUFFER*HW+i*HW+HW/2,toY(wsV[i])+4);
  }
  ctx.textBaseline='bottom';ctx.fillStyle='#6699ee';
  for(let i=0;i<n;i++){
    if(D[i].time.getHours()%3!==0||wgV[i]==null)continue;
    ctx.fillText(String(wgV[i]),LEFT+BUFFER*HW+i*HW+HW/2,toY(wgV[i])-4);
  }

  const cy=y0+arrowH/2;
  const astep=Math.max(1,Math.round(18/HW));
  for(let i=0;i<n;i+=astep){
    const deg=D[i].windDir;if(deg==null)continue;
    drawArrow(LEFT+BUFFER*HW+i*HW+HW/2,cy,deg,Math.round(9*SCALE));
  }
  ctx.restore();
}

function drawLine2(vals,color,width,dash,toY,n){
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';
  if(dash)ctx.setLineDash(dash);else ctx.setLineDash([]);
  ctx.beginPath();let go=false;
  for(let i=0;i<n;i++){
    const v=vals[i];if(v==null){go=false;continue;}
    const x=LEFT+BUFFER*HW+i*HW+HW/2,y=toY(v);
    go?ctx.lineTo(x,y):(ctx.moveTo(x,y),go=true);
  }
  ctx.stroke();ctx.setLineDash([]);
}

function drawArrow(cx,cy,deg,len){
  ctx.save();ctx.translate(cx,cy);ctx.rotate((deg-180)*Math.PI/180);
  ctx.strokeStyle='#aaa';ctx.lineWidth=1.3;
  ctx.beginPath();ctx.moveTo(0,-len);ctx.lineTo(0,len*0.4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,-len);ctx.lineTo(-3,-len+5);ctx.lineTo(3,-len+5);
  ctx.closePath();ctx.fillStyle='#aaa';ctx.fill();ctx.restore();
}

// ════════════════════════════════════════════════════════════
// PRECIP PANEL
// ════════════════════════════════════════════════════════════
function drawPrecip(panel,y0,h,n,stickyX=0){
  const axisX=stickyX+LEFT;
  const plotEnd=LEFT+BUFFER*HW+n*HW;
  const pad=4, iH=h-pad*2;
  const toY=pct=>y0+pad+iH-(pct/100)*iH;
  const barBase=y0+h-1;

  const thresholds=[{v:20,lbl:'SChc'},{v:40,lbl:'Chc'},{v:55,lbl:'Lkly'},{v:70,lbl:'Ocnl'}];
  ctx.font=`${Math.round(8.5*SCALE)}px Arial`;ctx.fillStyle=C.axisTxt;
  ctx.textAlign='right';ctx.textBaseline='middle';
  for(const t of thresholds){
    const y=toY(t.v);
    ctx.fillText(t.lbl,stickyX+LEFT-Math.round(3*SCALE),y);
    ctx.strokeStyle=C.gridH;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(axisX,y);ctx.lineTo(plotEnd,y);ctx.stroke();
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(axisX,-10000,Math.max(0,plotEnd-axisX),20000);
  ctx.clip();

  const popVals=D.map(d=>d[panel.popKey]);
  const bw=HW*0.5, boff=HW*0.25;
  for(let i=0;i<n;i++){
    const pv=popVals[i];
    if(pv==null||pv<20)continue;
    ctx.fillStyle=panel.barColor+'cc';
    ctx.fillRect(LEFT+BUFFER*HW+i*HW+boff,toY(pv),bw,barBase-toY(pv));
  }

  if(panel.precipKey){
    const BAR_H=Math.round(11*SCALE);
    const barY=y0+h-BAR_H;
    const d0hour=(D[0]?.time?.getHours()??0);
    const off=(6-d0hour%6)%6;
    for(let i=off;i<n;i+=6){
      const end=Math.min(i+6,n);
      const total=D.slice(i,end).reduce((s,d)=>s+(d[panel.precipKey]||0),0);
      if(total<0.005)continue;
      const x1=LEFT+BUFFER*HW+i*HW,x2=LEFT+BUFFER*HW+end*HW;
      ctx.fillStyle=panel.barColor+'f2';
      ctx.fillRect(x1,barY,x2-x1,BAR_H);
      ctx.strokeStyle='rgba(0,0,0,0.8)';
      ctx.lineWidth=1;
      ctx.strokeRect(x1+0.5,barY+0.5,x2-x1-1,BAR_H-1);
      ctx.font=`${Math.round(7.5*SCALE)}px Arial`;ctx.fillStyle='#000';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(`${total.toFixed(2)}"`, (x1+x2)/2, y0+h-BAR_H/2);
    }
  }
  ctx.restore();
}

// ════════════════════════════════════════════════════════════
// UV INDEX PANEL
// ════════════════════════════════════════════════════════════
function drawUV(y0,h,n,stickyX=0){
  const vals=D.map(d=>d.uvIndex);
  if(!vals.some(v=>v!=null))return;
  const axisX=stickyX+LEFT;
  const plotEnd=LEFT+BUFFER*HW+n*HW;

  const maxUV=11, pad=Math.round(4*SCALE);
  const bH=h-pad*2;
  const baseY=y0+pad+bH;
  const toY=v=>y0+pad+bH-Math.min(v/maxUV,1)*bH;
  const toX=i=>LEFT+BUFFER*HW+i*HW+HW/2;

  // muted colors matched to the chart's perceptual luminance
  const bands=[
    {v:3,  label:'Moderate', color:'#3aab52'},
    {v:6,  label:'High',     color:'#b89a28'},
    {v:8,  label:'V. High',  color:'#bf7828'},
    {v:maxUV, label:'Extreme', color:'#c84030'},
  ];

  // threshold lines + y-axis category labels
  ctx.font=`${Math.round(8.5*SCALE)}px Arial`;
  ctx.textAlign='right'; ctx.textBaseline='middle';
  for(const b of bands){
    const ty=toY(b.v);
    if(ty<y0||ty>y0+h) continue;
    ctx.strokeStyle=C.gridH; ctx.lineWidth=1; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(axisX,ty); ctx.lineTo(plotEnd,ty); ctx.stroke();
    ctx.fillStyle=b.color;
    ctx.fillText(b.label, stickyX+LEFT-Math.round(4*SCALE), ty);
  }

  // build point list
  const pts=[];
  for(let i=0;i<n;i++){
    const v=vals[i];
    if(v!=null) pts.push({x:toX(i), y:toY(v)});
  }
  if(pts.length<2) return;

  ctx.save();
  ctx.beginPath();
  ctx.rect(axisX,-10000,Math.max(0,plotEnd-axisX),20000);
  ctx.clip();

  // vertical gradient with hard band transitions
  const grad=ctx.createLinearGradient(0, toY(maxUV), 0, baseY);
  grad.addColorStop(0,      'rgba(200,64,48,0.72)');
  grad.addColorStop(3/11,   'rgba(200,64,48,0.72)');
  grad.addColorStop(3/11,   'rgba(191,120,40,0.72)');
  grad.addColorStop(5/11,   'rgba(191,120,40,0.72)');
  grad.addColorStop(5/11,   'rgba(184,154,40,0.72)');
  grad.addColorStop(8/11,   'rgba(184,154,40,0.72)');
  grad.addColorStop(8/11,   'rgba(58,171,82,0.72)');
  grad.addColorStop(1,      'rgba(58,171,82,0.72)');

  // smooth filled area using cubic bezier through midpoints
  ctx.beginPath();
  ctx.moveTo(pts[0].x, baseY);
  ctx.lineTo(pts[0].x, pts[0].y);
  for(let i=1;i<pts.length;i++){
    const p0=pts[i-1], p1=pts[i];
    const mx=(p0.x+p1.x)/2;
    ctx.bezierCurveTo(mx,p0.y, mx,p1.y, p1.x,p1.y);
  }
  ctx.lineTo(pts[pts.length-1].x, baseY);
  ctx.closePath();
  ctx.fillStyle=grad;
  ctx.fill();

  // subtle stroke on top of the fill
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for(let i=1;i<pts.length;i++){
    const p0=pts[i-1], p1=pts[i];
    const mx=(p0.x+p1.x)/2;
    ctx.bezierCurveTo(mx,p0.y, mx,p1.y, p1.x,p1.y);
  }
  ctx.strokeStyle='rgba(255,255,255,0.22)';
  ctx.lineWidth=1.5; ctx.setLineDash([]);
  ctx.stroke();

  // labels where UV crosses a band threshold
  const uvCat=v=>v<=3?'#3aab52':v<=6?'#b89a28':v<=8?'#bf7828':'#c84030';
  ctx.font=`${Math.round(8.5*SCALE)}px Arial`;ctx.textAlign='center';ctx.textBaseline='bottom';
  for(let i=1;i<n;i++){
    const prev=vals[i-1], curr=vals[i];
    if(prev==null||curr==null)continue;
    if(![3,6,8].some(t=>(prev<t&&curr>=t)||(prev>=t&&curr<t)))continue;
    ctx.fillStyle=uvCat(curr);
    ctx.fillText(Math.round(curr), toX(i), toY(curr)-4);
  }
  ctx.restore();
}

function drawAxisOverlay(n,H) {
  if(!axisCanvas)return;

  axisCtx=axisCanvas.getContext('2d');
  const chartW=LEFT+BUFFER*HW+n*HW+RIGHT;
  const labelGap=Math.round(16*SCALE);
  const wordGap=Math.round(4*SCALE);
  const labelPad=Math.round(8*SCALE);
  const labelFont=`bold ${Math.round(10*SCALE)}px Arial`;
  axisCtx.font=labelFont;
  const labelW=Math.max(...PANELS.map(panel=>measurePanelLabels(axisCtx,getPanelLabelItems(panel),labelGap,wordGap)));
  const overlayW=Math.min(chartW,LEFT+labelPad+Math.ceil(labelW)+labelPad);
  axisCanvas.width=Math.round(overlayW*dpr);
  axisCanvas.height=Math.round(H*dpr);
  axisCanvas.style.width=overlayW+'px';
  axisCanvas.style.height=H+'px';

  axisCtx.setTransform(dpr,0,0,dpr,0,0);
  axisCtx.clearRect(0,0,overlayW,H);

  function drawStickyPanelLabel(panel,y0){
    axisCtx.save();
    axisCtx.beginPath();
    axisCtx.rect(LEFT,y0,Math.max(0,overlayW-LEFT),LABEL_H);
    axisCtx.clip();
    axisCtx.font=labelFont;
    drawPanelLabels(axisCtx,getPanelLabelItems(panel),LEFT+labelPad,y0+LABEL_H/2,labelGap,wordGap);
    axisCtx.restore();
  }

  function drawMultiAxis(panel,y0,h){
    const allVals=panel.lines.flatMap(l=>D.map(d=>d[l.key])).filter(v=>v!=null);
    if(!allVals.length)return;
    const mn=panel.fixedRange?panel.fixedRange[0]:Math.min(...allVals);
    const mx=panel.fixedRange?panel.fixedRange[1]:Math.max(...allVals);
    const pad=6, iH=h-pad*2;
    const toY=v=>y0+pad+iH-((v-mn)/(mx-mn||1))*iH;
    const step=panel.fixedRange?25:niceStep(mn,mx,4);
    axisCtx.font=`${Math.round(9*SCALE)}px Arial`;
    axisCtx.fillStyle=C.axisTxt;
    axisCtx.textAlign='right';
    axisCtx.textBaseline='middle';
    for(let v=Math.ceil(mn/step)*step;v<=mx+step*0.01;v+=step){
      const y=toY(v);
      if(y<y0||y>y0+h)continue;
      axisCtx.fillText(v,LEFT-Math.round(5*SCALE),y);
    }
  }

  function drawWindAxis(y0,h){
    const all=[...D.map(d=>d.windSpeed),...D.map(d=>d.windGust)].filter(v=>v!=null);
    if(!all.length)return;
    const arrowH=Math.round(22*SCALE);
    const lineY0=y0+arrowH, lineH=h-arrowH;
    const mx=Math.max(...all);
    const pad=6, iH=lineH-pad*2;
    const toY=v=>lineY0+pad+iH-(v/(mx||1))*iH;
    const step=niceStep(0,mx,3);
    axisCtx.font=`${Math.round(9*SCALE)}px Arial`;
    axisCtx.fillStyle=C.axisTxt;
    axisCtx.textAlign='right';
    axisCtx.textBaseline='middle';
    for(let v=step;v<=mx*1.05;v+=step){
      const y=toY(v);if(y<lineY0)break;
      axisCtx.fillText(v,LEFT-Math.round(5*SCALE),y);
    }
  }

  function drawPrecipAxis(panel,y0,h){
    const pad=4, iH=h-pad*2;
    const toY=pct=>y0+pad+iH-(pct/100)*iH;
    const thresholds=[{v:20,lbl:'SChc'},{v:40,lbl:'Chc'},{v:55,lbl:'Lkly'},{v:70,lbl:'Ocnl'}];
    axisCtx.font=`${Math.round(8.5*SCALE)}px Arial`;
    axisCtx.fillStyle=C.axisTxt;
    axisCtx.textAlign='right';
    axisCtx.textBaseline='middle';
    for(const t of thresholds)axisCtx.fillText(t.lbl,LEFT-Math.round(3*SCALE),toY(t.v));
  }

  function drawUVAxis(y0,h){
    const maxUV=11, pad=Math.round(4*SCALE);
    const bH=h-pad*2;
    const toY=v=>y0+pad+bH-Math.min(v/maxUV,1)*bH;
    const bands=[
      {v:3,  label:'Moderate', color:'#3aab52'},
      {v:6,  label:'High',     color:'#b89a28'},
      {v:8,  label:'V. High',  color:'#bf7828'},
      {v:maxUV, label:'Extreme', color:'#c84030'},
    ];
    axisCtx.font=`${Math.round(8.5*SCALE)}px Arial`;
    axisCtx.textAlign='right';
    axisCtx.textBaseline='middle';
    for(const b of bands){
      const ty=toY(b.v);
      if(ty<y0||ty>y0+h)continue;
      axisCtx.fillStyle=b.color;
      axisCtx.fillText(b.label,LEFT-Math.round(4*SCALE),ty);
    }
  }

  let y=0;
  for(const panel of PANELS){
    y+=DATE_H+TIME_H;
    axisCtx.fillStyle=C.axisBg;
    axisCtx.fillRect(0,y,LEFT,panel.h);
    drawStickyPanelLabel(panel,y);
    const dataY=y+LABEL_H;
    const dataH=panel.h-LABEL_H;
    if(panel.type==='multi')drawMultiAxis(panel,dataY,dataH);
    else if(panel.type==='wind')drawWindAxis(dataY,dataH);
    else if(panel.type==='precip')drawPrecipAxis(panel,dataY,dataH);
    else if(panel.type==='uv')drawUVAxis(dataY,dataH);
    axisCtx.strokeStyle=C.sep;
    axisCtx.lineWidth=1;
    axisCtx.beginPath();
    axisCtx.moveTo(0,y+panel.h-0.5);
    axisCtx.lineTo(overlayW,y+panel.h-0.5);
    axisCtx.stroke();
    y+=panel.h;
  }
}

// ════════════════════════════════════════════════════════════
// TOOLTIP
// ════════════════════════════════════════════════════════════
function bindHover(n,W){
  const tip=document.getElementById('tip');

  const panelRanges=[];
  let cy=0;
  for(const p of PANELS){
    const top=cy; cy+=DATE_H+TIME_H+p.h;
    panelRanges.push({top,bottom:cy,panel:p});
  }

  canvas.onmousemove=e=>{
    const r=canvas.getBoundingClientRect();
    const mx=e.clientX-r.left, my=e.clientY-r.top;
    const stickyEdge=getChartStickyX()+LEFT;
    if(mx<stickyEdge){tip.style.display='none';return;}
    const idx=Math.floor((mx-LEFT-BUFFER*HW)/HW);
    if(idx<0||idx>=n){tip.style.display='none';return;}
    const d=D[idx]; if(!d){tip.style.display='none';return;}

    const pr=panelRanges.find(p=>my>=p.top&&my<p.bottom);
    if(!pr){tip.style.display='none';return;}

    const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const MONS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const hr=d.time.getHours(), hr12=hr===0?12:hr>12?hr-12:hr;
    const tl=`${DAYS[d.time.getDay()]} ${MONS[d.time.getMonth()]} ${d.time.getDate()}, ${hr12}:00 ${hr<12?'AM':'PM'}`;
    const f=v=>v==null?'—':v;

    const keyLines={
      temp:      ()=>`Temp: ${f(d.temp)}°F`,
      windChill: ()=>`Wind Chill: ${d.windChill!=null?d.windChill+'°F':'N/A'}`,
      dewpoint:  ()=>`Dewpoint: ${f(d.dewpoint)}°F`,
      skyCover:  ()=>`Sky Cover: ${f(d.skyCover)}%`,
      rh:        ()=>`Rel Humidity: ${f(d.rh)}%`,
      pop:       ()=>`Precip. Potential: ${f(d.pop)}%  ${popLabel(d.pop)||''}`,
      windSpeed: ()=>`Wind Speed: ${f(d.windSpeed)} mph`,
      windGust:  ()=>`Wind Gust: ${d.windGust!=null?d.windGust+' mph':'N/A'}`,
      windDir:   ()=>d.windDir!=null?`Direction: ${card(d.windDir)} (${d.windDir}°)`:null,
      thunder:   ()=>d.thunder?`Thunder: ${d.thunder}%  ${popLabel(d.thunder)||''}`:null,
      qpf:       ()=>d.qpf?`Rain: ${d.qpf.toFixed(3)}"`:null,
      snow:      ()=>d.snow?`Snow: ${d.snow.toFixed(3)}"`:null,
      snowfall:  ()=>d.snowfall?`Snowfall: ${d.snowfall.toFixed(3)}"`:null,
      snowPop:   ()=>`Snow Precip. Potential: ${f(d.snowPop)}%  ${popLabel(d.snowPop)||''}`,
      uvIndex:   ()=>d.uvIndex!=null?`UV Index: ${Math.round(d.uvIndex)}`:null,
    };

    const lines=[`<b>${tl}</b>`,
      ...pr.panel.tooltipKeys.map(k=>keyLines[k]?.()).filter(Boolean)
    ];
    tip.innerHTML=lines.join('<br>');
    tip.style.display='block';
    tip.style.left=(e.clientX+14)+'px';
    tip.style.top=(e.clientY-10)+'px';
  };
  canvas.onmouseleave=()=>tip.style.display='none';
}

function getChartStickyX() {
  const chartWrap=document.getElementById('chart-wrap');
  return chartWrap?.scrollLeft||0;
}

// ════════════════════════════════════════════════════════════
// MOBILE SECTION NAV
// ════════════════════════════════════════════════════════════
function setupMobileSectionNav() {
  const nav=document.getElementById('mobile-section-nav');
  if(!nav)return;

  if(!mobileNavReady){
    nav.innerHTML='';
    for(const item of MOBILE_SECTION_NAV){
      const btn=document.createElement('button');
      btn.type='button';
      btn.textContent=item.label;
      btn.dataset.target=item.id;
      btn.setAttribute('aria-label', item.id==='location' ? 'Jump to location entry' : `Jump to ${item.label} section`);
      btn.addEventListener('click',()=>scrollToMobileSection(item.id));
      nav.appendChild(btn);
    }
    window.addEventListener('scroll',queueMobileNavUpdate,{passive:true});
    mobileNavReady=true;
  }

  updateMobileSectionTargets();
  updateMobileSectionNav();
}

function getPanelOffsets() {
  const offsets=new Map();
  let y=0;
  for(const panel of PANELS){
    offsets.set(panel.id,y);
    y+=DATE_H+TIME_H+panel.h;
  }
  return offsets;
}

function updateMobileSectionTargets() {
  const controls=document.getElementById('controls');
  const c=document.getElementById('c');
  if(!controls||!c)return;

  const scrollY=window.scrollY||window.pageYOffset;
  const controlsTop=controls.getBoundingClientRect().top+scrollY;
  const canvasTop=c.getBoundingClientRect().top+scrollY;
  const offsets=getPanelOffsets();

  mobileSectionTargets = MOBILE_SECTION_NAV.map(item => ({
    id:item.id,
    top:item.id==='location' ? controlsTop : canvasTop+(offsets.get(item.id)||0),
  }));
}

function scrollToMobileSection(id) {
  updateMobileSectionTargets();
  const target=mobileSectionTargets.find(t=>t.id===id);
  if(!target)return;
  const nav=document.getElementById('mobile-section-nav');
  const navH=nav?.offsetHeight||0;
  const pad=6;
  window.scrollTo({ top:Math.max(0,target.top-navH-pad), behavior:'auto' });
}

function queueMobileNavUpdate() {
  if(mobileNavRaf)return;
  mobileNavRaf=requestAnimationFrame(()=>{
    mobileNavRaf=null;
    updateMobileSectionNav();
  });
}

function updateMobileSectionNav() {
  const nav=document.getElementById('mobile-section-nav');
  if(!nav||!mobileSectionTargets.length)return;

  const isMobile=window.matchMedia('(max-width: 560px)').matches;
  const scrollY=window.scrollY||window.pageYOffset;
  const controls=document.getElementById('controls');
  const showAfter=controls ? controls.getBoundingClientRect().bottom+scrollY-8 : 0;
  nav.classList.toggle('is-visible',isMobile&&scrollY>showAfter);

  const navH=nav.offsetHeight||0;
  const probe=scrollY+navH+12;
  let active=mobileSectionTargets[0].id;
  for(const target of mobileSectionTargets){
    if(probe>=target.top)active=target.id;
    else break;
  }

  nav.querySelectorAll('button').forEach(btn=>{
    const isActive=btn.dataset.target===active;
    btn.classList.toggle('is-active',isActive);
    if(isActive)btn.setAttribute('aria-current','true');
    else btn.removeAttribute('aria-current');
  });
}

// ════════════════════════════════════════════════════════════
// RESIZE
// ════════════════════════════════════════════════════════════
let rsz;
window.addEventListener('resize',()=>{clearTimeout(rsz);rsz=setTimeout(()=>{if(D.length)draw();},150);});

// Boot
if('scrollRestoration' in history)history.scrollRestoration='manual';
window.SharedLocation?.initCheckbox({ getLocation: getCurrentDashboardLocation });
window.addEventListener('popstate', () => {
  const loc = getDashboardLocationFromUrl();
  if (loc) {
    applyDashboardLocationToInputs(loc);
    loadForecast({ syncUrl: false });
  } else {
    document.getElementById('city').value = '';
    document.getElementById('coords').value = '39.741678, -104.976111';
    loadForecast({ syncUrl: false });
  }
});
if (applyUrlDashboardLocation()) {
  loadForecast({ syncUrl: false });
} else if (applySharedDashboardLocation()) {
  loadForecast({ urlMode: 'replace' });
} else {
  loadForecast({ syncUrl: false });
}
