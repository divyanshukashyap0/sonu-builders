import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useSiteContent<T>(sectionId: string, defaultContent: T) {
    const [content, setContent] = useState<T>(defaultContent);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sectionId || !db) return;

        const unsubscribe = onSnapshot(doc(db, 'site_content', sectionId), (docSnap) => {
            if (docSnap.exists()) {
                setContent({ ...defaultContent, ...docSnap.data() } as T);
            }
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching content for ${sectionId}:`, error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [sectionId]);

    return { content, loading };
}
