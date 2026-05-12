import { useMemo } from 'react';

/**
 * Detects device performance tier.
 * Returns 'low' | 'mid' | 'high'
 *
 * Signals checked (all synchronous, zero network):
 *  - navigator.hardwareConcurrency (CPU cores)
 *  - navigator.deviceMemory        (RAM in GB, Chrome/Edge)
 *  - prefers-reduced-motion        (accessibility)
 *  - navigator.userAgent           (mobile heuristic)
 *  - connection.effectiveType      (network speed)
 */

export type PerfTier = 'low' | 'mid' | 'high';

const detectTier = (): PerfTier => {
  if (typeof window === 'undefined') return 'high';

  // Accessibility override — always honour reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low';

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as any).deviceMemory ?? 4; // GB, Chrome/Edge only
  const conn = (navigator as any).connection;
  const netType = conn?.effectiveType ?? '4g';
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  let score = 0;

  // CPU cores
  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else score += 0;

  // RAM
  if (memory >= 6) score += 3;
  else if (memory >= 3) score += 2;
  else score += 0;

  // Network
  if (netType === '4g' || netType === 'wifi') score += 2;
  else if (netType === '3g') score += 1;
  else score += 0; // 2g / slow-2g

  // Mobile penalty — GPU/thermal limits
  if (isMobile) score -= 2;

  if (score >= 6) return 'high';
  if (score >= 3) return 'mid';
  return 'low';
};

let _cachedTier: PerfTier | null = null;

/**
 * Singleton tier — computed once, cached for the session.
 * Safe to call from multiple components.
 */
export const getPerformanceTier = (): PerfTier => {
  if (_cachedTier === null) _cachedTier = detectTier();
  return _cachedTier;
};

const usePerformanceTier = (): {
  tier: PerfTier;
  isLow: boolean;
  isMid: boolean;
  isHigh: boolean;
  /** Should run canvas animations (film grain etc.) */
  canvasOk: boolean;
  /** Should run 3D tilt / spring physics */
  tiltOk: boolean;
  /** Should run floating particle systems */
  particlesOk: boolean;
  /** Should run backdrop-filter blurs */
  blurOk: boolean;
  /** Should run GSAP parallax scroll triggers */
  parallaxOk: boolean;
  /** Lenis smooth scroll lerp factor */
  scrollLerp: number;
} => {
  return useMemo(() => {
    const tier = getPerformanceTier();
    return {
      tier,
      isLow: tier === 'low',
      isMid: tier === 'mid',
      isHigh: tier === 'high',
      canvasOk: tier === 'high',
      tiltOk: tier !== 'low',
      particlesOk: tier !== 'low',
      blurOk: tier !== 'low',
      parallaxOk: tier !== 'low',
      scrollLerp: tier === 'high' ? 0.1 : tier === 'mid' ? 0.15 : 0.25,
    };
  }, []);
};

export default usePerformanceTier;
