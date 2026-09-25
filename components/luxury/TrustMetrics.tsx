import React from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { Award, Building2, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { useSiteContent } from '../../hooks/useSiteContent';

export const TrustMetrics: React.FC = () => {
    const { content } = useSiteContent('trust_metrics', {
        stat1: '17',
        label1: 'Years of Excellence',
        sub1: 'Founded in 2009',
        stat2: '150',
        label2: 'Homes Designed',
        sub2: 'Turnkey residential & commercial',
        stat3: '140',
        label3: 'Client Trust',
        sub3: 'Verified Google 5★ rating',
        stat4: '6',
        label4: 'Mumbai MMR Hubs',
        sub4: 'Thane, Palava & Beyond'
    });

    const metrics = [
        {
            value: 15,
            suffix: '+',
            label: 'Years of Excellence',
            sublabel: 'Est. 2009 in Mumbai MMR',
            icon: Award,
        },
        {
            value: 4500,
            suffix: '+',
            label: 'Homes Designed',
            sublabel: 'Turnkey Residences & Spaces',
            icon: Building2,
        },
        {
            value: 1400,
            suffix: '+',
            label: 'Homeowners & Clients',
            sublabel: '100% On-Time Commitment',
            icon: Users,
        },
        {
            value: 6,
            suffix: '+',
            label: 'Key Regions Served',
            icon: MapPin,
        }
    ];

    const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);

    const cities = [
        'Kalyan & Dombivli',
        'Palava City (Nilje)',
        'Thane West & Ghodbunder',
        'Navi Mumbai (Vashi / Belapur)',
        'Bandra & Western Suburbs',
        'Andheri & Powai'
    ];

    return (
        <section className="bg-[#FAF8F5] py-12 md:py-16 border-b border-stone-200/70 relative">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                {/* Trust Metrics Grid with subtle vertical dividers on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/80">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        const isInteractive = index === 3;

                        return (
                            <div
                                key={index}
                                className={`text-center px-4 py-4 sm:py-2 group relative ${isInteractive ? 'cursor-pointer' : ''}`}
                                onClick={() => isInteractive && setSelectedMetric(selectedMetric === 'cities' ? null : 'cities')}
                            >
                                {/* Clean Icon */}
                                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-2xs mb-3 border border-stone-200/80 group-hover:border-[#c5a059] transition-colors duration-300">
                                    <Icon className="w-5 h-5 text-[#8C6D23]" />
                                </div>

                                {/* Elegant Counter */}
                                <div
                                    className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#171717] mb-1 leading-none"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    <AnimatedCounter
                                        end={metric.value}
                                        suffix={metric.suffix}
                                        duration={2000}
                                    />
                                </div>

                                {/* Small Supporting Labels */}
                                <p className="text-[11px] text-[#171717] uppercase tracking-[0.18em] font-bold mb-1">
                                    {metric.label}
                                </p>
                                <p className="text-[11px] text-stone-500 font-normal leading-snug">
                                    {metric.sublabel}
                                </p>



                                {/* Cities Popover */}
                                {isInteractive && selectedMetric === 'cities' && (
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 bg-white border border-[#c5a059]/40 shadow-xl rounded-xs p-4 z-50 text-left"
                                    >
                                        <h4 className="text-[#8C6D23] text-[10px] font-bold uppercase tracking-widest mb-2.5 border-b border-stone-100 pb-1.5">
                                            Operational Hubs in Mumbai MMR
                                        </h4>
                                        <div className="flex flex-col gap-1.5">
                                            {cities.map((city, idx) => (
                                                <div key={idx} className="text-xs font-medium text-stone-700 flex items-center justify-between py-1 px-1.5 rounded-xs hover:bg-[#FAF8F5]">
                                                    <span>{city}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {selectedMetric === 'cities' && (
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setSelectedMetric(null)} aria-hidden="true" />
                )}
            </div>
        </section>
    );
};

export default TrustMetrics;
