const fs = require('fs');
const path = require('path');
const axios = require('axios');

const EDGE_FUNCTION_BASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

const VESSEL_ID = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

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

async function insertAllCertificates() {
  const dataPath = path.join(__dirname, '../data/reports_converted.json');
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Filter for certificate category and unique S.NO
  const certItems = rawData.filter(item => item['S.NO'] && item['S.NO'].startsWith('CER-'));
  
  const uniqueItems = [];
  const seenSNo = new Set();
  
  for (const item of certItems) {
    if (!seenSNo.has(item['S.NO'])) {
      seenSNo.add(item['S.NO']);
      uniqueItems.push(item);
    }
  }

  console.log(`Found ${uniqueItems.length} unique certificate questions!`);

  try {
    console.log('Cleaning up old records for Ocean Sea...');
    await axios.delete(EDGE_FUNCTION_BASE_URL + 'certificate?vessel_id=eq.' + VESSEL_ID, {
      headers: { apikey: anonKey, Authorization: 'Bearer ' + anonKey }
    });
  } catch(e) {
    console.log('Cleanup error:', e.response?.data || e.message);
  }

  console.log('Inserting full list...');
  for (const item of uniqueItems) {
    const ans = getRandomStatus();
    const suggestions = COMMENTS_MAPPING[ans];
    const comments = suggestions[Math.floor(Math.random() * suggestions.length)];

    const payload = {
      s_no: item['S.NO'],
      rule_ref: '-',
      requirements: item['CERTIFICATE'] || item['REQUIREMENTS'] || '-',
      ans: ans,
      comments: comments,
      image: '',
      vessel_id: VESSEL_ID,
      company_id: 'c1348bc9-16cd-4d5f-ad32-bf752c69e223',
      report_id: null,
      user_id: '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2'
    };

    try {
      await axios.post(EDGE_FUNCTION_BASE_URL + 'certificate', payload, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
          'Authorization': 'Bearer ' + anonKey
        }
      });
      console.log(`Inserted ${item['S.NO']}`);
    } catch (err) {
      console.error(`Failed to insert ${item['S.NO']}:`, err.response?.data || err.message);
    }
  }

  console.log('Finished inserting all certificates!');
}

insertAllCertificates();
