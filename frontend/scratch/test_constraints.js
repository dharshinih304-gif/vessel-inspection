const axios = require('axios');

const EDGE_FUNCTION_BASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

async function testNullReportId(table) {
  const payload = {
    s_no: 'TEST-01',
    rule_ref: '-',
    requirements: 'TEST',
    ans: 'SATISFACTORY',
    comments: 'Test',
    image: '',
    vessel_id: 'b4871f10-60cc-4a4a-a49b-bb22b290f206',
    company_id: 'c1348bc9-16cd-4d5f-ad32-bf752c69e223',
    report_id: null,
    user_id: '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2'
  };

  try {
    const res = await axios.post(EDGE_FUNCTION_BASE_URL + table, payload, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': 'Bearer ' + anonKey
      }
    });
    console.log(`[${table}] Success! ID: ${res.data[0]?.id}`);
    
    // Cleanup
    if (res.data[0]?.id) {
      await axios.delete(EDGE_FUNCTION_BASE_URL + table + '?id=eq.' + res.data[0].id, {
        headers: { apikey: anonKey, Authorization: 'Bearer ' + anonKey }
      });
    }
  } catch (err) {
    console.error(`[${table}] Failed:`, err.response?.data || err.message);
  }
}

async function run() {
  await testNullReportId('ballast_tanks');
  await testNullReportId('certificate');
}

run();
