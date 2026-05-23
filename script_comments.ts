import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

const getSuggestionsForStatus = (status: string) => {
    switch(status) {
        case 'SATISFACTORY':
            return ['Condition satisfactory', 'No abnormalities observed', 'Inspection completed successfully'];
        case 'GOOD':
            return ['Good condition', 'Working properly', 'Well maintained'];
        case 'UNSATISFACTORY':
            return ['Corrosion observed', 'Repair required', 'Further inspection needed'];
        case 'NOT SEEN':
            return ['Unable to access', 'Area restricted', 'Not inspected at this time'];
        default:
            return [];
    }
}

const statuses = ['SATISFACTORY', 'GOOD', 'UNSATISFACTORY', 'NOT SEEN'];

async function main() {
  const { data: vessels, error: vesselsError } = await supabase.from('vessels').select('*').limit(2);
  
  if (vesselsError || !vessels || vessels.length === 0) {
    console.error('Error fetching vessels', vesselsError);
    return;
  }
  
  console.log('Selected vessels:', vessels.map(v => v.vessel_name));
  
  for (const vessel of vessels) {
    console.log(`\nProcessing vessel: ${vessel.vessel_name} (${vessel.id})`);
    
    for (const cat of CATEGORIES) {
      console.log(`Updating category: ${cat}`);
      
      const { data: templates, error: templatesError } = await supabase.from(cat).select('*').is('vessel_id', null).order('s_no');
      
      if (templatesError) {
        console.error(`Error fetching templates for ${cat}:`, templatesError.message);
        continue;
      }
      
      let sourceRecords = templates;
      if (!sourceRecords || sourceRecords.length === 0) {
        const { data: anyRecords } = await supabase.from(cat).select('*').order('created_at', { ascending: false });
        if (anyRecords && anyRecords.length > 0) {
          const unique = [];
          const seen = new Set();
          for (const r of anyRecords) {
             if (!seen.has(r.s_no)) {
                seen.add(r.s_no);
                unique.push(r);
             }
          }
          sourceRecords = unique;
        }
      }

      if (!sourceRecords || sourceRecords.length === 0) {
         console.log(`No records found to use as template for ${cat}, skipping.`);
         continue;
      }

      const { data: existingRecords } = await supabase.from(cat).select('id, s_no').eq('vessel_id', vessel.id);
      
      const existingBySno = new Map();
      if (existingRecords) {
         for (const er of existingRecords) {
            existingBySno.set(er.s_no, er);
         }
      }

      const rowsToInsert = [];
      const rowsToUpdate = [];

      for (const t of sourceRecords) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const suggestions = getSuggestionsForStatus(randomStatus);
        const randomComment = suggestions[Math.floor(Math.random() * suggestions.length)];

        if (existingBySno.has(t.s_no)) {
           rowsToUpdate.push({
             id: existingBySno.get(t.s_no).id,
             ans: randomStatus,
             comments: randomComment
           });
        } else {
           const newRow = {
              s_no: t.s_no,
              requirements: t.requirements,
              rule_ref: t.rule_ref,
              ans: randomStatus,
              comments: randomComment,
              vessel_id: vessel.id,
              company_id: vessel.company_id,
              report_id: null
           };
           rowsToInsert.push(newRow);
        }
      }

      for (const update of rowsToUpdate) {
         await supabase.from(cat).update({ ans: update.ans, comments: update.comments }).eq('id', update.id);
      }

      if (rowsToInsert.length > 0) {
         const { error: insertError } = await supabase.from(cat).insert(rowsToInsert);
         if (insertError) {
             console.error(`Error inserting into ${cat}:`, insertError.message);
         }
      }
    }
  }
  console.log('Done!');
}

main();
