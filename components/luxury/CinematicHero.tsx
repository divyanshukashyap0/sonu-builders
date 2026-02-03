import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CinematicHeroProps {
    backgroundImage?: string;
    backgroundVideo?: string;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
    backgroundImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80',
    backgroundVideo
}) => {
    // Removed parallax scroll listener for better performance

    return (
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
            {/* Background Video or Image - Fixed (no parallax) */}
            {backgroundVideo ? (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={backgroundVideo} type="video/mp4" />
                </video>
            ) : (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url("${backgroundImage}")`
                    }}
                />
            )}

            {/* Light Champagne Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-ivory-pearl/60 via-ivory-pearl/20 to-transparent" />
            <div className="absolute inset-0 bg-ivory-pearl/20 backdrop-blur-[2px]" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Headline */}
                    <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-luxury-charcoal leading-tight animate-fadeInUp">
                        Designing Spaces That Define{' '}
                        <span className="text-luxury-gold block mt-2 drop-shadow-sm">How You Live</span>
                    </h1>

                    {/* Subtext */}
                    <p
                        className="text-lg sm:text-xl md:text-2xl text-luxury-charcoal/80 max-w-3xl mx-auto leading-relaxed animate-fadeInUp font-medium"
                        style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
                    >
                        Luxury interiors & turnkey construction crafted with precision, trust, and timeless design.
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp"
                        style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}
                    >
                        <a
                            href="/contact"
                            className="btn-luxury bg-luxury-gold text-white px-10 py-5 rounded-sm hover:bg-luxury-charcoal hover:shadow-luxury-hover transition-all duration-500 flex items-center gap-3 text-lg font-bold w-full sm:w-auto justify-center uppercase tracking-widest"
                        >
                            Start Your Journey
                            <ArrowRight className="w-5 h-5" />
                        </a>

                        <a
                            href="/projects"
                            className="btn-luxury bg-white border border-luxury-gold/30 text-luxury-charcoal px-10 py-5 rounded-sm hover:border-luxury-gold hover:shadow-luxury transition-all duration-500 text-lg font-bold w-full sm:w-auto justify-center uppercase tracking-widest"
                        >
                            Explore Portfolios
                        </a>
                    </div>
                </div>
            </div>

            {/* Removed scroll indicator per user request */}
        </section>
    );
};

export default CinematicHero;
