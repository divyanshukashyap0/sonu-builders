import React from 'react';
import { motion } from 'framer-motion';

interface LuxuryButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
    to?: string;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
    to
}) => {
    const baseStyles = 'font-semibold transition-all duration-300 rounded-md inline-flex items-center justify-center';

    const variants = {
        primary: 'bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white hover:shadow-luxury-hover hover:-translate-y-0.5',
        secondary: 'bg-luxury-charcoal text-luxury-white hover:bg-opacity-90',
        outline: 'border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (to) {
        return (
            <motion.a
                href={to}
                className={classes}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {children}
            </motion.a>
        );
    }

    return (
        <motion.button
            className={classes}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {children}
        </motion.button>
    );
};

export default LuxuryButton;
