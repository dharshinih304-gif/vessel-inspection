const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_PATH = path.join(__dirname, 'data/SEPERATE.xlsx');
const OUTPUT_SQL_PATH = path.join(__dirname, 'seed_active_checklists.sql');

const SHEET_TO_TABLE = {
  'CERTIFICATE': 'certificate',
  'DECKS': 'deck',
  'SAFETY EQUIPMENT': 'safety_equipment',
  'FIRE FIGHTING EQUIPMENT': 'fire_fighting_equipment',
  'NAVIGATION EQUIPMENTS': 'navigational_equipment',
  'HULL OUTBOARD': 'hull_outboard',
  'HULL INBOARD': 'hull_inboard',
  'MAINTENANCE EQUIPMENT': 'maintenance_equipment',
  'HATCH COAMINGS': 'hatch_coamings',
  'MACHINARY ARRANGEMENTS': 'machinery_arrangements',
  'ELECTRICAL ITEMS': 'electrical_items',
  'POLLUTION PREVENTION': 'pollution_prevention',
  'BALLAST TANKS': 'ballast_tanks',
  'RADIO EQUIPMENTS': 'radio_equipments',
  'MATERIALS': 'materials',
  'DOCUMENT CONTROL': 'document_control',
  'COMMUNICATION': 'communication',
  'PUBLICATION DOCUMENTS': 'publication_documents',
  'SHIPS PYROTECHNICS': 'ships_pyrotechnics',
  'LIFE SAVING APPARATUS': 'life_saving_apparatus',
  'CREW ACCOMODATION': 'crew_accommodation',
  'TOWING': 'towing',
  'TANKAGE': 'tankage',
  'BULK': 'bulk',
  'PUMPS PERFORMANCE': 'pumps_performance',
  'SUPPLY CONNECTIONS': 'supply_connections',
  'OIL POLLUTION EQUIPMENT': 'oil_pollution_equipment',
  'SEA TRIAL IF AVAILABLE': 'sea_trial_if_available',
  'HATCH COVERS': 'hatch_covers',
  'HOLDS': 'holds',
  'DECK MACHINARY': 'deck_machinary',
  'ENGINE ROOM': 'engine_room',
  'REPORTING SYSTEMS': 'reporting_systems',
  'RADIO & NAVIGATION': 'radio_navigation',
  'TANKER SPECIFICS': 'tanker_specifics',
  'CARGO TANKS': 'cargo_tanks',
  'POLLUTION PREVENTION FOR TANKER': 'pollution_prevention_for_tankers',
  'TANKER EQUIPMENT': 'tanker_equipment',
  'CONTAINER SPECIFIES': 'container_specifies',
  'PCTC SPECFICS': 'pctc_specifics',
  'CREW EVALUATION ': 'crew_evaluation',
  'CREW SAFETY': 'crew_safety',
  'CREW HEALTH': 'crew_health',
  'CONSTRUCTIVE FIRE PROTECTION ': 'constructive_fire_protection',
  'FIREFIGHTING FIXED SYSYTEMS': 'firefighting_fixed_system',
  'SAFETY OF NAVIGATION': 'safety_of_navigation',
  'PILOT BOARDING ARRANGEMENTS': 'pilot_boarding_arrangements',
  'PROTECTION AGAINST FLOODING': 'protection_against_flooding',
  'HULL STRUCTURE': 'hull_structure',
  'MOORING ARRANGEMENTS': 'mooring_arrangements',
  'CARGO LIFTING GEAR': 'cargo_lifting_gear'
};

const STATUSES = ['SATISFACTORY', 'GOOD', 'UNSATISFACTORY', 'NOT SEEN'];
const STATUS_WEIGHTS = [0.75, 0.15, 0.07, 0.03];

function getRandomStatus() {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < STATUSES.length; i++) {
    cumulative += STATUS_WEIGHTS[i];
    if (r <= cumulative) return STATUSES[i];
  }
  return STATUSES[0];
}

const COMMENTS_MAPPING = {
  'SATISFACTORY': [
    'Condition satisfactory',
    'No abnormalities observed',
    'Inspection completed successfully',
    'In good working order',
    'Meets required standards',
    'Operating correctly',
    'No defects found'
  ],
  'GOOD': [
    'Good condition',
    'Working properly',
    'Well maintained',
    'Fully functional',
    'Excellent state',
    'Very clean and orderly'
  ],
  'UNSATISFACTORY': [
    'Corrosion observed',
    'Repair required',
    'Further inspection needed',
    'Needs immediate maintenance',
    'Defective - replace soon',
    'Minor wear and tear detected'
  ],
  'NOT SEEN': [
    'Unable to access',
    'Area restricted',
    'Not inspected at this time',
    'Not applicable for this voyage'
  ]
};

function getRandomComment(status) {
  const suggestions = COMMENTS_MAPPING[status] || [];
  return suggestions[Math.floor(Math.random() * suggestions.length)] || '';
}

function extractRowData(row, sheetName) {
  const values = Object.entries(row).map(([k, v]) => ({ key: k, value: String(v).trim() })).filter(item => item.value !== '');
  if (values.length < 2) return null;
  
  let s_no = '';
  let requirements = '';
  let rule_ref = '';
  
  const firstVal = values[0].value.toLowerCase();
  if (
    firstVal.includes('s.no') || 
    firstVal.includes('s. no') || 
    firstVal.includes('item') || 
    firstVal === 's.n0' ||
    firstVal.includes('item_no') ||
    firstVal === sheetName.toLowerCase() ||
    firstVal === 'rule'
  ) {
    return null; 
  }
  
  const secondVal = values[1].value;
  const isSecondValSerial = /^[A-Z]{2,4}(-[A-Z]{2,4})?-\d+$/i.test(secondVal) || /^[A-Z]+-[A-Z0-9\-]+$/i.test(secondVal);
  
  if (values.length >= 3 && isSecondValSerial) {
    s_no = secondVal;
    requirements = values[2].value;
    rule_ref = values[0].value;
  } else {
    s_no = values[0].value;
    requirements = values[1].value;
    if (values.length >= 3) {
      rule_ref = values[2].value;
    }
  }
  
  if (
    s_no.toLowerCase() === 's.no' || 
    s_no.toLowerCase() === 'item no.' || 
    s_no.toLowerCase() === 's.n0' ||
    requirements.toLowerCase() === 'requirements' ||
    requirements.toLowerCase() === 's.no'
  ) {
    return null;
  }
  
  return { s_no, requirements, rule_ref };
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

// Target vessels in the database
const VESSELS = [
  { id: 'b4871f10-60cc-4a4a-a49b-bb22b290f206', name: 'OCEAN STAR', company_id: '37d92d0d-1f11-4a31-b1a7-69cf3a80c7e7' },
  { id: 'dc1cda62-89c9-4606-a303-2066754c6b39', name: 'TEST', company_id: '37d92d0d-1f11-4a31-b1a7-69cf3a80c7e7' }
];

const defaultUserId = '36136991-937e-4c1d-aab2-ea4188213a37';

function main() {
  console.log('Reading Excel from:', EXCEL_PATH);
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error('File not found!');
    return;
  }
  const workbook = XLSX.readFile(EXCEL_PATH);
  
  let sqlOutput = 'BEGIN;\n\n';

  for (const vessel of VESSELS) {
    sqlOutput += `-- =====================================================================\n`;
    sqlOutput += `-- SEEDING FOR VESSEL: ${vessel.name} (${vessel.id})\n`;
    sqlOutput += `-- =====================================================================\n\n`;

    for (const [sheetName, tableName] of Object.entries(SHEET_TO_TABLE)) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      const rows = XLSX.utils.sheet_to_json(worksheet);
      if (rows.length === 0) continue;

      // Clear existing active rows for this vessel and category report
      sqlOutput += `DELETE FROM public.${tableName} WHERE vessel_id = '${vessel.id}' AND report_id = (SELECT id FROM public.reports WHERE vessel_id = '${vessel.id}' AND category_name = '${tableName}' LIMIT 1);\n`;

      const seenSerials = new Set();
      const insertStatements = [];

      rows.forEach(r => {
        const parsed = extractRowData(r, sheetName);
        if (parsed) {
          const serialKey = parsed.s_no.trim().toUpperCase();
          
          // STRICT DEDUPLICATION: Prevent duplicate serial numbers per category
          if (seenSerials.has(serialKey)) {
            return;
          }
          seenSerials.add(serialKey);

          const status = getRandomStatus();
          const comment = getRandomComment(status);

          const isSpecialTable = tableName === 'machinery_arrangements' || tableName === 'pollution_prevention_for_tankers';
          const serialColumn = isSpecialTable ? 'item_no' : 's_no';

          const fields = [
            'vessel_id', 'company_id', 'user_id', 'report_id', 
            'requirements', 'rule_ref', 'ans', 'comments', 'image', serialColumn
          ];

          const values = [
            `'${vessel.id}'`,
            `'${vessel.company_id}'`,
            `'${defaultUserId}'`,
            `(SELECT id FROM public.reports WHERE vessel_id = '${vessel.id}' AND category_name = '${tableName}' LIMIT 1)`,
            escapeSql(parsed.requirements),
            escapeSql(parsed.rule_ref),
            escapeSql(status),
            escapeSql(comment),
            'NULL',
            escapeSql(parsed.s_no)
          ];

          insertStatements.push(`INSERT INTO public.${tableName} (${fields.join(', ')}) VALUES (${values.join(', ')});`);
        }
      });

      if (insertStatements.length > 0) {
        sqlOutput += `-- Table: ${tableName} (${insertStatements.length} rows)\n`;
        sqlOutput += insertStatements.join('\n') + '\n\n';
      }
    }
  }

  sqlOutput += 'COMMIT;\n';

  fs.writeFileSync(OUTPUT_SQL_PATH, sqlOutput);
  console.log(`✅ Success! Generated SQL seed script at: ${OUTPUT_SQL_PATH}`);
}

main();
