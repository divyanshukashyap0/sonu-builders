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

export interface HeroSlideItem {
  url: string;
  category: string;
  title: string;
}

interface HeroProps {
  heroImages?: string[];
  heroSlides?: HeroSlideItem[];
  heroIndex: number;
  phone?: string;
  onSelectSlide?: (index: number) => void;
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
const CinematicHero: React.FC<HeroProps> = ({ heroImages = [], heroSlides, heroIndex, phone, onSelectSlide }) => {
  const currentSlide: HeroSlideItem = heroSlides?.[heroIndex] || {
    url: heroImages[heroIndex] || heroSlides?.[0]?.url || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80',
    category: 'Full Home Interior',
    title: 'Luxury Architecture',
  };
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

      // Ambient light pulse — GPU-friendly opacity pulse without scale or filter
      gsap.to('.hero-light-orb', {
        opacity: 0.45,
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
      { scale: 1.05 },
      { scale: 1, duration: 6, ease: 'power2.out' }
    );
  }, [heroIndex]);

  const whatsappMessage = encodeURIComponent("Hi Sonu Enterprises, I'm interested in your interior design services.");

  const titleWords = ["We Design", "Spaces", "You'll Love"];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[640px] md:min-h-[86vh] lg:min-h-[90vh] flex flex-col justify-center pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-20 overflow-hidden bg-[#161514] dark:bg-[#121212]"
      style={{ perspective: '1200px' }}
    >
      {/* ── Layer 0: Cinematic Background Image (Vibrant & Rich) ─────────────── */}
      <motion.div
        className="hero-image-wrap absolute inset-0 z-0"
        style={{ x: imgX, y: imgY, scale: 1 }}
      >
        <div ref={imageRef} className="w-full h-full">
          <AnimatePresence mode="sync">
            <motion.img
              key={heroIndex}
              src={getOptimizedImageUrl(currentSlide.url, 1920)}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              alt={`${currentSlide.category} - ${currentSlide.title} | Sonu Enterprises Luxury Architecture`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.98) contrast(1.06) saturate(1.08)' }}
            />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Layer 1: Directional Scrim for Editorial Readability (Preserving Image Richness) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Balanced, non-milky scrim for light mode */}
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background: 'linear-gradient(to right, rgba(250, 248, 245, 0.72) 0%, rgba(250, 248, 245, 0.42) 38%, rgba(250, 248, 245, 0.12) 68%, transparent 100%)',
          }}
        />
        {/* Subtle top gradient to ensure navbar seamlessness */}
        <div
          className="absolute top-0 left-0 right-0 h-28 pointer-events-none dark:hidden"
          style={{
            background: 'linear-gradient(to bottom, rgba(250, 248, 245, 0.6) 0%, transparent 100%)',
          }}
        />
        {/* Dark scrim for dark mode */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background: 'linear-gradient(to right, rgba(18, 18, 18, 0.92) 0%, rgba(18, 18, 18, 0.80) 35%, rgba(18, 18, 18, 0.40) 60%, rgba(18, 18, 18, 0.08) 85%, transparent 100%)',
          }}
        />
        {/* Refined bottom blend into stats */}
        <div
          className="absolute bottom-0 left-0 right-0 h-14 dark:hidden"
          style={{
            background: 'linear-gradient(to top, rgba(250, 248, 245, 0.75) 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-16 hidden dark:block"
          style={{
            background: 'linear-gradient(to top, #121212 0%, rgba(18, 18, 18, 0) 100%)',
          }}
        />
      </div>

      {/* ── Layer 2: Ambient Warm Glow (Subtle) ─────────────────────────────────── */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ x: lightX }}>
        <div
          className="hero-light-orb absolute w-[700px] h-[700px] rounded-full opacity-25"
          style={{
            top: '-20%',
            left: '-15%',
            background: 'radial-gradient(circle, rgba(197,160,89,0.2) 0%, transparent 70%)',
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
        className="relative z-30 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 md:px-14 lg:px-20"
        style={{ x: textX, y: textY }}
      >
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <div className="hero-eyebrow flex items-center gap-2.5 mb-4">
            <span className="w-6 h-[2px] bg-[#805B10] dark:bg-[#c5a059]" />
            <p
              className="text-[#805B10] dark:text-[#E2BD68] text-[11px] font-extrabold uppercase tracking-[0.25em] drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              LUXURY INTERIOR DESIGN &amp; CONSTRUCTION &bull; MUMBAI
            </p>
          </div>

          {/* Cinematic Title (H1) */}
          <h1
            className="mb-5 leading-[1.08] tracking-tight text-[#0D0D0D] dark:text-[#FAF8F5]"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 'clamp(2.4rem, 5.2vw, 4.75rem)',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="block overflow-hidden">
              <span className="hero-word inline-block drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                WHERE VISION
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="hero-word inline-block italic font-bold text-[#805B10] dark:text-[#E5C07B] drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
              >
                MEETS EXCEPTIONAL
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-word inline-block drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                DESIGN.
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle text-[#1A1A1A] dark:text-[#FAF8F5] text-base md:text-lg font-medium leading-relaxed mb-8 max-w-xl drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Thoughtfully designed interiors and expertly executed spaces, created around the way you live and work.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 sm:items-center">
            {/* Primary: Consultation (Dominant) */}
            <Link
              to="/contact"
              className="hero-cta group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xs text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 shadow-md text-center bg-[#171717] text-[#FAF8F5] border border-[#171717] dark:bg-[#FAF8F5] dark:text-[#171717] dark:border-[#FAF8F5] hover:!bg-[#8C6D23] hover:!border-[#8C6D23] hover:!text-white"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#c5a059] group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Secondary: Projects */}
            <Link
              to="/services"
              className="hero-cta group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xs text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 bg-white/90 dark:bg-stone-900/80 backdrop-blur-xs border border-stone-300 dark:border-stone-700 text-[#171717] dark:text-[#FAF8F5] hover:border-[#8C6D23] hover:text-[#8C6D23] dark:hover:border-[#c5a059] dark:hover:text-[#c5a059] shadow-xs text-center"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8C6D23] dark:text-[#c5a059] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Layer 6: Scroll Indicator ────────────────────────────────────────── */}
      <div className="hero-scroll-hint hidden md:flex absolute bottom-24 right-12 z-40 flex-col items-center gap-3" style={{ opacity: 0 }}>
        <span
          className="text-[9px] uppercase tracking-[0.35em] font-bold"
          style={{
            color: '#8C6D23',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-14"
          style={{ background: 'linear-gradient(to bottom, rgba(197,160,89,0.8), transparent)' }}
          animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Layer 7: Subtle Edge Accent ──────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px rgba(197,160,89,0.05)',
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
