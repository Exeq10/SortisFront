import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VerifyCode() {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);

  // Recuperar el código almacenado y el correo de recuperación desde localStorage
  const storedVerificationCode = localStorage.getItem("verificationCode");
  const storedEmail = localStorage.getItem("recoveryEmail");


  const validateCode = () => {
 if (!verificationCode.trim()) {
      toast.error("El código de verificación es obligatorio.");
      return false;
    }
    if (verificationCode !== storedVerificationCode) {
      toast.error("El código de verificación es incorrecto.");
      return false;
    }
    return true;
  };

  const handleVerify = (e) => {
    e.preventDefault();

    // Validar el código ingresado
    const isValid = validateCode();
    if (isValid) {
      setIsCodeCorrect(true);
      toast.success("Código verificado correctamente.");

      // Simulación de redirección (puedes cambiar esta parte según lo que necesites)
      setTimeout(() => {
        navigate("/new-password"); // Redirigir a una página para ingresar una nueva contraseña
      }, 2000);
    }
  };

  return (
    <motion.section
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
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
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col w-full sm:w-[90%] lg:w-[70%] justify-center items-center mt-8"
          onSubmit={handleVerify}
        >
          <div className="w-full flex flex-col items-center gap-3">
            <label htmlFor="verificationCode" className="text-left text-white font-cinzel">
              Ingresa el código de verificación
            </label>
            <input
              className="bg-white w-[80%] sm:w-[80%] lg:w-[90%] px-3 py-2 rounded-md"
              type="text"
              placeholder="Código de 6 dígitos"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md mt-10 flex items-center justify-center font-cinzel px-6 py-3 w-[80%] sm:w-[80%] lg:w-[60%] bg-gradient-to-r from-primario to-[#323465] text-white"
          >
            Verificar Código
          </motion.button>
        </motion.form>

        <p className="mt-5 text-white">
          ¿No recibiste el código? <Link to="/recoveryPass" className="underline">Reenviar</Link>
        </p>
      </motion.div>
    </motion.section>
  );
}

export default VerifyCode;
