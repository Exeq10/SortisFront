import { useState } from "react";

// eslint-disable-next-line react/prop-types
function CardDorso({  handleCardClick}) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    handleCardClick()
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-28 sm:w-32 md:w-40 lg:w-48 h-40 sm:h-48 md:h-56 lg:h-64 
        rounded-lg shadow-lg border-4 border-purple-800 flex items-center justify-center 
        transition-all duration-300 transform hover:scale-105 hover:shadow-xl 
        ${isSelected ? "bg-amber-200" : "bg-gradient-to-tl from-softBlue via-white to-purple-300"}
      `}
    >
      {/* Puntos en las esquinas */}
      <div className="absolute top-2 left-2 w-3 h-3 bg-purple-800 rounded-full"></div>
      <div className="absolute top-2 right-2 w-3 h-3 bg-purple-800 rounded-full"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 bg-purple-800 rounded-full"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 bg-purple-800 rounded-full"></div>

      {/* Contenido central */}
      <div className="flex items-center justify-center">
        <img src="./logo.webp" alt="Sortis Logo" className="w-16 sm:w-20 md:w-24 lg:w-28 object-contain" />
      </div>
    </div>
  );
}

export default CardDorso;
