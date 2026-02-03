import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Service } from '../types';

export function useServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'services'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const servicesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Service[];
            setServices(servicesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching services:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addService = async (service: Omit<Service, 'id'>) => {
        try {
            await addDoc(collection(db, 'services'), {
                ...service,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error adding service:", error);
            throw error;
        }
    };

    const updateService = async (id: string, service: Partial<Service>) => {
        try {
            const serviceRef = doc(db, 'services', id);
            await updateDoc(serviceRef, {
                ...service,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating service:", error);
            throw error;
        }
    };

    const deleteService = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'services', id));
        } catch (error) {
            console.error("Error deleting service:", error);
            throw error;
        }
    };

    return { services, loading, addService, updateService, deleteService };
}
