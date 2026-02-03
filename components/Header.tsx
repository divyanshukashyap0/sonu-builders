import React, { useState, useEffect, useRef } from 'react';
import logo from '../logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const { name, phone } = useCompanyData();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > 100) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
          setHidden(false);

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setHidden(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[60] transition-[transform,background-color,opacity,border-color] duration-500 ease-in-out h-16 md:h-20 ${hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled
          ? 'bg-brand-dark/95 shadow-md backdrop-blur-md border-b border-brand-gold/20'
          : 'bg-brand-dark/70 backdrop-blur-sm border-b border-brand-gold/10'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center h-full py-2">
            <img
              src={logo}
              alt={name}
              className={`transition-all duration-500 object-contain ${scrolled ? 'h-8 md:h-10' : 'h-10 md:h-14'}`}
              decoding="async"
              style={{ filter: 'none' }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] uppercase tracking-[0.18em] font-bold transition-all duration-300 ${location.pathname === link.path
                  ? 'text-brand-gold border-b-2 border-brand-gold pb-1'
                  : 'text-white/90 hover:text-brand-gold'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="inline-flex items-center px-4 py-2 rounded-md text-[11px] uppercase tracking-wide font-bold transition-all transform hover:scale-105 bg-brand-gold text-white hover:brightness-95 shadow-sm"
            >
              <Phone className="w-3 h-3 mr-2" />
              {phone}
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none p-2 transition-colors text-white"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-0 left-0 w-full bg-brand-dark/95 backdrop-blur-md h-screen transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
      >
        <div className="flex flex-col h-full p-8 space-y-8">
          <div className="flex justify-between items-center">
            <img src={logo} alt={name} className="h-10 w-auto" />
            <button onClick={() => setIsOpen(false)} className="text-white p-2 border border-brand-gold/20 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col space-y-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-2xl font-serif font-bold ${location.pathname === link.path ? 'text-brand-gold underline underline-offset-8' : 'text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="text-xl font-bold text-brand-gold border-t border-brand-gold/10 pt-6"
            >
              {phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
