import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Types ──────────────────────────────────────────────────────────────────────
type RevealVariant =
  | 'fadeUp'      // standard reveal from below
  | 'fadeIn'      // pure opacity
  | 'slideLeft'   // from right
  | 'slideRight'  // from left
  | 'scale'       // scale in
  | 'blurClear'   // blur → sharp (cinematic)
  | 'clipReveal'; // clip-path wipe

interface UseScrollRevealOptions {
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  scrub?: boolean | number;
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export const useScrollReveal = (
  selector: string,
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseScrollRevealOptions = {}
) => {
  const {
    variant = 'fadeUp',
    delay = 0,
    duration = 0.95,
    stagger = 0.12,
    start = 'top 88%',
    scrub = false,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const els = gsap.utils.toArray<HTMLElement>(selector, container);
    if (!els.length) return;

    const getFrom = (): gsap.TweenVars => {
      switch (variant) {
        case 'fadeUp':    return { opacity: 0, y: 50, force3D: true };
        case 'fadeIn':    return { opacity: 0 };
        case 'slideLeft': return { opacity: 0, x: 60, force3D: true };
        case 'slideRight':return { opacity: 0, x: -60, force3D: true };
        case 'scale':     return { opacity: 0, scale: 0.92, force3D: true };
        case 'blurClear': return { opacity: 0, filter: 'blur(16px)', y: 20 };
        case 'clipReveal':return { clipPath: 'inset(0 100% 0 0)', opacity: 1 };
        default:          return { opacity: 0, y: 40 };
      }
    };

    const getTo = (): gsap.TweenVars => {
      switch (variant) {
        case 'clipReveal': return { clipPath: 'inset(0 0% 0 0)', duration, ease: 'expo.inOut', stagger };
        case 'blurClear':  return { opacity: 1, filter: 'blur(0px)', y: 0, duration, ease: 'expo.out', stagger };
        default:           return { opacity: 1, y: 0, x: 0, scale: 1, filter: 'none', duration, ease: 'expo.out', stagger };
      }
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: scrub ? undefined : 'play none none none',
        scrub: scrub || false,
        once: !scrub,
      },
    });

    tl.fromTo(els, getFrom(), { ...getTo(), delay });

    return () => { tl.kill(); };
  }, [selector, variant, delay, duration, stagger, start, scrub]);
};

// ── Parallax hook ──────────────────────────────────────────────────────────────
export const useParallax = (
  ref: React.RefObject<HTMLElement | null>,
  speed: number = 0.3, // 0 = no parallax, 1 = full parallax
  direction: 'y' | 'x' = 'y'
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dist = () => el.offsetHeight * speed;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const offset = (progress - 0.5) * 2 * dist();
        gsap.set(el, { [direction]: offset, force3D: true });
      },
    });

    return () => st.kill();
  }, [speed, direction]);
};

// ── Image reveal hook (scale + clip) ──────────────────────────────────────────
export const useImageReveal = (ref: React.RefObject<HTMLElement | null>, delay = 0) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const img = el.querySelector('img');
    if (!img) return;

    // Wrap in clip container if not already
    const wrapper = el;
    gsap.set(wrapper, { overflow: 'hidden' });
    gsap.set(img, { scale: 1.12, transformOrigin: 'center center' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
    });

    tl.fromTo(wrapper,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.inOut', delay }
    ).to(img,
      { scale: 1, duration: 1.6, ease: 'expo.out' },
      '-=0.9'
    );

    return () => { tl.kill(); };
  }, [delay]);
};
