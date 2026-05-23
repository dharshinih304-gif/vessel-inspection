require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CATEGORIES = [
  'electrical_items', 'safety_of_navigation', 'engine_room', 'sea_trial_if_available',
  'fire_fighting_equipment', 'pollution_prevention_for_tankers', 'firefighting_fixed_system',
  'bulk', 'ships_pyrotechnics', 'protection_against_flooding', 'hatch_coamings',
  'supply_connections', 'cargo_lifting_gear', 'publication_documents', 'hatch_covers',
  'tankage', 'cargo_tanks', 'tanker_equipment', 'holds', 'communication',
  'pumps_performance', 'tanker_specifics', 'constructive_fire_protection', 'hull_inboard',
  'radio_equipments', 'towing', 'hull_outboard', 'container_specifies', 'radio_navigation',
  'crew_accommodation', 'hull_structure', 'crew_evaluation', 'reporting_systems',
  'life_saving_apparatus', 'crew_health', 'safety_equipment', 'machinery_arrangements',
  'crew_safety', 'maintenance_equipment', 'deck_machinary', 'materials', 'document_control',
  'mooring_arrangements', 'navigational_equipment', 'oil_pollution_equipment', 'certificate',
  'pctc_specifics', 'deck', 'pilot_boarding_arrangements', 'ballast_tanks', 'pollution_prevention'
];

const vesselId = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
const companyId = '467955f6-f651-4305-8e71-09b6b377ca69'; 

async function autoFill() {
  let totalInserted = 0;
  for (const cat of CATEGORIES) {
    try {
      // Get all items to find templates
      const { data: allItems } = await supabase.from(cat).select('*');
      if (!allItems || allItems.length === 0) continue;

      // Extract unique templates based on s_no or item_no
      const seenSNo = new Set();
      const templates = [];
      const sortedItems = [...allItems].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
      });

      for (const row of sortedItems) {
          const sNoVal = row.s_no || row.item_no;
          if (sNoVal && !seenSNo.has(sNoVal)) {
              seenSNo.add(sNoVal);
              templates.push(row);
          }
      }

      if (templates.length === 0) continue;

      // Filter out those templates that ALREADY have an active item for this vessel
      // So we don't duplicate answers we already seeded.
      const { data: existingActive } = await supabase
        .from(cat)
        .select('*')
        .eq('vessel_id', vesselId)
        .is('report_id', null);

      const existingSNo = new Set(existingActive?.map(r => r.s_no || r.item_no) || []);
      const templatesToInsert = templates.filter(tmpl => !existingSNo.has(tmpl.s_no || tmpl.item_no));

      if (templatesToInsert.length === 0) continue;

      const itemsToInsert = templatesToInsert.map(tmpl => {
        const item = {
          rule_ref: tmpl.rule_ref,
          requirements: tmpl.requirements,
          ans: 'SATISFACTORY',
          comments: 'Condition satisfactory, no abnormalities observed.',
          image: tmpl.image || '',
          vessel_id: vesselId,
          company_id: companyId,
          user_id: '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2',
        };
        if (tmpl.s_no !== undefined) item.s_no = tmpl.s_no;
        if (tmpl.item_no !== undefined) item.item_no = tmpl.item_no;
        return item;
      });

      const { error } = await supabase.from(cat).insert(itemsToInsert);
      if (error) {
        console.error(`Error inserting into ${cat}:`, error);
      } else {
        totalInserted += itemsToInsert.length;
      }
    } catch (e) {
      console.error(`Error processing ${cat}:`, e);
    }
  }
  console.log(`Auto-filled an additional ${totalInserted} items for OCEAN STAR!`);
}

autoFill();
