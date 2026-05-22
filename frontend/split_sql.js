const fs = require('fs');
const path = require('path');

const SQL_PATH = path.join(__dirname, 'seed_active_checklists.sql');

function main() {
  if (!fs.existsSync(SQL_PATH)) {
    console.error('SQL seed file not found!');
    return;
  }
  
  let content = fs.readFileSync(SQL_PATH, 'utf8');

  // Replace report_id query with NULL
  content = content.replace(/\(SELECT id FROM public\.reports WHERE vessel_id = '[^']+' AND category_name = '[^']+' LIMIT 1\)/g, 'NULL');
  
  // Replace the DELETE statement to only delete vessel templates (report_id IS NULL)
  content = content.replace(/report_id = \(SELECT id FROM public\.reports WHERE vessel_id = '[^']+' AND category_name = '[^']+' LIMIT 1\)/g, 'report_id IS NULL');

  const lines = content.split('\n');
  
  const chunkSize = 100;
  let chunkIndex = 1;
  
  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunkLines = lines.slice(i, i + chunkSize);
    
    // Add BEGIN / COMMIT wrapping for safety if not already there
    let chunkSql = chunkLines.join('\n');
    if (!chunkSql.trim().startsWith('BEGIN;')) {
      chunkSql = 'BEGIN;\n' + chunkSql;
    }
    if (!chunkSql.trim().endsWith('COMMIT;')) {
      chunkSql = chunkSql + '\nCOMMIT;';
    }
    
    const chunkPath = path.join(__dirname, `chunk_${chunkIndex}.sql`);
    fs.writeFileSync(chunkPath, chunkSql);
    console.log(`Saved Chunk ${chunkIndex} (${chunkLines.length} lines) to ${chunkPath}`);
    chunkIndex++;
  }
}

main();
