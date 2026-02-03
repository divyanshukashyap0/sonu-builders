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
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col gap-2 items-end">
      {showInstall && (
        <button
          onClick={installApp}
          className="bg-brand-gold/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg shadow-brand-gold/20 hover:scale-105 transition-all text-xs font-semibold"
          aria-label="Install App"
        >
          Install App
        </button>
      )}
      <a
        href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${COMPANY_NAME}, I would like to request a quotation for my project.`)}`}
        target="_blank"
        rel="noreferrer"
        className="bg-[#25D366] text-white p-2.5 rounded-full shadow-lg shadow-green-500/20 hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
      <a
        href={`tel:${COMPANY_PHONE.replace(/[^0-9]/g, '')}`}
        className="bg-brand-blue text-white p-2.5 rounded-full shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all flex items-center justify-center md:hidden"
        aria-label="Call Us"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
};

export default FloatingActions;
