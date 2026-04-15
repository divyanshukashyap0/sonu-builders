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
    where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Lead, LeadStatus } from '../types';

export const useLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));

        // Real-time listener
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const leadsData: Lead[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Handle Firestore timestamps and strings safely
                    createdAt: typeof doc.data().createdAt?.toDate === 'function' 
                        ? doc.data().createdAt.toDate() 
                        : new Date(doc.data().createdAt || Date.now())
                } as Lead));

                setLeads(leadsData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching leads:", err);
                setError("Failed to fetch leads.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
        try {
            await addDoc(collection(db, 'leads'), {
                ...leadData,
                createdAt: serverTimestamp()
            });
            return true;
        } catch (err) {
            console.error("Error adding lead:", err);
            throw err;
        }
    };

    const updateLeadStatus = async (id: string, status: LeadStatus) => {
        try {
            const leadRef = doc(db, 'leads', id);
            await updateDoc(leadRef, { status });
            return true;
        } catch (err) {
            console.error("Error updating lead status:", err);
            throw err;
        }
    };

    const deleteLead = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'leads', id));
            return true;
        } catch (err) {
            console.error("Error deleting lead:", err);
            throw err;
        }
    };

    return { leads, loading, error, addLead, updateLeadStatus, deleteLead };
};
