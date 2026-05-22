const fs = require('fs');
const axios = require('axios');

const EDGE_FUNCTION_BASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

const VESSEL_ID = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
const COMPANY_ID = 'c1348bc9-16cd-4d5f-ad32-bf752c69e223';
const USER_ID = '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2';

async function testBallastTanks() {
  const cat = 'ballast_tanks';
  console.log(`Fetching templates for ${cat}...`);
  let rawData = [];
  try {
    const res = await axios.get(`${EDGE_FUNCTION_BASE_URL}${cat}?limit=500`, {
      headers: { apikey: anonKey, Authorization: 'Bearer ' + anonKey }
    });
    rawData = res.data;
  } catch (e) {
    console.log(`[SKIP] Could not fetch ${cat}: ${e.message}`);
    return;
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
      comments: 'Test',
      image: '',
      vessel_id: VESSEL_ID,
      company_id: COMPANY_ID,
      report_id: null,
      user_id: USER_ID
    };

    try {
      const res = await axios.post(`${EDGE_FUNCTION_BASE_URL}${cat}`, payload, {
        headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey }
      });
      console.log(`Inserted ${payload.s_no}:`, res.data);
    } catch (err) {
      console.error(`Failed ${payload.s_no}:`, err.response?.data || err.message);
    }
  }
}

testBallastTanks();
