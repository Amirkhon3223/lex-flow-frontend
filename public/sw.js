// LexFlow Service Worker
// Version: 1.0.0

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE_NAME = `lexflow-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `lexflow-dynamic-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/lexflow.png',
  '/ROUNDED_LEXFLOW_BG.png',
];

// File extensions to cache with cache-first strategy
const CACHEABLE_EXTENSIONS = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
];

// API paths that should use network-first strategy
const API_PATHS = ['/api/', '/auth/', '/ws/'];

// Check if a request is for a static asset
function isStaticAsset(url) {
  const pathname = new URL(url).pathname;
  return CACHEABLE_EXTENSIONS.some(ext => pathname.endsWith(ext));
}

// Check if a request is for an API call
function isApiRequest(url) {
  const pathname = new URL(url).pathname;
  return API_PATHS.some(path => pathname.includes(path));
}

// Check if request is a navigation request
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old version caches
              return (
                cacheName.startsWith('lexflow-') &&
                cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DYNAMIC_CACHE_NAME
              );
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.startsWith('http')) {
    return;
  }

  // API requests - Network first, fallback to cache
  if (isApiRequest(url)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets - Cache first, fallback to network
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Navigation requests - Network first with offline fallback
  if (isNavigationRequest(request)) {
    event.respondWith(navigationStrategy(request));
    return;
  }

  // Default: Network first
  event.respondWith(networkFirstStrategy(request));
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      // Return cached response and update cache in background
      updateCache(request);
      return cachedResponse;
    }

    // Not in cache, fetch from network
    const networkResponse = await fetch(request);

    // Cache the response for future use
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first strategy failed:', error);

    // Try to return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    // Don't cache API responses by default (they need fresh data)
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network-first strategy failed:', error);

    // Try cache as fallback (for some GET API requests that might be cached)
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Navigation strategy with offline fallback
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful navigation responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Navigation request failed, serving offline page');

    // Try to return the cached page first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    const offlineResponse = await caches.match(OFFLINE_PAGE);
    if (offlineResponse) {
      return offlineResponse;
    }

    // If offline page not cached, return a basic offline response
    return new Response(
      '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
      {
        headers: { 'Content-Type': 'text/html' },
        status: 503,
      }
    );
  }
}

// Background cache update (stale-while-revalidate pattern)
async function updateCache(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silently fail - this is a background update
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('lexflow-'))
            .map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New notification from LexFlow',
    icon: data.icon || '/lexflow.png',
    badge: '/lexflow.png',
    tag: data.tag || undefined,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'LexFlow', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus an existing window
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Open a new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
