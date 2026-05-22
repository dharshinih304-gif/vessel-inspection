UPDATE towing SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE towing SET comments = CASE
  WHEN ans = 'GOOD' THEN (ARRAY[
    'Inspected and found in excellent working order.',
    'System in fully functional and clean condition.',
    'Condition is highly satisfactory, no defects observed.',
    'Operational parameters are within normal limits.',
    'Structure is sound and well maintained.'
  ])[floor(random() * 5 + 1)]
  WHEN ans = 'SATISFACTORY' THEN (ARRAY[
    'Acceptable condition, minor wear but fully functional.',
    'Meets standard requirements, no major issues detected.',
    'General condition is fair, routine monitoring recommended.',
    'In order, showing normal operational wear.',
    'Satisfactory performance observed during inspection.'
  ])[floor(random() * 5 + 1)]
  WHEN ans = 'UNSATISFACTORY' THEN (ARRAY[
    'Minor corrosion and wear detected, needs attention.',
    'Defect noted; maintenance/repair is required.',
    'Shows signs of deterioration, prompt servicing recommended.',
    'Not functioning to standards, requires investigation.',
    'Condition suboptimal, corrective action scheduled.'
  ])[floor(random() * 5 + 1)]
  WHEN ans = 'NOT SEEN' THEN (ARRAY[
    'Area inaccessible due to cargo operations.',
    'Not accessible at the time of inspection.',
    'Inspection deferred; area locked or restricted.',
    'Could not be verified due to operational constraints.',
    'Item not available for viewing during this visit.'
  ])[floor(random() * 5 + 1)]
  ELSE 'Initial audit record'
END WHERE vessel_id = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

