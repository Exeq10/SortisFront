import { useParams } from "react-router-dom";
import Goback from "../../components/Goback";

function Plan() {
  const { plan } = useParams();

  return (
    <div className="flex flex-col w-full md:w-[30%] m-auto justify-center items-center px-4">
      <h1 className="font-cinzel text-3xl mt-6 text-center max-w-[60%] text-accent">
        Seleccionaste el siguiente plan
      </h1>

      <div className="border-2 mt-8 border-accent rounded-md shadow-md font-cinzel px-4 py-4 uppercase bg-gradient-to-r from-accent to-highlight text-white ">
        {decodeURIComponent(plan)}
      </div>

      <Goback/>
    </div>
  );
}

export default Plan;
