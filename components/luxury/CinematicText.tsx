import React from 'react';
import { motion, Variants } from 'framer-motion';

interface CinematicTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** 'word' = word by word, 'char' = character by character */
  splitBy?: 'word' | 'char';
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

// ─── Word-reveal variant ───────────────────────────────────────────────────────
const containerVariant: Variants = {
  hidden: {},
  show: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const wordVariant: Variants = {
  hidden: {
    y: '105%',
    opacity: 0,
    rotateX: 40,
  },
  show: {
    y: '0%',
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const CinematicText: React.FC<CinematicTextProps> = ({
  text,
  className = '',
  style = {},
  splitBy = 'word',
  delay = 0,
  staggerDelay = 0.08,
  once = true,
}) => {
  const parts = splitBy === 'word' ? text.split(' ') : text.split('');

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.25em] overflow-visible ${className}`}
      style={{ ...style, perspectiveOrigin: 'center bottom', perspective: '600px' }}
      variants={containerVariant}
      custom={staggerDelay}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.3 }}
      transition={{ delayChildren: delay }}
    >
      {parts.map((part, i) => (
        <span key={i} className="overflow-hidden inline-block" style={{ lineHeight: 'inherit' }}>
          <motion.span
            className="inline-block"
            variants={wordVariant}
            style={{ 
              display: 'inline-block', 
              transformOrigin: 'center bottom',
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased'
            }}
          >
            {part}
            {splitBy === 'word' && i < parts.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default CinematicText;
