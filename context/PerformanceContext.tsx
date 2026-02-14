import React, { createContext, useContext, useEffect, useState } from 'react';

interface PerformanceContextType {
    isLowPowerMode: boolean;
    isReducedMotion: boolean;
    deviceTier: 'low' | 'mid' | 'high';
}

const PerformanceContext = createContext<PerformanceContextType>({
    isLowPowerMode: false,
    isReducedMotion: false,
    deviceTier: 'high',
});

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [performance, setPerformance] = useState<PerformanceContextType>({
        isLowPowerMode: false,
        isReducedMotion: false,
        deviceTier: 'high',
    });

    useEffect(() => {
        const detectPerformance = () => {
            // 1. Check for reduced motion preference
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            const isReducedMotion = reducedMotionQuery.matches;

            // 2. Estimate device tier
            let tier: 'low' | 'mid' | 'high' = 'high';

            // Check hardware concurrency (CPU cores)
            const cores = navigator.hardwareConcurrency || 4;

            // Check device memory (RAM in GB)
            // @ts-ignore - deviceMemory is not in all type definitions yet
            const memory = navigator.deviceMemory || 8;

            if (cores <= 4 || memory <= 4) {
                tier = 'low';
            } else if (cores <= 8 || memory <= 8) {
                tier = 'mid';
            }

            // 3. Determine if we should activate low power mode
            // Always activate for low tier or if user prefers reduced motion
            const isLowPowerMode = tier === 'low' || isReducedMotion;

            setPerformance({
                isLowPowerMode,
                isReducedMotion,
                deviceTier: tier,
            });

            // Apply global class for CSS optimizations
            if (isLowPowerMode) {
                document.documentElement.classList.add('low-power-mode');
            } else {
                document.documentElement.classList.remove('low-power-mode');
            }
        };

        detectPerformance();

        // Listen for changes in reduced motion preference
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = (e: MediaQueryListEvent) => {
            setPerformance(prev => ({
                ...prev,
                isReducedMotion: e.matches,
                isLowPowerMode: prev.deviceTier === 'low' || e.matches
            }));

            if (performance.deviceTier === 'low' || e.matches) {
                document.documentElement.classList.add('low-power-mode');
            } else {
                document.documentElement.classList.remove('low-power-mode');
            }
        };

        reducedMotionQuery.addEventListener('change', handleChange);
        return () => reducedMotionQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <PerformanceContext.Provider value={performance}>
            {children}
        </PerformanceContext.Provider>
    );
};

export const usePerformance = () => useContext(PerformanceContext);
