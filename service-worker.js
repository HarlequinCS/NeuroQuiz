/**
 * NeuroQuiz™ Service Worker
 * Offline Caching and Performance Optimization
 */

// Use timestamp for cache versioning to force cache refresh on updates
// This will be updated when version changes
const CACHE_VERSION = '1.0.1-' + Date.now();
const CACHE_NAME = 'neuroquiz-' + CACHE_VERSION;

// Get app version from meta tag (if available)
function getAppVersion() {
  // This will be checked on each request
  return null; // Will be set dynamically
}

// Development mode: Set to true to disable caching during development
// Change this to true when developing to bypass all caching
const DEV_MODE = false; // Set to true when developing to bypass cache

// Helper: Clear all caches (useful for development)
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('[Service Worker] All caches cleared');
  return cacheNames;
}

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
  
  // Development mode: Always fetch from network, bypass cache
  if (DEV_MODE) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }
  
  // Check for version parameter in URL - if version changes, bypass cache
  const urlVersion = url.searchParams.get('v');
  const hasVersionParam = urlVersion !== null;
  
  // Strategy: Network First for HTML (always get fresh content), Cache First for static assets
  if (request.destination === 'document' || 
      request.destination === '' ||
      url.pathname.endsWith('.html')) {
    // HTML: Network First with cache-busting, fallback to cache
    // Always fetch fresh HTML to check for version updates
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          // Only cache if response is valid
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                // Store with original URL
                cache.put(request, responseToCache);
              })
              .catch(err => {
                console.error('[Service Worker] Cache put failed:', err);
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
    // Static assets: Network First if versioned, Cache First otherwise
    // If URL has version parameter, always fetch fresh
    if (hasVersionParam) {
      event.respondWith(
        fetch(request, { cache: 'no-store' })
          .then(response => {
            // Cache the fresh response
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
            }
            return response;
          })
          .catch(() => {
            // Fallback to cache if network fails
            return caches.match(request);
          })
      );
    } else {
      // No version param: Cache First, fallback to network
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
      clearAllCaches().then(() => {
        // Notify all clients that cache was cleared
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_CLEARED' });
          });
        });
      })
    );
  }
  
  if (event.data && event.data.type === 'FORCE_RELOAD') {
    // Force reload all clients
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'FORCE_RELOAD' });
        });
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
