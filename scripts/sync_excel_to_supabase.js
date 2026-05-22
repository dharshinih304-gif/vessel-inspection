const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const EXCEL_PATH = path.join(__dirname, '../public/data/SEPERATE.xlsx');

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
  'SEA TRIAL IF AVAILABLE': 'sea_trial',
  'HATCH COVERS': 'hatch_covers',
  'HOLDS': 'holds',
  'DECK MACHINARY': 'deck_machinery',
  'ENGINE ROOM': 'engine_room',
  'REPORTING SYSTEMS': 'reporting_systems',
  'RADIO & NAVIGATION': 'radio_navigation',
  'TANKER SPECIFICS': 'tanker_specifics',
  'CARGO TANKS': 'cargo_tanks',
  'POLLUTION PREVENTION FOR TANKER': 'pollution_prevention_tankers',
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

// Use the provided vesselId or default to Inspection Vessel 01
const TARGET_VESSEL_ID = process.argv[2] || '4299e91e-2c75-46d2-8bdb-b9ba313b5b2d';

async function sync() {
  console.log(`🚀 Starting Excel to Supabase Sync for Vessel ID: ${TARGET_VESSEL_ID}...`);
  
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`❌ Excel file not found at: ${EXCEL_PATH}`);
    return;
  }

  const workbook = XLSX.readFile(EXCEL_PATH);
  
  for (const [sheetName, tableName] of Object.entries(SHEET_TO_TABLE)) {
    console.log(`\n📄 Processing Sheet: "${sheetName}" -> Table: "${tableName}"`);
    
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      console.warn(`⚠️ Sheet "${sheetName}" not found in Excel.`);
      continue;
    }

    const rows = XLSX.utils.sheet_to_json(worksheet);
    if (rows.length === 0) {
      console.warn(`⚠️ Sheet "${sheetName}" is empty.`);
      continue;
    }

    // Map columns dynamically
    const mappedData = rows.map(row => {
      const entry = {};
      
      // Look for S.NO / ITEM NO
      const s_no_raw = row['S.NO'] || row['S. No'] || row['S NO'] || row['ITEM_NO'] || row['item_no'] || row['__EMPTY'] || null;
      entry.s_no = s_no_raw ? String(s_no_raw).substring(0, 20) : null;
      
      // Look for Requirements
      entry.requirements = row[sheetName] || row['REQUIREMENTS'] || row['requirements'] || row['DESCRIPTION'] || row['__EMPTY_1'] || Object.values(row)[1] || '';
      
      // Look for Rule Ref
      entry.rule_ref = row['RULE REF'] || row['rule_ref'] || row['RULE'] || row['REFERENCE'] || null;
      
      // Look for Ans/Comments
      entry.ans = row['ANS'] || row['ans'] || row['ANSWER'] || '';
      entry.comments = row['COMMENTS'] || row['comments'] || row['REMARKS'] || '';
      
      // Add Vessel ID
      entry.vesselId = TARGET_VESSEL_ID;
      
      return entry;
    }).filter(item => item.requirements);

    console.log(`📤 Syncing ${mappedData.length} rows for "${tableName}"...`);
    
    // Clear existing data for this vessel to avoid duplicates
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq('vesselId', TARGET_VESSEL_ID);
    
    if (deleteError) {
      console.warn(`⚠️ Warning while deleting from ${tableName}:`, deleteError.message);
    }

    const { error: insertError } = await supabase.from(tableName).insert(mappedData);
    if (insertError) {
      console.error(`❌ Error inserting into ${tableName}:`, insertError.message);
    } else {
      console.log(`✅ Successfully synced ${tableName}.`);
    }
  }

  console.log('\n✨ Sync Complete!');
}

sync();
