import { Link } from "react-router-dom";

function Landing() {
  return (
    <section className="flex flex-col h-screen justify-center w-full items-center lg:px-8 overflow-hidden px-4 relative sm:px-6">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        className="h-full w-full absolute left-0 object-cover top-0"
      >
        <source src="/CieloEstrellado.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Contenido principal */}
      <div className="mb-6 relative z-10">
        <img src="/logo.webp" alt="Logo" className="w-60 lg:w-56 sm:w-56" />
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
    </section>
  );
}

export default Landing;
