const axios = require('axios');

const EDGE_FUNCTION_BASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

const VESSEL_ID = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

const CERTIFICATE_TEMPLATES = [
  { s_no: 'CER-01', requirements: 'CERTIFICATE OF REGISTRY' },
  { s_no: 'CER-02', requirements: 'CERTIFICATE OF MINIMUM SAFE MANNING' },
  { s_no: 'CER-03', requirements: 'CERTIFICATE OF CLASSIFICATION' },
  { s_no: 'CER-04', requirements: 'CERTIFICATE OF LOAD LINE INTERNATIONAL (CONCURRENT)' },
  { s_no: 'CER-05', requirements: 'CERTIFICATE OF SAFETY CONSTRUCTION' },
  { s_no: 'CER-06', requirements: 'CERTIFICATE OF FITNESS FOR CARRIAGE OF NOXIOUS LIQUID IN BULK' },
  { s_no: 'CER-07', requirements: 'IINTERNATIONAL AIR POLLUTION PREVENTION CERTIFICATE (IAPP)' },
  { s_no: 'CER-08', requirements: 'IINTERNATIONAL OIL POLLUTION PREVENTION CERTIFICATE (IOPP)' },
  { s_no: 'CER-09', requirements: 'I.S.P.P. CERTIFICATE (SEWAGE)' },
];

async function insertCertificate() {
  console.log(`Inserting ${CERTIFICATE_TEMPLATES.length} certificate rows via API...`);

  for (const tmpl of CERTIFICATE_TEMPLATES) {
    const payload = {
      s_no: tmpl.s_no,
      rule_ref: '-',
      requirements: tmpl.requirements,
      ans: 'SATISFACTORY',
      comments: 'Valid and meets required standards',
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
      console.log(`Inserted ${tmpl.s_no}`);
    } catch (err) {
      console.error(`Failed to insert ${tmpl.s_no}:`, err.response?.data || err.message);
    }
  }

  console.log('Done!');
}

insertCertificate();
