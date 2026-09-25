import React from 'react';
import { useAboutPage } from '../../hooks/useAboutPage';
import { ArrowRight, Compass, Hammer, ShieldCheck, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOptimizedImageUrl } from '../../utils/performance';

const valuePoints = [
    {
        title: 'Thoughtful Design',
        desc: 'Bespoke layouts engineered around natural light, spatial flow, and your everyday living rituals.',
        icon: Compass,
    },
    {
        title: 'Quality Craftsmanship',
        desc: 'Authentic IS:710 Marine-grade ply, precision modular joinery, and German soft-close fittings.',
        icon: Hammer,
    },
    {
        title: 'End-to-End Execution',
        desc: 'Single-point turnkey accountability from society NOCs and civil works to final handover.',
        icon: ShieldCheck,
    },
    {
        title: 'Attention to Detail',
        desc: 'Rigorous 120-point quality audits, flawless architectural millwork, and zero finish compromises.',
        icon: Eye,
    },
];

const FounderOverview: React.FC = () => {
    const { content } = useAboutPage();

    return (
        <section className="bg-[#FAF8F5] py-16 md:py-24 border-b border-stone-200/60 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Supporting Architectural Image Column */}
                    <div className="lg:col-span-5 relative">
                        <div className="aspect-[4/5] max-w-md mx-auto overflow-hidden rounded-sm shadow-md border border-stone-200/90 bg-white relative z-10 group">
                            <img
                                src={getOptimizedImageUrl('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80', 900)}
                                alt="Sonu Enterprises Luxury Interior Architecture"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/95 backdrop-blur-xs border border-stone-200/80 rounded-xs shadow-xs">
                                <p className="text-[#171717] font-serif font-bold text-sm leading-tight">
                                    Bespoke Architectural Execution
                                </p>
                                <p className="text-[#8C6D23] text-[10px] uppercase tracking-wider font-semibold mt-0.5">
                                    Crafted across Mumbai since 2009
                                </p>
                            </div>
                        </div>

                        {/* Subtle decorative background offset border */}
                        <div
                            className="hidden sm:block absolute -bottom-3 -right-3 w-full h-full max-w-md mx-auto border border-[#c5a059]/30 rounded-sm pointer-events-none z-0"
                            style={{ left: 'calc(50% - 13rem + 12px)' }}
                        />
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        <div>
                            <p className="text-[#8C6D23] text-[11px] font-bold uppercase tracking-[0.25em] mb-3 flex items-center gap-2.5">
                                <span className="w-6 h-[1.5px] bg-[#c5a059]" />
                                About Sonu Enterprises
                            </p>
                            <h2
                                className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] leading-tight mb-4"
                                style={{
                                    fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                Transforming Visionary Concepts into <span className="text-[#8C6D23] italic">Timeless Spaces.</span>
                            </h2>
                        </div>

                        <p className="text-stone-600 text-sm md:text-base leading-relaxed font-normal">
                            Sonu Enterprises is an established interior architecture and turnkey construction firm based in Mumbai. Since 2009, we have designed and built bespoke homes, modular kitchens, and corporate spaces that unite spatial intelligence with enduring craftsmanship.
                        </p>

                        {/* 4 Small Value Points */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {valuePoints.map((point, idx) => {
                                const Icon = point.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xs bg-white border border-stone-200/80 shadow-2xs hover:border-[#c5a059]/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <Icon className="w-3.5 h-3.5 text-[#8C6D23]" />
                                            <h4
                                                className="font-bold text-sm text-[#171717]"
                                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                            >
                                                {point.title}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-stone-600 leading-relaxed">
                                            {point.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-2">
                            <Link
                                to="/about"
                                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xs text-xs font-bold uppercase tracking-widest text-[#FAF8F5] bg-[#171717] hover:bg-[#8C6D23] transition-colors shadow-xs"
                            >
                                <span>Discover Our Story</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FounderOverview;
