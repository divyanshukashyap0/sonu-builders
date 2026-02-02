import React, { useState, useEffect } from 'react';
import logo from '../logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const location = useLocation();
  const { name, phone } = useCompanyData();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > 80 && y > lastY);
      setLastY(y);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'} ${scrolled ? 'bg-brand-dark shadow-md py-2 pt-[max(0.5rem,env(safe-area-inset-top))]' : 'bg-brand-dark/95 backdrop-blur-sm py-4 pt-[max(1rem,env(safe-area-inset-top))]'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt={name} className="h-16 w-auto object-contain" decoding="async" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                  ? 'text-brand-gold border-b-2 border-brand-gold pb-1'
                  : 'text-brand-gold/90 hover:text-brand-gold'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="inline-flex items-center px-4 py-2 border border-brand-gold rounded-md text-sm font-medium text-brand-gold hover:bg-brand-gold/10 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              {phone}
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-gold/90 hover:text-brand-gold focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-dark shadow-lg border-t border-brand-dark transition-transform duration-300 translate-y-0">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-3 rounded-md text-base font-medium ${location.pathname === link.path
                  ? 'text-brand-gold border-b-2 border-brand-gold'
                  : 'text-brand-gold/90 hover:text-brand-gold'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="block w-full text-center mt-4 px-3 py-3 rounded-md text-base font-medium bg-brand-gold text-white"
            >
              Call Us Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
