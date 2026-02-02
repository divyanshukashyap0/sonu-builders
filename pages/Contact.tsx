import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Section from '../components/Section';
import Button from '../components/Button';
import { useCompanyData } from '../hooks/useCompanyData';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Contact: React.FC = () => {
  const { contactInfo } = useCompanyData();
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
      setStatus('success');
      form.submit();
      document.body.removeChild(form);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('idle');
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="pt-16">
      <div className="bg-brand-dark py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Contact Us</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto px-4">
          Get in touch with us for inquiries, quotes, or to discuss your next big project.
        </p>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">Get In Touch</h2>
            <p className="text-slate-600 mb-8">
              We are here to answer any questions you may have about our experiences. Reach out to us and we'll respond as soon as we can.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-brand-blue" />
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-bold text-brand-dark">Phone</h4>
                  <p className="text-slate-600 mt-1">{contactInfo.phone}</p>
                  <p className="text-sm text-slate-500">Mon-Sat, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-bold text-brand-dark">Email</h4>
                  <p className="text-slate-600 mt-1">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-bold text-brand-dark">Office</h4>
                  <p className="text-slate-600 mt-1 max-w-xs">{contactInfo.address}</p>
                </div>
              </div>
            </div>

            {/* Embed Map Placeholder - In production use real Google Maps iframe */}
            <div className="mt-12 w-full h-64 bg-slate-200 rounded-lg overflow-hidden relative">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0664285949!2d77.025!3d28.627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzM3LjIiTiA3N8KwMDEnMzAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-brand-blue/10 rounded-xl shadow-xl p-8 border border-transparent">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">Send Message</h2>

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
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
                      placeholder="+91 ..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Interested In</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
                  >
                    <option value="">Select a topic...</option>
                    <option value="Residential Construction">Residential Construction</option>
                    <option value="Commercial Project">Commercial Project</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Property Inquiry">Property Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
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
