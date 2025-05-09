import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import frasesTarot from "../../utils/phrases";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";

import { useNavigate } from "react-router-dom";

import obtenerFraseAleatoria from "../../hooks/obtenerFrase";
import { toast } from "react-toastify";

const linksMenu = [
  {
    label: "Inicio",
    link: "/dashboard",
  },
  {
    label: "Perfil",
    link: "profileTarot",
  },
  {
    label: "Chats",
    link: "chats",
  },

  { label: "Entradas", link: "create" },
  { label: "Estadisticas ", link: "statics" },
];

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    <section className="relative flex flex-col w-full md:w-[30%] m-auto justify-center items-center">
      {/* Menú desplegable */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] bg-gradient-to-b from-softBlue to-accent    shadow-lg transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <nav className="mt-10 flex flex-col items-start pl-6 space-y-4">
          {linksMenu.map((link, key) => {
            return (
              <Link
                to={link.link}
                key={key}
                className="font-cinzel rounded-md  text-white  duration-200 hover:scale-105  "
                onClick={() => {setMenuOpen(false)}}
              >
                {" "}
                {link.label}{" "}
              </Link>
            );
          })}
        </nav>

        <div className="flex justify-center w-full">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
            className=" w-[90%] font-cinzel border-2 border-white px-5 py-1 rounded-md  mt-64  hover:bg-highlight hover:text-white duration-200 bg-primario text-white "
          >
            Salir
          </button>
        </div>
      </div>

      {/* Botón de menú */}
      <div className="h-[100px] bg-gradient-to-tr from-softBlue to-accent w-full flex items-center px-4 relative">
        <button
          onClick={toggleMenu}
          className="w-[50px] border-2 border-accent h-[50px] flex justify-center items-center text-3xl absolute right-2 top-18 hover:scale-110 duration-300 bg-white hover:bg-accent hover:text-white rounded-full shadow-xl"
        >
          {menuOpen ? <IoClose /> : <IoMdMenu />}
        </button>
      </div>

      <Outlet />
    </section>
  );
}

export default Dashboard;
