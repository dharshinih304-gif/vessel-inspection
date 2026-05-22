const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const EXCEL_PATH = path.join(__dirname, '../frontend/data/SEPERATE.xlsx');

function main() {
  console.log('Reading Excel from:', EXCEL_PATH);
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error('File not found!');
    return;
  }
  const workbook = XLSX.readFile(EXCEL_PATH);
  console.log('Sheet Names:', workbook.SheetNames);
  console.log('Total sheets:', workbook.SheetNames.length);

  const sheetName = 'BALLAST TANKS';
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    console.error(`Sheet "${sheetName}" not found!`);
    return;
  }
  const rows = XLSX.utils.sheet_to_json(worksheet);
  console.log(`Sheet "${sheetName}": ${rows.length} rows`);
  if (rows.length > 0) {
    console.log('Sample rows:', rows.slice(0, 5));
  }
}

main();
