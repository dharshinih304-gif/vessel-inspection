UPDATE ballast_tanks SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE ballast_tanks SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE bulk SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE bulk SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE cargo_lifting_gear SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE cargo_lifting_gear SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE cargo_tanks SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE cargo_tanks SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE certificate SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE certificate SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE communication SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE communication SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE constructive_fire_protection SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE constructive_fire_protection SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE container_specifies SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE container_specifies SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE crew_accommodation SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE crew_accommodation SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE crew_evaluation SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE crew_evaluation SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE crew_health SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE crew_health SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE crew_safety SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE crew_safety SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE deck SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE deck SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE deck_machinary SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE deck_machinary SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE document_control SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE document_control SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE electrical_items SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE electrical_items SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE engine_room SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE engine_room SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE fire_fighting_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE fire_fighting_equipment SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE firefighting_fixed_system SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE firefighting_fixed_system SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE hatch_coamings SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hatch_coamings SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE hatch_covers SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hatch_covers SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE holds SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE holds SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE hull_inboard SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hull_inboard SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE hull_outboard SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hull_outboard SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE hull_structure SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE hull_structure SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE life_saving_apparatus SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE life_saving_apparatus SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE machinery_arrangements SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE machinery_arrangements SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE maintenance_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE maintenance_equipment SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE materials SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE materials SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE mooring_arrangements SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE mooring_arrangements SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE navigational_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE navigational_equipment SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE oil_pollution_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE oil_pollution_equipment SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE pctc_specifics SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pctc_specifics SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE pilot_boarding_arrangements SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pilot_boarding_arrangements SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE pollution_prevention SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pollution_prevention SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE pollution_prevention_for_tankers SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pollution_prevention_for_tankers SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE protection_against_flooding SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE protection_against_flooding SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE publication_documents SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE publication_documents SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE pumps_performance SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE pumps_performance SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE radio_equipments SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE radio_equipments SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE radio_navigation SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE radio_navigation SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE reporting_systems SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE reporting_systems SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE safety_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE safety_equipment SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE safety_of_navigation SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE safety_of_navigation SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE sea_trial_if_available SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE sea_trial_if_available SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE ships_pyrotechnics SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE ships_pyrotechnics SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE supply_connections SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE supply_connections SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE tankage SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE tankage SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE tanker_equipment SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE tanker_equipment SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE tanker_specifics SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
UPDATE tanker_specifics SET comments = CASE
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

UPDATE towing SET ans = (ARRAY['GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'GOOD', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'SATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'UNSATISFACTORY', 'NOT SEEN'])[floor(random() * 20 + 1)] WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';
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
END WHERE "vesselId" = 'b4871f10-60cc-4a4a-a49b-bb22b290f206';

