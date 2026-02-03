import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number;
    suffix?: string;
    icon: React.ReactNode;
    trend?: number; // percentage change
    color?: 'gold' | 'blue' | 'green' | 'purple';
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    suffix = '',
    icon,
    trend,
    color = 'gold'
}) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const colorClasses = {
        gold: 'from-luxury-gold to-luxury-bronze',
        blue: 'from-brand-blue to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600'
    };

    useEffect(() => {
        if (hasAnimated) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setHasAnimated(true);
                    const duration = 1500;
                    const startTime = Date.now();

                    const animate = () => {
                        const now = Date.now();
                        const progress = Math.min((now - startTime) / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);

                        setCount(Math.floor(easeOut * value));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [value, hasAnimated]);

    return (
        <div
            ref={cardRef}
            className="glass-dark p-6 rounded-xl border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl font-serif font-bold text-white">
                        {count.toLocaleString()}{suffix}
                    </p>
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span>{Math.abs(trend)}% vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
