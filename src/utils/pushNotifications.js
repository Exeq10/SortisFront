import Api from "./API";

// pushNotifications.js
export async function subscribeUser(tarotistaId) {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('✅ El navegador soporta Service Workers y PushManager');

    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('📦 Service Worker listo:', registration);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BL4Rgq95Hi4jXqXNiEa7Q0qhMcIJKTlFw_aNDxGTER8xbYowW3XEvJFy7fU3QIlPo1BsMTXE_b74bjFcWQx5b38'),
      });

      console.log('📬 Suscripción creada:', subscription);
      console.log('🔐 Claves de suscripción:', subscription.toJSON().keys);
      console.log('🧙‍♂️ tarotistaId recibido:', tarotistaId);

      const response = await fetch(`${Api}/guardar-suscripcion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: subscription.toJSON().keys, // contiene p256dh y auth
          tarotistaId,
        }),
      });

      const result = await response.json();
      console.log('📥 Respuesta del servidor:', response.status, result);

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} - ${result.error || result.message}`);
      }

      console.log('✅ Suscripción enviada y guardada en el servidor');
    } catch (error) {
      console.error('❌ Error al suscribirse o enviar la suscripción:', error);
    }
  } else {
    console.warn('⚠️ El navegador no soporta Service Workers o Push Notifications');
  }
}

// Utilidad para transformar la VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}
