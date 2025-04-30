import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  useEffect(() => {
    document.querySelector('.cont_principal').classList.add('cont_error_active');
  }, []);

  return (
    <div className="cont_principal relative w-full h-screen overflow-hidden bg-[#D4D9ED] flex items-center justify-center">
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

      <div className="cont_error text-center flex flex-col justify-center items-center z-10">

        <h1 className="font-lato font-light text-[20vw] md:text-[150px] text-white relative transition-all duration-500">
          Oops
        </h1>
        <p className="font-lato font-thin text-[4vw] md:text-[24px] tracking-[2px] md:tracking-[5px] text-[#9294AE] relative transition-all duration-500 delay-500">
          Esta página no está disponible
        </p>
        {/* Botón arriba del texto */}
        <Link
          to={'/'}
          className="py-2 px-4  mt-5 mb-8 text-white bg-accent rounded-md shadow-2xl transition-transform hover:scale-105 z-20"
        >
          Volver
        </Link>
      </div>

      <style>{`
        .cont_error_active .cont_error h1 {
          left: 0;
        }
        .cont_error_active .cont_error p {
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
