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
const LABEL_H = Math.round(22 * SCALE);

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
      {key:'windChill', color:'#4488ee', label:'Wind Chill', dash:[4,3]},
      {key:'dewpoint',  color:'#33bb55', label:'Dewpoint'},
    ],
    tooltipKeys:['temp','windChill','dewpoint'],
  },

  { id:'sky', label:'Sky Cover / Rel. Humidity / PoP (%)', h: Math.round(90*SCALE), type:'multi', fixedRange:[0,100],
    lines:[
      {key:'skyCover', color:'#6aaddd', label:'Sky Cover'},
      {key:'rh',       color:'#44bb55', label:'Humidity'},
      {key:'pop',      color:'#ccaa22', label:'PoP', dash:[3,2]},
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
];

// ════════════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════════════
let ALL_DATA  = [];
let D         = [];
let startIdx  = 0;
let canvas, ctx, dpr;

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

const cToF   = c => c==null?null:Math.round(c*9/5+32);
const kToMph = v => v==null?null:Math.round(v/1.60934);
const mmToIn = v => v==null?null:+(v/25.4).toFixed(2);
const card   = d => ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round((d??0)/22.5)%16];

function niceStep(mn,mx,ticks){ const r=(mx-mn||1)/ticks,m=Math.pow(10,Math.floor(Math.log10(r))); for(const c of[1,2,5,10])if(c*m>=r)return c*m; return 10; }

function popLabel(p){ if(p==null)return null; if(p>=70)return'Ocnl'; if(p>=55)return'Lkly'; if(p>=40)return'Chc'; if(p>=20)return'SChc'; return null; }

function floor3h(d){ const h=d.getHours(); return new Date(d.getFullYear(),d.getMonth(),d.getDate(),Math.floor(h/3)*3,0,0,0); }

// ════════════════════════════════════════════════════════════
// FETCH
// ════════════════════════════════════════════════════════════
async function loadForecast() {
  const raw=document.getElementById('coords').value.trim();
  const parts=raw.split(/[\s,]+/).filter(Boolean);
  const lat=parseFloat(parts[0]), lon=parseFloat(parts[1]);
  if(isNaN(lat)||isNaN(lon)){setStatus('Invalid coordinates');return;}

  setStatus('Fetching grid info…');
  try {
    const pt=await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`).then(r=>r.json());
    const {gridId,gridX,gridY,relativeLocation}=pt.properties;
    const city=relativeLocation?.properties?.city||'', state=relativeLocation?.properties?.state||'';
    document.getElementById('loc').textContent=`${city}${city?', ':''}${state}  (${lat.toFixed(4)}, ${lon.toFixed(4)})  ·  ${gridId} ${gridX},${gridY}`;

    setStatus('Fetching forecast data…');
    const gd=await fetch(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}`).then(r=>r.json());
    const p=gd.properties;

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
    const thr=expand(p.probabilityOfThunderstorms?.values,N);
    const qpf=expand(p.quantitativePrecipitation?.values, N).map(x=>({...x,value:mmToIn(x.value)}));
    const snw=expand(p.snowfallAmount?.values,      N).map(x=>({...x,value:mmToIn(x.value)}));
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
    }));

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
  if(D.length) draw();
}

// ════════════════════════════════════════════════════════════
// DRAW
// ════════════════════════════════════════════════════════════
function draw() {
  const n=D.length; if(!n)return;
  canvas=document.getElementById('c');
  dpr=window.devicePixelRatio||1;

  const W=LEFT+BUFFER*HW+n*HW+RIGHT;
  const H=PANELS.reduce((s,p)=>s+DATE_H+TIME_H+p.h,0);

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
function drawPanel(panel,y0,n,W){
  ctx.fillStyle=C.axisBg;
  ctx.fillRect(0,y0,LEFT,panel.h);

  if(panel.type==='multi'){
    let lx=LEFT+BUFFER*HW+Math.round(6*SCALE);
    ctx.font=`${Math.round(9*SCALE)}px Arial`;
    ctx.textBaseline='middle';
    for(const line of panel.lines){
      ctx.fillStyle=line.color||C.labelTxt;
      ctx.fillText(line.label, lx, y0+LABEL_H/2);
      lx+=ctx.measureText(line.label).width+Math.round(8*SCALE);
    }
  } else {
    ctx.font=`${Math.round(9*SCALE)}px Arial`;
    ctx.fillStyle=panel.labelColor||C.labelTxt;
    ctx.textBaseline='middle';
    ctx.fillText(panel.label, LEFT+BUFFER*HW+Math.round(6*SCALE), y0+LABEL_H/2);
  }

  const dataY=y0+LABEL_H;
  const dataH=panel.h-LABEL_H;

  if     (panel.type==='multi')  drawMulti(panel,dataY,dataH,n);
  else if(panel.type==='wind')   drawWind(dataY,dataH,n);
  else if(panel.type==='precip') drawPrecip(panel,dataY,dataH,n);
}

// ════════════════════════════════════════════════════════════
// MULTI-LINE PANEL
// ════════════════════════════════════════════════════════════
function drawMulti(panel,y0,h,n){
  const allVals=panel.lines.flatMap(l=>D.map(d=>d[l.key])).filter(v=>v!=null);
  if(!allVals.length)return;
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
    ctx.fillText(v, LEFT-Math.round(5*SCALE), y);
    ctx.strokeStyle=C.gridH;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(LEFT,y);ctx.lineTo(LEFT+BUFFER*HW+n*HW,y);ctx.stroke();
  }

  for(const line of panel.lines){
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

    ctx.font=`${Math.round(8.5*SCALE)}px Arial`;
    ctx.fillStyle=line.color;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    for(let i=0;i<n;i++){
      if(D[i].time.getHours()%3===0&&vals[i]!=null)
        ctx.fillText(vals[i],LEFT+BUFFER*HW+i*HW,toY(vals[i])-2);
    }
  }
}

// ════════════════════════════════════════════════════════════
// WIND PANEL
// ════════════════════════════════════════════════════════════
function drawWind(y0,h,n){
  const wsV=D.map(d=>d.windSpeed), wgV=D.map(d=>d.windGust);
  const all=[...wsV,...wgV].filter(v=>v!=null);
  if(!all.length)return;

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
    ctx.fillText(v,LEFT-Math.round(5*SCALE),y);
    ctx.strokeStyle=C.gridH;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(LEFT,y);ctx.lineTo(LEFT+BUFFER*HW+n*HW,y);ctx.stroke();
  }

  drawLine2(wsV,'#dd44aa',1.7,null,toY,n);
  drawLine2(wgV,'#3366cc',1.4,[4,3],toY,n);

  ctx.font=`${Math.round(8.5*SCALE)}px Arial`;ctx.fillStyle='#dd44aa';
  ctx.textAlign='center';ctx.textBaseline='bottom';
  for(let i=0;i<n;i++){
    if(D[i].time.getHours()%3===0&&wsV[i]!=null)
      ctx.fillText(wsV[i],LEFT+BUFFER*HW+i*HW,toY(wsV[i])-2);
  }

  const cy=y0+arrowH/2;
  const astep=Math.max(1,Math.round(18/HW));
  for(let i=0;i<n;i+=astep){
    const deg=D[i].windDir;if(deg==null)continue;
    drawArrow(LEFT+BUFFER*HW+i*HW+HW/2,cy,deg,Math.round(9*SCALE));
  }
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
function drawPrecip(panel,y0,h,n){
  const pad=4, iH=h-pad*2;
  const base=y0+pad+iH;
  const toY=pct=>y0+pad+iH-(pct/100)*iH;

  const thresholds=[{v:20,lbl:'SChc'},{v:40,lbl:'Chc'},{v:55,lbl:'Lkly'},{v:70,lbl:'Ocnl'}];
  ctx.font=`${Math.round(8.5*SCALE)}px Arial`;ctx.fillStyle=C.axisTxt;
  ctx.textAlign='right';ctx.textBaseline='middle';
  for(const t of thresholds){
    const y=toY(t.v);
    ctx.fillText(t.lbl,LEFT-Math.round(3*SCALE),y);
    ctx.strokeStyle=C.gridH;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(LEFT,y);ctx.lineTo(LEFT+BUFFER*HW+n*HW,y);ctx.stroke();
  }

  const popVals=D.map(d=>d[panel.popKey]);
  for(let i=0;i<n;i++){
    const pv=popVals[i];
    if(pv==null||pv<20)continue;
    const barH=base-toY(pv);
    ctx.fillStyle=panel.barColor+'99';
    ctx.fillRect(LEFT+BUFFER*HW+i*HW,toY(pv),HW,barH);
  }

  if(panel.precipKey){
    const BAR_H=Math.round(h*0.18);
    const barY=base-BAR_H;

    for(let i=0;i<n;i+=3){
      const end=Math.min(i+3,n);
      const total=D.slice(i,end).reduce((s,d)=>s+(d[panel.precipKey]||0),0);

      const x1=LEFT+BUFFER*HW+i*HW, x2=LEFT+BUFFER*HW+end*HW;

      if(total>0){
        ctx.fillStyle=panel.barColor+'cc';
        ctx.fillRect(x1,barY,x2-x1,BAR_H);
        ctx.font=`${Math.round(7.5*SCALE)}px Arial`;ctx.fillStyle='#fff';
        ctx.textAlign='center';ctx.textBaseline='middle';
        const lbl=panel.precipKey==='snowfall'?`${total.toFixed(1)}"❄`:`${total.toFixed(2)}"`;
        ctx.fillText(lbl,(x1+x2)/2,barY+BAR_H/2);
      }
      ctx.strokeStyle='rgba(50,50,50,0.85)';
      ctx.lineWidth=1;
      ctx.strokeRect(x1+0.5,barY+0.5,x2-x1-1,BAR_H-1);
    }
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
      pop:       ()=>`PoP: ${f(d.pop)}%  ${popLabel(d.pop)||''}`,
      windSpeed: ()=>`Wind Speed: ${f(d.windSpeed)} mph`,
      windGust:  ()=>`Wind Gust: ${d.windGust!=null?d.windGust+' mph':'N/A'}`,
      windDir:   ()=>d.windDir!=null?`Direction: ${card(d.windDir)} (${d.windDir}°)`:null,
      thunder:   ()=>d.thunder?`Thunder: ${d.thunder}%  ${popLabel(d.thunder)||''}`:null,
      qpf:       ()=>d.qpf?`Rain: ${d.qpf}"`:null,
      snow:      ()=>d.snow?`Snow: ${d.snow}"`:null,
      snowfall:  ()=>d.snowfall?`Snowfall: ${d.snowfall}"`:null,
      snowPop:   ()=>`Snow PoP: ${f(d.snowPop)}%  ${popLabel(d.snowPop)||''}`,
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

// ════════════════════════════════════════════════════════════
// RESIZE
// ════════════════════════════════════════════════════════════
let rsz;
window.addEventListener('resize',()=>{clearTimeout(rsz);rsz=setTimeout(()=>{if(D.length)draw();},150);});

// Boot
loadForecast();
