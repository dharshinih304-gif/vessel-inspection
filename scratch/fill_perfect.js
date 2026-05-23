const fs = require('fs');
const axios = require('axios');

const EDGE_FUNCTION_BASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

const VESSEL_ID = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
const COMPANY_ID = 'c1348bc9-16cd-4d5f-ad32-bf752c69e223';
const USER_ID = '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2';

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

async function fill() {
  console.log('Starting exact insertion for Ocean Sea...');

  for (const cat of CATEGORIES) {
    console.log(`Processing ${cat}...`);
    let rawData = [];
    try {
      const res = await axios.get(`${EDGE_FUNCTION_BASE_URL}${cat}?limit=500`, {
        headers: { apikey: anonKey, Authorization: 'Bearer ' + anonKey }
      });
      rawData = res.data;
    } catch (e) {
      console.log(`  -> Failed to fetch templates for ${cat}: ${e.message}`);
      continue;
    }

    const uniqueItems = [];
    const seenSNo = new Set();
    for (const item of rawData) {
      const sNo = item.s_no || item.item_no;
      if (sNo && !seenSNo.has(sNo)) {
        seenSNo.add(sNo);
        uniqueItems.push(item);
      }
    }

    for (const tmpl of uniqueItems) {
      const payload = {
        s_no: tmpl.s_no || tmpl.item_no,
        rule_ref: tmpl.rule_ref || '-',
        requirements: tmpl.requirements || '-',
        ans: 'GOOD',
        comments: 'Condition verified during inspection',
        image: '',
        vessel_id: VESSEL_ID,
        company_id: COMPANY_ID,
        report_id: null,
        user_id: USER_ID
      };

      // Retry mechanism to avoid 500s or 429s causing missing rows
      let retries = 3;
      while (retries > 0) {
        try {
          await axios.post(`${EDGE_FUNCTION_BASE_URL}${cat}`, payload, {
            headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey }
          });
          break; // Success
        } catch (err) {
          retries--;
          if (retries === 0) {
             console.error(`  -> Failed ${payload.s_no}:`, err.response?.data || err.message);
          } else {
             // wait 500ms and retry
             await new Promise(r => setTimeout(r, 500));
          }
        }
      }
    }
    console.log(`  -> Finished ${cat} (${uniqueItems.length} items)`);
    // Add a slight delay between categories
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('All done!');
}

fill();
