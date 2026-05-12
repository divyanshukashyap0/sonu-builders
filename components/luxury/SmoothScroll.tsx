/**
 * SmoothScroll — Conservative mode.
 *
 * Lenis is ONLY enabled on desktop (hover pointer) with 4+ CPU cores.
 * All other devices use native scroll — it's always faster on mobile/low-end.
 */
import { useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Returns true only for genuine desktop with decent hardware */
const shouldUseLenis = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Only on pointer:fine devices (real mouse — not touch)
  if (!window.matchMedia('(pointer: fine)').matches) return false;
  // Need at least 4 cores
  if ((navigator.hardwareConcurrency ?? 2) < 4) return false;
  return true;
};

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();
  const lenisEnabled = useRef(shouldUseLenis());

  useEffect(() => {
    if (!lenisEnabled.current) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisEnabled.current) {
      lenisRef.current?.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    // Small delay so DOM settles before refreshing triggers
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
};
