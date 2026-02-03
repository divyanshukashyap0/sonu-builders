import React from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { Award, Building2, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const TrustMetrics: React.FC = () => {
    const metrics = [
        {
            value: 15,
            suffix: '+',
            label: 'Years of Excellence',
            icon: Award,
            color: 'text-luxury-gold'
        },
        {
            value: 500,
            suffix: '+',
            label: 'Projects Completed',
            icon: Building2,
            color: 'text-luxury-gold'
        },
        {
            value: 1000,
            suffix: '+',
            label: 'Happy Families',
            icon: Users,
            color: 'text-luxury-gold'
        },
        {
            value: 5,
            suffix: '',
            label: 'Cities Served',
            icon: MapPin,
            color: 'text-luxury-gold'
        }
    ];

    return (
        <section className="bg-luxury-white py-24 sm:py-32 relative overflow-hidden">
            {/* Background Parallax Text */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden opacity-[0.02]">
                <span className="absolute top-20 left-1/2 -translate-x-1/2 text-[20rem] font-serif font-black tracking-tighter">
                    ESTABLISHED
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Bridge Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-center mb-32"
                >
                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6">
                        The Standard of Luxury
                    </p>
                    <h2 className="text-luxury-charcoal max-w-4xl mx-auto leading-tight italic">
                        Transforming <span className="text-luxury-gold">Visionary Concepts</span> into Standing Realities.
                    </h2>
                </motion.div>

                {/* Trust Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-16">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-stone-100 mb-6 group-hover:bg-luxury-gold/10 transition-all duration-500 border border-luxury-gold/5">
                                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${metric.color}`} />
                                </div>

                                {/* Counter */}
                                <div className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-luxury-charcoal mb-4">
                                    <AnimatedCounter
                                        end={metric.value}
                                        suffix={metric.suffix}
                                        duration={3000}
                                    />
                                </div>

                                {/* Label */}
                                <p className="text-xs sm:text-sm text-luxury-charcoal/50 uppercase tracking-[0.2em] font-bold">
                                    {metric.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Certifications Section */}
                <div className="mt-24 pt-16 border-t border-luxury-gold/10 text-center">
                    {/* Premium Seal of Excellence */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mb-10 relative inline-block"
                    >
                        <div className="absolute inset-0 bg-luxury-gold/20 blur-3xl rounded-full" />
                        <svg className="w-24 h-24 sm:w-32 sm:h-32 text-luxury-gold relative z-10 animate-spin-slow" viewBox="0 0 100 100">
                            <defs>
                                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                            </defs>
                            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />
                            <g className="font-bold text-[8px] uppercase tracking-[0.2em] fill-current">
                                <text>
                                    <textPath href="#circlePath" startOffset="0%">
                                        Bespoke Excellence • Uncompromising Quality •
                                    </textPath>
                                </text>
                            </g>
                            <path d="M50 35 L54 44 L64 44 L56 50 L59 60 L50 54 L41 60 L44 50 L36 44 L46 44 Z" fill="currentColor" />
                        </svg>
                    </motion.div>

                    <div className="mb-12">
                        <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
                            Trusted & Certified
                        </p>
                        <h3 className="text-luxury-charcoal text-2xl sm:text-3xl font-serif font-bold">
                            Recognized for Industry Excellence
                        </h3>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16">
                        {['ISO 9001:2015 Certified', 'RERA Approved', 'Industry Platinum Member'].map((cert, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + (idx * 0.1), duration: 0.8 }}
                                className="text-luxury-charcoal/40 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border-b border-transparent hover:border-luxury-gold/30 hover:text-luxury-charcoal transition-all cursor-default pb-1"
                            >
                                {cert}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustMetrics;
