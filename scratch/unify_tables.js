
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
-- Table: ${table}
DO $$ 
BEGIN
    -- Create table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '${table}') THEN
        CREATE TABLE public.${table} (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "vesselId" UUID,
            s_no TEXT,
            requirements TEXT,
            rule_ref TEXT,
            ans TEXT,
            comments TEXT,
            image TEXT,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    ELSE
        -- Fix existing table schema
        -- Rename item_label to requirements if it exists
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = '${table}' AND column_name = 'item_label') THEN
            ALTER TABLE public.${table} RENAME COLUMN item_label TO requirements;
        END IF;
        
        -- Rename item_id to s_no if it exists
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = '${table}' AND column_name = 'item_id') THEN
            ALTER TABLE public.${table} RENAME COLUMN item_id TO s_no;
        END IF;

        -- Rename image_url to image if it exists
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = '${table}' AND column_name = 'image_url') THEN
            ALTER TABLE public.${table} RENAME COLUMN image_url TO image;
        END IF;

        -- Add missing columns
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = '${table}' AND column_name = 'vesselId') THEN
            ALTER TABLE public.${table} ADD COLUMN "vesselId" UUID;
        END IF;

        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = '${table}' AND column_name = 'ans') THEN
            ALTER TABLE public.${table} ADD COLUMN ans TEXT;
        END IF;

        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = '${table}' AND column_name = 'rule_ref') THEN
            ALTER TABLE public.${table} ADD COLUMN rule_ref TEXT;
        END IF;
    END IF;
END $$;

-- Enable RLS and policies
ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.${table};
CREATE POLICY "Allow public read access" ON public.${table} FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.${table};
CREATE POLICY "Allow authenticated insert" ON public.${table} FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON public.${table};
CREATE POLICY "Allow authenticated update" ON public.${table} FOR UPDATE USING (true);
`;
});

console.log(sql);
