import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Download, 
    Share2, 
    Calculator, 
    Palette, 
    Compass,
    CheckCircle,
    ArrowRight,
    ChevronDown
} from 'lucide-react';
import Section from '../components/Section';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useDesignInspirations } from '../hooks/useDesignInspirations';
import { useServices } from '../hooks/useServices';
import { useProjects } from '../hooks/useProjects';
import { downloadWithWatermark } from '../utils/imageUtils';

const GalleryMediaDetail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { inspirations } = useDesignInspirations();
    const { services } = useServices();
    const { projects } = useProjects();
    
    const url = searchParams.get('url');
    const title = searchParams.get('title') || 'Luxury Design Showcase';
    const description = searchParams.get('desc') || 'Experience the pinnacle of luxury with Sonu Enterprises.';

    // Aggregate all unique items for navigation
    const allItems = [
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
            title: `${service.title} - Showcase`,
            description: `Experience the luxury of our ${service.title.toLowerCase()} service.`
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
                title: `${project.title} - Perspective`,
                description: project.description
            }))
        ])
    ];

    // Deduplicate
    const uniqueItems = allItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.image === item.image)
    );

    const currentIndex = uniqueItems.findIndex(item => item.image === url);
    const nextItem = uniqueItems[(currentIndex + 1) % uniqueItems.length];
    const prevItem = uniqueItems[(currentIndex - 1 + uniqueItems.length) % uniqueItems.length];

    const navigateToItem = (item: any) => {
        if (item.type === 'inspiration') {
            navigate(`/gallery/item/${item.id}`);
        } else {
            navigate(`/gallery/media?url=${encodeURIComponent(item.image)}&title=${encodeURIComponent(item.title)}&desc=${encodeURIComponent(item.description)}`);
        }
    };

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x > 100) navigateToItem(prevItem);
        else if (info.offset.x < -100) navigateToItem(nextItem);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [url]);

    if (!url) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
                <h2 className="text-4xl font-serif mb-8">Media Not Found</h2>
                <Button to="/gallery">Return to Gallery</Button>
            </div>
        );
    }

    const handleDownload = async () => {
        if (!url) return;
        await downloadWithWatermark(url, `sonu-design-${Date.now()}`);
    };

    const handleShare = async () => {
        const shareData = {
            title: title,
            text: description,
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

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
            <SEO
                title={`${title} - Sonu Enterprises Gallery`}
                description={description}
                canonical={window.location.href}
            />

            {/* Immersive Full-Screen Media Section */}
            <div className="relative w-full h-[100vh] bg-black overflow-hidden touch-none">
                <AnimatePresence mode="wait">
                    <motion.img 
                        key={url}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        src={url} 
                        alt={title} 
                        className="absolute inset-0 w-full h-full object-contain cursor-grab active:cursor-grabbing bg-black/50"
                    />
                </AnimatePresence>
                
                {/* Side Navigation Arrows */}
                <div className="absolute inset-y-0 left-0 w-16 md:w-32 flex items-center justify-center z-40">
                    <button 
                        onClick={() => navigateToItem(prevItem)}
                        className="p-3 md:p-6 text-white/30 hover:text-luxury-gold transition-colors hover:bg-white/5 rounded-full"
                    >
                        <ArrowLeft size={32} className="md:w-12 md:h-12" />
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 flex items-center justify-center z-40">
                    <button 
                        onClick={() => navigateToItem(nextItem)}
                        className="p-3 md:p-6 text-white/30 hover:text-luxury-gold transition-colors hover:bg-white/5 rounded-full"
                    >
                        <ArrowRight size={32} className="md:w-12 md:h-12" />
                    </button>
                </div>

                {/* Dynamic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Navigation & Actions */}
                <div className="absolute top-0 left-0 right-0 p-6 pt-24 md:pt-48 flex justify-between items-center z-50">
                    <motion.button 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        onClick={() => navigate('/gallery')}
                        className="group flex items-center gap-3 bg-black/40 backdrop-blur-2xl px-6 py-3 rounded-full text-white border border-white/10 hover:bg-luxury-gold hover:text-black transition-all duration-500"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[9px] uppercase font-bold tracking-[0.3em]">Gallery</span>
                    </motion.button>
                </div>

                {/* Hero Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-24 lg:p-32 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="max-w-6xl"
                    >
                        <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-8">
                            <motion.span 
                                initial={{ width: 0 }}
                                animate={{ width: 40 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="h-[1px] bg-luxury-gold hidden md:block" 
                            />
                            <span className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px]">
                                Service Showcase • Modern Luxury
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 md:mb-12 leading-[1.1] tracking-tight">
                            {title}
                        </h1>
                        <div className="flex flex-wrap gap-4 md:gap-8 items-center pointer-events-auto">
                            <Button 
                                to={`/contact?subject=${encodeURIComponent(title)}`}
                                className="px-10 py-4 md:px-14 md:py-6 text-sm md:text-xl shadow-glow-gold rounded-full group"
                            >
                                Get This Quote <ArrowRight className="ml-2 md:ml-3 group-hover:translate-x-2 transition-transform" />
                            </Button>
                            <button 
                                onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex items-center gap-2 md:gap-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-8 py-4 md:px-12 md:py-6 rounded-full text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-500"
                            >
                                Explore Details <ChevronDown size={18} className="animate-bounce" />
                            </button>
                        </div>
                    </motion.div>
                </div>

            </div>

            {/* Content Detail Section */}
            <div id="details" className="relative z-10 bg-[#050505] border-t border-white/5">
                <Section className="py-40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                        <div className="lg:col-span-7 space-y-12">
                            <h2 className="text-5xl md:text-6xl font-serif font-bold italic text-luxury-gold">Design Philosophy</h2>
                            <p className="text-3xl text-gray-300 leading-relaxed font-light">
                                {description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-16">
                                <div className="group p-12 bg-white/[0.01] rounded-[2rem] border border-white/5 hover:border-luxury-gold/30 transition-all duration-700 hover:bg-white/[0.03]">
                                    <div className="w-16 h-16 bg-luxury-gold/10 rounded-3xl flex items-center justify-center mb-8">
                                        <Palette className="w-8 h-8 text-luxury-gold" />
                                    </div>
                                    <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-4 text-luxury-gold">Aesthetic Profile</h4>
                                    <p className="text-gray-400 text-xl font-medium">Modern Luxury</p>
                                </div>
                                <div className="group p-12 bg-white/[0.01] rounded-[2rem] border border-white/5 hover:border-luxury-gold/30 transition-all duration-700 hover:bg-white/[0.03]">
                                    <div className="w-16 h-16 bg-luxury-gold/10 rounded-3xl flex items-center justify-center mb-8">
                                        <Compass className="w-8 h-8 text-luxury-gold" />
                                    </div>
                                    <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-4 text-luxury-gold">Craftsmanship</h4>
                                    <p className="text-gray-400 text-xl font-medium">Premium Finish</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="bg-white/[0.02] p-12 md:p-16 rounded-[3rem] border border-white/10 shadow-3xl sticky top-40 backdrop-blur-3xl">
                                <h3 className="text-4xl font-serif font-bold mb-12 text-white">Project Identity</h3>
                                <div className="space-y-8 mb-16">
                                    <div className="flex justify-between items-center py-6 border-b border-white/5">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Status</span>
                                        <span className="font-bold text-luxury-gold text-lg tracking-tight">Showcase Item</span>
                                    </div>
                                    <div className="flex justify-between items-center py-6 border-b border-white/5">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Type</span>
                                        <span className="font-bold text-white text-lg capitalize tracking-tight">Service Media</span>
                                    </div>
                                </div>
                                <Button 
                                    to="/contact"
                                    className="w-full justify-center py-7 text-xl shadow-glow-gold rounded-2xl"
                                >
                                    Get Custom Estimate
                                </Button>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default GalleryMediaDetail;
