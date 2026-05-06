import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    ArrowRight,
    Download, 
    Share2, 
    Calculator, 
    Palette, 
    Compass,
    CheckCircle,
    Maximize2,
    Calendar,
    ChevronDown
} from 'lucide-react';
import Section from '../components/Section';
import Button from '../components/Button';
import { useDesignInspirations } from '../hooks/useDesignInspirations';
import SEO from '../components/SEO';
import DesignInspirations from '../components/luxury/DesignInspirations';

import { downloadWithWatermark } from '../utils/imageUtils';

const InspirationDetail: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const navigate = useNavigate();
    const { inspirations, loading } = useDesignInspirations();

    const inspiration = inspirations.find(item => item.id === itemId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [itemId]);

    const handleDownload = async () => {
        if (!inspiration) return;
        await downloadWithWatermark(inspiration.image, inspiration.title.toLowerCase().replace(/\s+/g, '-'));
    };

    const handleShare = async () => {
        if (!inspiration) return;
        const shareData = {
            title: inspiration.title,
            text: inspiration.description,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Share failed:', err);
        }
    };

    const currentIndex = inspirations.findIndex(item => item.id === itemId);
    const nextItem = inspirations[(currentIndex + 1) % inspirations.length];
    const prevItem = inspirations[(currentIndex - 1 + inspirations.length) % inspirations.length];

    const navigateToNext = () => navigate(`/gallery/item/${nextItem.id}`);
    const navigateToPrev = () => navigate(`/gallery/item/${prevItem.id}`);

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x > 100) navigateToPrev();
        else if (info.offset.x < -100) navigateToNext();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!inspiration) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
                <h2 className="text-4xl font-serif mb-8">Concept Not Found</h2>
                <Button to="/gallery">Return to Gallery</Button>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
            <SEO
                title={`${inspiration.title} - Sonu Enterprises Luxury Gallery`}
                description={inspiration.description}
                canonical={window.location.href}
            />

            {/* Immersive Full-Screen Media Section */}
            <div className="relative w-full h-[100vh] bg-black overflow-hidden touch-none">
                <AnimatePresence mode="wait">
                    <motion.img 
                        key={inspiration.id}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        src={inspiration.image} 
                        alt={inspiration.title} 
                        className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
                    />
                </AnimatePresence>
                
                {/* Side Navigation Arrows */}
                <div className="absolute inset-y-0 left-0 w-32 flex items-center justify-center z-40">
                    <button 
                        onClick={navigateToPrev}
                        className="p-6 text-white/30 hover:text-luxury-gold transition-colors hover:bg-white/5 rounded-full"
                    >
                        <ArrowLeft size={48} />
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 w-32 flex items-center justify-center z-40">
                    <button 
                        onClick={navigateToNext}
                        className="p-6 text-white/30 hover:text-luxury-gold transition-colors hover:bg-white/5 rounded-full"
                    >
                        <ArrowRight size={48} />
                    </button>
                </div>
                
                {/* Dynamic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
                
                    {/* Floating Navigation & Actions */}
                <div className="absolute top-0 left-0 right-0 p-8 pt-32 md:pt-48 flex justify-between items-center z-50">
                    <motion.button 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        onClick={() => navigate('/gallery')}
                        className="group flex items-center gap-4 bg-black/40 backdrop-blur-2xl px-8 py-4 rounded-full text-white border border-white/10 hover:bg-luxury-gold hover:text-black transition-all duration-500"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] hidden md:block">Gallery</span>
                    </motion.button>
                </div>

                {/* Hero Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-10 md:p-24 lg:p-32 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="max-w-6xl"
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <motion.span 
                                initial={{ width: 0 }}
                                animate={{ width: 64 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="h-[1px] bg-luxury-gold" 
                            />
                            <span className="text-luxury-gold font-bold uppercase tracking-[0.5em] text-[10px]">
                                {inspiration.category.replace('-', ' ')} • {inspiration.style} Style
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-12 leading-[0.9] tracking-tighter">
                            {inspiration.title}
                        </h1>
                        <div className="flex flex-wrap gap-8 items-center pointer-events-auto">
                            <Button 
                                to={`/contact?subject=${encodeURIComponent(inspiration.title)}`}
                                className="px-14 py-6 text-xl shadow-glow-gold rounded-full group"
                            >
                                Start Your Project <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                            </Button>
                            <button 
                                onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-12 py-6 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-500"
                            >
                                Explore Philosophy <ChevronDown size={20} className="animate-bounce" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Detail Section */}
            <div id="details" className="relative z-10 bg-[#050505] border-t border-white/5">
                <Section className="py-40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                        {/* Main Narrative */}
                        <div className="lg:col-span-7 space-y-20">
                            <div className="space-y-12">
                                <motion.h2 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="text-5xl md:text-6xl font-serif font-bold italic text-luxury-gold"
                                >
                                    The Art of Living
                                </motion.h2>
                                <p className="text-3xl text-gray-300 leading-relaxed font-light">
                                    {inspiration.description}
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-16">
                                    <div className="group p-12 bg-white/[0.01] rounded-[2rem] border border-white/5 hover:border-luxury-gold/30 transition-all duration-700 hover:bg-white/[0.03]">
                                        <div className="w-16 h-16 bg-luxury-gold/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-luxury-gold group-hover:text-black transition-all duration-500">
                                            <Palette className="w-8 h-8 text-luxury-gold group-hover:text-inherit" />
                                        </div>
                                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-4 text-luxury-gold">Aesthetic Profile</h4>
                                        <p className="text-gray-400 text-xl font-medium">{inspiration.style} Modern Luxury</p>
                                    </div>
                                    <div className="group p-12 bg-white/[0.01] rounded-[2rem] border border-white/5 hover:border-luxury-gold/30 transition-all duration-700 hover:bg-white/[0.03]">
                                        <div className="w-16 h-16 bg-luxury-gold/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-luxury-gold group-hover:text-black transition-all duration-500">
                                            <Compass className="w-8 h-8 text-luxury-gold group-hover:text-inherit" />
                                        </div>
                                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-4 text-luxury-gold">Space Planning</h4>
                                        <p className="text-gray-400 text-xl font-medium">{inspiration.category.replace('-', ' ')} Architecture</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project Sidebar */}
                        <div className="lg:col-span-5">
                            <div className="bg-white/[0.02] p-12 md:p-16 rounded-[3rem] border border-white/10 shadow-3xl sticky top-40 backdrop-blur-3xl">
                                <h3 className="text-4xl font-serif font-bold mb-12 text-white">Project Identity</h3>
                                
                                <div className="space-y-8 mb-16">
                                    <div className="flex justify-between items-center py-6 border-b border-white/5">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Category</span>
                                        <span className="font-bold text-white text-lg capitalize tracking-tight">{inspiration.category.replace('-', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-6 border-b border-white/5">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Style</span>
                                        <span className="font-bold text-white text-lg capitalize tracking-tight">{inspiration.style}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-6 border-b border-white/5">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Status</span>
                                        <span className="font-bold text-luxury-gold text-lg tracking-tight">Available for Custom Build</span>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <Button 
                                        to="/contact"
                                        className="w-full justify-center py-7 text-xl shadow-glow-gold rounded-2xl"
                                    >
                                        Inquire About This Look
                                    </Button>
                                    <div className="pt-10 border-t border-white/5">
                                        <div className="flex items-center gap-5 text-gray-400 text-sm mb-8">
                                            <CheckCircle className="w-6 h-6 text-luxury-gold" />
                                            <span className="font-medium">Premium 3D Walkthrough Included</span>
                                        </div>
                                        <Link to="/contact" className="group inline-flex items-center gap-4 text-luxury-gold font-bold uppercase tracking-[0.3em] text-[10px]">
                                            <Calculator className="w-7 h-7" /> Personalized Estimate <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Detailed Perspectives Grid */}
                {inspiration.gallery && inspiration.gallery.length > 0 && (
                    <Section colored className="py-40 border-y border-white/5">
                        <div className="text-center mb-32">
                            <span className="text-luxury-gold font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">Perspectives</span>
                            <h2 className="text-6xl md:text-7xl font-serif font-bold italic mb-8">Structural Excellence</h2>
                            <p className="text-gray-400 mt-8 max-w-3xl mx-auto text-xl leading-relaxed font-light">
                                A closer look at the materials, textures, and meticulous craftsmanship that define the Sonu Enterprises signature style.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            {inspiration.gallery.map((img, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-3xl border border-white/10 group bg-neutral-900"
                                >
                                    <img 
                                        src={img} 
                                        alt={`${inspiration.title} detail ${idx + 1}`} 
                                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Related Curations */}
                <div className="bg-white/[0.01]">
                    <Section className="py-40">
                        <div className="text-center mb-32">
                            <span className="text-luxury-gold font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">Curated For You</span>
                            <h2 className="text-6xl font-serif font-bold mb-8">Similar Collections</h2>
                            <p className="text-gray-400 text-xl font-light">Further inspirations for your architectural journey.</p>
                        </div>
                        <DesignInspirations isSection={true} />
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default InspirationDetail;
