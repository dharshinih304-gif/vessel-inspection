UPDATE pctc_specifics SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pctc_specifics SET comments = CASE
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

UPDATE pilot_boarding_arrangements SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pilot_boarding_arrangements SET comments = CASE
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

UPDATE pollution_prevention SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pollution_prevention SET comments = CASE
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

UPDATE pollution_prevention_tankers SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pollution_prevention_tankers SET comments = CASE
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

UPDATE protection_against_flooding SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE protection_against_flooding SET comments = CASE
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

UPDATE publication_documents SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE publication_documents SET comments = CASE
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

UPDATE pumps_performance SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pumps_performance SET comments = CASE
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

UPDATE radio_equipments SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE radio_equipments SET comments = CASE
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

UPDATE radio_navigation SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE radio_navigation SET comments = CASE
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

UPDATE reporting_systems SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE reporting_systems SET comments = CASE
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

UPDATE safety_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE safety_equipment SET comments = CASE
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

