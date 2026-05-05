import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import logo from '../logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';
import { logCallAction } from '../lib/tracking';

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
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 border-b ${hidden ? '-translate-y-full' : 'translate-y-0'} ${scrolled
            ? 'bg-luxury-obsidian/95 backdrop-blur-md py-3 border-luxury-gold/20 shadow-lg'
            : 'bg-transparent py-6 border-white/5'
          }`}
      >
        <div className="container-premium flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center min-h-[44px]">
            <img
              src={logo}
              alt={name}
              className={`transition-all duration-500 ${scrolled ? 'h-12 md:h-16' : 'h-20 md:h-28'}`}
              loading="eager"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] uppercase tracking-[0.18em] font-bold transition-all duration-300 ${location.pathname === link.path
                  ? 'text-luxury-gold border-b-2 border-luxury-gold pb-1'
                  : 'text-white hover:text-luxury-gold'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              onClick={logCallAction}
              className="inline-flex items-center px-4 py-2 rounded-md text-[11px] uppercase tracking-wide font-bold transition-all transform hover:scale-105 bg-luxury-gold text-white hover:brightness-95 shadow-glow-gold"
            >
              <Phone className="w-3 h-3 mr-2" />
              {phone}
            </a>
          </nav>

          {/* Mobile Menu Button - Minimum 44x44px for accessibility */}
          <div className="md:hidden flex items-center h-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none p-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Portal */}
      {isOpen && createPortal(
        <div
          className={`md:hidden fixed inset-0 z-[99999] bg-luxury-obsidian/95 backdrop-blur-md transition-all duration-500 ease-in-out w-full overflow-hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          style={{ height: '100dvh' }}
        >
          <div className="flex flex-col h-full p-8 space-y-8 overflow-y-auto">
            <div className="flex justify-between items-center">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img src={logo} alt={name} className="h-16 w-auto" loading="eager" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-white p-2 border border-luxury-gold/20 rounded-full bg-white/5 min-w-[44px] min-h-[44px]">
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
                onClick={logCallAction}
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
