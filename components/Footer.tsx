import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';
import { useServices } from '../hooks/useServices';
import { motion } from 'framer-motion';
import { logCallAction } from '../lib/tracking';

const GOLD = '#c5a059';

const Footer: React.FC = () => {
  const { name, contactInfo, socialLinks, footerDescription } = useCompanyData();
  const { services } = useServices();
  const year = new Date().getFullYear();

  const socials = [
    { Icon: Instagram, href: socialLinks?.instagram, label: 'Instagram' },
    { Icon: Facebook, href: socialLinks?.facebook, label: 'Facebook' },
    { Icon: Linkedin, href: socialLinks?.linkedin, label: 'LinkedIn' },
  ].filter(s => s.href);

  return (
    <footer className="relative overflow-hidden" style={{ background: '#040404' }}>
      {/* ── Ambient top glow ───────────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ transform: 'translateX(-50%)', background: 'radial-gradient(ellipse at 50% 0%,rgba(197,160,89,0.06) 0%,transparent 70%)', filter: 'blur(60px)' }} />

      {/* ── Top divider ────────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.25),transparent)' }} />

      {/* ── Dot-grid texture ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `radial-gradient(rgba(197,160,89,0.8) 0.5px, transparent 0.5px)`, backgroundSize: '40px 40px' }} />

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

          {/* Brand column */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-8">
              <motion.img
                src={logo} alt={name}
                className="h-20 md:h-24 w-auto"
                loading="eager"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                style={{ filter: 'drop-shadow(0 0 20px rgba(197,160,89,0.15))' }}
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {footerDescription || 'Crafting luxury interiors and architectural spaces that inspire and endure — since 2009.'}
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <motion.a key={label} href={href!} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-sm transition-all duration-300 shimmer-hover"
                  style={{ border: '1px solid rgba(197,160,89,0.15)', background: 'rgba(197,160,89,0.03)', color: 'rgba(197,160,89,0.5)' }}
                  whileHover={{ borderColor: 'rgba(197,160,89,0.5)', color: GOLD, scale: 1.05 }}
                  aria-label={label}>
                  <Icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation + Services */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            {/* Navigation */}
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-6" style={{ color: 'rgba(197,160,89,0.6)' }}>Navigation</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map(link => (
                  <li key={link.path}>
                    <Link to={link.path}
                      className="group flex items-center gap-2 text-xs transition-colors duration-300"
                      style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <motion.span
                        className="w-0 h-[1px] group-hover:w-4 transition-all duration-300 inline-block"
                        style={{ background: GOLD }}
                      />
                      <span className="group-hover:text-white transition-colors duration-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-6" style={{ color: 'rgba(197,160,89,0.6)' }}>Expertise</h4>
              <ul className="space-y-3">
                {services.slice(0, 7).map(service => (
                  <li key={service.id}>
                    <Link to={`/services/${service.id}`}
                      className="text-xs transition-colors duration-300 hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-6" style={{ color: 'rgba(197,160,89,0.6)' }}>Contact</h4>
            <ul className="space-y-5">
              {[
                { Icon: MapPin, value: contactInfo.address, href: undefined },
                { Icon: Phone, value: contactInfo.phone, href: `tel:${contactInfo.phone?.replace(/\s/g, '')}` },
                { Icon: Mail, value: contactInfo.email, href: `mailto:${contactInfo.email}` },
              ].map(({ Icon, value, href }, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors duration-300"
                    style={{ color: 'rgba(197,160,89,0.45)' }} />
                  {href ? (
                    <a href={href} onClick={i === 1 ? logCallAction : undefined}
                      className="text-xs leading-relaxed transition-colors duration-300 hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {value}
                    </a>
                  ) : (
                    <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{value}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <motion.div className="mt-8">
              <Link to="/contact"
                className="group inline-flex items-center gap-2 px-5 py-3 text-[9px] uppercase tracking-[0.25em] font-bold shimmer-hover transition-all duration-300"
                style={{ border: '1px solid rgba(197,160,89,0.25)', color: GOLD, borderRadius: '2px' }}
                whileHover={{ borderColor: 'rgba(197,160,89,0.6)' }}>
                Book Consultation
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <div className="relative z-10" style={{ borderTop: '1px solid rgba(197,160,89,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {year} {name}. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-300">Terms</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors duration-300">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* ── Bottom gold line ───────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.15),transparent)' }} />
    </footer>
  );
};

export default Footer;
