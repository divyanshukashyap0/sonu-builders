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
      // Check session storage to see if user dismissed it this session
      const isDismissed = sessionStorage.getItem('pwa_toast_dismissed');
      if (!isDismissed) {
        // Delay showing it slightly for better UX
        setTimeout(() => setShowInstall(true), 5000);
      }
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const installApp = async () => {
    try {
      if (!installPromptEvent) return;
      const choice = await installPromptEvent.prompt();
      if (choice.outcome === 'accepted') {
        setShowInstall(false);
      }
      setInstallPromptEvent(null);
    } catch {
      setShowInstall(false);
      setInstallPromptEvent(null);
    }
  };

  const dismissToast = () => {
    setShowInstall(false);
    sessionStorage.setItem('pwa_toast_dismissed', 'true');
  };

  return (
    <>
      {/* PWA Install Toast - Centered Bottom */}
      {showInstall && (
        <div className="fixed bottom-32 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[100] animate-fadeInUp w-[90%] max-w-sm">
          <div className="bg-stone-900 text-white p-4 rounded-xl shadow-luxury border border-luxury-gold/20 flex items-center gap-4">
            <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10">
              <img src="/favicon.png" alt="App Icon" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-luxury-gold mb-0.5 truncate">Install App</p>
              <p className="text-[10px] text-stone-300 leading-tight">Add to home screen for the best experience.</p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={installApp}
                className="bg-luxury-gold text-stone-950 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded hover:bg-white transition-all whitespace-nowrap"
              >
                Install
              </button>
              <button
                onClick={dismissToast}
                className="text-[10px] text-stone-500 hover:text-white transition-colors uppercase tracking-wider font-bold text-center"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons - Bottom Right */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col gap-2 items-end">
        <a
          href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${COMPANY_NAME}, I would like to request a quotation for my project.`)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-full shadow-lg shadow-green-500/20 hover:scale-105 transition-all flex items-center justify-center group relative"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute right-full mr-3 bg-white text-luxury-charcoal text-xs font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us
          </span>
          <MessageCircle className="w-6 h-6" />
        </a>
        <a
          href={`tel:${COMPANY_PHONE.replace(/[^0-9]/g, '')}`}
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
