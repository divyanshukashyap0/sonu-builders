import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SiteSettings {
    backgroundColor: string;
    backgroundImage: string;
    galleryBackgroundImage?: string;
    galleryOverlayOpacity?: number;
    backgroundBlur: number;
    activeTheme?: string;
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
                    galleryBackgroundImage: '',
                    galleryOverlayOpacity: 0.4,
                    backgroundBlur: 25,
                    activeTheme: 'luxury-white'
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
