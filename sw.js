const CACHE_NAME = "covid-archive-v7";
const CORE_ASSETS = ["./", "index.html", "styles.css?v=archive-20260724e", "app.js?v=archive-20260724e", "data/archive-data.json", "data/map-archive-data.json", "data/world-map.json", "manifest.webmanifest", "assets/archive-mark.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
