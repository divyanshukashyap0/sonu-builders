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
      background: '#F7F4EF',
      secondary: '#E8DDD0',
      accent: '#B87333',
      highlight: '#D4A373',
      text: '#2E2A26',
      muted: 'rgba(46, 42, 38, 0.6)',
      card: '#FFFFFF',
      border: 'rgba(184, 115, 51, 0.2)',
      shadow: 'rgba(184, 115, 51, 0.1)',
      buttonText: '#FFFFFF'
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Inter', sans-serif"
    }
  },
  'dark-luxury': {
    name: 'Dark Luxury',
    colors: {
      background: '#0F0F0F',
      secondary: '#1B1B1B',
      accent: '#C9A227',
      highlight: '#5A3A22',
      text: '#FFFFFF',
      muted: 'rgba(255, 255, 255, 0.6)',
      card: '#1A1A1A',
      border: 'rgba(201, 162, 39, 0.2)',
      shadow: 'rgba(0, 0, 0, 0.5)',
      buttonText: '#0F0F0F'
    },
    fonts: {
      heading: "'Cormorant Garamond', serif",
      body: "'Poppins', sans-serif"
    }
  },
  'modern-minimal': {
    name: 'Modern Minimal',
    colors: {
      background: '#FAF7F2',
      secondary: '#D6CCC2',
      accent: '#6B705C',
      highlight: '#B8A89A',
      text: '#2B2B2B',
      muted: 'rgba(43, 43, 43, 0.6)',
      card: '#FFFFFF',
      border: 'rgba(107, 112, 92, 0.15)',
      shadow: 'rgba(184, 168, 154, 0.1)',
      buttonText: '#FFFFFF'
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    }
  },
  'contemporary': {
    name: 'Contemporary',
    colors: {
      background: '#6D6A75',
      secondary: '#2E2E2E',
      accent: '#B87333',
      highlight: '#E7D7C9',
      text: '#F8F8F8',
      muted: 'rgba(248, 248, 248, 0.6)',
      card: '#2E2E2E',
      border: 'rgba(184, 115, 51, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.3)',
      buttonText: '#FFFFFF'
    },
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Inter', sans-serif"
    }
  },
  'premium-earthy': {
    name: 'Premium Earthy',
    colors: {
      background: '#F5EFE6',
      secondary: '#D9CBB6',
      accent: '#A2674B',
      highlight: '#5C4033',
      text: '#3B302A',
      muted: 'rgba(59, 48, 42, 0.6)',
      card: '#FFFFFF',
      border: 'rgba(162, 103, 75, 0.2)',
      shadow: 'rgba(92, 64, 51, 0.1)',
      buttonText: '#FFFFFF'
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Poppins', sans-serif"
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
        if (activeTheme && THEMES[activeTheme]) {
          setTheme(activeTheme);
        }
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const def = THEMES[theme];

    // Apply colors as CSS variables
    Object.entries(def.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Apply fonts
    root.style.setProperty('--theme-font-heading', def.fonts.heading);
    root.style.setProperty('--theme-font-body', def.fonts.body);

    // Apply dark/light class for Tailwind compatibility
    if (theme === 'dark-luxury' || theme === 'contemporary') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
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
