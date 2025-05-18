export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}firebase-messaging-sw.js`)
        .then(registration => {
          console.log('✅ Service Worker registrado con éxito:', registration);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('🔁 Nuevo contenido disponible, actualiza la página.');
                } else {
                  console.log('📦 Contenido cacheado para uso offline.');
                }
              }
            };
          };
        })
        .catch(error => {
          console.error('❌ Error al registrar el Service Worker:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister().then(() => {
          console.log('🧹 Service Worker desregistrado.');
        });
      })
      .catch(error => {
        console.error('❌ Error al desregistrar el Service Worker:', error);
      });
  }
}
