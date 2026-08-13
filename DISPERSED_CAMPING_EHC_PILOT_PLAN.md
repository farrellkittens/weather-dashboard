# Dispersed Camping Map: Eagle-Holy Cross Pilot Plan

## Purpose

Build the first dispersed-camping map pilot for the Weather Dashboard app using the Eagle-Holy Cross Ranger District area in Colorado. The long-term goal is an interactive map that helps identify likely dispersed camping access along legal motorized roads, starting with one small reviewed area and then expanding to all Colorado, Oregon, and other states.

The pilot should focus on accuracy, reviewability, and a clean data pipeline. The map is a planning aid, not a legal guarantee. Users must still verify current Motor Vehicle Use Maps, local closure orders, land manager rules, and fire restrictions before using any location.

## Current Project State

The project already has a dispersed camping page:

- `dispersed.html`
- `dispersed.css`
- `dispersed.js`

The current page uses Leaflet and already supports:

- A map view
- Draft dispersed-camping line loading
- Date filtering
- Review-status styling
- Popups
- GeoJSON, KML, and GPX export

The existing draft EHC data file currently contains no line features:

- `data/dispersed/eagle-holy-cross-east-draft.geojson`

The local EHC MVUM material is a georeferenced image overlay, not vector road data:

- `assets/dispersed/eagle-holy-cross-east/doc.kml`
- `assets/dispersed/eagle-holy-cross-east/files/*.jpg`

The checked-in `mvum-roads.geojson` is not Eagle-Holy Cross. It contains Rio Grande National Forest / Divide Ranger District road data and should not be treated as the EHC source.

## Important Source Findings

The official USFS MVUM vector service has usable Eagle-Holy Cross road data, but its district names are split:

- `Eagle Ranger District`
- `Holy Cross Ranger District`

The official combined EHC summer MVUM overlay uses the broader map name, but the vector service separates the districts.

The USFS service query for the pilot should use:

```sql
forestname = 'White River National Forest'
AND districtname IN ('Eagle Ranger District', 'Holy Cross Ranger District')
```

The USFS service includes official vehicle and open-date fields such as:

- `passengervehicle`
- `passengervehicle_datesopen`
- `highclearancevehicle`
- `highclearancevehicle_datesopen`
- `mvum_symbol_name`
- `seasonal`
- `bmp`
- `emp`
- `gis_miles`

For the pilot, the USFS road data should be treated as the official road-access backbone. It should not automatically be treated as proof that dispersed camping is allowed along every road.

## Primary Data Sources

### USFS MVUM Roads

Use the USDA Forest Service EDW MVUM service:

```txt
https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_MVUM_01/MapServer/1
```

Use this for official USFS motorized road geometry, vehicle class, district, road names, and open dates.

### Local EHC MVUM Overlay

Use the local EHC MVUM KML and images for manual review:

```txt
assets/dispersed/eagle-holy-cross-east/doc.kml
assets/dispersed/eagle-holy-cross-east/files/*.jpg
```

This source should help determine which roads or road portions correspond to dispersed camping corridors shown on the official MVUM.

### BLM Roads

Use BLM GTLF as a later data source, not the first pilot blocker:

```txt
https://gis.blm.gov/arcgis/rest/services/transportation/BLM_Natl_GTLF/MapServer/0
```

BLM road presence alone should not imply dispersed camping eligibility. BLM segments need their own review workflow and source notes.

### Fire Restrictions

The existing `camping.js` already checks fire restrictions using:

- USFS fire restriction ArcGIS layer
- Colorado county fire restriction resources
- Colorado DFPC links/KML logic

For the dispersed map, reuse this logic conceptually, but adapt it from point lookup to line or line-midpoint lookup.

## Milestone 1: Create A Reproducible EHC Source Extract

Create a script:

```txt
tools/fetch-dispersed-sources.js
```

The script should fetch official USFS MVUM road records for:

```sql
forestname = 'White River National Forest'
AND districtname IN ('Eagle Ranger District', 'Holy Cross Ranger District')
AND symbol IN ('1','2','3','4')
```

Keep these fields:

```txt
id
name
field_id
forestname
districtname
symbol
mvum_symbol_name
seasonal
passengervehicle
passengervehicle_datesopen
highclearancevehicle
highclearancevehicle_datesopen
bmp
emp
gis_miles
globalid
```

Output files:

```txt
data/dispersed/sources/ehc-usfs-mvum-roads.geojson
data/dispersed/sources/ehc-source-manifest.json
```

The manifest should include:

- Source URL
- Query parameters
- Generation date/time
- Feature count
- District names
- Notes about the official source and review limits

## Milestone 2: Normalize Road Schema

Create a processed road dataset:

```txt
data/dispersed/processed/ehc-road-segments.geojson
```

Each feature should expose stable app-facing properties:

```json
{
  "segmentId": "usfs:globalid-or-id-bmp-emp",
  "sourceAgency": "USFS",
  "forest": "White River National Forest",
  "district": "Holy Cross Ranger District",
  "roadId": "715.1",
  "roadName": "PEARL CREEK",
  "vehicleClass": "passenger",
  "openStart": "06-01",
  "openEnd": "11-15",
  "mvumSymbol": "Roads open to all Vehicles, Seasonal",
  "milepostStart": 0,
  "milepostEnd": 4.1,
  "sourceUrl": "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_MVUM_01/MapServer/1"
}
```

Normalization rules:

- Prefer `passengervehicle_datesopen` when `passengervehicle === 'open'`.
- Include high-clearance data, but make passenger-vehicle roads the default user-facing view.
- Parse date windows like `05/21-11/22` into `MM-DD`.
- Preserve raw source properties only when useful and file size remains reasonable.
- Do not assume a road is legal for dispersed camping just because it is open to motorized vehicles.

## Milestone 3: Create A Curated Camping Eligibility Layer

Create a curated camping-specific layer separate from the official road layer:

```txt
data/dispersed/curated/ehc-dispersed-camping-lines.geojson
```

Suggested feature properties:

```json
{
  "segmentId": "ehc-camp-0001",
  "sourceRoadSegmentIds": ["usfs:..."],
  "sourceAgency": "USFS",
  "dispersedCamping": true,
  "campingStatus": "allowed",
  "dispersedCampingTable": true,
  "mvumDottedCorridor": true,
  "reviewStatus": "needs-review",
  "reviewMethod": "manual-mvum-overlay",
  "reviewedBy": "",
  "reviewedAt": "",
  "openStart": "05-21",
  "openEnd": "11-22",
  "fireRestrictionStatus": "unknown",
  "notes": "Traced from 2025 Summer MVUM EHC East overlay; verify against PDF/KMZ."
}
```

Use these review statuses:

```txt
candidate
needs-review
verified
rejected
```

Use these camping statuses:

```txt
allowed
limited
prohibited
unknown
```

Only user-reviewed lines should become `verified`.

## Milestone 4: Manual Review Workflow

Because the local EHC MVUM is raster/image-based, the initial camping eligibility layer needs manual review.

Recommended workflow:

1. Load `ehc-road-segments.geojson` as muted road context.
2. Load the EHC MVUM image overlay as an optional review/reference overlay.
3. Compare official road geometry against the MVUM camping-corridor markings.
4. Select, split, or trace only road portions that are both listed in a Dispersed Camping Table and marked with dots along the side of the road.
5. Assign `campingStatus`, `reviewStatus`, and notes.
6. Export the curated results to `ehc-dispersed-camping-lines.geojson`.

If browser editing is too large for the first pilot, use QGIS:

1. Open the USFS road GeoJSON.
2. Add the EHC KML/KMZ image overlay.
3. Select or split road features that correspond to camping-allowed MVUM markings.
4. Export selected lines to the curated GeoJSON file.
5. Run validation before wiring it into the app.

## Milestone 5: Update The Dispersed Map UI

Update:

- `dispersed.html`
- `dispersed.css`
- `dispersed.js`

Add switchable base layers:

- Topo
- Satellite
- Hybrid

Leaflet can handle this with `L.control.layers(baseLayers, overlays)`.

Add overlays:

- Dispersed camping lines
- USFS MVUM road context
- MVUM image overlay for review
- Fire restriction layer or status overlay, when available
- Later: BLM route context

Add filters:

- Selected date
- Open on selected date
- Passenger roads only
- Verified only
- Include needs-review lines
- Fire status: no known restriction / restriction active / unknown
- Agency: USFS / BLM

Popup details should include:

- Road ID and road name
- Open dates
- Agency and district
- Camping review status
- Fire restriction status
- Source note
- Reminder to verify current MVUM, closure orders, and fire restrictions

## Milestone 6: Fire Restriction Integration

Adapt the existing camping-page fire restriction logic for line features.

For each visible line:

1. Compute a representative point or line midpoint.
2. Query USFS fire restrictions for that point.
3. Determine Colorado county status using county lookup or existing county KML logic.
4. Store the result in app memory for the current session.

Avoid baking current fire status into static GeoJSON unless creating a clearly timestamped daily snapshot.

Display fire status as a current check result, not as final legal advice.

## Milestone 7: Validation

Create:

```txt
tools/validate-dispersed-data.js
```

Validation checks:

- Valid GeoJSON.
- Every camping feature is `LineString` or `MultiLineString`.
- Every feature has `segmentId`.
- Every feature has valid `openStart` and `openEnd` values in `MM-DD` format.
- Every `verified` feature has `reviewedAt`.
- Every curated camping feature has at least one `sourceRoadSegmentIds` value.
- No `rejected` feature is marked as `campingStatus: allowed`.

Create a review report:

```txt
data/dispersed/reports/ehc-review-summary.json
```

Include counts by:

- Review status
- Camping status
- Road ID
- Season window
- Agency

## Milestone 8: First Review Build

The first reviewable build should include:

- Official USFS EHC road context.
- Curated camping layer, even if initially empty or candidate-only.
- Topo/Satellite/Hybrid base layer switching.
- Date filtering from official open dates.
- Review-status display.
- Exports still working.
- Clear source notes in the sidebar or footer.

At this point, the project owner should review the EHC map and decide which road segments are useful and accurate enough to mark as verified.

## Expansion Plan

After EHC is reviewed, expand in this order.

### Colorado USFS

- Parameterize forest and district queries.
- Add per-district or per-MVUM-sheet source manifests.
- Keep official road data separate from curated camping eligibility.
- Keep review reports per district or map sheet.

### Colorado BLM

- Ingest BLM GTLF roads by Colorado extent.
- Classify BLM routes conservatively.
- Only mark BLM camping eligibility where a source or order supports it.
- Add BLM-specific review fields if needed.

### Oregon

- Add Oregon fire restriction source adapters.
- Add Oregon USFS and BLM source manifests.
- Reuse the normalized road schema and curated camping schema.

### Other States

- Add source adapters per state or land manager.
- Add fire restriction adapters per state.
- Keep source manifests and review reports consistent.

## Recommended Next Agent Task

Start with Milestones 1 and 2 only:

> Create `tools/fetch-dispersed-sources.js` to fetch USFS Eagle + Holy Cross MVUM road records, normalize them into `data/dispersed/processed/ehc-road-segments.geojson`, add a source manifest, and wire the dispersed map to show those roads as a context overlay without changing the curated camping layer yet.

This keeps the first implementation small, reviewable, and useful.
