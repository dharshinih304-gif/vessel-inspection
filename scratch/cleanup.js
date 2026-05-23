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

async function cleanDuplicates() {
  console.log('Starting cleanup of duplicate checklist rows...');
  let totalDeleted = 0;

  for (const table of CATEGORIES) {
    const { data: rows, error } = await supabase
      .from(table)
      .select('id, vessel_id, s_no, created_at, report_id')
      .order('created_at', { ascending: false });

    if (error) {
      if (!error.message.includes('does not exist')) {
        console.error(`Error fetching from ${table}:`, error.message);
      }
      continue;
    }

    if (!rows || rows.length === 0) continue;

    // To be safe, we will keep the latest row for each vessel_id + s_no.
    // Since this is a duplicate issue caused by the recent bug, deleting the older ones is exactly what we want.
    const seen = new Set();
    const idsToDelete = [];

    for (const row of rows) {
      if (!row.s_no) continue;
      
      // Group by vessel_id + s_no (ignoring report_id since the bug assigned random report_ids)
      const key = `${row.vessel_id}_${row.s_no}`;
      if (seen.has(key)) {
        idsToDelete.push(row.id);
      } else {
        seen.add(key);
      }
    }

    if (idsToDelete.length > 0) {
      console.log(`Found ${idsToDelete.length} duplicates in ${table}. Deleting...`);
      for (let i = 0; i < idsToDelete.length; i += 100) {
        const batch = idsToDelete.slice(i, i + 100);
        const { error: delErr } = await supabase
          .from(table)
          .delete()
          .in('id', batch);
          
        if (delErr) {
          console.error(`Failed to delete in ${table}:`, delErr.message);
        } else {
          totalDeleted += batch.length;
        }
      }
    }
  }

  console.log(`Cleanup complete! Deleted a total of ${totalDeleted} duplicate rows.`);
}

cleanDuplicates();
