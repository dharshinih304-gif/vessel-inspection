const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join('d:', 'inspection', 'public', 'data', 'SEPERATE.xlsx');
const workbook = XLSX.readFile(excelPath);

workbook.SheetNames.forEach(name => {
  const sheet = workbook.Sheets[name];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const headers = data.find(row => row.includes('S.NO') || row.includes('S NO'));
  if (headers && headers.length > 2) {
    console.log(`Sheet "${name}" has more than 2 columns:`, headers);
  }
});
