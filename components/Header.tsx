import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import logo from '../logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowUpRight, ArrowRight, User } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';
import { logCallAction } from '../lib/tracking';
import { useAuth } from '../context/AuthContext';

const HEADER_NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

/**
 * Ultra-premium Header — Refined, architectural, compact on scroll.
 * CSS-only transitions for maximum scroll performance.
 */
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number>(0);
  const location = useLocation();
  const { name, phone } = useCompanyData();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const nextScrolled = y > 40;
        const nextHidden = y > lastScrollY.current && y > 120;

        setScrolled(prev => prev !== nextScrolled ? nextScrolled : prev);
        setHidden(prev => prev !== nextHidden ? nextHidden : prev);

        lastScrollY.current = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setHidden(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* ── Header bar ──────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-[9999]"
        style={{
          background: scrolled ? 'rgba(255, 255, 255, 0.42)' : 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: scrolled ? '1px solid rgba(197, 160, 89, 0.16)' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: scrolled ? '0 10px 30px -5px rgba(23, 23, 23, 0.05)' : 'none',
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          willChange: 'transform',
        }}
      >
        {/* Subtle gold top line when scrolled */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.4), transparent)',
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.35s ease',
          }}
        />

        <div
          className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between"
          style={{
            height: scrolled ? '60px' : '70px',
            transition: 'height 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* Logo - Prominent & Crisp in Sleek Navbar */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center group py-0.5"
            aria-label={`${name} Home`}
          >
            <img
              src={logo}
              alt={name}
              loading="eager"
              className="object-contain origin-left"
              style={{
                height: scrolled ? '54px' : '68px',
                transform: scrolled ? 'scale(1.08)' : 'scale(1.2)',
                transformOrigin: 'left center',
                width: 'auto',
                transition: 'height 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s ease',
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5" aria-label="Main Navigation">
            {HEADER_NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-3 py-1.5 group nav-link-item"
                >
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      color: isActive ? '#8C6D23' : '#171717',
                      transition: 'color 0.25s ease',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {link.label}
                  </span>
                  {/* Subtle underline */}
                  <span
                    className="absolute bottom-0.5 left-3 right-3 h-[1.5px]"
                    style={{
                      background: '#c5a059',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left center',
                      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                </Link>
              );
            })}

            {/* Portal/Account quick access icon */}
            <Link
              to={user ? "/account" : "/login"}
              className="p-1.5 ml-1 text-stone-600 hover:text-[#8C6D23] transition-colors rounded-sm"
              title={user ? "Account" : "Client Portal"}
              aria-label={user ? "Account" : "Client Portal"}
            >
              <User className="w-3.5 h-3.5" />
            </Link>

            {/* Primary CTA: Book a Consultation */}
            <Link
              to="/contact"
              className="ml-2.5 inline-flex items-center gap-1.5 group px-4 py-2 rounded-xs transition-all duration-300 shadow-xs"
              style={{
                background: '#171717',
                color: '#FAF8F5',
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                border: '1px solid #171717',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#8C6D23';
                e.currentTarget.style.borderColor = '#8C6D23';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#171717';
                e.currentTarget.style.borderColor = '#171717';
                e.currentTarget.style.color = '#FAF8F5';
              }}
            >
              <span>Book a Consultation</span>
              <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#c5a059] group-hover:text-white" />
            </Link>
          </nav>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-[5px] focus:outline-none focus:ring-1 focus:ring-stone-400"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            <span style={{
              display: 'block', width: '22px', height: '1.5px',
              background: '#171717',
              transform: isOpen ? 'rotate(45deg) translateY(7px)' : 'none',
              transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.2s',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '1.5px',
              background: '#8C6D23',
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '1.5px',
              background: '#171717',
              transform: isOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
              transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.2s',
            }} />
          </button>
        </div>
      </header>

      {/* ── Mobile menu drawer ────────────────────────── */}
      {createPortal(
        <div
          className="md:hidden fixed inset-0 z-[99998] flex flex-col"
          style={{
            background: '#FAF8F5',
            clipPath: isOpen ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
            transition: 'clip-path 0.45s cubic-bezier(0.77,0,0.175,1)',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          <div className="flex flex-col h-full px-7 py-6 overflow-y-auto">
            {/* Top row */}
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-stone-200/80">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img src={logo} alt={name} className="h-14 w-auto object-contain" loading="eager" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xs border border-stone-300 text-stone-700 hover:text-black focus:outline-none"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col flex-1 divide-y divide-stone-200/60">
              {HEADER_NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-4 group"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateX(0)' : 'translateX(-15px)',
                      transition: `opacity 0.35s ease ${0.05 + i * 0.05}s, transform 0.35s ease ${0.05 + i * 0.05}s`,
                    }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: isActive ? '#8C6D23' : '#171717',
                      }}
                    >
                      {link.label}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-[#8C6D23] transition-colors" />
                  </Link>
                );
              })}

              <Link
                to={user ? "/account" : "/login"}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-4 group"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(-15px)',
                  transition: `opacity 0.35s ease 0.35s, transform 0.35s ease 0.35s`,
                }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: location.pathname === (user ? "/account" : "/login") ? '#8C6D23' : '#171717',
                  }}
                >
                  {user ? 'My Account' : 'Client Portal Login'}
                </span>
                <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-[#8C6D23] transition-colors" />
              </Link>
            </nav>

            {/* Bottom Actions */}
            <div
              className="mt-6 pt-6 border-t border-stone-200 flex flex-col gap-3"
              style={{
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.35s ease 0.4s',
              }}
            >
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3.5 px-6 rounded-xs bg-[#171717] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest shadow-xs hover:bg-[#8C6D23] transition-colors flex items-center justify-center gap-2"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                onClick={logCallAction}
                className="w-full text-center py-3 px-6 rounded-xs border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#8C6D23]" />
                <span>Call {phone}</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Hover underline CSS */}
      <style>{`
        .nav-link-item:hover span[style*="scaleX(0)"] {
          transform: scaleX(1) !important;
        }
        .nav-link-item:hover > span:first-child {
          color: #8C6D23 !important;
        }
      `}</style>
    </>
  );
};

export default Header;
