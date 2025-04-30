


import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";import { FaPhone } from "react-icons/fa6";



import { useSelector } from "react-redux";

function DashboardAll()  {
  // Simulación de notificaciones
  const hasMessages = true; // Cambiar a false si no hay mensajes
  const hasCalls = false; // Cambiar a false si no hay llamadas


const Tarotista = useSelector((state)=> state.tarotista)


console.log(Tarotista);


  return (
    <div className="flex flex-col items-center px-6 mt-10 w-full">
      {/* Título de bienvenida */}
      <h1 className="text-center font-cinzel text-2xl text-primario font-semibold">
        Bienvenid@ {Tarotista.name}
      </h1>

      {/* Botón de crear entrada */}
      <div className="mt-5 w-full flex justify-center">
        <Link to={'create'} className="bg-gradient-to-r from-softBlue to-accent py-2 px-5 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 text-white flex items-center gap-2 text-lg">
          <FaRegEdit /> Crear entrada
        </Link>
      </div>

      {/* Opciones de comunicación */}
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

      {/* Información del usuario */}
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
      </div>
    </div>
  );
}

export default DashboardAll 