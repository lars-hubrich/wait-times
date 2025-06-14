const CACHE_NAME = 'wartezeiten-v1';
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
  const url = event.request.url;
  if (url.includes('allorigins.win')) {
    event.respondWith((async () => {
      try {
        const networkRes = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkRes.clone());
        return networkRes;
      } catch (err) {
        const cachedRes = await caches.match(event.request);
        if (!cachedRes) throw err;
        const blob = await cachedRes.blob();
        const headers = new Headers(cachedRes.headers);
        headers.set('X-From-Cache', 'true');
        return new Response(blob, {
          status:    cachedRes.status,
          statusText:cachedRes.statusText,
          headers
        });
      }
    })());
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
