import { useState, useEffect } from "react";
import tarotDeck from "../utils/tarotDeck";
import { Link } from "react-router-dom";

function ViewsCards() {
  const [cards, setCards] = useState([]);

  const cardSelect = () => {
    const selectedCards = new Set();

    while (selectedCards.size < 3) {
      let randomInt = Math.floor(Math.random() * tarotDeck.length);
      selectedCards.add(tarotDeck[randomInt]);
    }

    setCards([...selectedCards]);
  };

  useEffect(() => {
    cardSelect();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-cinzel text-3xl mt-6">El Tarot dice...</h1>

      {/* Cartas principales */}
      <div className="grid grid-cols-3 px-7 items-center gap-4 mt-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md border-2 border-purple-600">
            <img src={card.image} alt={card.name} className="w-full h-45 mx-auto object-cover" />
          </div>
        ))}
      </div>

      {/* Sección de cartas con descripción */}
      <section className="w-screen mt-6">
        <div className="flex flex-col px-7 items-start gap-4">
          {cards.map((card, index) => (
            <div key={index} className="flex gap-4 items-center bg-white border-2 border-purple-600 rounded-lg shadow-md p-3 w-full max-w-lg">
              
              {/* Imagen de tamaño fijo */}
              <div className="w-24 h-24 flex-shrink-0">
                <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-lg" />
              </div>

              {/* Texto alineado y con buen espaciado */}
              <div className="flex flex-col">
                <h3 className="font-uncial text-lg text-purple-800">{card.name}</h3>
                <p className="font-garamond text-sm text-gray-700 leading-snug max-w-xs overflow-hidden text-ellipsis">
                  {card.description}
                </p>
              </div>

            </div>
          ))}
        </div>

         <div className="w-full flex  justify-center mt-7 ">

         <Link to={'/selectTarot'}   className="px-4 min-w-[50%] py-3 bg-gradient-to-r from-purple-600 to-indigo-500 hover:scale-105 hover:shadow-lg transition-all text-white font-cinzel rounded-md shadow-2xl mb-3">
         ✨ Descubre tu futuro
</Link>

         </div>

      </section>
    </div>
  );
}

export default ViewsCards;
