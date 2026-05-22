const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = [
  'ballast_tanks', 'bulk', 'cargo_lifting_gear', 'cargo_tanks', 'certificate',
  'communication', 'constructive_fire_protection', 'container_specifies',
  'crew_accommodation', 'crew_evaluation', 'crew_health', 'crew_safety',
  'deck', 'deck_machinery', 'document_control', 'electrical_items',
  'engine_room', 'fire_fighting_equipment', 'firefighting_fixed_system',
  'hatch_coamings', 'hatch_covers', 'holds', 'hull_inboard', 'hull_outboard',
  'hull_structure', 'life_saving_apparatus', 'machinery_arrangements',
  'maintenance_equipment', 'materials', 'mooring_arrangements',
  'navigational_equipment', 'oil_pollution_equipment', 'pctc_specifics',
  'pilot_boarding_arrangements', 'pollution_prevention', 'pollution_prevention_tankers',
  'protection_against_flooding', 'publication_documents', 'pumps_performance',
  'radio_equipments', 'radio_navigation', 'reporting_systems',
  'safety_equipment', 'safety_of_navigation', 'sea_trial', 'ships_pyrotechnics',
  'supply_connections', 'tankage', 'tanker_equipment', 'tanker_specifics', 'towing'
];

const MASTER_DATA = {
  bulk: [
    { s_no: 'BUL-01', requirements: 'MUD TANK INSPECTION', ans: 'Yes', comments: 'All tanks verified clean' },
    { s_no: 'BUL-02', requirements: 'BARITE TANKS CALIBRATION', ans: 'Yes', comments: 'Pressure tested' },
    { s_no: 'BUL-03', requirements: 'CEMENT TANKS LEVEL SENSORS', ans: 'EMPTY', comments: 'EMPTY' }
  ],
  deck: [
    { s_no: 'DEC-01', requirements: 'MAIN DECK INTEGRITY', ans: 'Yes', comments: 'No signs of corrosion' },
    { s_no: 'DEC-02', requirements: 'RAILING AND SAFETY CHAINS', ans: 'Yes', comments: 'Securely fastened' }
  ],
  certificate: [
    { s_no: 'CERT-01', requirements: 'SAFETY MANAGEMENT CERTIFICATE', ans: 'Yes', comments: 'Valid until 2027' },
    { s_no: 'CERT-02', requirements: 'DOCUMENT OF COMPLIANCE', ans: 'Yes', comments: 'Annual audit completed' }
  ]
};

async function seedData() {
  console.log('🚀 Starting Master Data Synchronization...');
  
  for (const table of TABLES) {
    const data = MASTER_DATA[table] || [
      { s_no: `${table.slice(0,3).toUpperCase()}-01`, requirements: `General Technical Audit: ${table.replace(/_/g, ' ')}`, ans: 'EMPTY', comments: 'EMPTY' }
    ];

    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    
    if (count === 0) {
      console.log(`📝 Seeding ${table}...`);
      const { error } = await supabase.from(table).insert(data);
      if (error) console.error(`❌ Error seeding ${table}:`, error.message);
    } else {
      console.log(`✅ ${table} already has data (${count} records).`);
    }
  }
  
  console.log('🎉 Technical Registry Synchronization Complete!');
}

seedData();
