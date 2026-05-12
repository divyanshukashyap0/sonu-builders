import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import logo from '../logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowUpRight } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCompanyData } from '../hooks/useCompanyData';
import { logCallAction } from '../lib/tracking';

/**
 * Ultra-premium Header — ZERO Framer Motion.
 * All transitions are CSS-only for maximum scroll performance.
 * Mobile menu uses CSS transition + React state (no spring physics overhead).
 */
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number>(0);
  const location = useLocation();
  const { name, phone } = useCompanyData();

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 60);
        setHidden(y > lastScrollY.current && y > 120);
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
      {/* ── Header bar — all CSS transitions ──────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-[9999]"
        style={{
          background: scrolled ? 'rgba(4,4,4,0.82)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(197,160,89,0.1)' : '1px solid transparent',
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'background 0.45s ease, backdrop-filter 0.45s ease, border-color 0.45s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          willChange: 'transform',
        }}
      >
        {/* Gold top accent — visible when scrolled */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.35),transparent)',
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.45s ease',
          }}
        />

        <div
          className="max-w-7xl mx-auto px-6 flex items-center justify-between"
          style={{
            height: scrolled ? '64px' : '88px',
            transition: 'height 0.45s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* Logo */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <img
              src={logo} alt={name} loading="eager"
              style={{
                height: scrolled ? '44px' : '64px',
                width: 'auto',
                transition: 'height 0.45s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 group nav-link-item"
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{
                      color: isActive ? '#c5a059' : 'rgba(255,255,255,0.72)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {link.label}
                  </span>
                  {/* Underline */}
                  <span
                    className="absolute bottom-1 left-4 right-4 h-[1px]"
                    style={{
                      background: 'linear-gradient(90deg,#c5a059,#e8d5a3)',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left center',
                      transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                </Link>
              );
            })}

            {/* Phone CTA */}
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              onClick={logCallAction}
              className="ml-4 inline-flex items-center gap-2 overflow-hidden"
              style={{
                padding: '9px 18px',
                background: 'linear-gradient(135deg,#c5a059,#b08d42)',
                color: '#000',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                transition: 'opacity 0.3s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Phone className="w-3 h-3" />
              {phone}
            </a>
          </nav>

          {/* Hamburger — CSS-only lines */}
          <button
            className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-[5px] focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <span style={{
              display: 'block', width: '22px', height: '1.5px',
              background: '#c5a059',
              transform: isOpen ? 'rotate(45deg) translateY(7px)' : 'none',
              transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '1.5px',
              background: 'rgba(255,255,255,0.6)',
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '1.5px',
              background: isOpen ? '#c5a059' : 'rgba(255,255,255,0.45)',
              transform: isOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
              transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.2s',
            }} />
          </button>
        </div>
      </header>

      {/* ── Mobile menu — CSS clip-path transition ────────────────────────── */}
      {createPortal(
        <div
          className="md:hidden fixed inset-0 z-[99998] flex flex-col"
          style={{
            background: 'rgba(4,4,4,0.97)',
            backdropFilter: 'blur(24px)',
            clipPath: isOpen ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
            transition: 'clip-path 0.5s cubic-bezier(0.77,0,0.175,1)',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          {/* Gold ambient top */}
          <div className="absolute top-0 right-0 w-[280px] h-[280px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.07) 0%,transparent 70%)', filter: 'blur(50px)' }} />

          <div className="flex flex-col h-full px-8 py-8 overflow-y-auto">
            {/* Top row */}
            <div className="flex justify-between items-center mb-14">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img src={logo} alt={name} className="h-12 w-auto" loading="eager" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center"
                style={{ border: '1px solid rgba(197,160,89,0.25)', borderRadius: '2px' }}
              >
                <X className="w-4 h-4" style={{ color: '#c5a059' }} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-0 flex-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-5"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                      transition: `opacity 0.4s ease ${0.06 + i * 0.07}s, transform 0.4s ease ${0.06 + i * 0.07}s`,
                    }}
                  >
                    <span
                      className="text-3xl font-bold leading-none"
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        color: isActive ? '#c5a059' : 'rgba(255,255,255,0.82)',
                      }}
                    >
                      {link.label}
                    </span>
                    <ArrowUpRight className="w-5 h-5" style={{ color: 'rgba(197,160,89,0.5)' }} />
                  </Link>
                );
              })}
            </nav>

            {/* Bottom phone */}
            <div
              className="mt-10 pt-8"
              style={{
                borderTop: '1px solid rgba(197,160,89,0.12)',
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.4s ease 0.45s',
              }}
            >
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                onClick={logCallAction}
                className="flex items-center gap-3 text-xl font-bold"
                style={{ color: '#c5a059', fontFamily: "'Cormorant Garamond',serif" }}
              >
                <Phone className="w-5 h-5" />
                {phone}
              </a>
              <p className="text-[9px] uppercase tracking-[0.25em] mt-2" style={{ color: 'rgba(197,160,89,0.4)' }}>
                Mon – Sat · 9am – 6pm
              </p>
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
          color: #c5a059 !important;
        }
      `}</style>
    </>
  );
};

export default Header;
