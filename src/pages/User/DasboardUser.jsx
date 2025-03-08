import { useState } from "react";
import { Link } from "react-router-dom";
import frasesTarot from "../../utils/phrases";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";

function DashboardUser() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const obtenerFraseAleatoria = (grupo) => {
    const frases = frasesTarot[grupo];
    return frases[Math.floor(Math.random() * frases.length)];
  };

  return (
    <section className="relative flex flex-col w-full md:w-[30%] m-auto justify-center items-center">
      {/* Menú desplegable */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] bg-white shadow-lg transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-50`}
      >
      
        <nav className="mt-10 flex flex-col items-start pl-6 space-y-4">
          <Link to="/" className="text-lg text-gray-800 hover:text-accent">Inicio</Link>
          <Link to="/selectTarot" className="text-lg text-gray-800 hover:text-accent">Tarot</Link>
          <Link to="/onboarding" className="text-lg text-gray-800 hover:text-accent">Onboarding</Link>
          <Link to="/dashboardUser" className="text-lg text-gray-800 hover:text-accent">Perfil</Link>
        </nav>
      </div>

      {/* Botón de menú */}
      <div className="h-[100px] bg-gradient-to-tr from-accent to-highlight w-full flex items-center px-4 relative">
        <button
          onClick={toggleMenu}
          className="w-[50px] border-2 border-accent h-[50px] flex justify-center items-center text-3xl absolute right-2 top-18 hover:scale-110 duration-300 bg-white hover:bg-accent hover:text-white rounded-full shadow-xl"
        >
          {menuOpen ?  <IoClose /> : <IoMdMenu />}
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex w-full flex-col items-start px-4 mt-10">
        <h1 className="text-start font-cinzel text-xl">Bienvenido de nuevo</h1>
        <p className="text-sm text-gray-600 mt-6">{obtenerFraseAleatoria("grupo1")}</p>
        <Link
          to={"/selectTarot"}
          className="px-4 min-w-[25%] flex items-center justify-center py-2 rounded-xl shadow font-cinzel bg-accent text-white mt-3"
        >
          Tarot
        </Link>
      </div>

      <div className="w-full px-4 mt-6">
        <h2 className="font-semibold text-lg">Novedades</h2>
        <div className="grid grid-cols-2 gap-4 mt-3"> {/* Contenido de novedades */} </div>

        <h2 className="font-semibold text-lg mt-6">Tarotistas</h2>
        <div className="grid grid-cols-2 gap-4 mt-3"> {/* Contenido de tarotistas */} </div>
      </div>
    </section>
  );
}

export default DashboardUser;
