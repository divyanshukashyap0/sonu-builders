import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Testimonial } from '../types';
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from '../constants';

export const useTestimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        const q = query(collection(db, 'testimonials'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const fetchedTestimonials = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Testimonial[];
                setTestimonials(fetchedTestimonials);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
        await addDoc(collection(db, 'testimonials'), testimonial);
    };

    const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>) => {
        await updateDoc(doc(db, 'testimonials', id), testimonial);
    };

    const deleteTestimonial = async (id: string) => {
        await deleteDoc(doc(db, 'testimonials', id));
    };

    return { testimonials, loading, addTestimonial, updateTestimonial, deleteTestimonial };
};
