/**
 * CinematicOverlay — Zero-JS version.
 *
 * All effects are pure CSS:
 *  - Vignette: radial-gradient
 *  - Film grain: static SVG feTurbulence filter (no canvas, no RAF)
 *  - Letterbox lines: linear-gradient
 *
 * Particles and ambient orbs disabled globally — too expensive for most devices.
 * If the device is HIGH-tier and user wants particles, they can be added back as a
 * separate opt-in component.
 */
import React from 'react';

const CinematicOverlay: React.FC = () => (
  <>
    {/* SVG filter definition — inline, zero network request */}
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <defs>
        <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%"
          colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
      </defs>
    </svg>

    {/* Film grain pseudo-element — static, no redraws */}
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9990]"
      style={{
        filter: 'url(#grain-filter)',
        opacity: 0.04,
        mixBlendMode: 'overlay',
      }}
    />

    {/* Vignette — pure CSS radial-gradient */}
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9989]"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.28) 76%, rgba(0,0,0,0.5) 100%)',
      }}
    />

    {/* Letterbox accent lines */}
    <div aria-hidden="true" className="fixed top-0 left-0 right-0 h-[1px] pointer-events-none z-[9995]"
      style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.1),transparent)' }} />
    <div aria-hidden="true" className="fixed bottom-0 left-0 right-0 h-[1px] pointer-events-none z-[9995]"
      style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.07),transparent)' }} />
  </>
);

export default CinematicOverlay;
