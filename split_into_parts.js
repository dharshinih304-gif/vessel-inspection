const fs = require('fs');
const path = require('fs');

const content = fs.readFileSync('seed_active_checklists.sql', 'utf8');
// Split by INSERT INTO or DELETE FROM but keep transactions intact.
// Actually, we can just split by lines.
// Strip BEGIN; and COMMIT; if they exist
let rawContent = content.replace(/^BEGIN;\s*/i, '').replace(/\s*COMMIT;\s*$/i, '');
const lines = rawContent.split('\n');
const totalLines = lines.length;
const partsCount = 6;
const linesPerPart = Math.ceil(totalLines / partsCount);

for (let i = 0; i < partsCount; i++) {
  const start = i * linesPerPart;
  const end = Math.min(start + linesPerPart, totalLines);
  let partLines = lines.slice(start, end);
  
  let partSql = partLines.join('\n').trim();
  
  fs.writeFileSync(`part_${i + 1}.sql`, partSql);
  console.log(`Saved part_${i + 1}.sql with ${partLines.length} lines`);
}
