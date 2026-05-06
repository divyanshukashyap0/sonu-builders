import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check, Sun, Moon, Zap, Coffee, Leaf, ChevronRight } from 'lucide-react';
import { useTheme, ThemeType, THEMES } from '../../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themeOptions: { id: ThemeType; label: string; icon: any; color: string }[] = [
        { id: 'luxury-white', label: 'Luxury White', icon: Sun, color: '#B87333' },
        { id: 'dark-luxury', label: 'Dark Luxury', icon: Moon, color: '#C9A227' },
        { id: 'modern-minimal', label: 'Modern Minimal', icon: Leaf, color: '#6B705C' },
        { id: 'contemporary', label: 'Contemporary', icon: Zap, color: '#B87333' },
        { id: 'premium-earthy', label: 'Premium Earthy', icon: Coffee, color: '#A2674B' },
    ];

    return (
        <>
            {/* Floating Trigger Button */}
            <div className="fixed left-6 bottom-32 z-[9999] hidden md:block">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 bg-theme-accent text-theme-background rounded-full shadow-2xl flex items-center justify-center border border-theme-border backdrop-blur-md transition-colors"
                    style={{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-background)' }}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? <X key="close" size={24} /> : <Palette key="palette" size={24} />}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile Bottom Trigger */}
            <div className="fixed right-4 top-20 z-[9999] md:hidden">
                 <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-theme-accent text-theme-background rounded-full shadow-lg border border-theme-border"
                >
                    <Palette size={20} />
                </button>
            </div>

            {/* Theme Selection Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        className="fixed left-24 bottom-32 z-[9999] w-72 bg-theme-background border border-theme-border rounded-2xl shadow-2xl p-6 backdrop-blur-xl overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent/5 -translate-y-16 translate-x-16 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-theme-text font-serif font-bold text-lg">Visual Theme</h3>
                                <span className="text-[10px] uppercase tracking-widest text-theme-muted font-bold">Premium Select</span>
                            </div>

                            <div className="space-y-3">
                                {themeOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => {
                                            setTheme(opt.id);
                                            setTimeout(() => setIsOpen(false), 300);
                                        }}
                                        className={`w-full group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-500 border ${
                                            theme === opt.id 
                                            ? 'bg-theme-accent text-theme-background border-theme-accent shadow-lg' 
                                            : 'bg-theme-secondary/20 text-theme-text border-theme-border/50 hover:border-theme-accent/40'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                            theme === opt.id ? 'bg-theme-background text-theme-accent' : 'bg-theme-background/50 text-theme-accent'
                                        }`}>
                                            <opt.icon size={20} />
                                        </div>
                                        
                                        <div className="text-left flex-1">
                                            <div className="text-sm font-bold tracking-tight">{opt.label}</div>
                                            <div className={`text-[10px] uppercase tracking-widest opacity-60 font-medium ${
                                                theme === opt.id ? 'text-theme-background' : 'text-theme-muted'
                                            }`}>
                                                {THEMES[opt.id].name}
                                            </div>
                                        </div>

                                        {theme === opt.id && (
                                            <motion.div layoutId="active-check" className="text-theme-background">
                                                <Check size={18} strokeWidth={3} />
                                            </motion.div>
                                        )}

                                        <div className="absolute right-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                            <ChevronRight size={14} />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 pt-4 border-t border-theme-border/30">
                                <p className="text-[10px] text-theme-muted leading-relaxed font-medium">
                                    Atmospheric shifting enabled. Experience Sonu Enterprises in 5 premium visual modes.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ThemeSwitcher;
