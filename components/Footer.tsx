import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';

const Footer: React.FC = () => {
  const { name, contactInfo, socialLinks } = useCompanyData();
  return (
    <footer className="bg-brand-dark text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="Sonu Enterprises" className="h-12 w-auto opacity-100 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Delivering quality construction and reliable real-estate solutions with integrity and expertise. Building trust, creating landmarks.
            </p>
            <div className="flex space-x-4">
              <a href={socialLinks.facebook || '#'} className="text-slate-400 hover:text-brand-gold transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href={socialLinks.twitter || '#'} className="text-slate-400 hover:text-brand-gold transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href={socialLinks.instagram || '#'} className="text-slate-400 hover:text-brand-gold transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href={socialLinks.linkedin || '#'} className="text-slate-400 hover:text-brand-gold transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-white hover:translate-x-1 transition-all inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-3 text-sm">
              <li>Residential Construction</li>
              <li>Commercial Development</li>
              <li>Project Management</li>
              <li>Renovation Services</li>
              <li>Turnkey Solutions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <contactInfo.icons.address className="w-5 h-5 mr-3 text-brand-gold shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <contactInfo.icons.phone className="w-5 h-5 mr-3 text-brand-gold shrink-0" />
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-white">{contactInfo.phone}</a>
              </li>
              <li className="flex items-center">
                <contactInfo.icons.email className="w-5 h-5 mr-3 text-brand-gold shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white">{contactInfo.email}</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
