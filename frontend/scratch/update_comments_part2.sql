UPDATE crew_safety SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE crew_safety SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE deck SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE deck SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE deck_machinery SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE deck_machinery SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE document_control SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE document_control SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE electrical_items SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE electrical_items SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE engine_room SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE engine_room SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE fire_fighting_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE fire_fighting_equipment SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE firefighting_fixed_system SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE firefighting_fixed_system SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE hatch_coamings SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hatch_coamings SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE hatch_covers SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hatch_covers SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE holds SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE holds SET comments = CASE
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
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

