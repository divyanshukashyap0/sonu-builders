import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';
import { useServices } from '../hooks/useServices';
import TrustBar from './luxury/TrustBar';
import Button from './Button';
import { logCallAction } from '../lib/tracking';

const Footer: React.FC = () => {
  const { name, contactInfo, socialLinks, footerDescription } = useCompanyData();
  const { services } = useServices();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-theme-secondary/20 backdrop-blur-md text-theme-text relative overflow-hidden border-t border-theme-border/20">
      {/* Background Texture */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(var(--theme-accent) 0.5px, transparent 0px)`, backgroundSize: '40px 40px' }} />

      {/* Trust Bar Integration */}
      <div className="relative z-10 border-b border-theme-border/10">
        <TrustBar />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">

          {/* Brand Column */}
          <div className="md:col-span-4 space-y-8">
            <Link to="/" className="inline-block">
              <img src={logo} alt={name} className="h-24 md:h-32 w-auto" loading="eager" />
            </Link>
            <p className="text-theme-muted leading-relaxed text-sm max-w-sm">
              {footerDescription}
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, href: socialLinks.facebook },
                { Icon: Twitter, href: socialLinks.twitter },
                { Icon: Instagram, href: socialLinks.instagram },
                { Icon: Linkedin, href: socialLinks.linkedin }
              ].filter(link => link.href).map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-theme-border/20 flex items-center justify-center text-theme-muted hover:text-theme-accent hover:border-theme-accent transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-theme-accent text-xs uppercase tracking-[0.2em] font-bold mb-8">Navigation</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-theme-muted hover:text-theme-text transition-colors duration-300 flex items-center group">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-theme-accent mr-0 group-hover:mr-2">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="text-theme-accent text-xs uppercase tracking-[0.2em] font-bold mb-8">Expertise</h4>
            <ul className="space-y-4">
              {services.slice(0, 6).map(service => (
                <li key={service.id}>
                  <Link to={`/services/${service.id}`} className="text-sm text-theme-muted hover:text-theme-text transition-colors duration-300">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-theme-accent text-xs uppercase tracking-[0.2em] font-bold mb-8">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 text-theme-accent mt-1 mr-4 shrink-0 group-hover:text-theme-text transition-colors" />
                <span className="text-sm text-theme-muted leading-relaxed group-hover:text-theme-text transition-colors">
                  {contactInfo.address}
                </span>
              </li>
              <li className="flex items-center group">
                <Phone className="w-5 h-5 text-theme-accent mr-4 shrink-0 group-hover:text-theme-text transition-colors" />
                <a 
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
                  onClick={logCallAction}
                  className="text-sm text-theme-muted group-hover:text-theme-text transition-colors font-mono"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center group">
                <Mail className="w-5 h-5 text-theme-accent mr-4 shrink-0 group-hover:text-theme-text transition-colors" />
                <a href={`mailto:${contactInfo.email}`} className="text-sm text-theme-muted group-hover:text-theme-text transition-colors">
                  {contactInfo.email}
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <Button to="/contact" variant="outline" className="w-full justify-center border-theme-accent/30 text-theme-accent hover:border-theme-accent">
                Request Consultation
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-theme-border/10 bg-theme-secondary/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-theme-muted uppercase tracking-wider">
            &copy; {currentYear} {name}. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-xs text-theme-muted uppercase tracking-wider">
            <Link to="/privacy-policy" className="hover:text-theme-text transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-theme-text transition-colors">Terms</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
