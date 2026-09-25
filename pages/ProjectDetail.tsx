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
import { COMPANY_PHONE, PROJECTS } from '../constants';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project: hookProject, loading } = useProject(id);
  const { incrementViewCount } = useProjects();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fallbackProject = PROJECTS.find(p => p.id === id || p.slug === id);
  const project = hookProject || fallbackProject;

  useEffect(() => {
    if (project?.id) {
      incrementViewCount(project.id);
    }
  }, [project?.id]);

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-stone-900 p-6">
        <h2 className="text-2xl font-serif mb-4 text-[#171717]">Project Not Found</h2>
        <button onClick={() => navigate('/projects')} className="text-luxury-gold flex items-center gap-2 hover:underline">
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

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": project.title,
    "description": project.description,
    "creator": {
      "@type": "Organization",
      "name": "Sonu Enterprises"
    },
    "artworkSurface": "Interior Design",
    "locationCreated": {
      "@type": "Place",
      "name": project.city || project.location
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-32">
      <SEO 
        title={project.seoTitle || project.title}
        description={project.metaDescription || project.description}
        ogImage={project.ogImage || project.image}
        schema={projectSchema}
      />

      {/* Hero Banner Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <img 
            src={getOptimizedImageUrl(project.heroImage || project.image, 1920)} 
            alt={project.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-4xl"
            >
                <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="px-4 py-1.5 bg-luxury-gold text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">{project.category}</span>
                    {project.luxuryBadge && <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-luxury-gold border border-luxury-gold/40 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Sparkles size={10} /> Luxury Edition</span>}
                </div>
                <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tighter leading-none text-white drop-shadow-md">{project.title}</h1>
                <div className="flex items-center justify-center gap-2 text-luxury-gold font-bold uppercase tracking-[0.2em] text-xs">
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
            <div className="relative aspect-video md:aspect-[16/10] rounded-[2rem] overflow-hidden border border-stone-200 shadow-xl group bg-stone-100">
                <AnimatePresence mode="wait">
                <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full"
                >
                    <MediaRenderer 
                    src={gallery[activeImageIndex]} 
                    alt={`${project.title} - ${project.category} interior designed by Sonu Enterprises in ${project.location}, Mumbai (Perspective ${activeImageIndex + 1})`}
                    className="w-full h-full object-cover"
                    width={1200}
                    />
                </motion.div>
                </AnimatePresence>

                <div className="absolute inset-y-0 left-0 flex items-center pl-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handlePrev} className="p-4 bg-white/80 backdrop-blur-md border border-stone-200 shadow-md rounded-full hover:bg-luxury-gold hover:text-white transition-all text-stone-800"><ChevronLeft size={28} /></button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleNext} className="p-4 bg-white/80 backdrop-blur-md border border-stone-200 shadow-md rounded-full hover:bg-luxury-gold hover:text-white transition-all text-stone-800"><ChevronRight size={28} /></button>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm rounded-full text-xs font-bold tracking-[0.3em] uppercase text-stone-800">
                Perspective {activeImageIndex + 1} / {gallery.length}
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {gallery.map((url, idx) => (
                <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative shrink-0 w-32 md:w-48 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${
                    activeImageIndex === idx ? 'border-luxury-gold scale-105 shadow-md' : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                >
                    <img src={getOptimizedImageUrl(url, 300)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
                ))}
            </div>
          </div>

          {/* Before/After Transformation */}
          {project.beforeImages?.[0] && project.afterImages?.[0] && (
              <div className="space-y-12 py-12 border-t border-stone-200">
                <div className="flex items-center gap-4">
                    <Repeat className="text-luxury-gold" />
                    <h2 className="text-3xl font-serif font-bold italic text-[#171717]">The Transformation</h2>
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
                  <div className="space-y-4">
                      <h3 className="text-sm font-serif font-bold text-luxury-gold uppercase tracking-widest">Client Vision</h3>
                      <p className="text-stone-600 leading-relaxed text-base font-normal">{project.problem || project.description}</p>
                  </div>
                  <div className="space-y-4">
                      <h3 className="text-sm font-serif font-bold text-luxury-gold uppercase tracking-widest">Design Solution</h3>
                      <p className="text-stone-600 leading-relaxed text-base font-normal">{project.designGoal || project.finalOutcome}</p>
                  </div>
              </div>

              {project.materialSelection && (
                  <div className="p-8 bg-white rounded-2xl border border-stone-200 shadow-sm">
                      <h3 className="text-xl font-serif font-bold mb-4 text-stone-900 flex items-center gap-3"><Hammer className="text-luxury-gold" /> Material Selection</h3>
                      <p className="text-stone-600 leading-relaxed italic">{project.materialSelection}</p>
                  </div>
              )}
          </div>
        </div>

        {/* Right Column: Project DNA */}
        <div className="lg:col-span-4 space-y-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white border border-stone-200 shadow-sm p-6 rounded-2xl flex flex-col items-center text-center group hover:border-luxury-gold/40 transition-all duration-300">
                <div className="text-luxury-gold mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-bold mb-1">{stat.label}</span>
                <span className="text-sm font-bold text-stone-900 tracking-tight">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Style DNA */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-8">
              <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-luxury-gold">Style DNA</h4>
                  <div className="flex flex-wrap gap-2">
                      {(project.style || ['Modern Luxury']).map((s, i) => (
                          <span key={i} className="px-3.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800">{s}</span>
                      ))}
                  </div>
              </div>

              <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-luxury-gold">Materials Used</h4>
                  <div className="flex flex-wrap gap-2">
                      {(project.materialsUsed || []).map((m, i) => (
                          <span key={i} className="px-3.5 py-1.5 bg-luxury-gold/10 text-luxury-gold rounded-lg text-xs font-semibold border border-luxury-gold/30">{m}</span>
                      ))}
                  </div>
              </div>

              <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-luxury-gold">Lighting Design</h4>
                  <div className="flex flex-wrap gap-2">
                      {(project.lightingType || []).map((l, i) => (
                          <span key={i} className="px-3.5 py-1.5 bg-amber-500/10 text-amber-700 rounded-lg text-xs font-semibold border border-amber-500/20">{l}</span>
                      ))}
                  </div>
              </div>
          </div>

          {/* Key Features Checkbox */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="space-y-6 p-8 bg-white rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-3">Signature Features</h3>
              <div className="space-y-4">
                {project.keyFeatures.map((feature, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex items-start gap-3"
                   >
                    <CheckCircle2 size={18} className="text-luxury-gold shrink-0 mt-0.5" />
                    <span className="text-stone-700 font-medium text-sm leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Social & Sharing */}
          <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">Share Concept</span>
              <div className="flex gap-3">
                  <button className="p-3 bg-stone-50 border border-stone-200 rounded-xl hover:bg-luxury-gold hover:text-white transition-all text-stone-700"><Instagram size={18} /></button>
                  <button className="p-3 bg-stone-50 border border-stone-200 rounded-xl hover:bg-luxury-gold hover:text-white transition-all text-stone-700"><Facebook size={18} /></button>
                  <button className="p-3 bg-stone-50 border border-stone-200 rounded-xl hover:bg-luxury-gold hover:text-white transition-all text-stone-700"><Share2 size={18} /></button>
              </div>
          </div>
        </div>
      </div>

      {/* Dynamic CTA Section */}
      <div className="container-premium py-32">
          <div className="relative bg-luxury-gold p-12 md:p-24 rounded-[3rem] overflow-hidden text-white text-center shadow-lg">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -mr-48 -mt-48 blur-3xl" />
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                  <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-none">Inspired by {project.title}?</h2>
                  <p className="text-xl font-medium opacity-90">Let's craft your unique space with the same level of architectural excellence and meticulous attention to detail.</p>
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
                        className="px-12 py-5 bg-[#171717] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                      >
                        {project.ctaText || 'Launch Consultation'}
                      </Link>
                       <a href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`I'm interested in the ${project.title} project showcase.`)}`} className="px-12 py-5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white/30 transition-all flex items-center justify-center gap-3">
                         <MessageCircle size={20} /> WhatsApp Expert
                      </a>
                  </div>
              </div>
          </div>
      </div>

      {/* Fixed Luxury Interaction Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] p-6 hidden md:block">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-stone-200 p-4 rounded-2xl shadow-luxury flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-luxury-gold/30">
                <img src={getOptimizedImageUrl(project.image, 100)} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest">Currently Viewing</p>
              <p className="text-sm font-semibold text-stone-900">{project.title}</p>
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
              className="px-8 py-3 bg-luxury-gold text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-md"
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
