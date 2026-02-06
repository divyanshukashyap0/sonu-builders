import React from 'react';
import { motion } from 'framer-motion';

interface BrandingSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
}

const BrandingSection: React.FC<BrandingSectionProps> = ({
    title = "Defining Modern Luxury",
    subtitle = "Our Vision",
    description = "We believe that every space has a story to tell. Our mission is to translate your personality into a tangible, high-end reality through precision, trust, and timeless interior design.",
    imageUrl = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    buttonText = "Explore Our Philosophy",
    buttonLink = "/about"
}) => {
    return (
        <section className="relative py-24 bg-stone-50 overflow-hidden">
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
                                {subtitle}
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-charcoal leading-tight">
                                {title}
                            </h2>
                        </div>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                            {description}
                        </p>

                        <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <a
                                href={buttonLink}
                                className="inline-block bg-luxury-gold text-white px-10 py-5 rounded-sm font-bold uppercase tracking-[0.2em] text-xs hover:bg-luxury-charcoal transition-all duration-500 shadow-luxury hover:shadow-luxury-hover"
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
                                src={imageUrl}
                                alt="Luxury Interior Vision"
                                className="w-full h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-luxury-charcoal/10" />
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-luxury-gold/30 z-0" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-luxury-gold/30 z-0" />

                        {/* Elegant Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -right-10 bg-white p-8 shadow-2xl rounded-sm hidden md:block z-20"
                        >
                            <p className="text-luxury-gold font-serif text-3xl font-bold">15+</p>
                            <p className="text-luxury-charcoal text-xs uppercase tracking-tighter font-semibold">Years of Excellence</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BrandingSection;
