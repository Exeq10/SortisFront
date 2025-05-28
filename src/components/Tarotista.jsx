import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

// Estrellas de valoración
function RatingStars({ ratings = [] }) {
  if (ratings.length === 0) return <p className="text-white">Sin valoraciones</p>;

  const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  const filledStars = Math.floor(avgRating);
  const halfStar = avgRating % 1 >= 0.5;

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        if (index < filledStars || (index === filledStars && halfStar)) {
          return <span key={index} className="text-yellow-400">★</span>;
        }
        return <span key={index} className="text-gray-400">★</span>;
      })}
    </div>
  );
}

function Tarotista({ tarotista, online }) {

  console.log(online);
  const {
    _id,
    name,
    image,
    ratings = [],
    descripcion = "Consultas personalizadas y guía espiritual.",
    especialidades = ["Amor", "Trabajo", "Espiritualidad"],
    experience,
  } = tarotista;

  const handleSelectTarotista = () => {
    localStorage.setItem("tarotistaSeleccionado", JSON.stringify({ _id, name,image }));
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-accent rounded-3xl shadow-xl overflow-hidden w-full max-w-sm mx-auto my-4 transform transition hover:scale-105">
      <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-accent to-highlight">
        {/* Imagen y estado */}
    <div className="relative">
  <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
    <img src={image} alt={name} className="object-cover w-full h-full" />
  </div>
  <div
    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white z-10 ${
      online ? "bg-green-500" : "bg-gray-400"
    }`}
    title={online ? "Disponible" : "Desconectado"}
  />
</div>

        {/* Nombre y descripción */}
        <h2 className="mt-4 text-white font-uncial text-2xl text-center">{name}</h2>
        <p className="text-sm text-white font-cinzel italic">Psíquico / Asesor espiritual</p>
        <p className="text-white text-xs text-center mt-2 px-2">{descripcion}</p>

        {/* Especialidades */}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {especialidades.map((esp, index) => (
            <span
              key={index}
              className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-cinzel"
            >
              {esp}
            </span>
          ))}
        </div>

        {/* Estrellas y experiencia */}
        <div className="mt-3 text-center flex flex-col justify-center items-center ">
          <RatingStars ratings={ratings} />
          <p className="text-white text-xs mt-1 font-cinzel">{experience} </p>
        </div>

        {/* Botón ver perfil */}
        <div className="mt-4">
          <Link
            to={`/tarotistaProfile/${name}`}
            className="text-sm text-white font-cinzel px-4 py-1 border border-white rounded-full hover:bg-white hover:text-accent transition"
          >
            Ver perfil
          </Link>
        </div>
      </div>

      {/* Botón comunicarse */}
      <div className="bg-white p-4 flex justify-center">
        <Link
          onClick={handleSelectTarotista}
          to="/selectPlan"
          className="w-full text-center flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl font-cinzel transition"
        >
          <FaEnvelope />
          <span>Comunicarse</span>
        </Link>
      </div>
    </div>
  );
}

export default Tarotista;
