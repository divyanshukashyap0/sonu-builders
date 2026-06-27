import { useState, useEffect, useRef, useCallback } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AttendanceRecord, AttendanceDayStatus, StaffMember } from '../types';

export const calculateWorkUnits = (days: Record<string, AttendanceDayStatus>): number => {
    let units = 0;
    Object.values(days).forEach((status) => {
        switch (status) {
            case 'S': units += 1.0; break;
            case 'P': units += 1.5; break;
            case 'H': units += 0.5; break;
            case 'D': units += 2.0; break;
            case 'A':
            default:
                break;
        }
    });
    return units;
};

export const calculateAbsents = (days: Record<string, AttendanceDayStatus>): number => {
    return Object.values(days).filter(status => status === 'A').length;
};

export const isDayPast12HourLimit = (monthId: string, day: number): boolean => {
    if (!monthId) return false;
    const [yearStr, monthStr] = monthId.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    if (isNaN(year) || isNaN(month)) return false;

    // Date ends at midnight. 12 hours after end of day is 12:00 PM of next calendar day.
    const lockTime = new Date(year, month - 1, day + 1, 12, 0, 0, 0);
    return new Date().getTime() > lockTime.getTime();
};

export const useAttendance = (monthId: string) => {
    const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>({});
    const [isLocked, setIsLocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Keep state values in refs so callbacks don't need to rebuild when state updates
    const attendanceMapRef = useRef(attendanceMap);
    const isLockedRef = useRef(isLocked);

    useEffect(() => {
        attendanceMapRef.current = attendanceMap;
    }, [attendanceMap]);

    useEffect(() => {
        isLockedRef.current = isLocked;
    }, [isLocked]);

    // 1. Fetch Month Lock Status & Attendance Records
    useEffect(() => {
        if (!monthId) return;
        setLoading(true);

        // Listen to Month Lock status
        const lockRef = doc(db, 'attendance', monthId);
        const unsubscribeLock = onSnapshot(lockRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    setIsLocked(docSnap.data().locked || false);
                } else {
                    setIsLocked(false);
                }
            },
            (err) => console.error("Error fetching lock status:", err)
        );

        // Listen to Attendance list
        const attendanceColRef = collection(db, 'attendance', monthId, 'employees');
        const unsubscribeAttendance = onSnapshot(attendanceColRef,
            (snapshot) => {
                const map: Record<string, AttendanceRecord> = {};
                snapshot.docs.forEach((doc) => {
                    const data = doc.data() as Omit<AttendanceRecord, 'id'>;
                    map[doc.id] = {
                        id: doc.id,
                        ...data
                    };
                });
                setAttendanceMap(map);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching attendance:", err);
                setError("Failed to fetch attendance records.");
                setLoading(false);
            }
        );

        return () => {
            unsubscribeLock();
            unsubscribeAttendance();
        };
    }, [monthId]);

    // 2. Mark Attendance for a single cell
    const markAttendanceCell = useCallback(async (staffId: string, day: number, status: AttendanceDayStatus) => {
        if (isLockedRef.current) {
            throw new Error("This month is locked and cannot be edited.");
        }
        if (isDayPast12HourLimit(monthId, day)) {
            throw new Error(`Attendance for Day ${day} is locked (12-hour limit exceeded).`);
        }

        try {
            const docRef = doc(db, 'attendance', monthId, 'employees', staffId);
            const currentRecord = attendanceMapRef.current[staffId];
            
            const newDays = {
                ...(currentRecord?.days || {}),
                [String(day)]: status
            };

            const totalWorkUnits = calculateWorkUnits(newDays);
            const totalAbsent = calculateAbsents(newDays);

            await setDoc(docRef, {
                staffId,
                monthId,
                days: newDays,
                totalWorkUnits,
                totalAbsent,
                updatedAt: serverTimestamp()
            }, { merge: true });

            return true;
        } catch (err) {
            console.error("Error marking attendance cell:", err);
            throw err;
        }
    }, [monthId]);

    // 3. Mark entire month for a staff member
    const markFullMonth = useCallback(async (staffId: string, status: AttendanceDayStatus, daysInMonth: number) => {
        if (isLockedRef.current) {
            throw new Error("This month is locked.");
        }

        try {
            const docRef = doc(db, 'attendance', monthId, 'employees', staffId);
            const currentRecord = attendanceMapRef.current[staffId];
            const currentDays = currentRecord?.days || {};
            
            // Only update days that are not past the 12-hour limit
            const newDays = { ...currentDays };
            let updatedAny = false;
            
            for (let d = 1; d <= daysInMonth; d++) {
                if (!isDayPast12HourLimit(monthId, d)) {
                    newDays[String(d)] = status;
                    updatedAny = true;
                }
            }

            if (!updatedAny) {
                throw new Error("All days in this month are locked (12-hour limit exceeded).");
            }

            const totalWorkUnits = calculateWorkUnits(newDays);
            const totalAbsent = calculateAbsents(newDays);

            await setDoc(docRef, {
                staffId,
                monthId,
                days: newDays,
                totalWorkUnits,
                totalAbsent,
                updatedAt: serverTimestamp()
            }, { merge: true });
            return true;
        } catch (err) {
            console.error("Error marking full month:", err);
            throw err;
        }
    }, [monthId]);

    // 4. Copy previous day's attendance
    const copyPreviousDayAttendance = useCallback(async (targetDay: number, staffList: StaffMember[]) => {
        if (isLockedRef.current) throw new Error("Month is locked.");
        if (isDayPast12HourLimit(monthId, targetDay)) {
            throw new Error(`Day ${targetDay} is locked (12-hour limit exceeded).`);
        }
        if (targetDay <= 1) return;

        const prevDayStr = String(targetDay - 1);
        const targetDayStr = String(targetDay);

        try {
            for (const employee of staffList) {
                const currentRecord = attendanceMapRef.current[employee.id];
                const prevStatus = currentRecord?.days?.[prevDayStr] || '';
                
                if (prevStatus) {
                    const newDays = {
                        ...(currentRecord?.days || {}),
                        [targetDayStr]: prevStatus
                    };
                    const totalWorkUnits = calculateWorkUnits(newDays);
                    const totalAbsent = calculateAbsents(newDays);

                    const docRef = doc(db, 'attendance', monthId, 'employees', employee.id);
                    await setDoc(docRef, {
                        staffId: employee.id,
                        monthId,
                        days: newDays,
                        totalWorkUnits,
                        totalAbsent,
                        updatedAt: serverTimestamp()
                    }, { merge: true });
                }
            }
            return true;
        } catch (err) {
            console.error("Error copying previous day:", err);
            throw err;
        }
    }, [monthId]);

    // 5. Lock/Unlock Month
    const setMonthLockStatus = useCallback(async (locked: boolean) => {
        try {
            const lockRef = doc(db, 'attendance', monthId);
            await setDoc(lockRef, { locked }, { merge: true });
            setIsLocked(locked);
            return true;
        } catch (err) {
            console.error("Error updating lock status:", err);
            throw err;
        }
    }, [monthId]);

    return {
        attendanceMap,
        isLocked,
        loading,
        error,
        markAttendanceCell,
        markFullMonth,
        copyPreviousDayAttendance,
        setMonthLockStatus
    };
};
