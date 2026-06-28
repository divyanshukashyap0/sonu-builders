import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumLoaderProps {
  onComplete?: () => void;
}

const PremiumLoader: React.FC<PremiumLoaderProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Allow the animation to finish (approx 1.8 seconds)
      setTimeout(() => {
        setShow(false);
        if (onComplete) onComplete();
      }, 1800);
    }, 100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Particle generation
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
          transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] bg-[#0B0B0B] flex items-center justify-center overflow-hidden"
        >
          {/* Subtle Textured Background & Vignette */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }} 
          />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B0B0B]/40 to-[#0B0B0B] pointer-events-none" />
          
          {/* Spotlight Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute w-[800px] h-[800px] bg-luxury-gold/10 rounded-full blur-[120px] pointer-events-none"
          />

          {/* Floating Dust Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: `${p.x}%`, y: `${p.y}%` }}
                animate={{ 
                  opacity: [0, 0.4, 0],
                  y: [`${p.y}%`, `${p.y - 10}%`],
                  x: [`${p.x}%`, `${p.x + (Math.random() - 0.5) * 5}%`]
                }}
                transition={{ 
                  duration: p.duration, 
                  repeat: Infinity, 
                  delay: p.delay,
                  ease: "linear" 
                }}
                className="absolute rounded-full bg-luxury-gold/40"
                style={{ width: p.size, height: p.size }}
              />
            ))}
          </div>

          {/* Main Content Container with Camera Push-in */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 10, ease: "linear" }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Logo Emblem Container */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 3, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="relative z-10 w-64 h-64 md:w-96 md:h-96"
              >
                {/* Logo Image with Shine Effect */}
                <div className="relative w-full h-full overflow-hidden rounded-xl">
                  <motion.img 
                    initial={{ opacity: 0, filter: 'brightness(0) contrast(1.2)' }}
                    animate={{ opacity: 1, filter: 'brightness(1.1) contrast(1)' }}
                    transition={{ duration: 4, ease: "easeOut" }}
                    src="/logo.png" 
                    alt="Sonu Enterprises Logo" 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Metallic Shine Sweep */}
                  <motion.div
                    initial={{ x: '-150%', skewX: -25 }}
                    animate={{ x: '250%' }}
                    transition={{ 
                      duration: 2.5, 
                      delay: 2, 
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 4
                    }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none"
                  />
                </div>
              </motion.div>

              {/* Breathing Glow behind Logo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 bg-luxury-gold/25 blur-[100px] -z-10 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumLoader;
