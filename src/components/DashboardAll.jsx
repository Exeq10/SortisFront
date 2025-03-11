

import { CiBullhorn } from "react-icons/ci";
import { TbCards } from "react-icons/tb";
import { Link } from "react-router-dom";

import obtenerFraseAleatoria from "../hooks/obtenerFrase";
import frasesTarot from "../utils/phrases";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import tarotistas from "../utils/tarotistas";
import Tarotista from "./Tarotista";
function DashboardAll() {
  return (
    <>
   {/* Contenido principal */}
   <div className="flex w-full flex-col items-start px-4 mt-10">
   <h1 className="text-start font-cinzel text-3xl text-primario">
     Bienvenido de nuevo
   </h1>
   <p className="text-md text-gray-600 mt-6">
     {obtenerFraseAleatoria("grupo1")}
   </p>
   <Link
     to={"/selectTarot"}
     className="px-4 min-w-[40%] flex items-center  hover:bg-highlight duration-300  justify-center py-2 rounded-xl shadow font-cinzel bg-accent text-white mt-5"
     >
     Tarot
   </Link>
 </div>

 <div className="w-[100%] px-4 mt-6">
   <h2 className="font-semibold text-2xl mt-6 font-cinzel text-primario flex items-center gap-2">
     <CiBullhorn /> Novedades
   </h2>
   <div className="grid grid-cols-2 gap-4 mt-3">
     {" "}
     {/* Contenido de novedades */}{" "}
   </div>

   <h2 className="font-semibold text-2xl mt-6 font-cinzel text-primario flex items-center gap-2">
     <TbCards /> Tarotistas
   </h2>
   <div className=" w-full  flex  mt-3">
     {" "}
     {/* Contenido de tarotistas */}{" "}
   </div>

   <Swiper
     spaceBetween={20}
     slidesPerView={1}
     Pagination={{ clickable: true }}
     loop
     className="w-full max-w-5xl mt-6"
   >
     {tarotistas.map((tarotista, index) => (
         <SwiperSlide key={index}>
         <Tarotista tarotista={tarotista} />
       </SwiperSlide>
     ))}
   </Swiper>
 </div>
     </>
  )
}

export default DashboardAll