import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import obtenerFraseAleatoria from "../../hooks/obtenerFrase";

const linksMenu = [
  { label: "Inicio", link: "/dashboardUser" },
  { label: "Perfil", link: "profile" },
  { label: "Novedades", link: "blog" },
  { label: "Favoritos (Proximamente)", link: "/favs" },
];

function DashboardUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // 📦 Leer del store
  const tarotistas = useSelector((state) => state.tarotistas);
  const onlineTarotistas = useSelector((state) => state.onlineTarotistas);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    setMenuOpen(false);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <section className="relative flex flex-col w-full md:w-[30%] m-auto justify-center items-center">
      {/* Menú desplegable */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] bg-white shadow-lg transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="mt-10 pl-6 pr-4">
          {user && (
            <div className="mb-6">
              {user.image && (
                <img
                  src={user.image}
                  alt="Perfil"
                  className="w-16 h-16 rounded-full mb-2"
                />
              )}
              <h2 className="text-primario text-md font-bold font-cinzel">
                ¡Hola, {user.name}!
              </h2>
            </div>
          )}

          <nav className="mt-10 flex flex-col items-start space-y-4">
            {linksMenu.map((link, key) => (
              <Link
                onClick={() => setMenuOpen(false)}
                to={link.link}
                key={key}
                className="font-cinzel rounded-md text-primario duration-200 hover:scale-105"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Tarotistas online */}
          <div className="mt-6 w-full">
            <h3 className="font-cinzel text-primario mb-2">Tarotistas online:</h3>
            {onlineTarotistas.length === 0 ? (
              <p className="text-gray-500">Ningún tarotista conectado</p>
            ) : (
              <ul className="space-y-1">
                {onlineTarotistas.map((id) => {
                  const tarotista = tarotistas.find((t) => t._id === id);
                  return tarotista ? (
                    <li key={id} className="flex items-center space-x-2">
                      {tarotista.image && (
                        <img
                          src={tarotista.image}
                          alt={tarotista.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-primario">{tarotista.name}</span>
                    </li>
                  ) : (
                    <li key={id} className="text-primario">Tarotista desconocido</li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="w-[90%] mt-16">
            <p className="text-md text-primario font-gara">
              {obtenerFraseAleatoria("grupo3")}{" "}
              <Link
                to={"/selectTarot"}
                className="bg-highlight inline px-2 text-white rounded-md"
              >
                Consultar
              </Link>
            </p>
          </div>

          <div className="flex justify-center w-full mt-20">
            <button
              onClick={() => {
                localStorage.clear();
                setUser(null);
                navigate("/");
              }}
              className="w-[90%] font-cinzel border-2 border-primario px-5 py-1 rounded-md hover:bg-highlight hover:text-white duration-200 bg-primario text-white"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Botón de menú */}
      <div className="h-[100px] bg-gradient-to-tr from-accent to-highlight w-full flex items-center px-4 relative">
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

export default DashboardUser;
