import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

    const update = () => {
      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total <= 0) return;
        const pct = Math.min((window.scrollY / total) * 100, 100);
        // Only update DOM when value actually changed (avoids unnecessary repaints)
        if (Math.abs(pct - lastWidth) > 0.2) {
          bar.style.width = `${pct}%`;
          lastWidth = pct;
        }
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(rafId);
      bar.remove();
    };
  }, []);

  // ── 2. CSS data-reveal IntersectionObserver ──────────────────────────────────
  // Pure CSS transitions — zero Framer Motion, zero GSAP
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
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
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── 3. Section entrances — ONLY on desktop pointer:fine ─────────────────────
  // Only opacity (composited) — no scale, no filter = no layout/paint triggers
  useEffect(() => {
    const isDesktop = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isDesktop || reduced) return;

    const ctx = gsap.context(() => {
      document.querySelectorAll('[data-cinematic-section]').forEach((section) => {
        gsap.fromTo(section,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 92%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
};

export default GlobalScrollEffects;
