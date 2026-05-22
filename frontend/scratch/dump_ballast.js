const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('D:/inspection/frontend/.env.local', 'utf8').split('\n').reduce((acc, line) => { 
  const m = line.match(/^([A-Z_]+)=(.*)$/); 
  if (m) acc[m[1]] = m[2].replace(/['"]/g, '').trim(); 
  return acc; 
}, {}); 

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY); 

async function check() { 
  const {data} = await supabase.from('ballast_tanks').select('id, vessel_id, s_no, ans'); 
  console.log(data);
} 

check();
