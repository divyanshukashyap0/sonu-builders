import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useDesignInspirations } from '../hooks/useDesignInspirations';
import { useServices } from '../hooks/useServices';
import { useProjects } from '../hooks/useProjects';
import { getOptimizedImageUrl } from '../utils/performance';

const GalleryMediaDetail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { inspirations } = useDesignInspirations();
    const { services } = useServices();
    const { projects } = useProjects();

    const url = searchParams.get('url');
    const title = searchParams.get('title') || 'Luxury Design Showcase';
    const description = searchParams.get('desc') || 'Experience the pinnacle of luxury with Sonu Enterprises.';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [url]);

    // Aggregate unique gallery media for back/forward navigation
    const allItems = useMemo(() => {
        const list: { id: string; type: string; image: string; title: string; description: string }[] = [
            ...inspirations.map(item => ({
                id: item.id,
                type: 'inspiration',
                image: item.image,
                title: item.title,
                description: item.description
            })),
            ...services.flatMap(service => (service.gallery || []).map((img, idx) => ({
                id: `service-${service.id}-${idx}`,
                type: 'service-media',
                image: img,
                title: `${service.title} - Showcase ${idx + 1}`,
                description: service.description
            }))),
            ...projects.flatMap(project => [
                {
                    id: `project-main-${project.id}`,
                    type: 'service-media',
                    image: project.image,
                    title: project.title,
                    description: project.description
                },
                ...(project.gallery || []).map((img, idx) => ({
                    id: `project-gal-${project.id}-${idx}`,
                    type: 'service-media',
                    image: img,
                    title: `${project.title} - Perspective ${idx + 1}`,
                    description: project.description
                }))
            ])
        ];

        return list.filter((item, index, self) =>
            Boolean(item.image) && index === self.findIndex(t => t.image === item.image)
        );
    }, [inspirations, services, projects]);

    const currentIndex = allItems.findIndex(item => item.image === url);
    const nextItem = allItems.length > 0 && currentIndex >= 0 ? allItems[(currentIndex + 1) % allItems.length] : null;
    const prevItem = allItems.length > 0 && currentIndex >= 0 ? allItems[(currentIndex - 1 + allItems.length) % allItems.length] : null;

    const navigateToItem = (item: any) => {
        if (!item) return;
        if (item.type === 'inspiration') {
            navigate(`/gallery/item/${item.id}`, { replace: true });
        } else {
            navigate(`/gallery/media?url=${encodeURIComponent(item.image)}&title=${encodeURIComponent(item.title)}&desc=${encodeURIComponent(item.description)}`, { replace: true });
        }
    };

    const handleBack = () => {
        const lastServicePage = sessionStorage.getItem('last_opened_service_page') || '/services';
        navigate(lastServicePage);
    };

    const handleDragEnd = (_event: any, info: any) => {
        if (info.offset.x > 80 && prevItem) navigateToItem(prevItem);
        else if (info.offset.x < -80 && nextItem) navigateToItem(nextItem);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && nextItem) navigateToItem(nextItem);
            if (e.key === 'ArrowLeft' && prevItem) navigateToItem(prevItem);
            if (e.key === 'Escape') handleBack();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextItem, prevItem]);

    if (!url) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6">
                <h2 className="text-3xl font-serif font-bold mb-6">Media Not Found</h2>
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
                title={`${title} - Full Screen Showcase | Sonu Enterprises`}
                description={description}
                canonical={window.location.href}
                ogImage={url}
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
                        key={url}
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
                            src={getOptimizedImageUrl(url, 1920)}
                            alt={title}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xs cursor-grab active:cursor-grabbing"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Side Navigation Arrows */}
                {allItems.length > 1 && (
                    <>
                        <button
                            onClick={() => prevItem && navigateToItem(prevItem)}
                            aria-label="Previous image"
                            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 text-white/60 hover:text-white bg-black/50 hover:bg-black/80 rounded-full border border-white/10 backdrop-blur-xs transition-all cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5 sm:w-7 sm:h-7" />
                        </button>

                        <button
                            onClick={() => nextItem && navigateToItem(nextItem)}
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
                        {currentIndex >= 0 && (
                            <>
                                <span className="font-bold text-[#c5a059]">
                                    {String(currentIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(allItems.length).padStart(2, '0')}
                                </span>
                                <span className="text-white/30">•</span>
                            </>
                        )}
                        <span className="truncate max-w-[220px] sm:max-w-md">{title}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryMediaDetail;
