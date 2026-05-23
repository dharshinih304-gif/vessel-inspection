const fs = require('fs');
const sql = fs.readFileSync('D:/inspection/frontend/scratch/mass_insert.sql', 'utf8');

const lines = sql.split('\n');
const chunks = [];
let currentChunk = '';
for (const line of lines) {
  currentChunk += line + '\n';
  if (currentChunk.length > 80000 && line.trim().endsWith(';')) {
    chunks.push(currentChunk);
    currentChunk = '';
  }
}
if (currentChunk.trim().length > 0) {
  chunks.push(currentChunk);
}

for (let i = 0; i < chunks.length; i++) {
  fs.writeFileSync(`D:/inspection/frontend/scratch/mass_insert_part${i + 1}.sql`, chunks[i]);
  console.log(`Part ${i + 1} size: ${chunks[i].length}`);
}
