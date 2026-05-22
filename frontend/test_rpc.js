const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFileContent = fs.readFileSync('.env.local', 'utf8');
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

const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function testRpc() {
  const { data: rawUser, error: rpcError } = await supabase.rpc('verify_user_password', {
    p_email: 'admin@sellamsoft.com',
    p_password: 'admin123'
  });

  if (rpcError) {
    console.error('RPC Error:', rpcError);
  } else {
    console.log('RPC Output:', rawUser);
    const dbUser = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    console.log('Parsed User:', dbUser);
    console.log('User Role:', dbUser.role);
  }
}

testRpc();
