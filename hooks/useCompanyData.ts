import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_EMAIL, COMPANY_ADDRESS, CONTACT_INFO } from '../constants';

export const useCompanyData = () => {
    const [data, setData] = useState({
        name: COMPANY_NAME,
        phone: COMPANY_PHONE,
        email: COMPANY_EMAIL,
        address: COMPANY_ADDRESS
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
        const fetchSettings = async () => {
            try {
                if (!db) return;
                const docRef = doc(db, 'settings', 'general');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const fetchedData = docSnap.data();
                    setData(prev => ({ ...prev, ...fetchedData }));
                }
                const socialRef = doc(db, 'settings', 'social');
                const socialSnap = await getDoc(socialRef);
                if (socialSnap.exists()) {
                    const fetchedSocial = socialSnap.data() as any;
                    setSocial(prev => ({ ...prev, ...fetchedSocial }));
                }
            } catch (err) {
                console.error("Failed to fetch company data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
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
