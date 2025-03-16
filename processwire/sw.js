const cacheName = 'ressurexit-v1.0.0';

self.addEventListener('install', (e) => {
	console.log('[Service Worker] Install');
	e.waitUntil(
		(async () => {
			const cache = await caches.open(cacheName);
			console.log('[Service Worker] Caching all: app files');
			const response = await fetch('/cache.json');
			const appFiles = await response.json();
			await cache.addAll(appFiles);
		})(),
	);
});

self.addEventListener('fetch', (e) => {
	e.respondWith(
		(async () => {
			const r = await caches.match(e.request);
			console.log(`[Service Worker] Fetched resource ${e.request.url}`);
			if(r) return r;
			const response = await fetch(e.request);
			return response;
		})(),
	);
});

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if(key === cacheName) return;
					console.log(`[Service Worker] Deleting cache: ${key}`);
					return caches.delete(key);
				}),
			);
		}),
	);
});
