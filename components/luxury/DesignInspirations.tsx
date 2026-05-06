import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    ChevronRight, 
    Maximize2,
    Heart
} from 'lucide-react';
import Section from '../Section';
import Button from '../Button';
import { useParams, useNavigate } from 'react-router-dom';

import { useDesignInspirations, DesignInspiration as DesignItem } from '../../hooks/useDesignInspirations';

const CATEGORIES = [
    { id: 'all', label: 'All Designs' },
    { id: 'kitchen', label: 'Modular Kitchen' },
    { id: 'bedroom', label: 'Master Bedroom' },
    { id: 'living', label: 'Living Room' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'bhk', label: '1/2/3 BHK Plans' },
    { id: 'wardrobe', label: 'Wardrobe' },
    { id: 'study', label: 'Study Room' },
    { id: 'kids', label: 'Kid\'s Bedroom' },
    { id: 'tv-unit', label: 'TV Unit' },
    { id: 'pooja', label: 'Pooja Room' },
    { id: 'ceiling', label: 'False Ceiling' },
    { id: 'dining', label: 'Dining Room' },
    { id: 'foyer', label: 'Foyer/Entrance' },
    { id: 'office', label: 'Home Office' },
    { id: 'balcony', label: 'Balcony' },
    { id: 'flooring', label: 'Flooring' },
    { id: 'wallpaper', label: 'Wallpaper' },
    { id: 'paint', label: 'Wall Paint' },
    { id: 'staircase', label: 'Staircase' },
    { id: 'bar', label: 'Home Bar' },
];

interface DesignInspirationsProps {
    isSection?: boolean;
}

const DesignInspirations: React.FC<DesignInspirationsProps> = ({ isSection = false }) => {
    const { category: urlCategory } = useParams();
    const navigate = useNavigate();
    const { inspirations: DESIGN_DATA, loading } = useDesignInspirations();
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        if (urlCategory && urlCategory !== 'item') {
            setSelectedCategory(urlCategory);
        }
    }, [urlCategory]);

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        if (!isSection) {
            navigate(`/gallery/${catId === 'all' ? '' : catId}`);
        }
    };

    const handleItemClick = (item: DesignItem) => {
        navigate(`/gallery/item/${item.id}`);
    };

    const filteredDesigns = DESIGN_DATA.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFavorite = (id: string) => {
        setFavorites(prev => 
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    if (loading && DESIGN_DATA.length === 0) {
        return (
            <div className="flex items-center justify-center py-40">
                <div className="w-10 h-10 border-4 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`bg-theme-background ${!isSection ? 'min-h-screen' : ''}`}>
            {/* Header Section - Only show if not used as a section */}
            {!isSection && (
                <div className="relative pt-20 pb-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-theme-accent/5 -skew-x-12 transform translate-x-20" />
                    <div className="container-premium relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl"
                        >
                            <span className="text-theme-accent font-bold uppercase tracking-[0.4em] text-xs mb-6 block">
                                Design Inspirations
                            </span>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-theme-text mb-8 leading-tight">
                                Explore Premium <br />
                                <span className="text-theme-accent italic">Interior Designs</span>
                            </h1>
                            <p className="text-lg text-theme-muted mb-12 font-medium">
                                Luxury spaces crafted to inspire your dream home. Browse our curated collection of world-class interior concepts.
                            </p>

                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="relative flex-1 min-w-[300px]">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-accent w-5 h-5" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by room, style, or material..."
                                        className="w-full pl-12 pr-6 py-4 bg-theme-background border border-theme-border/20 rounded-sm focus:border-theme-accent outline-none transition-all text-theme-text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button 
                                    to="/contact"
                                    variant="primary" 
                                    className="px-8 py-4 h-full rounded-sm"
                                >
                                    Book Consultation
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Category Filter */}
            <div className="sticky top-16 z-30 bg-theme-background/80 backdrop-blur-xl border-y border-theme-border/10 py-4">
                <div className="container-premium flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`whitespace-nowrap px-6 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${
                                selectedCategory === cat.id
                                ? 'bg-theme-accent text-white shadow-lg'
                                : 'text-theme-muted hover:text-theme-accent'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            <Section className={`${isSection ? 'pt-10' : 'py-20'}`}>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    <AnimatePresence mode="popLayout">
                        {filteredDesigns.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className="break-inside-avoid relative group cursor-pointer"
                                onClick={() => handleItemClick(item)}
                            >
                                <div className="relative overflow-hidden rounded-sm bg-theme-background border border-theme-border/10">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-auto transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                    
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <span className="text-theme-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-3 block">
                                                {item.style} • {item.category.replace('-', ' ')}
                                            </span>
                                            <h3 className="text-2xl font-serif font-bold text-white mb-2">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                                                    className={`p-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all ${
                                                        favorites.includes(item.id) ? 'bg-theme-accent text-white border-theme-accent' : 'text-white'
                                                    }`}
                                                >
                                                    <Heart size={16} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                                                </button>
                                                <div className="text-theme-accent flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                                    View Details <ChevronRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Interaction Icon */}
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white">
                                            <Maximize2 size={18} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredDesigns.length === 0 && (
                    <div className="text-center py-40">
                        <p className="text-theme-muted font-serif text-2xl italic">
                            No designs found matching your search.
                        </p>
                        <button 
                            onClick={() => {handleCategoryChange('all'); setSearchQuery('');}}
                            className="mt-6 text-theme-accent font-bold uppercase tracking-widest text-xs hover:underline"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </Section>

            {/* Premium CTA Section */}
            {!isSection && (
                <Section className="bg-luxury-obsidian py-32 overflow-hidden relative">
                    <div className="absolute inset-0 bg-theme-accent/5 pointer-events-none" />
                    <div className="container-premium relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto"
                        >
                            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">
                                Inspired by Our <span className="text-theme-accent">Luxury Designs?</span>
                            </h2>
                            <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto font-medium">
                                Our designers can bring any of these inspirations to your home with a personalized touch. Get started with a professional consultation today.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Button 
                                    to="/contact"
                                    className="bg-theme-accent text-white px-12 py-5 text-lg rounded-sm"
                                >
                                    Get Free Quote
                                </Button>
                                <Button 
                                    to="/contact"
                                    variant="outline" 
                                    className="border-white/20 text-white hover:bg-white hover:text-black px-12 py-5 text-lg rounded-sm"
                                >
                                    Book Consultation
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </Section>
            )}
        </div>
    );
};

export default DesignInspirations;
