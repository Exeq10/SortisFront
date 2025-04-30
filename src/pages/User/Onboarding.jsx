import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CardDorso from "../../components/CardDorso";
import Spinner from "../../components/Spinner";
import ViewsCards from "../../components/ViewsCards";

function Onboarding() {
  const navigate = useNavigate();

  const [CardSelected, setCardSelected] = useState([]);
  const [state, setState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mensajes = [
    "Deja que el universo te guíe... Elige tres cartas y descubre tu destino. ✨",
    "Has elegido una... dos más revelarán el mensaje oculto. 🔮",
    "Ya tienes dos cartas... una más y el oráculo hablará. 🕯️",
    "Las cartas han hablado... revelando tu verdad. 🌙",
  ];

  useEffect(() => {
    if (CardSelected.length === 3) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setState(true);
      }, 1500);
    }
  }, [CardSelected]);

  const handleCardClick = () => {
    if (CardSelected.length < 3) {
      setCardSelected([...CardSelected, 1]);
    }
  };

  if (isLoading) return <Spinner />;
  if (state) return <ViewsCards />;

  return (
    <div className="flex flex-col items-center">
      <div className="text-center">
        <h1 className="font-uncial text-primario text-3xl mt-2">Bienvenido</h1>
        <h2 className="font-cinzel text-lg">Seleccione su carta</h2>
      </div>
      <div className="grid grid-cols-3 grid-rows-3 justify-center gap-4 mt-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <CardDorso key={index} handleCardClick={handleCardClick} />
        ))}
      </div>
      <p className="text-center text-gray-700 italic mt-6 max-w-md px-4">
        {mensajes[CardSelected.length]}
      </p>
    </div>
  );
}

export default Onboarding;
