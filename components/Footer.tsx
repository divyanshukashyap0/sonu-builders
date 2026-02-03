import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';
import { useServices } from '../hooks/useServices';

const Footer: React.FC = () => {
  const { name, contactInfo, socialLinks, footerDescription } = useCompanyData();
  const { services } = useServices();

  return (
    <footer className="bg-premium-stone text-luxury-charcoal/80 border-t border-luxury-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt={name} className="h-12 w-auto" loading="lazy" decoding="async" />
            </Link>
            <p className="text-sm leading-relaxed mb-8 font-medium">
              {footerDescription}
            </p>
            <div className="flex space-x-6">
              <a href={socialLinks.facebook || '#'} className="text-luxury-gold hover:text-luxury-charcoal transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href={socialLinks.twitter || '#'} className="text-luxury-gold hover:text-luxury-charcoal transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href={socialLinks.instagram || '#'} className="text-luxury-gold hover:text-luxury-charcoal transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href={socialLinks.linkedin || '#'} className="text-luxury-gold hover:text-luxury-charcoal transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-luxury-charcoal text-sm uppercase tracking-widest font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-luxury-gold font-semibold transition-all inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin-portal" className="text-xs hover:text-luxury-gold transition-all inline-block text-luxury-charcoal/40 font-bold uppercase tracking-tighter">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-luxury-charcoal text-sm uppercase tracking-widest font-bold mb-6">Our Services</h4>
            <ul className="space-y-4 text-sm font-semibold">
              {services.slice(0, 5).map(service => (
                <li key={service.id}>{service.title}</li>
              ))}
              {services.length === 0 && (
                <>
                  <li>Residential Construction</li>
                  <li>Commercial Development</li>
                  <li>Project Management</li>
                  <li>Renovation Services</li>
                  <li>Turnkey Solutions</li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-luxury-charcoal text-sm uppercase tracking-widest font-bold mb-6">Contact Us</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start">
                <contactInfo.icons.address className="w-5 h-5 mr-3 text-luxury-gold shrink-0" />
                <span className="font-semibold">{contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <contactInfo.icons.phone className="w-5 h-5 mr-3 text-luxury-gold shrink-0" />
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-luxury-gold font-bold">{contactInfo.phone}</a>
              </li>
              <li className="flex items-center">
                <contactInfo.icons.email className="w-5 h-5 mr-3 text-luxury-gold shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-luxury-gold font-bold">{contactInfo.email}</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-luxury-gold/10 mt-16 pt-8 text-center text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/40">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
