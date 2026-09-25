import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type ThemeType = 
  | 'luxury-white' 
  | 'dark-luxury' 
  | 'modern-minimal' 
  | 'contemporary' 
  | 'premium-earthy';

interface ThemeDefinition {
  name: string;
  colors: {
    background: string;
    secondary: string;
    accent: string;
    highlight: string;
    text: string;
    muted: string;
    card: string;
    border: string;
    shadow: string;
    buttonText: string;
    bgGradient?: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export const THEMES: Record<ThemeType, ThemeDefinition> = {
  'luxury-white': {
    name: 'Luxury White',
    colors: {
      background: '#FAF8F5',
      secondary: '#F4F0E8',
      accent: '#C5A059',
      highlight: '#B8860B',
      text: '#171717',
      muted: '#6B7280',
      card: '#FFFFFF',
      border: 'rgba(197, 160, 89, 0.22)',
      shadow: 'rgba(0, 0, 0, 0.06)',
      buttonText: '#000000',
      bgGradient: 'linear-gradient(180deg, #FAF8F5 0%, #F5F1E8 100%)'
    },
    fonts: {
      heading: "'Cormorant Garamond', 'Playfair Display', serif",
      body: "'Inter', sans-serif"
    }
  },
  'dark-luxury': {
    name: 'Royal Gold Light',
    colors: {
      background: '#FAF8F5',
      secondary: '#F5EFE6',
      accent: '#C9A227',
      highlight: '#B8860B',
      text: '#171717',
      muted: '#6B7280',
      card: '#FFFFFF',
      border: 'rgba(201, 162, 39, 0.25)',
      shadow: 'rgba(0, 0, 0, 0.06)',
      buttonText: '#FFFFFF',
      bgGradient: 'linear-gradient(180deg, #FAF8F5 0%, #F5EFE6 100%)'
    },
    fonts: {
      heading: "'Cormorant Garamond', serif",
      body: "'Inter', sans-serif"
    }
  },
  'modern-minimal': {
    name: 'Modern Minimal',
    colors: {
      background: '#FAF7F2',
      secondary: '#F0ECE4',
      accent: '#6B705C',
      highlight: '#B8A89A',
      text: '#2B2B2B',
      muted: '#666666',
      card: '#FFFFFF',
      border: 'rgba(107, 112, 92, 0.18)',
      shadow: 'rgba(0, 0, 0, 0.05)',
      buttonText: '#FFFFFF',
      bgGradient: 'linear-gradient(180deg, #FAF7F2 0%, #F0ECE4 100%)'
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    }
  },
  'contemporary': {
    name: 'Contemporary Linen',
    colors: {
      background: '#F8F6F4',
      secondary: '#EEEAE5',
      accent: '#B87333',
      highlight: '#C5A059',
      text: '#1E1E1E',
      muted: '#666666',
      card: '#FFFFFF',
      border: 'rgba(184, 115, 51, 0.2)',
      shadow: 'rgba(0, 0, 0, 0.05)',
      buttonText: '#FFFFFF',
      bgGradient: 'linear-gradient(180deg, #F8F6F4 0%, #EEEAE5 100%)'
    },
    fonts: {
      heading: "'Cormorant Garamond', serif",
      body: "'Inter', sans-serif"
    }
  },
  'premium-earthy': {
    name: 'Premium Earthy',
    colors: {
      background: '#F5EFE6',
      secondary: '#EBE2D5',
      accent: '#A2674B',
      highlight: '#8C583E',
      text: '#3B302A',
      muted: '#6B5E55',
      card: '#FFFFFF',
      border: 'rgba(162, 103, 75, 0.2)',
      shadow: 'rgba(0, 0, 0, 0.05)',
      buttonText: '#FFFFFF',
      bgGradient: 'linear-gradient(180deg, #F5EFE6 0%, #EBE2D5 100%)'
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Inter', sans-serif"
    }
  }
};

interface ThemeContextType {
  theme: ThemeType;
  definition: ThemeDefinition;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('luxury-white');

  useEffect(() => {
    // Listen for global theme changes from admin settings
    const unsub = onSnapshot(doc(db, 'settings', 'appearance'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const activeTheme = data.activeTheme as ThemeType;
        if (activeTheme === 'dark-luxury') {
          setTheme('luxury-white');
        } else if (activeTheme && THEMES[activeTheme]) {
          setTheme(activeTheme);
        } else {
          setTheme('luxury-white');
        }
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const def = THEMES[theme] || THEMES['luxury-white'];

    // Apply colors as CSS variables
    Object.entries(def.colors).forEach(([key, value]) => {
      if (key !== 'bgGradient') {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });

    // Apply custom background gradient if present
    if (def.colors.bgGradient) {
      root.style.setProperty('--theme-bg-gradient', def.colors.bgGradient);
    } else {
      root.style.removeProperty('--theme-bg-gradient');
    }

    // Apply fonts
    root.style.setProperty('--theme-font-heading', def.fonts.heading);
    root.style.setProperty('--theme-font-body', def.fonts.body);

    // Enforce 100% light mode across the entire application
    root.classList.add('light');
    root.classList.remove('dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, definition: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
