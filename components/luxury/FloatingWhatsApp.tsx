import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { COMPANY_PHONE, COMPANY_NAME } from '../../constants';

export const FloatingWhatsApp: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const whatsappUrl = `https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Hello ${COMPANY_NAME}, I would like to inquire about your interior design services.`
    )}`;

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {isExpanded && (
                    <div className="absolute bottom-20 right-0 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-luxury-hover p-6 mb-2 animate-fadeInUp">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-4">
                            <h3 className="font-serif font-bold text-lg text-luxury-charcoal mb-2">
                                Chat with us on WhatsApp
                            </h3>
                            <p className="text-sm text-gray-600">
                                Get instant answers to your interior design queries
                            </p>
                        </div>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-center"
                        >
                            Start Conversation
                        </a>
                    </div>
                )}

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="group relative w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-luxury-hover hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110"
                    aria-label="WhatsApp Chat"
                >
                    <MessageCircle className="w-8 h-8 text-white" />
                </button>
            </div>
        </>
    );
};

export default FloatingWhatsApp;
