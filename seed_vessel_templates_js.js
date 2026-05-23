require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const content = fs.readFileSync('seed_active_checklists.sql', 'utf8');
  const lines = content.split('\n');
  
  for (let line of lines) {
    if (line.startsWith('DELETE FROM')) {
      const match = line.match(/public\.([a-zA-Z0-9_]+) WHERE vessel_id = '([^']+)'/);
      if (match) {
        const table = match[1];
        const vesselId = match[2];
        console.log('Deleting from', table, vesselId);
        await supabase.from(table).delete().eq('vessel_id', vesselId).is('report_id', null);
      }
    } else if (line.startsWith('INSERT INTO')) {
      const match = line.match(/public\.([a-zA-Z0-9_]+) \(([^)]+)\) VALUES \((.+)\);/);
      if (match) {
        const table = match[1];
        const cols = match[2].split(',').map(c => c.trim());
        const valsStr = match[3];
        
        // Basic CSV parsing for values
        const vals = [];
        let inString = false;
        let currentVal = '';
        for(let i=0; i<valsStr.length; i++) {
          const char = valsStr[i];
          if(char === "'") {
            inString = !inString;
          } else if(char === ',' && !inString) {
            vals.push(currentVal.trim());
            currentVal = '';
          } else {
            currentVal += char;
          }
        }
        vals.push(currentVal.trim());
        
        const obj = {};
        for(let i=0; i<cols.length; i++) {
          let val = vals[i];
          if(val === 'NULL') val = null;
          else if(val && val.startsWith("'") && val.endsWith("'")) {
             val = val.substring(1, val.length - 1);
             val = val.replace(/''/g, "'"); // unescape SQL single quotes
          } else if (val && val.includes('SELECT id FROM public.reports')) {
             val = null; // Important: Make it a vessel template!
          }
          obj[cols[i]] = val;
        }
        
        const { error } = await supabase.from(table).insert(obj);
        if (error) console.error('Error inserting into', table, error.message);
      }
    }
  }
  console.log('Finished processing all lines!');
}
run();
