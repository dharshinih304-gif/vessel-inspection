const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) acc[m[1]] = m[2].replace(/['"]/g, '').trim();
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const VESSEL_ID = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

const CATEGORIES = [
  'ballast_tanks', 'bulk', 'cargo_lifting_gear', 'cargo_tanks', 'certificate',
  'communication', 'constructive_fire_protection', 'container_specifies',
  'crew_accommodation', 'crew_evaluation', 'crew_health', 'crew_safety',
  'deck', 'deck_machinary', 'document_control', 'electrical_items',
  'engine_room', 'fire_fighting_equipment', 'firefighting_fixed_system',
  'hatch_coamings', 'hatch_covers', 'holds', 'hull_inboard', 'hull_outboard',
  'hull_structure', 'life_saving_apparatus', 'machinery_arrangements',
  'maintenance_equipment', 'materials', 'mooring_arrangements',
  'navigational_equipment', 'oil_pollution_equipment', 'pctc_specifics',
  'pilot_boarding_arrangements', 'pollution_prevention', 'pollution_prevention_for_tankers',
  'protection_against_flooding', 'publication_documents', 'pumps_performance',
  'radio_equipments', 'radio_navigation', 'reporting_systems',
  'safety_equipment', 'safety_of_navigation', 'sea_trial_if_available', 'ships_pyrotechnics',
  'supply_connections', 'tankage', 'tanker_equipment', 'tanker_specifics', 'towing'
];

async function cleanupDuplicates() {
  console.log('Cleaning up duplicates for Ocean Sea...');
  let totalDeleted = 0;

  for (const cat of CATEGORIES) {
    // 1. Fetch all rows for this vessel
    const { data: rows, error } = await supabase
      .from(cat)
      .select('*')
      .eq('vessel_id', VESSEL_ID);

    if (error) {
      console.error(`Error fetching ${cat}:`, error.message);
      continue;
    }

    if (!rows || rows.length === 0) continue;

    // 2. Group by s_no and find duplicates
    const keepIds = new Set();
    const deleteIds = [];

    // Sort by created_at DESC to keep the newest one
    rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    for (const row of rows) {
      const sNo = row.s_no || row.item_no;
      if (!sNo) continue;

      if (!keepIds.has(sNo)) {
        // Keep the first (newest) one we see
        keepIds.add(sNo);
      } else {
        // Delete all others
        deleteIds.push(row.id);
      }
    }

    if (deleteIds.length > 0) {
      console.log(`[${cat}] Found ${deleteIds.length} duplicates. Deleting...`);
      // Delete in batches if necessary, but array should be small enough
      const { error: delErr } = await supabase
        .from(cat)
        .delete()
        .in('id', deleteIds);
        
      if (delErr) {
        console.error(`Failed to delete in ${cat}:`, delErr.message);
      } else {
        totalDeleted += deleteIds.length;
      }
    }
  }

  console.log(`Cleanup finished! Deleted ${totalDeleted} duplicate rows across all categories for Ocean Sea.`);
}

cleanupDuplicates();
