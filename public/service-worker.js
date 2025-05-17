const CACHE_NAME = 'mi-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon-192x192.png',
  // Agrega aquí otros assets que quieras cachear
];

// Cachear archivos durante instalación
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Limpiar caches viejos durante activación
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activado');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Interceptar solicitudes y servir desde cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

// Escuchar notificaciones push
self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error('❌ Error leyendo datos de push:', e);
  }

  const title = data.title || 'Notificación';
  const options = {
    body: data.body || 'Tienes una nueva notificación.',
    icon: data.icon || '/icon-192x192.png', // asegúrate que este archivo exista
    badge: data.badge || '/badge.png',      // opcional
    data: {
      url: data.url || '/', // incluir una URL de destino
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Manejar clic en la notificación
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si la pestaña ya está abierta, solo enfócala
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no está abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
