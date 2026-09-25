import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Phone,
  Sparkles,
  Home,
  Building2,
  PaintBucket,
  Ruler,
  ChevronDown,
  Layers,
  Clock,
  Award,
  Users
} from 'lucide-react';
import SEO, { organizationSchema, faqSchema, breadcrumbSchema } from '../components/SEO';
import {
  COMPANY_NAME,
  COMPANY_PHONE,
  SERVICES,
  MUMBAI_LOCATIONS,
  TESTIMONIALS
} from '../constants';
import LeadCaptureForm from '../components/luxury/LeadCaptureForm';

const GOLD = '#c5a059';
const GOLD_LIGHT = '#e8d5a3';

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const MUMBAI_FAQS = [
  {
    question: 'How much does turnkey interior design cost for a 2BHK flat in Mumbai?',
    answer: 'Turnkey interior design for a 2BHK flat in the Mumbai Metropolitan Region typically ranges from ₹9.5 Lakhs to ₹14 Lakhs for premium grade execution (incorporating 100% IS:710 Marine Ply, factory-finished modular kitchen with quartz counter, false ceiling with cove lighting, and full painting). Luxury finishes with Italian marble and veneer range from ₹16 Lakhs upwards.'
  },
  {
    question: 'How do you protect Mumbai homes from heavy monsoon dampness and humidity?',
    answer: 'We exclusively use IS:710 Boiling Waterproof (BWP) calibrated Marine Plywood for all cabinetry and apply PUR waterproof edge-banding. For bathrooms, we execute a mandatory 4-layer elastomeric waterproofing treatment backed by a 72-hour flood test before laying tiles.'
  },
  {
    question: 'Do you manage housing society permissions, work timing rules, and debris disposal?',
    answer: 'Yes. We prepare full 2D layout submissions, contractor indemnity paperwork, and coordinate directly with society management for gate passes, elevator protection, and authorized debris disposal in compliance with BMC/TMC norms.'
  },
  {
    question: 'What is the standard execution timeline for an apartment in Mumbai?',
    answer: 'A standard 2BHK or 3BHK turnkey interior takes between 45 to 60 working days. We utilize parallel workflows: while on-site civil and false ceiling work proceeds, modular carcasses are pre-fabricated under clean factory conditions.'
  },
  {
    question: 'Which areas in Mumbai does Sonu Enterprises actively serve?',
    answer: 'Our operational headquarters and factory are situated at Nilje, Palava City, allowing immediate coverage across Kalyan-Dombivli, Palava City, Thane, Navi Mumbai (Vashi, Kharghar, Nerul), Bandra, Andheri, and Powai.'
  }
];

const MumbaiLanding: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Interior Designer Mumbai', url: '/interior-designer-mumbai' }
  ];

  return (
    <div className="bg-[#FAF8F5] text-stone-900 min-h-screen font-sans overflow-x-hidden selection:bg-luxury-gold selection:text-white">
      <SEO
        title="Interior Designer in Mumbai | Turnkey Home Interiors | Sonu Enterprises"
        description="Premier interior designer in Mumbai. Turnkey residential & commercial interiors across Thane, Navi Mumbai, Palava City & Kalyan-Dombivli. 15+ years experience, BWP marine ply & 3D designs."
        canonical="https://sonu-builders.in/interior-designer-mumbai"
        schema={[
          organizationSchema,
          faqSchema(MUMBAI_FAQS),
          breadcrumbSchema(breadcrumbs)
        ]}
      />

      {/* ── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
            alt="Interior Designer in Mumbai - Luxury Living Room"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.9) contrast(1.02)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/60 to-transparent" />
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-4xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-luxury-gold/40 bg-white/80 backdrop-blur-md mb-6 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-gold">
                Mumbai Metropolitan Region Hub
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
                Mumbai
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-stone-600 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl">
              Turnkey architectural interiors tailored for Mumbai apartments, penthouses, and corporate spaces. 15+ years of master craftsmanship, 100% boiling waterproof marine ply, and guaranteed on-time handover.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#consultation"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-xs uppercase tracking-[0.25em] font-bold text-white rounded shadow-md transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, #b08d42)`,
                }}
              >
                <span>Book Free Site Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs uppercase tracking-[0.25em] font-bold text-stone-900 bg-white border border-luxury-gold/40 hover:border-luxury-gold shadow-sm rounded transition-all duration-300"
              >
                Explore Services
              </Link>
            </motion.div>

            {/* Quick Badges */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 pt-8 border-t border-stone-200">
              {[
                { label: '15+ Years Experience', sub: 'Est. 2009 in MMR' },
                { label: '100% BWP Marine Ply', sub: 'IS:710 Certified' },
                { label: '45-60 Day Delivery', sub: 'Written Guarantee' },
                { label: 'Zero Sub-contracting', sub: 'In-House Master Teams' }
              ].map((b, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-stone-900 font-semibold text-sm">{b.label}</span>
                  <span className="text-stone-500 text-xs">{b.sub}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. WHY CHOOSE SONU ENTERPRISES IN MUMBAI ────────────────────────── */}
      <section className="py-24 relative border-t border-luxury-gold/20 bg-[#F4F0E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
              Crafted for Mumbai Living
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-6">
              Engineering Excellence for High-Rise Realities
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              Designing interiors in Mumbai requires specialized technical expertise—from handling heavy coastal monsoon humidity to navigating strict housing society restrictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: '100% Monsoon-Resistant Materials',
                desc: 'Mumbai’s humidity destroys standard particle board and MDF. We construct all kitchen and wardrobe carcasses exclusively using calibrated IS:710 boiling waterproof marine plywood with PUR edge banding.'
              },
              {
                icon: Clock,
                title: 'Seamless Society NOC Coordination',
                desc: 'We handle society work permits, structural guidelines, elevator cladding, security passes, and noise-restricted work schedules so you never receive complaints from building committees.'
              },
              {
                icon: Layers,
                title: 'Precision Space Optimization',
                desc: 'We engineer floor-to-ceiling wardrobes, concealed hydraulic storage beds, and ergonomic galley kitchens to capture up to 25% more usable floor area in compact urban footprints.'
              }
            ].map((card, i) => {
              const IconComp = card.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-luxury-gold/40 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 bg-luxury-gold/10 text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">{card.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. SERVICE SPECTRUM IN MUMBAI ────────────────────────────────────── */}
      <section className="py-24 relative bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
                Complete Capabilities
              </p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717]">
                Comprehensive Interior Services
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-luxury-gold hover:text-stone-900 transition-colors"
            >
              <span>Explore All 18 Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.slice(0, 6).map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug || service.id}`}
                className="group relative overflow-hidden rounded-xl bg-white border border-stone-200 hover:border-luxury-gold/40 shadow-sm hover:shadow-luxury-hover transition-all duration-500 flex flex-col"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={service.image}
                    alt={`${service.title} in Mumbai`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ filter: 'brightness(0.92)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#171717] mb-2 group-hover:text-luxury-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-stone-600 text-xs leading-relaxed line-clamp-3 mb-6">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold">
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ── 5. MUMBAI LOCALITY COVERAGE ─────────────────────────────────────── */}
      <section className="py-24 relative bg-[#FAF8F5] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
              Genuine Operational Presence
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-4">
              Local Corridors We Serve Across Mumbai MMR
            </h2>
            <p className="text-stone-600 text-sm">
              We operate exclusively in localities where our teams have established presence and active project sites.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MUMBAI_LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                to={`/locations/${loc.slug}`}
                className="p-6 rounded-xl bg-white border border-stone-200 hover:border-luxury-gold/40 shadow-sm hover:shadow-luxury-hover transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-luxury-gold" />
                    <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-luxury-gold transition-colors">
                      {loc.name}
                    </h3>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed mb-4">
                    {loc.intro.slice(0, 130)}...
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {loc.suburbs.slice(0, 4).map((sub, i) => (
                      <span
                        key={i}
                        className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold pt-3 border-t border-stone-100">
                  <span>Explore Locality</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. STEP-BY-STEP PROCESS ─────────────────────────────────────────── */}
      <section className="py-24 relative bg-[#F4F0E8] border-t border-luxury-gold/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
              Turnkey Methodology
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-4">
              Our 5-Stage Turnkey Execution Process
            </h2>
            <p className="text-stone-600 text-sm">
              From laser spatial measurement to final deep cleaning, every step is systematically tracked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Laser Survey & Brief', desc: 'Precision digital laser measurement and detailed lifestyle requirement audit.' },
              { step: '02', title: '3D Visuals & BOQ', desc: 'Photorealistic 3D room renders, hardware approvals, and locked transparent pricing.' },
              { step: '03', title: 'Society NOC & MEP', desc: 'Managing society permissions, electrical chases, plumbing, and false ceiling frames.' },
              { step: '04', title: 'Factory Modular Assembly', desc: 'Precision CNC edge-banded carcasses, acrylic shutters, and quartz top fitting.' },
              { step: '05', title: 'Quality Audit & Handover', desc: '120-point quality snag inspection, industrial deep clean, and warranty handover.' }
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm relative flex flex-col justify-between">
                <span className="text-3xl font-serif font-bold text-luxury-gold mb-4 block">{s.step}</span>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900 mb-2">{s.title}</h3>
                  <p className="text-stone-600 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. AUTHENTIC CLIENT TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-24 relative bg-[#FAF8F5] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
              Real Client Feedback
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-4">
              What Mumbai Homeowners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.slice(0, 3).map((test) => (
              <div
                key={test.id}
                className="p-8 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
              >
                <p className="text-stone-700 text-sm leading-relaxed mb-6 italic">
                  "{test.content}"
                </p>
                <div>
                  <h4 className="text-stone-900 font-serif font-bold text-base">{test.name}</h4>
                  <span className="text-luxury-gold text-xs font-semibold">{test.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. MUMBAI INTERIOR FAQS ─────────────────────────────────────────── */}
      <section className="py-24 relative bg-[#F4F0E8] border-t border-luxury-gold/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-luxury-gold mb-3">
              Got Questions?
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-4">
              Frequently Asked Questions (Mumbai Interiors)
            </h2>
          </div>

          <div className="space-y-4">
            {MUMBAI_FAQS.map((faq, index) => (
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

      {/* ── 9. CONSULTATION BOOKING ─────────────────────────────────────────── */}
      <div id="consultation">
        <LeadCaptureForm 
          title="Ready to Transform Your Mumbai Home?"
          subtitle="Consult With Our Principal Team"
          description="Schedule a complimentary on-site measurement and 3D design consultation across MMR. Our team will review your floor plan, discuss material options, and provide a transparent itemized estimate."
        />
      </div>
    </div>
  );
};

export default MumbaiLanding;
