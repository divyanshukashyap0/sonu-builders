import React from 'react';
import { Sparkles, Calculator } from 'lucide-react';
import Section from '../components/Section';
import StyleFinderQuiz from '../components/ai/StyleFinderQuiz';
import BudgetEstimator from '../components/ai/BudgetEstimator';

const AITools: React.FC = () => {
    const [activeTool, setActiveTool] = React.useState<'style' | 'budget'>('style');

    return (
        <div className="page-transition bg-[#FAF8F5] text-stone-900 min-h-screen">
            {/* Hero */}
            <div className="relative py-24 overflow-hidden bg-[#FAF8F5] border-b border-luxury-gold/20">
                <div className="absolute inset-0 bg-radial-gradient(circle, rgba(197,160,89,0.1) 0%, transparent 70%)" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block text-luxury-gold">Interactive Assistance</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#171717] mb-6">
                        AI Design Studio
                    </h1>
                    <p className="text-base text-stone-600 max-w-2xl mx-auto">
                        Explore your architectural style and calculate investment requirements with our intelligent planning modules.
                    </p>
                </div>
            </div>

            {/* Selector tabs */}
            <div className="flex justify-center gap-4 py-8 bg-[#FAF8F5] border-b border-stone-200/80">
                <button
                    onClick={() => setActiveTool('style')}
                    className={`px-6 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-full ${
                        activeTool === 'style'
                            ? 'bg-luxury-gold text-white shadow-md shadow-luxury-gold/20'
                            : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 shadow-sm'
                    }`}
                >
                    Style Finder Quiz
                </button>
                <button
                    onClick={() => setActiveTool('budget')}
                    className={`px-6 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-full ${
                        activeTool === 'budget'
                            ? 'bg-luxury-gold text-white shadow-md shadow-luxury-gold/20'
                            : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 shadow-sm'
                    }`}
                >
                    Smart Budget Planner
                </button>
            </div>

            {/* Active Tool Section */}
            <Section className="!bg-[#FAF8F5] py-20">
                <div className="min-h-[500px] max-w-5xl mx-auto">
                    {activeTool === 'style' ? (
                        <div className="space-y-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif font-bold text-[#171717] mb-3">
                                    Discover Your Interior Style
                                </h2>
                                <p className="text-stone-600 max-w-2xl mx-auto text-sm">
                                    Answer our quick 4-question curation quiz to align your aesthetic preferences and find your matching design language.
                                </p>
                            </div>
                            <div className="p-8 bg-white border border-luxury-gold/25 rounded-2xl shadow-luxury">
                                <StyleFinderQuiz />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif font-bold text-[#171717] mb-3">
                                    Interactive Investment Estimator
                                </h2>
                                <p className="text-stone-600 max-w-2xl mx-auto text-sm">
                                    Map out your rooms, select square footage, choose your finish material tier, and see an instant luxury cost calculation.
                                </p>
                            </div>
                            <div className="p-8 bg-white border border-luxury-gold/25 rounded-2xl shadow-luxury">
                                <BudgetEstimator />
                            </div>
                        </div>
                    )}
                </div>
            </Section>

            {/* CTA Section */}
            <Section className="bg-[#F4F0E8] relative py-28 border-t border-luxury-gold/20 overflow-hidden">
                <div className="text-center text-stone-900 max-w-3xl mx-auto relative z-10">
                    <span className="text-[9px] font-bold tracking-[0.4em] uppercase mb-4 block text-luxury-gold">Connect With Our Studio</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-6 leading-tight">
                        Ready to Begin Your Transformation?
                    </h2>
                    <p className="text-stone-600 mb-10 text-base max-w-lg mx-auto">
                        Take the insights from your finder session and schedule a direct consultation with our principal design team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-block bg-luxury-gold text-white px-10 py-4 font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:bg-luxury-gold/90 shadow-md rounded-lg"
                        >
                            Book Consultation
                        </a>
                        <a
                            href="https://wa.me/919967044479?text=Hi Sonu Enterprises, I just completed your AI design session and would like to discuss a project."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block border border-luxury-gold/40 hover:border-luxury-gold text-luxury-gold hover:text-[#171717] px-10 py-4 font-bold text-xs uppercase tracking-widest transition-all duration-300 bg-white shadow-sm rounded-lg"
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default AITools;
