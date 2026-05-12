import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanyData } from '../hooks/useCompanyData';
import { usePageHeaders } from '../hooks/usePageHeaders';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import CinematicText from '../components/luxury/CinematicText';

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

// Luxury input wrapper
const LuxInput = ({
  label, id, name, type = 'text', value, onChange, placeholder, required = false,
}: {
  label: string; id: string; name: string; type?: string;
  value: string; onChange: (e: any) => void; placeholder?: string; required?: boolean;
}) => (
  <div className="relative group">
    <label htmlFor={id}
      className="block text-[9px] uppercase tracking-[0.25em] font-bold mb-2"
      style={{ color: 'rgba(197,160,89,0.7)' }}>
      {label}
    </label>
    <input
      type={type} id={id} name={name} value={value}
      onChange={onChange} placeholder={placeholder} required={required}
      className="w-full px-4 py-3.5 outline-none text-white text-sm transition-all duration-300"
      style={{
        background: 'rgba(6,6,6,0.8)',
        border: '1px solid rgba(197,160,89,0.15)',
        borderRadius: '2px',
        color: 'rgba(255,255,255,0.85)',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(197,160,89,0.15)'; }}
      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  </div>
);

const LuxSelect = ({
  label, id, name, value, onChange, required = false, children,
}: {
  label: string; id: string; name: string; value: string;
  onChange: (e: any) => void; required?: boolean; children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={id} className="block text-[9px] uppercase tracking-[0.25em] font-bold mb-2"
      style={{ color: 'rgba(197,160,89,0.7)' }}>{label}</label>
    <select id={id} name={name} value={value} onChange={onChange} required={required}
      className="w-full px-4 py-3.5 outline-none text-sm transition-all duration-300"
      style={{
        background: 'rgba(6,6,6,0.8)', border: '1px solid rgba(197,160,89,0.15)',
        borderRadius: '2px', color: 'rgba(255,255,255,0.85)',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.6)'; }}
      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.15)'; }}>
      {children}
    </select>
  </div>
);

const Contact: React.FC = () => {
  const { contactInfo } = useCompanyData();
  const { headers } = usePageHeaders();
  const { incrementInquiryCount } = useProjects();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const projectContext = location.state?.projectContext as { id: string; title: string } | undefined;

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', projectType: '', budget: '', notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    searchParams.get('sent') === '1' ? 'success' : 'idle'
  );

  React.useEffect(() => {
    if (searchParams.get('sent') === '1') {
      const p = new URLSearchParams(searchParams); p.delete('sent');
      setSearchParams(p, { replace: true });
    }
    const fetchGeo = async () => {
      try {
        const r = await fetch('https://ipapi.co/json/').catch(() => null);
        if (r?.ok) { const d = await r.json(); if (d.city) setFormData(prev => ({ ...prev, city: d.city })); }
      } catch {}
    };
    fetchGeo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const subject = searchParams.get('subject');
      const designId = searchParams.get('designId');
      const payload = {
        ...formData,
        city: formData.city || 'Undetected',
        projectType: formData.projectType || 'General Inquiry',
        budget: formData.budget || 'Not specified',
        projectContext: projectContext || null,
        referredDesign: projectContext?.title || subject || 'None',
        referredDesignId: projectContext?.id || designId || null,
        source: projectContext ? `Project Showcase: ${projectContext.title}` : 'Direct Contact Form',
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'leads'), payload);
      const form = document.createElement('form');
      form.action = `https://formsubmit.co/${encodeURIComponent(contactInfo.email)}`;
      form.method = 'POST';
      Object.entries(payload).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden'; input.name = k; input.value = String(v);
        form.appendChild(input);
      });
      const sub = document.createElement('input'); sub.type = 'hidden'; sub.name = '_subject';
      sub.value = projectContext ? `Booking: ${projectContext.title}` : (subject ? `Inquiry for ${subject}` : 'Inquiry from Sonu Enterprises');
      form.appendChild(sub);
      const next = document.createElement('input'); next.type = 'hidden'; next.name = '_next';
      next.value = `${window.location.origin}/contact?sent=1`; form.appendChild(next);
      const cap = document.createElement('input'); cap.type = 'hidden'; cap.name = '_captcha'; cap.value = 'false';
      form.appendChild(cap);
      document.body.appendChild(form);
      if (projectContext?.id) await incrementInquiryCount(projectContext.id);
      form.submit();
      document.body.removeChild(form);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', city: '', projectType: '', budget: '', notes: '' });
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="text-white min-h-screen overflow-x-hidden" style={{ background: '#060606' }}>
      <SEO
        title="Contact Us | Sonu Enterprises"
        description="Get in touch for a free consultation. Luxury interior design services in Kalyan, Maharashtra."
        canonical="https://sonu-builders.in/contact"
      />

      {/* ── CINEMATIC HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={headers?.contact?.backgroundImage || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=100'}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.3) contrast(1.04) saturate(0.8)' }}
            alt="Contact Hero"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(4,4,4,0.9) 0%,rgba(4,4,4,0.4) 60%,transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(6,6,6,0.95) 0%,transparent 50%)' }} />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.07) 0%,transparent 70%)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}><Label>Get In Touch</Label></motion.div>
            <motion.h1 variants={fadeUp}
              className="text-6xl md:text-8xl font-bold leading-none mb-6"
              style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.03em' }}>
              Let's Start<br />
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Your Story.
              </span>
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" data-cinematic-section>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%,rgba(197,160,89,0.04) 0%,transparent 60%)' }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* ── LEFT: Contact info + map ──────────────────────────────────── */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
              <motion.div variants={fadeUp}><Label>Contact Information</Label></motion.div>
              <motion.h2 variants={fadeUp}
                className="text-4xl md:text-5xl font-bold text-white mb-10 leading-tight text-glow-gold"
                style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.02em' }}>
                We Are Here<br />
                <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  to Listen.
                </span>
              </motion.h2>

              <motion.div variants={fadeUp} className="space-y-6 mb-12">
                {[
                  { icon: Phone, label: 'Phone', value: contactInfo.phone, sub: 'Mon–Sat · 9am–6pm', href: `tel:${contactInfo.phone?.replace(/\s/g, '')}` },
                  { icon: Mail, label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
                  { icon: MapPin, label: 'Office', value: contactInfo.address, sub: null, href: 'https://www.google.com/maps/dir//Sonu+Enterprises+and+building+developers' },
                ].map((info, i) => (
                  <motion.a
                    key={i} href={info.href} target={i > 0 ? '_blank' : undefined} rel="noopener noreferrer"
                    className="flex items-start gap-5 group"
                    whileHover={{ x: 4 }} transition={{ duration: 0.3 }}>
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-[#c5a059]"
                      style={{ border: '1px solid rgba(197,160,89,0.2)', background: 'rgba(197,160,89,0.04)', borderRadius: '2px' }}>
                      <info.icon className="w-5 h-5 transition-colors duration-300" style={{ color: 'rgba(197,160,89,0.7)' }} />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: 'rgba(197,160,89,0.5)' }}>{info.label}</p>
                      <p className="text-sm font-medium text-white group-hover:text-[#c5a059] transition-colors duration-300">{info.value}</p>
                      {info.sub && <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(197,160,89,0.4)' }}>{info.sub}</p>}
                    </div>
                  </motion.a>
                ))}
              </motion.div>

              {/* Map */}
              <motion.div variants={fadeUp}
                className="relative overflow-hidden rounded-sm"
                style={{ height: '280px', border: '1px solid rgba(197,160,89,0.1)' }}>
                <div className="absolute inset-0 pointer-events-none z-10"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(197,160,89,0.12)' }} />
                <iframe
                  title="Sonu Enterprises Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120605.25598410501!2d72.93404914335936!3d19.1552305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bfb4b94582cd%3A0xc0e9efc260246a09!2sSonu%20Enterprises%20and%20building%20developers!5e0!3m2!1sen!2sus!4v1776269945283!5m2!1sen!2sus"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'grayscale(80%) contrast(0.9) brightness(0.7)' }}
                  allowFullScreen loading="lazy"
                />
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Glassmorphism form ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <div className="relative overflow-hidden rounded-sm p-8 md:p-10"
                style={{
                  background: 'rgba(8,8,8,0.85)',
                  border: '1px solid rgba(197,160,89,0.15)',
                  backdropFilter: 'blur(20px)',
                }}>
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                  style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.08) 0%,transparent 70%)', filter: 'blur(30px)' }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <Label>Send Message</Label>
                      <h3 className="text-2xl font-bold text-white"
                        style={{ fontFamily: "'Cormorant Garamond',serif" }}>Book Your Consultation</h3>
                    </div>
                    {projectContext && (
                      <div className="px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-bold flex-shrink-0"
                        style={{ border: '1px solid rgba(197,160,89,0.3)', color: GOLD, background: 'rgba(197,160,89,0.05)', borderRadius: '2px' }}>
                        {projectContext.title}
                      </div>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {status === 'success' ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                        className="py-16 text-center">
                        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 rounded-sm"
                          style={{ background: `linear-gradient(135deg,${GOLD},#b08d42)` }}>
                          <Send className="w-7 h-7 text-black" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3"
                          style={{ fontFamily: "'Cormorant Garamond',serif" }}>Message Delivered</h3>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          Our design experts will review your details and contact you shortly.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form" onSubmit={handleSubmit}
                        initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <LuxInput label="Full Name" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                          <LuxInput label="Phone Number" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 ..." required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <LuxInput label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                          <LuxInput label="City" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Your city" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <LuxSelect label="Project Type" id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} required>
                            <option value="">Select an option...</option>
                            <option>Residential Interiors</option>
                            <option>Commercial / Office</option>
                            <option>Turnkey Architecture</option>
                            <option>Renovation & Remodeling</option>
                            <option>Other</option>
                          </LuxSelect>
                          <LuxSelect label="Estimated Budget" id="budget" name="budget" value={formData.budget} onChange={handleChange}>
                            <option value="">Not decided yet</option>
                            <option>Under ₹5 Lakhs</option>
                            <option>₹5L – ₹15 Lakhs</option>
                            <option>₹15L – ₹30 Lakhs</option>
                            <option>Above ₹30 Lakhs</option>
                          </LuxSelect>
                        </div>
                        <div>
                          <label htmlFor="notes" className="block text-[9px] uppercase tracking-[0.25em] font-bold mb-2"
                            style={{ color: 'rgba(197,160,89,0.7)' }}>Notes & Description</label>
                          <textarea id="notes" name="notes" rows={4} required
                            value={formData.notes} onChange={handleChange}
                            placeholder="Describe your vision, specific requirements, layout details..."
                            className="w-full px-4 py-3.5 outline-none text-sm transition-all duration-300 resize-none"
                            style={{ background: 'rgba(6,6,6,0.8)', border: '1px solid rgba(197,160,89,0.15)', borderRadius: '2px', color: 'rgba(255,255,255,0.85)' }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.6)'; }}
                            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.15)'; }}
                          />
                        </div>
                        <motion.button
                          type="submit" disabled={status === 'submitting'}
                          className="w-full relative inline-flex items-center justify-center gap-3 py-4 text-[11px] uppercase tracking-[0.3em] font-bold overflow-hidden"
                          style={{ background: `linear-gradient(135deg,${GOLD},#b08d42)`, color: '#000', borderRadius: '2px', opacity: status === 'submitting' ? 0.7 : 1 }}
                          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <span className="light-streak" />
                          <span className="relative z-10 flex items-center gap-2">
                            {status === 'submitting' ? 'Sending...' : (<>Send Message <Send className="w-3.5 h-3.5" /></>)}
                          </span>
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom gold line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.4),transparent)' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
