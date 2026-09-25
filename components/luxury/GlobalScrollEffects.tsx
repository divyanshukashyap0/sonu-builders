import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * GlobalScrollEffects — minimal JS, maximum CSS.
 *
 * 1. Scroll progress bar   — passive RAF, CSS width update
 * 2. data-reveal            — IntersectionObserver → CSS class (ZERO JS animation)
 */
const GlobalScrollEffects: React.FC = () => {
  const location = useLocation();

  // ── 1. Progress bar ─────────────────────────────────────────────────────────
  useEffect(() => {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);

    let rafId = 0;
    let lastWidth = 0;
    let ticking = false;

    const update = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          if (total > 0) {
            const pct = Math.min((window.scrollY / total) * 100, 100);
            if (Math.abs(pct - lastWidth) > 0.2) {
              bar.style.width = `${pct}%`;
              lastWidth = pct;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(rafId);
      bar.remove();
    };
  }, []);

  // ── 2. CSS data-reveal & Section entrances IntersectionObserver ───────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('[data-reveal], [data-cinematic-section]');
      if (!els.length) return;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              el.classList.add('is-revealed');
              io.unobserve(el);
            }
          });
        },
        { threshold: 0.05, rootMargin: '50px 0px 50px 0px' }
      );

      els.forEach((el) => {
        el.classList.add('is-revealed');
        io.observe(el);
      });

      return () => io.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default GlobalScrollEffects;
