import React from 'react';
import { motion } from 'framer-motion';
import MediaRenderer from '../ui/MediaRenderer';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    backgroundImage: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, backgroundImage }) => {
    console.log('PageHero backgroundImage:', backgroundImage);

    return (
        <div className="relative h-[50vh] min-h-[350px] flex items-end pb-16 justify-start overflow-hidden group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-neutral-900 to-neutral-800">
                {backgroundImage && (
                    <MediaRenderer
                        src={backgroundImage}
                        alt=""
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s]"
                        loading="eager"
                    />
                )}
                {/* Overlay for readability - sophisticated cinematic gradient */}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.5)_100%)]" />
                <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Content - Aligned Bottom Left */}
            <div className="relative z-10 px-4 max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-[1px] w-12 bg-luxury-gold"></span>
                        <span className="text-luxury-gold font-bold tracking-[0.3em] uppercase text-xs">
                            Sonu Interiors
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg leading-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-white text-lg font-light max-w-xl leading-relaxed drop-shadow-md">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default PageHero;
