import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, ArrowUpRight, ArrowRight } from 'lucide-react';
import { NAV_LINKS, SERVICES, REAL_ADMIN_SERVICES, MUMBAI_LOCATIONS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';
import { useServices } from '../hooks/useServices';
import { motion } from 'framer-motion';
import { logCallAction } from '../lib/tracking';

const GOLD = '#c5a059';

const Footer: React.FC = () => {
  const { name, contactInfo, socialLinks } = useCompanyData();
  const { services: hookServices } = useServices();
  const year = new Date().getFullYear();

  // Use hook services from Firestore or fallback to the 12 real admin services
  const displayServices = hookServices && hookServices.length > 0 ? hookServices : REAL_ADMIN_SERVICES;

  const socials = [
    { Icon: Instagram, href: socialLinks?.instagram, label: 'Instagram' },
    { Icon: Facebook, href: socialLinks?.facebook, label: 'Facebook' },
    { Icon: Linkedin, href: socialLinks?.linkedin, label: 'LinkedIn' },
  ].filter(s => s.href);

  return (
    <footer className="relative overflow-hidden" style={{ background: '#F4F0E8' }}>
      {/* ── Ambient top glow ───────────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ transform: 'translateX(-50%)', background: 'radial-gradient(ellipse at 50% 0%,rgba(197,160,89,0.1) 0%,transparent 70%)' }} />

      {/* ── Top divider ────────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.35),transparent)' }} />

      {/* ── Dot-grid texture ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: `radial-gradient(rgba(197,160,89,0.8) 0.5px, transparent 0.5px)`, backgroundSize: '40px 40px' }} />

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-8">

          {/* 1. Brand column */}
          <div className="sm:col-span-2 md:col-span-12 lg:col-span-3">
            <Link to="/" className="inline-block mb-5">
              <img
                src={logo}
                alt={name}
                className="h-16 md:h-20 w-auto"
                loading="lazy"
              />
            </Link>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed max-w-sm mb-5 font-normal">
              Sonu Enterprises is a premier interior architecture and turnkey construction company in Mumbai, delivering bespoke residential, commercial, and modular living spaces since 2009.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xs bg-white border border-stone-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#8C6D23]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700">
                15+ Years of Architectural Craftsmanship
              </span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="sm:col-span-1 md:col-span-3 lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 text-[#8C6D23]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.2em' }}>
              Quick Links
            </p>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'All Services', path: '/services' },
                { label: 'Cost Estimator', path: '/estimate' },
                { label: 'Contact', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-xs text-stone-600 hover:text-[#171717] font-medium transition-colors block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. All Services (All 12 Real Services) */}
          <div className="sm:col-span-2 md:col-span-6 lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8C6D23]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.2em' }}>
                All Services
              </p>
              <Link
                to="/services"
                className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 hover:text-[#8C6D23] transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {displayServices.map(service => (
                <Link
                  key={service.id || service.slug}
                  to={`/services/${service.id || service.slug}`}
                  className="text-xs text-stone-600 hover:text-[#171717] font-medium transition-colors block py-0.5 leading-snug"
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          {/* 4. Locations Served */}
          <div className="sm:col-span-1 md:col-span-3 lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 text-[#8C6D23]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.2em' }}>
              Locations
            </p>
            <ul className="space-y-2">
              {MUMBAI_LOCATIONS.map(loc => (
                <li key={loc.slug}>
                  <Link
                    to={`/locations/${loc.slug}`}
                    className="text-xs text-stone-600 hover:text-[#171717] font-medium transition-colors block py-0.5"
                  >
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Contact */}
          <div className="sm:col-span-2 md:col-span-12 lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 text-[#8C6D23]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.2em' }}>
              Contact
            </p>
            <ul className="space-y-2.5">
              {/* Address */}
              <li className="flex items-start gap-2 group">
                <MapPin className="w-3.5 h-3.5 text-[#8C6D23] flex-shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=Shop+no.+22+Chandresh+Godavari+Kalyan+Shilphata+Rd+Nilje+station+Dombivli+East+Palava+City"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-stone-600 hover:text-[#171717] transition-colors leading-relaxed"
                >
                  Shop no. 22, Chandresh Godavari, Kalyan - Shilphata Rd, near Nilje station, Dombivli East, Palava City, Mumbai MMR 421204
                </a>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-2 group">
                <Phone className="w-3.5 h-3.5 text-[#8C6D23] flex-shrink-0" />
                <a
                  href={`tel:${contactInfo.phone?.replace(/\s/g, '') || '+919967044479'}`}
                  onClick={logCallAction}
                  className="text-xs text-stone-700 font-semibold hover:text-[#8C6D23] transition-colors"
                >
                  {contactInfo.phone || '+91 99670 44479'}
                </a>
              </li>

              {/* Email */}
              <li className="flex items-center gap-2 group">
                <Mail className="w-3.5 h-3.5 text-[#8C6D23] flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email || 'sonu15enterprises@gmail.com'}`}
                  className="text-xs text-stone-600 hover:text-[#171717] transition-colors truncate block"
                >
                  {contactInfo.email || 'sonu15enterprises@gmail.com'}
                </a>
              </li>

              {/* Instagram & WhatsApp in row */}
              <li className="flex items-center gap-4 pt-1">
                <a
                  href="https://instagram.com/sonuenterprises"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#171717] transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://wa.me/919967044479?text=Hi%20Sonu%20Enterprises%2C%20I%20would%20like%20to%20inquire%20about%20interior%20design%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-700 font-semibold hover:text-[#8C6D23] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.831.848 2.791.848 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm0 10.377c-.859 0-1.637-.253-2.316-.656l-.165-.098-1.58.414.422-1.541-.107-.171c-.443-.706-.723-1.458-.722-2.559.001-2.54 2.067-4.606 4.609-4.606 2.543 0 4.608 2.065 4.608 4.606 0 2.541-2.066 4.609-4.609 4.61zm2.527-3.468c-.139-.07-822-.406-.949-.452-.127-.047-.219-.07-.312.07-.093.139-.36.452-.441.545-.081.093-.162.105-.301.035s-.586-.216-1.117-.689c-.412-.367-.69-.821-.771-.96-.081-.139-.009-.214.061-.284.063-.062.139-.162.209-.243.07-.081.093-.139.139-.232.047-.093.023-.174-.012-.243-.035-.07-.312-.753-.428-1.031-.113-.271-.228-.234-.313-.238l-.267-.005c-.093 0-.243.035-.371.174-.127.139-.487.476-.487 1.16 0 .684.498 1.345.568 1.438.07.093.98 1.496 2.374 2.098.332.143.591.229.793.293.333.106.637.091.877.055.267-.04 822-.336.938-.661.116-.324.116-.603.081-.661-.035-.057-.128-.093-.267-.163z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>

            {/* Direct Consultation Button */}
            <div className="mt-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xs text-[10px] font-bold uppercase tracking-wider text-[#FAF8F5] bg-[#171717] hover:bg-[#8C6D23] transition-colors shadow-xs text-center"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <div className="relative z-10" style={{ borderTop: '1px solid rgba(197,160,89,0.15)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs tracking-wider text-stone-500">
            © {year} {name}. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-xs tracking-wider text-stone-500">
            <Link to="/blog" className="hover:text-[#171717] transition-colors duration-300 font-medium">Blog</Link>
            <Link to="/privacy-policy" className="hover:text-[#171717] transition-colors duration-300 font-medium">Privacy</Link>
            <Link to="/terms" className="hover:text-[#171717] transition-colors duration-300 font-medium">Terms</Link>
            <Link to="/sitemap" className="hover:text-[#171717] transition-colors duration-300 font-medium">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* ── Bottom gold line ───────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.25),transparent)' }} />
    </footer>
  );
};

export default Footer;
