const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const path = require('path');

const supabaseUrl = 'https://dobpdssgdfaiharnmpdf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';
const supabase = createClient(supabaseUrl, supabaseKey);

const excelPath = path.join('d:', 'inspection', 'public', 'data', 'SEPERATE.xlsx');
const workbook = XLSX.readFile(excelPath);

const vesselId = '4299e91e-2c75-46d2-8bdb-b9ba313b5b2d';

const mapping = {
  'CERTIFICATE': 'certificate',
  'DECKS': 'deck',
  'SAFETY EQUIPMENT': 'safety_equipment',
  'FIRE FIGHTING EQUIPMENT': 'fire_fighting_equipment',
  'NAVIGATION EQUIPMENTS': 'navigational_equipment',
  'HULL OUTBOARD': 'hull_outboard',
  'HULL INBOARD': 'hull_inboard',
  'MAINTENANCE EQUIPMENT': 'maintenance_equipment',
  'HATCH COAMINGS': 'hatch_coamings',
  'MACHINARY ARRANGEMENTS': 'machinery_arrangements',
  'ELECTRICAL ITEMS': 'electrical_items',
  'POLLUTION PREVENTION': 'pollution_prevention',
  'BALLAST TANKS': 'ballast_tanks',
  'RADIO EQUIPMENTS': 'radio_equipments',
  'MATERIALS': 'materials',
  'DOCUMENT CONTROL': 'document_control',
  'COMMUNICATION': 'communication',
  'PUBLICATION DOCUMENTS': 'publication_documents',
  'SHIPS PYROTECHNICS': 'ships_pyrotechnics',
  'LIFE SAVING APPARATUS': 'life_saving_apparatus',
  'CREW ACCOMODATION': 'crew_accommodation',
  'TOWING': 'towing',
  'TANKAGE': 'tankage',
  'BULK': 'bulk',
  'PUMPS PERFORMANCE': 'pumps_performance',
  'SUPPLY CONNECTIONS': 'supply_connections',
  'OIL POLLUTION EQUIPMENT': 'oil_pollution_equipment',
  'SEA TRIAL IF AVAILABLE': 'sea_trial',
  'HATCH COVERS': 'hatch_covers',
  'HOLDS': 'holds',
  'DECK MACHINARY': 'deck_machinery',
  'ENGINE ROOM': 'engine_room',
  'REPORTING SYSTEMS': 'reporting_systems',
  'RADIO & NAVIGATION': 'radio_navigation',
  'TANKER SPECIFICS': 'tanker_specifics',
  'CARGO TANKS': 'cargo_tanks',
  'POLLUTION PREVENTION FOR TANKER': 'pollution_prevention_tankers',
  'TANKER EQUIPMENT': 'tanker_equipment',
  'CONTAINER SPECIFIES': 'container_specifies',
  'PCTC SPECFICS': 'pctc_specifics',
  'CREW EVALUATION ': 'crew_evaluation',
  'CREW SAFETY': 'crew_safety',
  'CREW HEALTH': 'crew_health',
  'CONSTRUCTIVE FIRE PROTECTION ': 'constructive_fire_protection',
  'FIREFIGHTING FIXED SYSYTEMS': 'firefighting_fixed_system',
  'SAFETY OF NAVIGATION': 'safety_of_navigation',
  'PILOT BOARDING ARRANGEMENTS': 'pilot_boarding_arrangements',
  'PROTECTION AGAINST FLOODING': 'protection_against_flooding',
  'HULL STRUCTURE': 'hull_structure',
  'MOORING ARRANGEMENTS': 'mooring_arrangements',
  'CARGO LIFTING GEAR': 'cargo_lifting_gear'
};

const sNoHeaders = ['S.NO', 'S NO', 'S. NO', 'S.NO.', 'ITEM NO.', 'ITEM NO', 'ITEM NO. '];

async function insertData() {
  for (const [sheetName, tableName] of Object.entries(mapping)) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    
    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    // Find header row
    const headerRowIndex = rawRows.findIndex(row => {
      if (!Array.isArray(row)) return false;
      return row.some(cell => {
        if (typeof cell !== 'string') return false;
        const normalized = cell.trim().toUpperCase();
        return sNoHeaders.some(h => h.toUpperCase() === normalized);
      });
    });
    
    if (headerRowIndex === -1) {
      console.warn(`Could not find header row for ${sheetName}`);
      continue;
    }
    
    const headers = rawRows[headerRowIndex].map(h => h ? String(h).trim() : null);
    const dataRows = rawRows.slice(headerRowIndex + 1);
    
    const rowsToInsert = dataRows.map(row => {
      const rowObj = {};
      headers.forEach((header, i) => {
        if (header) rowObj[header] = row[i];
      });

      const s_no = rowObj['S.NO'] || rowObj['S NO'] || rowObj['S. NO'] || rowObj['S.NO.'] || rowObj['ITEM NO.'] || rowObj['ITEM NO'] || rowObj['ITEM NO. '] || '';
      
      const possibleReqKeys = [sheetName.trim(), 'REQUIREMENTS', 'REQUIREMENT', 'CERTIFICATE', 'DECKS', 'DESCRIPTION', 'HULL STRUCTURE', 'MOORING ARRANGEMENTS', 'CREW SAFETY', 'CREW HEALTH'];
      let requirements = '';
      for (const key of possibleReqKeys) {
        if (rowObj[key]) {
          requirements = rowObj[key];
          break;
        }
      }
      
      // Special check for row indices if requirements column not found by name
      if (!requirements) {
        // Try the column next to the S.NO column
        const sNoIndex = headers.findIndex(h => h && sNoHeaders.some(sn => sn.toUpperCase() === h.toUpperCase()));
        if (sNoIndex !== -1 && row[sNoIndex + 1]) {
          requirements = row[sNoIndex + 1];
        }
      }

      const ruleRef = rowObj['RULE'] || rowObj['RULE REF'] || rowObj['REFERENCE'] || rowObj['RULE REF.'] || (row[0] && String(row[0]).includes('SOLAS') ? row[0] : '');
      const comments = rowObj['COMMENTS'] || rowObj['Remarks'] || rowObj['Remarks '] || rowObj['REMARKS'] || '';
      const ans = rowObj['Response'] || rowObj['Response '] || '';

      if (!s_no && !requirements) return null;

      return {
        s_no: String(s_no).trim(),
        requirements: String(requirements).trim(),
        rule_ref: String(ruleRef).trim(),
        vesselId: vesselId,
        ans: String(ans).trim(),
        comments: String(comments).trim()
      };
    }).filter(row => row !== null && (row.s_no || row.requirements));

    if (rowsToInsert.length === 0) continue;

    console.log(`Inserting ${rowsToInsert.length} rows into ${tableName}...`);
    await supabase.from(tableName).delete().neq('id', -1);
    const { error } = await supabase.from(tableName).insert(rowsToInsert);
    
    if (error) console.error(`Error in ${tableName}:`, error.message);
  }
}

insertData();
