import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Spinner from '../../components/Spinner';

function PagoExitoso() {
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const spinnerTimeout = setTimeout(() => {
      setShowSpinner(true);
    }, 10000); // Mostrar spinner después de 10 segundos

    const redirectTimeout = setTimeout(() => {
      navigate('/chat'); // Ajusta la ruta a la que deseas redirigir
    }, 12000); // Redirigir después de 12 segundos

    return () => {
      clearTimeout(spinnerTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      <div className="text-center flex flex-col justify-center items-center">
        <img src="/logo.webp" alt="logo-app" className="w-[40%]" />
        <h1 className="font-cinzel text-primario text-3xl mt-2 flex justify-center items-center gap-4 flex-col">
          <FaCheckCircle className="text-3xl" color="green" />
          Pago Exitoso
        </h1>
        <p className="font-cinzel text-lg mt-4">Te estaremos conectando con el tarotista. ¡Gracias por tu compra!</p>
      </div>

      {showSpinner && <Spinner />}
    </div>
  );
}

export default PagoExitoso;
