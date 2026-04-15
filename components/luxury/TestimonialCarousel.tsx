import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '../../constants';

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const TestimonialCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-rotate
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 6000); // Slightly slower for longer real reviews
        return () => clearInterval(interval);
    }, [currentIndex, isAutoPlaying]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const getVisibleTestimonials = () => {
        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push(TESTIMONIALS[(currentIndex + i) % TESTIMONIALS.length]);
        }
        return items;
    };

    return (
        <div
            className="relative py-12 px-4"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Controls */}
            <div className="flex justify-end gap-2 mb-8 pr-4">
                <button onClick={prevSlide} className="p-3 rounded-full border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextSlide} className="p-3 rounded-full border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Carousel Track */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {getVisibleTestimonials().map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`bg-neutral-900/40 backdrop-blur-xl p-8 rounded-2xl shadow-luxury hover:shadow-luxury-hover border border-white/5 relative group h-full flex flex-col ${idx !== 0 ? 'hidden md:flex' : 'flex'}`}
                        >
                            {/* Google Verified Badge */}
                            <div className="absolute top-6 left-8 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <GoogleIcon />
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Review</span>
                            </div>

                            {/* Quote Icon */}
                            <Quote className="absolute top-6 right-8 w-10 h-10 text-luxury-gold/5 group-hover:text-luxury-gold/10 transition-colors" />

                            {/* Stars */}
                            <div className="flex gap-1 mt-10 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-600'}`} />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-300 mb-8 italic leading-relaxed flex-grow text-sm line-clamp-[8] group-hover:line-clamp-none transition-all duration-500 overflow-hidden">
                                "{item.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                                <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-bold text-lg">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                    <p className="text-[10px] uppercase tracking-wider text-luxury-gold font-bold mt-0.5">{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Mobile Indicators */}
            <div className="flex justify-center gap-2 mt-8 md:hidden">
                {TESTIMONIALS.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-luxury-gold w-6' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
            
            <div className="text-center mt-12">
               <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                   Authenticated via <span className="text-white flex items-center gap-1"><GoogleIcon /> Google Maps Listing</span>
               </p>
            </div>
        </div>
    );
};

export default TestimonialCarousel;
