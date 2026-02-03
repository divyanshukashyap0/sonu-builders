import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PageHeader {
    title: string;
    subtitle: string;
}

export interface HeadersData {
    projects: PageHeader;
    services: PageHeader;
    gallery: PageHeader;
    contact: PageHeader;
}

const defaultHeaders: HeadersData = {
    projects: {
        title: 'Our Portfolio',
        subtitle: 'A curated selection of our finest architectural accomplishments and interior transformations.'
    },
    services: {
        title: 'Our Services',
        subtitle: 'Comprehensive interiors and turnkey construction solutions tailored to your dream home.'
    },
    gallery: {
        title: 'Visual Gallery',
        subtitle: 'Immerse yourself in our world of design through these captured moments of excellence.'
    },
    contact: {
        title: 'Connect With Us',
        subtitle: 'Begin your journey towards an extraordinary home today.'
    }
};

export function usePageHeaders() {
    const [headers, setHeaders] = useState<HeadersData>(defaultHeaders);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'headers'), (docSnap) => {
            if (docSnap.exists()) {
                setHeaders(docSnap.data() as HeadersData);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching headers:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateHeader = async (page: keyof HeadersData, header: PageHeader) => {
        try {
            const newHeaders = { ...headers, [page]: header };
            await setDoc(doc(db, 'settings', 'headers'), newHeaders);
        } catch (error) {
            console.error("Error updating headers:", error);
            throw error;
        }
    };

    return { headers, loading, updateHeader };
}
