const CACHE_NAME = 'aws-sbg-gsmcoe-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/assets/aws_gsmcoe_logo.jpeg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/logo.svg',
  '/assets/favicon.svg'
];

// Helper to generate signature for SW background comparison
function getEventSigSW(e) {
  return `${e.id}::${e.title || ''}::${e.day || ''}::${e.month || ''}::${e.time || ''}::${e.status || ''}::${e.shortDesc || ''}`;
}

async function checkForEventUpdatesSW() {
  try {
    const res = await fetch('/script.js?v=' + Date.now());
    if (!res.ok) return;
    const text = await res.text();
    const match = text.match(/const EVENTS_DATA = (\[[\s\S]*?\]);/);
    if (!match || !match[1]) return;

    const events = (new Function('return ' + match[1]))();
    if (!Array.isArray(events)) return;

    const cache = await caches.open('aws-sbg-events-sig-v1');
    const storedRes = await cache.match('/cached-event-sigs.json');
    let knownSigs = {};
    if (storedRes) {
      try {
        knownSigs = await storedRes.json();
      } catch (e) {}
    }

    const isFirstRun = Object.keys(knownSigs).length === 0;
    const newSigs = {};
    const notificationsToFire = [];

    events.forEach(e => {
      const sig = getEventSigSW(e);
      newSigs[e.id] = sig;

      if (!isFirstRun) {
        if (!knownSigs[e.id]) {
          // Brand New Event Added!
          notificationsToFire.push({
            title: `🚨 New Event: ${e.title}`,
            body: `📅 ${e.day} ${e.month} | 📍 ${e.location}\n${e.shortDesc}`,
            tag: `sbg-event-new-${e.id}-${Date.now()}`
          });
        } else if (knownSigs[e.id] !== sig) {
          // Existing Event Details Modified / Updated!
          notificationsToFire.push({
            title: `📢 Event Updated: ${e.title}`,
            body: `📅 ${e.day} ${e.month} | 📍 ${e.location}\n${e.shortDesc}`,
            tag: `sbg-event-upd-${e.id}-${Date.now()}`
          });
        }
      }
    });

    // Save updated signatures into SW cache
    const responseToStore = new Response(JSON.stringify(newSigs), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put('/cached-event-sigs.json', responseToStore);

    // Fire notifications directly from Service Worker background thread!
    for (const item of notificationsToFire) {
      if (self.registration && self.registration.showNotification) {
        await self.registration.showNotification(item.title, {
          body: item.body,
          icon: '/assets/icon-192.png',
          badge: '/assets/favicon.svg',
          tag: item.tag,
          data: { url: self.location.origin + '/#events' }
        });
      }
    }
  } catch (err) {
    console.warn('[SW] Event background check error:', err);
  }
}

// Install Event - Cache Core Assets & Skip Waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching offline assets for AWS Student Builder Group');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean Up Old Caches & Claim Clients Immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== 'aws-sbg-events-sig-v1') {
            console.log('[SW] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(async () => {
      await self.clients.claim();
      // Run background check on activation
      await checkForEventUpdatesSW();
      // Notify active clients that SW updated
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }));
    })
  );
});

// Periodic Background Sync Event
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-new-events') {
    event.waitUntil(checkForEventUpdatesSW());
  }
});

// Fetch Event - Network-First for HTML/JS to detect updates immediately
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-First for script.js and HTML to ensure immediate detection of new events
  if (url.pathname.endsWith('script.js') || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-While-Revalidate for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Notification Click Handler - Focuses window or opens events section
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/#events';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('#events') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
