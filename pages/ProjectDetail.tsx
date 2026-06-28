import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Share2, MapPin, 
  Layout, Sparkles, Maximize, Calendar, 
  CheckCircle2, MessageCircle, ArrowRight, Home,
  Repeat, Palette, Hammer, Lightbulb, ExternalLink,
  Download, Instagram, Facebook
} from 'lucide-react';
import { useProject, useProjects } from '../hooks/useProjects';
import MediaRenderer from '../components/ui/MediaRenderer';
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider';
import { getOptimizedImageUrl } from '../utils/performance';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Section from '../components/Section';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, loading } = useProject(id);
  const { incrementViewCount } = useProjects();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (project?.id) {
      incrementViewCount(project.id);
    }
  }, [project?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl font-serif mb-4">Project Not Found</h2>
        <button onClick={() => navigate('/projects')} className="text-luxury-gold flex items-center gap-2">
          <ChevronLeft size={20} /> Back to Projects
        </button>
      </div>
    );
  }

  const gallery = project.gallery && project.gallery.length > 0 
    ? project.gallery 
    : [project.image];

  const handlePrev = () => setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  const handleNext = () => setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));

  const stats = [
    { icon: <Layout size={20} />, label: 'Category', value: project.category },
    { icon: <Sparkles size={20} />, label: 'Type', value: project.type || 'Residential' },
    { icon: <Maximize size={20} />, label: 'Area', value: project.area || 'N/A' },
    { icon: <Calendar size={20} />, label: 'Completed', value: project.year || project.completionDate || '2024' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      <SEO 
        title={project.seoTitle || project.title}
        description={project.metaDescription || project.description}
        image={project.ogImage || project.image}
      />

      {/* Hero Banner Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <img 
            src={getOptimizedImageUrl(project.heroImage || project.image, 1920)} 
            alt={project.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-4xl"
            >
                <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="px-4 py-1.5 bg-luxury-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest">{project.category}</span>
                    {project.luxuryBadge && <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-luxury-gold border border-luxury-gold/30 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Sparkles size={10} /> Luxury Edition</span>}
                </div>
                <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tighter leading-none">{project.title}</h1>
                <div className="flex items-center justify-center gap-2 text-luxury-gold/80 font-bold uppercase tracking-[0.2em] text-xs">
                    <MapPin size={16} /> <span>{project.city || project.location}</span>
                </div>
            </motion.div>
        </div>
      </div>

      {/* Navigation Breadcrumbs */}
      <div className="container-premium py-12">
        <Breadcrumbs customLabels={id ? { [id]: project.title } : undefined} />
      </div>

      <div className="container-premium grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Visual Storytelling */}
        <div className="lg:col-span-8 space-y-20">
          
          {/* Main Gallery Slider */}
          <div className="space-y-6">
            <div className="relative aspect-video md:aspect-[16/10] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group bg-neutral-900">
                <AnimatePresence mode="wait">
                <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full"
                >
                    <MediaRenderer 
                    src={gallery[activeImageIndex]} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                    width={1200}
                    />
                </motion.div>
                </AnimatePresence>

                <div className="absolute inset-y-0 left-0 flex items-center pl-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handlePrev} className="p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-luxury-gold hover:text-black transition-all"><ChevronLeft size={28} /></button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleNext} className="p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-luxury-gold hover:text-black transition-all"><ChevronRight size={28} /></button>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold tracking-[0.3em] uppercase">
                Perspective {activeImageIndex + 1} / {gallery.length}
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {gallery.map((url, idx) => (
                <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative shrink-0 w-32 md:w-48 aspect-video rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                    activeImageIndex === idx ? 'border-luxury-gold scale-105 shadow-glow-gold' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                >
                    <img src={getOptimizedImageUrl(url, 300)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
                ))}
            </div>
          </div>

          {/* Before/After Transformation */}
          {project.beforeImages?.[0] && project.afterImages?.[0] && (
              <div className="space-y-12 py-12 border-t border-white/5">
                <div className="flex items-center gap-4">
                    <Repeat className="text-luxury-gold" />
                    <h2 className="text-3xl font-serif font-bold italic">The Transformation</h2>
                </div>
                <BeforeAfterSlider 
                    before={project.beforeImages[0]} 
                    after={project.afterImages[0]} 
                />
              </div>
          )}

          {/* Detailed Narrative */}
          <div className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                      <h3 className="text-xl font-serif font-bold text-luxury-gold uppercase tracking-widest">Client Vision</h3>
                      <p className="text-gray-400 leading-relaxed text-lg font-light">{project.problem || project.description}</p>
                  </div>
                  <div className="space-y-6">
                      <h3 className="text-xl font-serif font-bold text-luxury-gold uppercase tracking-widest">Design Solution</h3>
                      <p className="text-gray-400 leading-relaxed text-lg font-light">{project.designGoal || project.finalOutcome}</p>
                  </div>
              </div>

              {project.materialSelection && (
                  <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
                      <h3 className="text-xl font-serif font-bold mb-6 text-white flex items-center gap-3"><Hammer className="text-luxury-gold" /> Material Selection</h3>
                      <p className="text-gray-400 leading-relaxed italic">{project.materialSelection}</p>
                  </div>
              )}
          </div>
        </div>

        {/* Right Column: Project DNA */}
        <div className="lg:col-span-4 space-y-12">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center group hover:bg-luxury-gold/5 hover:border-luxury-gold/30 transition-all duration-500">
                <div className="text-luxury-gold mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <span className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-black mb-2">{stat.label}</span>
                <span className="text-sm font-bold tracking-tight">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Style DNA */}
          <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 space-y-10">
              <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">Style DNA</h4>
                  <div className="flex flex-wrap gap-2">
                      {(project.style || ['Modern Luxury']).map((s, i) => (
                          <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">{s}</span>
                      ))}
                  </div>
              </div>

              <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">Materials Used</h4>
                  <div className="flex flex-wrap gap-2">
                      {(project.materialsUsed || []).map((m, i) => (
                          <span key={i} className="px-4 py-2 bg-luxury-gold/10 text-luxury-gold rounded-xl text-xs font-bold border border-luxury-gold/20">{m}</span>
                      ))}
                  </div>
              </div>

              <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">Lighting Design</h4>
                  <div className="flex flex-wrap gap-2">
                      {(project.lightingType || []).map((l, i) => (
                          <span key={i} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl text-xs font-bold border border-blue-500/20">{l}</span>
                      ))}
                  </div>
              </div>
          </div>

          {/* Key Features Checkbox */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="space-y-8 p-10 bg-luxury-obsidian rounded-[2.5rem] border border-white/5 shadow-3xl">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-3">Signature Features</h3>
              <div className="space-y-5">
                {project.keyFeatures.map((feature, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex items-start gap-4"
                   >
                    <CheckCircle2 size={20} className="text-luxury-gold shrink-0 mt-0.5" />
                    <span className="text-gray-300 font-medium text-sm leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Social & Sharing */}
          <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Share Concept</span>
              <div className="flex gap-4">
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-luxury-gold hover:text-black transition-all"><Instagram size={18} /></button>
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-luxury-gold hover:text-black transition-all"><Facebook size={18} /></button>
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-luxury-gold hover:text-black transition-all"><Share2 size={18} /></button>
              </div>
          </div>
        </div>
      </div>

      {/* Dynamic CTA Section */}
      <div className="container-premium py-32">
          <div className="relative bg-luxury-gold p-12 md:p-24 rounded-[4rem] overflow-hidden text-black text-center shadow-glow-gold">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -mr-48 -mt-48 blur-3xl" />
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                  <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-none">Inspired by {project.title}?</h2>
                  <p className="text-xl font-medium opacity-80">Let's craft your unique space with the same level of architectural excellence and meticulous attention to detail.</p>
                  <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                      <Link 
                        to="/contact"
                        state={{ 
                          projectContext: { 
                            id: project.id, 
                            title: project.title,
                            category: project.category,
                            city: project.city
                          } 
                        }}
                        className="px-12 py-6 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl"
                      >
                        {project.ctaText || 'Launch Consultation'}
                      </Link>
                      <a href={`https://wa.me/919967044479?text=I'm interested in the ${project.title} project showcase.`} className="px-12 py-6 bg-white/20 backdrop-blur-md border border-black/10 text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/30 transition-all flex items-center justify-center gap-3">
                         <MessageCircle size={20} /> WhatsApp Expert
                      </a>
                  </div>
              </div>
          </div>
      </div>

      {/* Fixed Luxury Interaction Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] p-6 hidden md:block">
        <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-3xl border border-white/10 p-4 rounded-[2rem] shadow-3xl flex items-center justify-between px-10">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-luxury-gold/30">
                <img src={getOptimizedImageUrl(project.image, 1920)} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Currently Viewing</p>
              <p className="text-sm font-medium text-white">{project.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <Link 
              to="/contact"
              state={{ 
                projectContext: { 
                  id: project.id, 
                  title: project.title,
                  category: project.category,
                  city: project.city
                } 
              }}
              className="px-8 py-3 bg-luxury-gold text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-glow-gold"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
