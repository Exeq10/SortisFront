import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Spinner from '../../components/Spinner';

const frasesCalma = [
  'Cierra los ojos y respira profundo...',
  'Siente cómo el aire entra y sale suavemente...',
  'Todo está bien. Estás en el lugar correcto.',
  'Relaja los hombros, suelta la tensión...',
  'Prepárate para recibir el mensaje que necesitas.',
  'Confía en tu intuición. Estás a salvo aquí.',
];

function PagoExitoso() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [fraseActual, setFraseActual] = useState(frasesCalma[0]);
  const [fraseIndex, setFraseIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const spinnerTimeout = setTimeout(() => {
      setShowSpinner(true);
    }, 10000); // Mostrar spinner después de 10 segundos

    const redirectTimeout = setTimeout(() => {
      navigate('/chat');
    }, 12000); // Redirigir después de 12 segundos

    const fraseInterval = setInterval(() => {
      setFraseIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % frasesCalma.length;
        setFraseActual(frasesCalma[nextIndex]);
        return nextIndex;
      });
    }, 3000); // Cambiar frase cada 3 segundos

    return () => {
      clearTimeout(spinnerTimeout);
      clearTimeout(redirectTimeout);
      clearInterval(fraseInterval);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6 justify-center">
      <div className="text-center flex flex-col justify-center items-center">
        <img src="/logo.webp" alt="logo-app" className="w-[40%]" />
        <h1 className="font-cinzel text-primario text-3xl mt-2 flex justify-center items-center gap-4 flex-col">
          <FaCheckCircle className="text-3xl" color="green" />
          Pago Exitoso
        </h1>
      
        <p className="mt-6 text-center text-xl italic text-gray-600 transition-opacity duration-1000">
          {fraseActual}
        </p>
      </div>

      {showSpinner && <Spinner />}
    </div>
  );
}

export default PagoExitoso;
