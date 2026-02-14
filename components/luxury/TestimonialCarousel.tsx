import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    location: string;
    image: string;
    rating: number;
    text: string;
    verified: boolean;
    projectType: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Homeowner",
        location: "Kalyan West",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        rating: 5,
        text: "Sonu delivered our dream home on time and within the 25L budget. The quality of German hardware and premium finishes exceeded expectations. Project manager kept us updated every week.",
        verified: true,
        projectType: "3BHK Luxury Interior"
    },
    {
        id: 2,
        name: "Rajesh Malhotra",
        role: "Business Owner",
        location: "Thane",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80",
        rating: 5,
        text: "Exceptional attention to detail for our office space. The turnkey execution was flawless, and the team handled everything from civil work to final styling perfectly.",
        verified: true,
        projectType: "Commercial Office"
    },
    {
        id: 3,
        name: "Dr. Anjali Desai",
        role: "Doctor",
        location: "Dombivli",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80",
        rating: 5,
        text: "We wanted a modern yet traditional look for our villa. Sonu Enterprises perfectly balanced both. The custom furniture and false ceiling designs are the talk of our family.",
        verified: true,
        projectType: "Villa Renovation"
    },
    {
        id: 4,
        name: "Amit Patel",
        role: "Real Estate Investor",
        location: "Navi Mumbai",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
        rating: 5,
        text: "I've worked with many contractors, but Sonu's transparency and quality are unmatched. They delivered the project 2 weeks early with zero cost overruns.",
        verified: true,
        projectType: "Rental Property"
    },
    {
        id: 5,
        name: "Sneha Gupta",
        role: "Architect",
        location: "Mumbai",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
        rating: 5,
        text: "As an architect, I'm picky about finishes. Sonu Enterprises is my go-to partner for execution. Their craftsmanship in carpentry and painting is top-tier.",
        verified: true,
        projectType: "Architectural Partner"
    }
];

const TestimonialCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-rotate
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, isAutoPlaying]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Helper to get visible items based on screen size (handled via logic or CSS, here simple logic for single/multi view)
    // For simplicity in this bespoke component, we'll show 1 on mobile, 3 on desktop via CSS grid/hidden classes if needed,
    // or better, just one main one tailored for impact, or a sliding track.
    // Let's go with a sliding track of 3 items for desktop.

    const getVisibleTestimonials = () => {
        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push(testimonials[(currentIndex + i) % testimonials.length]);
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
                            className={`bg-neutral-900/80 backend-blur-md p-8 rounded-2xl shadow-luxury hover:shadow-luxury-hover border border-white/10 relative group h-full flex flex-col ${idx !== 0 ? 'hidden md:flex' : 'flex'}`}
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-luxury-gold/10 group-hover:text-luxury-gold/20 transition-colors" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-600'}`} />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-300 mb-6 italic leading-relaxed flex-grow">"{item.text}"</p>

                            {/* Author */}
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/10">
                                <div className="relative">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-luxury-gold/20 group-hover:border-luxury-gold transition-colors" />
                                    {item.verified && (
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                            <CheckCircle className="w-4 h-4 text-primary-green fill-white" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                    <p className="text-xs text-gray-400 font-medium">{item.location}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-luxury-gold font-bold mt-1">{item.projectType}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Mobile Indicators */}
            <div className="flex justify-center gap-2 mt-8 md:hidden">
                {testimonials.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-luxury-gold w-6' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestimonialCarousel;
