import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    dark?: boolean;
    hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    dark = false,
    hoverable = false
}) => {
    const baseStyles = dark ? 'glass-dark' : 'glass';
    const hoverStyles = hoverable ? 'hover:shadow-luxury-hover hover:-translate-y-2 transition-all duration-500' : '';

    return (
        <div className={`${baseStyles} ${hoverStyles} rounded-lg p-8 ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;
