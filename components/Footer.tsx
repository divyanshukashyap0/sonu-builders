import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';
import { useServices } from '../hooks/useServices';
import TrustBar from './luxury/TrustBar';
import Button from './Button';

const Footer: React.FC = () => {
  const { name, contactInfo, socialLinks, footerDescription } = useCompanyData();
  const { services } = useServices();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-luxury-obsidian text-white relative overflow-hidden border-t border-white/5">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      {/* Trust Bar Integration */}
      <div className="relative z-10 border-b border-white/5">
        <TrustBar />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">

          {/* Brand Column */}
          <div className="md:col-span-4 space-y-8">
            <Link to="/" className="inline-block">
              <img src={logo} alt={name} className="h-16 w-auto brightness-0 invert" loading="lazy" />
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              {footerDescription}
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Linkedin, href: "https://linkedin.com" }
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-luxury-gold text-xs uppercase tracking-[0.2em] font-bold mb-8">Navigation</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-luxury-gold mr-0 group-hover:mr-2">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="text-luxury-gold text-xs uppercase tracking-[0.2em] font-bold mb-8">Expertise</h4>
            <ul className="space-y-4">
              {services.slice(0, 6).map(service => (
                <li key={service.id}>
                  <Link to="/services" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                    {service.title}
                  </Link>
                </li>
              ))}
              {!services.length && (
                <>
                  <li className="text-sm text-gray-500">Luxury Interiors</li>
                  <li className="text-sm text-gray-500">Civil Construction</li>
                  <li className="text-sm text-gray-500">Turnkey Projects</li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-luxury-gold text-xs uppercase tracking-[0.2em] font-bold mb-8">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 text-luxury-gold mt-1 mr-4 shrink-0 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {contactInfo.address}
                </span>
              </li>
              <li className="flex items-center group">
                <Phone className="w-5 h-5 text-luxury-gold mr-4 shrink-0 group-hover:text-white transition-colors" />
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-sm text-gray-400 group-hover:text-white transition-colors font-mono">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center group">
                <Mail className="w-5 h-5 text-luxury-gold mr-4 shrink-0 group-hover:text-white transition-colors" />
                <a href={`mailto:${contactInfo.email}`} className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {contactInfo.email}
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <Button to="/contact" variant="outline" className="w-full justify-center border-luxury-gold/30 text-luxury-gold hover:border-luxury-gold">
                Get a Quote
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            &copy; {currentYear} {name}. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-xs text-gray-500 uppercase tracking-wider">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
