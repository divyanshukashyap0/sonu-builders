import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown, Building2, Users, Award, ShieldCheck } from 'lucide-react';
import usePerformanceTier from '../../hooks/usePerformanceTier';
import { getOptimizedImageUrl } from '../../utils/performance';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  delay: number;
}

interface HeroProps {
  heroImages: string[];
  heroIndex: number;
  phone?: string;
}

// ─── Particle Generator ────────────────────────────────────────────────────────
function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.6 + 0.1,
    speed: Math.random() * 20 + 15,
    drift: (Math.random() - 0.5) * 30,
    delay: Math.random() * 8,
  }));
}

const PARTICLES = generateParticles(20);

// ─── Stats Data ────────────────────────────────────────────────────────────────
const STATS = [
  { icon: Building2, value: '4500+', label: 'Projects Completed' },
  { icon: Users, value: '4000+', label: 'Happy Families' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: ShieldCheck, value: 'Premium', label: 'Quality Assurance' },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const CinematicHero: React.FC<HeroProps> = ({ heroImages, heroIndex, phone }) => {
  const { particlesOk, parallaxOk } = usePerformanceTier();
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lightBeamRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mouse parallax motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 40, damping: 25 });
  const springY = useSpring(rawY, { stiffness: 40, damping: 25 });

  // Parallax layers
  const imgX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const imgY = useTransform(springY, [-0.5, 0.5], [-12, 12]);
  const textX = useTransform(springX, [-0.5, 0.5], [8, -8]);
  const textY = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const particleX = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const particleY = useTransform(springY, [-0.5, 0.5], [14, -14]);
  const lightX = useTransform(springX, [-0.5, 0.5], [-40, 40]);

  // ── Mouse tracking ──────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set((e.clientX - left) / width - 0.5);
    rawY.set((e.clientY - top) / height - 0.5);
  }, [rawX, rawY]);

  useEffect(() => {
    if (!parallaxOk) return;
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, parallaxOk]);

  // ── GSAP entrance timeline ──────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Cinematic reveal: image scale + fade
      tl.fromTo('.hero-image-wrap', {
        scale: 1.15,
        opacity: 0,
      }, {
        scale: 1,
        opacity: 1,
        duration: 2.4,
        ease: 'expo.out',
      })
      // Gold horizontal divider
      .fromTo('.hero-divider', {
        scaleX: 0,
        opacity: 0,
      }, {
        scaleX: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.inOut',
      }, '-=1.6')
      // Eyebrow label
      .fromTo('.hero-eyebrow', {
        y: 20,
        opacity: 0,
        letterSpacing: '0.5em',
      }, {
        y: 0,
        opacity: 1,
        letterSpacing: '0.3em',
        duration: 1,
        ease: 'power3.out',
      }, '-=1.2')
      // Title word by word
      .fromTo('.hero-word', {
        y: 80,
        opacity: 0,
        rotateX: 45,
      }, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
      }, '-=0.8')
      // Subtitle
      .fromTo('.hero-subtitle', {
        y: 24,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
      }, '-=0.6')
      // CTA buttons
      .fromTo('.hero-cta', {
        y: 20,
        opacity: 0,
        scale: 0.96,
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'back.out(1.3)',
      }, '-=0.5')
      // Scroll indicator
      .fromTo('.hero-scroll-hint', {
        opacity: 0,
        y: -10,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.2')
      // Stats
      .fromTo('.hero-stat', {
        opacity: 0,
        y: 30,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      }, '-=0.3');

      // Continuous ambient light pulse
      gsap.to('.hero-light-orb', {
        opacity: 0.35,
        scale: 1.08,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 1.5,
      });

      setIsLoaded(true);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Slow zoom on image transition ───────────────────────────────────────────
  useEffect(() => {
    if (!imageRef.current) return;
    gsap.fromTo(imageRef.current,
      { scale: 1.08 },
      { scale: 1, duration: 6, ease: 'power2.out' }
    );
  }, [heroIndex]);

  const whatsappMessage = encodeURIComponent("Hi Sonu Enterprises, I'm interested in your interior design services.");

  const titleWords = ["We Design", "Spaces", "You'll Love"];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#080808]"
      style={{ perspective: '1200px' }}
    >
      {/* ── Layer 0: Cinematic Background Image ──────────────────────────────── */}
      <motion.div
        className="hero-image-wrap absolute inset-0 z-0"
        style={{ x: imgX, y: imgY, scale: 1 }}
      >
        <div ref={imageRef} className="w-full h-full">
          <AnimatePresence mode="sync">
            <motion.img
              key={heroIndex}
              src={getOptimizedImageUrl(heroImages[heroIndex], 1920)}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              alt="Luxury Interior"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.6) contrast(1.1) saturate(0.85)' }}
            />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Layer 1: Cinematic Gradient Stack ──────────────────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Bottom-to-top vignette (dominant) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#06060680] to-transparent" />
        {/* Top shadow for navbar contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        {/* Left editorial shadow */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        {/* Cinematic grain vignette */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px',
          }}
        />
      </div>

      {/* ── Layer 2: Ambient Gold Light Orbs ──────────────────────────────────── */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ x: lightX }}>
        {/* Primary orb — warm gold at top-left */}
        <div
          className="hero-light-orb absolute w-[900px] h-[900px] rounded-full opacity-20"
          style={{
            top: '-25%',
            left: '-20%',
            background: 'radial-gradient(circle, rgba(197,160,89,0.45) 0%, rgba(197,160,89,0.08) 50%, transparent 75%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Secondary orb — cooler at right */}
        <div
          className="hero-light-orb absolute w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            top: '20%',
            right: '-15%',
            background: 'radial-gradient(circle, rgba(230,210,160,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Floor reflection */}
        <div
          className="hero-light-orb absolute w-[800px] h-[400px] rounded-full opacity-10"
          style={{
            bottom: '-10%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(197,160,89,0.25) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </motion.div>

      {/* ── Layer 3: Animated Luxury Particles ─────────────────────────────────── */}
      {particlesOk && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
          style={{ x: particleX, y: particleY }}
        >
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.id % 3 === 0
                  ? `rgba(197,160,89,${p.opacity})`
                  : p.id % 3 === 1
                    ? `rgba(230,215,170,${p.opacity * 0.6})`
                    : `rgba(255,255,255,${p.opacity * 0.3})`,
                boxShadow: p.id % 3 === 0 ? `0 0 ${p.size * 3}px rgba(197,160,89,0.5)` : 'none',
              }}
              animate={{
                y: [0, -110 - p.speed * 3, -220 - p.speed * 6],
                x: [0, p.drift, p.drift * 1.5],
                opacity: [0, p.opacity, 0],
                scale: [0.5, 1, 0.3],
              }}
              transition={{
                duration: p.speed,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>
      )}

      {/* ── Layer 4: Hero Content ──────────────────────────────────────────────── */}
      <motion.div
        ref={textRef}
        className="relative z-30 flex flex-col justify-center min-h-screen px-6 md:px-16 lg:px-24 pt-28 md:pt-0"
        style={{ x: textX, y: textY }}
      >
        <div className="max-w-5xl">

          {/* Gold horizontal divider */}
          <div
            className="hero-divider w-16 h-[1px] mb-8 origin-left"
            style={{ background: 'linear-gradient(90deg, #c5a059, #e8d5a3, transparent)' }}
          />

          {/* Eyebrow */}
          <p
            className="hero-eyebrow text-[#c5a059] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: "'Inter', sans-serif", opacity: 0 }}
          >
            Premium Interior Solutions
          </p>

          {/* Cinematic Title */}
          <h1
            className="mb-6 leading-[0.9] md:leading-[0.88]"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 'clamp(3.5rem, 9vw, 9rem)',
              color: '#f5f0e8',
              letterSpacing: '-0.02em',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Line 1 */}
            <span className="block overflow-hidden">
              <span className="hero-word inline-block" style={{ opacity: 0 }}>We Design</span>
            </span>
            {/* Line 2 — gold accent */}
            <span className="block overflow-hidden">
              <span
                className="hero-word inline-block"
                style={{
                  opacity: 0,
                  color: '#c5a059',
                }}
              >
                Spaces
              </span>
            </span>
            {/* Line 3 */}
            <span className="block overflow-hidden">
              <span className="hero-word inline-block" style={{ opacity: 0 }}>You'll Love</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle text-[#b8a88a] text-base md:text-xl font-light leading-relaxed mb-10 max-w-xl"
            style={{ fontFamily: "'Inter', sans-serif", opacity: 0, letterSpacing: '0.02em' }}
          >
            Transforming dream spaces into timeless luxury —<br className="hidden md:block" />
            where architecture meets artistry.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/projects"
              className="hero-cta group relative inline-flex items-center justify-center overflow-hidden"
              style={{ opacity: 0 }}
            >
              {/* Glow layer */}
              <span
                className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(197,160,89,0.4), rgba(232,213,163,0.2))',
                  boxShadow: '0 0 40px 10px rgba(197,160,89,0.3), inset 0 0 20px rgba(197,160,89,0.1)',
                  filter: 'blur(1px)',
                }}
              />
              <span
                className="relative z-10 flex items-center gap-3 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-all duration-300 group-hover:gap-4"
                style={{ background: 'linear-gradient(135deg, #c5a059 0%, #e8d5a3 50%, #c5a059 100%)', borderRadius: '2px' }}
              >
                View Projects
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              to="/contact"
              className="hero-cta group relative inline-flex items-center justify-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-500 overflow-hidden"
              style={{
                opacity: 0,
                border: '1px solid rgba(197,160,89,0.35)',
                color: '#c5a059',
                borderRadius: '2px',
                backdropFilter: 'blur(12px)',
                background: 'rgba(197,160,89,0.04)',
              }}
            >
              {/* Hover fill */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'rgba(197,160,89,0.08)', borderRadius: '2px' }}
              />
              {/* Subtle glow on hover */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ boxShadow: 'inset 0 0 20px rgba(197,160,89,0.12), 0 0 20px rgba(197,160,89,0.15)' }}
              />
              <span className="relative z-10 flex items-center gap-3 group-hover:gap-4 transition-all duration-300">
                Book Consultation
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Layer 5: Glassmorphism Stats Panel ─────────────────────────────────── */}
      <div className="relative z-40 md:absolute md:bottom-0 md:left-0 md:right-0 mt-auto">
        <div
          className="mx-4 md:mx-0 mb-4 md:mb-0 rounded-t-xl md:rounded-none"
          style={{
            background: 'rgba(6,6,6,0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(197,160,89,0.12)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-5 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <React.Fragment key={stat.label}>
                    <div className="hero-stat flex items-center gap-3 md:gap-4" style={{ opacity: 0 }}>
                      {/* Icon */}
                      <div
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(197,160,89,0.1)',
                          border: '1px solid rgba(197,160,89,0.2)',
                        }}
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.5} style={{ color: '#c5a059' }} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg md:text-xl leading-none mb-0.5"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {stat.value}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest"
                          style={{ color: 'rgba(197,160,89,0.7)' }}>
                          {stat.label}
                        </p>
                      </div>
                    </div>
                    {/* Vertical divider — desktop only */}
                    {i < STATS.length - 1 && (
                      <div className="hidden md:block w-[1px] mx-auto self-stretch my-2"
                        style={{ background: 'rgba(197,160,89,0.12)' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Layer 6: Scroll Indicator ────────────────────────────────────────── */}
      <div className="hero-scroll-hint hidden md:flex absolute bottom-24 right-12 z-40 flex-col items-center gap-3" style={{ opacity: 0 }}>
        <span
          className="text-[9px] uppercase tracking-[0.35em] font-bold"
          style={{
            color: 'rgba(197,160,89,0.6)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-14"
          style={{ background: 'linear-gradient(to bottom, rgba(197,160,89,0.6), transparent)' }}
          animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Layer 7: Cinematic Blur Vignette Edges ─────────────────────────────── */}
      <div className="absolute inset-0 z-20 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 180px 60px rgba(3,3,3,0.6)',
        }}
      />

      {/* ── Layer 8: Architectural Line Accent ──────────────────────────────── */}
      <motion.div
        className="hidden md:block absolute z-30 pointer-events-none"
        style={{
          right: '10%',
          top: '20%',
          width: '1px',
          height: '200px',
          background: 'linear-gradient(to bottom, transparent, rgba(197,160,89,0.4), transparent)',
        }}
        animate={{ opacity: [0.4, 0.9, 0.4], scaleY: [0.8, 1, 0.8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hidden md:block absolute z-30 pointer-events-none"
        style={{
          right: '18%',
          top: '30%',
          width: '60px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.35), transparent)',
        }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </section>
  );
};

export default CinematicHero;
