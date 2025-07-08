import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import Api from "../../utils/API";

function NewPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const storedEmail = localStorage.getItem("recoveryEmail");
  useEffect(() => {
    if (!storedEmail) {
      toast.warning("Acceso no autorizado. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [storedEmail, navigate]);

  const validateInputs = () => {
    const errors = [];

    if (!newPassword.trim()) {
      errors.push("La contraseña es obligatoria.");
    } else if (newPassword.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres.");
    }

    if (!confirmPassword.trim()) {
      errors.push("Debe confirmar la contraseña.");
    } else if (newPassword !== confirmPassword) {
      errors.push("Las contraseñas no coinciden.");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validaciones primero
    const errors = validateInputs();
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    // 2. Si todo está bien, hacemos la llamada
    try {
      const res = await fetch(`${Api}users/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: storedEmail,
          newPassword,
        }),
      });

      const data = await res.json();

      if (data.message === "Contraseña actualizada con éxito.") {
        localStorage.removeItem("verificationCode");
        localStorage.removeItem("recoveryEmail");
        toast.success("Contraseña actualizada con éxito.");

        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Error al actualizar la contraseña.");
      }
    } catch (error) {
      toast.error("Error en la conexión con el servidor.");
    }
  };

  return (
    <motion.section
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-screen flex justify-center items-center flex-col"
    >
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-6 rounded-br-[45%] w-screen sm:w-3/4 lg:w-2/4 bg-gradient-to-r from-secundario to-highlight h-full flex flex-col justify-center items-center"
      >
        <img src="/logo.webp" alt="Logo" className="w-40 sm:w-56 lg:w-64" />

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col w-full sm:w-[90%] lg:w-[70%] justify-center items-center mt-8"
        >
          {/* Nueva contraseña */}
          <div className="w-full flex flex-col items-center gap-3 relative">
            <label
              htmlFor="newPassword"
              className="text-left text-white font-cinzel"
            >
              Nueva Contraseña
            </label>
            <div className="relative w-[80%] sm:w-[80%] lg:w-[90%]">
              <input
                type={showPassword ? "text" : "password"}
                className="bg-white w-full px-3 py-2 pr-10 rounded-md"
                placeholder="Ingresa tu nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="w-full flex flex-col items-center gap-3 relative mt-4">
            <label
              htmlFor="confirmPassword"
              className="text-left text-white font-cinzel"
            >
              Confirmar Contraseña
            </label>
            <div className="relative w-[80%] sm:w-[80%] lg:w-[90%]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="bg-white w-full px-3 py-2 pr-10 rounded-md"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </span>
            </div>
          </div>

          {/* Botón */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md mt-10 flex items-center justify-center font-cinzel px-6 py-3 w-[80%] sm:w-[80%] lg:w-[60%] bg-gradient-to-r from-primario to-[#323465] text-white"
          >
            Cambiar Contraseña
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.section>
  );
}

export default NewPassword;
