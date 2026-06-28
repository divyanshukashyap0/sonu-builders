import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useStaff } from '../hooks/useStaff';
import { db } from '../firebase';
import { collection, writeBatch, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import {
    Upload, FileSpreadsheet, CheckCircle2, AlertTriangle,
    Loader2, Table, ShieldCheck, X, ChevronRight, ArrowLeft, Save
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
    employeeId: string;
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
    employeeId: string;
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

interface BulkImporterProps {
    onBack: () => void;
}

export default function BulkImporter({ onBack }: BulkImporterProps) {
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

    // Validation Report States
    const [errors, setErrors] = useState<string[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [isValidated, setIsValidated] = useState(false);
    const [summary, setSummary] = useState<ImportSummary | null>(null);

    // Aliases & Unresolved names resolution
    const [aliases, setAliases] = useState<{ aliasName: string; employeeId: string }[]>([]);
    const [unresolvedNames, setUnresolvedNames] = useState<string[]>([]);
    const [showUnresolvedModal, setShowUnresolvedModal] = useState(false);
    const [unresolvedMappings, setUnresolvedMappings] = useState<Record<string, {
        action: 'map' | 'create' | 'skip';
        employeeId?: string;
        role?: string;
        standardWage?: number;
    }>>({});

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
            .replace(/\./g, '')
            .replace(/[^A-Z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
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

        const searchPool = [
            ...existingStaff.map(s => ({ employeeId: cleanEmployeeId(s.employeeId), fullName: s.fullName, normalized: normalizeName(s.fullName) })),
            ...parsedStaffList.map(s => ({ employeeId: cleanEmployeeId(s.employeeId), fullName: s.fullName, normalized: normalizeName(s.fullName) }))
        ];

        const exactMatch = searchPool.find(s => s.normalized === normalized);
        if (exactMatch) {
            return { employeeId: exactMatch.employeeId, method: 'exact', confidence: 1.0, matchedName: exactMatch.fullName };
        }

        let partialMatch = searchPool.find(s => s.normalized.startsWith(normalized) || normalized.startsWith(s.normalized));
        if (!partialMatch) {
            partialMatch = searchPool.find(s => s.normalized.includes(normalized) || normalized.includes(s.normalized));
        }
        if (partialMatch) {
            return { employeeId: partialMatch.employeeId, method: 'partial', confidence: 0.95, matchedName: partialMatch.fullName };
        }

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

                const sheetNames = workbook.SheetNames;
                const staffSheetKey = sheetNames.find(n => n.toUpperCase().includes('STAFF'));
                const attendanceSheetKey = sheetNames.find(n => n.toUpperCase().includes('ATTENDANCE'));
                const advanceSheetKey = sheetNames.find(n => n.toUpperCase().includes('ADVANCE'));
                const expenseSheetKey = sheetNames.find(n => n.toUpperCase().includes('EXPENSE') || n.toUpperCase().includes('sonu'));

                let detectedMonth = '2026-06';

                // Parse Attendance
                let attendanceTemp: AttendanceRow[] = [];
                if (attendanceSheetKey) {
                    const sheet = workbook.Sheets[attendanceSheetKey];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];

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

                    const headerRow = rows[1] as any[];
                    if (headerRow) {
                        const dataRows = rows.slice(2);
                        dataRows.forEach((row) => {
                            const name = String(row[1] || '').trim();
                            if (!name || name === 'NAME') return;

                            const salary = Number(row[2]) || 0;
                            const wageType = String(row[3] || '8 HRS').trim().toUpperCase();
                            const rate8hrs = Number(row[4]) || 0;
                            const rate12hrs = Number(row[5]) || 0;

                            const days: Record<string, string> = {};
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

                // Parse Staff details
                let staffTemp: StaffRow[] = [];
                if (staffSheetKey) {
                    const sheet = workbook.Sheets[staffSheetKey];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];
                    const headerRow = rows[0] as string[];

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

                // Parse Advances
                let advanceTemp: AdvanceRow[] = [];
                if (advanceSheetKey) {
                    const sheet = workbook.Sheets[advanceSheetKey];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];
                    const headerRow = rows[0] as string[];

                    if (headerRow) {
                        let isMatrix = false;
                        const firstCell = String(headerRow[0]).toUpperCase();
                        if ((firstCell.includes('DATE') || firstCell.includes('SR')) && !headerRow.some(h => String(h).toUpperCase().includes('AMOUNT'))) {
                            isMatrix = true;
                        }

                        if (isMatrix) {
                            const dataRows = rows.slice(2);
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
                                            employeeId: '',
                                            amount: val,
                                            date: `${detectedMonth}-${String(day).padStart(2, '0')}`,
                                            reason: `Advance on Day ${day} (Imported)`,
                                            month: detectedMonth
                                        });
                                    }
                                }
                            });
                        } else {
                            const rawData = XLSX.utils.sheet_to_json(sheet) as any[];
                            rawData.forEach((row) => {
                                const name = String(row.employeeName || row.Name || row.name || row.Employee || '').trim();
                                const amt = Number(row.amount || row.amountReceived || row.Amount || row.Advance || 0);
                                const dateVal = parseExcelDate(row.date || row.Date);

                                if (name && amt > 0) {
                                    advanceTemp.push({
                                        employeeName: name,
                                        employeeId: '',
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

                // Parse Expenses
                let expenseTemp: ExpenseRow[] = [];
                if (expenseSheetKey) {
                    const sheet = workbook.Sheets[expenseSheetKey];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];

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

                // Auto mapping PASS
                const matchLogs: string[] = [];
                const unresolved = new Set<string>();

                const resolveAndMap = (rawName: string) => {
                    const res = resolveEmployeeName(rawName, staff, staffTemp, aliases);
                    if (res.employeeId && res.confidence >= 0.90) {
                        matchLogs.push(`Auto-mapped "${rawName}" to "${res.matchedName}"`);
                        return res.employeeId;
                    }
                    return '';
                };

                attendanceTemp = attendanceTemp.map((att) => {
                    const empId = resolveAndMap(att.employeeName);
                    if (!empId) unresolved.add(att.employeeName);
                    return { ...att, employeeId: empId };
                });

                advanceTemp = advanceTemp.map((adv) => {
                    const empId = resolveAndMap(adv.employeeName);
                    if (!empId) unresolved.add(adv.employeeName);
                    return { ...adv, employeeId: empId };
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
                alert("Failed to parse Excel spreadsheet.");
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

        const existingStaffIds = new Set(staff.map(s => s.employeeId));
        const fileStaffIds = new Set<string>();

        st.forEach((s, i) => {
            const line = i + 2;
            if (!s.fullName) errs.push(`Staff Row ${line}: Full name is missing.`);
            if (fileStaffIds.has(s.employeeId)) {
                errs.push(`Staff Row ${line}: Duplicate Employee ID "${s.employeeId}".`);
            }
            if (existingStaffIds.has(s.employeeId)) {
                warns.push(`Staff Row ${line}: Employee ID "${s.employeeId}" exists and will be overwritten.`);
            }
            fileStaffIds.add(s.employeeId);
        });

        att.forEach((a, i) => {
            const line = i + 3;
            if (!a.employeeName) errs.push(`Attendance Row ${line}: Worker name is missing.`);
            if (!a.employeeId) {
                warns.push(`Attendance Row ${line}: Worker "${a.employeeName}" is not mapped and will be skipped.`);
            }
        });

        adv.forEach((ad, i) => {
            const line = i + 3;
            if (!ad.employeeName) errs.push(`Advance Row ${line}: Worker name is missing.`);
            if (ad.amount < 0) errs.push(`Advance Row ${line}: Loan amount cannot be negative.`);
        });

        setErrors(errs);
        setWarnings(prev => [...prev, ...warns]);
    };

    const handleUnresolvedMappingsSubmit = () => {
        // Save mappings
        const updatedAttendance = parsedAttendance.map(att => {
            if (!att.employeeId) {
                const map = unresolvedMappings[att.employeeName];
                if (map && map.action === 'map') {
                    return { ...att, employeeId: map.employeeId || '' };
                }
            }
            return att;
        });

        const updatedAdvances = parsedAdvances.map(adv => {
            if (!adv.employeeId) {
                const map = unresolvedMappings[adv.employeeName];
                if (map && map.action === 'map') {
                    return { ...adv, employeeId: map.employeeId || '' };
                }
            }
            return adv;
        });

        setParsedAttendance(updatedAttendance);
        setParsedAdvances(updatedAdvances);
        setShowUnresolvedModal(false);
        runValidations(parsedStaff, updatedAttendance, updatedAdvances, parsedExpenses);
        setIsValidated(true);
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
        setImportProgress(10);

        try {
            const staffIdMap: Record<string, string> = {}; // employeeId -> docId

            const staffQuery = await getDocs(collection(db, 'staff'));
            staffQuery.forEach((doc) => {
                const data = doc.data();
                if (data && data.employeeId) {
                    staffIdMap[cleanEmployeeId(data.employeeId)] = doc.id;
                }
            });

            // 1. Staff directory upload
            if (parsedStaff.length > 0) {
                const staffChunks = chunkArray(parsedStaff, 100);
                for (const chunk of staffChunks) {
                    const batch = writeBatch(db);
                    chunk.forEach((row) => {
                        const existingDocId = staffIdMap[cleanEmployeeId(row.employeeId)];
                        const docRef = existingDocId ? doc(db, 'staff', existingDocId) : doc(collection(db, 'staff'));
                        batch.set(docRef, {
                            ...row,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        }, { merge: true });

                        staffIdMap[cleanEmployeeId(row.employeeId)] = docRef.id;
                    });
                    await batch.commit();
                }
            }
            setImportProgress(40);

            // 2. Attendance upload
            if (parsedAttendance.length > 0) {
                const attendanceChunks = chunkArray(parsedAttendance, 100);
                for (const chunk of attendanceChunks) {
                    const batch = writeBatch(db);
                    chunk.forEach((row) => {
                        if (!row.employeeId) return;

                        const docRef = doc(db, 'attendance', importMonth, 'employees', row.employeeId);
                        batch.set(docRef, {
                            staffId: row.employeeId,
                            monthId: importMonth,
                            days: row.days,
                            totalWorkUnits: row.totalWorkUnits,
                            totalAbsent: row.totalAbsent,
                            updatedAt: serverTimestamp()
                        }, { merge: true });
                    });
                    await batch.commit();
                }
            }
            setImportProgress(70);

            // 3. Advances upload
            if (parsedAdvances.length > 0) {
                const advanceChunks = chunkArray(parsedAdvances, 100);
                for (const chunk of advanceChunks) {
                    const batch = writeBatch(db);
                    chunk.forEach((row) => {
                        if (!row.employeeId) return;

                        const docRef = doc(collection(db, 'advances'));
                        batch.set(docRef, {
                            employeeId: row.employeeId,
                            employeeName: row.employeeName,
                            amount: row.amount,
                            reason: row.reason,
                            date: row.date,
                            approvedBy: 'Admin (Excel Import)',
                            createdAt: serverTimestamp()
                        });
                    });
                    await batch.commit();
                }
            }
            setImportProgress(90);

            // 4. Expenses upload
            if (parsedExpenses.length > 0) {
                const expenseChunks = chunkArray(parsedExpenses, 100);
                for (const chunk of expenseChunks) {
                    const batch = writeBatch(db);
                    chunk.forEach((row) => {
                        const docRef = doc(collection(db, 'expenses'));
                        batch.set(docRef, {
                            ...row,
                            expenseType: 'Miscellaneous Expense',
                            createdBy: 'Admin (Excel Import)',
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                    });
                    await batch.commit();
                }
            }

            setImportProgress(100);
            alert("Bulk database import completed successfully!");
            setFile(null);
            setIsValidated(false);
        } catch (err) {
            console.error(err);
            alert("Firestore batch commit failed.");
        } finally {
            setImporting(false);
            setImportProgress(0);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-8 select-none">
            {/* Header */}
            <div className="flex items-center gap-2">
                <button onClick={onBack} className="p-2 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-xl text-neutral-400 hover:text-white cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h2 className="text-base font-bold text-white leading-none">Bulk Importer</h2>
                    <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold">Excel Database Uploader</span>
                </div>
            </div>

            {/* Template Card */}
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl space-y-2">
                <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-black block">Spreadsheet Requirements</span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                    Upload an Excel file with sheets named exactly:
                    <span className="text-white font-bold font-mono ml-1">Staff Details, Attendance, Advance, Expense</span>.
                </p>
            </div>

            {/* Upload Area */}
            <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 bg-neutral-950 border border-white/5 rounded-full flex items-center justify-center text-[#c5a059] shadow-glow-gold">
                    <FileSpreadsheet className="w-7 h-7" />
                </div>
                <div>
                    <span className="text-xs text-white font-bold block">Choose Excel File</span>
                    <span className="text-[9px] text-neutral-500 block mt-1">Accepts .xlsx or .xls templates</span>
                </div>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-neutral-950 file:text-[#c5a059] file:font-bold file:cursor-pointer"
                />

                {file && (
                    <button
                        onClick={parseExcel}
                        disabled={parsing}
                        className="w-full bg-[#c5a059] text-black font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-98"
                    >
                        {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <span>Parse Spreadsheet</span>
                    </button>
                )}
            </div>

            {/* Validation reports */}
            {isValidated && (
                <div className="space-y-4">
                    {/* Error / Warning Panels */}
                    {errors.length > 0 ? (
                        <div className="bg-red-500/10 border border-red-500/25 p-4 rounded-xl space-y-2">
                            <span className="text-[9px] font-black uppercase text-red-400 block tracking-wider">Critical Errors ({errors.length})</span>
                            <div className="max-h-[150px] overflow-y-auto space-y-1 premium-scroll text-[9px] text-red-300 font-mono">
                                {errors.map((e, idx) => <p key={idx}>· {e}</p>)}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-xl flex items-start gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-450 shrink-0" />
                            <span className="text-[10px] text-emerald-400 leading-snug">Roster structure passed initial schema validation. Ready to write to database.</span>
                        </div>
                    )}

                    {warnings.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-xl space-y-2">
                            <span className="text-[9px] font-black uppercase text-amber-400 block tracking-wider font-bold">Warnings ({warnings.length})</span>
                            <div className="max-h-[150px] overflow-y-auto space-y-1 premium-scroll text-[9px] text-amber-300 font-mono">
                                {warnings.map((w, idx) => <p key={idx}>· {w}</p>)}
                            </div>
                        </div>
                    )}

                    {/* Commit Button */}
                    {errors.length === 0 && (
                        <button
                            onClick={commitImport}
                            disabled={importing}
                            className="w-full bg-[#c5a059] text-black font-black py-3 rounded-xl uppercase tracking-widest text-[10px] shadow-glow-gold flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                        >
                            {importing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Writing Batches ({importProgress}%)</span>
                                </div>
                            ) : (
                                <>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Commit Imports</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Unresolved Mappings Drawer */}
            {showUnresolvedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden my-6">
                        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-gradient-to-r from-[#c5a059]/10 to-transparent">
                            <div>
                                <h3 className="text-xs font-bold text-white">Resolve Employee Names</h3>
                                <p className="text-[8px] uppercase text-neutral-400 tracking-wider mt-0.5">Fuzzy Matching Manager</p>
                            </div>
                            <button onClick={() => setShowUnresolvedModal(false)} className="p-1 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4 text-xs select-none">
                            {unresolvedNames.map((name) => {
                                const map = unresolvedMappings[name] || { action: 'skip' };
                                return (
                                    <div key={name} className="bg-neutral-950 p-3 border border-white/5 rounded-xl space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-white">{name}</span>
                                            <select
                                                value={map.action}
                                                onChange={(e) => setUnresolvedMappings(prev => ({
                                                    ...prev,
                                                    [name]: { ...prev[name], action: e.target.value as any }
                                                }))}
                                                className="bg-neutral-900 border border-white/5 rounded px-2 py-1 text-[9px] text-neutral-300 font-bold"
                                            >
                                                <option value="map">Link to Existing</option>
                                                <option value="create">Onboard New</option>
                                                <option value="skip">Skip Row</option>
                                            </select>
                                        </div>

                                        {map.action === 'map' && (
                                            <select
                                                value={map.employeeId || ''}
                                                onChange={(e) => setUnresolvedMappings(prev => ({
                                                    ...prev,
                                                    [name]: { ...prev[name], employeeId: e.target.value }
                                                }))}
                                                className="w-full bg-neutral-900 border border-white/5 rounded p-2 text-[10px] text-white"
                                            >
                                                <option value="">-- Choose Existing Employee --</option>
                                                {staff.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.role})</option>)}
                                            </select>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-5 border-t border-white/5 bg-neutral-950 flex gap-2">
                            <button
                                onClick={() => setShowUnresolvedModal(false)}
                                className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl py-2 text-[9px] font-bold text-neutral-400 uppercase cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnresolvedMappingsSubmit}
                                className="flex-grow bg-[#c5a059] text-black font-black py-2 rounded-xl text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                            >
                                <Save className="w-3.5 h-3.5" /> Save Resolutions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
