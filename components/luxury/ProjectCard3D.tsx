import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import usePerformanceTier from '../../hooks/usePerformanceTier';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface ProjectCardProps {
  id: string;
  title: string;
  image: string;
  category?: string;
  location?: string;
  index?: number;
}

const SPRING = { stiffness: 240, damping: 28, mass: 0.7 };
const TILT_MAX = 10;

const ProjectCard3D: React.FC<ProjectCardProps> = ({
  id, title, image, category, location, index = 0,
}) => {
  const { tiltOk, blurOk, isLow } = usePerformanceTier();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rafPendingRef = useRef(false);

  // Raw mouse motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-damped (only used on mid/high)
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

  const rotateY = useTransform(springX, [-1, 1], [-TILT_MAX, TILT_MAX]);
  const rotateX = useTransform(springY, [-1, 1], [TILT_MAX, -TILT_MAX]);
  const glowOpacity = useTransform(springX, [-1, 1], [0.06, 0.2]);

  // ── RAF-throttled mouse handler ─────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltOk) return;
    if (rafPendingRef.current) return; // skip if RAF is pending
    rafPendingRef.current = true;
    requestAnimationFrame(() => {
      rafPendingRef.current = false;
      const card = cardRef.current;
      if (!card) return;
      const { left, top, width, height } = card.getBoundingClientRect();
      rawX.set(((e.clientX - left) / width) * 2 - 1);
      rawY.set(((e.clientY - top) / height) * 2 - 1);
    });
  }, [tiltOk, rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); setIsHovered(false);
  }, [rawX, rawY]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  // Entrance animation — simplified on low-end
  const entrance = {
    hidden: { opacity: 0, y: isLow ? 0 : 30, scale: isLow ? 1 : 0.97 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: {
        duration: isLow ? 0.4 : 0.75,
        delay: isLow ? 0 : (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  // ── Render: low-end flat card ───────────────────────────────────────────────
  if (isLow) {
    return (
      <motion.div className="break-inside-avoid" variants={entrance} initial="hidden" animate="show">
        <Link
          to={`/projects/${id}`}
          className="block relative overflow-hidden rounded-sm"
          style={{ border: '1px solid rgba(197,160,89,0.1)' }}
        >
          <img src={image} alt={title} className="w-full h-auto object-cover block"
            style={{ filter: 'brightness(0.85)' }} loading="lazy" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 60%)' }} />
          {category && (
            <div className="absolute top-3 left-3 px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] font-bold"
              style={{ background: 'rgba(6,6,6,0.7)', border: '1px solid rgba(197,160,89,0.3)', color: '#c5a059', borderRadius: '2px' }}>
              {category}
            </div>
          )}
          <div className="px-4 py-3" style={{ background: 'rgba(6,6,6,0.9)' }}>
            <p className="text-white text-sm font-bold truncate"
              style={{ fontFamily: "'Cormorant Garamond',serif" }}>{title}</p>
            {location && (
              <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: 'rgba(197,160,89,0.6)' }}>
                <MapPin className="w-2.5 h-2.5" />{location}
              </p>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── Full 3D card (mid + high) ───────────────────────────────────────────────
  return (
    <motion.div className="break-inside-avoid" variants={entrance} initial="hidden" animate="show">
      <div
        ref={cardRef}
        className="relative"
        style={{ perspective: '900px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {/* Gold ambient glow — only on high */}
        {!isLow && (
          <motion.div
            className="absolute inset-0 rounded-sm pointer-events-none"
            style={{
              opacity: glowOpacity,
              background: 'radial-gradient(ellipse at center,rgba(197,160,89,0.5) 0%,transparent 70%)',
              filter: 'blur(18px)',
              transform: 'scale(1.05)',
              zIndex: 0,
            }}
          />
        )}

        {/* 3D card */}
        <motion.div
          style={{ rotateX: tiltOk ? rotateX : 0, rotateY: tiltOk ? rotateY : 0, transformStyle: 'preserve-3d', willChange: 'transform' }}
          transition={{ type: 'spring', ...SPRING }}
        >
          <Link
            to={`/projects/${id}`}
            className="block relative overflow-hidden rounded-sm"
            style={{
              border: '1px solid rgba(197,160,89,0.12)',
              boxShadow: isHovered
                ? '0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(197,160,89,0.28)'
                : '0 6px 30px rgba(0,0,0,0.45)',
              transition: 'box-shadow 0.45s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <motion.img
                src={image} alt={title}
                className="w-full h-auto object-cover block"
                animate={{ scale: isHovered ? 1.07 : 1 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                style={{ filter: isHovered ? 'brightness(0.72) contrast(1.04)' : 'brightness(0.85)' }}
                loading="lazy"
              />

              {/* Depth gradient */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.15) 45%,transparent 100%)' }} />

              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg,rgba(197,160,89,0.05) 0%,transparent 60%)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.4s ease' }}
              />

              {/* Gold top shimmer on hover */}
              <div
                className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.55),transparent)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.4s ease' }}
              />

              {/* Category pill */}
              {category && (
                <div className="absolute top-3 left-3 px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] font-bold pointer-events-none"
                  style={{ background: 'rgba(6,6,6,0.65)', border: '1px solid rgba(197,160,89,0.35)', backdropFilter: blurOk ? 'blur(8px)' : 'none', color: '#c5a059', borderRadius: '2px' }}>
                  {category}
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="relative">
              <div className="px-4 py-3" style={{ background: 'rgba(6,6,6,0.9)', borderTop: '1px solid rgba(197,160,89,0.08)' }}>
                <p className="text-white text-sm font-bold truncate" style={{ fontFamily: "'Cormorant Garamond',serif" }}>{title}</p>
                {location && (
                  <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: 'rgba(197,160,89,0.6)' }}>
                    <MapPin className="w-2.5 h-2.5" />{location}
                  </p>
                )}
              </div>

              {/* Slide-down panel on hover */}
              <motion.div
                className="overflow-hidden"
                animate={{ height: isHovered ? 'auto' : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: blurOk ? 'blur(12px)' : 'none', borderTop: '1px solid rgba(197,160,89,0.08)' }}
              >
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.25em] font-bold" style={{ color: 'rgba(197,160,89,0.7)' }}>View Project</span>
                  <motion.div animate={{ x: isHovered ? 0 : -6, opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: '#c5a059' }} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Gold bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
                style={{ background: 'linear-gradient(90deg,transparent,#c5a059,transparent)', opacity: isHovered ? 0.7 : 0, transition: 'opacity 0.4s ease' }} />
            </div>

            {/* Inset gold border */}
            <div className="absolute inset-0 rounded-sm pointer-events-none"
              style={{ boxShadow: isHovered ? 'inset 0 0 0 1px rgba(197,160,89,0.3)' : 'inset 0 0 0 1px rgba(197,160,89,0.06)', transition: 'box-shadow 0.4s ease' }} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectCard3D;
