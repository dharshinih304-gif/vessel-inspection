const fs = require('fs');
const path = require('path');
const axios = require('axios');

const EDGE_FUNCTION_BASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

const VESSEL_ID = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
const COMPANY_ID = 'c1348bc9-16cd-4d5f-ad32-bf752c69e223';
const USER_ID = '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2';

const STATUSES = ['SATISFACTORY', 'GOOD', 'UNSATISFACTORY', 'NOT SEEN'];
const STATUS_WEIGHTS = [0.25, 0.25, 0.25, 0.25]; // Even distribution for testing
const COMMENTS_MAPPING = {
  'SATISFACTORY': ['Condition satisfactory', 'No abnormalities observed', 'Inspection completed successfully', 'In good working order', 'Meets required standards'],
  'GOOD': ['Good condition', 'Working properly', 'Well maintained', 'Functions effectively', 'Equipment intact'],
  'UNSATISFACTORY': ['Requires attention', 'Maintenance needed', 'Below standard', 'Needs repair', 'Defect noted'],
  'NOT SEEN': ['Not accessible during inspection', 'Not tested', 'Area locked', 'Pending further check']
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

async function fillAllFromDB() {
  console.log('Starting population of all 51 categories for Ocean Sea from DB templates...');

  for (const cat of CATEGORIES) {
    if (cat === 'certificate') continue;

    console.log(`Fetching templates for ${cat}...`);
    let rawData = [];
    try {
      const res = await axios.get(`${EDGE_FUNCTION_BASE_URL}${cat}?limit=500`, {
        headers: { apikey: anonKey, Authorization: 'Bearer ' + anonKey }
      });
      rawData = res.data;
    } catch (e) {
      console.log(`[SKIP] Could not fetch ${cat}: ${e.message}`);
      continue;
    }

    if (!rawData || rawData.length === 0) {
      console.log(`[SKIP] No data in DB for ${cat}`);
      continue;
    }

    // Deduplicate
    const uniqueItems = [];
    const seenSNo = new Set();
    for (const item of rawData) {
      const sNo = item.s_no || item.item_no;
      if (sNo && !seenSNo.has(sNo)) {
        seenSNo.add(sNo);
        uniqueItems.push(item);
      }
    }

    if (uniqueItems.length === 0) continue;

    console.log(`Found ${uniqueItems.length} unique items for ${cat}. Populating Ocean Sea...`);

    // Clean up old ones for this vessel to avoid conflicts
    try {
      await axios.delete(`${EDGE_FUNCTION_BASE_URL}${cat}?vessel_id=eq.${VESSEL_ID}`, {
        headers: { apikey: anonKey, Authorization: 'Bearer ' + anonKey }
      });
    } catch(e) {}

    // Insert new ones
    for (const tmpl of uniqueItems) {
      const ans = getRandomStatus();
      const suggestions = COMMENTS_MAPPING[ans];
      const comments = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      const payload = {
        s_no: tmpl.s_no || tmpl.item_no,
        rule_ref: tmpl.rule_ref || '-',
        requirements: tmpl.requirements || '-',
        ans: ans,
        comments: comments,
        image: '',
        vessel_id: VESSEL_ID,
        company_id: COMPANY_ID,
        report_id: null,
        user_id: USER_ID
      };

      try {
        await axios.post(`${EDGE_FUNCTION_BASE_URL}${cat}`, payload, {
          headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey }
        });
      } catch (err) {
        // silently ignore inserts that fail
      }
    }
  }

  console.log('Finished populating Ocean Sea across all categories!');
}

fillAllFromDB();
