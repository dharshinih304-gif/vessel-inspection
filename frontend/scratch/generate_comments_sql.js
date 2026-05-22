const fs = require('fs');

const CATEGORIES = [
  'ballast_tanks', 'bulk', 'cargo_lifting_gear', 'cargo_tanks', 'certificate',
  'communication', 'constructive_fire_protection', 'container_specifies',
  'crew_accommodation', 'crew_evaluation', 'crew_health', 'crew_safety',
  'deck', 'deck_machinery', 'document_control', 'electrical_items',
  'engine_room', 'fire_fighting_equipment', 'firefighting_fixed_system',
  'hatch_coamings', 'hatch_covers', 'holds', 'hull_inboard', 'hull_outboard',
  'hull_structure', 'life_saving_apparatus', 'machinery_arrangements',
  'maintenance_equipment', 'materials', 'mooring_arrangements',
  'navigational_equipment', 'navigation_equipment', 'oil_pollution_equipment', 'pctc_specifics',
  'pilot_boarding_arrangements', 'pollution_prevention', 'pollution_prevention_tankers',
  'protection_against_flooding', 'publication_documents', 'pumps_performance',
  'radio_equipments', 'radio_navigation', 'reporting_systems',
  'safety_equipment', 'safety_of_navigation', 'sea_trial', 'ships_pyrotechnics',
  'supply_connections', 'tankage', 'tanker_equipment', 'tanker_specifics', 'towing'
];

const arrayStr = `ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN']`;

function getSQLForCategory(cat) {
  let sql = '';
  // First, randomize the ans column correctly for all rows
  sql += `UPDATE ${cat} SET ans = (${arrayStr})[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';\n`;
  
  // Second, update the comments based on the updated ans values
  sql += `UPDATE ${cat} SET comments = CASE
  WHEN ans = 'GOOD' THEN (ARRAY[
    'Good condition',
    'Working properly',
    'Well maintained'
  ])[floor(random() * 3 + 1)]
  WHEN ans = 'SATISFACTORY' THEN (ARRAY[
    'Condition satisfactory',
    'No abnormalities observed',
    'Inspection completed successfully'
  ])[floor(random() * 3 + 1)]
  WHEN ans = 'UNSATISFACTORY' THEN (ARRAY[
    'Corrosion observed',
    'Repair required',
    'Further inspection needed'
  ])[floor(random() * 3 + 1)]
  WHEN ans = 'NOT SEEN' THEN (ARRAY[
    'Area inaccessible at the time of inspection',
    'Inspection deferred',
    'Item not available for viewing'
  ])[floor(random() * 3 + 1)]
  ELSE 'Initial audit record'
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';\n\n`;
  return sql;
}

// Split into 5 chunks of ~11 categories each
const chunkSize = 11;
for (let i = 0; i < CATEGORIES.length; i += chunkSize) {
  const chunk = CATEGORIES.slice(i, i + chunkSize);
  let chunkSql = '';
  for (const cat of chunk) {
    chunkSql += getSQLForCategory(cat);
  }
  const chunkIndex = Math.floor(i / chunkSize) + 1;
  const fileName = `D:/inspection/frontend/scratch/update_comments_part${chunkIndex}.sql`;
  fs.writeFileSync(fileName, chunkSql);
  console.log(`Generated ${fileName} for ${chunk.length} categories.`);
}
