import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { io } from "socket.io-client";

const linksMenu = [
  { label: "Inicio", link: "/dashboard" },
  { label: "Perfil", link: "profileTarot" },
  { label: "Chats", link: "chats" },
  { label: "Entradas", link: "create" },
  { label: "Estadisticas", link: "statics" },
  { label: "Cupones", link: "coupons" },
];

const SOCKET_SERVER_URL = "https://sortisbackend.onrender.com/";

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("tarotista");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    if (isOnline) {
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket conectado:", newSocket.id);
        newSocket.emit("registerTarotista", { userId: user._id });
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isOnline, user]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleToggleOnline = () => setIsOnline(prev => !prev);

  return (
    <section className="relative flex flex-col w-full md:w-[30%] m-auto justify-center items-center">
      {/* Menú */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] bg-gradient-to-b from-softBlue to-accent shadow-lg transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50 flex flex-col justify-between`}
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
              <h2 className="text-white text-md font-bold font-cinzel">
                ¡Hola, {user.name}!
              </h2>

              <button
                onClick={handleToggleOnline}
                className={`mt-3 px-4 py-2 rounded-md font-cinzel ${
                  isOnline
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white transition`}
              >
                {isOnline ? "Online" : "Offline"}
              </button>
            </div>
          )}

          <nav className="flex flex-col items-start space-y-4">
            {linksMenu.map((link, key) => (
              <Link
                to={link.link}
                key={key}
                className="font-cinzel rounded-md text-white duration-200 hover:scale-105"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mb-6 flex justify-center w-full">
          <button
            onClick={() => {
              localStorage.clear();
              setUser(null);
              navigate("/");
            }}
            className="w-[90%] font-cinzel border-2 border-white px-5 py-1 rounded-md hover:bg-highlight hover:text-white duration-200 bg-primario text-white"
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
