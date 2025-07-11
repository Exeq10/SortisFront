import { Link } from "react-router-dom";
import { useMemo } from "react";

function Landing() {
  // Elegir un video aleatorio al cargar el componente
  const videoSrc = useMemo(() => {
    const videos = ["/video1.mp4", "/video2.mp4", "/video3.mp4"];
    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
  }, []);

  return (
    <section className="flex flex-col h-screen justify-center w-full items-center lg:px-8 overflow-hidden px-4 relative sm:px-6">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        className="h-full w-full absolute left-0 object-cover top-0"
      >
        <source src={videoSrc} type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Contenido principal */}
      <div className="mb-6 relative z-10">
        <img src="/logo.png" alt="Logo" className="w-60 lg:w-56 sm:w-56" />
      </div>

      <div id="buttons" className="flex flex-col w-full gap-8 lg:w-[25%] relative sm:w-[60%] z-10">
        <Link to={'/login'} className="bg-gradient-to-r rounded-lg text-center text-lg text-white w-full font-cinzel from-primario px-6 py-3 sm:text-xl to-[#323465]">
          Iniciar Sesión
        </Link>
        <Link to={'/register'} className="bg-white border border-violet-950 rounded-lg text-center text-lg font-cinzel px-6 py-3 sm:text-xl">
          Registrarse
        </Link>
      </div>

      <p className="text-center text-gray-400 text-xs w-full bottom-4 font-light mt-16 relative sm:text-sm sm:w-auto z-10">
        SORTIS es una app web que ofrece como servicio el contacto con tarotistas
      </p>

      <Link to={'/terms&conditions'} className="absolute bottom-4 right-4 text-gray-400 text-xs font-light hover:text-white transition duration-300 z-10"> Términos y condiciones </Link>
    </section>
  );
}

export default Landing;
