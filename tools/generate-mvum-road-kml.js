const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, 'mvum-roads.geojson');
const dateLookupPath = path.join(rootDir, 'mvum-road-dates.json');
const outputPath = path.join(rootDir, 'mvum-roads-caltopo-grouped.kml');

const styles = {
  yearround: { color: 'ff21a366', width: 4 },
  seasonal: { color: 'ff2f80ed', width: 4 },
  seasonalUnknown: { color: 'ffdf8b2f', width: 4 },
  special: { color: 'ffc44dff', width: 4 },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readDateLookup() {
  if (!fs.existsSync(dateLookupPath)) {
    return {};
  }

  return readJson(dateLookupPath);
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'unknown';
}

function coordsToKml(coords) {
  return coords.map(([lon, lat, ele = 0]) => `${lon},${lat},${ele}`).join(' ');
}

function geometryToKml(geometry) {
  if (!geometry) {
    return '';
  }

  if (geometry.type === 'LineString') {
    return `<LineString><tessellate>1</tessellate><coordinates>${coordsToKml(geometry.coordinates)}</coordinates></LineString>`;
  }

  if (geometry.type === 'MultiLineString') {
    return `<MultiGeometry>${geometry.coordinates
      .map((line) => `<LineString><tessellate>1</tessellate><coordinates>${coordsToKml(line)}</coordinates></LineString>`)
      .join('')}</MultiGeometry>`;
  }

  throw new Error(`Unsupported geometry type: ${geometry.type}`);
}

function vehicleGroup(properties) {
  const passengerOpen = properties.passengervehicle === 'open';
  const highClearanceOpen = properties.highclearancevehicle === 'open';
  const symbol = properties.mvum_symbol_name || '';

  if (/Special Designation/i.test(symbol)) {
    return 'Special Designation';
  }

  if (/highway legal/i.test(symbol)) {
    return 'Highway Legal Vehicles Only';
  }

  if (passengerOpen && highClearanceOpen) {
    return 'All Vehicles';
  }

  if (highClearanceOpen) {
    return 'High Clearance Vehicles';
  }

  if (passengerOpen) {
    return 'Passenger Vehicles';
  }

  return 'Vehicle Class Unknown';
}

function lookupDateInfo(properties, lookup) {
  const keys = [
    `${properties.id}|${properties.mvum_symbol_name}`,
    `${properties.id}|${properties.seasonal}`,
    properties.id,
  ];

  for (const key of keys) {
    if (lookup[key]) {
      return lookup[key];
    }
  }

  return {};
}

function accessWindow(properties, dateInfo) {
  if (dateInfo.open_dates) {
    return dateInfo.open_dates;
  }

  if (properties.seasonal === 'yearlong') {
    return 'Year-round';
  }

  return 'Seasonal - dates not in source GeoJSON';
}

function styleId(properties, dateInfo) {
  if (/Special Designation/i.test(properties.mvum_symbol_name || '')) {
    return 'special';
  }

  if (properties.seasonal === 'yearlong') {
    return 'yearround';
  }

  return dateInfo.open_dates ? 'seasonal' : 'seasonalUnknown';
}

function placemark(feature, dateInfo) {
  const properties = feature.properties || {};
  const roadName = `FSR ${properties.id || properties.field_id || ''} - ${properties.name || 'Unnamed Road'}`;
  const window = accessWindow(properties, dateInfo);
  const vehicle = vehicleGroup(properties);
  const style = styleId(properties, dateInfo);

  const descriptionRows = [
    ['Road ID', properties.id],
    ['Road Name', properties.name],
    ['Open Dates', window],
    ['Vehicle Group', vehicle],
    ['Forest', properties.forestname],
    ['District', properties.districtname],
    ['Seasonal Source Value', properties.seasonal],
    ['MVUM Symbol', properties.mvum_symbol_name],
    ['Camping Determination', dateInfo.camping || 'Not determined from this road-only file'],
    ['Notes', dateInfo.notes || 'Use the current MVUM/dispersed-camping corridor symbols and local closure orders before treating this as campsite-legal.'],
  ];

  const description = descriptionRows
    .map(([label, value]) => `${escapeXml(label)}: ${escapeXml(value)}`)
    .join('<br/>');

  const data = [
    ['road_id', properties.id],
    ['road_name', properties.name],
    ['open_dates', window],
    ['vehicle_group', vehicle],
    ['seasonal', properties.seasonal],
    ['mvum_symbol', properties.mvum_symbol_name],
    ['camping_status', dateInfo.camping || 'unknown'],
  ].map(([name, value]) => `<Data name="${escapeXml(name)}"><value>${escapeXml(value)}</value></Data>`).join('');

  return `
      <Placemark>
        <name>${escapeXml(roadName)}</name>
        <styleUrl>#${style}</styleUrl>
        <description>${description}</description>
        <ExtendedData>${data}</ExtendedData>
        ${geometryToKml(feature.geometry)}
      </Placemark>`;
}

function folder(name, children) {
  return `
    <Folder>
      <name>${escapeXml(name)}</name>
      ${children.join('\n')}
    </Folder>`;
}

function buildKml(features, dateLookup) {
  const grouped = new Map();

  for (const feature of features) {
    const properties = feature.properties || {};
    const dateInfo = lookupDateInfo(properties, dateLookup);
    const window = accessWindow(properties, dateInfo);
    const vehicle = vehicleGroup(properties);
    const topKey = `${window}`;
    const childKey = `${vehicle}`;

    if (!grouped.has(topKey)) {
      grouped.set(topKey, new Map());
    }

    const childMap = grouped.get(topKey);
    if (!childMap.has(childKey)) {
      childMap.set(childKey, []);
    }

    childMap.get(childKey).push(placemark(feature, dateInfo));
  }

  const folders = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([window, vehicleMap]) => folder(window, [...vehicleMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([vehicle, placemarks]) => folder(vehicle, placemarks))));

  const styleMarkup = Object.entries(styles).map(([id, style]) => `
    <Style id="${id}">
      <LineStyle>
        <color>${style.color}</color>
        <width>${style.width}</width>
      </LineStyle>
    </Style>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>MVUM Roads - CalTopo Grouped</name>
    <description>Grouped by available access window. Specific seasonal dates require mvum-road-dates.json because the source GeoJSON only includes seasonal/yearlong.</description>
    ${styleMarkup}
    ${folders.join('\n')}
  </Document>
</kml>
`;
}

const geojson = readJson(sourcePath);
const dateLookup = readDateLookup();
const kml = buildKml(geojson.features || [], dateLookup);

fs.writeFileSync(outputPath, kml);
console.log(`Wrote ${path.relative(rootDir, outputPath)} with ${geojson.features.length} road segments.`);
