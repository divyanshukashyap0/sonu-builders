import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Sparkles,
  Building2,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Home,
  Layers,
  Phone
} from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import SEO, { organizationSchema, locationLocalBusinessSchema, faqSchema, breadcrumbSchema } from '../components/SEO';
import LeadCaptureForm from '../components/luxury/LeadCaptureForm';
import { MUMBAI_LOCATIONS, CANONICAL_DOMAIN } from '../constants';

const GOLD = '#c5a059';
const GOLD_LIGHT = '#e8d5a3';

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const LocationLanding: React.FC = () => {
  const { locationName, slug } = useParams<{ locationName?: string; slug?: string }>();
  const rawParam = (slug || locationName || '').toLowerCase().trim();
  const { phone } = useCompanyData();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Normalize param to find matching location
  const locationData = useMemo(() => {
    if (!rawParam) return MUMBAI_LOCATIONS[0];

    // Direct slug match
    let match = MUMBAI_LOCATIONS.find(l => l.slug === rawParam);
    if (match) return match;

    // Aliases
    if (rawParam.includes('kalyan') || rawParam.includes('dombivli')) {
      return MUMBAI_LOCATIONS.find(l => l.slug === 'kalyan-dombivli') || MUMBAI_LOCATIONS[0];
    }
    if (rawParam.includes('thane')) {
      return MUMBAI_LOCATIONS.find(l => l.slug === 'thane') || MUMBAI_LOCATIONS[0];
    }
    if (rawParam.includes('palava')) {
      return MUMBAI_LOCATIONS.find(l => l.slug === 'palava-city') || MUMBAI_LOCATIONS[0];
    }
    if (rawParam.includes('navi') || rawParam.includes('vashi')) {
      return MUMBAI_LOCATIONS.find(l => l.slug === 'navi-mumbai') || MUMBAI_LOCATIONS[0];
    }
    if (rawParam.includes('bandra') || rawParam.includes('khar')) {
      return MUMBAI_LOCATIONS.find(l => l.slug === 'bandra') || MUMBAI_LOCATIONS[0];
    }
    if (rawParam.includes('andheri') || rawParam.includes('juhu')) {
      return MUMBAI_LOCATIONS.find(l => l.slug === 'andheri') || MUMBAI_LOCATIONS[0];
    }
    if (rawParam.includes('powai') || rawParam.includes('chandivali')) {
      return MUMBAI_LOCATIONS.find(l => l.slug === 'powai') || MUMBAI_LOCATIONS[0];
    }

    return MUMBAI_LOCATIONS[0];
  }, [rawParam]);



  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const LOCATION_COORDINATES: Record<string, { lat: string; placename: string }> = {
    'kalyan-dombivli': { lat: '19.2437;73.1355', placename: 'Kalyan, Dombivli, Maharashtra, India' },
    'palava-city': { lat: '19.1726;73.0850', placename: 'Palava City, Dombivli East, Maharashtra, India' },
    'thane': { lat: '19.2183;72.9781', placename: 'Thane, Mumbai MMR, Maharashtra, India' },
    'navi-mumbai': { lat: '19.0330;73.0297', placename: 'Navi Mumbai, Vashi, Kharghar, Maharashtra, India' },
    'bandra': { lat: '19.0596;72.8295', placename: 'Bandra West, Mumbai, Maharashtra, India' },
    'andheri': { lat: '19.1136;72.8697', placename: 'Andheri West, Mumbai, Maharashtra, India' },
    'powai': { lat: '19.1176;72.9060', placename: 'Powai, Hiranandani, Mumbai, Maharashtra, India' },
  };

  const geoInfo = LOCATION_COORDINATES[locationData.slug] || { lat: '19.1726;73.0850', placename: `${locationData.name}, Mumbai MMR, Maharashtra, India` };

  const canonicalUrl = `${CANONICAL_DOMAIN}/locations/${locationData.slug}`;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/interior-designer-mumbai' },
    { name: locationData.name, url: `/locations/${locationData.slug}` }
  ];

  return (
    <div className="bg-[#FAF8F5] text-stone-900 min-h-screen font-sans overflow-x-hidden selection:bg-luxury-gold selection:text-white">
      <SEO
        title={locationData.seoTitle}
        description={locationData.metaDescription}
        canonical={canonicalUrl}
        ogImage={locationData.heroImage}
        geoPlacename={geoInfo.placename}
        geoPosition={geoInfo.lat}
        schema={[
          organizationSchema,
          locationLocalBusinessSchema(locationData),
          faqSchema(locationData.faqs),
          breadcrumbSchema(breadcrumbs)
        ]}
      />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src={locationData.heroImage}
            alt={`Luxury Interiors in ${locationData.name}`}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.9) contrast(1.02)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-4xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-luxury-gold/40 bg-white/80 backdrop-blur-md mb-6 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-gold">
                Local Presence in {locationData.name}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-[#171717] mb-6 leading-[1.08] tracking-tight"
            >
              Interior Designer in{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, #9A7836)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {locationData.name}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-stone-600 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-3xl">
              {locationData.intro}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#local-consultation"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-xs uppercase tracking-[0.25em] font-bold text-white rounded shadow-md transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, #b08d42)`,
                }}
              >
                <span>Book Local Site Visit</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs uppercase tracking-[0.25em] font-bold text-stone-900 bg-white border border-luxury-gold/40 hover:border-luxury-gold shadow-sm rounded transition-all duration-300"
              >
                <Phone className="w-4 h-4 text-luxury-gold" />
                <span>Call {phone}</span>
              </a>
            </motion.div>

            {/* Suburbs Covered */}
            <motion.div variants={fadeUp} className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-luxury-gold font-bold mr-2">
                Suburbs Covered:
              </span>
              {locationData.suburbs.map((sub, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-white/90 border border-stone-200 text-stone-700 shadow-sm"
                >
                  {sub}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PROPERTY TYPES ──────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-[#F4F0E8] border-t border-luxury-gold/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
              Tailored Architecture
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-4">
              Typical Property Types in {locationData.name}
            </h2>
            <p className="text-stone-600 text-sm">
              We specialize in the exact structural nuances and floor layouts prevalent in {locationData.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locationData.propertyTypes.map((prop, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-luxury-gold/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-luxury-gold/10 text-luxury-gold flex items-center justify-center mb-6">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">{prop.name}</h3>
                  <p className="text-stone-600 text-xs leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCAL CHALLENGES & SOLUTIONS ────────────────────────────────────── */}
      <section className="py-24 relative bg-[#FAF8F5] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
              Technical Problem Solving
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-4">
              Local Challenges & Our Proven Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {locationData.localChallenges.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-white border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-red-700 font-bold text-xs uppercase tracking-wider px-2.5 py-1 rounded bg-red-50 border border-red-200">
                    Challenge
                  </span>
                  <p className="text-stone-900 font-medium text-sm pt-0.5">{item.challenge}</p>
                </div>
                <div className="flex items-start gap-3 pt-3 border-t border-stone-100">
                  <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                    Sonu Solution
                  </span>
                  <p className="text-stone-600 text-xs leading-relaxed pt-0.5">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION SERVICE SOLUTIONS (INTERIOR, BEDROOM, KITCHEN, BATHROOM, TEMPLE) ── */}
      <section className="py-24 relative bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
              Room &amp; Space Solutions
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-4">
              Interior Services in {locationData.name}
            </h2>
            <p className="text-stone-600 text-sm">
              Explore bespoke modular craftsmanship tailored for residences across {locationData.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/services/residential-interior-design"
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-luxury-gold/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded">
                  Turnkey
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mt-3 group-hover:text-luxury-gold transition-colors">
                  Full Home Interiors in {locationData.name}
                </h3>
                <p className="text-stone-600 text-xs mt-2 leading-relaxed">
                  Turnkey 1BHK, 2BHK &amp; 3BHK flat interiors with Italian marble, false ceilings, and factory modular woodwork in {locationData.name}.
                </p>
              </div>
              <div className="text-xs text-luxury-gold font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Full Home Design &rarr;
              </div>
            </Link>

            <Link
              to="/services/bedroom-interior-design"
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-luxury-gold/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded">
                  Bedroom
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mt-3 group-hover:text-luxury-gold transition-colors">
                  Bedroom Interior Design in {locationData.name}
                </h3>
                <p className="text-stone-600 text-xs mt-2 leading-relaxed">
                  Serene master bedrooms with cushioned headboards, hydraulic storage beds, and acoustic wall panelling in {locationData.name}.
                </p>
              </div>
              <div className="text-xs text-luxury-gold font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Bedroom Design &rarr;
              </div>
            </Link>

            <Link
              to="/services/modular-kitchen-design"
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-luxury-gold/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded">
                  Kitchen
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mt-3 group-hover:text-luxury-gold transition-colors">
                  Modular Kitchens in {locationData.name}
                </h3>
                <p className="text-stone-600 text-xs mt-2 leading-relaxed">
                  100% IS:710 Marine Grade BWP Plywood with German Blum tandem drawers and seamless quartz countertops in {locationData.name}.
                </p>
              </div>
              <div className="text-xs text-luxury-gold font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Kitchen Design &rarr;
              </div>
            </Link>

            <Link
              to="/services/bathroom-interior-design"
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-luxury-gold/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded">
                  Bathroom
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mt-3 group-hover:text-luxury-gold transition-colors">
                  Bathroom Renovation in {locationData.name}
                </h3>
                <p className="text-stone-600 text-xs mt-2 leading-relaxed">
                  Spa-like luxury bathrooms with frameless glass cubicles, floating vanities, and anti-skid porcelain tiles in {locationData.name}.
                </p>
              </div>
              <div className="text-xs text-luxury-gold font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Bathroom Design &rarr;
              </div>
            </Link>

            <Link
              to="/services/pooja-room-design"
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-luxury-gold/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded">
                  Temple &amp; Mandir
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mt-3 group-hover:text-luxury-gold transition-colors">
                  Home Temple &amp; Mandir Design in {locationData.name}
                </h3>
                <p className="text-stone-600 text-xs mt-2 leading-relaxed">
                  Vastu-compliant sacred pooja rooms with CNC brass jali screens, backlit onyx stone, and marble altars in {locationData.name}.
                </p>
              </div>
              <div className="text-xs text-luxury-gold font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Mandir Design &rarr;
              </div>
            </Link>

            <Link
              to="/services/wardrobe-design"
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-luxury-gold/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded">
                  Wardrobes
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mt-3 group-hover:text-luxury-gold transition-colors">
                  Custom Wardrobes in {locationData.name}
                </h3>
                <p className="text-stone-600 text-xs mt-2 leading-relaxed">
                  Floor-to-ceiling sliding mirrors, tinted glass walk-in closets, and modular internal organizers engineered for {locationData.name} apartments.
                </p>
              </div>
              <div className="text-xs text-luxury-gold font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Wardrobe Design &rarr;
              </div>
            </Link>
          </div>
        </div>
      </section>



      {/* ── LOCALIZED FAQS ──────────────────────────────────────────────────── */}
      <section className="py-24 relative bg-[#FAF8F5] border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
              Common Questions
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-4">
              FAQs for {locationData.name} Homeowners
            </h2>
          </div>

          <div className="space-y-4">
            {locationData.faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl bg-white border border-stone-200 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-stone-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-luxury-gold flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONSULTATION ────────────────────────────────────────────────────── */}
      <div id="local-consultation">
        <LeadCaptureForm 
          title={`Plan Your Dream Interior in ${locationData.name}`}
          subtitle={`Meet In ${locationData.name}`}
          description={`Connect directly with our senior site engineers. We offer complimentary laser surveys, transparent itemized estimates, and 3D design walkthroughs in ${locationData.name}.`}
        />
      </div>
    </div>
  );
};

export default LocationLanding;
