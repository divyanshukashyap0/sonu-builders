import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp,
    where
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Expense } from '../types';

export const useExpenses = (siteName?: string) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        let q = query(collection(db, 'expenses'), orderBy('date', 'desc'));

        if (siteName) {
            q = query(
                collection(db, 'expenses'),
                where('siteName', '==', siteName),
                orderBy('date', 'desc')
            );
        }

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Expense[];
                setExpenses(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching expenses:", err);
                setError("Failed to fetch expense records.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [siteName]);

    const addExpense = async (data: Omit<Expense, 'id' | 'balance' | 'createdAt' | 'updatedAt'>) => {
        try {
            const balance = Number(data.amountReceived) - Number(data.amountPaid);
            const docRef = await addDoc(collection(db, 'expenses'), {
                ...data,
                amountReceived: Number(data.amountReceived),
                amountPaid: Number(data.amountPaid),
                balance,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        } catch (err) {
            console.error("Error adding expense:", err);
            throw err;
        }
    };

    const updateExpense = async (id: string, data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => {
        try {
            const expenseDoc = doc(db, 'expenses', id);
            const updates: any = {
                ...data,
                updatedAt: serverTimestamp()
            };
            if (data.amountReceived !== undefined) updates.amountReceived = Number(data.amountReceived);
            if (data.amountPaid !== undefined) updates.amountPaid = Number(data.amountPaid);
            
            if (data.amountReceived !== undefined || data.amountPaid !== undefined) {
                const originalSnap = expenses.find(e => e.id === id);
                const rec = data.amountReceived !== undefined ? Number(data.amountReceived) : (originalSnap?.amountReceived || 0);
                const paid = data.amountPaid !== undefined ? Number(data.amountPaid) : (originalSnap?.amountPaid || 0);
                updates.balance = rec - paid;
            }

            await updateDoc(expenseDoc, updates);
            return true;
        } catch (err) {
            console.error("Error updating expense:", err);
            throw err;
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'expenses', id));
            return true;
        } catch (err) {
            console.error("Error deleting expense:", err);
            throw err;
        }
    };

    return { expenses, loading, error, addExpense, updateExpense, deleteExpense };
};
