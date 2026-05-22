const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

async function run() {
  const connectionString = 'postgresql://postgres:T87L55w25XwP9s1P@db.dobpdssgdfaiharnmpdf.supabase.co:5432/postgres';
  
  const sql = postgres(connectionString, { ssl: 'require' });

  for (let i = 3; i <= 6; i++) {
    const chunkPath = path.join(__dirname, `update_comments_part${i}.sql`);
    if (fs.existsSync(chunkPath)) {
      console.log(`Executing ${chunkPath}...`);
      const chunkSql = fs.readFileSync(chunkPath, 'utf8');
      try {
        await sql.unsafe(chunkSql);
        console.log(`✅ Part ${i} executed successfully.`);
      } catch (err) {
        console.error(`❌ Error executing part ${i}:`, err.message);
      }
    } else {
        console.log(`File not found: ${chunkPath}`);
    }
  }

  await sql.end();
  console.log('All parts processed.');
}

run();
