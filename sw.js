// Forja: service worker. Guarda la app en el teléfono para usarla sin internet.
// Si cambiás algo en index.html, subí el número de VERSION para que se actualice.
const VERSION = 'forja-v1';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((guardado) => {
      if (guardado) return guardado;
      return fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});
