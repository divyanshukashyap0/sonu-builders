import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import { useServices } from '../hooks/useServices';
import { useImages } from '../hooks/useImages';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SEO, { organizationSchema } from '../components/SEO';
import TestimonialCarousel from '../components/luxury/TestimonialCarousel';
import CinematicHero, { HeroSlideItem } from '../components/luxury/CinematicHero';
import TrustMetrics from '../components/luxury/TrustMetrics';
import FounderOverview from '../components/luxury/FounderOverview';
import WhyChooseUs from '../components/luxury/WhyChooseUs';
import { SERVICES, REAL_ADMIN_SERVICES } from '../constants';
import { getOptimizedImageUrl } from '../utils/performance';
import { useProjects } from '../hooks/useProjects';
import { useDesignInspirations } from '../hooks/useDesignInspirations';
import { imageLoadQueue } from '../utils/imageLoadQueue';
import { motion, AnimatePresence } from 'framer-motion';

const processSteps = [
  { num: '01', title: 'Consultation', desc: 'Understanding your architectural vision, lifestyle needs, and spatial priorities.' },
  { num: '02', title: 'Concept & Design', desc: 'Developing bespoke 3D photorealistic visualisations, material boards, and floorplans.' },
  { num: '03', title: 'Planning & Selection', desc: 'Curating premium materials, German hardware, and custom millwork specifications.' },
  { num: '04', title: 'Turnkey Execution', desc: 'Disciplined civil execution, master carpentry, MEP coordination, and site supervision.' },
  { num: '05', title: 'Final Handover', desc: 'Exacting 120-point quality audits, flawless architectural detailing, and on-time site handover.' },
];

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    className="text-[11px] font-bold tracking-[0.25em] uppercase mb-3 flex items-center gap-2.5 text-[#8C6D23]"
    style={{ fontFamily: "'Inter', sans-serif" }}
  >
    <span className="w-6 h-[1.5px] inline-block bg-[#c5a059]" />
    {children}
  </p>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mb-4 leading-tight"
    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", letterSpacing: '-0.02em' }}
  >
    {children}
  </h2>
);

const Home: React.FC = () => {
  const { images } = useImages();
  const { name, phone } = useCompanyData();
  const { services: hookServices } = useServices();
  const { settings } = useSiteSettings();
  const { projects } = useProjects();
  const { inspirations } = useDesignInspirations();
  const [heroIndex, setHeroIndex] = useState(0);

  // Link images from database: Curate exclusively Full Home Interior & Living Room designs
  const heroSlides = useMemo<HeroSlideItem[]>(() => {
    const list: HeroSlideItem[] = [];
    const addedUrls = new Set<string>();

    const addSlide = (url: string | undefined, category: string, title: string) => {
      if (!url || typeof url !== 'string' || url.trim().length === 0 || addedUrls.has(url)) return;
      addedUrls.add(url);
      list.push({ url, category, title });
    };

    // 1. Database: Appearance Hero Slideshow (from Firestore settings/appearance)
    if (settings?.heroSlideshow && Array.isArray(settings.heroSlideshow) && settings.heroSlideshow.length > 0) {
      settings.heroSlideshow.forEach((url, i) => {
        addSlide(url, i % 2 === 0 ? 'Full Home Interior' : 'Living Room', `Turnkey Showcase ${i + 1}`);
      });
    }

    // 2. Database: Services (from Firestore 'services' collection and REAL_ADMIN_SERVICES)
    const combinedServices = hookServices && hookServices.length > 0 ? hookServices : REAL_ADMIN_SERVICES;
    combinedServices.forEach((s) => {
      const titleLower = (s.title || '').toLowerCase();
      const isFullHome = titleLower.includes('full home') || titleLower.includes('turnkey') || titleLower.includes('residential');
      const isLiving = titleLower.includes('living') || titleLower.includes('hall') || titleLower.includes('lounge');

      if (isFullHome) {
        addSlide(s.image, 'Full Home Interior', s.title);
        if (s.gallery && Array.isArray(s.gallery)) {
          s.gallery.forEach((gUrl, idx) => addSlide(gUrl, 'Full Home Interior', `${s.title} Perspective ${idx + 1}`));
        }
      } else if (isLiving) {
        addSlide(s.image, 'Living Room', s.title);
        if (s.gallery && Array.isArray(s.gallery)) {
          s.gallery.forEach((gUrl, idx) => addSlide(gUrl, 'Living Room', `${s.title} Perspective ${idx + 1}`));
        }
      }
    });

    // 3. Database: Projects (from Firestore 'projects' collection)
    if (projects && projects.length > 0) {
      projects.forEach((p) => {
        const titleLower = (p.title || '').toLowerCase();
        const catLower = (p.category || '').toLowerCase();
        if (titleLower.includes('living') || titleLower.includes('hall') || titleLower.includes('lounge')) {
          addSlide(p.image, 'Living Room', p.title);
        } else if (catLower.includes('residential') || titleLower.includes('home') || titleLower.includes('flat') || titleLower.includes('villa')) {
          addSlide(p.image, 'Full Home Interior', p.title);
        }
      });
    }

    // 4. Database: Design Inspirations (from Firestore 'inspirations' collection)
    if (inspirations && inspirations.length > 0) {
      inspirations.forEach((insp) => {
        const catLower = (insp.category || '').toLowerCase();
        const titleLower = (insp.title || '').toLowerCase();
        if (catLower.includes('living') || titleLower.includes('living')) {
          addSlide(insp.image, 'Living Room', insp.title);
        } else if (catLower.includes('home') || titleLower.includes('home') || catLower.includes('full')) {
          addSlide(insp.image, 'Full Home Interior', insp.title);
        }
      });
    }

    // 5. Database: Specific home hero from settings/images
    if (images.homeHero) {
      addSlide(images.homeHero, 'Full Home Interior', 'Sonu Signature Living');
    }

    // 6. Verified fallback collection of ultra-luxury Full Home Interior & Living Room designs
    if (list.length < 4) {
      addSlide('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80', 'Full Home Interior', 'Turnkey 3BHK Master Luxury Residence');
      addSlide('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80', 'Living Room', 'Bespoke Italian Marble Living Lounge');
      addSlide('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80', 'Full Home Interior', 'Architectural Modern Home Transformation');
      addSlide('https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1920&q=80', 'Living Room', 'Warm Minimalist Living Room & TV Media Wall');
      addSlide('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 'Full Home Interior', 'Open Plan Turnkey Living & Dining Space');
      addSlide('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1920&q=80', 'Living Room', 'Modern High-Ceiling Living Sanctuary');
    }

    return list.slice(0, 8);
  }, [settings, hookServices, projects, inspirations, images.homeHero]);

  const heroImages = useMemo(() => heroSlides.map(s => s.url), [heroSlides]);

  // Automatically change after exactly 1 minute (60,000 ms) with 10s preloading buffer
  useEffect(() => {
    if (heroSlides.length <= 1) return;

    // Preload next image 10 seconds before the 1-minute slide change
    const preloadTimer = setTimeout(() => {
      const nextIdx = (heroIndex + 1) % heroSlides.length;
      if (heroSlides[nextIdx]?.url) {
        const nextUrl = getOptimizedImageUrl(heroSlides[nextIdx].url, 1920);
        imageLoadQueue.enqueue(nextUrl, 100);
      }
    }, 50000); // at 50 seconds

    const intervalTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 60000); // 1 minute (60,000 ms)

    return () => {
      clearTimeout(preloadTimer);
      clearInterval(intervalTimer);
    };
  }, [heroIndex, heroSlides]);

  // Curate the 6 genuine core services actually offered
  const displayServices = useMemo(() => {
    const coreSlugs = [
      'residential-interior-design',
      'commercial-interior-design',
      'modular-kitchen-design',
      'wardrobe-storage-design',
      'bathroom-renovation-design',
      'living-room-design'
    ];
    const sourceServices = hookServices && hookServices.length >= 6 ? hookServices : SERVICES;
    const filtered = sourceServices.filter(s => coreSlugs.includes(s.slug || s.id));
    if (filtered.length >= 6) {
      return filtered.slice(0, 6);
    }
    return sourceServices.slice(0, 6);
  }, [hookServices]);

  return (
    <div className="bg-[#FAF8F5] text-[#171717] min-h-screen font-sans overflow-x-hidden selection:bg-[#8C6D23] selection:text-white">
      <SEO
        title="Luxury Interior Design & Construction Company in Mumbai | Sonu Enterprises"
        description="Sonu Enterprises is an established luxury interior design and turnkey construction studio in Mumbai. Bespoke residential, commercial, modular kitchens, and architectural execution since 2009."
        canonical="https://sonu-builders.in/"
        schema={organizationSchema}
      />

      {/* 1. HERO SECTION */}
      <CinematicHero
        heroImages={heroImages}
        heroSlides={heroSlides}
        heroIndex={heroIndex}
        phone={phone}
        onSelectSlide={setHeroIndex}
      />

      {/* 2. STATISTICS */}
      <TrustMetrics />

      {/* 3. ABOUT SONU ENTERPRISES */}
      <FounderOverview />

      {/* 4. SERVICES */}
      <section className="relative py-16 md:py-24 bg-[#F4F0E8] border-b border-stone-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16">
            <div>
              <SectionLabel>Our Core Expertise</SectionLabel>
              <SectionTitle>
                Bespoke Interior &amp; <span className="text-[#8C6D23] italic">Architectural Services</span>
              </SectionTitle>
              <p className="text-stone-600 text-sm md:text-base max-w-xl leading-relaxed">
                Comprehensive design and turnkey construction services executed with architectural precision across Mumbai.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#8C6D23] hover:text-[#171717] transition-colors"
              >
                <span>Explore All 18 Services</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayServices.map((service, idx) => (
              <Link
                key={service.id || idx}
                to={`/services/${service.slug || service.id}`}
                className="group relative bg-white border border-stone-200/80 rounded-xs overflow-hidden shadow-2xs hover:shadow-md transition-all duration-400 flex flex-col h-full"
              >
                {/* Service Image / Aspect Ratio */}
                <div className="aspect-[16/10] overflow-hidden relative bg-stone-100">
                  <img
                    src={getOptimizedImageUrl(service.image || service.symbolUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', 700)}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute bottom-3 left-4 text-[10px] font-bold tracking-widest uppercase text-white/95 bg-black/45 backdrop-blur-2xs px-2.5 py-1 rounded-xs border border-white/20">
                    Sonu Enterprises
                  </span>
                </div>

                {/* Service Details */}
                <div className="p-6 md:p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <h3
                      className="text-xl md:text-2xl font-bold text-[#171717] mb-2.5 group-hover:text-[#8C6D23] transition-colors"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-stone-600 text-xs md:text-sm leading-relaxed mb-6 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#8C6D23] group-hover:text-[#171717] transition-colors">
                    <span>Explore Service</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Top gold accent bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xs text-xs font-bold uppercase tracking-widest text-[#171717] bg-white border border-stone-300 hover:border-[#8C6D23] hover:text-[#8C6D23] transition-colors shadow-2xs"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8C6D23]" />
            </Link>
          </div>
        </div>
      </section>


      {/* 6. WHY SONU ENTERPRISES / EXCELLENCE */}
      <WhyChooseUs />

      {/* 7. ARCHITECTURAL PROCESS — PREMIUM TIMELINE */}
      <section className="relative py-16 md:py-24 bg-[#FAF8F5] border-b border-stone-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block">
              <SectionLabel>Our Methodology</SectionLabel>
            </div>
            <SectionTitle>
              A Seamless, <span className="text-[#8C6D23] italic">Transparent Process</span>
            </SectionTitle>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              From initial conceptualization to final turnkey handover, our structured workflow ensures quality, budget discipline, and zero surprises.
            </p>
          </div>

          {/* Premium Architectural Timeline */}
          <div className="relative">
            {/* Desktop connecting hairline */}
            <div
              className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[1px] pointer-events-none z-0"
              style={{ background: 'linear-gradient(90deg, rgba(197,160,89,0.2), rgba(197,160,89,0.6), rgba(197,160,89,0.2))' }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10 items-stretch">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200/80 p-5 sm:p-6 rounded-lg shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col h-full min-h-[280px] group"
                >
                  <div className="flex-1">
                    {/* Step Number Circle */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#c5a059]/50 flex items-center justify-center text-[#8C6D23] font-bold text-base font-serif group-hover:bg-[#171717] group-hover:text-[#FAF8F5] group-hover:border-[#171717] transition-colors duration-300">
                        {step.num}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        Phase {step.num}
                      </span>
                    </div>

                    <h4
                      className="text-[#171717] font-bold mb-2.5 leading-snug"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', lineHeight: 1.25 }}
                    >
                      {step.title}
                    </h4>
                    <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLIENT TESTIMONIALS */}
      <section className="relative py-16 md:py-24 bg-[#F4F0E8] border-b border-stone-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-block">
              <SectionLabel>Client Experiences</SectionLabel>
            </div>
            <SectionTitle>
              Words of <span className="text-[#8C6D23] italic">Appreciation</span>
            </SectionTitle>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              Authentic reviews from homeowners and commercial clients who entrusted us with their spaces.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* 9. FINAL CONVERSION CTA — EXPENSIVE & ATMOSPHERIC */}
      <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden bg-[#171717]">
        {/* Background Real Project Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000"
            alt="Sonu Enterprises Luxury Living"
            className="w-full h-full object-cover opacity-35"
            loading="lazy"
          />
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#171717]/85 to-[#171717]/90" />
        </div>

        {/* Decorative gold top hairline */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.5), transparent)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <div className="inline-block mb-3">
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#c5a059] flex items-center justify-center gap-2.5">
              <span className="w-5 h-[1.5px] bg-[#c5a059]" />
              Start Your Journey
              <span className="w-5 h-[1.5px] bg-[#c5a059]" />
            </p>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#FAF8F5] mb-5 leading-tight tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            Let&apos;s Create a Space <br className="hidden sm:block" />
            <span className="text-[#c5a059] italic font-normal">Worth Coming Home To.</span>
          </h2>

          <p className="text-stone-300 text-sm sm:text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed font-light">
            Tell us about your home and let&apos;s explore how we can bring your vision to life with architectural precision and enduring craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary CTA */}
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-xs shadow-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #c5a059, #b08d42)',
                color: '#FFFFFF',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.92')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Secondary CTA */}
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-xs border border-white/30 text-white hover:bg-white/10 hover:border-white transition-colors"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-stone-400 text-xs">
            <a
              href={`tel:${phone?.replace(/\s/g, '') || '+919967044479'}`}
              className="flex items-center gap-2 hover:text-[#c5a059] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Direct: {phone || '+91 99670 44479'}</span>
            </a>
            <span className="text-stone-600">&bull;</span>
            <span className="text-stone-400">Mumbai MMR</span>
          </div>
        </div>

        {/* Decorative gold bottom hairline */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1.5px] pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.3), transparent)' }}
        />
      </section>
    </div>
  );
};

export default Home;
