const axios = require('axios');
require('dotenv').config({path: '.env.local'});
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const testId = '046d00b8-0559-4a93-bf80-24b19f8d01a0'; // from our previous sql query
axios.put(`https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/ballast_tanks?id=${testId}`, 
  { ans: 'GOOD', comments: 'Test comment' },
  { headers: { Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' } }
).then(r => console.log('OK', r.data))
 .catch(e => console.error('ERR', e.response?.status, e.response?.data));
