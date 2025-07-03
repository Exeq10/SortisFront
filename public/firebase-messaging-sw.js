// ✅ Firebase
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCZ6Xfod-2hkGfAb3_iqZlJlHcAknH4HhU',
  authDomain: 'sortis-web-notifications.firebaseapp.com',
  projectId: 'sortis-web-notifications',
  messagingSenderId: '73419944736',
  appId: '1:73419944736:web:6dcb67879dd9807dd25d45',
});

// 🧱 PWA: Cache básico
const CACHE_NAME = 'mi-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/android-launchericon-96-96.png',
  '/android-launchericon-144-144.png',
  '/android-launchericon-192-192.png',
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        urlsToCache.map(url =>
          fetch(url)
            .then(response => {
              if (!response.ok) throw new Error(`Error cacheando ${url}`);
              return cache.put(url, response);
            })
            .catch(err => console.warn(`⚠️ No se pudo cachear ${url}:`, err))
        )
      )
    )
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activado');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).catch(() => caches.match('/index.html'))
    )
  );
});

self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
    console.log('[Push recibido]', data);
  }

  const title = data.notification?.title || 'Notificación';
  const body = data.notification?.body || 'Tienes una nueva notificación';
  const vibrate = JSON.parse(data.vibrate || '[200,100,200]');
  const url = data.click_action || data.data?.url || '/';
  const icon = '/android-launchericon-96-96.png';

  const options = {
    body,
    icon,
    vibrate,
    data: { url },
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'play_sound' }); // 🔊 Pedir al cliente que reproduzca el sonido
        });
      }),
    ])
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification?.data?.url || '/login';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
