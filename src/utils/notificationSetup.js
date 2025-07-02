// src/notificationSetup.js
import { messaging, getToken, onMessage } from "../services/firebase-config";
import Api from "./API";
import Swal from "sweetalert2";

export const requestPermission = async () => {
  console.log("🔔 Solicitando permiso de notificaciones...");

  // 👇 Verificar si ya se mostró antes
  if (localStorage.getItem("notificacionesSolicitadas") === "true") {
    console.log("🔕 El usuario ya fue consultado anteriormente.");
    return;
  }

  const { isConfirmed } = await Swal.fire({
    title: "¿Activar notificaciones?",
    text: "El sistema de notificaciones es importante para acceder a todas las funcionalidades de la app.",
    imageUrl: "/not.png",
    showCancelButton: true,
    confirmButtonText: "Activar",
    cancelButtonText: "No, gracias",
    confirmButtonColor: "#3A0164",
    cancelButtonColor: "#d33",
  });

  // 👇 Marcar como ya mostrado (sea que aceptó o no)
  localStorage.setItem("notificacionesSolicitadas", "true");

  if (!isConfirmed) {
    console.log("❌ El usuario rechazó desde el modal personalizado");
    return;
  }

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

    const usuario = JSON.parse(localStorage.getItem("user"));
    const tarotista = JSON.parse(localStorage.getItem("Tarotista"));

    const persona = usuario && usuario._id && usuario.token
      ? usuario
      : tarotista && tarotista._id && tarotista.token
      ? tarotista
      : null;

    if (!persona) {
      console.warn("⚠️ No hay usuario o tarotista autenticado correctamente en localStorage");
      return;
    }

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
