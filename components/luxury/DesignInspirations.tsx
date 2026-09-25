import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    ChevronRight, 
    Maximize2,
    Image as ImageIcon
} from 'lucide-react';
import Section from '../Section';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useDesignInspirations } from '../../hooks/useDesignInspirations';
import { useServices } from '../../hooks/useServices';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { REAL_ADMIN_SERVICES } from '../../constants';
import MediaRenderer from '../ui/MediaRenderer';

const GALLERY_CATEGORIES = [
    'All',
    'Kitchens',
    'Living & Dining',
    'Bedrooms',
    'Wardrobes',
    'Ceilings & Bathrooms'
];

interface DesignInspirationsProps {
    isSection?: boolean;
    initialCategory?: string;
    title?: string;
    subtitle?: string;
}

const DesignInspirations: React.FC<DesignInspirationsProps> = ({ 
    isSection = false,
    initialCategory = 'All',
    title,
    subtitle
}) => {
    const navigate = useNavigate();
    const { inspirations, loading: loadingInspirations } = useDesignInspirations();
    const { services: hookServices, loading: loadingServices } = useServices();
    const { settings } = useSiteSettings();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
    const initialBatchSize = isSection ? 12 : 18;
    const [visibleCount, setVisibleCount] = useState<number>(initialBatchSize);

    // Reset pagination when category or search changes
    React.useEffect(() => {
        setVisibleCount(isSection ? 12 : 18);
    }, [activeCategory, searchQuery, isSection]);

    // Combine all genuine services with fallbacks
    const activeServices = useMemo(() => {
        if (hookServices && hookServices.length > 0) {
            return hookServices.map(hs => {
                const fallback = REAL_ADMIN_SERVICES.find(r => r.id === hs.id || r.title?.toLowerCase() === hs.title?.toLowerCase());
                return {
                    ...fallback,
                    ...hs,
                    gallery: (hs.gallery && hs.gallery.length > 0) ? hs.gallery : fallback?.gallery || []
                };
            });
        }
        return REAL_ADMIN_SERVICES;
    }, [hookServices]);

    // Combine inspirations, service gallery images, and primary service images
    const allItems = useMemo(() => {
        const items: any[] = [];

        // 1. Admin Inspirations
        inspirations.forEach(item => {
            items.push({
                id: item.id,
                type: 'inspiration',
                image: item.image,
                title: item.title,
                description: item.description,
                category: item.category || 'General',
                style: item.style || 'Modern Luxury'
            });
        });

        // 2. Service Galleries & Primary Images
        activeServices.forEach(service => {
            // Main image
            if (service.image) {
                items.push({
                    id: `service-main-${service.id}`,
                    type: 'service-media',
                    image: service.image,
                    title: `${service.title} - Overview`,
                    description: service.description || `Luxury ${service.title.toLowerCase()} execution by Sonu Enterprises.`,
                    category: service.title,
                    style: service.categoryGroup || 'Bespoke',
                    serviceId: service.id,
                    originalUrl: service.image
                });
            }

            // Gallery images
            if (service.gallery && service.gallery.length > 0) {
                service.gallery.forEach((url, idx) => {
                    items.push({
                        id: `service-gal-${service.id}-${idx}`,
                        type: 'service-media',
                        image: url,
                        title: `${service.title} - Showcase ${idx + 1}`,
                        description: `Detailed perspective of our ${service.title.toLowerCase()} finish.`,
                        category: service.title,
                        style: 'Craftsmanship',
                        serviceId: service.id,
                        originalUrl: url
                    });
                });
            }
        });

        // Deduplicate by image URL
        return items.filter((item, index, self) =>
            index === self.findIndex((t) => t.image === item.image)
        );
    }, [inspirations, activeServices]);

    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 item.category.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (activeCategory === 'All') return true;

            const cat = item.category.toLowerCase();
            const title = item.title.toLowerCase();

            if (activeCategory === 'Kitchens') {
                return cat.includes('kitchen') || title.includes('kitchen');
            }
            if (activeCategory === 'Living & Dining') {
                return cat.includes('living') || cat.includes('dining') || cat.includes('tv') || title.includes('living') || title.includes('dining');
            }
            if (activeCategory === 'Bedrooms') {
                return cat.includes('bedroom') || cat.includes('bed') || title.includes('bedroom');
            }
            if (activeCategory === 'Wardrobes') {
                return cat.includes('wardrobe') || cat.includes('storage') || title.includes('wardrobe') || title.includes('closet');
            }
            if (activeCategory === 'Ceilings & Bathrooms') {
                return cat.includes('ceiling') || cat.includes('bath') || cat.includes('temple') || title.includes('ceiling') || title.includes('bath');
            }

            return true;
        });
    }, [allItems, searchQuery, activeCategory]);

    const handleItemClick = (item: any) => {
        if (item.type === 'inspiration') {
            navigate(`/gallery/item/${item.id}`);
        } else {
            navigate(`/gallery/media?url=${encodeURIComponent(item.image)}&title=${encodeURIComponent(item.title)}&desc=${encodeURIComponent(item.description)}`);
        }
    };

    const loading = loadingInspirations || loadingServices;

    if (loading && allItems.length === 0) {
        return (
            <div className="flex items-center justify-center py-40">
                <div className="w-10 h-10 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div id="service-gallery" className={`bg-[#FAF8F5] ${!isSection ? 'min-h-screen' : 'py-20 md:py-28 border-t border-luxury-gold/20'}`}>
            {/* Header Section for Section Mode */}
            {isSection ? (
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3 flex items-center gap-2.5 text-[#8C6D23]">
                                <span className="w-6 h-[1.5px] bg-[#c5a059]" />
                                Service Gallery
                            </p>
                            <h2 
                                className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] leading-tight"
                                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", letterSpacing: '-0.02em' }}
                            >
                                {title || 'Visual Excellence &'} <span className="text-[#8C6D23] italic">Real Craft</span>
                            </h2>
                            <p className="text-stone-600 text-sm md:text-base max-w-2xl mt-3 leading-relaxed">
                                {subtitle || 'Explore high-resolution photography of our turnkey interior executions, bespoke carpentry, modular kitchens, and architectural false ceilings across Mumbai.'}
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search gallery..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xs text-xs text-[#171717] placeholder:text-stone-400 focus:border-[#8C6D23] outline-none shadow-2xs transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                        {GALLERY_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-wider font-bold transition-all duration-300 rounded-xs shadow-2xs ${
                                    activeCategory === cat
                                        ? 'bg-[#171717] text-[#FAF8F5] border border-[#171717]'
                                        : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                /* Header Section for Standalone Gallery Page */
                <div className="relative pt-40 pb-20 overflow-hidden">
                    {settings?.galleryBackgroundImage && (
                        <div className="absolute inset-0 z-0">
                            <motion.img 
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: settings?.galleryOverlayOpacity ?? 0.2 }}
                                transition={{ duration: 2 }}
                                src={settings?.galleryBackgroundImage} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent" />
                        </div>
                    )}
                    
                    <div className="absolute top-0 right-0 w-[60%] h-full bg-luxury-gold/5 -skew-x-12 transform translate-x-32 z-0" />
                    
                    <div className="container-premium relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-4xl"
                        >
                            <span className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">
                                Complete Service Gallery
                            </span>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#171717] mb-8 leading-tight">
                                Interior Craft <br />
                                <span className="text-luxury-gold italic">Service Gallery</span>
                            </h1>
                            <p className="text-lg text-stone-600 mb-10 font-medium max-w-2xl leading-relaxed">
                                Explore every service detail. From modular kitchens and master bedrooms to bespoke living spaces, see how we bring luxury to life.
                            </p>

                            <div className="flex flex-wrap gap-4 items-center mb-8">
                                <div className="relative flex-1 min-w-[280px]">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gold w-5 h-5" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by service, style, or room..."
                                        className="w-full pl-12 pr-6 py-4 bg-white border border-stone-200 rounded-xl focus:border-luxury-gold outline-none transition-all text-[#171717] placeholder:text-stone-400 shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button 
                                    to="/contact"
                                    className="px-8 py-4 h-full shadow-glow-gold rounded-xl"
                                >
                                    Get a Quote
                                </Button>
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                                {GALLERY_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`shrink-0 px-5 py-2.5 text-xs uppercase tracking-wider font-bold transition-all duration-300 rounded-full shadow-sm ${
                                            activeCategory === cat
                                                ? 'bg-luxury-gold text-white shadow-luxury-gold/30'
                                                : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.slice(0, visibleCount).map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                className="break-inside-avoid relative group cursor-pointer"
                                onClick={() => handleItemClick(item)}
                            >
                                <div className="relative overflow-hidden rounded-xs bg-stone-100 border border-stone-200/90 shadow-2xs aspect-[4/3] sm:aspect-[16/11] hover:shadow-md hover:border-[#8C6D23]/50 transition-all duration-500">
                                    <MediaRenderer 
                                        src={item.image} 
                                        alt={item.title} 
                                        width={600}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                                        loading="lazy"
                                    />
                                    
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-6">
                                        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                                            <span className="text-[#e8d5a3] text-[9px] uppercase tracking-[0.25em] font-bold mb-1.5 block">
                                                {item.style} • {item.category}
                                            </span>
                                            <div className="flex items-center justify-between">
                                                <h3 
                                                    className="text-lg font-bold text-white leading-snug line-clamp-1"
                                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                                >
                                                    {item.title}
                                                </h3>
                                                <div className="text-[#c5a059] flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ml-2">
                                                    <span>View</span>
                                                    <ChevronRight size={13} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Top Corner Icon */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 bg-black/40 backdrop-blur-xs rounded-full flex items-center justify-center border border-white/30 text-white">
                                            <Maximize2 size={14} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Load More / Explore Full Gallery */}
                {filteredItems.length > visibleCount && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 text-center">
                        <button
                            onClick={() => setVisibleCount((prev) => prev + (isSection ? 12 : 18))}
                            className="px-8 py-3.5 bg-[#171717] hover:bg-[#8C6D23] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold rounded-xs transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                            <span>Load More Designs ({filteredItems.length - visibleCount} remaining)</span>
                            <ChevronRight size={14} />
                        </button>
                        {isSection && (
                            <button
                                onClick={() => navigate('/gallery')}
                                className="px-8 py-3.5 bg-white text-stone-800 border border-stone-300 hover:border-[#8C6D23] text-xs uppercase tracking-widest font-bold rounded-xs transition-colors shadow-2xs cursor-pointer"
                            >
                                Explore Full Gallery
                            </button>
                        )}
                    </div>
                )}

                {filteredItems.length === 0 && (
                    <div className="text-center py-28 bg-white border border-stone-200/80 rounded-xs p-8">
                        <ImageIcon size={40} className="mx-auto text-stone-300 mb-4" />
                        <p 
                            className="text-stone-700 text-xl font-bold mb-2"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            No service images found matching "{searchQuery}"
                        </p>
                        <p className="text-stone-500 text-xs mb-6">
                            Try searching for kitchen, bedroom, wardrobe, ceiling, or dining.
                        </p>
                        <button 
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            className="px-6 py-2.5 bg-[#171717] text-[#FAF8F5] text-xs uppercase tracking-wider font-bold rounded-xs hover:bg-[#8C6D23] transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DesignInspirations;
