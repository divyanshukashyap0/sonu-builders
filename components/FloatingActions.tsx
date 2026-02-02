import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { COMPANY_PHONE, COMPANY_NAME } from '../constants';

const FloatingActions: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a 
        href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${COMPANY_NAME}, I would like to request a quotation for my project.`)}`} 
        target="_blank" 
        rel="noreferrer"
        className="bg-brand-gold text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      
      {/* Phone Button (Mobile Only usually, but good for desktop too if connected) */}
      <a 
        href={`tel:${COMPANY_PHONE.replace(/[^0-9]/g, '')}`} 
        className="bg-brand-blue text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center md:hidden"
        aria-label="Call Us"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
};

export default FloatingActions;
