const CACHE_NAME = 'wartezeiten-v3';
const PRECACHE_URLS = [
  './',
  './index.html',
  './assets/styles.css',
  './manifest.json',
  './assets/waitingtimes_192.png',
  './assets/waitingtimes_512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.href.includes('queue_times.json')) {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(event.request, { cache: 'no-store' });
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    })());
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch {
        const cached = await caches.match(event.request);
        return cached || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
