import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdvanceRecord } from '../types';

export const useAdvances = (employeeId?: string) => {
    const [advances, setAdvances] = useState<AdvanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        let q = query(collection(db, 'advances'), orderBy('date', 'desc'));
        
        if (employeeId) {
            q = query(
                collection(db, 'advances'),
                where('employeeId', '==', employeeId),
                orderBy('date', 'desc')
            );
        }

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const advanceData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as AdvanceRecord[];
                setAdvances(advanceData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching advances:", err);
                setError("Failed to fetch advance records.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [employeeId]);

    const addAdvance = async (advanceData: Omit<AdvanceRecord, 'id' | 'createdAt'>) => {
        try {
            const docRef = await addDoc(collection(db, 'advances'), {
                ...advanceData,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (err) {
            console.error("Error adding advance:", err);
            throw err;
        }
    };

    const deleteAdvance = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'advances', id));
            return true;
        } catch (err) {
            console.error("Error deleting advance:", err);
            throw err;
        }
    };

    return { advances, loading, error, addAdvance, deleteAdvance };
};
