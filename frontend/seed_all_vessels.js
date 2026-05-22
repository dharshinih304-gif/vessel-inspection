const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const EXCEL_PATH = path.join(__dirname, 'data/SEPERATE.xlsx');

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
const STATUS_WEIGHTS = [0.75, 0.15, 0.07, 0.03]; // Sums up to 1.0

function getRandomStatus() {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < STATUSES.length; i++) {
    cumulative += STATUS_WEIGHTS[i];
    if (r <= cumulative) {
      return STATUSES[i];
    }
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

async function seed() {
  console.log('🚀 Starting Clean Sellamsoft Database Seeding (No repeating checklist rows)...');
  
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`❌ Excel file not found at: ${EXCEL_PATH}`);
    process.exit(1);
  }

  console.log('📡 Fetching vessels from Supabase...');
  const { data: vessels, error: vesselsError } = await supabase
    .from('vessels')
    .select('id, vessel_name, company_id');
    
  if (vesselsError) {
    console.error('❌ Error fetching vessels:', vesselsError.message);
    process.exit(1);
  }
  
  if (!vessels || vessels.length === 0) {
    console.log('⚠️ No vessels found in the database. Seeding skipped.');
    process.exit(0);
  }
  
  console.log(`✅ Found ${vessels.length} vessels in database.`);

  const workbook = XLSX.readFile(EXCEL_PATH);
  console.log(`✅ Workbook loaded. Found ${workbook.SheetNames.length} sheets.`);

  const { data: users } = await supabase.from('users').select('id').limit(1);
  const defaultUserId = (users && users.length > 0) ? users[0].id : '36136991-937e-4c1d-aab2-ea4188213a37';
  console.log(`👤 Using Auditor User ID: ${defaultUserId}`);

  // 1. Wipe the reports table to avoid archived states interfering with active edits
  console.log('🧹 Wiping reports table for a clean slate...');
  const { error: reportsWipeError } = await supabase
    .from('reports')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Wipe all reports
  
  if (reportsWipeError) {
    console.error('⚠️ Warning wiping reports table:', reportsWipeError.message);
  } else {
    console.log('✅ Wiped reports table successfully.');
  }

  let totalRowsInserted = 0;

  for (const vessel of vessels) {
    console.log(`\n🚢 =================================================================`);
    console.log(`🚢 Processing Vessel: "${vessel.vessel_name.toUpperCase()}" (${vessel.id})`);
    console.log(`🚢 =================================================================`);
    
    for (const [sheetName, tableName] of Object.entries(SHEET_TO_TABLE)) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        continue;
      }
      
      const rows = XLSX.utils.sheet_to_json(worksheet);
      if (rows.length === 0) {
        continue;
      }

      // 2. Prepare the rows with report_id: null (live active state)
      const batchRows = [];
      rows.forEach(r => {
        const parsed = extractRowData(r, sheetName);
        if (parsed) {
          const status = getRandomStatus();
          const comment = getRandomComment(status);
          
          const entry = {
            vessel_id: vessel.id,
            company_id: vessel.company_id,
            user_id: defaultUserId,
            report_id: null, // Seed directly into live active state!
            requirements: parsed.requirements,
            rule_ref: parsed.rule_ref,
            ans: status,
            comments: comment,
            image: null
          };
          
          if (tableName === 'machinery_arrangements' || tableName === 'pollution_prevention_for_tankers') {
            entry.item_no = parsed.s_no;
          } else {
            entry.s_no = parsed.s_no;
          }
          
          batchRows.push(entry);
        }
      });

      if (batchRows.length === 0) {
        continue;
      }

      // 3. Clear existing rows in this table for this vessel completely to avoid any duplicates
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('vessel_id', vessel.id);
        
      if (deleteError) {
        console.error(`   ⚠️ Warning clearing table "${tableName}": ${deleteError.message}`);
      }

      // 4. Batch insert new records (active state: report_id = null)
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(batchRows);
        
      if (insertError) {
        console.error(`   ❌ Error inserting into table "${tableName}": ${insertError.message}`);
      } else {
        console.log(`   ✅ Seeded active state for "${tableName}": inserted ${batchRows.length} rows.`);
        totalRowsInserted += batchRows.length;
      }
    }
    console.log(`🎉 Finished clean seeding for vessel "${vessel.vessel_name.toUpperCase()}"!`);
  }

  console.log('\n✨ =================================================================');
  console.log(`✨ SEEDING COMPLETE! Total active technical records inserted: ${totalRowsInserted}`);
  console.log('✨ =================================================================');
}

seed();
