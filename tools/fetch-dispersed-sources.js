const fs = require('fs');
const { execFile } = require('child_process');
const https = require('https');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'data', 'dispersed', 'sources');
const processedDir = path.join(rootDir, 'data', 'dispersed', 'processed');

const SERVICE_URL = 'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_MVUM_01/MapServer/1';
const QUERY_URL = `${SERVICE_URL}/query`;
const BLM_SERVICE_URL = 'https://gis.blm.gov/arcgis/rest/services/transportation/BLM_Natl_GTLF/MapServer/0';
const BLM_QUERY_URL = `${BLM_SERVICE_URL}/query`;
const EHC_BOUNDS = {
  west: -107.1890132066087,
  south: 38.95511336454613,
  east: -105.5240696350973,
  north: 39.95997073330193,
};
const WHERE = [
  "forestname = 'White River National Forest'",
  "districtname IN ('Eagle Ranger District', 'Holy Cross Ranger District')",
  "symbol IN ('1','2','3','4')",
].join(' AND ');
const BLM_WHERE = "ADMIN_ST = 'CO'";

const OUT_FIELDS = [
  'id',
  'name',
  'field_id',
  'forestname',
  'districtname',
  'symbol',
  'mvum_symbol_name',
  'seasonal',
  'passengervehicle',
  'passengervehicle_datesopen',
  'highclearancevehicle',
  'highclearancevehicle_datesopen',
  'bmp',
  'emp',
  'gis_miles',
  'globalid',
];
const BLM_OUT_FIELDS = [
  'OBJECTID',
  'ADMIN_ST',
  'PLAN_ROUTE_DSGNTN_AUTH',
  'PLAN_ASSET_CLASS',
  'PLAN_OHV_ROUTE_DSGNTN',
  'PLAN_MODE_TRNSPRT',
  'PLAN_ACCESS_RSTRCT',
  'PLAN_SEASON_RSTRCT_CODE',
  'OBSRVE_ROUTE_USE_CLASS',
  'ROUTE_PRMRY_NM',
  'GIS_MILES',
  'BLM_MILES',
  'GLOBALID',
];

const SOURCE_OUTPUT = path.join(sourceDir, 'ehc-usfs-mvum-roads.geojson');
const BLM_SOURCE_OUTPUT = path.join(sourceDir, 'ehc-blm-gtlf-roads.geojson');
const MANIFEST_OUTPUT = path.join(sourceDir, 'ehc-source-manifest.json');
const PROCESSED_OUTPUT = path.join(processedDir, 'ehc-road-segments.geojson');
const BLM_PROCESSED_OUTPUT = path.join(processedDir, 'ehc-blm-road-segments.geojson');

function ensureDirs() {
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.mkdirSync(processedDir, { recursive: true });
}

function encodeParams(params) {
  return new URLSearchParams(params).toString();
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}: ${body.slice(0, 500)}`));
          return;
        }

        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(new Error(`Failed to parse JSON from ${url}: ${error.message}`));
        }
      });
    }).on('error', reject);
  });
}

function getJsonWithCurl(url) {
  return new Promise((resolve, reject) => {
    execFile('curl', ['-L', '-sS', url], { maxBuffer: 100 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`curl failed: ${stderr || error.message}`));
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (parseError) {
        reject(new Error(`Failed to parse curl JSON from ${url}: ${parseError.message}`));
      }
    });
  });
}

async function fetchJson(url) {
  try {
    return await getJson(url);
  } catch (error) {
    if (/certificate|ENOTFOUND|getaddrinfo|ECONNRESET|Client network socket disconnected/i.test(error.message)) {
      return getJsonWithCurl(url);
    }

    throw error;
  }
}

async function fetchMvumRoads() {
  const pageSize = 2000;
  const features = [];
  let offset = 0;

  while (true) {
    const url = `${QUERY_URL}?${encodeParams({
      f: 'geojson',
      where: WHERE,
      outFields: OUT_FIELDS.join(','),
      returnGeometry: 'true',
      outSR: '4326',
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
    })}`;

    const page = await fetchJson(url);
    if (page.error) {
      throw new Error(`${page.error.message}: ${JSON.stringify(page.error.details || [])}`);
    }

    const pageFeatures = page.features || [];
    features.push(...pageFeatures);

    if (pageFeatures.length < pageSize && !page.exceededTransferLimit) break;
    offset += pageSize;
  }

  return {
    type: 'FeatureCollection',
    name: 'Eagle-Holy Cross USFS MVUM roads',
    features,
  };
}

async function fetchBlmRoads() {
  const pageSize = 2000;
  const features = [];
  let offset = 0;

  while (true) {
    const url = `${BLM_QUERY_URL}?${encodeParams({
      f: 'geojson',
      where: BLM_WHERE,
      outFields: BLM_OUT_FIELDS.join(','),
      returnGeometry: 'true',
      outSR: '4326',
      geometry: `${EHC_BOUNDS.west},${EHC_BOUNDS.south},${EHC_BOUNDS.east},${EHC_BOUNDS.north}`,
      geometryType: 'esriGeometryEnvelope',
      inSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
    })}`;

    const page = await fetchJson(url);
    if (page.error) {
      throw new Error(`${page.error.message}: ${JSON.stringify(page.error.details || [])}`);
    }

    const pageFeatures = page.features || [];
    features.push(...pageFeatures);

    if (pageFeatures.length < pageSize && !page.exceededTransferLimit) break;
    offset += pageSize;
  }

  return {
    type: 'FeatureCollection',
    name: 'Eagle-Holy Cross BLM GTLF roads',
    features,
  };
}

function cleanString(value) {
  const text = String(value ?? '').trim();
  return text || null;
}

function isOpen(value) {
  return String(value || '').trim().toLowerCase() === 'open';
}

function parseDateWindow(value, seasonal, mvumSymbol) {
  const text = String(value || '').trim();
  const match = text.match(/(\d{1,2})\/(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})/);
  if (match) {
    return {
      openStart: `${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`,
      openEnd: `${match[3].padStart(2, '0')}-${match[4].padStart(2, '0')}`,
      sourceDateText: text,
      dateSource: 'vehicle_datesopen',
    };
  }

  if (/year.?long/i.test(`${text} ${seasonal || ''} ${mvumSymbol || ''}`)) {
    return {
      openStart: '01-01',
      openEnd: '12-31',
      sourceDateText: text || 'yearlong',
      dateSource: text ? 'vehicle_datesopen' : 'mvum_symbol_inferred',
    };
  }

  if (/seasonal/i.test(`${seasonal || ''} ${mvumSymbol || ''}`)) {
    return {
      openStart: '05-21',
      openEnd: '11-22',
      sourceDateText: text || '05/21-11/22',
      dateSource: text ? 'vehicle_datesopen' : 'ehc_summer_mvum_sheet_inferred',
    };
  }

  return {
    openStart: null,
    openEnd: null,
    sourceDateText: text || null,
    dateSource: 'unknown',
  };
}

function stableSegmentId(props) {
  const global = cleanString(props.globalid);
  const road = cleanString(props.id || props.field_id || props.name || 'unknown');
  const bmp = props.bmp ?? 'na';
  const emp = props.emp ?? 'na';
  const stable = global || `${road}-${bmp}-${emp}`;
  return `usfs:${String(stable).replace(/[{}]/g, '').toLowerCase()}`;
}

function chooseVehicleClass(props) {
  if (isOpen(props.passengervehicle)) {
    return {
      vehicleClass: 'passenger',
      dateText: props.passengervehicle_datesopen,
    };
  }

  if (isOpen(props.highclearancevehicle)) {
    return {
      vehicleClass: 'high-clearance',
      dateText: props.highclearancevehicle_datesopen,
    };
  }

  return {
    vehicleClass: 'unknown',
    dateText: props.passengervehicle_datesopen || props.highclearancevehicle_datesopen,
  };
}

function normalizeFeature(feature) {
  const props = feature.properties || {};
  const vehicle = chooseVehicleClass(props);
  const dates = parseDateWindow(vehicle.dateText, props.seasonal, props.mvum_symbol_name);

  return {
    type: 'Feature',
    geometry: feature.geometry,
    properties: {
      segmentId: stableSegmentId(props),
      sourceAgency: 'USFS',
      forest: cleanString(props.forestname),
      district: cleanString(props.districtname),
      roadId: cleanString(props.id || props.field_id),
      roadName: cleanString(props.name),
      vehicleClass: vehicle.vehicleClass,
      passengerVehicle: cleanString(props.passengervehicle),
      passengerDatesOpen: cleanString(props.passengervehicle_datesopen),
      highClearanceVehicle: cleanString(props.highclearancevehicle),
      highClearanceDatesOpen: cleanString(props.highclearancevehicle_datesopen),
      openStart: dates.openStart,
      openEnd: dates.openEnd,
      mvumSymbol: cleanString(props.mvum_symbol_name),
      mvumSymbolCode: cleanString(props.symbol),
      seasonal: cleanString(props.seasonal),
      milepostStart: props.bmp ?? null,
      milepostEnd: props.emp ?? null,
      gisMiles: props.gis_miles ?? null,
      globalid: cleanString(props.globalid),
      sourceUrl: SERVICE_URL,
      sourceDateText: dates.sourceDateText,
      dateSource: dates.dateSource,
      sourceNote: 'Official USFS MVUM road geometry. Motorized access does not imply dispersed camping eligibility.',
    },
  };
}

function stableBlmSegmentId(props) {
  const global = cleanString(props.GLOBALID);
  const fallback = cleanString(props.OBJECTID || props.ROUTE_PRMRY_NM || 'unknown');
  return `blm:${String(global || fallback).replace(/[{}]/g, '').toLowerCase()}`;
}

function isBlmRouteCandidate(props) {
  const hasBlmAuthority = props.PLAN_ROUTE_DSGNTN_AUTH === 'BLM';
  const motorized = props.PLAN_MODE_TRNSPRT === 'Motorized' || /2wd|4wd|atv|utv|motorized/i.test(String(props.OBSRVE_ROUTE_USE_CLASS || ''));
  const notClosed = !['Closed'].includes(String(props.PLAN_OHV_ROUTE_DSGNTN || ''));
  const publicOrUnknownAccess = !['All', 'Admin Only', 'Authorized/Permitted User Only'].includes(String(props.PLAN_ACCESS_RSTRCT || ''));
  return hasBlmAuthority && motorized && notClosed && publicOrUnknownAccess;
}

function normalizeBlmFeature(feature) {
  const props = feature.properties || {};
  const candidate = isBlmRouteCandidate(props);

  return {
    type: 'Feature',
    geometry: feature.geometry,
    properties: {
      segmentId: stableBlmSegmentId(props),
      sourceAgency: 'BLM',
      forest: null,
      district: null,
      roadId: cleanString(props.OBJECTID),
      roadName: cleanString(props.ROUTE_PRMRY_NM),
      vehicleClass: /2wd|low/i.test(String(props.OBSRVE_ROUTE_USE_CLASS || '')) ? 'passenger' : 'high-clearance',
      openStart: candidate ? '01-01' : null,
      openEnd: candidate ? '12-31' : null,
      mvumSymbol: cleanString(props.PLAN_OHV_ROUTE_DSGNTN),
      seasonal: cleanString(props.PLAN_SEASON_RSTRCT_CODE),
      gisMiles: props.GIS_MILES ?? null,
      blmMiles: props.BLM_MILES ?? null,
      globalid: cleanString(props.GLOBALID),
      blmRouteAuthority: props.PLAN_ROUTE_DSGNTN_AUTH === 'BLM',
      assetClass: cleanString(props.PLAN_ASSET_CLASS),
      ohvDesignation: cleanString(props.PLAN_OHV_ROUTE_DSGNTN),
      accessRestriction: cleanString(props.PLAN_ACCESS_RSTRCT),
      observedUseClass: cleanString(props.OBSRVE_ROUTE_USE_CLASS),
      reviewStatus: candidate ? 'candidate' : 'rejected',
      campingStatus: candidate ? 'unknown' : 'prohibited',
      sourceUrl: BLM_SERVICE_URL,
      sourceDateText: cleanString(props.PLAN_SEASON_RSTRCT_CODE) || 'unknown',
      dateSource: 'blm_gtlf',
      sourceNote: 'BLM GTLF route candidate within the EHC map bounds. BLM route presence does not prove dispersed camping is allowed; verify local orders, travel management rules, closures, and fire restrictions.',
    },
  };
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function main() {
  ensureDirs();
  const [sourceData, blmSourceData] = await Promise.all([
    fetchMvumRoads(),
    fetchBlmRoads(),
  ]);
  const processedData = {
    type: 'FeatureCollection',
    name: 'Eagle-Holy Cross USFS MVUM normalized road segments',
    features: sourceData.features.map(normalizeFeature),
  };
  const blmProcessedData = {
    type: 'FeatureCollection',
    name: 'Eagle-Holy Cross BLM GTLF normalized road candidates',
    features: blmSourceData.features.map(normalizeBlmFeature).filter((feature) => feature.properties.reviewStatus !== 'rejected'),
  };

  const districts = [...new Set(sourceData.features.map((feature) => feature.properties?.districtname).filter(Boolean))].sort();
  const manifest = {
    sourceName: 'USFS EDW MVUM Roads',
    sourceUrl: SERVICE_URL,
    queryUrl: QUERY_URL,
    queryParameters: {
      where: WHERE,
      outFields: OUT_FIELDS,
      returnGeometry: true,
      outSR: 4326,
      outputFormat: 'geojson',
    },
    generatedAt: new Date().toISOString(),
    featureCount: sourceData.features.length,
    districtNames: districts,
    outputFiles: {
      sourceGeoJson: path.relative(rootDir, SOURCE_OUTPUT),
      processedGeoJson: path.relative(rootDir, PROCESSED_OUTPUT),
      blmSourceGeoJson: path.relative(rootDir, BLM_SOURCE_OUTPUT),
      blmProcessedGeoJson: path.relative(rootDir, BLM_PROCESSED_OUTPUT),
    },
    blmSource: {
      sourceName: 'BLM National GTLF',
      sourceUrl: BLM_SERVICE_URL,
      queryUrl: BLM_QUERY_URL,
      queryParameters: {
        where: BLM_WHERE,
        outFields: BLM_OUT_FIELDS,
        returnGeometry: true,
        outSR: 4326,
        geometry: EHC_BOUNDS,
        spatialRel: 'esriSpatialRelIntersects',
        outputFormat: 'geojson',
      },
      sourceFeatureCount: blmSourceData.features.length,
      candidateFeatureCount: blmProcessedData.features.length,
    },
    notes: [
      'Official USFS MVUM vector road data is the road-access backbone for the EHC pilot.',
      'The Eagle-Holy Cross MVUM map name is represented in this service by Eagle Ranger District and Holy Cross Ranger District records.',
      'When vehicle-specific date fields are blank, yearlong routes are inferred from the MVUM symbol and seasonal routes are assigned the local EHC summer MVUM sheet window of 05/21-11/22 for review.',
      'These road records do not, by themselves, prove dispersed camping is allowed along a route.',
      'Camping eligibility should be reviewed separately against the MVUM overlay, closure orders, land manager rules, and fire restrictions.',
      'BLM GTLF routes are included in the primary map layer only as conservative candidates when BLM has route designation authority and the route appears motorized and not closed.',
    ],
  };

  writeJson(SOURCE_OUTPUT, sourceData);
  writeJson(PROCESSED_OUTPUT, processedData);
  writeJson(BLM_SOURCE_OUTPUT, blmSourceData);
  writeJson(BLM_PROCESSED_OUTPUT, blmProcessedData);
  writeJson(MANIFEST_OUTPUT, manifest);

  console.log(`Fetched ${sourceData.features.length} USFS MVUM road feature(s).`);
  console.log(`Fetched ${blmSourceData.features.length} BLM GTLF road feature(s); kept ${blmProcessedData.features.length} candidate(s).`);
  console.log(`Wrote ${path.relative(rootDir, SOURCE_OUTPUT)}`);
  console.log(`Wrote ${path.relative(rootDir, PROCESSED_OUTPUT)}`);
  console.log(`Wrote ${path.relative(rootDir, BLM_SOURCE_OUTPUT)}`);
  console.log(`Wrote ${path.relative(rootDir, BLM_PROCESSED_OUTPUT)}`);
  console.log(`Wrote ${path.relative(rootDir, MANIFEST_OUTPUT)}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
