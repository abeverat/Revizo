// ═══════════════════════════════════════
// Revizo — Service Worker (cache-first)
// ═══════════════════════════════════════
const CACHE_VERSION = 'revizo-v2';
const CACHE_FILES = [
  './',
  './index.html',
  './portal.css',
  './shared.css',
  './shared.js',
  './progress.js',
  './favicon.svg',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/icon-maskable.svg',
  // Multiplications
  './multiplications/index.html',
  './multiplications/app.js',
  './multiplications/style.css',
  // Fractions
  './fractions/index.html',
  './fractions/app.js',
  './fractions/style.css',
  // Géométrie
  './geometrie/index.html',
  './geometrie/app.js',
  './geometrie/style.css',
  './geometrie/questions/angles.js',
  './geometrie/questions/cercle.js',
  './geometrie/questions/droites.js',
  './geometrie/questions/figures.js',
  './geometrie/questions/mesures.js',
  // Grammaire
  './grammaire/index.html',
  './grammaire/app.js',
  './grammaire/style.css',
  './grammaire/questions/accords.js',
  './grammaire/questions/conjugaison.js',
  './grammaire/questions/homophones.js',
  './grammaire/questions/nature.js',
  // Kangourou
  './kangourou/index.html',
  './kangourou/app.js',
  './kangourou/style.css',
  './kangourou/questions/levels.js',
  './kangourou/questions/6eme.js',
  './kangourou/questions/5eme.js',
  './kangourou/questions/4eme.js',
  './kangourou/questions/3eme.js',
  './kangourou/questions/2nde.js',
  './kangourou/questions/1ere.js',
  './kangourou/questions/terminale.js',
  './kangourou/generators/utils.js',
  './kangourou/generators/6eme.js',
  './kangourou/generators/5eme.js',
  './kangourou/generators/4eme.js',
  './kangourou/generators/3eme.js',
  './kangourou/generators/2nde.js',
  './kangourou/generators/1ere.js',
  './kangourou/generators/terminale.js',
  './kangourou/generators/api.js',
];

// Install: cache all files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CACHE_FILES))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache new requests dynamically (e.g. Google Fonts)
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback
      if (event.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});
