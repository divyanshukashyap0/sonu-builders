import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getOptimizedImageUrl } from '../utils/performance';

export const DynamicBackground: React.FC = () => {
    const [settings, setSettings] = useState({
        backgroundColor: '#FAF8F5',
        backgroundImage: '',
        backgroundBlur: 0
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'settings', 'appearance'));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const isDark = (c?: string) => {
                        if (!c) return true;
                        const clean = c.toLowerCase().trim();
                        return clean.startsWith('#0') || clean.startsWith('#1') || clean.startsWith('#2') || clean === 'black';
                    };
                    setSettings({
                        backgroundColor: (data.backgroundColor && !isDark(data.backgroundColor)) ? data.backgroundColor : '#FAF8F5',
                        backgroundImage: data.backgroundImage || '',
                        backgroundBlur: data.backgroundBlur !== undefined ? data.backgroundBlur : 0
                    });
                }
            } catch (err) {
                // Silently fallback to light luxury background
            }
        };

        fetchSettings();
    }, []);

    return (
        <div 
            className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: settings.backgroundColor || '#FAF8F5' }}
        >
            {settings.backgroundImage && (
                <>
                    <div 
                        className="absolute inset-0 transition-opacity duration-700"
                        style={{ 
                            backgroundImage: `url(${getOptimizedImageUrl(settings.backgroundImage, 1920)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.12
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/80 via-transparent to-[#FAF8F5]/90" />
                </>
            )}
        </div>
    );
};
