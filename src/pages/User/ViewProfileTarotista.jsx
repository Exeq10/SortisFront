import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import tarotistas from "../../utils/tarotistas";
import Goback from "../../components/Goback";

function ViewProfileTarotista() {
  const { nombre } = useParams();
  

  const tarotistaSelected = tarotistas.find(
    (tarotista) => tarotista.name.toString() === nombre
  );

  if (!tarotistaSelected) {
    return <p className="text-center text-red-500">Tarotista no encontrado</p>;
  }

  const { name, bio, experience, img, services } = tarotistaSelected;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex flex-col w-full md:w-[30%] m-auto justify-center items-center"
    >
     {/* aqui va  el boton  */}

     <Goback/>

      {/* Imagen con animación */}
      <motion.picture 
        className="w-[250px] h-[250px]" 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.img
          src={img}
          alt={`Imagen de ${name}`}
          className="w-full h-full rounded-full border-2 border-accent shadow-xl"
          whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }}
        />
      </motion.picture>

      <div className="flex justify-items-start flex-col gap-3 px-5">
        <h3 className="font-cinzel text-primario text-xl">Biografía</h3>
        <p>{bio}</p>
      </div>

      <div className="flex justify-items-start flex-col gap-3 px-5 mt-4">
        <h3 className="font-cinzel text-primario text-xl">Experiencia</h3>
        <p>{experience}</p>
      </div>

      <div className="w-full px-5 mt-5">
        <h3 className="font-cinzel text-primario text-xl">Rituales</h3>
        <motion.ul 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
        >
          {services.map((service, key) => (
            <motion.li 
              key={key} 
              className="underline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {service}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Botón animado */}
      <motion.div className="mt-5 flex justify-end items-end w-full px-5">
        <motion.button 
          className="py-2 px-3 bg-primario text-white rounded-md shadow w-[45%] mb-5"
          whileHover={{ scale: 1.1, boxShadow: "0px 4px 15px rgba(255, 165, 0, 0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          Contactar
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

export default ViewProfileTarotista;
