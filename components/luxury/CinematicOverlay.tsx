import React from 'react';

/**
 * CinematicOverlay — Lightweight, zero-lag overlay for light luxury theme.
 * Replaced heavy canvas generation and dark vignette with subtle, high-performance accents.
 */
const CinematicOverlay: React.FC = () => {
  return (
    <>
      {/* Top and bottom subtle architectural gold hairline accents */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[1px] pointer-events-none z-[9995]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.35), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 h-[1px] pointer-events-none z-[9995]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.2), transparent)' }}
      />
    </>
  );
};

export default CinematicOverlay;
