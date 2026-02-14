import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../../hooks/useSiteContent';

interface BrandingSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
}

const BrandingSection: React.FC<BrandingSectionProps> = ({
    title: defaultTitle = "Defining Modern Luxury",
    subtitle: defaultSubtitle = "Our Vision",
    description: defaultDesc = "We believe that every space has a story to tell. Our mission is to translate your personality into a tangible, high-end reality through precision, trust, and timeless interior design.",
    imageUrl: defaultImg = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    buttonText = "Explore Our Philosophy",
    buttonLink = "/about"
}) => {
    // Dynamic Content Fetching
    const { content } = useSiteContent('philosophy_section', {
        title: defaultTitle,
        subtitle: defaultSubtitle,
        description: defaultDesc,
        imageUrl: defaultImg,
        yearsExperience: '15+',
    });

    return (
        <section className="relative py-24 sm:py-32 bg-transparent overflow-hidden mt-16 sm:mt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="text-luxury-gold font-semibold uppercase tracking-widest text-sm">
                                {content.subtitle}
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                                {content.title}
                            </h2>
                        </div>

                        <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                            {content.description}
                        </p>

                        <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <a
                                href={buttonLink}
                                className="inline-block bg-luxury-gold text-white px-10 py-5 rounded-sm font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-luxury-black transition-all duration-500 shadow-luxury hover:shadow-luxury-hover"
                            >
                                {buttonText}
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Image Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
                            <img
                                src={content.imageUrl}
                                alt="Luxury Interior Vision"
                                className="w-full h-[500px] object-cover transition-all duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-white/10 z-0" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-white/10 z-0" />

                        {/* Elegant Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -right-10 bg-neutral-900 border border-white/10 p-8 shadow-2xl rounded-sm hidden md:block z-20"
                        >
                            <p className="text-luxury-gold font-serif text-3xl font-bold">{content.yearsExperience}</p>
                            <p className="text-white text-xs uppercase tracking-tighter font-semibold">Years of Excellence</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BrandingSection;
