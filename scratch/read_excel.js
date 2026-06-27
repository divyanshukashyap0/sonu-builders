import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'Untitled spreadsheet.xlsx');
console.log("Reading file:", filePath);

try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    console.log("Sheet names:", workbook.SheetNames);

    const staffSheetKey = workbook.SheetNames.find(n => n.toUpperCase().includes('STAFF'));
    if (staffSheetKey) {
        const sheet = workbook.Sheets[staffSheetKey];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log(`\n--- STAFF SHEET (${staffSheetKey}) ---`);
        const headerRow = rows[0];
        console.log("Headers:", headerRow);
        
        const nameIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('NAME'));
        const srIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('SR'));
        
        rows.slice(1).forEach((row, i) => {
            const name = row[nameIdx];
            const sr = row[srIdx];
            if (name) {
                console.log(`Row ${i + 2}: SR=${sr}, Name="${name}"`);
            }
        });
    }

    const attendanceSheetKey = workbook.SheetNames.find(n => n.toUpperCase().includes('ATTENDANCE'));
    if (attendanceSheetKey) {
        const sheet = workbook.Sheets[attendanceSheetKey];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log(`\n--- ATTENDANCE SHEET (${attendanceSheetKey}) ---`);
        const headerRow = rows[1];
        console.log("Headers (row 2):", headerRow ? headerRow.slice(0, 10) : 'none');
        
        rows.slice(2).forEach((row, i) => {
            const name = row[1];
            if (name && name !== 'NAME') {
                console.log(`Row ${i + 3}: Name="${name}"`);
            }
        });
    }
} catch (err) {
    console.error("Error reading workbook:", err);
}
