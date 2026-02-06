import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UIConfig {
    // Colors
    luxuryGold: string;
    luxuryCharcoal: string;
    luxuryObsidian: string;
    luxuryWhite: string;

    // Glassmorphism
    glassBlur: number; // px
    glassOpacity: number; // 0-1
    glassBorderOpacity: number; // 0-1

    // Layout
    borderRadius: string; // sm, md, lg, xl, none
    sectionSpacing: string; // compact, normal, spacious

    // Typography
    headingFont: string;
    bodyFont: string;
}

const DEFAULT_CONFIG: UIConfig = {
    luxuryGold: '#D4AF37',
    luxuryCharcoal: '#1A1A1A',
    luxuryObsidian: '#0A0A0A',
    luxuryWhite: '#FCFBFA',
    glassBlur: 8,
    glassOpacity: 0.03,
    glassBorderOpacity: 0.08,
    borderRadius: 'sm',
    sectionSpacing: 'normal',
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
};

interface UIContextType {
    config: UIConfig;
    loading: boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<UIConfig>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);

    // 1. Sync with Firestore
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'ui'), (doc) => {
            if (doc.exists()) {
                const data = doc.data() as Partial<UIConfig>;
                setConfig(prev => ({ ...prev, ...data }));
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // 2. Inject CSS Variables
    useEffect(() => {
        const root = document.documentElement;

        // Colors
        root.style.setProperty('--gold-accent', config.luxuryGold);
        root.style.setProperty('--charcoal', config.luxuryCharcoal);
        root.style.setProperty('--obsidian', config.luxuryObsidian);
        root.style.setProperty('--luxury-white', config.luxuryWhite);

        // Glass
        root.style.setProperty('--glass-blur', `${config.glassBlur}px`);
        root.style.setProperty('--glass-opacity', config.glassOpacity.toString());
        root.style.setProperty('--glass-border-opacity', config.glassBorderOpacity.toString());

        // Derived Colors (optional, for Tailwind overrides if mapped)
        // Note: Tailwind config in index.html maps specific hexes, 
        // to fully dynamic tailwind we'd need to use CSS vars in tailwind config too.
        // For now, we update the main CSS variables used in index.css

    }, [config]);

    return (
        <UIContext.Provider value={{ config, loading }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
