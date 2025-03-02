/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

// Hacer que el service worker tome el control de la página inmediatamente
clientsClaim();

// Precargar y enrutar todos los archivos de la aplicación
precacheAndRoute(self.__WB_MANIFEST);

// Configurar estrategias de caché para las peticiones HTTP
registerRoute(
  // Filtrar las peticiones que tengan este patrón
  ({ request }) => request.destination === 'image',
  // Utilizar la estrategia StaleWhileRevalidate
  new StaleWhileRevalidate({
    // Configurar opciones adicionales, si es necesario
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);
