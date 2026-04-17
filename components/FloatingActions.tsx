import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { COMPANY_PHONE, COMPANY_NAME } from '../constants';
import { logCallAction } from '../lib/tracking';

const FloatingActions: React.FC = () => {
  return (
    <>
      {/* Floating Action Buttons - Bottom Right */}
      <div className="fixed bottom-40 md:bottom-24 right-4 z-40 flex flex-col gap-2 items-end">
        <a
          href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${COMPANY_NAME}, I would like to request a quotation for my project.`)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-full shadow-lg shadow-green-500/20 hover:scale-105 transition-all flex items-center justify-center group relative lg:hidden"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute right-full mr-3 bg-white text-luxury-charcoal text-xs font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us
          </span>
          <MessageCircle className="w-6 h-6" />
        </a>
        <a
          href={`tel:${COMPANY_PHONE.replace(/[^0-9]/g, '')}`}
          onClick={logCallAction}
          className="bg-brand-blue text-white p-3 rounded-full shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all flex items-center justify-center md:hidden"
          aria-label="Call Us"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>
    </>
  );
};

export default FloatingActions;
