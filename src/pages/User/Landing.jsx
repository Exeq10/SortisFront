import { Link } from "react-router-dom";

function Landing() {
  return (
    <section className="w-full h-screen flex justify-center items-center flex-col px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <img src="/logo.webp" alt="Logo" className="w-60 sm:w-56 lg:w-56" />
      </div>

      <div id="buttons" className="flex flex-col gap-8 w-full sm:w-[60%] lg:w-[25%] ">
        <Link to={'/login'}  className=" text-center font-cinzel bg-gradient-to-r from-primario to-[#323465] w-full text-white px-6 py-3 rounded-lg text-lg sm:text-xl">
          Iniciar Sesión
        </Link>
        <Link to={'/register'} className="border text-center border-violet-950 font-cinzel px-6 py-3 rounded-lg text-lg sm:text-xl">
          Registrarse
        </Link>
      </div>

      <p className="text-xs sm:text-sm fixed bottom-4 text-center font-light text-gray-400 w-full sm:w-auto">
        SORTIS es una app web que ofrece como servicio el contacto con tarotistas
      </p>
    </section>
  );
}

export default Landing;
