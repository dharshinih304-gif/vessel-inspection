-- Clear existing items
DELETE FROM report_items;

-- Mapping legacy tables to unified report_items
INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '313cddb8-41eb-4db8-9f01-66c63688dca9', s_no, rule_ref, requirements FROM ballast_tanks;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '81186f13-4361-4de9-8245-067d1a45d3c3', s_no, NULL, requirements FROM bulk;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '612c1011-9c6c-498d-be67-abf2ac9f394e', s_no, rule_ref, requirements FROM cargo_lifting_gear;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '8c4ef250-2e94-4175-ae60-a5cf927a50a9', s_no, rule_ref, requirements FROM cargo_tanks;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '10e5e511-8114-4ac3-864c-dfdaad6f636d', s_no, rule_ref, requirements FROM certificate;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'd689924b-8fab-49e8-81fa-19aa1dafc8ba', s_no, rule_ref, requirements FROM communication;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '65c735b0-8103-4812-afbd-c78496fd128f', s_no, rule_ref, requirements FROM constructive_fire_protection;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'ee452675-3355-4f67-9340-017b46b89515', s_no, rule_ref, requirements FROM container_specifies;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'aad33a7a-ba76-428a-aaa4-f8156933fefe', s_no, rule_ref, requirements FROM crew_accommodation;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'c5426a1d-c52f-4a89-90ae-bbedc87335b9', s_no, rule_ref, requirements FROM crew_evaluation;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'c4207101-ef3d-4c88-8d84-0dbfee3363da', s_no, rule_ref, requirements FROM crew_health;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '342e5de1-9c1a-4604-93b5-128aa1f5ab84', s_no, rule_ref, requirements FROM crew_safety;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'c5574b6a-7cc3-4154-8a52-d9b3664e4831', s_no, rule_ref, requirements FROM deck;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'b20ad99b-818b-4551-83aa-a0f264cdaccd', s_no, rule_ref, requirements FROM deck_machinery;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '74ba7e54-a3e8-461b-9b1a-dbda80d054be', s_no, rule_ref, requirements FROM document_control;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '8285fa27-7595-42eb-92e2-030b45dc62ae', s_no, rule_ref, requirements FROM electrical_items;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'f8931507-8fd8-411f-b5c0-3c3d4445e3f9', s_no, rule_ref, requirements FROM engine_room;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'a01dc643-46aa-4c05-bc5b-f7069e742fd5', s_no, rule_ref, requirements FROM fire_fighting_equipment;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'b66dbd1b-5f73-4d30-b988-e6d2b73506fe', s_no, rule_ref, requirements FROM firefighting_fixed_system;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '8f326985-b9ec-4396-be17-2f878a8ced2b', s_no, rule_ref, requirements FROM hatch_coamings;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'c99ad7b7-32ec-4b12-a3af-4e32bf188e08', s_no, rule_ref, requirements FROM hatch_covers;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '02035dc3-a97a-44e2-912b-31ce85c51131', s_no, rule_ref, requirements FROM holds;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'd054fd53-1a63-46e8-b82b-ba01b65e9636', s_no, rule_ref, requirements FROM hull_inboard;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '26404b6f-8d3e-4170-84fa-14f001ac9def', s_no, rule_ref, requirements FROM hull_outboard;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '8c9d198c-cbca-4ccd-b910-e533adc3a1e1', s_no, rule_ref, requirements FROM hull_structure;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '50a70711-1ff1-451f-893e-e6ead2cb8901', s_no, rule_ref, requirements FROM life_saving_apparatus;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'a5af769c-caa4-4bdb-b111-999067527f7d', s_no, rule_ref, requirements FROM machinery_arrangements;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '0807628d-b11d-4de6-941f-491531d49444', s_no, rule_ref, requirements FROM maintenance_equipment;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '61fea67d-3ea6-4b8e-a105-994071aedf31', s_no, rule_ref, requirements FROM materials;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '28842f05-4ad6-4e44-bb5d-e355c8f09a95', s_no, rule_ref, requirements FROM mooring_arrangements;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '488b4896-f724-4c35-90a0-9abec4e27702', s_no, rule_ref, requirements FROM navigational_equipment;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'b1704134-5330-4514-b50d-b17263844c8c', s_no, rule_ref, requirements FROM oil_pollution_equipment;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '953f460f-e82f-4c1e-bb74-f1877852989b', s_no, rule_ref, requirements FROM pctc_specifics;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '6dcfc762-e7f4-4d97-9fd9-91a29cc0c9c6', s_no, rule_ref, requirements FROM pilot_boarding_arrangements;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '313733c3-8b46-4444-9b35-7fe6b7b1a5f0', s_no, rule_ref, requirements FROM pollution_prevention;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '30296588-62b7-4616-b906-561b1bda53c0', s_no, rule_ref, requirements FROM pollution_prevention_tankers;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '1ac91a34-de94-4ee4-a67f-b553ca88a0a3', s_no, rule_ref, requirements FROM protection_against_flooding;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '26a4bb6d-c348-4fb2-955d-9988c1a8fd45', s_no, rule_ref, requirements FROM publication_documents;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'd18d0d03-c5f6-45bb-8b98-82b82c0e47e6', s_no, rule_ref, requirements FROM pumps_performance;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'bf8f8756-9a71-486b-bf75-5b999420f41f', s_no, rule_ref, requirements FROM radio_equipments;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '8dcef4ba-c02f-4651-b684-59f6f2d4f756', s_no, rule_ref, requirements FROM radio_navigation;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'c79e74c3-3ae4-468e-991b-ac726fa1db8a', s_no, rule_ref, requirements FROM reporting_systems;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'e9e58a6a-f480-46a0-8936-053eca8472e8', s_no, rule_ref, requirements FROM safety_equipment;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'a9eb74e5-9515-442c-a5bd-984585207d6d', s_no, rule_ref, requirements FROM safety_of_navigation;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'c0e9d078-ff4d-4560-99c6-256bf4df2e64', s_no, rule_ref, requirements FROM sea_trial;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '3590c1ee-9029-4f37-9236-3f70c2d20849', s_no, rule_ref, requirements FROM ships_pyrotechnics;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'd4f5b2ac-f670-408d-9580-2a5f33c5daef', s_no, rule_ref, requirements FROM supply_connections;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT '17d325d6-23d6-4427-a572-082823789aaf', s_no, rule_ref, requirements FROM tankage;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'b9b97d15-3f24-4531-8340-796874376573', s_no, rule_ref, requirements FROM tanker_equipment;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'b8386c62-da0a-4698-9a45-2a181d7ea365', s_no, rule_ref, requirements FROM tanker_specifics;

INSERT INTO report_items (category_id, s_no, rule_ref, requirements)
SELECT 'a6dfb492-fcaa-45f4-9196-a20b984f9f86', s_no, rule_ref, requirements FROM towing;
