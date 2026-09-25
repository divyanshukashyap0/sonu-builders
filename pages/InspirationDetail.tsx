import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useDesignInspirations } from '../hooks/useDesignInspirations';
import SEO from '../components/SEO';
import { getOptimizedImageUrl } from '../utils/performance';

const InspirationDetail: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const navigate = useNavigate();
    const { inspirations, loading } = useDesignInspirations();

    const inspiration = inspirations.find(item => item.id === itemId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [itemId]);

    const currentIndex = inspirations.findIndex(item => item.id === itemId);
    const nextItem = inspirations.length > 0 ? inspirations[(currentIndex + 1) % inspirations.length] : null;
    const prevItem = inspirations.length > 0 ? inspirations[(currentIndex - 1 + inspirations.length) % inspirations.length] : null;

    const navigateToNext = () => {
        if (nextItem) navigate(`/gallery/item/${nextItem.id}`, { replace: true });
    };

    const navigateToPrev = () => {
        if (prevItem) navigate(`/gallery/item/${prevItem.id}`, { replace: true });
    };

    const handleBack = () => {
        const lastServicePage = sessionStorage.getItem('last_opened_service_page') || '/services';
        navigate(lastServicePage);
    };

    const handleDragEnd = (_event: any, info: any) => {
        if (info.offset.x > 80) navigateToPrev();
        else if (info.offset.x < -80) navigateToNext();
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') navigateToNext();
            if (e.key === 'ArrowLeft') navigateToPrev();
            if (e.key === 'Escape') handleBack();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextItem, prevItem]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="w-12 h-12 border-4 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
            </div>
        );
    }

    if (!inspiration) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6">
                <h2 className="text-3xl font-serif font-bold mb-6">Concept Not Found</h2>
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#c5a059] text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-white transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return</span>
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-stone-100 flex flex-col justify-between">
            <SEO
                title={`${inspiration.title} - Full Screen Showcase | Sonu Enterprises`}
                description={inspiration.description}
                canonical={window.location.href}
                ogImage={inspiration.image}
            />

            {/* Back Button */}
            <div className="absolute top-20 sm:top-24 left-4 sm:left-8 z-40">
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/70 hover:bg-[#8C6D23] text-white border border-white/20 hover:border-[#8C6D23] backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer group"
                    aria-label="Back to Previous Page"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Back</span>
                </button>
            </div>

            {/* Full-Screen Image Showcase */}
            <div className="relative w-full h-[88vh] sm:h-[90vh] flex items-center justify-center pt-16 sm:pt-20 pb-4 overflow-hidden touch-none select-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={inspiration.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="w-full h-full flex items-center justify-center p-3 sm:p-6"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                    >
                        <img
                            src={getOptimizedImageUrl(inspiration.image, 1920)}
                            alt={inspiration.title}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xs cursor-grab active:cursor-grabbing"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Side Navigation Arrows */}
                {inspirations.length > 1 && (
                    <>
                        <button
                            onClick={navigateToPrev}
                            aria-label="Previous image"
                            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 text-white/60 hover:text-white bg-black/50 hover:bg-black/80 rounded-full border border-white/10 backdrop-blur-xs transition-all cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5 sm:w-7 sm:h-7" />
                        </button>

                        <button
                            onClick={navigateToNext}
                            aria-label="Next image"
                            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 text-white/60 hover:text-white bg-black/50 hover:bg-black/80 rounded-full border border-white/10 backdrop-blur-xs transition-all cursor-pointer"
                        >
                            <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7" />
                        </button>
                    </>
                )}

                {/* Minimalist image caption pill */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-[11px] font-medium text-stone-200 shadow-lg">
                        <span className="font-bold text-[#c5a059]">
                            {String(currentIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(inspirations.length).padStart(2, '0')}
                        </span>
                        <span className="text-white/30">•</span>
                        <span className="truncate max-w-[220px] sm:max-w-md">{inspiration.title}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspirationDetail;
