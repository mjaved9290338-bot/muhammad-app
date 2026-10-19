/* Muhammad App — service worker
   Cache-first for the app shell so the app opens fast and works offline.
   When hosting, place this file next to index.html (site root) so its
   scope covers the whole app. */
var CACHE = 'muhammad-app-v1';
var CORE = [
  './',
  './index.html',
  './assets/manifest.json',
  './assets/photo.jpg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/work-cartoons.webp',
  './assets/work-comedy.webp',
  './assets/work-marble.webp',
  './assets/work-thumbnail.webp',
  './assets/work-website1.webp',
  './assets/work-website2.webp'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      });
    })
  );
});
