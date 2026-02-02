import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Default images mapping fallback
const DEFAULT_IMAGES: Record<string, string> = {
    homeHero: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    aboutBanner: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    // Add more default slots here as needed
};

export const useImages = () => {
    const [images, setImages] = useState(DEFAULT_IMAGES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        const docRef = doc(db, 'settings', 'images');
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setImages(prev => ({ ...prev, ...data }));
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateImage = async (key: string, url: string) => {
        await setDoc(doc(db, 'settings', 'images'), { [key]: url }, { merge: true });
    };

    return { images, loading, updateImage };
};
