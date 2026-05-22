const axios = require('axios');
require('dotenv').config({path: '.env.local'});
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
axios.get('https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/bright-action/ballast_tanks', {
  headers: { Authorization: `Bearer ${anonKey}` }
}).then(r => console.log('OK', r.data.length))
  .catch(e => console.error('ERR', e.response?.status, e.response?.data));
