import InspectionTable from '../components/InspectionTable'

function Dashboard() {

    const tables = [

        'ballast_tanks',
        'bulk',
        'cargo_lifting_gear',
        'cargo_tanks',
        'certificate',
        'communication',
        'constructive_fire_protection',
        'container_specifies',
        'crew_accommodation',
        'crew_evaluation',
        'crew_health',
        'crew_safety',
        'deck',
        'deck_machinery',
        'document_control',
        'electrical_items',
        'engine_room',
        'fire_fighting_equipment',
        'firefighting_fixed_system',
        'hatch_coamings',
        'hatch_covers',
        'holds',
        'hull_inboard',
        'hull_outboard',
        'hull_structure',
        'life_saving_apparatus',
        'machinery_arrangements',
        'maintenance_equipment',
        'materials',
        'mooring_arrangements',
        'navigational_equipment',
        'oil_pollution_equipment',
        'pctc_specifics',
        'pilot_boarding_arrangements',
        'pollution_prevention',
        'pollution_prevention_tankers',
        'protection_against_flooding',
        'publication_documents',
        'pumps_performance',
        'radio_equipments',
        'radio_navigation',
        'reporting_systems',
        'safety_equipment',
        'safety_of_navigation',
        'sea_trial',
        'ships_pyrotechnics',
        'supply_connections',
        'tankage',
        'tanker_equipment',
        'tanker_specifics',
        'towing'

    ]

    return (

        <div>

            {tables.map((table) => (

                <InspectionTable
                    key={table}
                    tableName={table}
                />

            ))}

        </div>
    )
}

export default Dashboard