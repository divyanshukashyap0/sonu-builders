import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePerformance } from '../../context/PerformanceContext';

interface MagneticProps {
    children: React.ReactElement;
    strength?: number;
}

const Magnetic: React.FC<MagneticProps> = ({ children, strength = 0.5 }) => {
    const { isLowPowerMode } = usePerformance();
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current || isLowPowerMode) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * strength;
        const y = (clientY - (top + height / 2)) * strength;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x, y }}
            transition={{ type: 'spring', damping: 15, stiffness: 150, mass: 0.1 }}
            className="inline-block"
        >
            {children}
        </motion.div>
    );
};

export default Magnetic;
