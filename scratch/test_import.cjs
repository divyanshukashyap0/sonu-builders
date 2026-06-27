const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Untitled spreadsheet.xlsx');

// Helper to normalize names
const normalizeName = (name) => {
    if (!name) return '';
    return String(name)
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[^a-z0-9 ]/g, '')
        .trim();
};

const cleanEmployeeId = (id) => {
    if (!id) return '';
    return String(id).replace(/[^A-Za-z0-9-]/g, '').trim().toUpperCase();
};

function parseExcelDate(val) {
    if (!val) return null;
    if (typeof val === 'number') {
        const date = new Date((val - 25569) * 86400 * 1000);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    }
    const str = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    return null;
}

try {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    
    const staffSheetKey = sheetNames.find(n => n.toUpperCase().includes('STAFF'));
    const attendanceSheetKey = sheetNames.find(n => n.toUpperCase().includes('ATTENDANCE'));
    const advanceSheetKey = sheetNames.find(n => n.toUpperCase().includes('ADVANCE'));
    const expenseSheetKey = sheetNames.find(n => n.toUpperCase().includes('EXPENSE') || n.toUpperCase().includes('SURAJ'));

    console.log('Sheets found:', { staffSheetKey, attendanceSheetKey, advanceSheetKey, expenseSheetKey });

    let detectedMonth = '2026-06';
    let attendanceTemp = [];

    if (attendanceSheetKey) {
        const sheet = workbook.Sheets[attendanceSheetKey];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        if (rows[0] && rows[0][0]) {
            const val = rows[0][0];
            if (typeof val === 'number') {
                const date = new Date((val - 25569) * 86400 * 1000);
                if (!isNaN(date.getTime())) {
                    detectedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                }
            }
        }
        console.log('Detected Attendance Month:', detectedMonth);

        const headerRow = rows[1];
        if (headerRow) {
            const dataRows = rows.slice(2);
            dataRows.forEach((row, idx) => {
                const name = String(row[1] || '').trim();
                if (!name || name === 'NAME') return;
                
                const salary = Number(row[2]) || 0;
                const wageType = String(row[3] || '8 HRS').trim().toUpperCase();
                const rate8hrs = Number(row[4]) || 0;
                const rate12hrs = Number(row[5]) || 0;
                
                const days = {};
                for (let day = 1; day <= 31; day++) {
                    const colIndex = 5 + day;
                    const cellVal = row[colIndex];
                    if (cellVal !== undefined && cellVal !== null) {
                        days[String(day)] = String(cellVal).trim().toUpperCase();
                    }
                }

                let workUnits = 0;
                let absents = 0;
                Object.values(days).forEach((status) => {
                    switch (status) {
                        case 'S': workUnits += 1.0; break;
                        case 'P': workUnits += 1.5; break;
                        case 'H': workUnits += 0.5; break;
                        case 'D': workUnits += 2.0; break;
                        case 'A': absents += 1; break;
                        default: break;
                    }
                });

                attendanceTemp.push({
                    employeeName: name,
                    employeeId: '',
                    salary,
                    wageType,
                    rate8hrs,
                    rate12hrs,
                    days,
                    totalWorkUnits: workUnits,
                    totalAbsent: absents,
                    month: detectedMonth
                });
            });
        }
    }
    console.log(`Parsed Attendance records: ${attendanceTemp.length}`);
    if (attendanceTemp.length > 0) {
        console.log('Sample Attendance record:', attendanceTemp[0]);
    }

    // Parse Staff Details
    let staffTemp = [];
    if (staffSheetKey) {
        const sheet = workbook.Sheets[staffSheetKey];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headerRow = rows[0];
        
        if (headerRow) {
            const nameIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('NAME'));
            const srIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('SR'));
            const mobIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('MOB'));
            const altIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('ALT'));
            const docIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('DOC'));

            const dataRows = rows.slice(1);
            dataRows.forEach((row, index) => {
                const name = String(row[nameIdx] || '').trim().toUpperCase();
                if (!name) return;

                const serial = Number(row[srIdx]) || index + 1;
                const empId = `SE${String(serial).padStart(3, '0')}`;
                const phone = String(row[mobIdx] || '').trim();
                const altPhone = String(row[altIdx] || '').trim();
                
                let docStatus = 'pending';
                const rawDoc = row[docIdx];
                if (rawDoc === true || String(rawDoc).toUpperCase() === 'TRUE' || String(rawDoc).toUpperCase() === 'VERIFIED') {
                    docStatus = 'verified';
                }

                const attMatch = attendanceTemp.find(a => {
                    const normStaff = normalizeName(name);
                    const normAtt = normalizeName(a.employeeName);
                    return normStaff === normAtt || normStaff.includes(normAtt) || normAtt.includes(normStaff);
                });

                const isMonthly = attMatch ? (attMatch.wageType.includes('FIX') || attMatch.wageType.includes('MONTH')) : false;
                const standardWage = attMatch ? (isMonthly ? attMatch.salary : attMatch.rate8hrs || attMatch.salary) : 500;
                const overtimeWage = attMatch ? attMatch.rate12hrs : 750;

                staffTemp.push({
                    serialNumber: serial,
                    employeeId: empId,
                    fullName: name,
                    phone: phone || '',
                    alternatePhone: altPhone || '',
                    documentsStatus: docStatus,
                    role: 'Carpenter',
                    salaryType: isMonthly ? 'monthly' : 'daily',
                    standardWage,
                    overtimeWage,
                    doubleShiftWage: standardWage * 2,
                    joiningDate: `${detectedMonth}-01`,
                    status: 'active'
                });
            });
        }
    }
    console.log(`Parsed Staff records: ${staffTemp.length}`);
    if (staffTemp.length > 0) {
        console.log('Sample Staff record:', staffTemp[0]);
    }

    // Resolve & map names
    const resolveEmployeeName = (rawName, existingStaff, parsedStaffList, aliasList) => {
        const normalized = normalizeName(rawName);
        if (!normalized) return { employeeId: '', confidence: 0 };

        const searchPool = [
            ...existingStaff.map(s => ({ employeeId: cleanEmployeeId(s.employeeId), fullName: s.fullName, normalized: normalizeName(s.fullName) })),
            ...parsedStaffList.map(s => ({ employeeId: cleanEmployeeId(s.employeeId), fullName: s.fullName, normalized: normalizeName(s.fullName) }))
        ];

        const exactMatch = searchPool.find(s => s.normalized === normalized);
        if (exactMatch) {
            return { employeeId: exactMatch.employeeId, confidence: 1.0 };
        }

        let partialMatch = searchPool.find(s => s.normalized.startsWith(normalized) || normalized.startsWith(s.normalized));
        if (!partialMatch) {
            partialMatch = searchPool.find(s => s.normalized.includes(normalized) || normalized.includes(s.normalized));
        }
        if (partialMatch) {
            return { employeeId: partialMatch.employeeId, confidence: 0.95 };
        }

        return { employeeId: '', confidence: 0 };
    };

    const unresolved = new Set();
    attendanceTemp = attendanceTemp.map((att) => {
        const res = resolveEmployeeName(att.employeeName, [], staffTemp, []);
        if (!res.employeeId || res.confidence < 0.90) {
            unresolved.add(att.employeeName);
        }
        return {
            ...att,
            employeeId: res.employeeId
        };
    });

    console.log(`Unresolved names count: ${unresolved.size}`);
    console.log('Unresolved names:', Array.from(unresolved));

} catch (err) {
    console.error('Error running test import:', err);
}
