// src/notificationSetup.js
import { messaging, getToken, onMessage } from "../services/firebase-config";
import Api from "./API";

export const requestPermission = async () => {
  console.log("🔔 Solicitando permiso de notificaciones...");

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("🚫 Permiso de notificaciones denegado");
    return;
  }

  console.log("✅ Permiso concedido");

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_APP_API_FIREBASE_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });

    if (!currentToken) {
      console.warn("❌ No se obtuvo token FCM");
      return;
    }

    localStorage.setItem("fcmToken", currentToken);
    console.log("📲 Token FCM obtenido:", currentToken);

    // Buscar usuario o tarotista autenticado
    const usuario = JSON.parse(localStorage.getItem("user"));
    const tarotista = JSON.parse(localStorage.getItem("Tarotista"));

    console.log("🧙‍♂️ tarotista:", tarotista);
    console.log("🙋‍♂️ usuario:", usuario);

    // Validar cuál es el que tiene datos correctos
    const persona = usuario && usuario._id && usuario.token
      ? usuario
      : tarotista && tarotista._id && tarotista.token
      ? tarotista
      : null;

    if (!persona) {
      console.warn("⚠️ No hay usuario o tarotista autenticado correctamente en localStorage");
      return;
    }

    console.log("👤 Persona seleccionada:", persona);
    console.log("🆔 ID:", persona._id);
    console.log("🔐 Token:", persona.token);

    // Enviar el token al backend
    await fetch(`${Api}tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${persona.token}`,
      },
      body: JSON.stringify({
        token: currentToken,
        userId: persona._id,
        role: persona.role || (usuario ? "user" : "tarotista"),
      }),
    });

    console.log(`📨 Token FCM registrado para ${persona.role}`);

  } catch (err) {
    console.error("💥 Error al registrar token FCM:", err);
  }
};

export const setupOnMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log("📩 Notificación recibida en foreground:", payload);
    // Mostrar toast, sonido, alerta o lo que desees
  });
};
