require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const postgres = require('postgres'); // Need a postgres client to run raw SQL

async function run() {
  const connectionString = 'postgresql://postgres:T87L55w25XwP9s1P@db.dobpdssgdfaiharnmpdf.supabase.co:5432/postgres';
  
  const sql = postgres(connectionString, { ssl: 'require' });

  for (let i = 1; i <= 23; i++) {
    const chunkPath = path.join(__dirname, `chunk_${i}.sql`);
    if (fs.existsSync(chunkPath)) {
      console.log(`Executing ${chunkPath}...`);
      const chunkSql = fs.readFileSync(chunkPath, 'utf8');
      try {
        await sql.unsafe(chunkSql);
        console.log(`✅ Chunk ${i} executed successfully.`);
      } catch (err) {
        console.error(`❌ Error executing chunk ${i}:`, err.message);
      }
    }
  }

  await sql.end();
  console.log('All chunks processed.');
}

run();
