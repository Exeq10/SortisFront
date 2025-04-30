import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Api from "../../utils/API";
import { setUser } from "../../redux/userSlice"; // Ajustá la ruta si es distinta
/* Alertas */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState(user.image || "/avatar.png");
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Manejar cambio de imagen y subir a Cloudinary
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    toast.info("Subiendo imagen...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Sortis");

    try {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dwg5nklfq/image/upload",
        formData
      );
      setProfileImage(data.secure_url);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  // Manejar inputs
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Manejar envío
  const handleSubmit = async () => {
    if (uploading) return;
    setLoading(true);

    try {
      await axios.put(
        `${Api}users/profile`,
        { ...userData, image: profileImage },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Perfil actualizado correctamente");

      dispatch(setUser({ ...user, ...userData, image: profileImage }));
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.toString() || "Error al actualizar perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] h-screen mt-16 flex justify-start items-center flex-col">
      <ToastContainer />
      <motion.h2
        className="text-2xl text-center mb-4 font-cinzel"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Perfil de Usuario
      </motion.h2>

      {/* Imagen de perfil */}
      <div className="flex flex-col items-center">
        <motion.img
          src={profileImage}
          alt="Perfil"
          className="w-36 h-36 rounded-full border-2 border-gray-300 shadow-lg"
          whileHover={{ scale: 1.1 }}
        />

        <label
          className={`mt-3 px-3 py-1 ${
            uploading ? "bg-gray-400" : "bg-primario"
          } text-white rounded-md cursor-pointer ${
            uploading ? "cursor-not-allowed" : "hover:bg-blue-700"
          } transition`}
        >
          {uploading ? "Subiendo..." : "Cargar Imagen"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Formulario de datos */}
      <div className="mt-4 space-y-3 w-full max-w-sm">
        {Object.entries(userData).map(([key, value]) => (
          <label key={key} className="block">
            <span className="text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
              disabled={uploading}
            />
          </label>
        ))}
      </div>

      {/* Botón de Guardar */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleSubmit}
        className="w-full bg-accent text-white p-2 rounded-md mt-4 hover:bg-primario transition"
        disabled={loading || uploading}
      >
        {loading ? "Guardando..." : "Guardar Cambios"}
      </motion.button>
    </div>
  );
};

export default Profile;
