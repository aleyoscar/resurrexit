const CACHE_NAME = 'resurrexit-v3.0.0';
const urlsToCache = [
	'/index.html',
	'/static/css/eplayer.css',
	'/static/css/pico.red.min.css',
	'/static/css/styles.css',
	'/static/scripts/js.cookie.min.js',
	'/static/scripts/pocketbase.umd.js',
	'/static/scripts/eplayer.js',
	'/static/scripts/main.js',
	'/static/scripts/modal.js',
	'/static/index.json',
	'/static/settings.json',
	'/static/site.webmanifest',
	'/static/images/apple-touch-icon.png',
	'/static/images/favicon-96x96.png',
	'/static/images/favicon.ico',
	'/static/images/favicon.svg',
	'/static/images/web-app-manifest-192x192.png',
	'/static/images/web-app-manifest-512x512.png'
];

// Install: Cache static assets
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => cache.addAll(urlsToCache))
			.then(() => self.skipWaiting())
	);
});

// Activate: Clean old caches
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.filter(name => name !== CACHE_NAME)
					.map(name => caches.delete(name))
			);
		}).then(() => self.clients.claim())
	);
});

// Fetch: Cache-first for static assets, network-only for send-mail.php
self.addEventListener('fetch', event => {
	const url = new URL(event.request.url);

	// Network-only for APIs
	if (url.pathname.startsWith('/api/') || url.pathname === '/_') {
		event.respondWith(
			fetch(event.request).catch(() => {
				return new Response(
					JSON.stringify({ status: 'error', message: 'This action requires internet connection' }),
					{ headers: { 'Content-Type': 'application/json' } }
				);
			})
		);
		return;
	}

	// Cache-first for all other requests
	event.respondWith(
		caches.match(event.request).then(cachedResponse => {
			return cachedResponse || fetch(event.request).then(networkResponse => {
				if (networkResponse.ok && event.request.method === 'GET') {
					return caches.open(CACHE_NAME).then(cache => {
						cache.put(event.request, networkResponse.clone());
						return networkResponse;
					});
				}
				return networkResponse;
			});
		}).catch(() => {
			// Fallback for HTML requests
			if (event.request.mode === 'navigate') {
				return caches.match('/index.html');
			}
			return new Response('Offline content unavailable', { status: 503 });
		})
	);
});
