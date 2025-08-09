import { Link } from "react-router-dom";
import Goback from "../../components/Goback";

function PlanSelect() {
  return (
    <div className="flex flex-col w-full md:w-[30%] m-auto justify-center items-center px-4">
      <h1 className="font-cinzel text-3xl mt-6 text-center max-w-[60%] text-accent">
        Seleccione su plan
      </h1>

      <div className="mt-10 flex flex-col gap-7">
        <Link
          to={`/PlanPaid/${encodeURIComponent("5 minutos (lectura rápida de 1-2 cartas) / $4.99")}`}
          className="border-2 border-accent rounded-md shadow-md font-cinzel px-4 py-4 uppercase hover:bg-gradient-to-r from-accent to-highlight hover:text-white duration-200"
        >
          5 minutos (lectura rápida de 1-2 cartas) / $4.99
        </Link>

        <Link
          to={`/PlanPaid/${encodeURIComponent("15 minutos (lectura detallada de una pregunta) / $9.99")}`}
          className="border-2 border-accent rounded-md shadow-md font-cinzel px-4 py-4 uppercase hover:bg-gradient-to-r from-accent to-highlight hover:text-white duration-200"
        >
          15 minutos (lectura detallada de una pregunta) / $9.99
        </Link>

        <Link
          to={`/PlanPaid/${encodeURIComponent("30 minutos (lectura completa + canalización) / $17.99")}`}
          className="border-2 border-accent rounded-md shadow-md font-cinzel px-4 py-4 uppercase hover:bg-gradient-to-r from-accent to-highlight hover:text-white duration-200"
        >
          30 minutos (lectura completa + canalización) / $17.99
        </Link>

        <p className="mt-5">
          En esta plataforma, garantizamos un espacio seguro y adecuado para nuestra comunidad.
          Para acceder, <b>es requisito ser mayor de edad</b>. Además, existen ciertas normas y restricciones
          sobre los temas que pueden tratarse, asegurando siempre un ambiente respetuoso y acorde a nuestras políticas.
        </p>

        <h3 className="underline font-cinzel">Temas prohibidos</h3>
        <ul>
          <li>Embarazos</li>
          <li>Procesos judiciales</li>
          <li>Salud</li>
          <li>Juegos de Azar</li>
        </ul>

        <Goback />
      </div>
    </div>
  );
}

export default PlanSelect;
