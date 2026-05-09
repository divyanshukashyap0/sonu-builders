import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, ChevronDown, CheckCircle,
  MapPin, Phone, Mail, Instagram, ArrowLeft, ArrowRight as ArrowRightIcon,
  Sofa, ChefHat, Bed, AlignVerticalSpaceAround, Tv, Bath, Trees, Hexagon, Grid, Laptop, Building2, Users, Award, ShieldCheck,
  Coffee, Box, Lightbulb, Droplets, Layout, Utensils, BookOpen, PenTool, Home as HomeIcon
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
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

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
    }, 5000);
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

  return (
    <div className="bg-[#111] text-white min-h-screen font-sans">
      <SEO
        title="Home"
        description="Sonu Enterprises - Where Luxury Meets Your Vision. Expert interior design and construction services."
        canonical="https://sonu-builders.in/"
        schema={organizationSchema}
      />

      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] md:h-screen flex flex-col md:flex-row items-start md:items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#111]">
          <AnimatePresence>
            <motion.img
              key={heroIndex}
              src={heroImages[heroIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          </AnimatePresence>
          {/* Opaque dark overlay to prevent ghosting while maintaining contrast */}
          <div className="absolute inset-0 bg-black/40 z-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent z-30" />
        </div>

        <div className="relative z-40 max-w-7xl mx-auto px-6 w-full pt-32 md:pt-20 pb-12 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <p className="text-gray-300 text-xs tracking-[0.2em] uppercase font-bold mb-4">Premium Interior Solutions</p>
            <h1 className="text-4xl md:text-7xl font-serif text-white leading-tight mb-4 min-h-[1.2em]">
              We Design Spaces <br />
              <span className="text-[#c5a059]">You'll Love To Live In</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-xl leading-relaxed">
              Transforming dream spaces into<br />timeless luxury interiors.
            </p>
            <div className="flex flex-col gap-4 w-fit">
              <Link to="/projects" className="bg-[#c5a059] text-black px-8 py-3 rounded text-sm font-bold flex items-center justify-center hover:bg-[#b08d4a] transition-all hover:scale-105">
                View Projects <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link to="/contact" className="border border-gray-500 text-white px-8 py-3 rounded text-sm font-bold flex items-center justify-center hover:border-[#c5a059] hover:text-[#c5a059] transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-6 z-10 flex flex-col items-center gap-4 hidden md:flex">
          <div className="w-[1px] h-12 bg-[#c5a059]" />
          <span className="text-xs text-gray-400 uppercase tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Scroll Down</span>
        </div>

        {/* Stats Bar */}
        <div className="relative md:absolute md:bottom-10 left-0 right-0 md:left-auto md:right-0 mx-6 md:mx-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/5 rounded-xl md:rounded-l-xl md:rounded-r-none p-6 md:p-8 grid grid-cols-2 gap-4 md:flex md:items-center md:gap-12 mt-6 md:mt-0">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <div className="text-[#c5a059]"><Building2 className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} /></div>
            <div>
              <h4 className="text-white font-bold text-lg md:text-xl">4500+</h4>
              <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">Projects Completed</p>
            </div>
          </div>
          <div className="hidden md:block w-[1px] h-10 bg-white/10" />
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <div className="text-[#c5a059]"><Users className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} /></div>
            <div>
              <h4 className="text-white font-bold text-lg md:text-xl">4000+</h4>
              <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">Happy Families</p>
            </div>
          </div>
          <div className="hidden md:block w-[1px] h-10 bg-white/10" />
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <div className="text-[#c5a059]"><Award className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} /></div>
            <div>
              <h4 className="text-white font-bold text-lg md:text-xl">15+</h4>
              <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">Years Experience</p>
            </div>
          </div>
          <div className="hidden md:block w-[1px] h-10 bg-white/10" />
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <div className="text-[#c5a059]"><ShieldCheck className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} /></div>
            <div>
              <h4 className="text-white font-bold text-lg md:text-xl">Premium</h4>
              <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">Quality Assurance</p>
            </div>
          </div>
        </div>

      </section>

      {/* 2. Our Services */}
      <section className="py-24 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center md:text-left">
          <p className="text-[#c5a059] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">WHAT WE DO</p>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Our Services</h2>
          <p className="text-gray-400 text-sm">Complete interior solutions for your home & office</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-2 md:gap-4 px-6 max-w-7xl mx-auto">
          {servicesLoading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-sm" />
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
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className={`relative overflow-hidden border border-white/5 rounded-sm hover:border-[#c5a059]/50 transition-all group cursor-pointer text-center aspect-square md:aspect-auto md:min-h-[160px] ${service.symbolUrl ? '' : 'flex flex-col items-center justify-center p-3 md:p-6 bg-[#161616] hover:bg-[#1a1a1a]'}`}
                >
                  {service.symbolUrl ? (
                    <>
                      {/* Full-bleed background image */}
                      <img
                        src={service.symbolUrl.replace('/upload/', '/upload/f_auto,q_auto,w_400/')}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={service.title}
                      />
                      {/* Gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
                      {/* Title pinned to bottom */}
                      <span
                        className="absolute bottom-0 left-0 right-0 p-2 md:p-3 text-[#e8d5a3] text-[10px] md:text-sm leading-tight text-center drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 1000, letterSpacing: '0.12em' }}
                      >
                        {service.title}
                      </span>
                    </>
                  ) : (
                    <>
                      <IconComponent className="w-6 h-6 md:w-10 md:h-10 text-[#c5a059] mb-2 md:mb-4 group-hover:scale-110 transition-transform" strokeWidth={1} />
                      <span
                        className="text-[#c5a059] text-xs md:text-sm leading-tight"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontStyle: 'italic',
                          fontWeight: 1000,
                          letterSpacing: '0.1em',
                          textShadow: 'rgba(197, 160, 89, 0.25) 10px 12px 20px'
                        }}
                      >
                        {service.title}
                      </span>
                    </>
                  )}
                </Link>
              );
            })
          )}
        </div>
        <div className="text-center mt-8">
          <Link to="/services" className="inline-flex items-center border border-white/10 text-gray-300 px-6 py-3 rounded-sm text-xs uppercase tracking-widest hover:border-[#c5a059] hover:text-[#c5a059] transition-colors font-bold">
            Explore All Services <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </div>
      </section>

      {/* 3. Featured Projects */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="mb-6 md:mb-0">
            <p className="text-[#c5a059] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">OUR WORKS</p>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Featured Projects</h2>
            <p className="text-gray-400 text-sm">Crafting beautiful spaces that speak for themselves</p>
          </div>
          <Link to="/projects" className="border border-white/10 text-gray-300 px-6 py-3 rounded-sm text-xs uppercase tracking-widest hover:border-[#c5a059] hover:text-[#c5a059] transition-colors flex items-center font-bold">
            View All Projects <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </div>
        <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 mb-12 px-6 max-w-4xl mx-auto no-scrollbar scroll-smooth">
          {projectCategories.map((tab, i) => {
            const isActive = activeProjectCategory === tab;
            return (
              <button
                key={i}
                onClick={() => setActiveProjectCategory(tab)}
                className={`shrink-0 px-6 py-2 text-[10px] md:text-xs uppercase tracking-widest border rounded-sm flex items-center transition-all duration-300 ${isActive ? 'bg-[#c5a059] text-black border-[#c5a059] font-bold' : 'border-white/10 text-gray-400 hover:border-[#c5a059] hover:text-[#c5a059]'}`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-4 px-6 max-w-7xl mx-auto space-y-2 md:space-y-4">
          {filteredProjects.slice(0, 8).map((project, i) => (
            <Link
              key={i}
              to={`/projects/${project.id}`}
              className="block group relative overflow-hidden rounded-sm border border-white/5 hover:border-[#c5a059]/50 transition-all duration-500 break-inside-avoid shadow-lg"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-serif text-sm mb-1">{project.title}</h3>
                <p className="text-gray-400 text-[10px] mb-2">{project.location}</p>
                <div className="flex justify-between items-center border-t border-white/10 pt-2">
                  <span className="text-theme-accent text-[8px] uppercase tracking-wider">{project.category}</span>
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Desktop Always Visible Info (Partial) */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/40 backdrop-blur-sm md:group-hover:opacity-0 transition-opacity">
                <h3 className="text-white font-serif text-xs truncate">{project.title}</h3>
                <p className="text-[#c5a059] text-[8px] uppercase tracking-tighter">{project.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Our Seamless Process */}
      <section className="py-24 bg-[#111] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <p className="text-[#c5a059] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">OUR PROCESS</p>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Our Seamless Process</h2>
          <p className="text-gray-400 text-sm">From concept to creation, we follow a transparent<br />and systematic approach.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute top-8 left-10 right-10 h-[1px] bg-white/10 hidden md:block" />
          <div className="absolute top-0 bottom-0 left-[48px] w-[1px] bg-white/10 md:hidden" />
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative flex flex-row md:flex-col items-center md:items-center text-left md:text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full border border-[#c5a059] bg-[#111] flex items-center justify-center text-[#c5a059] font-serif text-lg md:text-xl mb-0 md:mb-6 mr-6 md:mr-0 z-10">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1 md:mb-2">{step.title}</h4>
                  <p className="text-gray-400 text-[11px] md:whitespace-pre-line">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Design Gallery */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <p className="text-[#c5a059] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">DESIGN INSPIRATION</p>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Design Gallery</h2>
          <p className="text-gray-400 text-sm">Explore our wide range of interior designs & inspirations</p>
        </div>
        <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 mb-12 px-6 max-w-4xl mx-auto no-scrollbar scroll-smooth">
          {['All', 'Living Room', 'Kitchen', 'Bathroom', 'TV Unit', 'Wardrobe', 'Balcony', 'More'].map((tab, i) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={i}
                onClick={() => setActiveCategory(tab)}
                className={`shrink-0 px-6 py-2 text-[10px] md:text-xs uppercase tracking-widest border rounded-sm flex items-center transition-all duration-300 ${isActive ? 'bg-[#c5a059] text-black border-[#c5a059] font-bold' : 'border-white/10 text-gray-400 hover:border-[#c5a059] hover:text-[#c5a059]'}`}
              >
                {tab} {tab === 'More' && <ChevronDown className="w-3 h-3 ml-1" />}
              </button>
            );
          })}
        </div>
        <div className="columns-2 md:columns-3 gap-2 md:gap-4 px-6 max-w-7xl mx-auto space-y-2 md:space-y-4">
          {inspirationsLoading || servicesLoading || projectsLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-32 md:h-64 bg-white/5 animate-pulse rounded-sm break-inside-avoid" />
            ))
          ) : (
            filteredMedia.slice(0, 12).map((item, i) => {
              const clickUrl = item.type === 'inspiration'
                ? `/gallery/item/${item.id}`
                : `/gallery/media?url=${encodeURIComponent(item.image)}&title=${encodeURIComponent(item.title)}`;

              return (
                <Link
                  key={i}
                  to={clickUrl}
                  className="block group relative overflow-hidden rounded-sm border border-white/5 hover:border-[#c5a059]/50 transition-all duration-500 break-inside-avoid"
                >
                  <img
                    src={item.image}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                    alt={item.title || "Gallery Item"}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] uppercase tracking-[0.2em] font-bold border border-white/20 px-4 py-2 bg-black/50 backdrop-blur-sm">View Details</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
        <div className="text-center mt-12">
          <Link to="/gallery" className="inline-flex items-center bg-[#c5a059] text-black px-8 py-3 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-[#b08d4a] transition-colors">
            View More Designs <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </div>
      </section>

      {/* 6. Reflections of Excellence (Testimonials) */}
      <section className="py-24 bg-[#111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="text-[#c5a059] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">CLIENTS LOVE US</p>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Reflections of Excellence</h2>
          <p className="text-gray-400 text-sm">Words from our happy clients.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <TestimonialCarousel />
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="py-24 bg-[#111] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-gray-400 text-lg">
              Let's create something beautiful together.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact" className="bg-[#c5a059] text-black px-8 py-4 rounded-sm text-sm uppercase tracking-widest font-bold hover:bg-[#b08d4a] transition-colors text-center">
              Book Consultation
            </Link>
            <a
              href={`https://wa.me/${phone?.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-white px-8 py-4 rounded-sm text-sm uppercase tracking-widest font-bold hover:border-[#c5a059] hover:text-[#c5a059] transition-colors text-center flex items-center justify-center"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

