import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Button from '../Button';
import { useSiteContent } from '../../hooks/useSiteContent';
import { usePerformance } from '../../context/PerformanceContext';
import { ChevronDown } from 'lucide-react';
import YouTubeBackground from '../ui/YouTubeBackground';
import MediaRenderer from '../ui/MediaRenderer';

interface CinematicHeroProps {
    backgroundImage?: string;
    backgroundVideo?: string;
    titleColor?: string;
    emphasisColor?: string;
    subtextColor?: string;
    title?: string;
    emphasisText?: string;
    description?: string;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
    backgroundImage: defaultBg = '',
    backgroundVideo: defaultVideo = '',
    titleColor = 'var(--luxury-white)',
    emphasisColor = 'var(--luxury-gold)',
    subtextColor = 'rgba(255, 255, 255, 0.8)',
    title: defaultTitle = 'Where Luxury',
    emphasisText: defaultEmphasis = 'Meets Your Vision',
    description: defaultDesc = '4000+ families transformed their homes using premium materials and expert design. On-time delivery guaranteed. 10-year warranty included.'
}) => {
    // Dynamic Content Fetching
    const { content } = useSiteContent('home_hero', {
        title: defaultTitle,
        subtitle: defaultEmphasis,
        ctaText: 'Get a Consultation',
        backgroundImage: defaultBg,
        backgroundVideo: defaultVideo,
        description: defaultDesc
    });

    const { isLowPowerMode } = usePerformance();
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Smooth parallax effects - Reduced intensity for better performance/feel
    const yRange = isLowPowerMode ? [0, 0] : [0, 500];
    const bgY = useTransform(scrollY, [0, 500], isLowPowerMode ? ["0%", "0%"] : ["0%", "15%"]); // Was 30%
    const textY = useTransform(scrollY, [0, 500], isLowPowerMode ? ["0%", "0%"] : ["0%", "25%"]); // Was 50%
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    const titleText = content.title || defaultTitle;
    const subtitleText = content.subtitle || defaultEmphasis;

    // Typewriter effect configuration
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            display: "inline-block", // Ensures layout stability
            transition: {
                duration: 0, // Instant appearance like a keystroke
            },
        },
        hidden: {
            opacity: 0,
            display: "none", // Retains layout but hidden
            transition: {
                duration: 0,
            },
        },
    };

    return (
        <section
            ref={targetRef}
            className={`relative min-h-[100svh] flex items-center justify-center overflow-hidden w-full ${isLowPowerMode ? 'bg-black' : 'bg-transparent'} group`}
        >
            {/* Background Container with Parallax */}
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0 w-full h-full will-change-transform"
            >
                {/* Priority: 1. YouTube Video (if not in low power), 2. Local/Direct Video, 3. Background Image */}
                {!isLowPowerMode && (content.backgroundVideo || defaultVideo) ? (
                    (content.backgroundVideo || defaultVideo).includes('youtube.com') || (content.backgroundVideo || defaultVideo).includes('youtu.be') ? (
                        <YouTubeBackground videoUrl={content.backgroundVideo || defaultVideo || ''} overlayOpacity={0} />
                    ) : (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-cover"
                        >
                            <source src={content.backgroundVideo || defaultVideo} type="video/mp4" />
                        </video>
                    )
                ) : (
                    <MediaRenderer
                        src={content.backgroundImage || ''}
                        alt="Luxury Interior Design"
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                )}
            </motion.div>

            {/* Cinematic Gradient Overlay - Enhanced for text readability - Lightens on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 transition-opacity duration-700 group-hover:opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] transition-opacity duration-700 group-hover:opacity-60" />
            {!isLowPowerMode && <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] transition-all duration-700 group-hover:backdrop-blur-none group-hover:bg-black/0" />}

            {/* Content */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 md:pt-20"
            >
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden md:block mb-8"
                    >
                        <span className="inline-block px-6 py-2 border border-luxury-gold/30 rounded-full text-luxury-gold text-xs uppercase tracking-[0.4em] font-bold bg-black/20 backdrop-blur-md shadow-glow-gold">
                            Est. 2010 • Premium Interiors
                        </span>
                    </motion.div>

                    {/* Main Heading with Staggered Animation */}
                    <div className="overflow-hidden">
                        <h1
                            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight text-white mb-6"
                            style={{ color: titleColor }}
                        >
                            {titleText}
                            <br />
                            <span className="text-luxury-gold block mt-2" style={{ color: emphasisColor }}>
                                {subtitleText}
                                {/* Blinking Cursor */}
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    className="inline-block w-[2px] h-[0.8em] bg-luxury-gold ml-1 translate-y-[0.1em]"
                                />
                            </span>
                        </h1>
                    </div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-wide"
                        style={{ color: subtextColor }}
                    >
                        {content.description || defaultDesc}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
                    >
                        <Button to="/contact" variant="primary" className="min-w-[200px] shadow-glow-green hover:scale-105 transition-transform duration-300">
                            {content.ctaText}
                        </Button>
                        <Button to="/projects" variant="white" className="min-w-[200px] hover:shadow-glow-gold hover:scale-105 transition-transform duration-300">
                            Explore Collection
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-luxury-gold to-transparent opacity-50" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold/80 font-bold mb-2">Scroll</span>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5 text-luxury-gold" />
                </motion.div>
            </motion.div>

        </section>
    );
};

export default CinematicHero;
