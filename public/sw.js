// Service Worker for background sync and offline support

const CACHE_NAME = 'child-development-journal-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }
        
        // Not in cache - fetch from network
        return fetch(event.request).then((networkResponse) => {
          // Don't cache API requests or other dynamic content
          if (!event.request.url.includes('/api/') && event.request.method === 'GET') {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          
          return networkResponse;
        });
      })
      .catch(() => {
        // If both cache and network fail, show an offline page
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Function to sync data with the server
async function syncData() {
  // In a real app, this would get unsynced data from IndexedDB and send it to the server
  console.log('Background sync triggered');
  
  // Post a message to the client to trigger sync
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({
      type: 'SYNC_TRIGGERED'
    });
  }
}
