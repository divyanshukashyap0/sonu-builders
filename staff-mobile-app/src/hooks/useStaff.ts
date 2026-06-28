import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    getDocs
} from 'firebase/firestore';
import { db } from '../firebase';
import type { StaffMember } from '../types';

// Global cache variables to persist across navigation remounts
let staffCache: StaffMember[] | null = null;
const staffListeners: Set<(data: StaffMember[]) => void> = new Set();
let unsubscribeStaff: (() => void) | null = null;
let isLoadingStaff = false;
let staffError: string | null = null;

export const clearStaffCache = () => {
    if (unsubscribeStaff) {
        unsubscribeStaff();
        unsubscribeStaff = null;
    }
    staffCache = null;
    staffListeners.clear();
    isLoadingStaff = false;
    staffError = null;
};

export const useStaff = () => {
    const [staff, setStaff] = useState<StaffMember[]>(staffCache || []);
    const [loading, setLoading] = useState(staffCache === null);
    const [error, setError] = useState<string | null>(staffError);

    useEffect(() => {
        const listener = (data: StaffMember[]) => {
            setStaff(data);
            setLoading(false);
            setError(null);
        };
        staffListeners.add(listener);

        if (staffCache) {
            setStaff(staffCache);
            setLoading(false);
        }

        if (!unsubscribeStaff && !isLoadingStaff) {
            isLoadingStaff = true;
            const q = query(collection(db, 'staff'), orderBy('employeeId', 'asc'));

            unsubscribeStaff = onSnapshot(q,
                (snapshot) => {
                    const staffData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as StaffMember[];
                    staffCache = staffData;
                    isLoadingStaff = false;
                    staffError = null;
                    staffListeners.forEach(l => l(staffData));
                },
                (err) => {
                    console.error("Error fetching staff:", err);
                    staffError = "Failed to fetch staff directory.";
                    isLoadingStaff = false;
                    setError("Failed to fetch staff directory.");
                    setLoading(false);
                }
            );
        }

        return () => {
            staffListeners.delete(listener);
        };
    }, []);

    const generateNextEmployeeId = async (): Promise<string> => {
        try {
            const staffRef = collection(db, 'staff');
            const snapshot = await getDocs(staffRef);
            let maxId = 0;
            
            snapshot.forEach(doc => {
                const data = doc.data() as StaffMember;
                if (data.employeeId && data.employeeId.startsWith('SE-EMP-')) {
                    const idNum = parseInt(data.employeeId.replace('SE-EMP-', ''), 10);
                    if (!isNaN(idNum) && idNum > maxId) {
                        maxId = idNum;
                    }
                }
            });

            const nextId = maxId + 1;
            return `SE-EMP-${String(nextId).padStart(3, '0')}`;
        } catch (err) {
            console.error("Error generating employee ID:", err);
            return `SE-EMP-${Math.floor(100 + Math.random() * 900)}`;
        }
    };

    const addStaff = async (staffData: Omit<StaffMember, 'id' | 'employeeId'>) => {
        try {
            const employeeId = await generateNextEmployeeId();
            const docRef = await addDoc(collection(db, 'staff'), {
                ...staffData,
                employeeId,
                status: 'active',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        } catch (err) {
            console.error("Error adding staff:", err);
            throw err;
        }
    };

    const updateStaff = async (id: string, staffData: Partial<StaffMember>) => {
        try {
            const staffRef = doc(db, 'staff', id);
            await updateDoc(staffRef, {
                ...staffData,
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (err) {
            console.error("Error updating staff:", err);
            throw err;
        }
    };

    const deleteStaff = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'staff', id));
            return true;
        } catch (err) {
            console.error("Error deleting staff:", err);
            throw err;
        }
    };

    return { staff, loading, error, addStaff, updateStaff, deleteStaff };
};
