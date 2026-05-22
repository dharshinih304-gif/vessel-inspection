const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read keys from .env.local
const envFileContent = fs.readFileSync('D:/inspection/frontend/.env.local', 'utf8');
const envVars = {};
envFileContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    envVars[match[1]] = value;
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUser() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'admin@sellamsoft.com')
    .single();

  if (error) {
    console.error('Error fetching admin user:', error);
  } else {
    console.log('Admin user profile in DB:', data);
  }
}

checkUser();
