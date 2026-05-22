const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join('d:', 'inspection', 'public', 'data', 'SEPERATE.xlsx');
const workbook = XLSX.readFile(excelPath);

const sheet = workbook.Sheets['MACHINARY ARRANGEMENTS'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('First 5 rows of MACHINARY ARRANGEMENTS:');
console.log(data.slice(0, 5));
