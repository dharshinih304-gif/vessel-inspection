const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Script to convert the uploaded Excel file to a structured JSON file.
 * Usage: node scripts/convertExcelToJson.js
 */

const EXCEL_PATH = path.join(__dirname, '../public/data/SEPERATE.xlsx');
const OUTPUT_PATH = path.join(__dirname, '../public/data/reports_converted.json');

function convert() {
  try {
    if (!fs.existsSync(EXCEL_PATH)) {
      console.error(`Excel file not found at: ${EXCEL_PATH}`);
      return;
    }

    console.log('Reading Excel file...');
    const workbook = XLSX.readFile(EXCEL_PATH);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    console.log('Converting to JSON...');
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Successfully converted ${jsonData.length} rows.`);
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(jsonData, null, 2));
    console.log(`JSON file saved to: ${OUTPUT_PATH}`);
    
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

convert();
