import React, { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useState } from 'react';

export const DynamicBackground: React.FC = () => {
    const [settings, setSettings] = useState({
        backgroundColor: '#050505',
        backgroundImage: '',
        backgroundBlur: 25
    });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'appearance'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setSettings({
                    backgroundColor: data.backgroundColor || '#050505',
                    backgroundImage: data.backgroundImage || '',
                    backgroundBlur: data.backgroundBlur !== undefined ? data.backgroundBlur : 25
                });
            }
        });
        return () => unsub();
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
                            filter: `blur(${settings.backgroundBlur / 8}px) brightness(0.8)`, // Reduced blur divisor for more clarity
                            opacity: 0.9
                        }}
                    />
                    {/* Subtle noise/texture overlay for premium feel */}
                    <div className="absolute inset-0 opacity-[0.05] bg-grain pointer-events-none" />
                    
                    {/* Gradient overlay to ensure text contrast while keeping image visible */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                </>
            )}
        </div>
    );
};
