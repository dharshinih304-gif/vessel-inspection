const fs = require('fs');
const CATEGORIES = [
  'ballast_tanks', 'bulk', 'cargo_lifting_gear', 'cargo_tanks', 'certificate',
  'communication', 'constructive_fire_protection', 'container_specifies',
  'crew_accommodation', 'crew_evaluation', 'crew_health', 'crew_safety',
  'deck', 'deck_machinary', 'document_control', 'electrical_items',
  'engine_room', 'fire_fighting_equipment', 'firefighting_fixed_system',
  'hatch_coamings', 'hatch_covers', 'holds', 'hull_inboard', 'hull_outboard',
  'hull_structure', 'life_saving_apparatus', 'machinery_arrangements',
  'maintenance_equipment', 'materials', 'mooring_arrangements',
  'navigational_equipment', 'oil_pollution_equipment', 'pctc_specifics',
  'pilot_boarding_arrangements', 'pollution_prevention', 'pollution_prevention_for_tankers',
  'protection_against_flooding', 'publication_documents', 'pumps_performance',
  'radio_equipments', 'radio_navigation', 'reporting_systems',
  'safety_equipment', 'safety_of_navigation', 'sea_trial_if_available', 'ships_pyrotechnics',
  'supply_connections', 'tankage', 'tanker_equipment', 'tanker_specifics', 'towing'
];

let sql = '';
for (const cat of CATEGORIES) {
  // Delete where there exists another row with the same s_no and vessel_id but with an older (smaller) created_at.
  // Wait, some rows might have exactly the same created_at, so use id as tie-breaker
  sql += `
DELETE FROM ${cat} a USING (
  SELECT MIN(ctid) as ctid, s_no, vessel_id
  FROM ${cat}
  WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206'
  GROUP BY s_no, vessel_id HAVING COUNT(*) > 1
) b
WHERE a.s_no = b.s_no 
AND a.vessel_id = b.vessel_id
AND a.ctid <> b.ctid;
`;
}
fs.writeFileSync('D:/inspection/frontend/scratch/dedup.sql', sql);
console.log('SQL generated!');
