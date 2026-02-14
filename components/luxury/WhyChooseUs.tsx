import React from 'react';
import { Check } from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';

interface WhyChooseUsProps {
    image?: string;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({
    image: defaultImg = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
}) => {
    // Dynamic Content
    const { content } = useSiteContent('why_choose_us', {
        title: 'Excellence in Every Detail',
        subtitle: 'Why Choose Us',
        description: "We don't just design interiors - we craft experiences. Every project is a testament to our commitment to quality, transparency, and client satisfaction.",
        image: defaultImg
    });

    const benefits = [
        {
            title: 'End-to-End Execution',
            description: 'From initial design to final handover, we handle everything - no third parties, complete accountability.'
        },
        {
            title: 'Fixed Pricing Guarantee',
            description: 'Transparent quotations with no hidden costs. What we quote is what you pay - guaranteed.'
        },
        {
            title: 'Premium Materials',
            description: 'Only the finest quality materials from trusted brands - German hardware, premium laminates, imported fixtures.'
        },
        {
            title: 'Timeline Commitment',
            description: 'We value your time. Strict adherence to project timelines with milestone-based updates.'
        },
        {
            title: 'Dedicated Project Manager',
            description: 'Your single point of contact throughout the journey - available for queries, updates, and support.'
        },
        {
            title: '5-Year Warranty',
            description: 'Complete peace of mind with comprehensive warranty coverage and post-handover support.'
        }
    ];

    return (
        <section className="bg-transparent py-24 border-y border-luxury-gold/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Image */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-luxury-hover">
                            <img
                                src={content.image}
                                alt="Luxury interior showcase"
                                className="w-full h-[500px] object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-neutral-900 rounded-2xl shadow-luxury p-6 max-w-xs hidden lg:block border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-6 h-6 text-luxury-gold" />
                                </div>
                                <div>
                                    <p className="font-serif font-bold text-white text-lg">100%</p>
                                    <p className="text-sm text-gray-300">Satisfaction Guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <p className="text-luxury-gold font-semibold uppercase tracking-wider mb-2 text-sm">
                            {content.subtitle}
                        </p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
                            {content.title}
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8 font-medium">
                            {content.description}
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-luxury-gold/10 flex items-center justify-center mt-1">
                                        <Check className="w-4 h-4 text-luxury-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">
                                            {benefit.title}
                                        </h4>
                                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
