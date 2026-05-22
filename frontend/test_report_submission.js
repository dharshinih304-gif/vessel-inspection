const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = [
  'cargo_lifting_gear', 'cargo_tanks', 'pilot_boarding_arrangements', 'communication',
  'constructive_fire_protection', 'pollution_prevention', 'tanker_specifics', 'hull_structure',
  'certificate', 'container_specifies', 'life_saving_apparatus', 'pollution_prevention_for_tankers',
  'towing', 'deck', 'crew_accommodation', 'machinery_arrangements', 'crew_evaluation', 'bulk',
  'publication_documents', 'crew_health', 'ballast_tanks', 'materials', 'crew_safety',
  'mooring_arrangements', 'pumps_performance', 'deck_machinary', 'maintenance_equipment',
  'navigational_equipment', 'protection_against_flooding', 'radio_equipments', 'document_control',
  'oil_pollution_equipment', 'radio_navigation', 'electrical_items', 'pctc_specifics',
  'reporting_systems', 'engine_room', 'safety_equipment', 'fire_fighting_equipment',
  'safety_of_navigation', 'firefighting_fixed_system', 'hatch_coamings', 'sea_trial_if_available',
  'ships_pyrotechnics', 'hatch_covers', 'supply_connections', 'holds', 'tankage', 'hull_inboard',
  'tanker_equipment', 'hull_outboard'
];

async function submitReport() {
  const vesselId = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
  const vesselName = 'ocean star';
  const companyId = '37d92d0d-1f11-4a31-b1a7-69cf3a80c7e7';
  const userId = '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2';

  console.log(`🚀 Starting submission simulation for vessel "${vesselName}"...`);

  // 1. Create Report
  const newReport = {
    vessel_id: vesselId,
    company_id: companyId,
    report_title: `Consolidated Audit - ${vesselName}`,
    title: `Consolidated Audit - ${vesselName}`,
    category_name: 'OVERALL',
    status: 'PENDING',
    inspection_date: new Date().toISOString().split('T')[0],
    created_by: userId
  };

  const { data: insertedReport, error: reportErr } = await supabase
    .from('reports')
    .insert(newReport)
    .select()
    .single();

  if (reportErr) {
    console.error('❌ Error creating report:', reportErr.message);
    process.exit(1);
  }

  const newReportId = insertedReport.id;
  console.log(`✅ Created Report with ID: ${newReportId}`);

  let clonedCategoriesCount = 0;

  for (const cat of CATEGORIES) {
    try {
      // Fetch all items to build templates
      const { data: allItems, error: templateErr } = await supabase
        .from(cat)
        .select('*');

      if (templateErr) {
        console.error(`❌ Error fetching templates for ${cat}:`, templateErr.message);
        continue;
      }

      // Deduplicate by s_no/item_no
      const seen = new Set();
      const templates = [];
      const sorted = [...(allItems || [])].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      for (const row of sorted) {
        const sNoVal = row.s_no || row.item_no;
        if (sNoVal && !seen.has(sNoVal)) {
          seen.add(sNoVal);
          templates.push(row);
        }
      }

      // Fetch active edits for this vessel
      const { data: activeItems } = await supabase
        .from(cat)
        .select('*')
        .eq('vessel_id', vesselId)
        .is('report_id', null);

      const activeMap = new Map();
      if (activeItems) {
        activeItems.forEach(item => {
          activeMap.set(item.s_no, item);
        });
      }

      // Merge templates and active edits
      const itemsToInsert = templates.map(tmpl => {
        const activeItem = activeMap.get(tmpl.s_no);
        
        const STATUSES = ['SATISFACTORY', 'GOOD', 'UNSATISFACTORY', 'NOT SEEN'];
        const STATUS_WEIGHTS = [0.75, 0.15, 0.07, 0.03];
        const COMMENTS_MAPPING = {
          'SATISFACTORY': ['Condition satisfactory', 'No abnormalities observed', 'Inspection completed successfully', 'In good working order', 'Meets required standards', 'Operating correctly', 'No defects found'],
          'GOOD': ['Good condition', 'Working properly', 'Well maintained', 'Functions effectively', 'System optimal', 'Equipment intact'],
          'UNSATISFACTORY': ['Requires attention', 'Maintenance needed', 'Below standard', 'Needs repair', 'Defect noted', 'Action required'],
          'NOT SEEN': ['Not accessible during inspection', 'Not tested', 'Area locked', 'Equipment not available', 'Pending further check']
        };

        const getRandomStatus = () => {
          const r = Math.random();
          let cumulative = 0;
          for (let i = 0; i < STATUSES.length; i++) {
            cumulative += STATUS_WEIGHTS[i];
            if (r <= cumulative) return STATUSES[i];
          }
          return STATUSES[0];
        };

        let finalAns = activeItem?.ans || tmpl.ans || getRandomStatus();
        if (finalAns === 'EMPTY' || finalAns === '') {
          finalAns = getRandomStatus();
        }

        let finalComments = activeItem?.comments || tmpl.comments || '';
        if (!finalComments || finalComments === 'EMPTY' || finalComments === '') {
          const suggestions = COMMENTS_MAPPING[finalAns] || ['Condition satisfactory'];
          finalComments = suggestions[Math.floor(Math.random() * suggestions.length)];
        }

        const entry = {
          rule_ref: tmpl.rule_ref,
          requirements: tmpl.requirements,
          ans: finalAns,
          comments: finalComments,
          image: activeItem?.image || tmpl.image || '',
          vessel_id: vesselId,
          company_id: companyId,
          report_id: newReportId,
          user_id: userId
        };

        if (cat === 'machinery_arrangements' || cat === 'pollution_prevention_for_tankers') {
          entry.item_no = tmpl.s_no || tmpl.item_no;
        } else {
          entry.s_no = tmpl.s_no || tmpl.item_no;
        }

        return entry;
      });

      if (itemsToInsert.length > 0) {
        const { error: insertErr } = await supabase
          .from(cat)
          .insert(itemsToInsert);

        if (!insertErr) {
          clonedCategoriesCount++;
          if (activeItems && activeItems.length > 0) {
            await supabase
              .from(cat)
              .delete()
              .eq('vessel_id', vesselId)
              .is('report_id', null);
          }
        } else {
          console.error(`❌ Error inserting cloned items for ${cat}:`, insertErr.message);
        }
      }
    } catch (err) {
      console.error(`❌ Failed to clone category ${cat}:`, err);
    }
  }

  console.log(`🎉 Finished! Successfully cloned ${clonedCategoriesCount} categories into Report ${newReportId}.`);
}

submitReport();
