import React, { useEffect } from 'react';

/**
 * GlobalScrollEffects — minimal JS, maximum CSS.
 *
 * 1. Scroll progress bar   — passive RAF, CSS width update
 * 2. data-reveal            — IntersectionObserver → CSS class (ZERO JS animation)
 * 3. Section entrance       — GSAP opacity only (NO filter, NO scale) — only desktop
 * 4. Parallax / blur        — disabled globally (perf cost too high for general use)
 */
const GlobalScrollEffects: React.FC = () => {

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
            // Only update DOM when value actually changed (avoids unnecessary repaints)
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
  // Pure CSS transitions — zero Framer Motion, zero GSAP
  useEffect(() => {
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
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
};

export default GlobalScrollEffects;
