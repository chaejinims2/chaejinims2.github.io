/* Service Worker for pxart-rullet offline cache */
/* global self, caches, fetch */

const CACHE_NAME = 'pxart-rullet-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './rullet-entry.js',
  './script.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))).then(() => self.clients.claim())
  );
});

async function cachePutSafe(cache, request, response) {
  try {
    // Only cache successful GET responses (opaque is allowed).
    if (response && (response.ok || response.type === 'opaque')) {
      await cache.put(request, response);
    }
  } catch (e) {}
}

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type !== 'CACHE_URLS' || !Array.isArray(data.urls)) return;
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of data.urls) {
        if (!url || typeof url !== 'string') continue;
        try {
          const req = new Request(url, { mode: 'cors', credentials: 'omit' });
          const res = await fetch(req);
          await cachePutSafe(cache, req, res.clone());
        } catch (e) {}
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (!req || req.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: false });
    if (cached) return cached;

    try {
      const res = await fetch(req);
      await cachePutSafe(cache, req, res.clone());
      return res;
    } catch (e) {
      // Offline fallback for navigation to app shell
      if (req.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      throw e;
    }
  })());
});

