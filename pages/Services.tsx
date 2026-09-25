import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { usePageHeaders } from '../hooks/usePageHeaders';
import SEO, { organizationSchema, breadcrumbSchema } from '../components/SEO';
import * as Icons from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/performance';
import { SERVICES, REAL_ADMIN_SERVICES, CANONICAL_DOMAIN } from '../constants';
import DesignInspirations from '../components/luxury/DesignInspirations';
import LazyImage from '../components/ui/LazyImage';

const GOLD = '#c5a059';
const GOLD_LIGHT = '#e8d5a3';

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-4 flex items-center gap-3" style={{ color: GOLD }}>
    <span className="w-8 h-[1px] inline-block" style={{ background: `linear-gradient(90deg,${GOLD},transparent)` }} />
    {children}
  </p>
);

const getIcon = (iconName: any) => {
  if (typeof iconName === 'function') {
    const IconComp = iconName;
    return <IconComp className="w-5 h-5" />;
  }
  const IconComp = (Icons as any)[iconName] || Icons.Home;
  return <IconComp className="w-5 h-5" />;
};

const CATEGORIES = [
  'All Services',
  'Primary Turnkey',
  'Room Interiors',
  'Joinery & Architectural'
];

const Services: React.FC = () => {
  const { services: hookServices, loading } = useServices();
  const { headers } = usePageHeaders();
  const [activeCategory, setActiveCategory] = useState<string>('All Services');

  // Combine or fallback to real admin feeded services
  const allServices = useMemo(() => {
    if (hookServices && hookServices.length > 0) {
      return hookServices.map(hs => {
        const fallback = REAL_ADMIN_SERVICES.find(r => r.id === hs.id || r.title?.toLowerCase() === hs.title?.toLowerCase());
        return {
          ...fallback,
          ...hs,
          categoryGroup: hs.categoryGroup || fallback?.categoryGroup || 'Room Interior',
          image: hs.image || fallback?.image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
          description: hs.description || fallback?.description || ''
        };
      });
    }
    return REAL_ADMIN_SERVICES;
  }, [hookServices]);

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All Services') return allServices;
    if (activeCategory === 'Primary Turnkey') {
      return allServices.filter(s => s.categoryGroup === 'Primary');
    }
    if (activeCategory === 'Room Interiors') {
      return allServices.filter(s => s.categoryGroup === 'Room Interior');
    }
    if (activeCategory === 'Joinery & Architectural') {
      return allServices.filter(s => s.categoryGroup === 'Joinery & Architectural');
    }
    return allServices;
  }, [allServices, activeCategory]);

  const bgImage =
    headers?.services?.backgroundImage ||
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80';

  useEffect(() => {
    sessionStorage.setItem('last_opened_service_page', '/services');
  }, []);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' }
  ];

  return (
    <div className="text-stone-900 min-h-screen overflow-x-hidden selection:bg-luxury-gold selection:text-white" style={{ background: '#FAF8F5' }}>
      <SEO
        title="Interior Design Services Mumbai | Turnkey, Kitchens, Wardrobes | Sonu Enterprises"
        description="Explore 18 specialized interior design and turnkey construction services in Mumbai. Residential, commercial, modular kitchens, luxury wardrobes, false ceilings & marble flooring."
        canonical={`${CANONICAL_DOMAIN}/services`}
        ogImage={bgImage}
        schema={[
          organizationSchema,
          breadcrumbSchema(breadcrumbs)
        ]}
      />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-10 sm:pt-32 sm:pb-12 md:pt-36 md:pb-14 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <LazyImage
            src={getOptimizedImageUrl(bgImage, 1920)}
            alt="Interior Design Services Mumbai"
            priority={true}
            className="w-full h-full object-cover"
            style={{ filter: 'contrast(1.02) saturate(0.9) brightness(0.85)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeUp}><Label>18 Specialized Disciplines</Label></motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-4 text-[#171717]"
            >
              Interior Design{' '}
              <span
                style={{
                  background: `linear-gradient(135deg,${GOLD},#9A7836)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Services
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-stone-600 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
              From turnkey full-home transformations to custom modular joinery, discover our complete spectrum of architectural craftsmanship tailored for Mumbai residences.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY TABS ──────────────────────────────────────────────────────── */}
      <section className="py-3 sm:py-3.5 bg-[#F4F0E8] border-y border-luxury-gold/20 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-luxury-gold text-white shadow-md shadow-luxury-gold/30'
                  : 'bg-white/90 text-stone-700 hover:text-stone-900 hover:bg-white border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── SERVICE GRID ──────────────────────────────────────────────────────── */}
      <section id="service-grid" className="relative pt-6 pb-16 sm:pt-8 sm:pb-20 md:pt-10 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ delay: (i % 3) * 0.06, duration: 0.5 }}
              >
                <Link
                  to={`/services/${service.id || service.slug}`}
                  className="block group relative overflow-hidden rounded-lg h-full bg-white border border-stone-200 hover:border-luxury-gold/50 shadow-sm hover:shadow-luxury-hover transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    {/* Image with queued lazy loading and zero layout shift */}
                    <div className="relative h-64 overflow-hidden bg-stone-100">
                      <LazyImage
                        src={getOptimizedImageUrl(service.image || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace', 650)}
                        alt={service.title}
                        rootMargin="280px 0px"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ filter: 'brightness(0.92) contrast(1.02)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                      {/* Icon badge */}
                      <div
                        className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full text-luxury-gold bg-white/90 border border-luxury-gold/40 shadow-sm backdrop-blur-md z-10"
                      >
                        {getIcon(service.icon)}
                      </div>

                      {/* Category tag */}
                      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] uppercase tracking-wider text-stone-800 font-semibold border border-stone-200 shadow-sm z-10">
                        {service.categoryGroup || 'Interior'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3
                        className="text-xl font-serif font-bold text-[#171717] mb-2 group-hover:text-luxury-gold transition-colors"
                      >
                        {service.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-6">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer link */}
                  <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-stone-100 text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-gold">
                    <span>Explore Service</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE GALLERY SECTION ───────────────────────────────────────────── */}
      <DesignInspirations isSection={true} />

      {/* ── VALUE FOOTER PROMISE ──────────────────────────────────────────────── */}
      <section className="relative py-24 bg-[#F4F0E8] border-t border-luxury-gold/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Label>Our Commitment</Label>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-6">
            Guaranteed Standards on Every Service
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed mb-12 max-w-xl mx-auto">
            Whether fitting a standalone wardrobe or undertaking a 4BHK duplex turnkey transformation, our engineering benchmarks remain uncompromising.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mb-12">
            {[
              { title: '100% Genuine Materials', desc: 'Certificates of origin for plywood (IS:710) and German hardware.' },
              { title: 'Milestone Tracking', desc: 'Transparent payment schedules linked strictly to on-site delivery stages.' },
              { title: '10-Year Warranty', desc: 'Authentic decade-long structural warranty against borer, termite, and delamination.' }
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-lg bg-white border border-stone-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-luxury-gold mb-3" />
                <h4 className="font-serif font-bold text-stone-900 text-base mb-1">{p.title}</h4>
                <p className="text-stone-600 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs uppercase tracking-[0.25em] font-bold text-white rounded shadow-md"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #b08d42)`,
              }}
            >
              <span>Book Site Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/interior-designer-mumbai"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs uppercase tracking-[0.25em] font-bold text-stone-900 bg-white border border-luxury-gold/40 hover:border-luxury-gold shadow-sm rounded"
            >
              Mumbai Turnkey Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
