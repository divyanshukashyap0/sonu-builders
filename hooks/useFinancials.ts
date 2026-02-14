import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface FinancialRecord {
    id: string;
    type: 'Income' | 'Expense';
    amount: number;
    category: string;
    description: string;
    date: Date;
    createdAt?: any;
}

export const useFinancials = () => {
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'financials'), orderBy('date', 'desc'));

        // Real-time listener
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const data: FinancialRecord[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate() || new Date()
                } as FinancialRecord));

                setRecords(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching financials:", err);
                setError("Failed to fetch financial records.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const addRecord = async (record: Omit<FinancialRecord, 'id' | 'createdAt'>) => {
        try {
            await addDoc(collection(db, 'financials'), {
                ...record,
                createdAt: serverTimestamp()
            });
            return true;
        } catch (err) {
            console.error("Error adding record:", err);
            throw err;
        }
    };

    const deleteRecord = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'financials', id));
            return true;
        } catch (err) {
            console.error("Error deleting record:", err);
            throw err;
        }
    };

    return { records, loading, error, addRecord, deleteRecord };
};
