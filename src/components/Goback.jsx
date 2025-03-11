
import { useNavigate } from "react-router-dom";

import { RiArrowGoBackFill } from "react-icons/ri";
function Goback() {
    const navigate = useNavigate();
  return (


    <div className="w-full px-3 mt-4">
    <button
       onClick={() => navigate(-1)}
      className="px-3 py-2 bg-highlight hover:scale-105 duration-200 text-white rounded-md shadow-2xl flex justify-center items-center gap-3 "
    >
   <RiArrowGoBackFill />   Atrás
    </button>
  </div>
   
  )
}

export default Goback