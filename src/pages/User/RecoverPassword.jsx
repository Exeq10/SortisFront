import { useState } from "react";
import { TiChevronRight } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "emailjs-com";
import Api from "../../utils/API";
import generateVerificationCode from "../../hooks/generateVerificationCode";

function RecoverPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) return "El email es obligatorio.";
    if (!/\S+@\S+\.\S+/.test(email)) return "El email no es válido.";
    return null;
  };

  const handleRecover = async (e) => {
    e.preventDefault();

    const error = validateEmail();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setIsChecking(true);
      
      const response = await fetch(`${Api}users/find`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }) 
      });
      
      const data = await response.json();

      console.log(data);
      

      if (!data.found ) {
        throw new Error(data.message || "Este email no está registrado.");
    
      }else{
        
 // Ahora sí generamos el código
 const verificationCode = generateVerificationCode();
 localStorage.setItem("verificationCode", verificationCode);
 localStorage.setItem("recoveryEmail", email);

 // Parámetros para enviar email
 const templateParams = { email, verification_code: verificationCode };

 await emailjs.send("service_e41asqf", "template_noug7bq", templateParams, "OCGOUdtFQB5Ay6BIk");
        toast.success("Código de verificación enviado a tu correo");
        setTimeout(() => navigate("/verify-code"), 2000);
      }

     

      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsChecking(false);
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
          onSubmit={handleRecover}
        >
          <div className="w-full flex flex-col items-center gap-3">
            <label htmlFor="email" className="text-left text-white font-cinzel">
              Ingrese su email
            </label>
            <input
              className="bg-white w-[80%] sm:w-[80%] lg:w-[90%] px-3 py-2 rounded-md"
              type="email"
              placeholder="correo@correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isChecking}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md mt-10 flex items-center justify-center font-cinzel px-6 py-3 w-[80%] sm:w-[80%] lg:w-[60%] bg-gradient-to-r from-primario to-[#323465] text-white"
            disabled={isChecking}
          >
            {isChecking ? "Verificando..." : "Enviar Código"}
            <TiChevronRight className="ml-2" />
          </motion.button>
        </motion.form>

        <Link to="/login" className="mt-5 text-white underline">
          Volver al inicio de sesión
        </Link>
      </motion.div>
    </motion.section>
  );
}

export default RecoverPassword;
