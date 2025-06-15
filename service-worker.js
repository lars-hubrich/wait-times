const CACHE_NAME = 'wartezeiten-cache-v1';
const ASSETS = [
  '/', '/index.html', '/app.js',
  '/assets/styles.css', '/assets/waitingtimes_192.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  if (evt.request.url.includes('/queue_times.json')) {
    evt.respondWith(
      fetch(evt.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(evt.request, clone));
          return res;
        })
        .catch(() => caches.match(evt.request))
    );
  } else {
    evt.respondWith(
      caches.match(evt.request)
        .then(cached => cached || fetch(evt.request))
    );
  }
});
