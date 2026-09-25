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
  label, id, name, type = 'text', value, onChange, placeholder, required = false, list,
}: {
  label: string; id: string; name: string; type?: string;
  value: string; onChange: (e: any) => void; placeholder?: string; required?: boolean; list?: string;
}) => (
  <div className="relative group">
    <label htmlFor={id}
      className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-stone-700">
      {label}
    </label>
    <input
      type={type} id={id} name={name} value={value} list={list}
      onChange={onChange} placeholder={placeholder} required={required}
      className="w-full px-4 py-3.5 outline-none text-stone-900 text-sm transition-all duration-300 placeholder-stone-400 bg-[#FAF8F5] border border-stone-300 rounded"
      onFocus={e => { e.currentTarget.style.borderColor = '#c5a059'; e.currentTarget.style.boxShadow = '0 0 0 1px #c5a059'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
      onBlur={e => { e.currentTarget.style.borderColor = '#D6D3D1'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = '#FAF8F5'; }}
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
    <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-stone-700">{label}</label>
    <select id={id} name={name} value={value} onChange={onChange} required={required}
      className="w-full px-4 py-3.5 outline-none text-sm transition-all duration-300 text-stone-900 bg-[#FAF8F5] border border-stone-300 rounded"
      onFocus={e => { e.currentTarget.style.borderColor = '#c5a059'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
      onBlur={e => { e.currentTarget.style.borderColor = '#D6D3D1'; e.currentTarget.style.backgroundColor = '#FAF8F5'; }}>
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
  const [honeypot, setHoneypot] = useState('');

  React.useEffect(() => {
    if (searchParams.get('sent') === '1') {
      const p = new URLSearchParams(searchParams); p.delete('sent');
      setSearchParams(p, { replace: true });
    }
    const fetchGeo = async () => {
      try {
        const cachedCity = localStorage.getItem('sonu_user_city');
        if (cachedCity) {
          setFormData(prev => ({ ...prev, city: cachedCity }));
          return;
        }
        const r = await fetch('https://ipapi.co/json/').catch(() => null);
        if (r?.ok) {
          const d = await r.json();
          if (d.city) {
            setFormData(prev => ({ ...prev, city: d.city }));
            localStorage.setItem('sonu_user_city', d.city);
          }
        }
      } catch {}
    };
    fetchGeo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      console.warn('Spam submission filtered via honeypot.');
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', city: '', projectType: '', budget: '', notes: '' });
      return;
    }
    setStatus('submitting');
    try {
      const subject = searchParams.get('subject');
      const designId = searchParams.get('designId');
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city || 'Undetected',
        projectType: formData.projectType || 'General Inquiry',
        budget: formData.budget || 'Not specified',
        notes: formData.notes || '',
        referredDesign: projectContext?.title || subject || 'None',
        referredDesignId: projectContext?.id || designId || null,
        source: projectContext ? `Project Showcase: ${projectContext.title}` : 'Direct Contact Form',
        _subject: projectContext ? `Booking: ${projectContext.title}` : (subject ? `Inquiry for ${subject}` : 'Inquiry from Sonu Enterprises'),
        _captcha: 'false'
      };

      // 1. Save lead details in Firestore
      await addDoc(collection(db, 'leads'), {
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
      });

      // 2. Post asynchronously to FormSubmit
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contactInfo.email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('FormSubmit AJAX post failed');
      }

      if (projectContext?.id) await incrementInquiryCount(projectContext.id);

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', city: '', projectType: '', budget: '', notes: '' });
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="text-stone-900 min-h-screen overflow-x-hidden" style={{ background: '#FAF8F5' }}>
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
            style={{ filter: 'brightness(0.9) contrast(1.02) saturate(0.9)' }}
            alt="Contact Hero"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(250,248,245,0.92) 0%,rgba(250,248,245,0.65) 60%,transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(250,248,245,0.95) 0%,transparent 50%)' }} />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.12) 0%,transparent 70%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}><Label>Get In Touch</Label></motion.div>
            <motion.h1 variants={fadeUp}
              className="text-6xl md:text-8xl font-bold leading-none mb-6 text-[#171717]"
              style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.03em' }}>
              Let's Start<br />
              <span style={{ background: `linear-gradient(135deg,${GOLD},#9A7836)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Your Story.
              </span>
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" data-cinematic-section>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%,rgba(197,160,89,0.06) 0%,transparent 60%)' }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* ── LEFT: Contact info + map ──────────────────────────────────── */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
              <motion.div variants={fadeUp}><Label>Contact Information</Label></motion.div>
              <motion.h2 variants={fadeUp}
                className="text-4xl md:text-5xl font-bold text-[#171717] mb-10 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.02em' }}>
                We Are Here<br />
                <span style={{ background: `linear-gradient(135deg,${GOLD},#9A7836)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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
                    className="flex items-start gap-5 group p-4 rounded-lg bg-white shadow-sm border border-stone-200 hover:border-luxury-gold/50 transition-all duration-300"
                    whileHover={{ x: 4 }} transition={{ duration: 0.3 }}>
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-all duration-300 rounded bg-luxury-gold/10 border border-luxury-gold/30">
                      <info.icon className="w-5 h-5 transition-colors duration-300 text-luxury-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1 text-stone-500">{info.label}</p>
                      <p className="text-sm font-semibold text-stone-900 group-hover:text-luxury-gold transition-colors duration-300">{info.value}</p>
                      {info.sub && <p className="text-[10px] uppercase tracking-widest mt-1 text-stone-500">{info.sub}</p>}
                    </div>
                  </motion.a>
                ))}
              </motion.div>

              {/* Map */}
              <motion.div variants={fadeUp}
                className="relative overflow-hidden rounded-lg shadow-sm"
                style={{ height: '280px', border: '1px solid rgba(197,160,89,0.3)' }}>
                <iframe
                  title="Sonu Enterprises Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120605.25598410501!2d72.93404914335936!3d19.1552305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bfb4b94582cd%3A0xc0e9efc260246a09!2sSonu%20Enterprises%20and%20building%20developers!5e0!3m2!1sen!2sus!4v1776269945283!5m2!1sen!2sus"
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                />
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Form ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <div className="relative overflow-hidden rounded-xl p-8 md:p-10 bg-white shadow-luxury border border-luxury-gold/25">
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <Label>Send Message</Label>
                      <h3 className="text-2xl font-bold text-[#171717]"
                        style={{ fontFamily: "'Cormorant Garamond',serif" }}>Book Your Consultation</h3>
                    </div>
                    {projectContext && (
                      <div className="px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-bold flex-shrink-0"
                        style={{ border: '1px solid rgba(197,160,89,0.4)', color: GOLD, background: 'rgba(197,160,89,0.08)', borderRadius: '2px' }}>
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
                        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 rounded-full"
                          style={{ background: `linear-gradient(135deg,${GOLD},#b08d42)` }}>
                          <Send className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#171717] mb-3"
                          style={{ fontFamily: "'Cormorant Garamond',serif" }}>Message Delivered</h3>
                        <p className="text-sm text-stone-600">
                          Our design experts will review your details and contact you shortly.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form" onSubmit={handleSubmit}
                        initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="space-y-5">
                        {/* Honeypot field for bot spam protection */}
                        <div style={{ display: 'none', opacity: 0, position: 'absolute', zIndex: -1 }} aria-hidden="true">
                          <input
                            type="text"
                            name="website_verify"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <LuxInput label="Full Name" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                          <LuxInput label="Phone Number" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 ..." required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <LuxInput label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                          <div>
                            <LuxInput label="City" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Kalyan, Thane" required list="cities-list" />
                            <datalist id="cities-list">
                              <option value="Kalyan" />
                              <option value="Dombivli" />
                              <option value="Thane West" />
                              <option value="Navi Mumbai" />
                              <option value="Palava City" />
                              <option value="Panvel" />
                              <option value="Mumbai" />
                            </datalist>
                          </div>
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
                          <label htmlFor="notes" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-stone-700">Notes & Description</label>
                          <textarea id="notes" name="notes" rows={4} required
                            value={formData.notes} onChange={handleChange}
                            placeholder="Describe your vision, specific requirements, layout details..."
                            className="w-full px-4 py-3.5 outline-none text-sm transition-all duration-300 resize-none text-stone-900 bg-[#FAF8F5] border border-stone-300 rounded"
                            onFocus={e => { e.currentTarget.style.borderColor = '#c5a059'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                            onBlur={e => { e.currentTarget.style.borderColor = '#D6D3D1'; e.currentTarget.style.backgroundColor = '#FAF8F5'; }}
                          />
                        </div>
                        <motion.button
                          type="submit" disabled={status === 'submitting'}
                          className="w-full relative inline-flex items-center justify-center gap-3 py-4 text-[11px] uppercase tracking-[0.3em] font-bold overflow-hidden shadow-lg shadow-luxury-gold/20"
                          style={{ background: `linear-gradient(135deg,${GOLD},#b08d42)`, color: '#FFFFFF', borderRadius: '4px', opacity: status === 'submitting' ? 0.7 : 1 }}
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
