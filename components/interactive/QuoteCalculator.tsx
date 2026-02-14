import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Check, Home, DollarSign, Clock } from 'lucide-react';
import Button from '../Button';

interface QuoteSelection {
    roomType: string;
    size: string;
    style: string;
    budget: string;
}

const QuoteCalculator: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState<QuoteSelection>({
        roomType: '',
        size: '',
        style: '',
        budget: ''
    });

    const steps = [
        {
            id: 1,
            title: "What space are you looking to design?",
            options: ["Living Room", "Kitchen", "Bedroom", "Full Home", "Office"]
        },
        {
            id: 2,
            title: "Approximate size of the space?",
            options: ["Under 400 sqft", "400-800 sqft", "800-1200 sqft", "1200+ sqft"]
        },
        {
            id: 3,
            title: "Preferred Design Style",
            options: ["Modern Minimalist", "Luxury Contemporary", "Traditional Indian", "Industrial"]
        },
        {
            id: 4,
            title: "Estimated Budget Range",
            options: ["₹5L - ₹10L", "₹10L - ₹20L", "₹20L - ₹40L", "₹40L+"]
        }
    ];

    const handleSelect = (option: string) => {
        const fields = ['roomType', 'size', 'style', 'budget'];
        setSelection(prev => ({ ...prev, [fields[step - 1]]: option }));
        if (step < 4) {
            setStep(step + 1);
        } else {
            setStep(5); // Show Result
        }
    };

    const reset = () => {
        setStep(1);
        setSelection({ roomType: '', size: '', style: '', budget: '' });
    };

    return (
        <div className="bg-white dark:bg-luxury-obsidian p-8 md:p-12 rounded-2xl shadow-luxury border border-luxury-gold/10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-luxury-gold text-white rounded-full flex items-center justify-center">
                        <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-serif text-luxury-charcoal dark:text-white">Estimate Your Project</h3>
                        <p className="text-xs text-luxury-charcoal/50 dark:text-white/50">Get a quick ballpark figure</p>
                    </div>
                </div>
                {step < 5 && step > 1 && (
                    <button onClick={reset} className="text-xs text-luxury-charcoal/50 hover:text-luxury-gold underline">Restart</button>
                )}
            </div>

            <AnimatePresence mode='wait'>
                {step <= 4 ? (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h4 className="text-lg font-medium text-luxury-charcoal dark:text-white mb-6">
                            {step}. {steps[step - 1].title}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {steps[step - 1].options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className="p-4 text-left border border-gray-200 dark:border-white/10 rounded-lg hover:border-luxury-gold hover:bg-luxury-gold/5 transition-all group flex items-center justify-between"
                                >
                                    <span className="text-luxury-charcoal dark:text-white/80 group-hover:text-luxury-gold font-medium">{option}</span>
                                    <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-luxury-gold" />
                                </button>
                            ))}
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 dark:bg-white/5 h-1 mt-8 rounded-full overflow-hidden">
                            <div
                                className="bg-luxury-gold h-full transition-all duration-300"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-primary-green" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white mb-2">Estimate Ready!</h3>
                        <p className="text-luxury-charcoal/60 dark:text-white/60 mb-8 max-w-sm mx-auto">
                            Based on your selection of a <strong>{selection.style} {selection.roomType}</strong> ({selection.size}).
                        </p>

                        <div className="bg-luxury-gold/10 p-6 rounded-lg mb-8 border border-luxury-gold/20">
                            <p className="text-sm uppercase tracking-widest text-luxury-charcoal/60 mb-2">Estimated Investment</p>
                            <p className="text-3xl font-bold text-luxury-gold font-serif">
                                {selection.budget} <span className="text-lg text-luxury-charcoal/50 font-sans font-normal">*</span>
                            </p>
                            <p className="text-xs text-luxury-charcoal/40 mt-2">*Includes design, materials & execution</p>
                        </div>

                        <Button to="/contact" variant="primary" fullWidth className="bg-luxury-gold text-white mb-3">
                            Get Detailed Quote
                        </Button>
                        <p className="text-xs text-luxury-charcoal/40">Free consultation included. Valid for 30 days.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuoteCalculator;
