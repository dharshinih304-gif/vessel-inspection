const fs = require('fs');
for(let i=1; i<=6; i++) {
  try {
    let content = fs.readFileSync('update_comments_part'+i+'.sql', 'utf8');
    content = content.replace(/"vesselId"/g, 'vessel_id');
    // Also remove the navigation_equipment from part 3 since it's wrong
    if (i === 3) {
      content = content.replace(/UPDATE navigation_equipment[\s\S]*?'b4871f10-60cc-4a4a-a49b-bb22b290f206';\s*/g, '');
    }
    fs.writeFileSync('update_comments_part'+i+'.sql', content);
    console.log('Fixed part ' + i);
  } catch(e) {
    console.error(e.message);
  }
}
