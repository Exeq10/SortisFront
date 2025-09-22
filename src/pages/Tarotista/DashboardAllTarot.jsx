import { Link, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { FaPhone } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineTarotistas } from "../../redux/onlineTarotistasSlice";
import WidgetUltimoPago from "../../components/WidgetUltimoPago";
import useGlobalSocket from "../../hooks/useGlobalSocket";
import {
  requestPermission,
  setupOnMessageListener,
} from "../../utils/notificationSetup";

function DashboardAll() {
  const Tarotista = useSelector((state) => state.tarotista);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado local para online/offline
  const [isOnline, setIsOnline] = useState(false);

  // Conectar socket global como tarotista
  const { socket, isConnected } = useGlobalSocket(
    Tarotista?.token,
    Tarotista?._id,
    "tarotista"
  );

  useEffect(() => {
    requestPermission();
    setupOnMessageListener();
  }, []);

  // Escuchar cambios de tarotistas online en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleOnline = (onlineIds) => {
      dispatch(setOnlineTarotistas(onlineIds));
      setIsOnline(onlineIds.includes(Tarotista._id));
    };

    socket.on("updateOnlineTarotistas", handleOnline);

    // Inicializar estado local
    if (isConnected) {
      socket.emit("registerTarotista", { userId: Tarotista._id, online: true });
    }

    return () => {
      socket.off("updateOnlineTarotistas", handleOnline);
      if (socket && isConnected) {
        socket.emit("registerTarotista", { userId: Tarotista._id, online: false });
      }
    };
  }, [socket, dispatch, Tarotista, isConnected]);

  // Función para alternar Online/Offline
  const toggleOnline = () => {
    if (!socket) return;

    const newStatus = !isOnline;
    setIsOnline(newStatus);

    if (!newStatus) {
      socket.emit("registerTarotista", { userId: Tarotista._id, online: false });
      socket.disconnect(); // se desconecta del servidor
    } else {
      socket.connect();
      socket.emit("registerTarotista", { userId: Tarotista._id, online: true });
    }
  };

  const hasMessages = true;
  const hasCalls = false;

  return (
    <div className="flex flex-col items-center px-6 mt-10 w-full">
      <h1 className="text-center font-cinzel text-2xl text-primario font-semibold">
        Bienvenid@ {Tarotista.name}
      </h1>

      <div className="mt-5 w-full flex justify-center gap-4">
        <Link
          to={"create"}
          className="bg-gradient-to-r from-softBlue to-accent py-2 px-5 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 text-white flex items-center gap-2 text-lg"
        >
          <FaRegEdit /> Crear entrada
        </Link>

        <button
          onClick={toggleOnline}
          className={`py-2 px-5 rounded-lg shadow-lg text-white font-medium ${
            isOnline ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
          } transition-colors duration-300`}
        >
          {isOnline ? "Online" : "Offline"}
        </button>
      </div>

      <div className="flex w-full mt-8 justify-center gap-6 relative">
        <div
          onClick={() => navigate("chats")}
          className="relative w-24 h-24 flex justify-center items-center text-5xl text-white bg-gradient-to-t from-accent to-softBlue shadow-md rounded-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
        >
          <LuMessageCircleMore />
        </div>
        <div className="relative w-24 h-24 border-2 shadow-md rounded-lg flex justify-center items-center text-5xl text-softBlue hover:scale-110 transition-transform duration-300 cursor-pointer">
          <FaPhone />
          {hasCalls && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              !
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        <picture>
          <img
            src={Tarotista.image}
            alt={Tarotista.name}
            className="w-36 h-36 rounded-full border-4 border-accent shadow-lg"
          />
        </picture>
        <h4 className="text-2xl font-cinzel mt-3 text-softBlue font-medium">
          {Tarotista.name}
        </h4>

        <WidgetUltimoPago />

        <p className="mt-3 text-sm text-gray-500">
          Estado actual: {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}

export default DashboardAll;
