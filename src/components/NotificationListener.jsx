// NotificationListener.jsx
import { useEffect } from 'react';

const NotificationListener = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data?.type === 'play_sound') {
          const audio = new Audio('/sound/soundot.mp3');
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
