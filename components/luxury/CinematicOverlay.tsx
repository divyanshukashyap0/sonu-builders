import React, { useEffect, useState } from 'react';

const CinematicOverlay: React.FC = () => {
  const [noiseUrl, setNoiseUrl] = useState<string>('');

  useEffect(() => {
    // Generate a tiny repeating noise tile on mount (CPU cost = 1ms, run once, cached by browser)
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imgData = ctx.createImageData(128, 128);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      data[i] = val;       // R
      data[i + 1] = val;   // G
      data[i + 2] = val;   // B
      data[i + 3] = 10;    // Alpha (subtle 4% opacity)
    }
    ctx.putImageData(imgData, 0, 0);
    setNoiseUrl(canvas.toDataURL());
  }, []);

  return (
    <>
      {/* Film grain layer — CSS repeating background image (GPU-accelerated, zero redraw cost) */}
      {noiseUrl && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[9990]"
          style={{
            backgroundImage: `url(${noiseUrl})`,
            backgroundRepeat: 'repeat',
            opacity: 0.8,
          }}
        />
      )}

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
};

export default CinematicOverlay;
