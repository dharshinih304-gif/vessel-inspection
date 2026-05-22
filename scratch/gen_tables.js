
const tables = [
  'ballast_tanks', 'bulk', 'cargo_lifting_gear', 'cargo_tanks', 'certificate',
  'communication', 'constructive_fire_protection', 'container_specifies',
  'crew_accommodation', 'crew_evaluation', 'crew_health', 'crew_safety',
  'deck', 'deck_machinery', 'document_control', 'electrical_items',
  'engine_room', 'fire_fighting_equipment', 'firefighting_fixed_system',
  'hatch_coamings', 'hatch_covers', 'holds', 'hull_inboard', 'hull_outboard',
  'hull_structure', 'life_saving_apparatus', 'machinery_arrangements',
  'maintenance_equipment', 'materials', 'mooring_arrangements',
  'navigational_equipment', 'oil_pollution_equipment', 'pctc_specifics',
  'pilot_boarding_arrangements', 'pollution_prevention', 'pollution_prevention_tankers',
  'protection_against_flooding', 'publication_documents', 'pumps_performance',
  'radio_equipments', 'radio_navigation', 'reporting_systems',
  'safety_equipment', 'safety_of_navigation', 'sea_trial', 'ships_pyrotechnics',
  'supply_connections', 'tankage', 'tanker_equipment', 'tanker_specifics', 'towing'
];

let sql = '';
tables.forEach(table => {
    sql += `
CREATE TABLE IF NOT EXISTS ${table} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vesselId UUID REFERENCES vessels(id),
    s_no TEXT,
    requirements TEXT,
    rule_ref TEXT,
    ans TEXT,
    comments TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON ${table};
CREATE POLICY "Allow public read access" ON ${table} FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON ${table};
CREATE POLICY "Allow authenticated insert" ON ${table} FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON ${table};
CREATE POLICY "Allow authenticated update" ON ${table} FOR UPDATE USING (true);

INSERT INTO ${table} (s_no, requirements, rule_ref)
VALUES 
('1.1', 'Requirement 1 for ${table.replace(/_/g, ' ')}', 'SOLAS CH II'),
('1.2', 'Requirement 2 for ${table.replace(/_/g, ' ')}', 'MARPOL ANNEX I')
ON CONFLICT DO NOTHING;
`;
});

console.log(sql);
