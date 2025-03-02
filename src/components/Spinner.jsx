

import logo from "/logo.webp"; // Asegúrate de colocar la imagen en la carpeta pública

function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white bg-opacity-50 fixed top-0 left-0 z-50">
    <div className="relative w-40 h-40 ">
      {/* Barra giratoria */}
      <div className="absolute inset-0 w-full h-full border-4 border-transparent border-t-purple-500 border-b-purple-500 rounded-full  animate-spin"></div>
      
      {/* Imagen central */}
      <img
        src={logo}
        alt="Sortis Logo"
        className="w-full h-full object-contain"
      />
    </div>
  </div>
  );
}

export default Spinner;