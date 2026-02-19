import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { usePerformance } from '../../context/PerformanceContext';

const CustomCursor: React.FC = () => {
    const { isLowPowerMode } = usePerformance();
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [cursorText, setCursorText] = useState('');

    // Initialize these regardless of isLowPowerMode to avoid "Rendered fewer hooks" error
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        // If low power mode is active, do not attach listeners and do nothing
        if (isLowPowerMode) return;

        // Check if device is touch-only (coarse pointer)
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        setIsVisible(true);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Text cursor detection
            const textTarget = target.closest('[data-cursor-text]') as HTMLElement;
            if (textTarget) {
                setCursorText(textTarget.getAttribute('data-cursor-text') || '');
                setIsHovered(true);
            } else {
                setCursorText('');
                // Enhanced hover detection
                const isClickable =
                    target.tagName === 'A' ||
                    target.tagName === 'BUTTON' ||
                    target.closest('button') ||
                    target.closest('a') ||
                    target.closest('[role="button"]') ||
                    target.classList.contains('interactive') ||
                    getComputedStyle(target).cursor === 'pointer';

                setIsHovered(!!isClickable);
            }
        };

        window.addEventListener('mousemove', moveCursor, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY, isLowPowerMode]);

    // Don't render anything if low power mode or touch device (implied by isVisible)
    if (isLowPowerMode || !isVisible) return null;

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-luxury-gold pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center overflow-hidden"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: cursorText ? 4 : (isHovered ? 2.5 : 1),
                    backgroundColor: cursorText ? 'rgba(212, 175, 55, 1)' : (isHovered ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0)'),
                    borderColor: cursorText ? 'rgba(212, 175, 55, 0)' : 'rgba(212, 175, 55, 1)',
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
                {cursorText && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[3px] uppercase tracking-widest font-bold text-black text-center leading-none"
                    >
                        {cursorText}
                    </motion.span>
                )}
            </motion.div>
            <motion.div
                className="fixed top-0 left-0 w-1 h-1 bg-luxury-gold rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    opacity: cursorText ? 0 : 1
                }}
            />
        </>
    );
};

export default CustomCursor;
