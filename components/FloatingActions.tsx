import React, { useEffect, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { COMPANY_PHONE, COMPANY_NAME } from '../constants';

const FloatingActions: React.FC = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const installApp = async () => {
    try {
      if (!installPromptEvent) return;
      const choice = await installPromptEvent.prompt();
      // choice.outcome: 'accepted' | 'dismissed'
      setShowInstall(false);
      setInstallPromptEvent(null);
    } catch {
      setShowInstall(false);
      setInstallPromptEvent(null);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {showInstall && (
        <button
          onClick={installApp}
          className="bg-brand-gold text-white px-4 py-2 rounded-full shadow-lg hover:scale-110 transition-transform text-sm font-semibold"
          aria-label="Install App"
        >
          Install App
        </button>
      )}
      <a 
        href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${COMPANY_NAME}, I would like to request a quotation for my project.`)}`} 
        target="_blank" 
        rel="noreferrer"
        className="bg-brand-gold text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
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
