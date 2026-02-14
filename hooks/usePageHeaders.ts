import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PageHeader {
    title: string;
    subtitle: string;
    backgroundImage: string;
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
        subtitle: 'A curated selection of our finest architectural accomplishments and interior transformations.',
        backgroundImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1920&q=80'
    },
    services: {
        title: 'Our Services',
        subtitle: 'Comprehensive interiors and turnkey construction solutions tailored to your dream home.',
        backgroundImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=100'
    },
    gallery: {
        title: 'Visual Gallery',
        subtitle: 'Immerse yourself in our world of design through these captured moments of excellence.',
        backgroundImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1600&q=80'
    },
    contact: {
        title: 'Connect With Us',
        subtitle: 'Begin your journey towards an extraordinary home today.',
        backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80'
    }
};

export function usePageHeaders() {
    const [headers, setHeaders] = useState<HeadersData>(defaultHeaders);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'site_content', 'page_headers'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Deep merge or at least merge the top level pages
                const mergedHeaders = { ...defaultHeaders };

                (Object.keys(defaultHeaders) as Array<keyof HeadersData>).forEach(page => {
                    if (data[page]) {
                        mergedHeaders[page] = {
                            ...defaultHeaders[page],
                            ...data[page],
                            backgroundImage: data[page].backgroundImage || defaultHeaders[page].backgroundImage
                        };
                    }
                });

                setHeaders(mergedHeaders);
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
            await setDoc(doc(db, 'site_content', 'page_headers'), newHeaders);
        } catch (error) {
            console.error("Error updating headers:", error);
            throw error;
        }
    };

    return { headers, loading, updateHeader };
}
