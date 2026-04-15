import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import PageHero from '../components/luxury/PageHero';
import Section from '../components/Section';
import Button from '../components/Button';
import QuoteCalculator from '../components/interactive/QuoteCalculator';
import { useCompanyData } from '../hooks/useCompanyData';
import { usePageHeaders } from '../hooks/usePageHeaders';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const { contactInfo } = useCompanyData();
  const { headers, loading: headersLoading } = usePageHeaders();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

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
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        status: 'New',
        notes: '',
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
      subjectInput.value = 'New Contact Form Submission';
      form.appendChild(subjectInput);
      const nextInput = document.createElement('input');
      nextInput.type = 'hidden';
      nextInput.name = '_next';
      nextInput.value = `${window.location.origin}/#/contact?sent=1`;
      form.appendChild(nextInput);
      const captchaInput = document.createElement('input');
      captchaInput.type = 'hidden';
      captchaInput.name = '_captcha';
      captchaInput.value = 'false';
      form.appendChild(captchaInput);
      document.body.appendChild(form);
      const isDev = process.env.NODE_ENV === 'development';

      if (!isDev) {
        form.submit();
      }

      document.body.removeChild(form);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      // Remove the timeout so the success message stays visible
      // setTimeout(() => setStatus('idle'), 3000);
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
        <div className="max-w-4xl mx-auto mb-20">
          <QuoteCalculator />
        </div>

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
                      href="https://share.google/LZ79ah8csbmZUG2B0"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-luxury-gold hover:text-luxury-charcoal transition-colors"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embed Map Placeholder - In production use real Google Maps iframe */}
            <div className="mt-12 w-full h-64 bg-slate-200 rounded-lg overflow-hidden relative">
              <iframe
                title="Google Maps"
                src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-luxury-charcoal rounded-xl shadow-luxury-hover p-8 border border-luxury-gold/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white mb-6 relative z-10">Send Message</h2>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Send className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
                <p>Thank you for contacting us. We will get back to you shortly.</p>
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
                  <label htmlFor="subject" className="block text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">Interested In</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all font-medium text-luxury-charcoal dark:text-white"
                  >
                    <option value="">Select a service...</option>
                    <option value="Living Room Interiors">Living Room Interiors</option>
                    <option value="Bedroom Interiors">Bedroom Interiors</option>
                    <option value="Modular Kitchens">Modular Kitchens</option>
                    <option value="False Ceiling & Lighting">False Ceiling & Lighting</option>
                    <option value="Office Interiors">Office Interiors</option>
                    <option value="Commercial Interiors">Commercial Interiors</option>
                    <option value="Turnkey Interior Project">Turnkey Interior Project</option>
                    <option value="Space Planning & Execution">Space Planning & Execution</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-luxury-obsidian border border-luxury-gold/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all font-medium text-luxury-charcoal dark:text-white placeholder:text-stone-400"
                    placeholder="Tell us about your project requirements..."
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
