// src/hooks/useGlobalSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function useGlobalSocket(token, userId, type) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token || !userId || !type) return;

    if (!socket) {
      socket = io("https://sortisbackend.onrender.com", { auth: { token } });

      socket.on("connect", () => {
        setIsConnected(true);
        socket.emit("register", { userId, type, online: true });
      });

      socket.on("disconnect", () => setIsConnected(false));
    } else if (socket.connected) {
      socket.emit("register", { userId, type, online: true });
    }

    return () => {
      if (socket && socket.connected) {
        socket.emit("register", { userId, type, online: false });
      }
    };
  }, [token, userId, type]);

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      setIsConnected(false);
    }
  };

  return { socket, isConnected, disconnectSocket };
}
