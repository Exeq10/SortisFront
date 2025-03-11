import { useState, useEffect } from "react";
import CardDorso from "../../components/CardDorso";
import Spinner from "../../components/Spinner"; // Asegúrate de importar el Spinner
import ViewsCards from "../../components/ViewsCards";


function Onboarding() {
  const [CardSelected, setCardSelected] = useState([]);
  const [state, setState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (CardSelected.length === 3) {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        setState(true);
      }, 1500);
    }
  }, [CardSelected]);

  useEffect(() => {
    console.log(state);
  }, [state]);

  const handleCardClick = () => {
    if (CardSelected.length < 3) {
      setCardSelected([...CardSelected, 1]);
    }
  };

  // Mostrar Spinner si isLoading es true
  if (isLoading) return <Spinner />;

  // Mostrar OtroComponente si state es true
  if (state) return  <ViewsCards/> ;

  return (
    <div className="flex flex-col items-center">
      <div className="text-center">
        <h1 className="font-uncial text-primario text-3xl mt-2">Bienvenido</h1>
        <h2 className="font-cinzel text-lg">Seleccione su carta</h2>
      </div>

      {/* Contenedor de cartas */}
      <div className="grid grid-cols-3 grid-rows-3 justify-center gap-4 mt-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <CardDorso key={index} handleCardClick={handleCardClick} />
        ))}
      </div>

      {/* Barra inferior */}
      <div className="bg-gradient-to-tr from-highlight to-primario w-full h-24 mt-3"></div>
    </div>
  );
}

export default Onboarding;
