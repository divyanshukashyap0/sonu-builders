import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const DynamicBackground: React.FC = () => {
    const [settings, setSettings] = useState({
        backgroundColor: '#050505',
        backgroundImage: '',
        backgroundBlur: 25
    });

    useEffect(() => {
        // Use a one-time fetch instead of a real-time listener.
        // The app background setting is session-stable and doesn't need live updates.
        const fetchSettings = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'settings', 'appearance'));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSettings({
                        backgroundColor: data.backgroundColor || '#050505',
                        backgroundImage: data.backgroundImage || '',
                        backgroundBlur: data.backgroundBlur !== undefined ? data.backgroundBlur : 25
                    });
                }
            } catch (err) {
                // Silently fail — background is cosmetic and has a default
                console.warn('Could not load background settings:', err);
            }
        };

        fetchSettings();
    }, []);

    return (
        <div 
            className="fixed inset-0 -z-50 transition-all duration-1000 ease-in-out"
            style={{ backgroundColor: settings.backgroundColor }}
        >
            {settings.backgroundImage && (
                <>
                    <div 
                        className="absolute inset-0 transition-opacity duration-1000"
                        style={{ 
                            backgroundImage: `url(${settings.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            filter: `blur(${settings.backgroundBlur / 8}px) brightness(0.8)`,
                            opacity: 0.9
                        }}
                    />
                    <div className="absolute inset-0 opacity-[0.05] bg-grain pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                </>
            )}
        </div>
    );
};
