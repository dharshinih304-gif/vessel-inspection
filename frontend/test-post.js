const axios = require('axios');
require('dotenv').config({path: '.env.local'});
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Simulate exactly what InspectionTable.jsx is doing for handleSaveAll
async function testInsert() {
  try {
    // 1. Fetch template data
    const res = await axios.get('https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/ballast_tanks', {
      headers: { Authorization: `Bearer ${anonKey}` }
    });
    
    const templates = res.data;
    if (!templates.length) return console.log('No templates found');
    
    const rowToInsert = templates[0];
    
    // 2. Build payload exactly like frontend
    const payload = {
        ...rowToInsert,
        ans: 'SATISFACTORY',
        comments: 'Condition satisfactory',
        vessel_id: 'b4871f10-60cc-4a4a-a49b-bb22b290f206',
        company_id: rowToInsert.company_id,
        user_id: rowToInsert.user_id,
        report_id: rowToInsert.report_id
    };
    delete payload.id;
    delete payload.created_at;
    delete payload._isTemplate;
    
    console.log('Sending payload:', JSON.stringify(payload, null, 2));
    
    // 3. POST it
    const postRes = await axios.post('https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/ballast_tanks', 
      payload,
      { headers: { Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' } }
    );
    
    console.log('SUCCESS:', postRes.data);
  } catch (err) {
    console.error('ERROR 500:', err.response?.status, err.response?.data);
  }
}

testInsert();
