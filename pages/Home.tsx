import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronDown,
  Sofa, ChefHat, Bed, AlignVerticalSpaceAround, Tv, Bath, Trees, Hexagon, Grid, Laptop,
  Box, Lightbulb, Droplets, Layout, Utensils, Home as HomeIcon, Building2, Users, Award, ShieldCheck
} from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import { useProjects } from '../hooks/useProjects';
import { useServices } from '../hooks/useServices';
import { useImages } from '../hooks/useImages';
import { useTestimonials } from '../hooks/useTestimonials';
import { useDesignInspirations } from '../hooks/useDesignInspirations';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SEO, { organizationSchema } from '../components/SEO';
import TestimonialCarousel from '../components/luxury/TestimonialCarousel';
import CinematicHero from '../components/luxury/CinematicHero';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import ProjectCard3D from '../components/luxury/ProjectCard3D';
import CinematicText from '../components/luxury/CinematicText';

const serviceIcons = [
  { name: 'Living Room\nDesign', icon: Sofa },
  { name: 'Modular\nKitchen', icon: ChefHat },
  { name: 'Bedroom\nDesign', icon: Bed },
  { name: 'Wardrobe\nDesign', icon: AlignVerticalSpaceAround },
  { name: 'TV Unit\nDesign', icon: Tv },
  { name: 'Bathroom\nDesign', icon: Bath },
  { name: 'Balcony\nDesign', icon: Trees },
  { name: 'Pooja Room\nDesign', icon: Hexagon },
  { name: 'Flooring\nDesign', icon: Grid },
  { name: 'Home Office\nDesign', icon: Laptop },
];

const processSteps = [
  { num: '01', title: 'Design Consultation', desc: 'Understanding your needs\nand lifestyle' },
  { num: '02', title: 'Space Planning', desc: 'Optimizing every inch for\nfunctionality & aesthetics' },
  { num: '03', title: 'Material Selection', desc: 'Choosing premium materials\nand finishes' },
  { num: '04', title: 'Execution', desc: 'Expert craftsmanship\nwith attention to detail' },
  { num: '05', title: 'Quality Check', desc: 'Ensuring perfection in\nevery element' },
  { num: '06', title: 'Handover', desc: 'Delivering your dream\nspace on time' },
];

const Home: React.FC = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { images } = useImages();
  const { name, phone } = useCompanyData();
  const { services, loading: servicesLoading } = useServices();
  const { inspirations, loading: inspirationsLoading } = useDesignInspirations();
  const { settings } = useSiteSettings();
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [activeProjectCategory, setActiveProjectCategory] = React.useState('All');
  const [heroIndex, setHeroIndex] = React.useState(0);

  const heroImages = React.useMemo(() => {
    if (settings?.heroSlideshow && settings.heroSlideshow.length > 0) {
      return settings.heroSlideshow;
    }
    return [
      images.homeHero || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000",
      "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=2000"
    ];
  }, [settings, images.homeHero]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000); // Changed from 5000 to 60000 (1 minute)
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const whatsappMessage = encodeURIComponent("Hi Sonu Enterprises, I'm interested in your interior design services. Please contact me.");

  const allMedia = React.useMemo(() => {
    const items = [
      ...inspirations.map(item => ({
        id: item.id,
        image: item.image,
        category: item.category,
        title: item.title,
        type: 'inspiration'
      })),
      ...services.flatMap(s => (s.gallery || []).map((url, idx) => ({
        id: `service-${s.id}-${idx}`,
        image: url,
        category: s.title,
        title: s.title,
        type: 'service-media'
      }))),
      ...projects.flatMap(p => [
        {
          id: `project-main-${p.id}`,
          image: p.image,
          category: p.category || 'Project',
          title: p.title,
          type: 'project-media'
        },
        ...(p.gallery || []).map((url, idx) => ({
          id: `project-gal-${p.id}-${idx}`,
          image: url,
          category: p.category || 'Project',
          title: p.title,
          type: 'project-media'
        }))
      ])
    ];
    return items.filter((item, index, self) =>
      index === self.findIndex((t) => t.image === item.image)
    );
  }, [inspirations, services, projects]);

  const filteredMedia = allMedia.filter(item => {
    if (activeCategory === 'All') return true;
    const cat = item.category.toLowerCase();
    const active = activeCategory.toLowerCase();

    // Flexible mapping
    if (active === 'kitchen' && cat.includes('kitchen')) return true;
    if (active === 'living room' && cat.includes('living')) return true;
    if (active === 'bathroom' && cat.includes('bath')) return true;
    if (active === 'tv unit' && cat.includes('tv')) return true;
    if (active === 'wardrobe' && cat.includes('wardrobe')) return true;
    if (active === 'balcony' && cat.includes('balcony')) return true;

    if (active === 'more') {
      const known = ['living', 'kitchen', 'bath', 'tv', 'wardrobe', 'balcony'];
      return !known.some(k => cat.includes(k));
    }

    return cat.includes(active);
  });

  const projectCategories = ['All', 'Luxury', 'Residential', 'Commercial', 'Ongoing'];

  const filteredProjects = projects.filter(project => {
    if (activeProjectCategory === 'All') return true;
    const cat = project.category?.toLowerCase() || '';
    const active = activeProjectCategory.toLowerCase();

    if (active === 'luxury' && cat.includes('luxury')) return true;
    if (active === 'residential' && cat.includes('residential')) return true;
    if (active === 'commercial' && cat.includes('commercial')) return true;
    if (active === 'ongoing' && cat.includes('ongoing')) return true;
    if (active === 'traditional' && cat.includes('traditional')) return true;

    return cat.includes(active);
  });

  // ── Shared animation variants ──────────────────────────────────────────────
  const fadeUp = {
    hidden: { opacity: 0, y: 48 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } }
  };
  const stagger = { show: { transition: { staggerChildren: 0.1 } } };
  const cardHover = { scale: 1.03, y: -6, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } };

  // ── Section label component ─────────────────────────────────────────────────
  const SectionLabel = ({ children }: { children: string }) => (
    <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3 flex items-center gap-3"
      style={{ color: '#c5a059' }}>
      <span className="w-6 h-[1px] inline-block" style={{ background: 'linear-gradient(90deg,#c5a059,transparent)' }} />
      {children}
    </p>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight text-glow-gold"
      style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", letterSpacing: '-0.02em' }}
    >
      {children}
    </h2>
  );

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans overflow-x-hidden">
      <SEO
        title="Home"
        description="Sonu Enterprises - Where Luxury Meets Your Vision. Expert interior design and construction services."
        canonical="https://sonu-builders.in/"
        schema={organizationSchema}
      />

      {/* 1. Hero Section — Ultra-Cinematic 3D Luxury */}
      <CinematicHero
        heroImages={heroImages}
        heroIndex={heroIndex}
        phone={phone}
      />

      {/* 2. Our Services — Cinematic 3D */}
      <motion.section
        data-cinematic-section
        className="relative py-28 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#080808 0%,#0d0d0d 100%)' }}
      >
        {/* Ambient orb */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.07) 0%,transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.05) 0%,transparent 70%)', filter: 'blur(80px)' }} />

        <motion.div className="max-w-7xl mx-auto px-6 mb-14"
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel>What We Do</SectionLabel>
            <SectionTitle>Our <span style={{
                  color: '#c5a059',
                }}>Services</span></SectionTitle>
            <p className="text-gray-500 text-sm tracking-wide">Complete interior solutions for your home & office</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3 px-6 max-w-7xl mx-auto"
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
        >
          {servicesLoading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-sm" style={{ background:'rgba(197,160,89,0.04)' }} />
            ))
          ) : (
            services.map((service, i) => {
              const getSmartIcon = (s: any) => {
                const title = s.title.toLowerCase();
                if (title.includes('living')) return Sofa;
                if (title.includes('kitchen')) return ChefHat;
                if (title.includes('bedroom')) return Bed;
                if (title.includes('wardrobe') || title.includes('storage')) return Box;
                if (title.includes('tv')) return Tv;
                if (title.includes('bath')) return Droplets;
                if (title.includes('balcony')) return Trees;
                if (title.includes('pooja') || title.includes('temple')) return Hexagon;
                if (title.includes('dining')) return Utensils;
                if (title.includes('study') || title.includes('office')) return Laptop;
                if (title.includes('ceiling')) return Lightbulb;
                if (title.includes('full home')) return Layout;
                if (title.includes('flooring')) return Grid;
                return (Icons as any)[s.icon] || HomeIcon;
              };
              const IconComponent = getSmartIcon(service);
              return (
                <motion.div key={service.id} variants={fadeUp}>
                  <Link
                    to={`/services/${service.id}`}
                    className={`relative overflow-hidden rounded-sm group cursor-pointer text-center block aspect-square md:aspect-auto md:min-h-[160px] ${service.symbolUrl ? '' : 'flex flex-col items-center justify-center p-3 md:p-6'}`}
                    style={{ border:'1px solid rgba(197,160,89,0.1)', background: service.symbolUrl ? undefined : 'rgba(197,160,89,0.03)', transition:'all 0.4s ease' }}
                  >
                    {/* Gold shimmer on hover */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background:'linear-gradient(135deg,rgba(197,160,89,0.08),transparent)', boxShadow:'inset 0 0 30px rgba(197,160,89,0.06)' }} />
                    {service.symbolUrl ? (
                      <>
                        <img src={service.symbolUrl.replace('/upload/','/upload/f_auto,q_auto,w_400/')}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={service.title} />
                        <div className="absolute inset-0 transition-all duration-500"
                          style={{ background:'linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.1) 60%,transparent 100%)' }} />
                        <span className="absolute bottom-0 left-0 right-0 p-2 md:p-3 text-[10px] md:text-sm leading-tight text-center"
                          style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontWeight:700, letterSpacing:'0.12em', color:'#e8d5a3' }}>
                          {service.title}
                        </span>
                      </>
                    ) : (
                      <>
                        <IconComponent className="w-6 h-6 md:w-10 md:h-10 mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1} style={{ color:'#c5a059' }} />
                        <span className="text-xs md:text-sm leading-tight"
                          style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontWeight:700, letterSpacing:'0.1em', color:'#c5a059' }}>
                          {service.title}
                        </span>
                      </>
                    )}
                  </Link>
                </motion.div>
              );
            })
          )}
        </motion.div>

        <motion.div className="text-center mt-10" initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.3, duration:0.7 }}>
          <Link to="/services" className="group inline-flex items-center gap-3 px-8 py-3 text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300"
            style={{ border:'1px solid rgba(197,160,89,0.3)', color:'#c5a059', borderRadius:'2px', backdropFilter:'blur(8px)' }}>
            Explore All Services <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.section>


      {/* 3. Featured Projects — Cinematic Masonry */}
      <motion.section data-cinematic-section className="relative py-28 overflow-hidden" style={{ background:'#060606' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(197,160,89,0.06) 0%,transparent 70%)', filter:'blur(80px)' }} />

        <div className="max-w-7xl mx-auto px-6 mb-14">
          <motion.div className="flex flex-col md:flex-row justify-between items-end"
            initial="hidden" whileInView="show" viewport={{ once:true, amount:0.2 }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-6 md:mb-0">
              <SectionLabel>Our Works</SectionLabel>
              <SectionTitle>Featured <span style={{ background:'linear-gradient(135deg,#c5a059,#e8d5a3)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Projects</span></SectionTitle>
              <p className="text-gray-500 text-sm">Crafting beautiful spaces that speak for themselves</p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link to="/projects" className="group inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                style={{ border:'1px solid rgba(197,160,89,0.25)', color:'#c5a059', borderRadius:'2px' }}>
                View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Category filter pills */}
        <motion.div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 mb-12 px-6 max-w-4xl mx-auto no-scrollbar"
          initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
          {projectCategories.map((tab, i) => {
            const isActive = activeProjectCategory === tab;
            return (
              <motion.button key={i} onClick={() => setActiveProjectCategory(tab)}
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                className="shrink-0 px-6 py-2 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all duration-300"
                style={{
                  border: isActive ? '1px solid #c5a059' : '1px solid rgba(255,255,255,0.07)',
                  background: isActive ? 'linear-gradient(135deg,#c5a059,#b08d42)' : 'rgba(197,160,89,0.03)',
                  color: isActive ? '#000' : 'rgba(197,160,89,0.6)',
                  borderRadius: '2px',
                }}>
                {tab}
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeProjectCategory}
            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 px-6 max-w-7xl mx-auto space-y-3 md:space-y-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {filteredProjects.slice(0, 8).map((project, i) => (
              <ProjectCard3D
                key={project.id}
                id={project.id}
                title={project.title}
                image={project.image}
                category={project.category}
                location={project.location}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* 4. Process — Cinematic Timeline */}
      <motion.section data-cinematic-section className="relative py-28 overflow-hidden" style={{ background:'linear-gradient(180deg,#0a0a0a,#0d0d0d)' }}>
        {/* Decorative vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] hidden md:block pointer-events-none"
          style={{ background:'linear-gradient(to bottom,transparent,rgba(197,160,89,0.08),transparent)' }} />
        <div className="absolute -right-32 top-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(197,160,89,0.04) 0%,transparent 70%)', filter:'blur(80px)' }} />

        <motion.div className="max-w-7xl mx-auto px-6 text-center mb-20"
          initial="hidden" whileInView="show" viewport={{ once:true, amount:0.2 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel>Our Process</SectionLabel>
            <SectionTitle>Our Seamless <span style={{ background:'linear-gradient(135deg,#c5a059,#e8d5a3)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Process</span></SectionTitle>
            <p className="text-gray-500 text-sm">From concept to creation — transparent & systematic.</p>
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Horizontal connector desktop */}
          <div className="absolute top-10 left-12 right-12 h-[1px] hidden md:block pointer-events-none"
            style={{ background:'linear-gradient(90deg,transparent,rgba(197,160,89,0.2),transparent)' }} />
          {/* Vertical connector mobile */}
          <div className="absolute top-0 bottom-0 left-[44px] w-[1px] md:hidden pointer-events-none"
            style={{ background:'linear-gradient(to bottom,transparent,rgba(197,160,89,0.2),transparent)' }} />

          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
            {processSteps.map((step, idx) => (
              <motion.div key={idx}
                className="relative flex flex-row md:flex-col items-center md:items-center text-left md:text-center"
                initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, amount:0.3 }}
                transition={{ delay: idx * 0.12, duration:0.7, ease:[0.22,1,0.36,1] }}>
                {/* Step circle */}
                <motion.div
                  className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex items-center justify-center text-lg md:text-xl mb-0 md:mb-6 mr-6 md:mr-0 z-10 relative"
                  style={{ border:'1px solid rgba(197,160,89,0.5)', background:'rgba(197,160,89,0.06)', color:'#c5a059', fontFamily:"'Cormorant Garamond',serif", fontWeight:700 }}
                  whileHover={{ scale:1.1, boxShadow:'0 0 20px rgba(197,160,89,0.3)' }}>
                  <span className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{ background:'radial-gradient(circle,rgba(197,160,89,0.15),transparent)' }} />
                  {step.num}
                </motion.div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1 md:mb-2">{step.title}</h4>
                  <p className="text-gray-500 text-[11px] md:whitespace-pre-line leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 5. Design Gallery — Cinematic */}
      <motion.section data-cinematic-section className="relative py-28 overflow-hidden" style={{ background:'#060606' }}>
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(197,160,89,0.05) 0%,transparent 70%)', filter:'blur(80px)' }} />

        <motion.div className="max-w-7xl mx-auto px-6 text-center mb-14"
          initial="hidden" whileInView="show" viewport={{ once:true, amount:0.2 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel>Design Inspiration</SectionLabel>
            <SectionTitle>Design <span style={{ background:'linear-gradient(135deg,#c5a059,#e8d5a3)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Gallery</span></SectionTitle>
            <p className="text-gray-500 text-sm">Explore our wide range of interior designs & inspirations</p>
          </motion.div>
        </motion.div>

        <motion.div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 mb-10 px-6 max-w-4xl mx-auto no-scrollbar"
          initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
          {['All', 'Living Room', 'Kitchen', 'Bathroom', 'TV Unit', 'Wardrobe', 'Balcony', 'More'].map((tab, i) => {
            const isActive = activeCategory === tab;
            return (
              <motion.button key={i} onClick={() => setActiveCategory(tab)}
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                className="shrink-0 px-5 py-2 text-[10px] md:text-xs uppercase tracking-widest font-bold flex items-center transition-all duration-300"
                style={{
                  border: isActive ? '1px solid #c5a059' : '1px solid rgba(255,255,255,0.07)',
                  background: isActive ? 'linear-gradient(135deg,#c5a059,#b08d42)' : 'rgba(197,160,89,0.03)',
                  color: isActive ? '#000' : 'rgba(197,160,89,0.6)',
                  borderRadius: '2px',
                }}>
                {tab} {tab === 'More' && <ChevronDown className="w-3 h-3 ml-1" />}
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeCategory}
            className="columns-2 md:columns-3 gap-2 md:gap-3 px-6 max-w-7xl mx-auto space-y-2 md:space-y-3"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}>
            {inspirationsLoading || servicesLoading || projectsLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-32 md:h-64 animate-pulse rounded-sm break-inside-avoid"
                  style={{ background:'rgba(197,160,89,0.04)' }} />
              ))
            ) : (
              filteredMedia.slice(0, 12).map((item, i) => {
                const clickUrl = item.type === 'inspiration'
                  ? `/gallery/item/${item.id}`
                  : `/gallery/media?url=${encodeURIComponent(item.image)}&title=${encodeURIComponent(item.title)}`;
                return (
                  <motion.div key={i} className="break-inside-avoid"
                    initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
                    transition={{ delay: i * 0.05, duration:0.5 }}>
                    <Link to={clickUrl} className="block group relative overflow-hidden rounded-sm"
                      style={{ border:'1px solid rgba(197,160,89,0.08)' }}>
                      <img src={item.image} className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                        alt={item.title || "Gallery Item"} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center"
                        style={{ background:'rgba(0,0,0,0.5)' }}>
                        <span className="text-white text-[9px] uppercase tracking-[0.25em] font-bold px-4 py-2"
                          style={{ border:'1px solid rgba(197,160,89,0.5)', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)' }}>
                          View Details
                        </span>
                      </div>
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ boxShadow:'inset 0 0 0 1px rgba(197,160,89,0.35)' }} />
                    </Link>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div className="text-center mt-12"
          initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.3, duration:0.6 }}>
          <Link to="/gallery" className="group inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-400"
            style={{ background:'linear-gradient(135deg,#c5a059,#b08d42)', color:'#000', borderRadius:'2px', boxShadow:'0 0 30px rgba(197,160,89,0.15)' }}>
            View More Designs <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.section>

      {/* 6. Testimonials — Cinematic */}
      <motion.section data-cinematic-section className="relative py-28 overflow-hidden" style={{ background:'linear-gradient(180deg,#0a0a0a,#080808)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse at 50% 0%,rgba(197,160,89,0.05) 0%,transparent 60%)' }} />
        {/* Decorative quote mark */}
        <div className="absolute top-16 left-8 text-[12rem] leading-none font-serif pointer-events-none select-none hidden md:block"
          style={{ color:'rgba(197,160,89,0.04)', fontFamily:"'Cormorant Garamond',serif" }}>"</div>

        <motion.div className="max-w-7xl mx-auto px-6 text-center mb-16"
          initial="hidden" whileInView="show" viewport={{ once:true, amount:0.2 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel>Clients Love Us</SectionLabel>
            <SectionTitle>Reflections of <span style={{ background:'linear-gradient(135deg,#c5a059,#e8d5a3)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Excellence</span></SectionTitle>
            <p className="text-gray-500 text-sm">Words from our happy clients.</p>
          </motion.div>
        </motion.div>

        <motion.div className="max-w-7xl mx-auto px-6 relative"
          initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
          <TestimonialCarousel />
        </motion.div>
      </motion.section>

      {/* 7. CTA — Cinematic Finale */}
      <motion.section data-cinematic-section className="relative py-32 overflow-hidden" style={{ background:'#040404' }}>
        {/* Full-bleed luxury background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse at 50% 100%,rgba(197,160,89,0.12) 0%,transparent 65%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse at 20% 50%,rgba(197,160,89,0.05) 0%,transparent 55%)' }} />
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background:'linear-gradient(90deg,transparent,rgba(197,160,89,0.3),transparent)' }} />

        <motion.div className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          initial="hidden" whileInView="show" viewport={{ once:true, amount:0.3 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel>Start Your Journey</SectionLabel>
          </motion.div>
          <motion.h2 variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-glow-white"
            style={{ fontFamily:"'Cormorant Garamond','Playfair Display',serif", letterSpacing:'-0.02em' }}>
            <CinematicText text="Ready to Transform" delay={0.1} />
            <br />
            <span style={{ color: '#c5a059', display: 'block' }}>
              <CinematicText text="Your Space?" delay={0.4} />
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Let's create something beautiful together —<br className="hidden md:block" /> architecture that tells your story.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Primary CTA — gold with light streak */}
            <Link to="/contact"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-bold overflow-hidden transition-all duration-300"
              style={{ background:'linear-gradient(135deg,#c5a059,#b08d42)', color:'#000', borderRadius:'2px', boxShadow:'0 0 40px rgba(197,160,89,0.25)' }}>
              {/* Hover brighten */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background:'linear-gradient(135deg,#e8d5a3,#c5a059)' }} />
              {/* Light streak sweep */}
              <span className="light-streak" style={{ animationDelay: '0s' }} />
              <span className="relative z-10 flex items-center gap-3">
                Book Consultation <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            {/* Secondary CTA — shimmer */}
            <a href={`https://wa.me/${phone?.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
              target="_blank" rel="noopener noreferrer"
              className="shimmer-hover group inline-flex items-center justify-center gap-3 px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-bold transition-all duration-300"
              style={{ border:'1px solid rgba(197,160,89,0.35)', color:'#c5a059', borderRadius:'2px', backdropFilter:'blur(12px)', background:'rgba(197,160,89,0.04)' }}>
              <span className="group-hover:text-white transition-colors duration-300">WhatsApp Us</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background:'linear-gradient(90deg,transparent,rgba(197,160,89,0.15),transparent)' }} />
      </motion.section>

    </div>
  );
};

export default Home;
