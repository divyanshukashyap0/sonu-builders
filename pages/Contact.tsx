import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import PageHero from '../components/luxury/PageHero';
import Section from '../components/Section';
import Button from '../components/Button';
import { useCompanyData } from '../hooks/useCompanyData';
import { usePageHeaders } from '../hooks/usePageHeaders';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';
import { useSearchParams } from 'react-router-dom';

const Contact: React.FC = () => {
  const { contactInfo } = useCompanyData();
  const { headers, loading: headersLoading } = usePageHeaders();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    projectType: '',
    budget: '',
    notes: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    searchParams.get('sent') === '1' ? 'success' : 'idle'
  );

  // Clear query parameter on mount if it's sent=1 to avoid refresh bugs
  React.useEffect(() => {
    if (searchParams.get('sent') === '1') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('sent');
      setSearchParams(newParams, { replace: true });
    }

    // Auto-detect city via IP
    const fetchGeoData = async () => {
      try {
        const response = await fetch('https://demo.ip-api.com/json/').catch(() => null);
        if (response && response.ok) {
          const data = await response.json();
          if (data.city) {
            setFormData(prev => ({ ...prev, city: data.city }));
          }
        }
      } catch (error) {
        // Silent fallback
      }
    };
    fetchGeoData();
  }, [searchParams, setSearchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city || 'Undetected',
        projectType: formData.projectType || 'General Inquiry',
        budget: formData.budget || 'Not specified',
        notes: formData.notes,
        source: 'Contact Page Form',
        status: 'New',
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'leads'), payload);
      const form = document.createElement('form');
      form.action = `https://formsubmit.co/${encodeURIComponent(contactInfo.email)}`;
      form.method = 'POST';
      const entries = Object.entries(payload);
      for (const [key, value] of entries) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
      const subjectInput = document.createElement('input');
      subjectInput.type = 'hidden';
      subjectInput.name = '_subject';
      subjectInput.value = 'Detailed Inquiry from Contact Form';
      form.appendChild(subjectInput);
      const nextInput = document.createElement('input');
      nextInput.type = 'hidden';
      nextInput.name = '_next';
      nextInput.value = `${window.location.origin}/contact?sent=1`;
      form.appendChild(nextInput);
      const captchaInput = document.createElement('input');
      captchaInput.type = 'hidden';
      captchaInput.name = '_captcha';
      captchaInput.value = 'false';
      form.appendChild(captchaInput);
      document.body.appendChild(form);
      form.submit();
      
      document.body.removeChild(form);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', city: '', projectType: '', budget: '', notes: '' });
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert('Failed to send message. Please try again.');
    }
  };

  if (headersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mb-4"></div>
          <p className="text-luxury-gold font-serif tracking-widest text-sm animate-pulse uppercase">Connecting Horizons</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO
        title="Contact Us"
        description="Get in touch with Sonu Enterprises for a free consultation. Visit our office or contact us for your interior design needs."
        canonical="https://sonu-builders.in/contact"
      />
      <PageHero
        title={headers.contact.title}
        subtitle={headers.contact.subtitle}
        backgroundImage={headers.contact.backgroundImage}
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white mb-6">Get In Touch</h2>
            <p className="text-luxury-charcoal/70 dark:text-white/70 mb-8 leading-relaxed">
              We are here to answer any questions you may have about our design experiences. Reach out to us and we'll respond as soon as we can.
            </p>

            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="w-12 h-12 bg-luxury-gold/5 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-luxury-gold transition-colors duration-300">
                  <Phone className="w-6 h-6 text-luxury-gold group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-bold text-luxury-charcoal dark:text-white font-serif">Phone</h4>
                  <p className="text-luxury-charcoal/70 dark:text-white/70 mt-1">{contactInfo.phone}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold mt-1">Mon-Sat, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-luxury-gold/5 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-luxury-gold transition-colors duration-300">
                  <Mail className="w-6 h-6 text-luxury-gold group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-bold text-luxury-charcoal dark:text-white font-serif">Email</h4>
                  <p className="text-luxury-charcoal/70 dark:text-white/70 mt-1">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-luxury-gold/5 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-luxury-gold transition-all duration-300">
                  <MapPin className="w-6 h-6 text-luxury-gold group-hover:text-white transition-all duration-300" />
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-bold text-luxury-charcoal dark:text-white font-serif">Office</h4>
                  <p className="text-luxury-charcoal/70 dark:text-white/70 mt-1 max-w-xs font-semibold">{contactInfo.address}</p>
                  <div className="mt-2">
                    <a
                      href="https://www.google.com/maps/dir//Sonu+Enterprises+and+building+developers+Chandresh+Godavari+Dombivli+East+Kalyan,+Maharashtra+421204/@19.1552305,73.0165324,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3be7bfb4b94582cd:0xc0e9efc260246a09!2m2!1d73.0165324!2d19.1552305!16s%2Fg%2F11w6_81993?entry=ttu"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-luxury-gold hover:text-luxury-charcoal transition-colors"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 w-full h-80 bg-slate-200 rounded-lg overflow-hidden relative shadow-luxury">
              <iframe
                title="Sonu Enterprises Official Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120605.25598410501!2d72.93404914335936!3d19.1552305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bfb4b94582cd%3A0xc0e9efc260246a09!2sSonu%20Enterprises%20and%20building%20developers!5e0!3m2!1sen!2sus!4v1776269945283!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-luxury-charcoal rounded-xl shadow-luxury-hover p-8 border border-luxury-gold/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white mb-6 relative z-10">Send Message</h2>

            {status === 'success' ? (
              <div className="bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold p-10 rounded-xl text-center shadow-glow-gold relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                <div className="flex justify-center mb-6 relative z-10">
                  <div className="bg-luxury-gold p-4 rounded-full shadow-lg shadow-luxury-gold/20">
                    <Send className="w-8 h-8 text-luxury-obsidian" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white mb-3 relative z-10">Message Delivered</h3>
                <p className="text-stone-600 dark:text-stone-300 relative z-10 font-light">Thank you for getting in touch. Our design experts will review your details and contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all text-luxury-charcoal dark:text-white placeholder:text-stone-400"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all font-medium text-luxury-charcoal dark:text-white placeholder:text-stone-400"
                      placeholder="+91 ..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all font-medium text-luxury-charcoal dark:text-white placeholder:text-stone-400"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">City (Auto-detected)</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all font-medium text-luxury-charcoal dark:text-white placeholder:text-stone-400"
                      placeholder="Your city"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="projectType" className="block text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">Project Type</label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all font-medium text-luxury-charcoal dark:text-white"
                    >
                      <option value="">Select an option...</option>
                      <option value="Residential Interiors">Residential Interiors</option>
                      <option value="Commercial / Office">Commercial / Office</option>
                      <option value="Turnkey Architecture">Turnkey Architecture</option>
                      <option value="Renovation">Renovation & Remodeling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">Estimated Budget</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all font-medium text-luxury-charcoal dark:text-white"
                    >
                      <option value="">Not decided yet</option>
                      <option value="Under ₹5L">Under ₹5 Lakhs</option>
                      <option value="₹5L - ₹15L">₹5L - ₹15 Lakhs</option>
                      <option value="₹15L - ₹30L">₹15L - ₹30 Lakhs</option>
                      <option value="₹30L+">Above ₹30 Lakhs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">Notes & Description</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all font-medium text-luxury-charcoal dark:text-white placeholder:text-stone-400"
                    placeholder="Describe your vision, specific requirements, or any details about your layout..."
                  ></textarea>
                </div>

                <Button type="submit" fullWidth disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
