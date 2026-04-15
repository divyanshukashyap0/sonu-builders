import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { UIProvider } from './context/UIContext';
import App from './App';

// --- VERSION CHECK & RESET LOGIC ---
const APP_VERSION = (process.env.APP_VERSION as string) || 'dev';

const checkVersionAndReset = async () => {
  const lastVersion = localStorage.getItem('sonu_app_version');
  
  // Only trigger reset if we have a stored version and it's different from current
  if (lastVersion && lastVersion !== APP_VERSION && APP_VERSION !== 'dev') {
    console.log(`Update detected: ${lastVersion} -> ${APP_VERSION}. Resetting application...`);
    
    try {
      // 1. Clear all browser caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // 2. Unregister ALL service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
      }

      // 3. Clear storage (excluding version for next check)
      localStorage.clear();
      sessionStorage.clear();
      
      // 4. Set new version and force reload
      localStorage.setItem('sonu_app_version', APP_VERSION);
      window.location.replace(window.location.origin + window.location.pathname);
      return;
    } catch (error) {
      console.error('Reset failed:', error);
    }
  }
  
  // Store current version if none exists or it matches
  localStorage.setItem('sonu_app_version', APP_VERSION);
};

// Execute reset check immediately
checkVersionAndReset();
// -----------------------------------

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </HelmetProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  const register = () => {
    navigator.serviceWorker.register(`/service-worker.js?v=${APP_VERSION}`)
      .then((registration) => {
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newSW = registration.installing;
          if (!newSW) return;
          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker installed - force reload to activate it
              window.location.reload();
            }
          });
        });

        // Check for updates periodically (every hour)
        setInterval(() => {
          registration.update();
        }, 3600000);
      })
      .catch((err) => {
        console.error('SW registration failed', err);
      });
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register);
  }
}
