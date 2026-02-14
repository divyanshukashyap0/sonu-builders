import React from 'react';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
    title: string;
    description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-luxury-obsidian rounded-2xl border border-luxury-gold/10">
            <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-6">
                <Construction className="w-10 h-10 text-luxury-gold animate-pulse" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-luxury-charcoal dark:text-white mb-3">
                {title} Coming Soon
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                {description || "We are currently building this module. Check back later for updates."}
            </p>
        </div>
    );
};

export default ComingSoon;
