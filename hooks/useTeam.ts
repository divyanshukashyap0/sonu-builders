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
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TeamMember } from '../types';

export const useTeam = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'team'), orderBy('order', 'asc')); // Assuming 'order' field for custom sorting

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const teamData: TeamMember[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as TeamMember));

                setTeam(teamData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching team:", err);
                setError("Failed to fetch team members.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const addMember = async (memberData: Omit<TeamMember, 'id'>) => {
        try {
            await addDoc(collection(db, 'team'), {
                ...memberData,
                createdAt: serverTimestamp(),
                order: team.length + 1 // Auto-increment order
            });
            return true;
        } catch (err) {
            console.error("Error adding team member:", err);
            throw err;
        }
    };

    const updateMember = async (id: string, memberData: Partial<TeamMember>) => {
        try {
            const memberRef = doc(db, 'team', id);
            await updateDoc(memberRef, memberData);
            return true;
        } catch (err) {
            console.error("Error updating team member:", err);
            throw err;
        }
    };

    const deleteMember = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'team', id));
            return true;
        } catch (err) {
            console.error("Error deleting team member:", err);
            throw err;
        }
    };

    return { team, loading, error, addMember, updateMember, deleteMember };
};
