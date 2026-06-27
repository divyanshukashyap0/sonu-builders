import { useState, useEffect } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    serverTimestamp,
    getDocs,
    writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SalaryRecord, StaffMember, AttendanceRecord, AdvanceRecord } from '../types';

export const useSalary = (monthId: string) => {
    const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (!monthId) return;
        setLoading(true);

        // 1. First listen to month lock status
        const lockRef = doc(db, 'attendance', monthId);
        
        const unsubscribe = onSnapshot(lockRef, async (lockSnap) => {
            const locked = lockSnap.exists() && lockSnap.data().locked === true;
            setIsLocked(locked);

            if (locked) {
                // If locked, read payroll directly from salary collection
                const salaryColRef = collection(db, 'salary', monthId, 'staff');
                const snapshot = await getDocs(salaryColRef);
                const records: SalaryRecord[] = [];
                snapshot.forEach((doc) => {
                    records.push({ id: doc.id, ...doc.data() } as SalaryRecord);
                });
                setSalaryRecords(records);
                setLoading(false);
            } else {
                // If NOT locked, fetch staff, attendance, advances to calculate in real-time
                try {
                    // Fetch active staff
                    const staffSnap = await getDocs(collection(db, 'staff'));
                    const staffList: StaffMember[] = [];
                    staffSnap.forEach((doc) => {
                        const data = doc.data() as Omit<StaffMember, 'id'>;
                        if (data.status === 'active') {
                            staffList.push({ id: doc.id, ...data });
                        }
                    });

                    // Fetch attendance
                    const attendanceSnap = await getDocs(collection(db, 'attendance', monthId, 'employees'));
                    const attendanceMap: Record<string, AttendanceRecord> = {};
                    attendanceSnap.forEach((doc) => {
                        attendanceMap[doc.id] = { id: doc.id, ...doc.data() } as AttendanceRecord;
                    });

                    // Fetch advances in this month (filter client side since date is a string YYYY-MM-DD)
                    const advancesSnap = await getDocs(collection(db, 'advances'));
                    const advancesList: AdvanceRecord[] = [];
                    advancesSnap.forEach((doc) => {
                        advancesList.push({ id: doc.id, ...doc.data() } as AdvanceRecord);
                    });

                    // Compute salary for each staff member
                    const computedRecords = staffList.map((emp) => {
                        const att = attendanceMap[emp.id];
                        const workUnits = att ? att.totalWorkUnits : 0;

                        // Calculate total advance for the employee in the month
                        const employeeAdvances = advancesList.filter(
                            (adv) => adv.employeeId === emp.id && adv.date.startsWith(monthId)
                        );
                        const totalAdvance = employeeAdvances.reduce((sum, adv) => sum + adv.amount, 0);

                        // Excel logic
                        let grossSalary = 0;
                        if (emp.salaryType === 'monthly') {
                            grossSalary = emp.standardWage || 0;
                        } else {
                            grossSalary = workUnits * (emp.standardWage || 0);
                        }

                        const netSalary = Math.max(0, grossSalary - totalAdvance);

                        return {
                            id: emp.id,
                            staffId: emp.id,
                            monthId,
                            fullName: emp.fullName,
                            role: emp.role,
                            salaryType: emp.salaryType,
                            standardWage: emp.standardWage || 0,
                            dailyWage: emp.salaryType === 'daily' ? emp.standardWage : 0,
                            monthlySalary: emp.salaryType === 'monthly' ? emp.standardWage : 0,
                            workUnits,
                            grossSalary,
                            advance: totalAdvance,
                            netSalary,
                            status: 'Unpaid' as const
                        };
                    });

                    setSalaryRecords(computedRecords);
                    setLoading(false);
                } catch (err) {
                    console.error("Error computing salary:", err);
                    setError("Failed to compute real-time salary.");
                    setLoading(false);
                }
            }
        }, (err) => {
            console.error("Error locking status change:", err);
            setError("Failed to fetch salary data.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [monthId]);

    // Save/Lock payroll records
    const lockAndSavePayroll = async () => {
        if (isLocked) return;

        try {
            const batch = writeBatch(db);

            // 1. Lock month
            const lockRef = doc(db, 'attendance', monthId);
            batch.set(lockRef, { locked: true }, { merge: true });

            // 2. Save each salary record
            salaryRecords.forEach((record) => {
                const recordRef = doc(db, 'salary', monthId, 'staff', record.staffId);
                batch.set(recordRef, {
                    ...record,
                    updatedAt: serverTimestamp()
                });
            });

            await batch.commit();
            setIsLocked(true);
            return true;
        } catch (err) {
            console.error("Error locking payroll:", err);
            throw err;
        }
    };

    // Mark salary as paid
    const markSalaryPaid = async (staffId: string) => {
        try {
            const recordRef = doc(db, 'salary', monthId, 'staff', staffId);
            await setDoc(recordRef, {
                status: 'Paid',
                paidAt: new Date().toISOString(),
                updatedAt: serverTimestamp()
            }, { merge: true });

            // Update local state for UI responsiveness
            setSalaryRecords(prev => prev.map(rec => 
                rec.staffId === staffId ? { ...rec, status: 'Paid', paidAt: new Date().toISOString() } : rec
            ));
            return true;
        } catch (err) {
            console.error("Error marking salary paid:", err);
            throw err;
        }
    };

    return {
        salaryRecords,
        isLocked,
        loading,
        error,
        lockAndSavePayroll,
        markSalaryPaid
    };
};
