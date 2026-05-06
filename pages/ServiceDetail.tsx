import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, DollarSign } from 'lucide-react';
import PageHero from '../components/luxury/PageHero';
import Section from '../components/Section';
import Button from '../components/Button';
import { useServices } from '../hooks/useServices';
import SEO from '../components/SEO';
import { SERVICES } from '../constants';
import * as Icons from 'lucide-react';
import MediaRenderer from '../components/ui/MediaRenderer';

const ServiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { services, loading } = useServices();
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Find service from Firestore first, then fallback to constants
    const serviceFromHook = services.find(s => s.id === id);
    const serviceFromConstants = SERVICES.find(s => s.id === id);
    const service = serviceFromHook || serviceFromConstants;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null || !service?.gallery) return;
            
            if (e.key === 'Escape') {
                setLightboxIndex(null);
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowRight') {
                setLightboxIndex(prev => (prev !== null && prev < (service.gallery?.length || 0) - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowLeft') {
                setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, service?.gallery]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-ivory-pearl">
                <h2 className="text-2xl font-serif text-luxury-charcoal mb-4">Service Not Found</h2>
                <Link to="/services" className="text-luxury-gold hover:underline">Return to Services</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen text-white">
            <SEO
                title={`${service.title} - Luxury Services`}
                description={service.description}
                canonical={`https://sonu-builders.in/services/${id}`}
            />

            <PageHero
                title={service.title}
                subtitle="Excellence in every detail"
                backgroundImage={service.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"}
            />

            <Section>
                <Link to="/services" className="inline-flex items-center text-luxury-gold mb-8 hover:translate-x-[-4px] transition-transform font-bold uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-6">Service Overview</h2>
                        <div className="text-lg text-gray-300 leading-relaxed mb-8 space-y-4">
                            <p className="font-medium">{service.longDescription || service.description}</p>
                            <p>At Sonu Enterprises, we bring over 15 years of expertise to ensure {service.title} meets the highest standards of luxury and functionality.</p>
                        </div>

                        {service.features && service.features.length > 0 && (
                            <div className="bg-white/5 p-8 rounded-xl shadow-2xl border border-luxury-gold/20 backdrop-blur-sm">
                                <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2 text-luxury-gold">
                                    <Icons.Award className="w-6 h-6" />
                                    Key Service Features
                                </h3>
                                <ul className="space-y-4">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-luxury-gold mt-1 mr-3 shrink-0" />
                                            <span className="text-gray-300 font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        {/* Static images replaced by dynamic suggestions if available */}
                        {service.suggestions && service.suggestions.length > 0 && (
                            <div className="bg-luxury-gold/5 p-8 rounded-xl border border-luxury-gold/20 backdrop-blur-sm">
                                <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2 text-luxury-gold">
                                    <Icons.Lightbulb className="w-6 h-6" />
                                    Expert Design Suggestions
                                </h3>
                                <div className="space-y-6">
                                    {service.suggestions.map((sugg, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center shrink-0 border border-luxury-gold/30">
                                                <span className="text-luxury-gold font-bold text-xs">{idx + 1}</span>
                                            </div>
                                            <p className="text-gray-300 text-sm font-medium leading-relaxed italic">
                                                "{sugg}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-luxury-obsidian p-8 rounded-xl border border-luxury-gold/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-center mb-4">
                                    <Clock className="w-5 h-5 text-luxury-gold mr-3" />
                                    <span className="font-bold text-white">Estimated Timeline: 4-8 Weeks</span>
                                </div>
                                <div className="flex items-center mb-6">
                                    <DollarSign className="w-5 h-5 text-luxury-gold mr-3" />
                                    <span className="font-bold text-white">Starting from ₹1,500/sq.ft</span>
                                </div>
                                <Button to="/contact" className="w-full justify-center shadow-glow-gold">Request Personalized Quote</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Service Gallery */}
            {service.gallery && service.gallery.length > 0 && (
                <Section colored>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-white mb-4">Service Gallery</h2>
                        <p className="text-luxury-gold uppercase tracking-[0.3em] text-[10px] font-bold">Explore our completed works in {service.title}</p>
                    </div>
                    <div className="columns-1 md:columns-2 gap-8 space-y-8">
                        {service.gallery.map((img, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="break-inside-avoid rounded-xl overflow-hidden shadow-luxury border border-white/20 group cursor-pointer relative"
                                onClick={() => {
                                    setLightboxIndex(idx);
                                    document.body.style.overflow = 'hidden';
                                }}
                            >
                                <MediaRenderer 
                                    src={img} 
                                    alt={`${service.title} inspiration ${idx + 1}`} 
                                    className="w-full h-auto transition-transform duration-[2000ms] ease-out group-hover:scale-110" 
                                    showPlayIcon
                                />
                            </motion.div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Lightbox for Gallery */}
            <AnimatePresence>
                {lightboxIndex !== null && service.gallery && typeof document !== 'undefined' && createPortal(
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999999] bg-black/98 backdrop-blur-3xl flex items-center justify-center overflow-hidden"
                        onClick={() => {
                            setLightboxIndex(null);
                            document.body.style.overflow = 'auto';
                        }}
                    >
                        {/* Close Button */}
                        <button 
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-all p-3 z-[1000001] bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex(null);
                                document.body.style.overflow = 'auto';
                            }}
                        >
                            <Icons.X size={28} />
                        </button>

                        {/* Navigation Buttons */}
                        {service.gallery.length > 1 && (
                            <>
                                <button 
                                    className={`absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all p-5 z-[1000001] rounded-full hover:bg-white/10 ${lightboxIndex === 0 ? 'opacity-20 pointer-events-none' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null && prev > 0 ? prev - 1 : prev);
                                    }}
                                >
                                    <Icons.ChevronLeft size={64} />
                                </button>
                                <button 
                                    className={`absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all p-5 z-[1000001] rounded-full hover:bg-white/10 ${lightboxIndex === service.gallery.length - 1 ? 'opacity-20 pointer-events-none' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null && service.gallery && prev < service.gallery.length - 1 ? prev + 1 : prev);
                                    }}
                                >
                                    <Icons.ChevronRight size={64} />
                                </button>
                            </>
                        )}

                        <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <motion.div
                                key={lightboxIndex}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                className="w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                            >
                                <MediaRenderer
                                    src={service.gallery[lightboxIndex]}
                                    alt={service.title}
                                    className="w-full h-full"
                                    objectFit="contain"
                                    loading="eager"
                                />
                            </motion.div>
                            
                            {/* Floating Caption */}
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-10 left-0 right-0 text-center pointer-events-none px-4"
                            >
                                <div className="inline-block bg-black/40 backdrop-blur-2xl px-10 py-5 rounded-3xl border border-white/5 shadow-2xl">
                                    <h3 className="text-xl md:text-3xl font-serif font-bold text-white tracking-tight">{service.title}</h3>
                                    <div className="flex items-center justify-center gap-4 mt-3">
                                        <div className="h-[1px] w-12 bg-luxury-gold/30" />
                                        <p className="text-luxury-gold uppercase tracking-[0.4em] text-[10px] font-black">{lightboxIndex + 1} / {service.gallery.length}</p>
                                        <div className="h-[1px] w-12 bg-luxury-gold/30" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>,
                    document.body
                )}
            </AnimatePresence>

            {/* Service Videos */}
            {service.videos && service.videos.length > 0 && (
                <Section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-white mb-4">Video Showcases</h2>
                        <p className="text-luxury-gold uppercase tracking-[0.3em] text-[10px] font-bold">Experience our expertise in motion</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {service.videos.map((video, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="aspect-video rounded-xl overflow-hidden shadow-luxury border border-white/20 group bg-black relative"
                            >
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={video.includes('youtube.com/embed/') ? video : `https://www.youtube.com/embed/${video.split('v=')[1]?.split('&')[0] || video.split('/').pop()}?mute=1&autoplay=0`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
};

export default ServiceDetail;
