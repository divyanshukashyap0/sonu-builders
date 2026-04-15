import React from 'react';
import { motion } from 'framer-motion';
import { useAboutPage } from '../../hooks/useAboutPage';
import Button from '../Button';
import { ArrowRight } from 'lucide-react';

const FounderOverview: React.FC = () => {
    const { content, loading } = useAboutPage();

    if (loading) return null;

    return (
        <section className="bg-transparent overflow-hidden py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl relative z-10">
                            <img
                                src={content.founderImage}
                                alt={content.founderName}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        </div>
                        {/* Decorative Frames */}
                        <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-luxury-gold/20 z-0" />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-luxury-gold/20 z-0" />
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-8 text-center lg:text-left"
                    >
                        <div>
                            <p className="text-luxury-gold font-bold uppercase tracking-[0.3em] mb-4 text-xs">
                                Meet Our Visionary
                            </p>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-2">
                                {content.founderName}
                            </h2>
                            <p className="text-luxury-gold font-bold uppercase tracking-widest text-sm mb-6">
                                {content.founderTitle}
                            </p>
                        </div>

                        <p className="text-lg text-gray-400 leading-relaxed font-medium">
                            {content.founderBio}
                        </p>

                        <div className="pt-4 flex justify-center lg:justify-start">
                            <Button to="/about" variant="outline" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white group">
                                Read Full Story <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FounderOverview;
