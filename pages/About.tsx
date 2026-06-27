import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Building2, Users, Award, ShieldCheck,
  Target, Clock, Gem, ArrowRight, Phone, MessageCircle, Eye, Heart
} from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import SEO from '../components/SEO';
import CinematicText from '../components/luxury/CinematicText';

// ── Shared design tokens ────────────────────────────────────────────────────────
const GOLD = '#c5a059';
const GOLD_LIGHT = '#e8d5a3';
const BG = '#060606';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

const Label = ({ children }: { children: string }) => (
  <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-4 flex items-center gap-3"
    style={{ color: GOLD }}>
    <span className="w-8 h-[1px] inline-block" style={{ background: `linear-gradient(90deg,${GOLD},transparent)` }} />
    {children}
  </p>
);

const About: React.FC = () => {
  const { phone } = useCompanyData();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const whatsappMessage = encodeURIComponent("Hi Sonu Enterprises, I'd like to learn more about your services.");

  const values = [
    { icon: Gem, title: 'Premium Quality', desc: 'Finest materials, zero compromise.' },
    { icon: Users, title: 'Client First', desc: 'Your vision drives every decision we make.' },
    { icon: Target, title: 'Innovation', desc: 'Modern ideas married with timeless craft.' },
    { icon: ShieldCheck, title: 'Transparency', desc: 'Clear processes. Honest pricing. Always.' },
    { icon: Clock, title: 'On-Time Delivery', desc: 'We respect your time as much as our craft.' },
    { icon: Award, title: 'Excellence', desc: 'Perfection in design, execution, and finish.' },
  ];

  const stats = [
    { value: '4500+', label: 'Projects', icon: Building2 },
    { value: '4000+', label: 'Happy Families', icon: Heart },
    { value: '15+', label: 'Years', icon: Award },
    { value: '100%', label: 'Dedication', icon: Eye },
  ];

  const process = [
    { num: '01', title: 'Consultation', desc: 'We listen deeply to understand your vision, lifestyle, and aspirations.' },
    { num: '02', title: 'Concept Design', desc: 'Our architects craft bespoke design concepts tailored to your space.' },
    { num: '03', title: 'Material Selection', desc: 'Curated premium materials presented in an immersive showroom experience.' },
    { num: '04', title: 'Execution', desc: 'Master craftsmen bring every detail to life with surgical precision.' },
    { num: '05', title: 'Delivery', desc: 'White-glove handover — your luxury space, perfected and on time.' },
  ];

  return (
    <div className="text-white min-h-screen overflow-x-hidden" style={{ background: BG }}>
      <SEO
        title="About Us | Sonu Enterprises"
        description="15 years of luxury interiors & architectural excellence in Maharashtra."
        canonical="https://sonu-builders.in/about"
      />

      {/* ── 1. CINEMATIC HERO ──────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        {/* Parallax BG */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop"
            className="w-full h-full object-cover"
            style={{ filter: 'contrast(1.05) saturate(0.85) brightness(0.45)' }}
            alt="About Hero"
          />
        </motion.div>
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(4,4,4,0.85) 0%,rgba(4,4,4,0.4) 60%,transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(6,6,6,0.9) 0%,transparent 50%)' }} />

        {/* Gold side light */}
        <div className="absolute right-0 top-1/4 w-[400px] h-[400px] pointer-events-none"
          style={{ background: `radial-gradient(circle,rgba(197,160,89,0.1) 0%,transparent 70%)`, filter: 'blur(60px)' }} />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24"
          style={{ opacity: heroOpacity }}
          initial="hidden" animate="show" variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <Label>About Us</Label>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-8xl lg:text-[9rem] font-bold leading-none mb-8"
            style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.03em' }}
          >
            Designing
            <br />
            <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Lifestyles.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-xl leading-relaxed mb-10">
            We blend creativity, functionality, and craftsmanship to create interiors that are timeless and uniquely yours.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/projects" className="group inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-bold shimmer-hover"
              style={{ border: `1px solid rgba(197,160,89,0.4)`, color: GOLD, borderRadius: '2px' }}>
              Our Projects <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 flex flex-col items-center gap-2"
          style={{ translateX: '-50%' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[8px] uppercase tracking-[0.3em]" style={{ color: 'rgba(197,160,89,0.6)' }}>Scroll</span>
          <div className="w-[1px] h-10" style={{ background: `linear-gradient(to bottom,${GOLD},transparent)` }} />
        </motion.div>
      </section>

      {/* ── 2. BRAND PHILOSOPHY ────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden" data-cinematic-section>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,rgba(197,160,89,0.05) 0%,transparent 70%)`, filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
              <motion.div variants={fadeUp}><Label>Who We Are</Label></motion.div>
              <motion.h2 variants={fadeUp}
                className="text-5xl md:text-6xl font-bold text-white mb-10 leading-tight text-glow-gold"
                style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.02em' }}>
                Passion.<br />Precision.<br />
                <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Perfection.</span>
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <p><strong className="text-white">SONU ENTERPRISES</strong> is a leading interior construction and design company based in Kalyan, Maharashtra. With over 15 years of experience, we have transformed 4500+ spaces across residential and commercial projects.</p>
                <p>Our mission is simple — to deliver luxury interiors that reflect your personality and enhance the way you live. Every project we undertake is handled with meticulous attention to detail and a commitment to excellence.</p>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(197,160,89,0.12)' }}>
                <p className="italic text-2xl" style={{ fontFamily: "'Cormorant Garamond',serif", color: GOLD }}>Sonu Enterprises</p>
                <p className="text-[9px] uppercase tracking-[0.3em] mt-1" style={{ color: 'rgba(197,160,89,0.5)' }}>Founder</p>
              </motion.div>
            </motion.div>

            {/* Stats grid */}
            <motion.div className="grid grid-cols-2 gap-4"
              initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
              {stats.map((stat, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="relative p-8 group overflow-hidden"
                  style={{ border: '1px solid rgba(197,160,89,0.1)', background: 'rgba(197,160,89,0.02)', borderRadius: '2px' }}
                  whileHover={{ borderColor: 'rgba(197,160,89,0.4)', scale: 1.02 }}
                  transition={{ duration: 0.35 }}>
                  <stat.icon className="w-5 h-5 mb-5" style={{ color: 'rgba(197,160,89,0.5)' }} />
                  <p className="stat-number-cinematic mb-1">{stat.value}</p>
                  <p className="text-[9px] uppercase tracking-[0.25em] font-bold" style={{ color: 'rgba(197,160,89,0.5)' }}>{stat.label}</p>
                  {/* Hover gold corner */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: `linear-gradient(135deg,transparent 50%,rgba(197,160,89,0.2) 100%)` }} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. CINEMATIC QUOTE BREAK ───────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%,rgba(197,160,89,0.06) 0%,transparent 60%)` }} />
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg,transparent,rgba(197,160,89,0.2),transparent)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg,transparent,rgba(197,160,89,0.12),transparent)` }} />
        <div className="absolute top-8 left-8 text-[10rem] leading-none select-none pointer-events-none hidden md:block"
          style={{ fontFamily: "'Cormorant Garamond',serif", color: 'rgba(197,160,89,0.04)' }}>"</div>

        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-5xl font-bold leading-tight text-glow-white"
            style={{ fontFamily: "'Cormorant Garamond',serif", color: 'rgba(255,255,255,0.9)' }}>
            <CinematicText
              text="We don't just design interiors — we craft experiences that last a lifetime."
              delay={0.1}
              staggerDelay={0.05}
            />
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.3em] font-bold mt-8"
            style={{ color: 'rgba(197,160,89,0.5)' }}>
            — Sonu Enterprises Design Philosophy
          </motion.p>
        </div>
      </section>

      {/* ── 4. OUR STORY — editorial layout ───────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden" data-cinematic-section style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <motion.div className="relative"
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <div className="parallax-img-wrap aspect-[4/5] rounded-sm overflow-hidden"
                style={{ border: '1px solid rgba(197,160,89,0.1)' }}>
                <img
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200"
                  className="w-full h-full object-cover"
                  style={{ filter: 'contrast(1.04) saturate(0.9)' }}
                  alt="Our Story"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 p-8 hidden md:block"
                style={{ background: 'linear-gradient(135deg,#c5a059,#b08d42)', borderRadius: '2px', boxShadow: '0 20px 60px rgba(197,160,89,0.3)' }}>
                <div className="text-4xl font-bold text-black leading-none" style={{ fontFamily: "'Cormorant Garamond',serif" }}>15+</div>
                <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/70 mt-1">Years of<br />Excellence</div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
              <motion.div variants={fadeUp}><Label>Our Story</Label></motion.div>
              <motion.h2 variants={fadeUp}
                className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight text-glow-gold"
                style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.02em' }}>
                From a Vision to<br />
                <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Timeless Designs
                </span>
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <p>What started as a small passion for design has now grown into a trusted brand known for quality, transparency, and exceptional execution. Every project we undertake is a promise of our dedication towards perfection.</p>
                <p>We don't just design interiors, we craft experiences. Our team of expert designers and craftsmen work in harmony to bring your vision to life, ensuring that every corner of your home resonates with luxury and comfort.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5. OUR VALUES ─────────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden" data-cinematic-section>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 30% 50%,rgba(197,160,89,0.04) 0%,transparent 60%)` }} />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-20"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}><Label>Our Values</Label></motion.div>
            <motion.h2 variants={fadeUp}
              className="text-5xl md:text-6xl font-bold text-white text-glow-gold"
              style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.02em' }}>
              What We <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Stand For</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group relative p-10 overflow-hidden shimmer-hover"
                style={{ border: '1px solid rgba(197,160,89,0.08)', background: 'rgba(197,160,89,0.02)', borderRadius: '2px' }}
                whileHover={{ borderColor: 'rgba(197,160,89,0.35)', y: -4 }}>
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center mb-8 rounded-sm transition-all duration-400"
                  style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.2)' }}>
                  <v.icon className="w-5 h-5 transition-colors duration-400" style={{ color: GOLD }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3"
                  style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '0.02em' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{v.desc}</p>
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg,transparent 50%,rgba(197,160,89,0.12) 100%)' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. DESIGN PROCESS ────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden" data-cinematic-section style={{ background: '#080808' }}>
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.15),transparent)' }} />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-20"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}><Label>Our Process</Label></motion.div>
            <motion.h2 variants={fadeUp}
              className="text-5xl md:text-6xl font-bold text-white text-glow-gold"
              style={{ fontFamily: "'Cormorant Garamond',serif" }}>
              From Concept to <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Creation</span>
            </motion.h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[1px] hidden sm:block"
              style={{ background: 'linear-gradient(to bottom,transparent,rgba(197,160,89,0.15),transparent)' }} />

            <div className="space-y-12">
              {process.map((step, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Number bubble */}
                  <div className="relative z-10 w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ border: '1px solid rgba(197,160,89,0.4)', background: 'rgba(197,160,89,0.06)', color: GOLD, fontFamily: "'Cormorant Garamond',serif", fontSize: '20px', fontWeight: 700 }}>
                    {step.num}
                  </div>
                  {/* Content */}
                  <div className={`flex-1 p-8 ${i % 2 !== 0 ? 'md:text-right' : ''}`}
                    style={{ border: '1px solid rgba(197,160,89,0.07)', background: 'rgba(197,160,89,0.02)', borderRadius: '2px' }}>
                    <h3 className="text-2xl font-bold text-white mb-3"
                      style={{ fontFamily: "'Cormorant Garamond',serif" }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CTA ────────────────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden" data-cinematic-section>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 100%,rgba(197,160,89,0.1) 0%,transparent 65%)` }} />
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.3),transparent)' }} />

        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.div variants={fadeUp}><Label>Let's Create Together</Label></motion.div>
            <motion.h2 variants={fadeUp}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight text-glow-white"
              style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.02em' }}>
              Let's Create Something<br />
              <span style={{ background: `linear-gradient(135deg,${GOLD} 0%,${GOLD_LIGHT} 50%,${GOLD} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Beautiful Together.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base mb-12 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Your dream space is one conversation away.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-bold overflow-hidden"
                style={{ background: `linear-gradient(135deg,${GOLD},#b08d42)`, color: '#000', borderRadius: '2px', boxShadow: `0 0 40px rgba(197,160,89,0.2)` }}>
                <span className="light-streak" />
                <span className="relative z-10 flex items-center gap-2">Book Consultation <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
              <a href={`https://wa.me/${phone?.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                target="_blank" rel="noopener noreferrer"
                className="shimmer-hover inline-flex items-center justify-center gap-2 px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-bold transition-all duration-300"
                style={{ border: '1px solid rgba(197,160,89,0.3)', color: GOLD, borderRadius: '2px', backdropFilter: 'blur(12px)' }}>
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
