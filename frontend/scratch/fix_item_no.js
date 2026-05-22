const fs = require('fs');
const axios = require('axios');

const EDGE_FUNCTION_BASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

const VESSEL_ID = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
const COMPANY_ID = 'c1348bc9-16cd-4d5f-ad32-bf752c69e223';
const USER_ID = '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2';

const CATEGORIES = [
  'machinery_arrangements', 'maintenance_equipment', 'materials', 'mooring_arrangements', 'navigational_equipment',
  'oil_pollution_equipment', 'pctc_specifics', 'pilot_boarding_arrangements', 'pollution_prevention',
  'pollution_prevention_for_tankers', 'protection_against_flooding', 'publication_documents', 'pumps_performance',
  'radio_equipments', 'radio_navigation', 'reporting_systems', 'safety_equipment', 'safety_of_navigation',
  'sea_trial_if_available', 'ships_pyrotechnics', 'supply_connections', 'tankage', 'tanker_equipment',
  'tanker_specifics', 'towing'
];

async function fill() {
  console.log('Starting fix insertion for remaining tables...');

  for (const cat of CATEGORIES) {
    console.log(`Processing ${cat}...`);
    let rawData = [];
    try {
      const res = await axios.get(`${EDGE_FUNCTION_BASE_URL}${cat}?limit=500`, {
        headers: { apikey: anonKey, Authorization: 'Bearer ' + anonKey }
      });
      rawData = res.data;
    } catch (e) {
      continue;
    }

    const uniqueItems = [];
    const seenSNo = new Set();
    let usesItemNo = false;

    for (const item of rawData) {
      const sNo = item.s_no || item.item_no;
      if (item.item_no) usesItemNo = true;
      if (sNo && !seenSNo.has(sNo)) {
        seenSNo.add(sNo);
        uniqueItems.push(item);
      }
    }

    // Only process tables that use item_no because my previous script failed on them
    if (!usesItemNo) {
       console.log(`  -> Skipping ${cat} because it uses s_no`);
       continue;
    }

    for (const tmpl of uniqueItems) {
      const payload = {
        item_no: tmpl.item_no || tmpl.s_no,
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

      let retries = 3;
      while (retries > 0) {
        try {
          await axios.post(`${EDGE_FUNCTION_BASE_URL}${cat}`, payload, {
            headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey }
          });
          break;
        } catch (err) {
          retries--;
          if (retries === 0) {
             console.error(`  -> Failed ${payload.item_no}:`, err.response?.data || err.message);
          } else {
             await new Promise(r => setTimeout(r, 500));
          }
        }
      }
    }
    console.log(`  -> Finished ${cat} (${uniqueItems.length} items)`);
    await new Promise(r => setTimeout(r, 500));
  }
}

fill();
