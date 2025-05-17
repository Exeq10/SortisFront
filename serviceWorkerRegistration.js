// serviceWorkerRegistration.js

import { Workbox } from 'workbox-window';

export function register() {
  if ('serviceWorker' in navigator) {
    // Crear una nueva instancia de Workbox para nuestro archivo de service worker
   const wb = new Workbox(`${import.meta.env.BASE_URL}service-worker.js`,{type:'module'});


    // Escuchar cuando se instala o se activa el service worker
    wb.addEventListener('installed', event => {
      if (event.isUpdate) {
        console.log('New content is available; please refresh.');
      } else {
        console.log('Content is cached for offline use.');
      }
    });

    wb.addEventListener('activated', event => {
      console.log('Service worker has been activated.');
    });

    // Registrar el service worker
    wb.register()
      .then(registration => {
        console.log('Service worker registered:', registration);
      })
      .catch(error => {
        console.error('Error registering service worker:', error);
      });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister()
          .then(() => {
            console.log('Service worker unregistered.');
          })
          .catch(error => {
            console.error('Error unregistering service worker:', error);
          });
      })
      .catch(error => {
        console.error('Error getting service worker registration:', error);
      });
  }
}
