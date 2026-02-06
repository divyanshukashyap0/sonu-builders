import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../Button';

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
    backgroundImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80',
    backgroundVideo,
    titleColor = '#FFFFFF',
    emphasisColor = '#000000',
    subtextColor = '#FFFFFF',
    title = 'Designing Spaces That Define',
    emphasisText = 'How You Live',
    description = 'Luxury interiors & turnkey construction crafted with precision, trust, and timeless design.'
}) => {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 500], [0, 200]);
    const textY = useTransform(scrollY, [0, 500], [0, -100]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-luxury-obsidian">
            {/* Background Container with Parallax */}
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
                        className="w-full h-full object-cover scale-110"
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
                ) : (
                    <div
                        className="w-full h-full bg-cover bg-center bg-no-repeat scale-110"
                        style={{
                            backgroundImage: `url("${backgroundImage}")`
                        }}
                    >
                        {/* Hidden image for LCP optimization */}
                        <img src={backgroundImage} alt="Hero Background" className="hidden" fetchpriority="high" />
                    </div>
                )}
            </motion.div>

            {/* Premium Gradient Overlay - Enhanced for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-obsidian/80 via-transparent to-luxury-obsidian/95" />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[0px]" />
            {/* Radial focus to darken edges and focus on center, but keep text contrasting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

            {/* Content */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 sm:pt-20"
            >
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Floating Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-2 border border-luxury-gold/30 rounded-full text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold bg-white/5 backdrop-blur-md">
                            Bespoke Excellence Since 2010
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="font-serif font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter drop-shadow-2xl"
                        style={{
                            textShadow: "0 10px 30px rgba(0,0,0,0.5)",
                            color: titleColor
                        }}
                    >
                        {title}{' '}
                        <span
                            className="block mt-4"
                            style={{ color: emphasisColor }}
                        >
                            {emphasisText}
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md"
                        style={{ color: subtextColor }}
                    >
                        {description}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        style={{
                            opacity: useTransform(scrollY, [500, 900], [1, 0]),
                            pointerEvents: useTransform(scrollY, (v) => v >= 900 ? "none" : "auto") as any
                        }}
                        className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-12"
                    >
                        <Button to="/contact" variant="primary">
                            Get a Consultation
                        </Button>
                        <Button to="/projects" variant="white">
                            View Portfolio
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default CinematicHero;
