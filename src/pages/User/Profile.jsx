import { useState } from "react";
import { motion } from "framer-motion";

const Profile = () => {
  const [profileImage, setProfileImage] = useState("/avatar.png");
  const [userData, setUserData] = useState({
    name: "Juan Pérez",
    email: "juanperez@example.com",
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div 
      className="w-[90%] h-screen mt-16 flex justify-start items-center flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl text-center mb-4 font-cinzel">Perfil de Usuario</h2>

      {/* Imagen de perfil */}
      <div className="flex flex-col items-center">
        <motion.img
          src={profileImage}
          alt="Perfil"
          className="w-36 h-36 rounded-full border-2 border-gray-300 shadow-lg"
          whileHover={{ scale: 1.1 }}
        />

        {/* Botón de Cargar Imagen */}
        <label className="mt-3 px-3 py-1 bg-primario text-white rounded-md cursor-pointer hover:bg-blue-700 transition">
          Cargar Imagen
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Formulario de datos */}
      <div className="mt-4 space-y-3 w-full max-w-sm">
        <label className="block">
          <span className="text-gray-700">Nombre</span>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Correo Electrónico</span>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </label>
      </div>

      {/* Botón de Guardar */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="w-full bg-accent text-white p-2 rounded-md mt-4 hover:bg-primario transition"
      >
        Guardar Cambios
      </motion.button>
    </motion.div>
  );
};

export default Profile;
