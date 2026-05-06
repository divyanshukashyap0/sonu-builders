import React, { useState } from 'react';
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
import { useProjects } from '../../hooks/useProjects';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import MediaRenderer from '../ui/MediaRenderer';

const DesignInspirations: React.FC<{ isSection?: boolean }> = ({ isSection = false }) => {
    const navigate = useNavigate();
    const { inspirations, loading: loadingInspirations } = useDesignInspirations();
    const { services, loading: loadingServices } = useServices();
    const { projects, loading: loadingProjects } = useProjects();
    const { settings } = useSiteSettings();
    const [searchQuery, setSearchQuery] = useState('');

    // Combine inspirations, service gallery images, and project images
    const allItems = [
        ...inspirations.map(item => ({
            id: item.id,
            type: 'inspiration',
            image: item.image,
            title: item.title,
            description: item.description,
            category: item.category,
            style: item.style || 'Modern'
        })),
        ...services.flatMap(service => (service.gallery || []).map((url, idx) => ({
            id: `service-${service.id}-${idx}`,
            type: 'service-media',
            image: url,
            title: `${service.title} - Showcase`,
            description: `Experience the luxury of our ${service.title.toLowerCase()} service.`,
            category: service.title.toLowerCase().replace(/\s+/g, '-'),
            style: 'Luxury',
            serviceId: service.id,
            originalUrl: url
        }))),
        ...projects.flatMap(project => [
            {
                id: `project-main-${project.id}`,
                type: 'service-media',
                image: project.image,
                title: project.title,
                description: project.description,
                category: 'completed-projects',
                style: project.category,
                serviceId: project.id
            },
            ...(project.gallery || []).map((url, idx) => ({
                id: `project-gal-${project.id}-${idx}`,
                type: 'service-media',
                image: url,
                title: `${project.title} - Perspective`,
                description: project.description,
                category: 'completed-projects',
                style: project.category,
                serviceId: project.id
            }))
        ])
    ];

    // Remove duplicates if the same image URL is in both
    const uniqueItems = allItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.image === item.image)
    );

    const filteredItems = uniqueItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const handleItemClick = (item: any) => {
        if (item.type === 'inspiration') {
            navigate(`/gallery/item/${item.id}`);
        } else {
            navigate(`/gallery/media?url=${encodeURIComponent(item.image)}&title=${encodeURIComponent(item.title)}&desc=${encodeURIComponent(item.description)}`);
        }
    };

    const loading = loadingInspirations || loadingServices || loadingProjects;

    if (loading && allItems.length === 0) {
        return (
            <div className="flex items-center justify-center py-40">
                <div className="w-10 h-10 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`bg-[#050505] ${!isSection ? 'min-h-screen' : ''}`}>
            {/* Header Section */}
            {!isSection && (
                <div className="relative pt-40 pb-24 overflow-hidden">
                    {/* Admin-Controlled Background Image */}
                    {settings?.galleryBackgroundImage && (
                        <div className="absolute inset-0 z-0">
                            <motion.img 
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: settings?.galleryOverlayOpacity ?? 0.4 }}
                                transition={{ duration: 2 }}
                                src={settings?.galleryBackgroundImage} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
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
                                Complete Media Gallery
                            </span>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight">
                                Our Work <br />
                                <span className="text-luxury-gold italic">All Projects</span>
                            </h1>
                            <p className="text-lg text-gray-400 mb-12 font-medium">
                                Explore every project and service detail. From modular kitchens to full home renovations, see how we bring luxury to life.
                            </p>

                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="relative flex-1 min-w-[300px]">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gold w-5 h-5" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by service, style, or room..."
                                        className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-lg focus:border-luxury-gold/50 outline-none transition-all text-white backdrop-blur-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button 
                                    to="/contact"
                                    className="px-8 py-4 h-full shadow-glow-gold"
                                >
                                    Get a Quote
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Gallery Grid */}
            <Section className={`${isSection ? 'pt-10' : 'py-20'}`}>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
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
                                <div className="relative overflow-hidden rounded-xl bg-neutral-900 border border-white/10 shadow-2xl">
                                    <MediaRenderer 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-auto transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                    
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-2 block">
                                                {item.style} • {item.category.replace('-', ' ')}
                                            </span>
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-serif font-bold text-white">
                                                    {item.title}
                                                </h3>
                                                <div className="text-luxury-gold flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
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

                {filteredItems.length === 0 && (
                    <div className="text-center py-40">
                        <ImageIcon size={48} className="mx-auto text-luxury-gold/20 mb-6" />
                        <p className="text-gray-500 font-serif text-2xl italic">
                            No images found matching your search.
                        </p>
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-6 text-luxury-gold font-bold uppercase tracking-widest text-[10px] hover:underline"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </Section>
        </div>
    );
};

export default DesignInspirations;
