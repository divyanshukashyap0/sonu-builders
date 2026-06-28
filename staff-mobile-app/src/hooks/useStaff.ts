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

export const useStaff = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'staff'), orderBy('employeeId', 'asc'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const staffData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as StaffMember[];
                setStaff(staffData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching staff:", err);
                setError("Failed to fetch staff directory.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
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
