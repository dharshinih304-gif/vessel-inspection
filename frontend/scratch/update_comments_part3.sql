UPDATE hull_inboard SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hull_inboard SET comments = CASE
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

UPDATE hull_outboard SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hull_outboard SET comments = CASE
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

UPDATE hull_structure SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hull_structure SET comments = CASE
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

UPDATE life_saving_apparatus SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE life_saving_apparatus SET comments = CASE
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

UPDATE machinery_arrangements SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE machinery_arrangements SET comments = CASE
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

UPDATE maintenance_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE maintenance_equipment SET comments = CASE
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

UPDATE materials SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE materials SET comments = CASE
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

UPDATE mooring_arrangements SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE mooring_arrangements SET comments = CASE
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

UPDATE navigational_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE navigational_equipment SET comments = CASE
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

UPDATE oil_pollution_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE oil_pollution_equipment SET comments = CASE
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

