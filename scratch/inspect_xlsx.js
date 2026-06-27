const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Untitled spreadsheet.xlsx');
try {
    const workbook = XLSX.readFile(filePath);
    console.log('--- SHEET NAMES ---');
    console.log(workbook.SheetNames);
    
    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log(`\n--- SHEET: ${sheetName} ---`);
        console.log(`Row count: ${rows.length}`);
        if (rows.length > 0) {
            console.log('Header/First Row:', rows[0]);
        }
        if (rows.length > 1) {
            console.log('Second Row:', rows[1]);
        }
        if (rows.length > 2) {
            console.log('Third Row:', rows[2]);
        }
    });
} catch (err) {
    console.error('Error reading spreadsheet:', err);
}
