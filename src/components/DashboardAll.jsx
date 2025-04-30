import { useEffect } from "react";
import { CiBullhorn } from "react-icons/ci";
import { TbCards } from "react-icons/tb";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import obtenerFraseAleatoria from "../hooks/obtenerFrase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useSelector, useDispatch } from "react-redux";
import { setTarotistas } from "../redux/tarotistasSlice";
import { setPosts } from "../redux/postSlice";
import Api from "../utils/API";

import Tarotista from "./Tarotista";
import PostWiewUser from "./PostWiewUser";

function DashboardAll() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.token);
  const tarotistas = useSelector((state) => state.tarotistas);
  const posts = useSelector((state) => state.posts);

  useEffect(() => {
    const fetchTarotistas = async () => {
      try {
        const response = await fetch(`${Api}users/tarotistas`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("No se pudo obtener el perfil");
        const data = await response.json();
        dispatch(setTarotistas(data));
      } catch (error) {
        console.error("Error al obtener tarotistas:", error.message);
      }
    };

    if (token && tarotistas.length === 0) {
      fetchTarotistas();
    }
  }, [token, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${Api}post/`, { method: "GET" });
        if (!response.ok) throw new Error("No se pudieron obtener los posts");
        const data = await response.json();
        dispatch(setPosts(data || []));
      } catch (error) {
        console.error("Error al obtener posts:", error.message);
      }
    };

    if (token && posts.length === 0) {
      fetchPosts();
    }
  }, [token, dispatch]);

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Hero */}
      <div className="relative w-full h-60 flex items-center justify-center text-accent">
        <div className="text-center">
          <motion.h1
            className="text-2xl font-bold font-cinzel "
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          > 
            Bienvenido <br />  <span className="text-black text-lg font-normal" >  {user.name || "Usuario"}</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-center text-lg text-highlight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {obtenerFraseAleatoria("grupo1")}
          </motion.p>
          <Link
            to={"/selectTarot"}
            className="inline-block mt-6 px-6 py-2 rounded-lg text-white bg-accent hover:bg-highlight transition duration-300 shadow-md"
          >
            Ir al Tarot
          </Link>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-center items-center px-4 mt-10">

        {/* Estadísticas */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-softBlue p-4 rounded-lg text-center shadow-md hover:scale-105 transition">
            <h3 className="text-lg font-semibold">Tarotistas</h3>
            <p className="text-2xl">{tarotistas.length}</p>
          </div>
          <div className="bg-accent p-4 rounded-lg text-center shadow-md hover:scale-105 transition">
            <h3 className="text-lg font-semibold">Posts</h3>
            <p className="text-2xl">{posts.length}</p>
          </div>
          <div className="bg-highlight p-4 rounded-lg text-center shadow-md hover:scale-105 transition">
            <h3 className="text-lg font-semibold">Última actualización</h3>
            <p className="text-2xl">Hoy</p>
          </div>
        </motion.div>

        {/* Novedades */}
        <motion.h2
          className="font-semibold text-2xl font-cinzel text-white flex items-center gap-2 mb-4"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <CiBullhorn /> Novedades
        </motion.h2>

        <Swiper
  spaceBetween={20}
  slidesPerView={1}
  pagination={{ clickable: true }}
  modules={[Pagination]}
  className="w-full mt-6"
>
  {[...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
    .map((post) => (
      <SwiperSlide key={post._id}>
        <motion.div whileHover={{ scale: 1.02 }}>
          <PostWiewUser posts={[post]} />
        </motion.div>
      </SwiperSlide>
    ))}
</Swiper>

        {/* Tarotistas */}
        <motion.h2
          className="font-semibold text-2xl font-cinzel text-white flex items-center gap-2 mt-10 mb-4"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <TbCards /> Tarotistas
        </motion.h2>

        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop
          modules={[Pagination]}
          className="w-full max-w-5xl"
        >
          {tarotistas.map((tarotista, index) => (
            <SwiperSlide key={index}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Tarotista tarotista={tarotista} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default DashboardAll;
