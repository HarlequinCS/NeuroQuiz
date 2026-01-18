/**
 * NeuroQuiz™ Service Worker
 * Offline Caching and Performance Optimization
 */

const CACHE_NAME = 'neuroquiz-v1';
const CACHE_VERSION = '1.0.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/setup.html',
  '/quiz.html',
  '/result.html',
  '/about.html',
  '/css/styles.min.css',
  '/js/scripts.min.js',
  '/favicon.ico'
];

// Assets to cache on demand (lazy cache)
const DYNAMIC_ASSETS = [
  // CSS and JS files will be cached as they're loaded
  // JSON data files will be cached as they're loaded
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...', CACHE_NAME);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(err => {
        console.error('[Service Worker] Cache install failed:', err);
      })
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Strategy: Cache First for static assets, Network First for HTML
  if (request.destination === 'document' || 
      request.destination === '' ||
      url.pathname.endsWith('.html')) {
    // HTML: Network First, fallback to cache
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response
          const responseToCache = response.clone();
          
          // Cache successful responses
          if (response.status === 200) {
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache);
              });
          }
          
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Return offline page if available
              return caches.match('/index.html');
            });
        })
    );
  } else {
    // Static assets: Cache First, fallback to network
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(request)
            .then(response => {
              // Don't cache if not a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clone the response
              const responseToCache = response.clone();
              
              // Cache the response
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // Network failed and not in cache
              // Return placeholder if image, or fail gracefully
              if (request.destination === 'image') {
                // Could return a placeholder image here
              }
            });
        })
    );
  }
});

// Handle messages from the page
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

// Background sync (optional - for future offline form submissions)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('[Service Worker] Background sync triggered');
    // Handle background sync tasks here
  }
});

// Push notifications (optional - for future features)
self.addEventListener('push', event => {
  console.log('[Service Worker] Push notification received');
  // Handle push notifications here
});
