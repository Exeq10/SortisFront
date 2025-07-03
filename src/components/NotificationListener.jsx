// NotificationListener.jsx
import { useEffect } from 'react';

const NotificationListener = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('push', event => {
        if (event.data?.type === 'play_sound') {
          const audio = new Audio('/sound/soundNot.mp3');
          audio.play().catch(() => {
            console.warn('🔇 El navegador bloqueó el sonido automático');
          });
        }
      });
    }
  }, []);

  return null;
};

export default NotificationListener;
