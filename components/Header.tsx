import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

  // Scroll effect for hide/show and background
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolled (for background)
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine hide/show (sticky behavior)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down & past top
        setHidden(true);
      } else {
        // Scrolling up or at top
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setHidden(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 ease-in-out h-16 md:h-20 ${hidden ? '-translate-y-full' : 'translate-y-0'
          } ${scrolled
            ? 'bg-luxury-black backdrop-blur-md border-b border-white/5 shadow-glass'
            : 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px] border-b border-transparent'
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
                    : 'text-white hover:text-brand-gold transition-colors duration-300'
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
                className="focus:outline-none p-2 transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X className="h-6 w-6 dark:text-white text-luxury-charcoal" /> : <Menu className="h-6 w-6 dark:text-white text-luxury-charcoal" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Portal */}
      {isOpen && createPortal(
        <div
          className={`md:hidden fixed inset-0 z-[99999] bg-luxury-obsidian/95 backdrop-blur-md transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          style={{ height: '100dvh' }}
        >
          <div className="flex flex-col h-full p-8 space-y-8 overflow-y-auto">
            <div className="flex justify-between items-center">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img src={logo} alt={name} className="h-10 w-auto" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-white p-2 border border-luxury-gold/20 rounded-full bg-white/5">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col space-y-6 pt-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-serif font-bold ${location.pathname === link.path
                    ? 'text-luxury-gold underline underline-offset-8'
                    : 'text-stone-300 hover:text-white transition-colors'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="text-xl font-bold text-luxury-gold border-t border-white/10 pt-6 mt-4 inline-flex items-center gap-2"
              >
                <Phone size={18} />
                {phone}
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Header;
