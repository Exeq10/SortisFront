// src/notificationSetup.js
import { messaging,getToken,onMessage } from "../services/firebase-config";

export const requestPermission = async () => {
  console.log('Solicitando permiso de notificaciones...');
  console.log(import.meta.env.VITE_APP_API_FIREBASE_KEY);

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Permiso concedido');

    try {

        
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_APP_API_FIREBASE_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.ready,
      });

      if (currentToken) {
       
        localStorage.setItem('fcmToken', currentToken);
      } else {
        console.log('❌ No se obtuvo token. Solicitar permiso.');
      }
    } catch (err) {
      console.error('💥 Error al obtener token:', err);
    }
  } else {
    console.log('🚫 Permiso denegado');
  }
};

// Mostrar mensajes cuando la app está en primer plano
export const setupOnMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log('📩 Notificación recibida en foreground:', payload);
    // Podés mostrar una toast, modal, etc.
  });
};
