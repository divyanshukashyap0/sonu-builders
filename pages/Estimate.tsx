import React from 'react';
import Section from '../components/Section';
import PageHero from '../components/luxury/PageHero';
import { BudgetEstimator } from '../components/ai/BudgetEstimator';
import SEO from '../components/SEO';
import { Calculator, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EstimatePage: React.FC = () => {
    return (
        <div className="page-transition min-h-screen bg-luxury-white dark:bg-luxury-charcoal">
            <SEO 
                title="Project Cost Estimator" 
                description="Get an instant luxury interior design and construction estimate for your project. Professional budget planning at your fingertips."
            />
            
            <PageHero 
                title="Investment Planner"
                subtitle="Calculate the cost of your luxury vision"
                backgroundImage="/estimator-bg.png"
            />

            <Section className="relative overflow-hidden pt-20 pb-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center border border-luxury-gold/30 shadow-glow-gold">
                                    <Calculator className="w-6 h-6 text-luxury-gold" />
                                </div>
                                <span className="text-luxury-gold font-bold uppercase tracking-[0.2em] text-sm">Smart Estimator</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-charcoal dark:text-white mb-6 leading-tight">
                                Transparent <span className="text-luxury-gold italic">Precision</span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                                Build your project inventory step-by-step or use our high-speed presets to generate a professional budget estimate in seconds. Every quote is balanced against current luxury market rates.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-luxury-gold uppercase tracking-widest bg-luxury-gold/5 px-4 py-2 rounded-full border border-luxury-gold/20">
                                    <ShieldCheck className="w-4 h-4" /> Real-time Rates
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-luxury-gold uppercase tracking-widest bg-luxury-gold/5 px-4 py-2 rounded-full border border-luxury-gold/20">
                                    <Sparkles className="w-4 h-4" /> Premium Presets
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 30 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative group lg:mt-0"
                        >
                            <div className="absolute -inset-4 bg-luxury-gold/10 rounded-2xl blur-2xl group-hover:bg-luxury-gold/20 transition-all duration-500" />
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-luxury-gold/30 shadow-2xl">
                                <img 
                                    src="/estimator-hero.png" 
                                    alt="Luxury Interior Planning" 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-white font-serif italic text-lg opacity-90">"Precision in planning, excellence in execution."</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <BudgetEstimator />

                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                        <div className="p-8 bg-white dark:bg-luxury-obsidian rounded-2xl border border-luxury-gold/10 shadow-sm text-center">
                            <ShieldCheck className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
                            <h4 className="font-bold text-luxury-charcoal dark:text-white mb-2 uppercase tracking-widest text-xs">Verified Rates</h4>
                            <p className="text-sm text-gray-500">Estimates are balanced against current luxury market materials and labor costs.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-luxury-obsidian rounded-2xl border border-luxury-gold/10 shadow-sm text-center">
                            <Sparkles className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
                            <h4 className="font-bold text-luxury-charcoal dark:text-white mb-2 uppercase tracking-widest text-xs">Bespoke Options</h4>
                            <p className="text-sm text-gray-500">From essential quality to ultra-luxury imported finishes, we cover every tier.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-luxury-obsidian rounded-2xl border border-luxury-gold/10 shadow-sm text-center">
                            <Calculator className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
                            <h4 className="font-bold text-luxury-charcoal dark:text-white mb-2 uppercase tracking-widest text-xs">Real-time sync</h4>
                            <p className="text-sm text-gray-500">Your final quote calculation includes GST and technical overheads automatically.</p>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default EstimatePage;
