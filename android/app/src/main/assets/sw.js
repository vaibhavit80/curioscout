// CurioScout Offline Service Worker
const CACHE_NAME = 'curioscout-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/audio.js',
  './js/confetti.js',
  './js/state.js',
  './js/ai-engine.js',
  './js/games/math.js',
  './js/games/spelling.js',
  './js/games/memory.js',
  './js/games/shapes.js',
  './js/games/habitats.js',
  './js/games/music.js',
  './js/games/doodle.js',
  './js/games/codebot.js',
  './js/games/clock.js',
  './js/games/market.js',
  './js/games/ai-sketch.js',
  './js/games/ai-story.js',
  './js/games/ai-emotion.js',
  './js/games/ai-pattern.js',
  './js/games/tangram.js',
  './js/app.js',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        // Fallback to cached index.html for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
