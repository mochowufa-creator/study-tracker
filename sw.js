// 简易 Service Worker：离线缓存核心资源
const CACHE = 'study-tracker-v1';
const ASSETS = [
  './',
  './index.html',
  './css/theme.css',
  './css/styles.css',
  './js/utils.js',
  './js/store.js',
  './js/toast.js',
  './js/stats.js',
  './js/countdown.js',
  './js/week-nav.js',
  './js/day-cards.js',
  './js/text-areas.js',
  './js/io.js',
  './js/theme.js',
  './js/gestures.js',
  './js/app.js',
  './assets/progress-marker.svg',
  './assets/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
