const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Untitled spreadsheet.xlsx');
try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['STAFF DETAILS'];
    const rows = XLSX.utils.sheet_to_json(sheet);
    console.log('--- STAFF DETAILS NAMES ---');
    rows.forEach((row, i) => {
        console.log(`${i + 1}: Name="${row['NAME']}" (Keys: ${Object.keys(row).join(',')})`);
    });
} catch (err) {
    console.error(err);
}
