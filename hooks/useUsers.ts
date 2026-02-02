import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AdminUser {
    email: string; // Used as Doc ID
    role: 'admin' | 'pending';
    createdAt?: string;
}

export function useUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'admins'), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                email: doc.id,
                ...doc.data()
            })) as AdminUser[];
            setUsers(usersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const approveUser = async (email: string) => {
        try {
            await updateDoc(doc(db, 'admins', email), {
                role: 'admin'
            });
        } catch (error) {
            console.error("Error approving user:", error);
            alert("Failed to approve user.");
        }
    };

    const deleteUser = async (email: string) => {
        if (window.confirm(`Are you sure you want to remove ${email}?`)) {
            try {
                await deleteDoc(doc(db, 'admins', email));
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    return { users, loading, approveUser, deleteUser };
}
