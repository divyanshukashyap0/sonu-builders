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
import { db } from '../firebase';
import type { AdvanceRecord } from '../types';

// Global cache variables to persist across navigation remounts
let advancesCache: AdvanceRecord[] | null = null;
const advancesListeners: Set<(data: AdvanceRecord[]) => void> = new Set();
let unsubscribeAdvances: (() => void) | null = null;
let isLoadingAdvances = false;
let advancesError: string | null = null;

export const clearAdvancesCache = () => {
    if (unsubscribeAdvances) {
        unsubscribeAdvances();
        unsubscribeAdvances = null;
    }
    advancesCache = null;
    advancesListeners.clear();
    isLoadingAdvances = false;
    advancesError = null;
};

export const useAdvances = (employeeId?: string) => {
    const [allAdvances, setAllAdvances] = useState<AdvanceRecord[]>(advancesCache || []);
    const [loading, setLoading] = useState(advancesCache === null);
    const [error, setError] = useState<string | null>(advancesError);

    useEffect(() => {
        const listener = (data: AdvanceRecord[]) => {
            setAllAdvances(data);
            setLoading(false);
            setError(null);
        };
        advancesListeners.add(listener);

        if (advancesCache) {
            setAllAdvances(advancesCache);
            setLoading(false);
        }

        if (!unsubscribeAdvances && !isLoadingAdvances) {
            isLoadingAdvances = true;
            const q = query(collection(db, 'advances'), orderBy('date', 'desc'));

            unsubscribeAdvances = onSnapshot(q,
                (snapshot) => {
                    const advanceData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as AdvanceRecord[];
                    advancesCache = advanceData;
                    isLoadingAdvances = false;
                    advancesError = null;
                    advancesListeners.forEach(l => l(advanceData));
                },
                (err) => {
                    console.error("Error fetching advances:", err);
                    advancesError = "Failed to fetch advance records.";
                    isLoadingAdvances = false;
                    setError("Failed to fetch advance records.");
                    setLoading(false);
                }
            );
        }

        return () => {
            advancesListeners.delete(listener);
        };
    }, []);

    // Filter locally in memory instead of executing separate Firestore queries
    const advances = employeeId 
        ? allAdvances.filter(adv => adv.employeeId === employeeId)
        : allAdvances;

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
