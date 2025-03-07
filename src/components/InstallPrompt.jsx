import  { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevenir el comportamiento por defecto (mostrar el banner de instalación del navegador)
      e.preventDefault();
      // Guardar el evento para usarlo después
      setDeferredPrompt(e);
      // Mostrar el modal de instalación
      setShowInstallModal(true);
    };

    // Agregar el listener para el evento
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      // Limpiar el listener cuando el componente se desmonte
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    // Si el evento deferredPrompt está disponible, mostrar el prompt de instalación
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó la instalación');
        } else {
          console.log('El usuario rechazó la instalación');
        }
        // Limpiar el evento después de la interacción
        setDeferredPrompt(null);
        setShowInstallModal(false); // Cerrar el modal
      });
    }
  };

  return (
    showInstallModal && (
      <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg text-center w-[90%]  md:w-[35%] ">
          <img
            src="/logo.png" // Ruta al logo de tu app
            alt="Logo"
            className="w-24 mx-auto mb-6"
          />
          <h2 className="text-2xl font-semibold mb-4"> ¡Descubre tu futuro al instante!</h2>
          <p className="text-lg mb-6">
         

          Instala Sortis, tu app de tarot personalizada, y lleva las cartas en tu bolsillo. Accede a lecturas místicas, consejos sabios y más, todo al alcance de tu mano. ¡Hazla nativa en tu dispositivo y empieza a explorar tu destino ahora mismo!
          </p>
          <button
            onClick={handleInstallClick}
            className="bg-accent font-cinzel text-white py-2 px-6 rounded-lg text-lg cursor-pointer"
          >
            Instalar
          </button>
        </div>
      </div>
    )
  );
};

export default InstallPrompt;
