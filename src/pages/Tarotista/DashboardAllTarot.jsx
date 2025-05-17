import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { FaPhone } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineTarotistas } from "../../redux/onlineTarotistasSlice";
import WidgetUltimoPago from "../../components/WidgetUltimoPago";
import { set } from "date-fns";

import { subscribeUser } from "./../../utils/pushNotifications.js";
function DashboardAll() {
  const [socket, setSocket] = useState(null);
  const Tarotista = useSelector((state) => state.tarotista);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Notification.permission === "granted") {
      subscribeUser(Tarotista.name);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          subscribeUser(Tarotista._id);
        }
      });
    }
  }, [Tarotista]);
  useEffect(() => {
    if (!Tarotista || !Tarotista._id) return;

    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // REGISTRA al tarotista
    newSocket.emit("registerTarotista", { userId: Tarotista._id });

    newSocket.on("updateOnlineTarotistas", (onlineIds) => {
      console.log("Tarotistas online:", onlineIds);
      dispatch(setOnlineTarotistas(onlineIds));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [Tarotista]);

  const hasMessages = true;
  const hasCalls = false;

  return (
    <div className="flex flex-col items-center px-6 mt-10 w-full">
      <h1 className="text-center font-cinzel text-2xl text-primario font-semibold">
        Bienvenid@ {Tarotista.name}
      </h1>

      <div className="mt-5 w-full flex justify-center">
        <Link
          to={"create"}
          className="bg-gradient-to-r from-softBlue to-accent py-2 px-5 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 text-white flex items-center gap-2 text-lg"
        >
          <FaRegEdit /> Crear entrada
        </Link>
      </div>

      <div className="flex w-full mt-8 justify-center gap-6 relative">
        <div className="relative w-24 h-24 flex justify-center items-center text-5xl text-white bg-gradient-to-t from-accent to-softBlue shadow-md rounded-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
          <LuMessageCircleMore />
          {hasMessages && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              !
            </span>
          )}
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
      </div>
    </div>
  );
}

export default DashboardAll;
