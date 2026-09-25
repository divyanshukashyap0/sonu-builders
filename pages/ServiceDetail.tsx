import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Layers,
  Wrench,
  Hammer,
  ArrowRight,
  Phone,
  X,
  Maximize2
} from 'lucide-react';
import PageHero from '../components/luxury/PageHero';
import Section from '../components/Section';
import { useServices } from '../hooks/useServices';
import SEO, { organizationSchema, serviceSchema, faqSchema, breadcrumbSchema } from '../components/SEO';
import { SERVICES, REAL_ADMIN_SERVICES, CANONICAL_DOMAIN } from '../constants';
import * as Icons from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/performance';
import LeadCaptureForm from '../components/luxury/LeadCaptureForm';
import LazyImage from '../components/ui/LazyImage';

const GOLD = '#c5a059';
const GOLD_LIGHT = '#e8d5a3';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { services, loading } = useServices();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Normalization for search engine friendly and legacy aliases
  const normalizedId = useMemo(() => {
    if (!id) return '';
    const clean = id.toLowerCase();
    if (clean === 'full-home-interiors' || clean === 'interior' || clean === 'interiors' || clean === 'home-interior' || clean === 'home-interiors') return 'residential-interior-design';
    if (clean === 'modular-kitchens' || clean === 'kitchen' || clean === 'kitchens' || clean === 'modular-kitchen') return 'modular-kitchen-design';
    if (clean === 'living-room-design' || clean === 'living-room' || clean === 'living') return 'living-room-interior-design';
    if (clean === 'bedroom' || clean === 'bedrooms' || clean === 'bedroom-design' || clean === 'master-bedroom') return 'bedroom-interior-design';
    if (clean === 'bathroom-design' || clean === 'bathroom' || clean === 'bathrooms') return 'bathroom-interior-design';
    if (clean === 'temple' || clean === 'mandir' || clean === 'pooja-room' || clean === 'home-temple' || clean === 'pooja') return 'pooja-room-design';
    if (clean === 'wardrobe' || clean === 'wardrobes' || clean === 'storage') return 'wardrobe-design';
    if (clean === 'ceiling' || clean === 'false-ceiling' || clean === 'ceilings') return 'false-ceiling-design';
    return clean;
  }, [id]);

  // Find service from Firestore first, then fallback to real admin services, then constants
  const service = useMemo(() => {
    const fromHook = services.find(s => s.id === id || s.slug === id || s.id === normalizedId || s.slug === normalizedId);
    if (fromHook) return fromHook;
    const fromReal = REAL_ADMIN_SERVICES.find(s => s.id === id || s.slug === id || s.id === normalizedId || s.slug === normalizedId);
    if (fromReal) return fromReal;
    return (
      SERVICES.find(s => s.id === id || s.slug === id || s.id === normalizedId || s.slug === normalizedId) ||
      REAL_ADMIN_SERVICES[0]
    );
  }, [services, id, normalizedId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (service) {
      sessionStorage.setItem('last_opened_service_page', `/services/${service.slug || service.id}`);
    }
  }, [id, service]);

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#060606] text-white">
        <h2 className="text-3xl font-serif mb-4">Service Not Found</h2>
        <Link to="/services" className="text-luxury-gold hover:underline">
          Return to All Services
        </Link>
      </div>
    );
  }



  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: service.title, url: `/services/${service.slug || service.id}` }
  ];

  // Curate photos for this service gallery
  const serviceGalleryImages = useMemo(() => {
    if (!service) return [];
    const list = [
      ...(service.gallery || []),
      ...(service.image ? [service.image] : [])
    ];
    return list.filter((url, idx, self) => self.indexOf(url) === idx && Boolean(url));
  }, [service]);

  const schemas: any[] = [
    organizationSchema,
    serviceSchema(service.title, service.description, service.slug || service.id),
    breadcrumbSchema(breadcrumbs)
  ];

  if (service.faqs && service.faqs.length > 0) {
    schemas.push(faqSchema(service.faqs));
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-900 selection:bg-luxury-gold selection:text-white">
      <SEO
        title={service.seoTitle || `${service.title} in Mumbai | Sonu Enterprises`}
        description={service.metaDescription || service.description}
        canonical={`${CANONICAL_DOMAIN}/services/${service.slug || service.id}`}
        ogImage={service.image}
        schema={schemas}
      />

      <PageHero
        title={service.h1 || service.title}
        subtitle={service.description}
        backgroundImage={getOptimizedImageUrl(
          service.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
          1600
        )}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link
          to="/services"
          className="inline-flex items-center text-luxury-gold mb-10 hover:translate-x-[-4px] transition-transform font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Services
        </Link>

        {/* ── OVERVIEW & KEY HIGHLIGHTS ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold">
              Service Scope & Standards
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] leading-tight">
              Master Craftsmanship & Technical Precision
            </h2>
            <div className="text-base text-stone-600 leading-relaxed space-y-4">
              <p className="text-lg font-light text-stone-800">
                {service.longDescription || service.description}
              </p>
              <p>
                At Sonu Enterprises, every project is supervised by our principal contractor and executed by our in-house master carpenters, electricians, and tilers. We reject fragile commercial boards, building strictly with calibrated IS:710 boiling waterproof marine plywood.
              </p>
            </div>

            {service.features && (
              <div className="pt-6 border-t border-stone-200">
                <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-gold mb-4">
                  What This Service Includes:
                </h3>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-stone-700">
                      <CheckCircle className="w-4 h-4 text-luxury-gold mr-3 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-6 sticky top-28">
              <h3 className="text-xl font-serif font-bold text-[#171717] border-b border-stone-200 pb-4">
                Quick Service Facts
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">Material Standard</span>
                  <span className="font-semibold text-stone-900">100% IS:710 Marine Ply</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">Hardware Fitting</span>
                  <span className="font-semibold text-stone-900">Blum / Hettich Soft-Close</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">Execution Warranty</span>
                  <span className="font-semibold text-luxury-gold">10-Year Structural</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500">Service Coverage</span>
                  <span className="font-semibold text-stone-900">Mumbai, Thane, MMR</span>
                </div>
              </div>

              <a
                href="#service-booking"
                className="w-full flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-[0.25em] font-bold text-white rounded-lg shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, #b08d42)`,
                }}
              >
                <span>Book Site Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ── LAYOUTS & ERGONOMICS (IF AVAILABLE) ─────────────────────────── */}
        {service.layouts && service.layouts.length > 0 && (
          <div className="mb-24 pt-16 border-t border-stone-200">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2 block">
                Spatial Configurations
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#171717]">
                Popular Layout Options & Ergonomics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {service.layouts.map((layout, idx) => (
                <div key={idx} className="p-8 rounded-xl bg-white border border-stone-200 shadow-sm">
                  <h4 className="text-lg font-serif font-bold text-stone-900 mb-3">{layout.name}</h4>
                  <p className="text-stone-600 text-xs leading-relaxed">{layout.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TECHNICAL SPECIFICATIONS (MATERIALS, FINISHES, HARDWARE) ─────── */}
        {(service.materials || service.finishes || service.hardwareAndLighting) && (
          <div className="mb-24 pt-16 border-t border-stone-200">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2 block">
                Engineering Integrity
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#171717]">
                Materials, Finishes & Hardware
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {service.materials && (
                <div className="p-8 rounded-xl bg-white border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-luxury-gold">
                    <ShieldCheck className="w-5 h-5" />
                    <h4 className="font-serif font-bold text-lg text-stone-900">Core Materials</h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-stone-600">
                    {service.materials.map((m, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mt-1.5 flex-shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.finishes && (
                <div className="p-8 rounded-xl bg-white border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-luxury-gold">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="font-serif font-bold text-lg text-stone-900">Surfaces & Finishes</h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-stone-600">
                    {service.finishes.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mt-1.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.hardwareAndLighting && (
                <div className="p-8 rounded-xl bg-white border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-luxury-gold">
                    <Wrench className="w-5 h-5" />
                    <h4 className="font-serif font-bold text-lg text-stone-900">Fittings & Lighting</h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-stone-600">
                    {service.hardwareAndLighting.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mt-1.5 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EXECUTION PROCESS ────────────────────────────────────────────── */}
        {service.processSteps && service.processSteps.length > 0 && (
          <div className="mb-24 pt-16 border-t border-stone-200">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2 block">
                Transparent Execution
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#171717]">
                How We Execute {service.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {service.processSteps.map((step, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
                  <span className="text-2xl font-serif font-bold text-luxury-gold mb-3">{step.step}</span>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-base mb-2">{step.title}</h4>
                    <p className="text-stone-600 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SERVICE PHOTO GALLERY ────────────────────────────────────────── */}
        {serviceGalleryImages.length > 0 && (
          <div className="mb-24 pt-16 border-t border-stone-200">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2 block">
                Visual Showcase
              </span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#171717]">
                {service.title} Gallery
              </h3>
              <p className="text-stone-600 text-sm mt-2">
                Real finishes, bespoke joinery, and design perspectives for our {service.title.toLowerCase()} service in Mumbai.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceGalleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/gallery/media?url=${encodeURIComponent(imgUrl)}&title=${encodeURIComponent(service.title + ' Perspective ' + (idx + 1))}&desc=${encodeURIComponent(service.description)}`)}
                  className="group relative rounded-xs overflow-hidden bg-stone-100 border border-stone-200 aspect-[4/3] shadow-2xs hover:shadow-md transition-all duration-400 cursor-pointer"
                >
                  <LazyImage
                    src={getOptimizedImageUrl(imgUrl, 800)}
                    alt={`${service.title} detail ${idx + 1}`}
                    rootMargin="800px 0px"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-5">
                    <span className="text-white text-xs font-serif font-bold">
                      {service.title} Perspective {idx + 1}
                    </span>
                    <span className="text-[#c5a059] text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                      <Maximize2 size={12} /> View Full Screen
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SERVICE FAQS ─────────────────────────────────────────────────── */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="mb-24 pt-16 border-t border-stone-200 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold mb-2 block">
                Technical Clarity
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#171717]">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white border border-stone-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-serif font-bold text-base text-stone-900">
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
                        className="px-6 pb-6 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-4"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BOOKING CONSULTATION FORM ─────────────────────────────────────── */}
        <div id="service-booking" className="pt-8 border-t border-stone-200">
          <LeadCaptureForm 
            title={`Consultation for ${service.title}`}
            subtitle="Get an Itemized Estimate"
            description={`Connect directly with Sonu Enterprises. We provide accurate on-site measurements, 3D renderings, and transparent itemized pricing for your ${service.title} project in Mumbai.`}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
