import React from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { Award, Building2, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { useSiteContent } from '../../hooks/useSiteContent';

export const TrustMetrics: React.FC = () => {
    const { content } = useSiteContent('trust_metrics', {
        stat1: '15',
        label1: 'Years Experience',
        stat2: '4500',
        label2: 'Projects Completed',
        stat3: '4000',
        label3: 'Happy Families',
        stat4: '6',
        label4: 'Cities Served'
    });

    const metrics = [
        {
            value: parseInt(content.stat1) || 15,
            suffix: '+',
            label: content.label1,
            icon: Award,
            color: 'text-luxury-gold'
        },
        {
            value: parseInt(content.stat2) || 150,
            suffix: '+',
            label: content.label2,
            icon: Building2,
            color: 'text-luxury-gold'
        },
        {
            value: parseInt(content.stat3) || 140,
            suffix: '+',
            label: content.label3,
            icon: Users,
            color: 'text-luxury-gold'
        },
        {
            value: parseInt(content.stat4) || 6,
            suffix: '',
            label: content.label4,
            icon: MapPin,
            color: 'text-luxury-gold'
        }
    ];

    const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);

    const cities = [
        'Mumbai',
        'Navi Mumbai',
        'Thane',
        'Kalyan',
        'Dombivli',
        'Panvel'
    ];

    return (
        <section className="bg-transparent py-24 sm:py-32 relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Bridge Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-center mb-16 relative"
                >
                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6">
                        The Standard of Luxury
                    </p>
                    <h2 className="text-white max-w-4xl mx-auto leading-tight italic mb-12">
                        Transforming <span className="text-luxury-gold">Visionary Concepts</span> into Standing Realities.
                    </h2>

                    {/* Background Parallax Text - Now physically below the quote, zero clipping */}
                    <div className="pointer-events-none select-none flex items-center justify-center opacity-[0.15] sm:opacity-[0.2] transition-opacity duration-700">
                        <span className="text-[14vw] sm:text-[100px] lg:text-[140px] font-serif font-black tracking-tighter text-white whitespace-nowrap">
                            ESTABLISHED
                        </span>
                    </div>
                </motion.div>

                {/* Trust Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-16">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        const isInteractive = metric.label === 'Cities Served';

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`text-center group relative ${isInteractive ? 'cursor-pointer' : ''}`}
                                onClick={() => isInteractive && setSelectedMetric(selectedMetric === 'cities' ? null : 'cities')}
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 shadow-luxury mb-6 transition-all duration-500 border border-luxury-gold/10 ${isInteractive ? 'group-hover:scale-110 group-hover:bg-luxury-gold group-hover:border-luxury-gold' : 'group-hover:bg-luxury-gold/5 group-hover:border-luxury-gold/30'}`}>
                                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-500 ${isInteractive ? 'text-luxury-gold group-hover:text-white' : metric.color}`} />
                                </div>

                                {/* Counter */}
                                <div className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-white mb-4">
                                    <AnimatedCounter
                                        end={metric.value}
                                        suffix={metric.suffix}
                                        duration={3000}
                                    />
                                </div>

                                {/* Label */}
                                <p className="text-sm md:text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">
                                    {metric.label} {isInteractive && <span className="block text-[10px] text-luxury-gold mt-1 opacity-0 group-hover:opacity-100 transition-opacity capitalize font-medium tracking-normal">(Click to view)</span>}
                                </p>

                                {/* Cities Popover */}
                                {isInteractive && selectedMetric === 'cities' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-64 bg-neutral-900/90 backdrop-blur-xl border border-luxury-gold/20 shadow-2xl rounded-xl p-4 z-50 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent pointer-events-none" />
                                        <h4 className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-3 border-b border-luxury-gold/10 pb-2">Our Reach</h4>
                                        <div className="flex flex-col gap-2">
                                            {cities.map((city, idx) => (
                                                <div key={idx} className="text-sm font-medium text-gray-300 flex items-center justify-between group/city hover:bg-white/5 p-1.5 rounded transition-colors">
                                                    {city}
                                                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold/40 group-hover/city:bg-luxury-gold transition-colors" />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {selectedMetric === 'cities' && (
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setSelectedMetric(null)} aria-hidden="true" />
                )}

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
                        <h3 className="text-white text-2xl sm:text-3xl font-serif font-bold">
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
                                className="text-gray-400 text-sm md:text-xs font-bold uppercase tracking-[0.2em] border-b border-transparent hover:border-luxury-gold/30 hover:text-white transition-all cursor-default pb-1"
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
