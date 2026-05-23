UPDATE ballast_tanks SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE ballast_tanks SET comments = CASE
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

UPDATE bulk SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE bulk SET comments = CASE
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

UPDATE cargo_lifting_gear SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE cargo_lifting_gear SET comments = CASE
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

UPDATE cargo_tanks SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE cargo_tanks SET comments = CASE
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

UPDATE certificate SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE certificate SET comments = CASE
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

UPDATE communication SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE communication SET comments = CASE
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

UPDATE constructive_fire_protection SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE constructive_fire_protection SET comments = CASE
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

UPDATE container_specifies SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE container_specifies SET comments = CASE
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

UPDATE crew_accommodation SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE crew_accommodation SET comments = CASE
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

UPDATE crew_evaluation SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE crew_evaluation SET comments = CASE
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

UPDATE crew_health SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE crew_health SET comments = CASE
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

