import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useCompanyData } from '../../hooks/useCompanyData';
import { logCallAction } from '../../lib/tracking';

export const MobileStickyCTA: React.FC = () => {
    const { phone, name } = useCompanyData();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 300px
            setIsVisible(window.scrollY > 300);
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
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-luxury pb-safe">
            <div className="grid grid-cols-2 gap-0">
                {/* Call Button */}
                <button
                    onClick={handleCall}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-luxury-charcoal text-white font-semibold transition-colors active:bg-luxury-charcoal/90"
                >
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                </button>

                {/* WhatsApp Button */}
                <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold transition-colors active:from-green-600 active:to-green-700"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                </button>
            </div>
        </div>
    );
};

export default MobileStickyCTA;
