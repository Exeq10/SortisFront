

import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTarotistas } from "../../redux/tarotistasSlice";
import Api from "../../utils/API";


import Tarotista from "../../components/Tarotista";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Goback from "../../components/Goback";

function SelectTarotista() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const tarotistas = useSelector((state) => state.tarotistas);
  const onlineTarotistas = useSelector((state) => state.onlineTarotistas);

 console.log(onlineTarotistas);
 

 console.log(token);
  useEffect(() => {
    const fetchTarotistas = async () => {
      try {
        const response = await fetch(`${Api}users/tarotistas`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener el perfil");
        }

        const data = await response.json();
        dispatch(setTarotistas(data));
        console.log("Tarotistas obtenidos desde API:", data);
      } catch (error) {
        console.error("Error al obtener tarotistas:", error.message);
      }
    };

    if (token && tarotistas.length === 0) {
      fetchTarotistas();
    } else {
      console.log("Usando tarotistas del store:", tarotistas);
    }
  }, [token, dispatch]);



 

  return (
    <div className="flex flex-col w-full md:w-[30%] m-auto justify-center items-center">
      <h1 className="font-cinzel text-3xl mt-6 text-center max-w-[60%] text-accent">
        Seleccione su tarotista
      </h1>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop
        className="w-full max-w-5xl mt-6"
      >
        {tarotistas.map((tarotista, index) => (
          <SwiperSlide key={index}>
            <Tarotista tarotista={tarotista}
             isOnline={onlineTarotistas.includes(tarotista._id)} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Goback/>
    </div>
  );
}

export default SelectTarotista;
