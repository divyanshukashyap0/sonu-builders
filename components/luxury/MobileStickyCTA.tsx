import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useCompanyData } from '../../hooks/useCompanyData';
import { logCallAction } from '../../lib/tracking';

export const MobileStickyCTA: React.FC = () => {
    const { phone, name } = useCompanyData();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let lastVisible = false;
        const handleScroll = () => {
            // Show after scrolling 300px
            const nextVisible = window.scrollY > 300;
            if (nextVisible !== lastVisible) {
                setIsVisible(nextVisible);
                lastVisible = nextVisible;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCall = () => {
        logCallAction();
        window.location.href = `tel:${phone}`;
    };

    const handleWhatsApp = () => {
        const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            `Hello ${name}, I'm interested in your interior design services.`
        )}`;
        window.open(url, '_blank');
    };

    if (!isVisible) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-luxury-black border-t border-white/5 shadow-luxury pb-safe">
            <div className="grid grid-cols-2 gap-0">
                {/* Call Button */}
                <button
                    onClick={handleCall}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-luxury-charcoal text-white font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95"
                >
                    <Phone className="w-4 h-4 text-luxury-gold" />
                    <span>Call Now</span>
                </button>

                {/* WhatsApp Button */}
                <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-luxury-gold text-luxury-black font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-glow-gold"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                </button>
            </div>
        </div>
    );
};

export default MobileStickyCTA;
