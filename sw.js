/* Texas Public Land Guide - offline cache. Cache-first, versioned.
   To ship an update: change VERSION (and the list below if files were added). All paths are relative to this file,
   so it works under a GitHub Pages project path (https://<user>.github.io/<repo>/). */
const VERSION = 'tx-land-guide-v1';
const PRECACHE = [
  "./",
  "about.html",
  "area.html",
  "css/styles.css",
  "data/areas.js",
  "data/hunting-bot.js",
  "data/photos.js",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512-maskable.png",
  "icons/icon-512.png",
  "img/dinosaur-valley.jpg",
  "img/lake-whitney.jpg",
  "img/somerville.jpg",
  "index.html",
  "js/app.js",
  "manifest.webmanifest",
  "permits.html"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('tx-land-guide-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // TPWD links etc. go straight to the network
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => (req.mode === 'navigate' ? caches.match('index.html') : Response.error()));
    })
  );
});
