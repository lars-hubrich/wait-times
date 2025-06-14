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
  if (event.request.url.includes('queue-times.com')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(resp => resp || fetch(event.request))
    );
  }
});
