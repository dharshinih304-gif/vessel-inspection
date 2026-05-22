const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join('d:', 'inspection', 'public', 'data', 'SEPERATE.xlsx');
const workbook = XLSX.readFile(excelPath);

const sheet = workbook.Sheets['SAFETY EQUIPMENT'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Read raw rows

console.log('First 5 rows of SAFETY EQUIPMENT:');
console.log(data.slice(0, 5));
