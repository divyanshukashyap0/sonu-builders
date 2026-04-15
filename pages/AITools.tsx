import React from 'react';
import { Sparkles, Calculator } from 'lucide-react';
import Section from '../components/Section';
import StyleFinderQuiz from '../components/ai/StyleFinderQuiz';
import BudgetEstimator from '../components/ai/BudgetEstimator';

const AITools: React.FC = () => {
    const [activeTool, setActiveTool] = React.useState<'style' | 'budget'>('style');

    return (
        <div className="page-transition">
            {/* Hero */}
            <div className="bg-gradient-to-r from-luxury-charcoal via-brand-blue to-luxury-charcoal py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        AI Design Tools
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                        Discover your perfect interior style and get instant budget estimates
                    </p>
                </div>
            </div>

            {/* Tool Selector */}
            <Section className="!bg-luxury-beige/20">
                <div className="flex justify-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveTool('style')}
                        className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTool === 'style'
                                ? 'bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white shadow-luxury'
                                : 'bg-white text-luxury-charcoal hover:shadow-lg'
                            }`}
                    >
                        <Sparkles className="w-5 h-5" />
                        Style Finder
                    </button>
                    <button
                        onClick={() => setActiveTool('budget')}
                        className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTool === 'budget'
                                ? 'bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white shadow-luxury'
                                : 'bg-white text-luxury-charcoal hover:shadow-lg'
                            }`}
                    >
                        <Calculator className="w-5 h-5" />
                        Budget Estimator
                    </button>
                </div>

                {/* Active Tool */}
                <div className="min-h-[600px]">
                    {activeTool === 'style' ? (
                        <div>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-3">
                                    Find Your Interior Style
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Answer 4 quick questions and discover which interior design style matches your personality
                                </p>
                            </div>
                            <StyleFinderQuiz />
                        </div>
                    ) : (
                             <div className="bg-white dark:bg-luxury-obsidian rounded-2xl p-12 shadow-luxury border border-luxury-gold/10 text-center max-w-4xl mx-auto">
                                <div className="w-20 h-20 bg-luxury-gold text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-gold">
                                    <Calculator className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-luxury-charcoal dark:text-white mb-4">Precision Cost Estimator</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                    Access our most powerful budgeting tool on its dedicated page. Calculate costs for over 20+ room types with real-time market rates.
                                </p>
                                <a 
                                    href="/estimate"
                                    className="inline-flex items-center gap-3 bg-luxury-gold text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-glow-gold hover:-translate-y-1 transition-all group"
                                >
                                    Launch Smart Estimator <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </a>
                             </div>
                    )}
                </div>
            </Section>

            {/* CTA Section */}
            <Section className="bg-luxury-charcoal">
                <div className="text-center text-white max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                        Ready to Start Your Project?
                    </h2>
                    <p className="text-gray-200 mb-8 text-lg">
                        Book a free consultation with our design experts to bring your vision to life
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white px-8 py-4 rounded-lg font-semibold hover:shadow-luxury-hover hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Book Free Consultation
                    </a>
                </div>
            </Section>
        </div>
    );
};

export default AITools;
