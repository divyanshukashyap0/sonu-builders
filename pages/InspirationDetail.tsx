import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    ArrowRight,
    Download, 
    Share2, 
    Heart, 
    Calculator, 
    Calendar, 
    Palette, 
    Compass,
    CheckCircle
} from 'lucide-react';
import PageHero from '../components/luxury/PageHero';
import Section from '../components/Section';
import Button from '../components/Button';
import { useDesignInspirations } from '../hooks/useDesignInspirations';
import SEO from '../components/SEO';
import DesignInspirations from '../components/luxury/DesignInspirations';

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
        try {
            const response = await fetch(inspiration.image);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${inspiration.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            window.open(inspiration.image, '_blank');
        }
    };

    const handleShare = () => {
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 bg-theme-background">
                <div className="w-12 h-12 border-4 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!inspiration) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-theme-background">
                <h2 className="text-2xl font-serif text-theme-text mb-4">Design Not Found</h2>
                <Link to="/gallery" className="text-theme-accent hover:underline">Return to Gallery</Link>
            </div>
        );
    }

    return (
        <div className="bg-theme-background min-h-screen text-theme-text">
            <SEO
                title={`${inspiration.title} - Interior Design Inspiration`}
                description={inspiration.description}
                canonical={window.location.href}
            />

            <PageHero
                title={inspiration.title}
                subtitle={`${inspiration.style} Style Collection`}
                backgroundImage={inspiration.image}
            />

            <Section>
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                    <Link to="/gallery" className="inline-flex items-center text-theme-accent hover:translate-x-[-4px] transition-transform font-bold uppercase tracking-[0.2em] text-[10px]">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Explore Full Gallery
                    </Link>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={handleShare}
                            className="flex items-center gap-2 px-6 py-3 bg-theme-accent/10 border border-theme-accent/20 rounded-sm text-theme-accent text-[10px] font-bold uppercase tracking-widest hover:bg-theme-accent hover:text-white transition-all"
                        >
                            <Share2 size={16} /> Share Design
                        </button>
                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-theme-text/5 border border-theme-border/20 rounded-sm text-theme-text text-[10px] font-bold uppercase tracking-widest hover:bg-theme-text hover:text-white transition-all"
                        >
                            <Download size={16} /> Download Ref
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-theme-border/10">
                            <img 
                                src={inspiration.image} 
                                alt={inspiration.title} 
                                className="w-full h-auto"
                            />
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif font-bold">Design Philosophy</h2>
                            <p className="text-xl text-theme-muted leading-relaxed font-medium">
                                {inspiration.description}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                <div className="flex items-start gap-4 p-6 bg-theme-accent/5 rounded-xl border border-theme-accent/10">
                                    <div className="w-10 h-10 bg-theme-accent/20 rounded-full flex items-center justify-center shrink-0">
                                        <Palette className="w-5 h-5 text-theme-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Theme & Style</h4>
                                        <p className="text-theme-muted text-sm capitalize">{inspiration.style} Modern Luxury</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-theme-accent/5 rounded-xl border border-theme-accent/10">
                                    <div className="w-10 h-10 bg-theme-accent/20 rounded-full flex items-center justify-center shrink-0">
                                        <Compass className="w-5 h-5 text-theme-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Architecture</h4>
                                        <p className="text-theme-muted text-sm capitalize">{inspiration.category.replace('-', ' ')} Design</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-theme-card p-10 rounded-2xl border border-theme-border/20 shadow-2xl sticky top-32">
                            <h3 className="text-2xl font-serif font-bold mb-6">Project Details</h3>
                            
                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center py-4 border-b border-theme-border/10">
                                    <span className="text-theme-muted text-sm font-medium uppercase tracking-widest">Category</span>
                                    <span className="font-bold text-theme-text capitalize">{inspiration.category.replace('-', ' ')}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-theme-border/10">
                                    <span className="text-theme-muted text-sm font-medium uppercase tracking-widest">Style</span>
                                    <span className="font-bold text-theme-text capitalize">{inspiration.style}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-theme-border/10">
                                    <span className="text-theme-muted text-sm font-medium uppercase tracking-widest">Availability</span>
                                    <span className="font-bold text-theme-accent">Bespoke Only</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button 
                                    onClick={() => document.getElementById('design-gallery')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full justify-center py-5 text-lg rounded-sm bg-theme-accent text-white shadow-lg shadow-theme-accent/20"
                                >
                                    Get This Look
                                </Button>
                                <Button 
                                    to={`/contact?subject=${encodeURIComponent(inspiration.title)}&designId=${inspiration.id}`}
                                    variant="outline" 
                                    className="w-full justify-center py-5 text-lg rounded-sm border-theme-border/30"
                                >
                                    Book Consultation
                                </Button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-theme-border/10">
                                <div className="flex items-center gap-4 text-theme-muted text-sm mb-6">
                                    <CheckCircle className="w-4 h-4 text-theme-accent" />
                                    <span>Premium 3D Visualization Available</span>
                                </div>
                                <Link to="/contact" className="inline-flex items-center gap-2 text-theme-accent font-bold uppercase tracking-[0.2em] text-[10px] group">
                                    <Calculator className="w-5 h-5" /> Calculate Custom Estimate <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Design Showcase Gallery */}
            {inspiration.gallery && inspiration.gallery.length > 0 && (
                <div id="design-gallery">
                    <Section colored>
                        <div className="text-center mb-16">
                            <span className="text-theme-accent font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Design Showcase</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold italic">Detailed Perspectives</h2>
                            <p className="text-theme-muted mt-4 max-w-2xl mx-auto">Explore the fine details, textures, and material excellence of this unique interior concept.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {inspiration.gallery.map((img, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-theme-border/10 group bg-theme-card"
                                >
                                    <img 
                                        src={img} 
                                        alt={`${inspiration.title} detail ${idx + 1}`} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </Section>
                </div>
            )}

            {/* Related Designs */}
            <div className="bg-theme-accent/5">
                <Section isSection={true}>
                    <div className="text-center mb-16">
                        <span className="text-theme-accent font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Recommended</span>
                        <h2 className="text-4xl font-serif font-bold">Similar Collections</h2>
                    </div>
                    <DesignInspirations isSection={true} />
                </Section>
            </div>
        </div>
    );
};

export default InspirationDetail;
