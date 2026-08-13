const DRAFT_GEOJSON_URL = 'data/dispersed/eagle-holy-cross-east-draft.geojson';
const MVUM_ROADS_URL = 'data/dispersed/processed/ehc-road-segments.geojson';
const BLM_ROADS_URL = 'data/dispersed/processed/ehc-blm-road-segments.geojson';
const MVUM_OVERLAY_KML_URL = 'assets/dispersed/eagle-holy-cross-east/doc.kml';
const MAP_START_BOUNDS = [[38.95511336454613, -107.1890132066087], [39.95997073330193, -105.5240696350973]];
const DISPERSED_TABLE_SOURCE_PATTERN = /dispersed\s+camping\s+table/i;

const map = L.map('map', {
  zoomControl: true,
  preferCanvas: true,
});

const streetsLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors',
});
const terrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles &copy; Esri',
});
const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles &copy; Esri',
});
const hybridLayer = L.layerGroup([
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri',
  }),
  L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Roads &copy; Esri',
  }),
  L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Labels &copy; Esri',
  }),
]);

streetsLayer.addTo(map);

const dispersedGroup = L.layerGroup().addTo(map);
const roadContextGroup = L.layerGroup();
const mvumOverlayGroup = L.layerGroup();
const layerControl = L.control.layers(
  {
    Streets: streetsLayer,
    Terrain: terrainLayer,
    Satellite: satelliteLayer,
    Hybrid: hybridLayer,
  },
  {
    'Dispersed camping lines': dispersedGroup,
    'USFS MVUM road context': roadContextGroup,
    'MVUM image overlay': mvumOverlayGroup,
  },
  { collapsed: false }
).addTo(map);

let draftData = null;
let roadData = null;
let blmRoadData = null;
let visibleFeatures = [];
let visibleRoadFeatures = [];
let dispersedGeoJsonLayer = null;

map.fitBounds(MAP_START_BOUNDS, { padding: [18, 18] });

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
document.getElementById('season-date').value = localDate;

document.getElementById('toggle-dispersed').addEventListener('change', renderLayers);
document.getElementById('toggle-road-context').addEventListener('change', renderLayers);
document.getElementById('toggle-open-only').addEventListener('change', renderLayers);
document.getElementById('toggle-passenger-only').addEventListener('change', renderLayers);
document.getElementById('season-date').addEventListener('change', renderLayers);
document.getElementById('color-mode').addEventListener('change', renderLayers);
document.getElementById('export-geojson').addEventListener('click', () => exportVisibleFeatures('geojson'));
document.getElementById('export-kml').addEventListener('click', () => exportVisibleFeatures('kml'));
document.getElementById('export-gpx').addEventListener('click', () => exportVisibleFeatures('gpx'));
map.on('zoomend', refreshDispersedLayerStyle);

loadMapData();
loadMvumImageOverlay();

async function loadMapData() {
  setMapStatus('Loading dispersed-camping and MVUM road layers...');
  const [draftResult, roadResult, blmRoadResult] = await Promise.allSettled([
    fetchGeoJson(DRAFT_GEOJSON_URL),
    fetchGeoJson(MVUM_ROADS_URL),
    fetchGeoJson(BLM_ROADS_URL),
  ]);

  if (draftResult.status === 'fulfilled') {
    draftData = draftResult.value;
  }

  if (roadResult.status === 'fulfilled') {
    roadData = roadResult.value;
  }

  if (blmRoadResult.status === 'fulfilled') {
    blmRoadData = blmRoadResult.value;
  }

  renderLayers();

  const messages = [];
  if (draftResult.status === 'rejected') {
    messages.push(`draft camping lines failed: ${draftResult.reason.message}`);
  } else if (draftData.features?.length) {
    const eligibleCount = draftData.features.filter(isEligibleDispersedCampingFeature).length;
    messages.push(`${eligibleCount} eligible dispersed-camping line(s) loaded from ${draftData.features.length} reviewed candidate(s)`);
  } else {
    messages.push('no reviewed dispersed-camping lines are loaded yet');
  }

  if (roadResult.status === 'rejected') {
    messages.push(`USFS road context failed: ${roadResult.reason.message}`);
  } else {
    messages.push(`${roadData.features?.length || 0} USFS MVUM road segment(s) loaded`);
  }

  if (blmRoadResult.status === 'rejected') {
    messages.push(`BLM road candidates failed: ${blmRoadResult.reason.message}`);
  } else {
    messages.push(`${blmRoadData.features?.length || 0} BLM road candidate(s) loaded`);
  }

  setMapStatus(`${messages.join('; ')}. Verify MVUMs, closure orders, land manager rules, and fire restrictions before relying on any route.`);
}

async function fetchGeoJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.json();
}

async function loadMvumImageOverlay() {
  try {
    const response = await fetch(MVUM_OVERLAY_KML_URL);
    if (!response.ok) throw new Error(`Could not load ${MVUM_OVERLAY_KML_URL}`);
    const kmlText = await response.text();
    const kml = new DOMParser().parseFromString(kmlText, 'application/xml');
    kml.querySelectorAll('GroundOverlay').forEach((overlay) => {
      const href = overlay.querySelector('Icon href')?.textContent?.trim();
      const box = overlay.querySelector('LatLonBox');
      if (!href || !box) return;

      const north = Number(box.querySelector('north')?.textContent);
      const south = Number(box.querySelector('south')?.textContent);
      const east = Number(box.querySelector('east')?.textContent);
      const west = Number(box.querySelector('west')?.textContent);
      if (![north, south, east, west].every(Number.isFinite)) return;

      L.imageOverlay(`assets/dispersed/eagle-holy-cross-east/${href}`, [[south, west], [north, east]], {
        opacity: 0.5,
        interactive: false,
      }).addTo(mvumOverlayGroup);
    });
  } catch (err) {
    console.warn(err);
  }
}

function renderLayers() {
  renderDispersedLayer();
  renderRoadContextLayer();
  renderSummary();
  renderSegmentList(visibleFeatures);
}

function renderDispersedLayer() {
  dispersedGroup.clearLayers();
  dispersedGeoJsonLayer = null;
  const showDispersed = document.getElementById('toggle-dispersed').checked;
  if (!showDispersed || !draftData) {
    visibleFeatures = [];
    if (map.hasLayer(dispersedGroup)) map.removeLayer(dispersedGroup);
    return;
  }

  const selectedDate = parseSelectedDate();
  const openOnly = document.getElementById('toggle-open-only').checked;
  const campingFeatures = draftData.features.filter((feature) => {
    if (!isEligibleDispersedCampingFeature(feature)) return false;
    if (!openOnly) return true;
    return isOpenOnDate(feature.properties, selectedDate);
  });
  const blmFeatures = (blmRoadData?.features || []).filter((feature) => {
    if (!isBlmCampingCandidate(feature)) return false;
    if (!openOnly) return true;
    return isOpenOnDate(feature.properties, selectedDate);
  });
  const features = [...campingFeatures, ...blmFeatures];
  visibleFeatures = features;

  dispersedGeoJsonLayer = L.geoJSON({ type: 'FeatureCollection', features }, {
    style: (feature) => getFeatureStyle(feature.properties, selectedDate),
    onEachFeature: (feature, layer) => {
      const layerType = feature.properties?.sourceAgency === 'BLM' ? 'blm' : 'camping';
      layer.bindPopup(getPopupHtml(feature.properties, selectedDate, layerType));
      layer.on('mouseover', () => layer.setStyle({ weight: getDispersedLineWeight() + 2, opacity: 1 }));
      layer.on('mouseout', () => layer.setStyle(getFeatureStyle(feature.properties, selectedDate)));
    },
  }).addTo(dispersedGroup);

  if (!map.hasLayer(dispersedGroup)) dispersedGroup.addTo(map);
}

function renderRoadContextLayer() {
  roadContextGroup.clearLayers();
  const showRoads = document.getElementById('toggle-road-context').checked;
  if (!showRoads || !roadData) {
    visibleRoadFeatures = [];
    if (map.hasLayer(roadContextGroup)) map.removeLayer(roadContextGroup);
    return;
  }

  const selectedDate = parseSelectedDate();
  const openOnly = document.getElementById('toggle-open-only').checked;
  const passengerOnly = document.getElementById('toggle-passenger-only').checked;
  const features = roadData.features.filter((feature) => {
    const props = feature.properties || {};
    if (passengerOnly && props.vehicleClass !== 'passenger') return false;
    if (!openOnly) return true;
    return isOpenOnDate(props, selectedDate);
  });
  visibleRoadFeatures = features;

  L.geoJSON({ type: 'FeatureCollection', features }, {
    style: (feature) => getRoadContextStyle(feature.properties, selectedDate),
    onEachFeature: (feature, layer) => {
      layer.bindPopup(getPopupHtml(feature.properties, selectedDate, 'road'));
      layer.on('mouseover', () => layer.setStyle({ weight: 5, opacity: 0.95 }));
      layer.on('mouseout', () => layer.setStyle(getRoadContextStyle(feature.properties, selectedDate)));
    },
  }).addTo(roadContextGroup);

  if (!map.hasLayer(roadContextGroup)) roadContextGroup.addTo(map);
}

function isEligibleDispersedCampingFeature(feature) {
  const props = feature?.properties || {};
  if (props.dispersedCamping !== true) return false;
  if (!['allowed', 'limited'].includes(props.campingStatus)) return false;
  if (props.mvumDottedCorridor !== true) return false;
  return isDispersedCampingTableSource(props);
}

function isDispersedCampingTableSource(props) {
  if (props.dispersedCampingTable === true) return true;
  const sourceValues = [
    props.source,
    props.sourceName,
    props.sourceTable,
    props.mvumTable,
    props.reviewSource,
    props.notes,
  ];
  return sourceValues.some((value) => DISPERSED_TABLE_SOURCE_PATTERN.test(String(value || '')));
}

function isBlmCampingCandidate(feature) {
  const props = feature?.properties || {};
  return props.sourceAgency === 'BLM' && props.blmRouteAuthority === true;
}

function exportVisibleFeatures(format) {
  if (!visibleFeatures.length) {
    setMapStatus('No visible dispersed-camping lines to export. Adjust filters and try again.');
    return;
  }

  const featureCollection = {
    type: 'FeatureCollection',
    name: 'Visible dispersed camping lines',
    features: visibleFeatures,
  };
  const stamp = new Date().toISOString().slice(0, 10);
  const basename = `eagle-holy-cross-dispersed-visible-${stamp}`;

  if (format === 'geojson') {
    downloadText(`${basename}.geojson`, JSON.stringify(featureCollection, null, 2), 'application/geo+json');
    setMapStatus(`Exported ${visibleFeatures.length} visible line(s) as GeoJSON.`);
    return;
  }

  if (format === 'kml') {
    downloadText(`${basename}.kml`, toKml(featureCollection), 'application/vnd.google-earth.kml+xml');
    setMapStatus(`Exported ${visibleFeatures.length} visible line(s) as KML.`);
    return;
  }

  if (format === 'gpx') {
    downloadText(`${basename}.gpx`, toGpx(featureCollection), 'application/gpx+xml');
    setMapStatus(`Exported ${visibleFeatures.length} visible line(s) as GPX.`);
  }
}

function downloadText(filename, text, mimeType) {
  const blob = new Blob([text], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toKml(collection) {
  const placemarks = collection.features.map((feature) => {
    const props = feature.properties || {};
    return `
    <Placemark>
      <name>${xmlEscape(props.name || props.roadName || props.road || 'Dispersed camping line')}</name>
      <description>${xmlEscape(getExportDescription(props))}</description>
      <Style>
        <LineStyle>
          <color>ff14ff39</color>
          <width>4</width>
        </LineStyle>
      </Style>
      ${geometryToKml(feature.geometry)}
    </Placemark>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Visible dispersed camping lines</name>${placemarks}
  </Document>
</kml>
`;
}

function geometryToKml(geometry) {
  if (!geometry) return '';
  if (geometry.type === 'LineString') {
    return `<LineString><tessellate>1</tessellate><coordinates>${coordsToKml(geometry.coordinates)}</coordinates></LineString>`;
  }
  if (geometry.type === 'MultiLineString') {
    const lines = geometry.coordinates.map((line) => `
        <LineString><tessellate>1</tessellate><coordinates>${coordsToKml(line)}</coordinates></LineString>`).join('');
    return `<MultiGeometry>${lines}
      </MultiGeometry>`;
  }
  return '';
}

function coordsToKml(coords) {
  return coords.map(([lon, lat, ele]) => `${lon},${lat},${Number.isFinite(ele) ? ele : 0}`).join(' ');
}

function toGpx(collection) {
  const tracks = collection.features.map((feature) => {
    const props = feature.properties || {};
    const lines = feature.geometry?.type === 'MultiLineString'
      ? feature.geometry.coordinates
      : feature.geometry?.type === 'LineString'
        ? [feature.geometry.coordinates]
        : [];
    const segments = lines.map((line) => `
      <trkseg>${line.map(([lon, lat, ele]) => `
        <trkpt lat="${xmlAttr(lat)}" lon="${xmlAttr(lon)}">${Number.isFinite(ele) ? `<ele>${xmlEscape(ele)}</ele>` : ''}</trkpt>`).join('')}
      </trkseg>`).join('');
    return `
    <trk>
      <name>${xmlEscape(props.name || props.roadName || props.road || 'Dispersed camping line')}</name>
      <desc>${xmlEscape(getExportDescription(props))}</desc>${segments}
    </trk>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Weather Dashboard Dispersed Camping Map" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Visible dispersed camping lines</name>
  </metadata>${tracks}
</gpx>
`;
}

function getExportDescription(props) {
  return [
    `Road: ${props.road || props.roadId || 'Unknown'} ${props.roadName || props.name || ''}`.trim(),
    `Season: ${formatSeason(props)}`,
    `Forest: ${props.forest || 'White River National Forest'}`,
    `District: ${props.district || 'Eagle-Holy Cross Ranger District'}`,
    `Review status: ${props.reviewStatus || 'draft'}`,
    `Source: ${props.source || props.sourceUrl || '2025 summer MVUM'}`,
    `Notes: ${props.notes || props.sourceNote || 'Verify against official MVUM and current closure orders.'}`,
  ].join('\n');
}

function getFeatureStyle(props, selectedDate) {
  const colorMode = document.getElementById('color-mode').value;
  const weight = getDispersedLineWeight();
  if (colorMode === 'season') {
    return {
      color: isOpenOnDate(props, selectedDate) ? '#39ff14' : '#ff8a65',
      weight,
      opacity: 0.98,
      lineCap: 'round',
      lineJoin: 'round',
    };
  }

  const color = '#39ff14';
  return {
    color,
    weight,
    opacity: 0.98,
    lineCap: 'round',
    lineJoin: 'round',
  };
}

function getDispersedLineWeight() {
  const zoom = map.getZoom();
  if (zoom <= 9) return 10;
  if (zoom <= 11) return 8;
  if (zoom <= 13) return 6;
  if (zoom <= 15) return 5;
  return 4;
}

function refreshDispersedLayerStyle() {
  if (!dispersedGeoJsonLayer) return;
  const selectedDate = parseSelectedDate();
  dispersedGeoJsonLayer.setStyle((feature) => getFeatureStyle(feature.properties, selectedDate));
}

function getRoadContextStyle(props, selectedDate) {
  const colorMode = document.getElementById('color-mode').value;
  const open = isOpenOnDate(props, selectedDate);
  if (colorMode === 'season') {
    return {
      color: open ? '#d946ef' : '#9a6759',
      weight: props.vehicleClass === 'passenger' ? 3 : 2,
      opacity: open ? 0.68 : 0.42,
      dashArray: props.vehicleClass === 'passenger' ? null : '5 5',
    };
  }

  return {
    color: props.vehicleClass === 'passenger' ? '#d946ef' : '#c084fc',
    weight: props.vehicleClass === 'passenger' ? 3 : 2,
    opacity: 0.62,
    dashArray: props.vehicleClass === 'passenger' ? null : '5 5',
  };
}

function parseSelectedDate() {
  const value = document.getElementById('season-date').value || localDate;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date(`${localDate}T12:00:00`) : date;
}

function isOpenOnDate(props, date) {
  const start = parseMonthDay(props.openStart);
  const end = parseMonthDay(props.openEnd);
  if (!start || !end) return false;
  const value = (date.getMonth() + 1) * 100 + date.getDate();
  const startValue = start.month * 100 + start.day;
  const endValue = end.month * 100 + end.day;
  if (startValue <= endValue) return value >= startValue && value <= endValue;
  return value >= startValue || value <= endValue;
}

function parseMonthDay(value) {
  const match = String(value || '').match(/^(\d{2})-(\d{2})$/);
  if (!match) return null;
  return { month: Number(match[1]), day: Number(match[2]) };
}

function formatSeason(props) {
  return `${formatMonthDay(props.openStart)} to ${formatMonthDay(props.openEnd)}`;
}

function formatMonthDay(value) {
  const parsed = parseMonthDay(value);
  if (!parsed) return 'Unknown';
  const date = new Date(2025, parsed.month - 1, parsed.day);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getPopupHtml(props, selectedDate, layerType) {
  const open = isOpenOnDate(props, selectedDate);
  const statusClass = props.reviewStatus === 'needs-review' ? 'review' : open ? 'open' : 'closed';
  const statusLabel = layerType === 'blm'
    ? open ? 'BLM candidate, open or unrestricted' : 'BLM candidate, closed or unknown'
    : layerType === 'road'
    ? open ? 'Open for selected date' : 'Closed or unknown for selected date'
    : props.reviewStatus === 'needs-review' ? 'Needs manual review' : open ? 'Open for selected date' : 'Closed for selected date';
  const roadLabel = [props.roadId || props.road, props.roadName || props.name].filter(Boolean).join(' - ') || 'Unnamed road segment';
  const sourceNote = layerType === 'blm'
    ? props.sourceNote || 'BLM route candidate. Confirm local land manager orders and site-specific camping restrictions.'
    : layerType === 'road'
    ? 'USFS MVUM road context only. Motorized access does not imply dispersed camping eligibility.'
    : props.notes || 'Draft traced line. Verify against MVUM dots.';

  return `
    <div class="popup-title">${escapeHtml(roadLabel)}</div>
    <div class="popup-row"><strong>Season:</strong> ${escapeHtml(formatSeason(props))}</div>
    <div class="popup-row"><strong>Agency:</strong> ${escapeHtml(props.sourceAgency || 'USFS')}</div>
    <div class="popup-row"><strong>Forest:</strong> ${escapeHtml(props.forest || 'White River NF')}</div>
    <div class="popup-row"><strong>District:</strong> ${escapeHtml(props.district || 'Eagle-Holy Cross RD')}</div>
    <div class="popup-row"><strong>Vehicle:</strong> ${escapeHtml(formatVehicleClass(props))}</div>
    <div class="popup-row"><strong>Camping review:</strong> ${escapeHtml(props.reviewStatus || (layerType === 'road' ? 'road context only' : 'draft'))}</div>
    <div class="popup-row"><strong>Fire status:</strong> ${escapeHtml(props.fireRestrictionStatus || 'unknown')}</div>
    <div class="popup-row"><strong>Source:</strong> ${escapeHtml(props.source || props.sourceUrl || '2025 summer MVUM')}</div>
    <div class="popup-row"><strong>Note:</strong> ${escapeHtml(sourceNote)} Verify current MVUM, closure orders, and fire restrictions.</div>
    <span class="status-pill ${statusClass}">${statusLabel}</span>
  `;
}

function formatVehicleClass(props) {
  if (props.vehicleClass === 'passenger') return 'Passenger vehicle';
  if (props.vehicleClass === 'high-clearance') return 'High-clearance vehicle';
  return props.vehicleClass || 'Unknown';
}

function renderSummary() {
  const selectedDate = parseSelectedDate();
  const openCampingCount = visibleFeatures.filter((feature) => isOpenOnDate(feature.properties, selectedDate)).length;
  const needsReview = visibleFeatures.filter((feature) => feature.properties?.reviewStatus !== 'verified').length;
  const openRoadCount = visibleRoadFeatures.filter((feature) => isOpenOnDate(feature.properties, selectedDate)).length;
  const sourceCount = 1 + (roadData ? 1 : 0) + (blmRoadData ? 1 : 0);
  const summary = [
    { label: 'Camping lines', value: visibleFeatures.length },
    { label: 'Open camping', value: openCampingCount },
    { label: 'Need review', value: needsReview },
    { label: 'MVUM roads', value: visibleRoadFeatures.length },
    { label: 'Open roads', value: openRoadCount },
    { label: 'Sources', value: sourceCount },
  ];
  document.getElementById('layer-summary').innerHTML = summary.map((item) => `
    <div class="summary-item">
      <div class="summary-value">${item.value}</div>
      <div class="summary-label">${item.label}</div>
    </div>
  `).join('');
}

function renderSegmentList(features) {
  const listEl = document.getElementById('segment-list');
  if (!features.length) {
    listEl.innerHTML = '<div class="panel-copy">No draft dispersed-camping lines match the current filters.</div>';
    return;
  }

  listEl.innerHTML = '';
  features.forEach((feature, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'segment-button';
    button.innerHTML = `
      <span class="segment-name">${escapeHtml(feature.properties.name || feature.properties.roadName || `Draft segment ${index + 1}`)}</span>
      <span class="segment-meta">${escapeHtml(formatSeason(feature.properties))} · ${escapeHtml(feature.properties.reviewStatus || 'draft')}</span>
    `;
    button.addEventListener('click', () => zoomToFeature(feature));
    listEl.appendChild(button);
  });
}

function zoomToFeature(feature) {
  const layer = L.geoJSON(feature);
  const bounds = layer.getBounds();
  if (bounds.isValid()) map.fitBounds(bounds, { maxZoom: 14, padding: [50, 50] });
}

function setMapStatus(message) {
  document.getElementById('map-status').textContent = message;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char]));
}

function xmlEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  }[char]));
}

function xmlAttr(value) {
  return xmlEscape(value);
}
