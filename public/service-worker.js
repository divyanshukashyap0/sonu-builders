const urlParams = new URL(self.location.href).searchParams;
const VERSION = urlParams.get('v') || 'v4';
const CACHE_NAME = `sonu-pwa-${VERSION}`;
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.png',
  '/logo.png',
  '/index.css'
];

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't intercept admin routes, non-GET requests, or non-HTTP(S) requests
  if (
    url.pathname.startsWith('/admin') || 
    request.method !== 'GET' || 
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // Handle navigation requests (SPA support)
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) return preloadResponse;

        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put('/index.html', networkResponse.clone());
        return networkResponse;
      } catch (err) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('/offline.html');
        return cached || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      }
    })());
    return;
  }

  // Handle same-origin assets
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (err) {
        if (cached) return cached;
        return new Response('Network error occurred', { 
          status: 408, 
          headers: { 'Content-Type': 'text/plain' } 
        });
      }
    })());
    return;
  }

  // Handle images and fonts (Cross-origin)
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const networkResponse = await fetch(request.url, { mode: 'cors', credentials: 'omit' });
        if (!networkResponse.ok) throw new Error('Network response was not ok');
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        // Suppress warning as the UI handles fallbacks
        return new Response('', { status: 404, statusText: 'Not Found' });
      }
    })());
    return;
  }
});
