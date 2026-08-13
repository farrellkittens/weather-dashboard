const fs = require('fs');
const { execFile } = require('child_process');
const https = require('https');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const localPath = path.join(rootDir, 'mvum-roads.geojson');
const outputDir = path.join(rootDir, 'data', 'mvum');
const csvPath = path.join(outputDir, 'road-date-comparison.csv');
const jsonPath = path.join(outputDir, 'road-date-comparison.json');

const MVUM_ROADS_QUERY_URL = 'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_MVUM_01/MapServer/1/query';
const EDW_SOURCE_URL = 'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_MVUM_01/MapServer/1';

const OUT_FIELDS = [
  'id',
  'name',
  'field_id',
  'seasonal',
  'mvum_symbol_name',
  'passengervehicle',
  'passengervehicle_datesopen',
  'highclearancevehicle',
  'highclearancevehicle_datesopen',
  'truck',
  'truck_datesopen',
  'motorcycle',
  'motorcycle_datesopen',
  'symbol',
  'routestatus',
  'bmp',
  'emp',
  'gis_miles',
  'forestname',
  'districtname',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
    execFile('curl', ['-L', '-sS', url], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
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
    if (/certificate|ENOTFOUND|getaddrinfo/i.test(error.message)) {
      return getJsonWithCurl(url);
    }

    throw error;
  }
}

function unique(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null && value !== ''))];
}

function normalizeText(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeRoadId(value) {
  return normalizeText(value);
}

function sourceKey(record) {
  return [
    normalizeRoadId(record.id),
    normalizeText(record.seasonal),
    normalizeText(record.mvum_symbol_name),
  ].join('|');
}

function localKey(properties) {
  return [
    normalizeRoadId(properties.id || properties.field_id),
    normalizeText(properties.seasonal),
    normalizeText(properties.mvum_symbol_name),
  ].join('|');
}

function csvCell(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function attrs(feature) {
  return feature.attributes || feature.properties || {};
}

function compareFeature(feature, sourceByKey, sourceById) {
  const properties = feature.properties || {};
  const id = normalizeRoadId(properties.id || properties.field_id);
  const exactMatches = sourceByKey.get(localKey(properties)) || [];
  const idMatches = sourceById.get(id) || [];
  const candidates = exactMatches.length ? exactMatches : idMatches;
  const matchStatus = exactMatches.length
    ? 'matched_by_id_season_symbol'
    : idMatches.length
      ? 'matched_by_id_only'
      : 'no_source_match';

  const candidateAttrs = candidates.map(attrs);
  const sourceNames = unique(candidateAttrs.map((record) => record.name));
  const sourceSeasonal = unique(candidateAttrs.map((record) => record.seasonal));
  const sourceSymbols = unique(candidateAttrs.map((record) => record.mvum_symbol_name));
  const sourcePassengerDates = unique(candidateAttrs.map((record) => record.passengervehicle_datesopen));
  const sourceHighClearanceDates = unique(candidateAttrs.map((record) => record.highclearancevehicle_datesopen));
  const sourceMotorcycleDates = unique(candidateAttrs.map((record) => record.motorcycle_datesopen));
  const sourceMileposts = unique(candidateAttrs.map((record) => {
    if (record.bmp === null || record.bmp === undefined || record.emp === null || record.emp === undefined) {
      return null;
    }
    return `${record.bmp}-${record.emp}`;
  }));

  const dateComparison = properties.seasonal === 'yearlong' && sourcePassengerDates.includes('01/01-12/31')
    ? 'consistent_yearlong'
    : sourcePassengerDates.length
      ? 'source_has_dates_local_has_season_only'
      : 'source_missing_dates';

  return {
    local_id: properties.id || properties.field_id || '',
    local_name: properties.name || '',
    local_seasonal: properties.seasonal || '',
    local_mvum_symbol: properties.mvum_symbol_name || '',
    local_passenger_vehicle: properties.passengervehicle || '',
    local_high_clearance_vehicle: properties.highclearancevehicle || '',
    source_match_status: matchStatus,
    source_match_count: candidates.length,
    source_names: sourceNames.join('; '),
    source_seasonal: sourceSeasonal.join('; '),
    source_mvum_symbols: sourceSymbols.join('; '),
    source_passenger_dates_open: sourcePassengerDates.join('; '),
    source_high_clearance_dates_open: sourceHighClearanceDates.join('; '),
    source_motorcycle_dates_open: sourceMotorcycleDates.join('; '),
    source_milepost_ranges: sourceMileposts.join('; '),
    date_comparison: dateComparison,
    source_url: EDW_SOURCE_URL,
  };
}

async function fetchSourceRecords(localFeatures) {
  const localIds = unique(localFeatures.map((feature) => normalizeRoadId(feature.properties?.id || feature.properties?.field_id)));
  const quotedIds = localIds.map((id) => `'${id.replace(/'/g, "''")}'`).join(',');
  const where = [
    "forestname='Rio Grande National Forest'",
    "districtname='Divide Ranger District'",
    `id IN (${quotedIds})`,
  ].join(' AND ');

  const url = `${MVUM_ROADS_QUERY_URL}?${encodeParams({
    where,
    outFields: OUT_FIELDS.join(','),
    returnGeometry: 'false',
    f: 'json',
  })}`;

  const payload = await fetchJson(url);
  if (payload.error) {
    throw new Error(`USFS query failed: ${JSON.stringify(payload.error)}`);
  }

  return payload.features || [];
}

function buildIndexes(sourceFeatures) {
  const sourceByKey = new Map();
  const sourceById = new Map();

  for (const feature of sourceFeatures) {
    const record = attrs(feature);
    const key = sourceKey(record);
    const id = normalizeRoadId(record.id);

    if (!sourceByKey.has(key)) {
      sourceByKey.set(key, []);
    }
    sourceByKey.get(key).push(feature);

    if (!sourceById.has(id)) {
      sourceById.set(id, []);
    }
    sourceById.get(id).push(feature);
  }

  return { sourceByKey, sourceById };
}

function writeOutputs(rows, sourceFeatureCount) {
  fs.mkdirSync(outputDir, { recursive: true });

  const headers = Object.keys(rows[0] || {
    local_id: '',
    local_name: '',
    source_match_status: '',
  });

  const csv = [
    headers.map(csvCell).join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ].join('\n');

  fs.writeFileSync(csvPath, `${csv}\n`);
  fs.writeFileSync(jsonPath, JSON.stringify({
    generated_at: new Date().toISOString(),
    local_source: path.relative(rootDir, localPath),
    comparison_source: EDW_SOURCE_URL,
    source_feature_count: sourceFeatureCount,
    rows,
  }, null, 2));
}

async function main() {
  const local = readJson(localPath);
  const localFeatures = local.features || [];
  const sourceFeatures = await fetchSourceRecords(localFeatures);
  const { sourceByKey, sourceById } = buildIndexes(sourceFeatures);
  const rows = localFeatures.map((feature) => compareFeature(feature, sourceByKey, sourceById));

  writeOutputs(rows, sourceFeatures.length);

  const statusCounts = rows.reduce((counts, row) => {
    counts[row.source_match_status] = (counts[row.source_match_status] || 0) + 1;
    return counts;
  }, {});

  console.log(`Compared ${rows.length} local road segments against ${sourceFeatures.length} USFS EDW MVUM source records.`);
  console.log(`Wrote ${path.relative(rootDir, csvPath)}`);
  console.log(`Wrote ${path.relative(rootDir, jsonPath)}`);
  console.log(JSON.stringify(statusCounts, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
