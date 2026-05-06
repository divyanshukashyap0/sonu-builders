import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SiteSettings {
    backgroundColor: string;
    backgroundImage: string;
    backgroundBlur: number; // 0 to 100
}

export const useSiteSettings = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'appearance'), (docSnap) => {
            if (docSnap.exists()) {
                setSettings(docSnap.data() as SiteSettings);
            } else {
                const defaults: SiteSettings = {
                    backgroundColor: '#050505',
                    backgroundImage: '',
                    backgroundBlur: 25
                };
                setDoc(doc(db, 'settings', 'appearance'), defaults);
                setSettings(defaults);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const updateSettings = async (newSettings: SiteSettings) => {
        await setDoc(doc(db, 'settings', 'appearance'), newSettings);
    };

    return { settings, loading, updateSettings };
};
