import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useStaff } from '../../../hooks/useStaff';
import { db } from '../../../lib/firebase';
import { collection, writeBatch, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import {
    Upload, FileSpreadsheet, CheckCircle2, AlertTriangle,
    Play, Loader2, ArrowRight, Table, ShieldCheck, RefreshCw, HelpCircle,
    Download, Trash2, Edit2, Check, AlertCircle, XCircle
} from 'lucide-react';
import Fuse from 'fuse.js';

interface StaffRow {
    serialNumber: number;
    employeeId: string;
    fullName: string;
    phone: string;
    alternatePhone: string;
    documentsStatus: 'verified' | 'pending';
    role: string;
    salaryType: 'daily' | 'monthly';
    standardWage: number;
    overtimeWage: number;
    doubleShiftWage: number;
    joiningDate: string;
    status: 'active' | 'inactive';
}

interface AttendanceRow {
    employeeName: string;
    employeeId: string; // Matched later
    salary: number;
    wageType: string;
    rate8hrs: number;
    rate12hrs: number;
    days: Record<string, string>;
    totalWorkUnits: number;
    totalAbsent: number;
    month: string;
}

interface AdvanceRow {
    employeeName: string;
    employeeId: string; // Matched later
    amount: number;
    date: string;
    reason: string;
    month: string;
}

interface ExpenseRow {
    date: string;
    siteName: string;
    amountReceived: number;
    amountPaid: number;
    description: string;
    balance: number;
}

interface ImportSummary {
    sheetsProcessed: number;
    staffImported: number;
    attendanceImported: number;
    advancesImported: number;
    expensesImported: number;
    failedRows: number;
    duplicatesSkipped: number;
    logText: string;
    syncedRowsCount?: number;
    skippedRowsCount?: number;
    unresolvedNamesCount?: number;
    autoCreatedEmployeesCount?: number;
}

export default function BulkImport() {
    const { staff } = useStaff(); // Fetch existing roster
    const [file, setFile] = useState<File | null>(null);
    const [parsing, setParsing] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [activeTab, setActiveTab] = useState<'staff' | 'attendance' | 'advances' | 'expenses'>('staff');

    // Parsed Data States
    const [parsedStaff, setParsedStaff] = useState<StaffRow[]>([]);
    const [parsedAttendance, setParsedAttendance] = useState<AttendanceRow[]>([]);
    const [parsedAdvances, setParsedAdvances] = useState<AdvanceRow[]>([]);
    const [parsedExpenses, setParsedExpenses] = useState<ExpenseRow[]>([]);

    // Month indicator
    const [importMonth, setImportMonth] = useState('2026-06');

    // UI Editable row states (tracking edits)
    const [editingIndex, setEditingIndex] = useState<{ tab: string; index: number } | null>(null);

    // Validation Report States
    const [errors, setErrors] = useState<string[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [isValidated, setIsValidated] = useState(false);
    const [summary, setSummary] = useState<ImportSummary | null>(null);

    // Aliases & Unresolved names resolution
    const [aliases, setAliases] = useState<{ aliasName: string; employeeId: string }[]>([]);
    const [aliasesToCreate, setAliasesToCreate] = useState<{ aliasName: string; employeeId: string }[]>([]);
    const [unresolvedNames, setUnresolvedNames] = useState<string[]>([]);
    const [showUnresolvedModal, setShowUnresolvedModal] = useState(false);
    const [unresolvedMappings, setUnresolvedMappings] = useState<Record<string, {
        action: 'map' | 'create' | 'skip';
        employeeId?: string;
        role?: string;
        standardWage?: number;
    }>>({});
    const [autoCreatedCount, setAutoCreatedCount] = useState(0);

    // Load aliases on mount
    useEffect(() => {
        const fetchAliases = async () => {
            try {
                const snap = await getDocs(collection(db, 'employeeAliases'));
                const list: { aliasName: string; employeeId: string }[] = [];
                snap.forEach((doc) => {
                    const data = doc.data();
                    if (data.aliasName && data.employeeId) {
                        list.push({
                            aliasName: data.aliasName,
                            employeeId: data.employeeId
                        });
                    }
                });
                setAliases(list);
            } catch (err) {
                console.error("Error fetching aliases:", err);
            }
        };
        fetchAliases();
    }, []);

    // Dynamic Helper to parse date from Excel serial or string
    const parseExcelDate = (val: any): string => {
        if (!val) return '';
        if (val instanceof Date) {
            return val.toISOString().split('T')[0];
        }
        if (typeof val === 'number') {
            const date = new Date((val - 25569) * 86400 * 1000);
            return date.toISOString().split('T')[0];
        }
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
        }
        return String(val).trim();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setIsValidated(false);
            setErrors([]);
            setWarnings([]);
            setSummary(null);
            setParsedStaff([]);
            setParsedAttendance([]);
            setParsedAdvances([]);
            setParsedExpenses([]);
        }
    };

    const normalizeName = (name: string): string => {
        if (!name) return '';
        return name
            .toUpperCase()
            .replace(/\./g, '') // remove dots
            .replace(/[^A-Z0-9\s]/g, '') // remove special symbols
            .replace(/\s+/g, ' ') // replace multiple spaces with single space
            .trim();
    };

    const cleanEmployeeId = (id: string): string => {
        if (!id) return '';
        return String(id).replace(/[^A-Za-z0-9-]/g, '').trim().toUpperCase();
    };

    const resolveEmployeeName = (
        rawName: string,
        existingStaff: any[],
        parsedStaffList: any[],
        aliasList: { aliasName: string; employeeId: string }[]
    ) => {
        const normalized = normalizeName(rawName);
        if (!normalized) return { employeeId: '', method: 'none', confidence: 0, matchedName: '' };

        // 1. Alias match
        const aliasMatch = aliasList.find(a => normalizeName(a.aliasName) === normalized);
        if (aliasMatch) {
            const empObj = existingStaff.find(s => cleanEmployeeId(s.employeeId) === cleanEmployeeId(aliasMatch.employeeId)) ||
                parsedStaffList.find(s => cleanEmployeeId(s.employeeId) === cleanEmployeeId(aliasMatch.employeeId));
            return {
                employeeId: cleanEmployeeId(aliasMatch.employeeId),
                method: 'alias',
                confidence: 1.0,
                matchedName: empObj ? empObj.fullName : aliasMatch.employeeId
            };
        }

        // Combine for searching
        const searchPool = [
            ...existingStaff.map(s => ({ employeeId: cleanEmployeeId(s.employeeId), fullName: s.fullName, normalized: normalizeName(s.fullName) })),
            ...parsedStaffList.map(s => ({ employeeId: cleanEmployeeId(s.employeeId), fullName: s.fullName, normalized: normalizeName(s.fullName) }))
        ];

        // 2. Exact match (case-insensitive on normalized names)
        const exactMatch = searchPool.find(s => s.normalized === normalized);
        if (exactMatch) {
            return { employeeId: exactMatch.employeeId, method: 'exact', confidence: 1.0, matchedName: exactMatch.fullName };
        }

        // 3. Partial match (starts-with or includes)
        let partialMatch = searchPool.find(s => s.normalized.startsWith(normalized) || normalized.startsWith(s.normalized));
        if (!partialMatch) {
            partialMatch = searchPool.find(s => s.normalized.includes(normalized) || normalized.includes(s.normalized));
        }
        if (partialMatch) {
            return { employeeId: partialMatch.employeeId, method: 'partial', confidence: 0.95, matchedName: partialMatch.fullName };
        }

        // 4. Fuzzy match using Fuse.js
        if (searchPool.length > 0) {
            const fuse = new Fuse(searchPool, {
                keys: ['normalized'],
                threshold: 0.25,
                includeScore: true
            });
            const results = fuse.search(normalized);
            if (results.length > 0) {
                const best = results[0];
                const score = best.score ?? 1;
                const confidence = 1 - score;
                return {
                    employeeId: best.item.employeeId,
                    method: 'fuzzy',
                    confidence,
                    matchedName: best.item.fullName
                };
            }
        }

        return { employeeId: '', method: 'none', confidence: 0, matchedName: '' };
    };

    const parseExcel = async () => {
        if (!file) return;
        setParsing(true);
        setErrors([]);
        setWarnings([]);
        setSummary(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                // Detect Sheet Names
                const sheetNames = workbook.SheetNames;
                const staffSheetKey = sheetNames.find(n => n.toUpperCase().includes('STAFF'));
                const attendanceSheetKey = sheetNames.find(n => n.toUpperCase().includes('ATTENDANCE'));
                const advanceSheetKey = sheetNames.find(n => n.toUpperCase().includes('ADVANCE'));
                const expenseSheetKey = sheetNames.find(n => n.toUpperCase().includes('EXPENSE') || n.toUpperCase().includes('sonu'));

                let detectedMonth = '2026-06';

                // 1. Parse Attendance Sheet first (to pull wage info & month metadata)
                let attendanceTemp: AttendanceRow[] = [];
                if (attendanceSheetKey) {
                    const sheet = workbook.Sheets[attendanceSheetKey];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];

                    // Parse month serial number in cell A1 if available
                    if (rows[0] && rows[0][0]) {
                        const val = rows[0][0];
                        if (typeof val === 'number') {
                            const date = new Date((val - 25569) * 86400 * 1000);
                            if (!isNaN(date.getTime())) {
                                detectedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                            }
                        } else if (typeof val === 'string' && val.includes('-')) {
                            const clean = val.trim();
                            if (/^\d{4}-\d{2}/.test(clean)) {
                                detectedMonth = clean.substring(0, 7);
                            }
                        }
                    }
                    setImportMonth(detectedMonth);

                    // Row index 1 is header: ["SR. NO.","NAME","SALARY",null,"8 HRS","12 HRS",1,2,3...]
                    const headerRow = rows[1] as any[];
                    if (headerRow) {
                        const dataRows = rows.slice(2);
                        dataRows.forEach((row) => {
                            const name = String(row[1] || '').trim();
                            if (!name || name === 'NAME') return; // Skip invalid rows

                            const salary = Number(row[2]) || 0;
                            const wageType = String(row[3] || '8 HRS').trim().toUpperCase();
                            const rate8hrs = Number(row[4]) || 0;
                            const rate12hrs = Number(row[5]) || 0;

                            // Parse attendance days (Index 6 to 36)
                            const days: Record<string, string> = {};
                            for (let day = 1; day <= 31; day++) {
                                const colIndex = 5 + day; // col index starts after 12 HRS (index 5)
                                const cellVal = row[colIndex];
                                if (cellVal !== undefined && cellVal !== null) {
                                    days[String(day)] = String(cellVal).trim().toUpperCase();
                                }
                            }

                            // Calculate shifts worked
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
                                employeeId: '', // To be mapped
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

                // 2. Parse Staff Details
                let staffTemp: StaffRow[] = [];
                if (staffSheetKey) {
                    const sheet = workbook.Sheets[staffSheetKey];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];
                    const headerRow = rows[0] as string[];

                    if (headerRow) {
                        // Find columns dynamically
                        const nameIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('NAME'));
                        const srIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('SR'));
                        const mobIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('MOB'));
                        const altIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('ALT'));
                        const docIdx = headerRow.findIndex(h => String(h).toUpperCase().includes('DOC'));

                        const dataRows = rows.slice(1);
                        dataRows.forEach((row, index) => {
                            const name = String(row[nameIdx] || '').trim().toUpperCase();
                            if (!name) return; // Skip empty names

                            const serial = Number(row[srIdx]) || index + 1;
                            const empId = `SE${String(serial).padStart(3, '0')}`;
                            const phone = String(row[mobIdx] || '').trim();
                            const altPhone = String(row[altIdx] || '').trim();

                            // Docs column (TRUE -> verified, FALSE -> pending)
                            let docStatus: 'verified' | 'pending' = 'pending';
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
                                role: 'Carpenter', // Default role
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

                // 3. Parse Advances (Supports Matrix Layout and List Layout)
                let advanceTemp: AdvanceRow[] = [];
                if (advanceSheetKey) {
                    const sheet = workbook.Sheets[advanceSheetKey];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];
                    const headerRow = rows[0] as string[];

                    if (headerRow) {
                        // Check layout format
                        let isMatrix = false;
                        const firstCell = String(headerRow[0]).toUpperCase();
                        if ((firstCell.includes('DATE') || firstCell.includes('SR')) && !headerRow.some(h => String(h).toUpperCase().includes('AMOUNT'))) {
                            isMatrix = true;
                        }

                        if (isMatrix) {
                            // Column 0 is Day/Date, subsequent columns are worker names
                            const dataRows = rows.slice(2); // Skip header and Total summaries
                            dataRows.forEach((row) => {
                                const dayRaw = row[0];
                                if (dayRaw === undefined || dayRaw === null) return;

                                let day = 1;
                                if (typeof dayRaw === 'number') {
                                    day = dayRaw;
                                } else {
                                    const parsed = parseInt(String(dayRaw).replace(/\D/g, ''), 10);
                                    if (!isNaN(parsed)) day = parsed;
                                }

                                for (let j = 1; j < headerRow.length; j++) {
                                    const val = Number(row[j]);
                                    if (val && val > 0) {
                                        const empName = headerRow[j];
                                        advanceTemp.push({
                                            employeeName: empName,
                                            employeeId: '', // Resolved below
                                            amount: val,
                                            date: `${detectedMonth}-${String(day).padStart(2, '0')}`,
                                            reason: `Advance on Day ${day} (Imported)`,
                                            month: detectedMonth
                                        });
                                    }
                                }
                            });
                        } else {
                            // Flat list structure
                            const rawData = XLSX.utils.sheet_to_json(sheet) as any[];
                            rawData.forEach((row) => {
                                const name = String(row.employeeName || row.Name || row.name || row.Employee || '').trim();
                                const amt = Number(row.amount || row.amountReceived || row.Amount || row.Advance || 0);
                                const dateVal = parseExcelDate(row.date || row.Date);

                                if (name && amt > 0) {
                                    advanceTemp.push({
                                        employeeName: name,
                                        employeeId: '', // Resolved below
                                        amount: amt,
                                        date: dateVal || `${detectedMonth}-01`,
                                        reason: String(row.reason || row.Reason || 'Personal Advance').trim(),
                                        month: dateVal ? dateVal.substring(0, 7) : detectedMonth
                                    });
                                }
                            });
                        }
                    }
                }

                // 4. Parse Expenses
                let expenseTemp: ExpenseRow[] = [];
                if (expenseSheetKey) {
                    const sheet = workbook.Sheets[expenseSheetKey];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];

                    // Search for headers row index (it might not be on row 1)
                    let headerIndex = -1;
                    for (let idx = 0; idx < rows.length; idx++) {
                        const r = rows[idx];
                        if (r && r.some(c => String(c).toUpperCase().includes('LOCATION') || String(c).toUpperCase().includes('PAYMENT'))) {
                            headerIndex = idx;
                            break;
                        }
                    }

                    if (headerIndex !== -1) {
                        const headers = rows[headerIndex] as string[];
                        const dateIdx = headers.findIndex(h => String(h).toUpperCase().includes('DATE'));
                        const locIdx = headers.findIndex(h => String(h).toUpperCase().includes('LOCATION') || String(h).toUpperCase().includes('SITE'));
                        const recIdx = headers.findIndex(h => String(h).toUpperCase().includes('RECIVED') || String(h).toUpperCase().includes('RECEIVED') || String(h).toUpperCase().includes('INFLOW'));
                        const paidIdx = headers.findIndex(h => String(h).toUpperCase().includes('PAID') || String(h).toUpperCase().includes('OUTFLOW'));

                        const dataRows = rows.slice(headerIndex + 1);
                        dataRows.forEach((row) => {
                            const rawDate = row[dateIdx];
                            const location = String(row[locIdx] || '').trim();
                            const recVal = Number(row[recIdx]) || 0;
                            const paidVal = Number(row[paidIdx]) || 0;
                            const desc = String(row[locIdx + 3] || row[locIdx + 4] || '').trim();

                            if (location && (recVal > 0 || paidVal > 0)) {
                                expenseTemp.push({
                                    date: parseExcelDate(rawDate) || `${detectedMonth}-01`,
                                    siteName: location,
                                    amountReceived: recVal,
                                    amountPaid: paidVal,
                                    description: desc || `Imported transaction for ${location}`,
                                    balance: recVal - paidVal
                                });
                            }
                        });
                    }
                }

                // --- ROBUST NAME MATCHING & AUTO-MAPPING PASS ---
                const matchLogs: string[] = [];
                const unresolved = new Set<string>();

                const resolveAndMap = (rawName: string) => {
                    const res = resolveEmployeeName(rawName, staff, staffTemp, aliases);
                    if (res.employeeId && res.confidence >= 0.90) {
                        matchLogs.push(`Auto-mapped worker "${rawName}" to "${res.matchedName}" (${res.method} match, ${Math.round(res.confidence * 100)}% confidence)`);
                        return res.employeeId;
                    }
                    return '';
                };

                attendanceTemp = attendanceTemp.map((att) => {
                    const empId = resolveAndMap(att.employeeName);
                    if (!empId) unresolved.add(att.employeeName);
                    return {
                        ...att,
                        employeeId: empId
                    };
                });

                advanceTemp = advanceTemp.map((adv) => {
                    const empId = resolveAndMap(adv.employeeName);
                    if (!empId) unresolved.add(adv.employeeName);
                    return {
                        ...adv,
                        employeeId: empId
                    };
                });

                const unresolvedList = Array.from(unresolved);
                setUnresolvedNames(unresolvedList);
                setWarnings(matchLogs);

                if (unresolvedList.length === 0) {
                    setParsedStaff(staffTemp);
                    setParsedAttendance(attendanceTemp);
                    setParsedAdvances(advanceTemp);
                    setParsedExpenses(expenseTemp);
                    runValidations(staffTemp, attendanceTemp, advanceTemp, expenseTemp);
                    setIsValidated(true);
                } else {
                    setParsedStaff(staffTemp);
                    setParsedAttendance(attendanceTemp);
                    setParsedAdvances(advanceTemp);
                    setParsedExpenses(expenseTemp);

                    const initialMappings: Record<string, {
                        action: 'map' | 'create' | 'skip';
                        employeeId?: string;
                        role?: string;
                        standardWage?: number;
                    }> = {};
                    unresolvedList.forEach(name => {
                        const res = resolveEmployeeName(name, staff, staffTemp, aliases);
                        if (res.employeeId) {
                            initialMappings[name] = {
                                action: 'map',
                                employeeId: res.employeeId,
                                role: 'Carpenter',
                                standardWage: 500
                            };
                        } else {
                            initialMappings[name] = {
                                action: 'create',
                                role: 'Carpenter',
                                standardWage: 500
                            };
                        }
                    });
                    setUnresolvedMappings(initialMappings);
                    setShowUnresolvedModal(true);
                }
            } catch (err) {
                console.error(err);
                alert("Failed to parse Excel workbook. Check structure formatting.");
            } finally {
                setParsing(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const runValidations = (
        st: StaffRow[],
        att: AttendanceRow[],
        adv: AdvanceRow[],
        exp: ExpenseRow[]
    ) => {
        const errs: string[] = [];
        const warns: string[] = [];

        // Roster duplicate checking
        const existingStaffIds = new Set(staff.map(s => s.employeeId));
        const fileStaffIds = new Set<string>();
        const fileStaffPhones = new Set<string>();

        st.forEach((s, i) => {
            const line = i + 2;
            if (!s.fullName) errs.push(`Staff Row ${line}: Full Name is missing.`);

            if (fileStaffIds.has(s.employeeId)) {
                errs.push(`Staff Row ${line}: Duplicate Employee ID "${s.employeeId}" in file.`);
            }
            if (s.phone && fileStaffPhones.has(s.phone)) {
                errs.push(`Staff Row ${line}: Phone number "${s.phone}" belongs to multiple workers in file.`);
            }

            if (existingStaffIds.has(s.employeeId)) {
                warns.push(`Staff Row ${line}: Employee ID "${s.employeeId}" already exists. Importing will overwrite existing profile.`);
            }

            fileStaffIds.add(s.employeeId);
            if (s.phone) fileStaffPhones.add(s.phone);
        });

        // Attendance validations
        att.forEach((a, i) => {
            const line = i + 3;
            if (!a.employeeName) errs.push(`Attendance Row ${line}: Worker Name is missing.`);
            if (!a.employeeId) {
                warns.push(`Attendance Row ${line}: Worker "${a.employeeName}" could not be matched with any Employee ID. It will be skipped unless corrected.`);
            }

            // Unknown codes checking
            const validCodes = new Set(['S', 'P', 'H', 'D', 'A', '', '-']);
            Object.entries(a.days).forEach(([day, status]) => {
                if (!validCodes.has(status)) {
                    errs.push(`Attendance Row ${line} (Day ${day}): Unknown code "${status}". Allowed: S, P, H, D, A.`);
                }
            });
        });

        // Advances validations
        adv.forEach((ad, i) => {
            const line = i + 3;
            if (!ad.employeeName) errs.push(`Advance Row ${line}: Worker Name is missing.`);
            if (ad.amount < 0) errs.push(`Advance Row ${line}: Advance amount cannot be negative (${ad.amount}).`);
            if (!ad.date || isNaN(Date.parse(ad.date))) {
                errs.push(`Advance Row ${line}: Invalid Date format "${ad.date}".`);
            }
            if (!ad.employeeId) {
                warns.push(`Advance Row ${line}: Worker "${ad.employeeName}" could not be matched to an Employee ID.`);
            }
        });

        // Expenses validations
        exp.forEach((ex, i) => {
            const line = i + 3;
            if (!ex.siteName) errs.push(`Expense Row ${line}: Site Location Name is missing.`);
            if (ex.amountReceived < 0 || ex.amountPaid < 0) {
                errs.push(`Expense Row ${line}: Transaction amounts cannot be negative.`);
            }
            if (!ex.date || isNaN(Date.parse(ex.date))) {
                errs.push(`Expense Row ${line}: Invalid Date "${ex.date}".`);
            }
        });

        setErrors(errs);
        setWarnings(warns);
    };

    // Update cell inline helper
    const handleCellEdit = (tab: 'staff' | 'attendance' | 'advances' | 'expenses', index: number, field: string, value: any) => {
        if (tab === 'staff') {
            const copy = [...parsedStaff];
            copy[index] = { ...copy[index], [field]: value };
            setParsedStaff(copy);
        } else if (tab === 'attendance') {
            const copy = [...parsedAttendance];
            if (field.startsWith('day_')) {
                const day = field.replace('day_', '');
                copy[index].days = { ...copy[index].days, [day]: String(value).toUpperCase().trim() };

                // Re-calculate totals
                let workUnits = 0;
                let absents = 0;
                Object.values(copy[index].days).forEach((status) => {
                    switch (status) {
                        case 'S': workUnits += 1.0; break;
                        case 'P': workUnits += 1.5; break;
                        case 'H': workUnits += 0.5; break;
                        case 'D': workUnits += 2.0; break;
                        case 'A': absents += 1; break;
                        default: break;
                    }
                });
                copy[index].totalWorkUnits = workUnits;
                copy[index].totalAbsent = absents;
            } else {
                copy[index] = { ...copy[index], [field]: value };
            }
            setParsedAttendance(copy);
        } else if (tab === 'advances') {
            const copy = [...parsedAdvances];
            copy[index] = { ...copy[index], [field]: value };
            setParsedAdvances(copy);
        } else if (tab === 'expenses') {
            const copy = [...parsedExpenses];
            const updated = { ...copy[index], [field]: value };
            if (field === 'amountReceived' || field === 'amountPaid') {
                updated.balance = Number(updated.amountReceived || 0) - Number(updated.amountPaid || 0);
            }
            copy[index] = updated;
            setParsedExpenses(copy);
        }

        // Re-run validations to update indicators
        setTimeout(() => {
            runValidations(parsedStaff, parsedAttendance, parsedAdvances, parsedExpenses);
        }, 100);
    };

    const chunkArray = <T,>(arr: T[], size: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const commitImport = async () => {
        if (!isValidated || errors.length > 0) return;
        setImporting(true);
        setImportProgress(0);

        let logs = `SONU ENTERPRISES ERP - BULK DATA IMPORT LOG\n`;
        logs += `Timestamp: ${new Date().toLocaleString()}\n`;
        logs += `Target Attendance Month: ${importMonth}\n`;
        logs += `========================================\n\n`;

        let staffCount = 0;
        let attCount = 0;
        let advCount = 0;
        let expCount = 0;
        let failedRows = 0;
        let duplicatesSkipped = 0;
        let skippedRows = 0;

        try {
            const staffIdMap: Record<string, string> = {}; // employeeId -> docId

            // Always pre-populate staffIdMap with existing staff members in Firestore
            const staffQuery = await getDocs(collection(db, 'staff'));
            const existingMap: Record<string, string> = {}; // fullName -> docId
            const phoneMap: Record<string, string> = {}; // phone -> docId
            staffQuery.forEach((doc) => {
                const data = doc.data();
                if (data) {
                    if (data.fullName) {
                        existingMap[data.fullName.toUpperCase()] = doc.id;
                    }
                    if (data.phone) {
                        phoneMap[data.phone] = doc.id;
                    }
                    if (data.employeeId) {
                        staffIdMap[cleanEmployeeId(data.employeeId)] = doc.id;
                    }
                }
            });

            // 1. Staff Directory Import & Mapping
            if (parsedStaff.length > 0) {
                logs += `--- STAGE 1: Staff Directory Roster ---\n`;
                const staffChunks = chunkArray(parsedStaff, 200);
                let chunkIdx = 1;
                for (const chunk of staffChunks) {
                    const batch = writeBatch(db);
                    chunk.forEach((row) => {
                        const existingId = existingMap[row.fullName.toUpperCase()] || (row.phone ? phoneMap[row.phone] : null);
                        const docRef = existingId ? doc(db, 'staff', existingId) : doc(collection(db, 'staff'));

                        batch.set(docRef, {
                            ...row,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        }, { merge: true });

                        staffIdMap[row.employeeId] = docRef.id;
                        if (existingId) {
                            logs += `Updated profile: ${row.fullName} (${row.employeeId})\n`;
                            duplicatesSkipped++;
                        } else {
                            logs += `Created profile: ${row.fullName} (${row.employeeId})\n`;
                            staffCount++;
                        }
                    });
                    await batch.commit();
                    setImportProgress(Math.floor((chunkIdx / staffChunks.length) * 20));
                    chunkIdx++;
                }
            }

            // 2. Attendance Import
            if (parsedAttendance.length > 0) {
                logs += `\n--- STAGE 2: Attendance Sheets ---\n`;
                const attendanceChunks = chunkArray(parsedAttendance, 150);
                let chunkIdx = 1;
                for (const chunk of attendanceChunks) {
                    const batch = writeBatch(db);
                    const uniqueMonthsInBatch = new Set<string>();

                    chunk.forEach((row) => {
                        if (row.employeeId === 'SKIP' || !row.employeeId) {
                            logs += `Skipped attendance row: ${row.employeeName} (skip action)\n`;
                            skippedRows++;
                            return;
                        }

                        const docId = staffIdMap[cleanEmployeeId(row.employeeId)];
                        if (docId) {
                            const docRef = doc(db, 'attendance', row.month, 'employees', docId);
                            batch.set(docRef, {
                                employeeId: row.employeeId,
                                employeeName: row.employeeName,
                                days: row.days,
                                totalWorkUnits: row.totalWorkUnits,
                                totalAbsent: row.totalAbsent,
                                importedFromExcel: true,
                                staffId: docId,
                                monthId: row.month,
                                updatedAt: serverTimestamp()
                            }, { merge: true });

                            if (row.month) {
                                uniqueMonthsInBatch.add(row.month);
                            }

                            logs += `Imported attendance: ${row.employeeName} for ${row.month} (${row.totalWorkUnits} shifts)\n`;
                            attCount++;
                        } else {
                            logs += `ERROR: Could not find employee doc ID for "${row.employeeName}" (${row.employeeId}). Row skipped.\n`;
                            failedRows++;
                        }
                    });

                    // Set lock status only once per month in this batch
                    uniqueMonthsInBatch.forEach((mId) => {
                        const monthMetaRef = doc(db, 'attendance', mId);
                        batch.set(monthMetaRef, { locked: false }, { merge: true });
                    });

                    await batch.commit();
                    setImportProgress(20 + Math.floor((chunkIdx / attendanceChunks.length) * 20));
                    chunkIdx++;
                }
            }

            // 3. Advances Import
            if (parsedAdvances.length > 0) {
                logs += `\n--- STAGE 3: Advances Ledgers ---\n`;
                const advanceChunks = chunkArray(parsedAdvances, 200);
                let chunkIdx = 1;
                for (const chunk of advanceChunks) {
                    const batch = writeBatch(db);
                    chunk.forEach((row) => {
                        if (row.employeeId === 'SKIP' || !row.employeeId) {
                            logs += `Skipped advance row: ${row.employeeName} of ₹${row.amount} (skip action)\n`;
                            skippedRows++;
                            return;
                        }

                        const docId = staffIdMap[cleanEmployeeId(row.employeeId)];
                        if (docId) {
                            const docRef = doc(collection(db, 'advances'));
                            batch.set(docRef, {
                                employeeId: docId,
                                employeeName: row.employeeName,
                                amount: row.amount,
                                reason: row.reason,
                                date: row.date,
                                approvedBy: 'Admin (Excel Import)',
                                createdAt: serverTimestamp()
                            });
                            logs += `Imported Advance: ${row.employeeName} - ₹${row.amount} on ${row.date}\n`;
                            advCount++;
                        } else {
                            logs += `ERROR: Could not find employee doc ID for Advance "${row.employeeName}" (${row.employeeId}). Row skipped.\n`;
                            failedRows++;
                        }
                    });
                    await batch.commit();
                    setImportProgress(40 + Math.floor((chunkIdx / advanceChunks.length) * 20));
                    chunkIdx++;
                }
            }

            // 4. Expenses Import
            if (parsedExpenses.length > 0) {
                logs += `\n--- STAGE 4: Site Expense Ledgers ---\n`;
                const expenseChunks = chunkArray(parsedExpenses, 200);
                let chunkIdx = 1;
                for (const chunk of expenseChunks) {
                    const batch = writeBatch(db);
                    chunk.forEach((row) => {
                        const docRef = doc(collection(db, 'expenses'));
                        batch.set(docRef, {
                            date: row.date,
                            siteName: row.siteName,
                            amountReceived: row.amountReceived,
                            amountPaid: row.amountPaid,
                            balance: row.balance,
                            expenseType: row.amountPaid > 0 ? 'Site Expense' : 'Client Payment',
                            description: row.description,
                            createdBy: 'sonu (Excel Import)',
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                        logs += `Imported Expense: ${row.siteName} - Rec: ₹${row.amountReceived}, Paid: ₹${row.amountPaid} on ${row.date}\n`;
                        expCount++;
                    });
                    await batch.commit();
                    setImportProgress(60 + Math.floor((chunkIdx / expenseChunks.length) * 20));
                    chunkIdx++;
                }
            }

            // 5. Save Aliases Mapping to DB
            if (aliasesToCreate.length > 0) {
                logs += `\n--- STAGE 5: Save Employee Aliases ---\n`;
                const aliasChunks = chunkArray(aliasesToCreate, 200);
                let chunkIdx = 1;
                for (const chunk of aliasChunks) {
                    const batch = writeBatch(db);
                    chunk.forEach((alias) => {
                        const docRef = doc(collection(db, 'employeeAliases'));
                        batch.set(docRef, {
                            aliasName: alias.aliasName,
                            employeeId: alias.employeeId,
                            createdAt: serverTimestamp()
                        });
                        logs += `Saved Alias Mapping: "${alias.aliasName}" -> "${alias.employeeId}"\n`;
                    });
                    await batch.commit();
                    setImportProgress(80 + Math.floor((chunkIdx / aliasChunks.length) * 20));
                    chunkIdx++;
                }
            }

            logs += `\n========================================\n`;
            logs += `IMPORT RUN SUMMARY:\n`;
            logs += `- Staff Profiles Created: ${staffCount}\n`;
            logs += `- Profiles Updated/Merged: ${duplicatesSkipped}\n`;
            logs += `- Attendance Records Loaded: ${attCount}\n`;
            logs += `- Advance Slips Logs: ${advCount}\n`;
            logs += `- Site Expenses Loaded: ${expCount}\n`;
            logs += `- Unresolved Names Handled: ${unresolvedNames.length}\n`;
            logs += `- Auto-created Employees: ${autoCreatedCount}\n`;
            logs += `- Skipped Rows: ${skippedRows}\n`;
            logs += `- Failed Rows: ${failedRows}\n`;

            setSummary({
                sheetsProcessed: [parsedStaff.length > 0, parsedAttendance.length > 0, parsedAdvances.length > 0, parsedExpenses.length > 0].filter(Boolean).length,
                staffImported: staffCount,
                attendanceImported: attCount,
                advancesImported: advCount,
                expensesImported: expCount,
                failedRows,
                duplicatesSkipped,
                logText: logs,
                syncedRowsCount: attCount + advCount,
                skippedRowsCount: skippedRows,
                unresolvedNamesCount: unresolvedNames.length,
                autoCreatedEmployeesCount: autoCreatedCount
            });
            setImportProgress(100);
            alert("Spreadsheet data imported successfully!");
        } catch (err) {
            console.error(err);
            alert("Database import write failed. Confirm rules and permissions.");
        } finally {
            setImporting(false);
        }
    };

    const downloadLogFile = () => {
        if (!summary) return;
        const blob = new Blob([summary.logText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Sonu_ERP_Import_Log_${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
    };

    const handleConfirmMappings = () => {
        // Validate map actions have employeeId selected
        let hasErrors = false;
        Object.entries(unresolvedMappings).forEach(([name, mapping]) => {
            if (mapping.action === 'map' && !mapping.employeeId) {
                hasErrors = true;
            }
        });
        if (hasErrors) {
            alert("Please select a target employee for all manual name mappings.");
            return;
        }

        const copyStaff = [...parsedStaff];
        let copyAttendance = [...parsedAttendance];
        let copyAdvances = [...parsedAdvances];
        const newAliases: { aliasName: string; employeeId: string }[] = [];
        let newEmployeesCount = 0;

        Object.entries(unresolvedMappings).forEach(([rawName, mapping]) => {
            let empId = '';
            if (mapping.action === 'map' && mapping.employeeId) {
                empId = mapping.employeeId;
                newAliases.push({
                    aliasName: normalizeName(rawName),
                    employeeId: empId
                });
            } else if (mapping.action === 'create') {
                const maxSerial = Math.max(0, ...staff.map(s => s.serialNumber || 0), ...copyStaff.map(s => s.serialNumber || 0));
                const nextSerial = maxSerial + 1;
                empId = `SE${String(nextSerial).padStart(3, '0')}`;

                copyStaff.push({
                    serialNumber: nextSerial,
                    employeeId: empId,
                    fullName: rawName.trim().toUpperCase(),
                    phone: '',
                    alternatePhone: '',
                    documentsStatus: 'pending',
                    role: mapping.role || 'Carpenter',
                    salaryType: 'daily',
                    standardWage: Number(mapping.standardWage || 500),
                    overtimeWage: Number(mapping.standardWage || 500) * 1.5,
                    doubleShiftWage: Number(mapping.standardWage || 500) * 2,
                    joiningDate: `${importMonth}-01`,
                    status: 'active'
                });

                newAliases.push({
                    aliasName: normalizeName(rawName),
                    employeeId: empId
                });
                newEmployeesCount++;
            } else if (mapping.action === 'skip') {
                empId = 'SKIP';
            }

            if (empId) {
                copyAttendance = copyAttendance.map(att =>
                    att.employeeName === rawName ? { ...att, employeeId: empId } : att
                );
                copyAdvances = copyAdvances.map(adv =>
                    adv.employeeName === rawName ? { ...adv, employeeId: empId } : adv
                );
            }
        });

        setParsedStaff(copyStaff);
        setParsedAttendance(copyAttendance);
        setParsedAdvances(copyAdvances);
        setAliasesToCreate(newAliases);
        setAutoCreatedCount(newEmployeesCount);
        setShowUnresolvedModal(false);

        // Run validation with updated mappings
        runValidations(copyStaff, copyAttendance, copyAdvances, parsedExpenses);
        setIsValidated(true);
    };

    return (
        <div className="space-y-6 page-transition">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif text-stone-900 dark:text-white tracking-wide">Bulk Data Importer</h1>
                <p className="text-xs uppercase tracking-widest text-luxury-gold opacity-80 mt-1">Excel Spreadsheet Migration Module</p>
            </div>

            {/* Upload Section */}
            <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-8 shadow-glass flex flex-col items-center justify-center text-center relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />
                <Upload size={40} className="text-luxury-gold mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2 font-serif">Upload Workbook</h3>
                <p className="text-xs text-stone-500 max-w-sm mb-6">
                    Select a multi-sheet spreadsheet containing: **STAFF DETAILS**, **ATTENDANCE**, **ADVANCE**, and **sonu expenses calculation from**.
                </p>
                <label className="bg-black dark:bg-stone-900 border border-stone-200 dark:border-stone-850 text-stone-750 dark:text-stone-300 hover:border-luxury-gold/50 px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-850">
                    <FileSpreadsheet size={15} className="text-luxury-gold" />
                    <span>Choose Workbook File</span>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
                {file && (
                    <div className="mt-4 text-xs font-mono text-luxury-gold font-bold bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 px-4 py-2 rounded-xl">
                        Workbook: {file.name}
                    </div>
                )}
            </div>

            {/* Parse trigger */}
            {file && !isValidated && (
                <div className="flex justify-center">
                    <button
                        onClick={parseExcel}
                        disabled={parsing}
                        className="flex items-center gap-2 bg-luxury-gold text-stone-950 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-950 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {parsing ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                        <span>Parse & Validate Sheets</span>
                    </button>
                </div>
            )}

            {/* Summary Report Panel */}
            {summary && (
                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-200 dark:border-white/5 pb-3">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white font-serif flex items-center gap-2">
                            <ShieldCheck size={18} className="text-emerald-500 dark:text-emerald-400" />
                            <span>Import Success Report</span>
                        </h4>
                        <button
                            onClick={downloadLogFile}
                            className="flex items-center gap-1.5 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white border border-stone-200 dark:border-white/5 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-850 transition-all cursor-pointer"
                        >
                            <Download size={14} className="text-luxury-gold" />
                            <span>Download Import Log</span>
                        </button>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-xs space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                            <Check className="text-emerald-500" size={14} />
                            <span>Spreadsheet imported successfully!</span>
                        </p>
                        <p>Attendance records have been imported for the month of <strong>{importMonth}</strong>. To view them, navigate to the <Link to="/admin/staff/attendance" className="underline font-bold hover:text-luxury-gold">Attendance page</Link> and select <strong>{importMonth}</strong> from the month selector.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl p-3">
                            <p className="text-stone-500 uppercase font-black text-[8px] tracking-wider">Sheets Processed</p>
                            <p className="text-xl font-bold text-stone-900 dark:text-white mt-1">{summary.sheetsProcessed}</p>
                        </div>
                        <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl p-3">
                            <p className="text-stone-500 uppercase font-black text-[8px] tracking-wider">Staff Imported</p>
                            <p className="text-xl font-bold text-luxury-gold mt-1">{summary.staffImported} <span className="text-[10px] text-stone-500 dark:text-stone-400">({summary.duplicatesSkipped} merged)</span></p>
                        </div>
                        <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl p-3">
                            <p className="text-stone-500 uppercase font-black text-[8px] tracking-wider">Attendance Shifts</p>
                            <p className="text-xl font-bold text-stone-900 dark:text-white mt-1">{summary.attendanceImported}</p>
                        </div>
                        <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl p-3">
                            <p className="text-stone-500 uppercase font-black text-[8px] tracking-wider">Advances Logged</p>
                            <p className="text-xl font-bold text-stone-900 dark:text-white mt-1">{summary.advancesImported}</p>
                        </div>
                        <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl p-3">
                            <p className="text-stone-500 uppercase font-black text-[8px] tracking-wider">Synced Rows</p>
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{summary.syncedRowsCount || 0}</p>
                        </div>
                        <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl p-3">
                            <p className="text-stone-500 uppercase font-black text-[8px] tracking-wider">Skipped Rows</p>
                            <p className="text-xl font-bold text-red-650 dark:text-red-400 mt-1">{summary.skippedRowsCount || 0}</p>
                        </div>
                        <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl p-3">
                            <p className="text-stone-500 uppercase font-black text-[8px] tracking-wider">Unresolved Names</p>
                            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{summary.unresolvedNamesCount || 0}</p>
                        </div>
                        <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl p-3">
                            <p className="text-stone-500 uppercase font-black text-[8px] tracking-wider">Auto-created Employees</p>
                            <p className="text-xl font-bold text-sky-655 dark:text-sky-400 mt-1">{summary.autoCreatedEmployeesCount || 0}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Validation Panel */}
            {isValidated && !summary && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass space-y-4">
                        <h4 className="text-xs uppercase font-black text-luxury-gold tracking-widest border-b border-stone-200 dark:border-white/5 pb-2">Pre-Import Validation</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Errors */}
                            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-2">
                                <h5 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                                    <AlertCircle size={14} /> Errors ({errors.length})
                                </h5>
                                {errors.length > 0 ? (
                                    <ul className="list-disc pl-5 space-y-1.5 text-stone-600 dark:text-stone-400 font-mono text-[10px] max-h-40 overflow-y-auto premium-scroll" data-lenis-prevent>
                                        {errors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                ) : (
                                    <p className="text-stone-500 font-mono text-[10px]">No blocker errors found. Ready to commit.</p>
                                )}
                            </div>

                            {/* Warnings */}
                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2">
                                <h5 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                                    <HelpCircle size={14} /> Warnings / Match Logs ({warnings.length})
                                </h5>
                                {warnings.length > 0 ? (
                                    <ul className="list-disc pl-5 space-y-1.5 text-stone-600 dark:text-stone-400 font-mono text-[10px] max-h-40 overflow-y-auto premium-scroll" data-lenis-prevent>
                                        {warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                                    </ul>
                                ) : (
                                    <p className="text-stone-500 font-mono text-[10px]">All staff matched correctly.</p>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {importing && (
                            <div className="space-y-1.5 pt-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-luxury-gold tracking-widest">
                                    <span>Writing to Firestore...</span>
                                    <span>{importProgress}%</span>
                                </div>
                                <div className="h-1.5 bg-stone-100 dark:bg-white/5 rounded-full overflow-hidden border border-stone-200 dark:border-white/5">
                                    <div
                                        className="h-full bg-luxury-gold transition-all duration-300 shadow-glow-gold"
                                        style={{ width: `${importProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Trigger Import */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-white/5">
                            <button
                                onClick={commitImport}
                                disabled={errors.length > 0 || importing}
                                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${errors.length > 0
                                    ? 'bg-stone-100 text-stone-400 border border-stone-200 dark:bg-stone-900 dark:text-stone-600 dark:border-stone-850 cursor-not-allowed'
                                    : 'bg-emerald-500 text-stone-950 shadow-glow-green hover:bg-emerald-600 dark:hover:bg-white hover:text-white dark:hover:text-stone-950'
                                    }`}
                            >
                                {importing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                <span>Commit Data Import</span>
                            </button>
                        </div>
                    </div>

                    {/* Pre-Import Previews & Edits */}
                    <div className="space-y-4">
                        <div className="flex border-b border-stone-200 dark:border-white/5 text-xs">
                            <button
                                onClick={() => setActiveTab('staff')}
                                className={`px-6 py-3 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'staff' ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
                                    }`}
                            >
                                Staff Details ({parsedStaff.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('attendance')}
                                className={`px-6 py-3 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'attendance' ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
                                    }`}
                            >
                                Attendance Grid ({parsedAttendance.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('advances')}
                                className={`px-6 py-3 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'advances' ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
                                    }`}
                            >
                                Advances Matrix ({parsedAdvances.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('expenses')}
                                className={`px-6 py-3 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'expenses' ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-white'
                                    }`}
                            >
                                Expenses Ledger ({parsedExpenses.length})
                            </button>
                        </div>

                        {/* Interactive Tables */}
                        <div className="bg-white dark:bg-[#050505]/40 backdrop-blur-md border border-stone-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-glass">
                            <div className="overflow-x-auto relative premium-scroll max-h-[50vh]">

                                {/* 1. Staff Preview */}
                                {activeTab === 'staff' && (
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-white/5 text-[9px] uppercase tracking-wider font-black text-stone-600 dark:text-stone-400 animate-fade">
                                                <th className="px-4 py-3">Sr. No</th>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Mobile No.</th>
                                                <th className="px-4 py-3">Alt No.</th>
                                                <th className="px-4 py-3">Role</th>
                                                <th className="px-4 py-3">Docs Status</th>
                                                <th className="px-4 py-3 text-right">Standard Wage</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-200 dark:divide-white/5 text-stone-800 dark:text-stone-300">
                                            {parsedStaff.map((row, i) => (
                                                <tr key={i} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors border-b border-stone-100 dark:border-white/5">
                                                    <td className="px-4 py-3 font-mono">{row.serialNumber}</td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={row.fullName}
                                                            onChange={(e) => handleCellEdit('staff', i, 'fullName', e.target.value.toUpperCase())}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-full text-stone-900 dark:text-white font-bold"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={row.phone}
                                                            onChange={(e) => handleCellEdit('staff', i, 'phone', e.target.value)}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-full font-mono text-stone-850 dark:text-stone-300"
                                                            placeholder="No phone"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={row.alternatePhone}
                                                            onChange={(e) => handleCellEdit('staff', i, 'alternatePhone', e.target.value)}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-full font-mono text-stone-800 dark:text-stone-350"
                                                            placeholder="No alternative"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <select
                                                            value={row.role}
                                                            onChange={(e) => handleCellEdit('staff', i, 'role', e.target.value)}
                                                            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded px-2 py-0.5 outline-none text-stone-800 dark:text-stone-300 focus:border-luxury-gold cursor-pointer text-xs"
                                                        >
                                                            <option value="Carpenter" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Carpenter</option>
                                                            <option value="Helper" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Helper</option>
                                                            <option value="Painter" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Painter</option>
                                                            <option value="Supervisor" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Supervisor</option>
                                                            <option value="Designer" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Designer</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <select
                                                            value={row.documentsStatus}
                                                            onChange={(e) => handleCellEdit('staff', i, 'documentsStatus', e.target.value)}
                                                            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded px-2 py-0.5 outline-none text-stone-800 dark:text-stone-300 focus:border-luxury-gold cursor-pointer text-xs"
                                                        >
                                                            <option value="verified" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Verified</option>
                                                            <option value="pending" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Pending</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            value={row.standardWage}
                                                            onChange={(e) => handleCellEdit('staff', i, 'standardWage', Number(e.target.value))}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-20 text-right text-stone-900 dark:text-white font-bold"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* 2. Attendance Preview */}
                                {activeTab === 'attendance' && (
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-white/5 text-[9px] uppercase tracking-wider font-black text-stone-600 dark:text-stone-400">
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Emp ID</th>
                                                <th className="px-4 py-3 text-right">8h Wage</th>
                                                <th className="px-4 py-3 text-right">12h Wage</th>
                                                <th className="px-4 py-3 text-center">Work Units</th>
                                                <th className="px-4 py-3 text-center">Absents</th>
                                                <th className="px-4 py-3">Days (1-31) preview</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-200 dark:divide-white/5 text-stone-850 dark:text-stone-300">
                                            {parsedAttendance.map((row, i) => (
                                                <tr key={i} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors border-b border-stone-100 dark:border-white/5">
                                                    <td className="px-4 py-3 text-stone-900 dark:text-white font-semibold">{row.employeeName}</td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={row.employeeId}
                                                            onChange={(e) => handleCellEdit('attendance', i, 'employeeId', e.target.value.toUpperCase())}
                                                            className={`bg-transparent border-b outline-none font-mono text-[10px] w-20 font-bold ${!row.employeeId ? 'border-amber-500/50 text-amber-600 dark:text-amber-400' : 'border-transparent text-luxury-gold'
                                                                }`}
                                                            placeholder="Unresolved"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">₹{row.rate8hrs}</td>
                                                    <td className="px-4 py-3 text-right">₹{row.rate12hrs}</td>
                                                    <td className="px-4 py-3 text-center font-bold text-stone-900 dark:text-white font-mono">{row.totalWorkUnits.toFixed(1)}</td>
                                                    <td className="px-4 py-3 text-center font-mono text-red-650 dark:text-red-400">{row.totalAbsent}</td>
                                                    <td className="px-4 py-3 max-w-xs truncate font-mono text-[10px] text-stone-500 dark:text-stone-450">
                                                        {Object.entries(row.days).map(([d, val]) => `${d}:${val}`).join(', ')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* 3. Advances Preview */}
                                {activeTab === 'advances' && (
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-white/5 text-[9px] uppercase tracking-wider font-black text-stone-600 dark:text-stone-400">
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Emp ID</th>
                                                <th className="px-4 py-3 text-right">Advance Amount</th>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Description / Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-200 dark:divide-white/5 text-stone-850 dark:text-stone-300">
                                            {parsedAdvances.map((row, i) => (
                                                <tr key={i} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors border-b border-stone-100 dark:border-white/5">
                                                    <td className="px-4 py-3 text-stone-900 dark:text-white font-semibold">{row.employeeName}</td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={row.employeeId}
                                                            onChange={(e) => handleCellEdit('advances', i, 'employeeId', e.target.value.toUpperCase())}
                                                            className={`bg-transparent border-b outline-none font-mono text-[10px] w-20 font-bold ${!row.employeeId ? 'border-amber-500/50 text-amber-600 dark:text-amber-400' : 'border-transparent text-luxury-gold'
                                                                }`}
                                                            placeholder="Unresolved"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            value={row.amount}
                                                            onChange={(e) => handleCellEdit('advances', i, 'amount', Number(e.target.value))}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-24 text-right font-bold text-red-650 dark:text-red-400 font-mono"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={row.date}
                                                            onChange={(e) => handleCellEdit('advances', i, 'date', e.target.value)}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-28 font-mono text-stone-700 dark:text-stone-400"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={row.reason}
                                                            onChange={(e) => handleCellEdit('advances', i, 'reason', e.target.value)}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-full text-stone-700 dark:text-stone-400"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* 4. Expenses Preview */}
                                {activeTab === 'expenses' && (
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-white/5 text-[9px] uppercase tracking-wider font-black text-stone-600 dark:text-stone-400">
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Site Location</th>
                                                <th className="px-4 py-3 text-right">Received (Inward)</th>
                                                <th className="px-4 py-3 text-right">Paid (Expense)</th>
                                                <th className="px-4 py-3 text-right">Net Balance</th>
                                                <th className="px-4 py-3">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-200 dark:divide-white/5 text-stone-850 dark:text-stone-300">
                                            {parsedExpenses.map((row, i) => (
                                                <tr key={i} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors border-b border-stone-100 dark:border-white/5">
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={row.date}
                                                            onChange={(e) => handleCellEdit('expenses', i, 'date', e.target.value)}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-28 font-mono text-stone-700 dark:text-stone-400"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-stone-900 dark:text-white font-semibold">{row.siteName}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            value={row.amountReceived}
                                                            onChange={(e) => handleCellEdit('expenses', i, 'amountReceived', Number(e.target.value))}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-24 text-right text-emerald-600 dark:text-emerald-400 font-mono font-bold"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            value={row.amountPaid}
                                                            onChange={(e) => handleCellEdit('expenses', i, 'amountPaid', Number(e.target.value))}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-24 text-right text-red-600 dark:text-red-400 font-mono font-bold"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold font-mono">
                                                        <span className={row.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                                                            ₹{row.balance.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={row.description}
                                                            onChange={(e) => handleCellEdit('expenses', i, 'description', e.target.value)}
                                                            className="bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-white/20 focus:border-luxury-gold outline-none w-full text-stone-700 dark:text-stone-400"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Unresolved Workers Modal */}
            {showUnresolvedModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-luxury-gold/30 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl" data-lenis-prevent>
                        {/* Modal Header */}
                        <div className="p-6 border-b border-stone-200 dark:border-white/5 flex justify-between items-center bg-stone-50 dark:bg-[#070707]">
                            <div>
                                <h3 className="text-lg font-serif text-stone-900 dark:text-white tracking-wide flex items-center gap-2">
                                    <HelpCircle className="text-luxury-gold" size={20} />
                                    <span>Unresolved Worker Names ({unresolvedNames.length})</span>
                                </h3>
                                <p className="text-[10px] text-stone-550 dark:text-stone-500 uppercase tracking-widest mt-1">Manual Action Required for Attendance & Advance Alignment</p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 premium-scroll">
                            <p className="text-xs text-stone-750 dark:text-stone-400 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 p-4 rounded-xl">
                                The following worker names from the Attendance or Advances sheets could not be automatically matched with high confidence to the Roster directory. Please specify how to handle each name:
                            </p>

                            <div className="space-y-4">
                                {unresolvedNames.map((name) => {
                                    const mapping = unresolvedMappings[name] || { action: 'create', role: 'Carpenter', standardWage: 500 };

                                    const uniqueOptionsMap: Record<string, string> = {};
                                    staff.forEach(s => {
                                        if (s.employeeId) {
                                            const cleaned = cleanEmployeeId(s.employeeId);
                                            if (cleaned) {
                                                uniqueOptionsMap[cleaned] = s.fullName;
                                            }
                                        }
                                    });
                                    parsedStaff.forEach(s => {
                                        if (s.employeeId) {
                                            const cleaned = cleanEmployeeId(s.employeeId);
                                            if (cleaned) {
                                                uniqueOptionsMap[cleaned] = s.fullName;
                                            }
                                        }
                                    });
                                    const directoryOptions = Object.entries(uniqueOptionsMap).map(([id, name]) => ({
                                        employeeId: id,
                                        fullName: name
                                    }));

                                    return (
                                        <div key={name} className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            {/* Left: Name and Info */}
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-stone-900 dark:text-white font-mono">{name}</p>
                                                <p className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">Raw Sheet Name</p>
                                            </div>

                                            {/* Middle: Action Choice */}
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={mapping.action}
                                                    onChange={(e) => {
                                                        const action = e.target.value as 'map' | 'create' | 'skip';
                                                        setUnresolvedMappings(prev => ({
                                                            ...prev,
                                                            [name]: { ...prev[name], action }
                                                        }));
                                                    }}
                                                    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-300 rounded-lg text-xs p-2.5 outline-none focus:border-luxury-gold/50 cursor-pointer"
                                                >
                                                    <option value="map" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Map to Existing Employee</option>
                                                    <option value="create" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Create New Employee</option>
                                                    <option value="skip" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Skip Attendance & Advance</option>
                                                </select>

                                                {/* Action Details */}
                                                {mapping.action === 'map' && (
                                                    <select
                                                        value={mapping.employeeId || ''}
                                                        onChange={(e) => {
                                                            setUnresolvedMappings(prev => ({
                                                                ...prev,
                                                                [name]: { ...prev[name], employeeId: e.target.value }
                                                            }));
                                                        }}
                                                        className="bg-white dark:bg-[#0c0c0c] border border-stone-200 dark:border-stone-800 text-luxury-gold rounded-lg text-xs p-2.5 outline-none focus:border-luxury-gold max-w-[200px] cursor-pointer"
                                                    >
                                                        <option value="" className="bg-white text-stone-900 dark:bg-[#0c0c0c] dark:text-white">-- Select Employee --</option>
                                                        {directoryOptions.map((opt) => (
                                                            <option key={opt.employeeId} value={opt.employeeId} className="bg-white text-stone-900 dark:bg-[#0c0c0c] dark:text-white">
                                                                {opt.fullName} ({opt.employeeId})
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}

                                                {mapping.action === 'create' && (
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={mapping.role || 'Carpenter'}
                                                            onChange={(e) => {
                                                                setUnresolvedMappings(prev => ({
                                                                    ...prev,
                                                                    [name]: { ...prev[name], role: e.target.value }
                                                                }));
                                                            }}
                                                            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-300 rounded-lg text-xs p-2.5 outline-none focus:border-luxury-gold/50 cursor-pointer"
                                                        >
                                                            <option value="Carpenter" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Carpenter</option>
                                                            <option value="Painter" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Painter</option>
                                                            <option value="Electrician" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Electrician</option>
                                                            <option value="POP Worker" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">POP Worker</option>
                                                            <option value="Tile Worker" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Tile Worker</option>
                                                            <option value="Plumber" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Plumber</option>
                                                            <option value="Fabricator" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Fabricator</option>
                                                            <option value="Supervisor" className="bg-white text-stone-900 dark:bg-stone-900 dark:text-white">Supervisor</option>
                                                        </select>
                                                        <input
                                                            type="number"
                                                            placeholder="Wage"
                                                            value={mapping.standardWage || 500}
                                                            onChange={(e) => {
                                                                setUnresolvedMappings(prev => ({
                                                                    ...prev,
                                                                    [name]: { ...prev[name], standardWage: Number(e.target.value) }
                                                                }));
                                                            }}
                                                            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-300 rounded-lg text-xs p-2.5 outline-none w-20 text-center focus:border-luxury-gold"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-stone-200 dark:border-white/5 flex justify-end gap-3 bg-stone-50 dark:bg-[#070707]">
                            <button
                                onClick={() => {
                                    setShowUnresolvedModal(false);
                                    setFile(null);
                                    setIsValidated(false);
                                }}
                                className="bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-stone-200 dark:border-white/5 hover:bg-stone-100 cursor-pointer"
                            >
                                Cancel Import
                            </button>
                            <button
                                onClick={handleConfirmMappings}
                                className="bg-luxury-gold text-stone-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-950 transition-all cursor-pointer"
                            >
                                Apply Mappings
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
