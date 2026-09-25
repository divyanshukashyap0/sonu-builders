import React from 'react';
import { Check, ShieldCheck, Compass, Hammer, Eye } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/performance';

interface WhyChooseUsProps {
    image?: string;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({
    image: defaultImg = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80'
}) => {
    const differentiators = [
        {
            icon: Compass,
            title: 'Thoughtful Design',
            description: 'Custom architectural layouts tailored around how you live and move, balancing aesthetic beauty with effortless spatial utility.'
        },
        {
            icon: Hammer,
            title: 'Quality Craftsmanship',
            description: 'Uncompromising fabrication using high-grade marine ply, German hardware, and precision joinery executed by master artisans.'
        },
        {
            icon: ShieldCheck,
            title: 'End-to-End Execution',
            description: 'Comprehensive turnkey management from civil engineering to millwork and final styling — zero third-party handoffs.'
        },
        {
            icon: Eye,
            title: 'Attention to Detail',
            description: 'Meticulous quality audits at every milestone, ensuring exact alignment, clean edge-banding, and immaculate finishes.'
        }
    ];

    return (
        <section className="bg-[#F4F0E8] py-16 md:py-24 border-b border-stone-200/60">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Architectural Feature Image */}
                    <div className="lg:col-span-5 relative order-2 lg:order-1">
                        <div className="relative rounded-sm overflow-hidden shadow-md border border-stone-300/80 bg-white group">
                            <img
                                src={getOptimizedImageUrl(defaultImg, 900)}
                                alt="Sonu Enterprises Luxury Craftsmanship"
                                className="w-full h-[420px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-103"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/95 backdrop-blur-xs border border-stone-200/80 rounded-xs shadow-xs">
                                <p className="text-[#171717] font-serif font-bold text-sm leading-tight">
                                    Direct On-Site Supervision
                                </p>
                                <p className="text-[#8C6D23] text-[10px] uppercase tracking-wider font-semibold mt-0.5">
                                    Continuous Architectural Quality Control
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <p className="text-[#8C6D23] font-bold uppercase tracking-[0.25em] mb-3 text-[11px] flex items-center gap-2.5">
                            <span className="w-6 h-[1.5px] bg-[#c5a059]" />
                            Why Sonu Enterprises
                        </p>
                        <h2
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mb-5 leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", letterSpacing: '-0.02em' }}
                        >
                            Excellence Grounded in <span className="text-[#8C6D23] italic">Integrity &amp; Craft.</span>
                        </h2>
                        <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                            Every space we create is a reflection of our dedication to architectural honesty, material authenticity, and long-term durability.
                        </p>

                        {/* 4 Core Differentiators - Editorial cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {differentiators.map((diff, index) => {
                                const Icon = diff.icon;
                                return (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xs bg-[#FAF8F5] border border-stone-200/80 shadow-2xs hover:border-[#c5a059]/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5 mb-2">
                                            <div className="w-7 h-7 rounded-xs bg-white border border-[#c5a059]/40 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-3.5 h-3.5 text-[#8C6D23]" />
                                            </div>
                                            <h3
                                                className="font-bold text-base text-[#171717]"
                                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                            >
                                                {diff.title}
                                            </h3>
                                        </div>
                                        <p className="text-stone-600 text-xs leading-relaxed">
                                            {diff.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
