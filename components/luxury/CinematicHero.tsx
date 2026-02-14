import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../Button';
import { useSiteContent } from '../../hooks/useSiteContent';

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
    backgroundVideo,
    titleColor = '#FFFFFF',
    emphasisColor = '#D4AF37', // Luxury Gold
    subtextColor = '#e0e0e0', // Warm Gray
    title: defaultTitle = 'Where Luxury',
    emphasisText: defaultEmphasis = 'Meets Your Vision',
    description: defaultDesc = '150+ families transformed their homes using premium materials and expert design. On-time delivery guaranteed. 5-year warranty included.'
}) => {
    // Dynamic Content Fetching
    const { content } = useSiteContent('home_hero', {
        title: defaultTitle,
        subtitle: defaultEmphasis,
        ctaText: 'Get a Consultation',
        backgroundImage: defaultBg,
        description: defaultDesc
    });

    // Debug log
    console.log('Hero content from Firestore:', content);

    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 500], [0, 200]);
    const textY = useTransform(scrollY, [0, 500], [0, -100]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-luxury-black">
            {/* Background Container with Parallax & Slow Zoom */}
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0 w-full h-full"
            >
                {backgroundVideo ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
                ) : (
                    content.backgroundImage ? (
                        <>
                            <img
                                src={content.backgroundImage}
                                alt="Luxury Interior Design"
                                className="w-full h-full object-cover"
                                loading="eager"
                                onLoad={() => console.log('✅ Hero image loaded:', content.backgroundImage)}
                                onError={(e) => console.error('❌ Hero image failed to load:', content.backgroundImage, e)}
                            />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-luxury-charcoal to-luxury-obsidian flex items-center justify-center">
                            <p className="text-neutral-600 text-sm">No background image set</p>
                        </div>
                    )
                )}
            </motion.div>

            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.6)_100%)] mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

            {/* Content */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20"
            >
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Floating Badge - Stagger 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-6 py-2 border border-luxury-gold/30 rounded-full text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold bg-black/20 backdrop-blur-md shadow-glow-gold">
                            Bespoke Excellence Since 2010
                        </span>
                    </motion.div>

                    {/* Headline - Stagger 2 */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                        className="font-serif font-bold text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[1.05] tracking-tight drop-shadow-2xl"
                        style={{
                            textShadow: "0 10px 40px rgba(0,0,0,0.6)",
                            color: titleColor
                        }}
                    >
                        {content.title}{' '}
                        <span
                            className="block mt-2 italic font-medium"
                            style={{ color: emphasisColor }}
                        >
                            {content.subtitle}
                        </span>
                    </motion.h1>

                    {/* Subtext - Stagger 3 */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg font-sans tracking-wide"
                        style={{ color: subtextColor }}
                    >
                        {content.description}
                    </motion.p>

                    {/* CTA Buttons - Stagger 4 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
                    >
                        <Button to="/contact" variant="primary" className="min-w-[200px] shadow-glow-green hover:scale-105 transition-transform duration-300">
                            {content.ctaText}
                        </Button>
                        <Button to="/projects" variant="white" className="min-w-[200px] hover:shadow-glow-gold hover:scale-105 transition-transform duration-300">
                            View Portfolio
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-white/50 text-[10px] uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-luxury-gold to-transparent opacity-50" />
            </motion.div>
        </section>
    );
};

export default CinematicHero;
