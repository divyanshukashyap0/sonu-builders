import { useState, useEffect, useRef, useCallback } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import type { AttendanceRecord, AttendanceDayStatus, StaffMember } from '../types';

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

interface AttendanceCacheEntry {
  attendanceMap: Record<string, AttendanceRecord>;
  isLocked: boolean;
}

const attendanceCache: Record<string, AttendanceCacheEntry> = {};
const attendanceListeners: Record<string, Set<(data: AttendanceCacheEntry) => void>> = {};
const unsubscribeAttendanceMap: Record<string, () => void> = {};
const unsubscribeLockMap: Record<string, () => void> = {};

export const clearAttendanceCache = () => {
    Object.values(unsubscribeAttendanceMap).forEach(unsub => unsub());
    Object.values(unsubscribeLockMap).forEach(unsub => unsub());
    
    for (const key in unsubscribeAttendanceMap) delete unsubscribeAttendanceMap[key];
    for (const key in unsubscribeLockMap) delete unsubscribeLockMap[key];
    for (const key in attendanceCache) delete attendanceCache[key];
    for (const key in attendanceListeners) delete attendanceListeners[key];
};

export const useAttendance = (monthId: string) => {
    const cached = attendanceCache[monthId];
    const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>(cached?.attendanceMap || {});
    const [isLocked, setIsLocked] = useState(cached?.isLocked || false);
    const [loading, setLoading] = useState(!cached);
    const [error, setError] = useState<string | null>(null);

    const attendanceMapRef = useRef(attendanceMap);
    const isLockedRef = useRef(isLocked);

    useEffect(() => {
        attendanceMapRef.current = attendanceMap;
    }, [attendanceMap]);

    useEffect(() => {
        isLockedRef.current = isLocked;
    }, [isLocked]);

    useEffect(() => {
        if (!monthId) return;

        const listener = (data: AttendanceCacheEntry) => {
            setAttendanceMap(data.attendanceMap);
            setIsLocked(data.isLocked);
            setLoading(false);
        };

        if (!attendanceListeners[monthId]) {
            attendanceListeners[monthId] = new Set();
        }
        attendanceListeners[monthId].add(listener);

        if (attendanceCache[monthId]) {
            setAttendanceMap(attendanceCache[monthId].attendanceMap);
            setIsLocked(attendanceCache[monthId].isLocked);
            setLoading(false);
        }

        // Initialize Firestore listener for this monthId if not already active
        if (!unsubscribeAttendanceMap[monthId]) {
            attendanceCache[monthId] = attendanceCache[monthId] || { attendanceMap: {}, isLocked: false };

            const lockRef = doc(db, 'attendance', monthId);
            unsubscribeLockMap[monthId] = onSnapshot(lockRef, 
                (docSnap) => {
                    const locked = docSnap.exists() && docSnap.data().locked === true;
                    if (attendanceCache[monthId]) {
                        attendanceCache[monthId].isLocked = locked;
                        attendanceListeners[monthId]?.forEach(l => l(attendanceCache[monthId]));
                    }
                },
                (err) => console.error("Error fetching lock status:", err)
            );

            const attendanceColRef = collection(db, 'attendance', monthId, 'employees');
            unsubscribeAttendanceMap[monthId] = onSnapshot(attendanceColRef,
                (snapshot) => {
                    const map: Record<string, AttendanceRecord> = {};
                    snapshot.docs.forEach((doc) => {
                        const data = doc.data() as Omit<AttendanceRecord, 'id'>;
                        map[doc.id] = {
                            id: doc.id,
                            ...data
                        };
                    });
                    if (attendanceCache[monthId]) {
                        attendanceCache[monthId].attendanceMap = map;
                        attendanceListeners[monthId]?.forEach(l => l(attendanceCache[monthId]));
                    }
                },
                (err) => {
                    console.error("Error fetching attendance:", err);
                    setError("Failed to fetch attendance records.");
                }
            );
        }

        return () => {
            attendanceListeners[monthId]?.delete(listener);
        };
    }, [monthId]);

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

    const markFullMonth = useCallback(async (staffId: string, status: AttendanceDayStatus, daysInMonth: number) => {
        if (isLockedRef.current) {
            throw new Error("This month is locked.");
        }

        try {
            const docRef = doc(db, 'attendance', monthId, 'employees', staffId);
            const currentRecord = attendanceMapRef.current[staffId];
            const currentDays = currentRecord?.days || {};
            
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
