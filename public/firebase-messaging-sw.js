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

/* const messaging = firebase.messaging();
 
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title || 'Nuevo chat inicializado';
  const notificationOptions = {
    body: payload.notification.body || 'Tienes una nueva notificación.',
    icon: payload.notification.icon || '/icon-192x192.png',
    data: {
      url: payload.notification.click_action || '/', // para abrir al hacer clic
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); */
 
// 🧱 PWA: Cache básico
const CACHE_NAME = 'mi-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/android-launchericon-96-96.png',
  '/android-launchericon-144-144.png',
  '/android-launchericon-192-192.png',
  // agrega aquí otros recursos que quieras cachear
];

// 🧩 Instalar: cachear assets (con manejo de errores por archivo)
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        urlsToCache.map(url =>
          fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Request for ${url} failed with status ${response.status}`);
              }
              return cache.put(url, response);
            })
            .catch(err => {
              console.warn(`⚠️ No se pudo cachear ${url}:`, err);
            })
        )
      );
    })
  );
});

// ♻️ Activar: limpiar caches viejos
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activado');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 🌐 Interceptar fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).catch(() => {
        // Podés devolver una página offline personalizada si querés
        return caches.match('/index.html');
      })
    )
  );
});

self.addEventListener('push', event => {
  let data = {};
  if (event.data) {

    console.log(event.data); // 👈 esto te va a decir si el contenido llega bien
    data = event.data.json();
    console.log('[Push recibido]', data); // 👈 esto te va a decir si el contenido llega bien

    console.log( 'data' , data?.data);
  }

  const notificationOptions = {
    body: data.notification.body || 'Tienes una nueva notificación',
    icon:  '/android-launchericon-96-96.png',
    vibrate: JSON.parse(data.vibrate || '[200,100,200]'),
    sound: data.sound || './sounds/soundNot.mp3',
    data: {
      url: data.click_action || data.data?.url || '',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.notification.title || 'Notificación', notificationOptions)
  );
});

self.addEventListener('notificationclick', event => {

  console.log(event); // Para depurar
  event.notification.close();


  const url = event.notification?.data?.url || '/login';

  console.log('URL de la notificación:', url); // Para depurar

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});