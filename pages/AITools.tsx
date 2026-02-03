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
                        <div>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-3">
                                    Estimate Your Project Cost
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Get an instant cost estimate by selecting rooms and quality levels
                                </p>
                            </div>
                            <BudgetEstimator />
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
