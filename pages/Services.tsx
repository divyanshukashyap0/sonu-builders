import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { usePageHeaders } from '../hooks/usePageHeaders';
import SEO from '../components/SEO';
import * as Icons from 'lucide-react';
import CinematicText from '../components/luxury/CinematicText';
import { getOptimizedImageUrl } from '../utils/performance';

const GOLD = '#c5a059';
const GOLD_LIGHT = '#e8d5a3';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const Label = ({ children }: { children: string }) => (
  <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-4 flex items-center gap-3" style={{ color: GOLD }}>
    <span className="w-8 h-[1px] inline-block" style={{ background: `linear-gradient(90deg,${GOLD},transparent)` }} />
    {children}
  </p>
);

const getIcon = (iconName: string) => {
  const IconComp = (Icons as any)[iconName] || Icons.Home;
  return <IconComp className="w-6 h-6" />;
};

const Services: React.FC = () => {
  const { services, loading } = useServices();
  const { headers } = usePageHeaders();
  const [hovered, setHovered] = useState<string | null>(null);

  const bgImage = headers?.services?.backgroundImage ||
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=100';

  return (
    <div className="text-white min-h-screen overflow-x-hidden" style={{ background: '#060606' }}>
      <SEO
        title="Premium Services | Sonu Enterprises"
        description="World-class interior design and construction services — living rooms, kitchens, bedrooms, and more."
        canonical="https://sonu-builders.in/services"
      />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={getOptimizedImageUrl(bgImage, 1920)} className="w-full h-full object-cover"
            style={{ filter: 'contrast(1.04) saturate(0.8) brightness(0.35)' }} alt="Services Hero" />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(4,4,4,0.9) 0%,rgba(4,4,4,0.4) 60%,transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(6,6,6,0.95) 0%,transparent 50%)' }} />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.08) 0%,transparent 70%)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}><Label>Our Expertise</Label></motion.div>
            <motion.h1 variants={fadeUp}
              className="text-6xl md:text-8xl font-bold leading-none mb-6"
              style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.03em' }}>
              Premium<br />
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Services
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-lg">
              Complete interior solutions crafted with precision, passion, and an eye for luxury.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICE GRID — cinematic cards ────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden" data-cinematic-section>
        <div className="absolute top-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.04) 0%,transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-20"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}><Label>Core Offerings</Label></motion.div>
            <motion.h2 variants={fadeUp}
              className="text-5xl md:text-6xl font-bold text-white text-glow-gold"
              style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.02em' }}>
              Crafted for <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Your Vision</span>
            </motion.h2>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-sm" style={{ background: 'rgba(197,160,89,0.04)' }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  onHoverStart={() => setHovered(service.id)}
                  onHoverEnd={() => setHovered(null)}
                >
                  <Link to={`/services/${service.id}`}
                    className="block group relative overflow-hidden rounded-sm h-full"
                    style={{ border: '1px solid rgba(197,160,89,0.08)' }}>

                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={service.image || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: hovered === service.id ? 1.08 : 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        style={{ filter: 'brightness(0.7) contrast(1.04)' }}
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(4,4,4,0.8) 0%,transparent 60%)' }} />

                      {/* Icon badge */}
                      <div className="absolute top-5 left-5 w-12 h-12 flex items-center justify-center"
                        style={{ background: 'rgba(4,4,4,0.7)', border: `1px solid rgba(197,160,89,0.4)`, backdropFilter: 'blur(8px)', borderRadius: '2px', color: GOLD }}>
                        {getIcon(service.icon as any)}
                      </div>

                      {/* Hover gold shimmer overlay */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: hovered === service.id ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ background: 'linear-gradient(135deg,rgba(197,160,89,0.06) 0%,transparent 60%)' }}
                      />

                      {/* Top gold line on hover */}
                      <motion.div
                        className="absolute top-0 left-0 right-0 h-[1px]"
                        animate={{ scaleX: hovered === service.id ? 1 : 0, opacity: hovered === service.id ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)`, transformOrigin: 'left' }}
                      />
                    </div>

                    {/* Info panel */}
                    <div className="p-7" style={{ background: 'rgba(6,6,6,0.92)', borderTop: '1px solid rgba(197,160,89,0.06)' }}>
                      <h3 className="text-xl font-bold text-white mb-2"
                        style={{ fontFamily: "'Cormorant Garamond',serif" }}>{service.title}</h3>
                      <p className="text-sm leading-relaxed line-clamp-2 mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                        style={{ color: GOLD }}>
                        <span>Explore Service</span>
                        <motion.div animate={{ x: hovered === service.id ? 4 : 0 }} transition={{ duration: 0.3 }}>
                          <ArrowRight className="w-3 h-3" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Inset gold border on hover */}
                    <motion.span
                      className="absolute inset-0 pointer-events-none rounded-sm"
                      animate={{ opacity: hovered === service.id ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                      style={{ boxShadow: 'inset 0 0 0 1px rgba(197,160,89,0.35)' }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── EDITORIAL QUOTE ───────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden" style={{ background: '#080808' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(197,160,89,0.05) 0%,transparent 60%)' }} />
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.2),transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.1),transparent)' }} />

        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <Label>Every Detail Matters</Label>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 leading-tight text-glow-white"
              style={{ fontFamily: "'Cormorant Garamond',serif" }}>
              Need a Bespoke Solution?
            </h2>
            <p className="text-base leading-relaxed mb-12 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Every project is unique. We offer tailored interior packages crafted specifically for your lifestyle and vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-bold overflow-hidden"
                style={{ background: `linear-gradient(135deg,${GOLD},#b08d42)`, color: '#000', borderRadius: '2px', boxShadow: '0 0 40px rgba(197,160,89,0.2)' }}>
                <span className="light-streak" />
                <span className="relative z-10 flex items-center gap-2">Discuss Your Project <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
              <Link to="/contact"
                className="shimmer-hover inline-flex items-center justify-center gap-2 px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-bold"
                style={{ border: '1px solid rgba(197,160,89,0.3)', color: GOLD, borderRadius: '2px', backdropFilter: 'blur(12px)' }}>
                Book Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
