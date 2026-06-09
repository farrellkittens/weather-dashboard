const CPW_BOATING = 'https://cpw.state.co.us/activities/boating';
const OREGON_BOATING = 'https://www.oregon.gov/osmb/boater-info/Pages/Required-Equipment.aspx';
const ODFW_FISHING = 'https://myodfw.com/fishing';
const USGS_GAUGE_URL = 'https://waterservices.usgs.gov/nwis/iv/';
const NWPS_GAUGE_URL = 'https://api.water.noaa.gov/nwps/v1/gauges/';
const RIVER_GAUGES = {
  'Boulder Creek Tubing Corridor': '06730200',
  'Cache la Poudre River - Filter Plant to Picnic Rock': '06752260',
  'Clear Creek - Golden Whitewater Park': '06719505',
  'Colorado River - Pumphouse to Radium': '09058000',
  'Colorado River - Rancho del Rio to State Bridge': '09060799',
  'Colorado River - Palisade to Grand Junction': '09106150',
  'Dolores River - Town of Dolores': '09166500',
  'Gunnison River - Gunnison Whitewater Park': '09114500',
  'North Platte River - Northgate Canyon': '06620000',
  'San Juan River - Pagosa Springs': '09342500',
  'South Platte River - Deckers': '06701900',
  'South Platte River - Denver Urban Run': '06711565',
  'St. Vrain Creek - Lyons': '06730525',
  'Yampa River - Steamboat Springs': '09239500',
  'Deschutes River - Downtown Bend Float': {
    provider: 'nwps',
    id: 'BENO3',
    siteName: 'Deschutes River at Benham Falls (BENO3)',
    sourceLabel: 'NOAA NWPS BENO3 gauge',
    sourceUrl: 'https://water.noaa.gov/gauges/beno3',
    context: 'Upstream active mainstem proxy for the Farewell Bend to Drake Park float',
  },
  'Clackamas River - Barton to Carver': '14211010',
  'Sandy River - Dabney to Lewis and Clark': '14142500',
  'Tualatin River Water Trail - Tualatin': '14207500',
};
const RIVER_FLOW_INFO_SOURCES = {
  'Deschutes River - Downtown Bend Float': [
    ['Bend Whitewater Park conditions', 'https://www.bendparksandrec.org/facility/bend-whitewater-park/#current-conditions'],
    ['American Whitewater City of Bend reach', 'https://www.americanwhitewater.org/content/River/view/river-detail/11052/main'],
    ['NOAA downstream Bend gauge (DEBO3)', 'https://water.noaa.gov/gauges/debo3'],
    ['USBR Hydromet Deschutes stations', 'https://www.usbr.gov/pn/hydromet/destea.html'],
  ],
};
// Only activity-specific ranges supported by a linked local authority or flow study.
// Missing activities intentionally render as "No verified range."
const RIVER_ACTIVITY_GUIDANCE = {
  'Clear Creek - Golden Whitewater Park': {
    tube: {
      great: [[200, 499]], okay: [[150, 199], [500, 599]], bad: [[0, 149], [600, Infinity]],
      note: '500–599 CFS: adults 18+ only. Creek closed to tubing at 600+ CFS.',
      sources: [
        ['Golden River Sports rules', 'https://www.goldenriversports.net/golden-river-sports-tubing-rip-boarding'],
        ['American Whitewater', 'https://www.americanwhitewater.org/content/River/view/river-detail/11179/main'],
      ],
    },
  },
  'Gunnison River - Gunnison Whitewater Park': {
    kayak: {
      great: [[900, 5000]], okay: [[600, 899]], bad: [[0, 599], [5001, Infinity]],
      note: 'American Whitewater flow study: 600–5,000 acceptable; 900–5,000 optimal.',
      sources: [['American Whitewater flow study', 'https://www.americanwhitewater.org/content/River/view/river-detail/10691/main']],
    },
  },
  'San Juan River - Pagosa Springs': {
    tube: {
      great: [[90, 150]], okay: [[30, 89], [151, 400]], bad: [[0, 29], [401, Infinity]],
      note: '150–250 is high; 250–400 is very high. Tubing is recommended only under 400 CFS.',
      sources: [['Pagosa Springs river-use guide', 'https://visitpagosasprings.com/riverusage']],
    },
  },
  'St. Vrain Creek - Lyons': {
    tube: {
      great: [[100, 300]], okay: [[40, 99], [301, 450]], bad: [[0, 39], [451, Infinity]],
      note: 'Tubing is not allowed above 450 CFS; current town flag status can override this rating.',
      sources: [
        ['Town of Lyons rules', 'https://lyonscolorado.com/794/QuickLinks'],
        ['Local outfitter flow guide', 'https://skiboulder.com/pages/cfs-data/st-vrain'],
      ],
    },
  },
  'Yampa River - Steamboat Springs': {
    kayak: {
      great: [[1500, 2700]], okay: [[700, 1499], [2701, 5000]], bad: [[0, 699], [5001, Infinity]],
      note: 'American Whitewater study: 700–5,000 acceptable; 1,500–2,700 optimal.',
      sources: [['American Whitewater flow study', 'https://www.americanwhitewater.org/content/River/show-gauge-info/?reachid=435']],
    },
  },
};
const SPOTS = [
  // Established tubing and gentle river-float corridors
  ['Boulder Creek Tubing Corridor', 'River Tubing / Floating', 40.015, -105.285, 'tube', 'Boulder', 'Use only when the city has not closed the creek; high runoff is dangerous.', 'https://bouldercolorado.gov/services/boulder-creek'],
  ['Cache la Poudre River - Filter Plant to Picnic Rock', 'River Tubing / Floating', 40.671, -105.223, 'tube', 'Fort Collins', 'Flow-dependent whitewater run; know hazards and take-out before launching.', 'https://www.poudrewatershed.org/river-access'],
  ['Clear Creek - Golden Whitewater Park', 'River Tubing / Floating', 39.756, -105.225, 'tube', 'Golden', 'Seasonal restrictions and closures are common during high water.', 'https://www.cityofgolden.net/play/recreation-attractions/clear-creek/'],
  ['Colorado River - Pumphouse to Radium', 'River Tubing / Floating', 39.988, -106.510, 'tube', 'Kremmling', 'Remote river float with rapids; use an appropriate craft and check flows.', 'https://www.blm.gov/visit/upper-colorado-river-special-recreation-management-area'],
  ['Colorado River - Rancho del Rio to State Bridge', 'River Tubing / Floating', 39.925, -106.725, 'tube', 'Bond', 'Flow-dependent river float; arrange a take-out and check local hazards.', 'https://www.blm.gov/visit/upper-colorado-river-special-recreation-management-area'],
  ['Colorado River - Palisade to Grand Junction', 'River Tubing / Floating', 39.113, -108.350, 'tube', 'Palisade', 'Long float; check flows, diversion structures, weather, and take-out access.', 'https://www.blm.gov/visit/colorado-river'],
  ['Dolores River - Town of Dolores', 'River Tubing / Floating', 37.473, -108.504, 'tube', 'Dolores', 'Only suitable at some flows; identify hazards and take-out first.', 'https://www.townofdolores.com/'],
  ['Gunnison River - Gunnison Whitewater Park', 'River Tubing / Floating', 38.529, -106.946, 'tube', 'Gunnison', 'Whitewater features and cold runoff; flow-dependent.', 'https://www.gunnisonco.gov/'],
  ['North Platte River - Northgate Canyon', 'River Tubing / Floating', 40.891, -106.316, 'tube', 'Walden', 'Remote whitewater, not a casual tube float; expert planning required.', 'https://cpw.state.co.us/state-parks/north-sand-hills'],
  ['San Juan River - Pagosa Springs', 'River Tubing / Floating', 37.267, -107.010, 'tube', 'Pagosa Springs', 'Popular town float; check town advisories and river flow.', 'https://pagosaoutside.com/river-conditions/'],
  ['South Platte River - Deckers', 'River Tubing / Floating', 39.255, -105.226, 'tube', 'Deckers', 'Flow-dependent with rocks, cold water, and fishing traffic; choose access carefully.', 'https://www.fs.usda.gov/recarea/psicc/recarea/?recid=12920'],
  ['South Platte River - Denver Urban Run', 'River Tubing / Floating', 39.753, -105.010, 'tube', 'Denver', 'Use designated access; avoid dams and check water quality and flow.', 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Parks-Recreation'],
  ['St. Vrain Creek - Lyons', 'River Tubing / Floating', 40.224, -105.270, 'tube', 'Lyons', 'Check town closures and flows; avoid high runoff.', 'https://www.townoflyons.com/'],
  ['Yampa River - Steamboat Springs', 'River Tubing / Floating', 40.486, -106.831, 'tube', 'Steamboat Springs', 'Commercial tubing and private floating are flow-dependent; closures occur.', 'https://steamboatsprings.net/1319/Yampa-River-Management'],

  // Front Range and Denver metro
  ['Bear Creek Lake Park', 'Front Range / Denver', 39.652, -105.153, 'paddle', 'Lakewood', 'Permit/entry fee may apply; launch only in designated areas.', 'https://www.lakewood.org/Government/Departments/Community-Resources/Parks-Forestry-and-Open-Space/Bear-Creek-Lake-Park'],
  ['Big Soda Lake', 'Front Range / Denver', 39.648, -105.169, 'paddle', 'Lakewood', 'Paddlecraft are seasonal; check park hours, fees, and current water-contact rules.', 'https://www.lakewood.org/Government/Departments/Community-Resources/Parks-Forestry-and-Open-Space/Bear-Creek-Lake-Park'],
  ['Boulder Reservoir', 'Front Range / Denver', 40.071, -105.219, 'paddle', 'Boulder', 'Entry and watercraft permits apply; seasonal access.', 'https://bouldercolorado.gov/locations/boulder-reservoir'],
  ['Chatfield Reservoir', 'Front Range / Denver', 39.536, -105.070, 'paddle', 'Littleton', 'State park pass required; use designated launches and check ANS rules.', 'https://cpw.state.co.us/state-parks/chatfield-state-park'],
  ['Cherry Creek Reservoir', 'Front Range / Denver', 39.650, -104.856, 'paddle', 'Aurora', 'State park pass required; busy motorized water.', 'https://cpw.state.co.us/state-parks/cherry-creek-state-park'],
  ['Clear Lake', 'Front Range / Denver', 39.667022055987886, -105.70121797709409, 'paddle', 'Idaho Springs', 'High-elevation lake; verify seasonal road access and local launch rules.', CPW_BOATING],
  ['Evergreen Lake', 'Front Range / Denver', 39.631, -105.321, 'paddle', 'Evergreen', 'Seasonal boating and launch fees; rentals commonly available.', 'https://www.evergreenrecreation.com/224/Boating'],
  ['Gross Reservoir', 'Front Range / Denver', 39.953, -105.369, 'paddle', 'Boulder County', 'Hand-launched craft only; construction and shoreline closures can affect access.', 'https://www.denverwater.org/recreation/gross-resevoir'],
  ['Horsetooth Reservoir', 'Front Range / Denver', 40.552, -105.171, 'paddle', 'Fort Collins', 'County entrance and vessel rules apply; afternoon wind can be severe.', 'https://www.larimer.gov/naturalresources/parks/horsetooth-reservoir'],
  ['McIntosh Lake', 'Front Range / Denver', 40.183, -105.126, 'paddle', 'Longmont', 'Non-motorized boating; verify city launch and water-contact rules.', 'https://longmontcolorado.gov/parks-and-natural-resources/parks-and-trails/mcintosh-lake/'],
  ['Sloan’s Lake', 'Front Range / Denver', 39.748, -105.048, 'paddle', 'Denver', 'A Denver boating permit and current inspection requirements may apply.', 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Parks-Recreation'],
  ['Standley Lake', 'Front Range / Denver', 39.865, -105.119, 'paddle', 'Westminster', 'Seasonal paddling permit and inspection rules apply; body-contact restrictions are strict.', 'https://www.westminsterco.gov/StandleyLakeRegionalPark'],
  ['Union Reservoir', 'Front Range / Denver', 40.174, -105.041, 'paddle', 'Longmont', 'Daily entrance and vessel fees; check seasonal hours.', 'https://longmontcolorado.gov/parks-and-natural-resources/parks-and-trails/union-reservoir/'],
  ['Wellington Reservoir', 'Front Range / Denver', 40.694, -105.046, 'paddle', 'Wellington', 'Private recreation area; reservation or fee may be required.', 'https://wellingtonlake.com/'],

  // Northern and eastern Colorado
  ['Barr Lake', 'Northern / Eastern Colorado', 39.951, -104.749, 'paddle', 'Brighton', 'Hand-propelled craft only; wildlife closures may apply.', 'https://cpw.state.co.us/state-parks/barr-lake-state-park'],
  ['Boyd Lake', 'Northern / Eastern Colorado', 40.440, -105.043, 'paddle', 'Loveland', 'State park pass required; active motorized boating lake.', 'https://cpw.state.co.us/state-parks/boyd-lake-state-park'],
  ['Carter Lake', 'Northern / Eastern Colorado', 40.326, -105.218, 'paddle', 'Loveland', 'County entrance permit; busy motorized water and changing wind.', 'https://www.larimer.gov/naturalresources/parks/carter-lake'],
  ['Jackson Lake', 'Northern / Eastern Colorado', 40.437, -104.095, 'paddle', 'Orchard', 'State park pass and seasonal boating rules apply.', 'https://cpw.state.co.us/state-parks/jackson-lake-state-park'],
  ['John Martin Reservoir', 'Northern / Eastern Colorado', 38.066, -102.928, 'paddle', 'Hasty', 'Large, exposed reservoir; check wind and current water level.', 'https://cpw.state.co.us/state-parks/john-martin-reservoir-state-park'],
  ['North Sterling Reservoir', 'Northern / Eastern Colorado', 40.782, -103.269, 'paddle', 'Sterling', 'State park pass and seasonal boating rules apply.', 'https://cpw.state.co.us/state-parks/north-sterling-state-park'],
  ['Prewitt Reservoir', 'Northern / Eastern Colorado', 40.414, -103.362, 'paddle', 'Merino', 'SWA access rules and a valid hunting or fishing license may apply.', CPW_BOATING],
  ['St. Vrain State Park Ponds', 'Northern / Eastern Colorado', 40.159, -104.985, 'paddle', 'Firestone', 'Check which ponds currently allow hand-launched craft.', 'https://cpw.state.co.us/state-parks/st-vrain-state-park'],

  // Central mountains and South Park
  ['Dillon Reservoir', 'Central Mountains', 39.611, -106.061, 'paddle', 'Dillon / Frisco', 'Cold water, strong wind, and marina launch rules; check Dillon or Frisco marina.', 'https://www.townofdillon.com/marina'],
  ['Eleven Mile Reservoir', 'Central Mountains', 38.938, -105.514, 'paddle', 'Lake George', 'State park pass required; very exposed to wind and cold.', 'https://cpw.state.co.us/state-parks/eleven-mile-state-park'],
  ['Georgetown Lake', 'Central Mountains', 39.725, -105.697, 'paddle', 'Georgetown', 'Verify town rules and seasonal access before launching.', CPW_BOATING],
  ['Green Mountain Reservoir', 'Central Mountains', 39.884, -106.329, 'paddle', 'Heeney', 'Large reservoir with motorboats; water levels and access vary.', 'https://www.usbr.gov/gp/recreation/green_mountain.html'],
  ['Lake Granby', 'Central Mountains', 40.181, -105.879, 'paddle', 'Granby', 'Large, cold, windy reservoir; launch at established access points.', 'https://www.fs.usda.gov/recarea/arp/recarea/?recid=28512'],
  ['Shadow Mountain Lake', 'Central Mountains', 40.205, -105.842, 'paddle', 'Grand Lake', 'Motorized boating and cold water; use established launches.', CPW_BOATING],
  ['Grand Lake', 'Central Mountains', 40.244, -105.815, 'paddle', 'Grand Lake', 'Motorized boating and rapidly changing mountain weather.', 'https://www.townofgrandlake.com/'],
  ['Lake Estes', 'Central Mountains', 40.374, -105.488, 'paddle', 'Estes Park', 'Seasonal marina/launch rules and cold water.', 'https://evrpd.colorado.gov/lake-estes-marina'],
  ['Twin Lakes Reservoir', 'Central Mountains', 39.083, -106.351, 'paddle', 'Twin Lakes', 'Very cold and exposed; afternoon winds are common.', 'https://www.fs.usda.gov/recarea/psicc/recarea/?recid=12448'],
  ['Turquoise Lake', 'Central Mountains', 39.264, -106.372, 'paddle', 'Leadville', 'High-elevation cold water; use designated access points.', 'https://www.fs.usda.gov/recarea/psicc/recarea/?recid=12446'],
  ['Taylor Park Reservoir', 'Central Mountains', 38.818, -106.606, 'paddle', 'Almont', 'Motorized and non-motorized boating; cold and exposed.', 'https://cpw.state.co.us/body-of-water/taylor-park-reservoir'],

  // Western slope and northwest
  ['Blue Mesa Reservoir', 'Western Slope / Northwest', 38.465, -107.167, 'paddle', 'Gunnison', 'Huge, cold reservoir with cliffs and strong wind; check NPS closures.', 'https://www.nps.gov/cure/planyourvisit/boating.htm'],
  ['Crawford Reservoir', 'Western Slope / Northwest', 38.703, -107.609, 'paddle', 'Crawford', 'State park pass and boating rules apply.', 'https://cpw.state.co.us/state-parks/crawford-state-park'],
  ['Elkhead Reservoir', 'Western Slope / Northwest', 40.574, -107.432, 'paddle', 'Craig', 'State park pass and seasonal boating rules apply.', 'https://cpw.state.co.us/state-parks/elkhead-reservoir-state-park'],
  ['Harvey Gap Reservoir', 'Western Slope / Northwest', 39.605, -107.621, 'paddle', 'Silt', 'State park pass; verify current boating and water-contact rules.', 'https://cpw.state.co.us/state-parks/harvey-gap-state-park'],
  ['Highline Lake', 'Western Slope / Northwest', 39.271, -108.838, 'paddle', 'Loma', 'Check current zebra-mussel controls, inspections, and launch restrictions.', 'https://cpw.state.co.us/state-parks/highline-lake-state-park'],
  ['Mack Mesa Lake', 'Western Slope / Northwest', 39.277, -108.833, 'paddle', 'Loma', 'Open to paddleboards and kayaks; check current park notices.', 'https://cpw.state.co.us/state-parks/highline-lake-state-park'],
  ['James M. Robb State Park Ponds', 'Western Slope / Northwest', 39.098, -108.691, 'paddle', 'Fruita / Grand Junction', 'Paddleboarding is allowed on selected ponds; verify the specific section.', 'https://cpw.state.co.us/state-parks/james-m-robb-colorado-river-state-park'],
  ['Pearl Lake', 'Western Slope / Northwest', 40.784, -106.898, 'paddle', 'Clark', 'Wakeless boating only; state park pass and seasonal access.', 'https://cpw.state.co.us/state-parks/pearl-lake-state-park'],
  ['Rifle Gap Reservoir', 'Western Slope / Northwest', 39.627, -107.762, 'paddle', 'Rifle', 'State park pass; active motorized boating.', 'https://cpw.state.co.us/state-parks/rifle-gap-state-park'],
  ['Stagecoach Reservoir', 'Western Slope / Northwest', 40.280, -106.829, 'paddle', 'Oak Creek', 'State park pass; wakeless areas are available.', 'https://cpw.state.co.us/state-parks/stagecoach-state-park'],
  ['Steamboat Lake', 'Western Slope / Northwest', 40.788, -106.962, 'paddle', 'Clark', 'Cold mountain lake; wakeless boating only.', 'https://cpw.state.co.us/state-parks/steamboat-lake-state-park'],
  ['Vega Reservoir', 'Western Slope / Northwest', 39.226, -107.816, 'paddle', 'Collbran', 'State park pass; launch hours and inspections are seasonal.', 'https://cpw.state.co.us/state-parks/vega-state-park'],

  // Southern and southwest Colorado
  ['Lake Pueblo', 'Southern / Southwest Colorado', 38.275, -104.730, 'paddle', 'Pueblo', 'Large, busy motorized reservoir; state park pass required.', 'https://cpw.state.co.us/state-parks/lake-pueblo-state-park'],
  ['Lathrop State Park Lakes', 'Southern / Southwest Colorado', 37.600, -104.837, 'paddle', 'Walsenburg', 'Check which lake and zones allow your activity.', 'https://cpw.state.co.us/state-parks/lathrop-state-park'],
  ['Navajo Reservoir', 'Southern / Southwest Colorado', 37.008, -107.407, 'paddle', 'Arboles', 'Large, remote reservoir; check state park and New Mexico boundary rules.', 'https://cpw.state.co.us/state-parks/navajo-state-park'],
  ['Ridgway Reservoir', 'Southern / Southwest Colorado', 38.232, -107.738, 'paddle', 'Ridgway', 'State park pass; use designated launch and recreation areas.', 'https://cpw.state.co.us/state-parks/ridgway-state-park'],
  ['Trinidad Lake', 'Southern / Southwest Colorado', 37.146, -104.557, 'paddle', 'Trinidad', 'State park pass and boating rules apply.', 'https://cpw.state.co.us/state-parks/trinidad-lake-state-park'],
  ['Vallecito Reservoir', 'Southern / Southwest Colorado', 37.388, -107.575, 'paddle', 'Bayfield', 'Large, cold reservoir; check marina/forest access and wind.', 'https://www.fs.usda.gov/recarea/sanjuan/recarea/?recid=43056'],

  // Oregon - Bend and Portland-area river access
  ['Deschutes River - Downtown Bend Float', 'Oregon - Bend / Central Oregon', 44.044, -121.315, 'tube', 'Bend', 'Classic downtown Bend float from Riverbend/Farewell Bend toward Drake Park via Bend Whitewater Park; use Park & Float or the shuttle and follow posted channel signs.', 'https://www.bendparksandrec.org/float/'],
  ['Clackamas River - Barton to Carver', 'Oregon - Portland Area', 45.380, -122.377, 'tube', 'Boring / Oregon City', 'Popular Portland-area river float corridor; mountain-fed water, rapids, strainers, and changing flows make take-out planning essential.', 'https://portlandgeneral.com/about/parks-campgrounds/clackamas-river-access-sites'],
  ['Sandy River - Dabney to Lewis and Clark', 'Oregon - Portland Area', 45.539, -122.217, 'tube', 'Troutdale', 'Popular warm-weather float and fishing river near Portland; verify park access, hazards, and water level before launching.', 'https://www.travelportland.com/culture/fishing-near-portland/'],
  ['Tualatin River Water Trail - Tualatin', 'Oregon - Portland Area', 45.380, -122.765, 'paddle', 'Tualatin', 'Gentler Portland-area paddle and float option with access at Brown’s Ferry, Tualatin Community, Jurgens, and nearby launches.', 'https://www.tualatinoregon.gov/recreation/tualatin-river-water-trail'],
  ['Willamette River - Sellwood Riverfront Park', 'Oregon - Portland Area', 45.464, -122.661, 'paddle', 'Portland', 'Popular Portland riverfront access for hand-launched craft, swimming, and bank time; check weekly summer water-quality results before getting in.', 'https://www.portland.gov/parks/guide-swimming-portland-rivers'],
  ['Willamette River - Cathedral Park', 'Oregon - Portland Area', 45.588, -122.757, 'fish', 'Portland', 'Iconic St. Johns Bridge access with a boat ramp, dock, beach, and permitted fishing areas; check Willamette water quality and dock rules.', 'https://www.portland.gov/parks/fishing-portland-parks'],
  ['Willamette Park Boat Ramp', 'Oregon - Portland Area', 45.478, -122.669, 'fish', 'Portland', 'Central Portland launch and fishing access on the Willamette; pay attention to ramp traffic, dock limits, and current river conditions.', 'https://www.portland.gov/parks/docks'],
  ['Clackamette Park', 'Oregon - Portland Area', 45.364, -122.607, 'fish', 'Oregon City', 'Popular bank and boat access near the Clackamas-Willamette confluence; check ODFW seasons, license rules, and river levels.', 'https://www.dfw.state.or.us/resources/fishing/where_how/docs/50_in_60_flyer.pdf'],
  ['St. Louis Ponds', 'Oregon - Portland Area', 45.140, -122.973, 'fish', 'Gervais', 'Well-known family-friendly pond fishery south of Portland; verify open ponds, youth/disabled angler areas, and ODFW regulations.', 'https://www.dfw.state.or.us/resources/fishing/where_how/docs/50_in_60_flyer.pdf'],
];

const spots = SPOTS.map(([name, region, lat, lon, activity, town, note, url]) => ({ name, region, lat, lon, activity, town, note, url }));
const locationSelect = document.getElementById('water-location');
const locationMenu = document.getElementById('water-location-menu');
const activityFilter = document.getElementById('activity-filter');
const statusEl = document.getElementById('forecast-status');
const gridEl = document.getElementById('forecast-grid');
const riverSection = document.getElementById('river-section');
const riverStatusEl = document.getElementById('river-status');
const riverActivitiesEl = document.getElementById('river-activities');
const riverSummaryEl = document.getElementById('river-summary');
const riverChartEl = document.getElementById('river-chart');

function regionLabel(region) {
  if (region === 'River Tubing / Floating' || region.startsWith('Oregon')) return region;
  return `${region} - Lakes / Reservoirs`;
}

function stateLabel(spot) {
  return spot.region.startsWith('Oregon') ? 'Oregon' : 'Colorado';
}

function firstSpotOption() {
  return [...locationSelect.options].find(option => !option.disabled);
}

function spotOptionLabel(spot) {
  return `${spot.name} - ${spot.town}`;
}

function renderOptions() {
  const previous = locationSelect.value;
  const filter = activityFilter.value;
  const visible = spots.filter(spot => filter === 'all' || spot.activity === filter);
  locationSelect.innerHTML = visible
    .map(spot => `<option value="${spots.indexOf(spot)}">${spotOptionLabel(spot)}</option>`).join('');
  if ([...locationSelect.options].some(option => option.value === previous)) locationSelect.value = previous;
  else if (firstSpotOption()) locationSelect.value = firstSpotOption().value;
  renderLocationMenu(visible);
  renderPlace();
}

function renderLocationMenu(visible) {
  const selected = selectedSpot();
  const states = [...new Set(visible.map(stateLabel))];
  const groups = states.map(state => {
    const stateSpots = visible.filter(spot => stateLabel(spot) === state);
    const regions = [...new Set(stateSpots.map(spot => spot.region))];
    const regionGroups = regions.map(region => {
      const options = stateSpots.filter(spot => spot.region === region).map(spot => {
        const index = spots.indexOf(spot);
        const activeClass = spot === selected ? ' active' : '';
        return `<button type="button" class="location-option${activeClass}" data-location-index="${index}">${spotOptionLabel(spot)}</button>`;
      }).join('');
      return `<div class="location-region-subheader">${regionLabel(region)}</div>${options}`;
    }).join('');
    return `<div class="location-state-header">${state}</div>${regionGroups}`;
  }).join('');
  locationMenu.innerHTML = `
    <button type="button" class="location-menu-button" aria-haspopup="listbox" aria-expanded="false">${spotOptionLabel(selected)}</button>
    <div class="location-menu-list" role="listbox">${groups}</div>`;
}

function selectedSpot() {
  return spots[Number(locationSelect.value)] || spots[0];
}

function renderPlace() {
  const spot = selectedSpot();
  const activityLabels = { fish: 'Fishing', paddle: 'Paddleboard', tube: 'Tube float' };
  const activityLabel = activityLabels[spot.activity] || 'Water access';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lon}`;
  const isOregon = spot.region.startsWith('Oregon');
  const rulesUrl = spot.activity === 'fish' ? ODFW_FISHING : isOregon ? OREGON_BOATING : CPW_BOATING;
  const rulesLabel = spot.activity === 'fish' ? 'Fishing rules' : isOregon ? 'Oregon boating rules' : 'Colorado boating rules';
  document.getElementById('place-card').innerHTML = `
    <div class="place-top">
      <div><div class="place-kicker">${regionLabel(spot.region)} · ${spot.town}</div><h1>${spot.name}</h1></div>
      <div class="badges"><span class="badge ${spot.activity}">${activityLabel}</span></div>
    </div>
    <div class="place-note">${spot.note}</div>
    <div class="place-links">
      <a href="${spot.url}" target="_blank" rel="noopener">Check official information</a>
      <a href="${mapsUrl}" target="_blank" rel="noopener">Open map</a>
      <a href="${rulesUrl}" target="_blank" rel="noopener">${rulesLabel}</a>
    </div>`;
}

async function loadConditions() {
  const spot = selectedSpot();
  renderPlace();
  loadRiverGauge(spot);
  statusEl.textContent = 'Loading weather...';
  gridEl.innerHTML = '';
  const params = new URLSearchParams({
    latitude: spot.lat,
    longitude: spot.lon,
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto',
    forecast_days: '7',
  });
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error(`Weather request failed (${response.status})`);
    const data = await response.json();
    renderForecast(data.daily);
    statusEl.textContent = `${spot.town} · Weather forecast, not water or flow conditions`;
  } catch (error) {
    statusEl.textContent = error.message;
  }
}

async function loadRiverGauge(spot) {
  const gauge = riverGaugeFor(spot.name);
  riverSection.hidden = !gauge;
  riverActivitiesEl.innerHTML = '';
  riverSummaryEl.innerHTML = '';
  riverChartEl.innerHTML = '';
  if (!gauge) return;

  riverStatusEl.textContent = 'Loading river gauge data...';
  riverActivitiesEl.innerHTML = renderRiverActivities(RIVER_ACTIVITY_GUIDANCE[spot.name]);
  try {
    const series = gauge.provider === 'nwps' ? await fetchNwpsGauge(gauge) : await fetchUsgsGauge(gauge);
    renderRiverGauge(series, gauge, spot.name);
  } catch (error) {
    riverStatusEl.textContent = error.message;
    riverChartEl.innerHTML = '<div class="chart-empty">Current gauge readings are unavailable. Check the linked official information before launching.</div>';
  }
}

function riverGaugeFor(riverName) {
  const gauge = RIVER_GAUGES[riverName];
  if (!gauge) return null;
  if (typeof gauge === 'string') {
    return {
      provider: 'usgs',
      site: gauge,
      sourceLabel: 'USGS gauge',
      sourceUrl: `https://waterdata.usgs.gov/monitoring-location/${gauge}/`,
    };
  }
  return gauge;
}

async function fetchUsgsGauge(gauge) {
  const params = new URLSearchParams({
    format: 'json',
    sites: gauge.site,
    period: 'P7D',
    parameterCd: '00060,00065',
    siteStatus: 'all',
  });
  const response = await fetch(`${USGS_GAUGE_URL}?${params}`);
  if (!response.ok) throw new Error(`Gauge request failed (${response.status})`);
  const data = await response.json();
  return parseGaugeSeries(data.value?.timeSeries || []);
}

async function fetchNwpsGauge(gauge) {
  const response = await fetch(`${NWPS_GAUGE_URL}${gauge.id}/stageflow`);
  if (!response.ok) throw new Error(`Gauge request failed (${response.status})`);
  const data = await response.json();
  return limitGaugeSeriesToDays(parseNwpsStageFlow(data, gauge), 7);
}

function parseGaugeSeries(timeSeries) {
  const parsed = { flow: [], height: [], siteName: '' };
  timeSeries.forEach(series => {
    const code = series.variable?.variableCode?.[0]?.value;
    const target = code === '00060' ? 'flow' : code === '00065' ? 'height' : null;
    if (!target) return;
    parsed.siteName ||= series.sourceInfo?.siteName || '';
    parsed[target] = (series.values?.[0]?.value || [])
      .map(reading => ({ time: new Date(reading.dateTime), value: Number(reading.value) }))
      .filter(reading => Number.isFinite(reading.value) && reading.value > -999);
  });
  return parsed;
}

function parseNwpsStageFlow(data, gauge) {
  const observed = data.observed || {};
  const readings = observed.data || [];
  const flowMultiplier = observed.secondaryUnits === 'kcfs' ? 1000 : 1;
  return {
    siteName: gauge.siteName || `NOAA NWPS gauge ${gauge.id}`,
    flow: readings
      .map(reading => ({ time: new Date(reading.validTime), value: Number(reading.secondary) * flowMultiplier }))
      .filter(reading => Number.isFinite(reading.value) && Number.isFinite(reading.time.getTime())),
    height: readings
      .map(reading => ({ time: new Date(reading.validTime), value: Number(reading.primary) }))
      .filter(reading => Number.isFinite(reading.value) && Number.isFinite(reading.time.getTime())),
  };
}

function limitGaugeSeriesToDays(series, days) {
  const latest = [...series.flow, ...series.height].reduce((max, reading) => Math.max(max, reading.time.getTime()), 0);
  if (!latest) return series;
  const cutoff = latest - days * 24 * 60 * 60 * 1000;
  return {
    ...series,
    flow: series.flow.filter(reading => reading.time.getTime() >= cutoff),
    height: series.height.filter(reading => reading.time.getTime() >= cutoff),
  };
}

function renderRiverGauge(series, gauge, riverName) {
  const flowNow = series.flow.at(-1);
  const heightNow = series.height.at(-1);
  const flowPeak = series.flow.length ? Math.max(...series.flow.map(reading => reading.value)) : null;
  const latest = [flowNow?.time, heightNow?.time].filter(Boolean).sort((a, b) => b - a)[0];
  const trend = flowNow ? gaugeTrend(series.flow) : 'Unavailable';
  const context = gauge.context ? ` · ${gauge.context}` : '';
  riverStatusEl.innerHTML = `${series.siteName || gauge.siteName || gauge.sourceLabel}${context} · ${renderRiverFlowSources(gauge, riverName)}`;
  riverActivitiesEl.innerHTML = renderRiverActivities(RIVER_ACTIVITY_GUIDANCE[riverName], flowNow?.value);
  riverSummaryEl.innerHTML = `
    ${riverStat('Flow', flowNow ? `${formatNumber(flowNow.value)} CFS` : 'Unavailable', flowPeak !== null ? `Latest discharge · 7-day peak ${formatNumber(flowPeak)} CFS` : 'Latest reported discharge')}
    ${riverStat('Gauge height', heightNow ? `${heightNow.value.toFixed(2)} ft` : 'Unavailable', 'Height at the monitoring gauge')}
    ${riverStat('Weekly flow trend', trend, latest ? `Updated ${formatReadingTime(latest)}` : 'No current reading')}`;
  riverChartEl.innerHTML = buildGaugeChart(series);
}

function renderRiverFlowSources(gauge, riverName) {
  const links = [
    [gauge.sourceLabel, gauge.sourceUrl],
    ...(RIVER_FLOW_INFO_SOURCES[riverName] || []),
  ];
  return links.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name}</a>`).join(' · ');
}

function renderRiverActivities(guidance = {}, currentFlow) {
  const labels = { kayak: 'Kayak', paddleboard: 'Paddleboard', tube: 'Tube float' };
  const cards = Object.entries(labels).map(([activity, label]) => {
    const activityGuidance = guidance[activity];
    if (!activityGuidance) {
      return `<div class="river-activity unavailable">
        <div class="river-activity-top"><span class="label">${label}</span><span class="flow-rating unknown">No rating</span></div>
        <div class="range">No verified activity-specific CFS range</div>
      </div>`;
    }
    const rating = rateActivityFlow(currentFlow, activityGuidance);
    const sourceLinks = activityGuidance.sources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name}</a>`).join(' · ');
    return `<div class="river-activity">
      <div class="river-activity-top"><span class="label">${label}</span><span class="flow-rating ${rating.toLowerCase()}">${rating}</span></div>
      <div class="flow-bands">
        <span><i class="great"></i>Great ${formatFlowBands(activityGuidance.great)}</span>
        <span><i class="okay"></i>Okay ${formatFlowBands(activityGuidance.okay)}</span>
        <span><i class="bad"></i>Bad ${formatFlowBands(activityGuidance.bad)}</span>
      </div>
      <div class="activity-detail">${activityGuidance.note}</div>
      <div class="activity-sources">${sourceLinks}</div>
    </div>`;
  }).join('');
  return `${cards}<div class="river-activity-note">Ratings use only the linked guidance for this exact reach and activity. Closures, hazards, temperature, and skill can override a CFS rating.</div>`;
}

function rateActivityFlow(flow, guidance) {
  if (!Number.isFinite(flow)) return 'Unknown';
  const rating = ['great', 'okay', 'bad'].find(name => guidance[name].some(([min, max]) => flow >= min && flow <= max));
  return rating ? rating[0].toUpperCase() + rating.slice(1) : 'Unknown';
}

function formatFlowBands(bands) {
  return bands.map(([min, max]) => {
    if (max === Infinity) return `${formatNumber(min)}+`;
    if (min === 0) return `<${formatNumber(max + 1)}`;
    return `${formatNumber(min)}–${formatNumber(max)}`;
  }).join(', ') + ' CFS';
}

function riverStat(label, value, detail) {
  return `<div class="river-stat"><div class="label">${label}</div><div class="value">${value}</div><div class="detail">${detail}</div></div>`;
}

function gaugeTrend(readings) {
  if (readings.length < 2) return 'Unavailable';
  const current = readings.at(-1).value;
  const comparison = readings.find(reading => reading.time >= new Date(readings.at(-1).time - 24 * 60 * 60 * 1000))?.value ?? readings[0].value;
  const change = comparison ? ((current - comparison) / comparison) * 100 : 0;
  if (Math.abs(change) < 5) return 'Steady';
  return `${change > 0 ? 'Rising' : 'Falling'} ${Math.abs(change).toFixed(0)}%`;
}

function buildGaugeChart(series) {
  if (!series.flow.length && !series.height.length) {
    return '<div class="chart-empty">This gauge has no current-week height or flow readings.</div>';
  }
  const width = 900;
  const height = 280;
  const plot = { left: 58, right: 842, top: 52, bottom: 224 };
  const all = [...series.flow, ...series.height].sort((a, b) => a.time - b.time);
  const start = all[0].time.getTime();
  const end = all.at(-1).time.getTime();
  const flowRange = valueRange(series.flow);
  const heightRange = valueRange(series.height);
  const x = time => plot.left + ((time.getTime() - start) / Math.max(end - start, 1)) * (plot.right - plot.left);
  const y = (value, range) => plot.bottom - ((value - range.min) / Math.max(range.max - range.min, 1)) * (plot.bottom - plot.top);
  const path = (readings, range) => sampleReadings(readings, 110).map((reading, i) => `${i ? 'L' : 'M'}${x(reading.time).toFixed(1)},${y(reading.value, range).toFixed(1)}`).join(' ');
  const firstDay = new Date(start);
  firstDay.setHours(0, 0, 0, 0);
  if (firstDay.getTime() < start) firstDay.setDate(firstDay.getDate() + 1);
  const days = [];
  for (const day = new Date(firstDay); day.getTime() <= end; day.setDate(day.getDate() + 1)) {
    days.push(new Date(day));
  }
  const verticalGrid = days.map(day => `<line class="chart-grid" x1="${x(day)}" y1="${plot.top}" x2="${x(day)}" y2="${plot.bottom}"/>
    <text class="chart-axis chart-date" x="${x(day)}" y="244" text-anchor="middle"><tspan x="${x(day)}">${day.toLocaleDateString([], { weekday: 'short' })}</tspan><tspan x="${x(day)}" dy="12">${day.toLocaleDateString([], { month: 'short', day: 'numeric' })}</tspan></text>`).join('');
  const horizontalGrid = [0, .5, 1].map(position => {
    const lineY = plot.bottom - position * (plot.bottom - plot.top);
    return `<line class="chart-grid horizontal" x1="${plot.left}" y1="${lineY}" x2="${plot.right}" y2="${lineY}"/>`;
  }).join('');
  const flowLabels = axisLabels(flowRange, plot.left - 8, 'end', y, formatNumber);
  const heightLabels = axisLabels(heightRange, plot.right + 8, 'start', y, formatGaugeHeight);
  const latestFlow = series.flow.at(-1);
  const latestHeight = series.height.at(-1);
  const peakFlow = series.flow.reduce((peak, reading) => !peak || reading.value > peak.value ? reading : peak, null);
  const flowMarkers = latestFlow ? `${chartDot(latestFlow, flowRange, 'flow', x, y)}${chartLabel(latestFlow, flowRange, `Latest ${formatNumber(latestFlow.value)} CFS`, 'flow', x, y, -8)}` : '';
  const heightMarkers = latestHeight ? chartDot(latestHeight, heightRange, 'height', x, y) : '';
  const peakMarker = peakFlow && peakFlow !== latestFlow ? `${chartDot(peakFlow, flowRange, 'flow peak', x, y)}${chartLabel(peakFlow, flowRange, `7-day peak ${formatNumber(peakFlow.value)} CFS`, 'flow', x, y, 13)}` : '';
  return `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
    ${verticalGrid}${horizontalGrid}
    <text class="chart-axis-title flow" x="${plot.left}" y="18">LEFT AXIS · Flow (CFS)</text>
    <text class="chart-axis-title height" x="${plot.right}" y="18" text-anchor="end">RIGHT AXIS · Gauge height (ft)</text>
    <text class="chart-context" x="${width / 2}" y="36" text-anchor="middle">Seven-day history · latest readings are at the right edge</text>
    ${heightLabels}${flowLabels}
    ${series.height.length ? `<path class="chart-height" d="${path(series.height, heightRange)}"/>` : ''}
    ${series.flow.length ? `<path class="chart-flow" d="${path(series.flow, flowRange)}"/>` : ''}
    ${heightMarkers}${flowMarkers}${peakMarker}
  </svg>`;
}

function chartDot(reading, range, className, x, y) {
  return `<circle class="chart-dot-${className.replace(' peak', '')}${className.includes('peak') ? ' peak' : ''}" cx="${x(reading.time)}" cy="${y(reading.value, range)}" r="${className.includes('peak') ? 4 : 3.5}"/>`;
}

function chartLabel(reading, range, text, className, x, y, offsetY) {
  const pointX = x(reading.time);
  const anchor = pointX > 700 ? 'end' : 'start';
  const labelX = pointX + (anchor === 'end' ? -7 : 7);
  const labelY = Math.max(47, Math.min(218, y(reading.value, range) + offsetY));
  return `<text class="chart-callout ${className}" x="${labelX}" y="${labelY}" text-anchor="${anchor}">${text}</text>`;
}

function valueRange(readings) {
  if (!readings.length) return { min: 0, max: 1 };
  const values = readings.map(reading => reading.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max((max - min) * .12, max * .02, .1);
  return { min: Math.max(0, min - pad), max: max + pad };
}

function axisLabels(range, x, anchor, y, formatValue = formatNumber) {
  return [range.max, (range.max + range.min) / 2, range.min]
    .map(value => `<text class="chart-axis" x="${x}" y="${y(value, range) + 3}" text-anchor="${anchor}">${formatValue(value)}</text>`).join('');
}

function sampleReadings(readings, maxPoints) {
  if (readings.length <= maxPoints) return readings;
  const step = Math.ceil(readings.length / maxPoints);
  return readings.filter((_, i) => i % step === 0 || i === readings.length - 1);
}

function formatNumber(value) {
  return Math.round(value).toLocaleString();
}

function formatGaugeHeight(value) {
  return value.toFixed(1);
}

function formatReadingTime(date) {
  return date.toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' });
}

function renderForecast(daily) {
  gridEl.innerHTML = daily.time.map((date, i) => {
    const wind = Math.round(daily.wind_speed_10m_max[i]);
    const gust = Math.round(daily.wind_gusts_10m_max[i]);
    const risky = wind >= 15 || gust >= 25;
    return `<article class="forecast-day">
      <div class="day">${new Date(`${date}T12:00:00`).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</div>
      <div class="temp">${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°</div>
      <div class="metric ${risky ? 'risk' : ''}">Wind ${wind} mph<br>Gusts ${gust} mph</div>
      <div class="metric">Rain chance ${daily.precipitation_probability_max[i] ?? 0}%</div>
    </article>`;
  }).join('');
}

activityFilter.addEventListener('change', () => {
  renderOptions();
  loadConditions();
});
locationSelect.addEventListener('change', () => {
  loadConditions();
});
locationMenu.addEventListener('click', event => {
  const menuButton = event.target.closest('.location-menu-button');
  if (menuButton) {
    const isOpen = locationMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    return;
  }
  const option = event.target.closest('.location-option');
  if (!option) return;
  locationSelect.value = option.dataset.locationIndex;
  locationMenu.classList.remove('open');
  renderLocationMenu(spots.filter(spot => activityFilter.value === 'all' || spot.activity === activityFilter.value));
  loadConditions();
});
document.addEventListener('click', event => {
  if (locationMenu.contains(event.target)) return;
  locationMenu.classList.remove('open');
  locationMenu.querySelector('.location-menu-button')?.setAttribute('aria-expanded', 'false');
});
document.getElementById('load-button').addEventListener('click', loadConditions);
renderOptions();
loadConditions();
