import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallModal(true);
    };

    

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó la instalación');
        } else {
          console.log('El usuario rechazó la instalación');
        }
        setDeferredPrompt(null);
        setShowInstallModal(false);
      });
    }
  };

  return (
    <AnimatePresence>
      {showInstallModal && (
        <motion.div
          className="fixed inset-0 bg-transparent flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl text-center w-[90%] md:w-[35%] shadow-lg relative"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100vh", opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="w-24 mx-auto mb-4 drop-shadow-lg"
            />
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              ¡Descubre tu futuro al instante!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Instala <span className="text-purple-600 font-bold">Sortis</span>, tu app de tarot personalizada, y lleva las cartas en tu bolsillo. 
              Accede a lecturas místicas, consejos sabios y más. ¡Explora tu destino ahora mismo!
            </p>
          <div className='w-full flex gap-3 justify-center items-center'>
          <button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-2 px-6 rounded-lg text-lg font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Instalar
            </button>
            <button
              onClick={()=>setShowInstallModal(false)}
              className="bg-transparent  text-gray-500 border  py-2 px-6 rounded-lg text-lg font-semibold shadow-md transition-transform transform hover:scale-105"
            >
           Cancelar
            </button>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
