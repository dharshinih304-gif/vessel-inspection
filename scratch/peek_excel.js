const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join('d:', 'inspection', 'public', 'data', 'SEPERATE.xlsx');
const workbook = XLSX.readFile(excelPath);

console.log('Sheets in Excel:', workbook.SheetNames);

const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(firstSheet);

console.log('Sample Data (First 2 rows):', JSON.stringify(data.slice(0, 2), null, 2));
