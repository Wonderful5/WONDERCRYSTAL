/**
 * WONDER GRAND — SERVICE WORKER
 * Provides offline caching, lightning-fast loads, and standalone PWA functionality
 */

const CACHE_NAME = 'wonder-grand-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './about.html',
  './services.html',
  './contact.html',
  './manifest.json',
  './assets/css/variables.css',
  './assets/css/main.css',
  './assets/css/slider.css',
  './assets/css/components.css',
  './assets/js/data.js',
  './assets/js/cart.js',
  './assets/js/slider.js',
  './assets/js/main.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon.svg',
  './assets/images/wonder-grand-hero-1.jpg'
];

// Install: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension or external analytics
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !url.hostname.includes('unsplash.com') && !url.hostname.includes('fonts.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return fallback if offline
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
