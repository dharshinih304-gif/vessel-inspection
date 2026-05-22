const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join('d:', 'inspection', 'public', 'data', 'SEPERATE.xlsx');
const workbook = XLSX.readFile(excelPath);

const sheet = workbook.Sheets['SAFETY EQUIPMENT'];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('Columns in SAFETY EQUIPMENT:', Object.keys(data[0]));
