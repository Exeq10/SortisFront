import Tarotista from "../../components/Tarotista";
import tarotistas from "../../utils/tarotistas";

import { Swiper, SwiperSlide } from "swiper/react";
import {  Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function SelectTarotista() {
  return (
    <div className="flex flex-col w-full md:w-[30%] m-auto justify-center items-center">
      <h1 className="font-cinzel text-3xl mt-6 text-center max-w-[60%] text-accent">
        Seleccione su tarotista
      </h1>

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
  );
}

export default SelectTarotista;
