import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_EMAIL, COMPANY_ADDRESS, CONTACT_INFO } from '../constants';

export const useCompanyData = () => {
    const [data, setData] = useState({
        name: COMPANY_NAME,
        phone: COMPANY_PHONE,
        email: COMPANY_EMAIL,
        address: COMPANY_ADDRESS,
        footerDescription: 'Delivering quality construction and reliable real-estate solutions with integrity and expertise. Building trust, creating landmarks.',
        projectsMaintenance: false
    });
    const [social, setSocial] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        whatsapp: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        const unsubGeneral = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
            if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                setData(prev => ({ ...prev, ...fetchedData }));
            }
            setLoading(false);
        });

        const unsubSocial = onSnapshot(doc(db, 'settings', 'social'), (docSnap) => {
            if (docSnap.exists()) {
                const fetchedSocial = docSnap.data() as any;
                setSocial(prev => ({ ...prev, ...fetchedSocial }));
            }
        });

        return () => {
            unsubGeneral();
            unsubSocial();
        };
    }, []);

    return {
        ...data,
        contactInfo: {
            ...CONTACT_INFO,
            phone: data.phone,
            email: data.email,
            address: data.address
        },
        socialLinks: social,
        loading
    };
};
