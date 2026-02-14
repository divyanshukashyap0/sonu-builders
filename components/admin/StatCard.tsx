import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: LucideIcon;
    subtext?: string;
    delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    changeType = 'neutral',
    icon: Icon,
    subtext,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-xl p-6 shadow-sm hover:shadow-luxury transition-shadow duration-300"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold text-luxury-charcoal dark:text-white font-serif">
                        {value}
                    </h3>
                </div>
                <div className="p-3 bg-luxury-gold/10 rounded-lg">
                    <Icon className="w-6 h-6 text-luxury-gold" />
                </div>
            </div>

            {(change || subtext) && (
                <div className="mt-4 flex items-center text-sm">
                    {change && (
                        <span className={`font-medium mr-2 flex items-center
              ${changeType === 'positive' ? 'text-green-500' : ''}
              ${changeType === 'negative' ? 'text-red-500' : ''}
              ${changeType === 'neutral' ? 'text-gray-500' : ''}
            `}>
                            {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {change}
                        </span>
                    )}
                    {subtext && (
                        <span className="text-gray-400 dark:text-gray-500">
                            {subtext}
                        </span>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default StatCard;
