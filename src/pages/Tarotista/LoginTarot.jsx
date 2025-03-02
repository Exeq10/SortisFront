import { useState } from "react";
import { motion } from "framer-motion";
import { TiChevronRight } from "react-icons/ti";
import { RiExchangeLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

/* Alertas */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();

  // Estados para los inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Función de validación de los inputs
  const validateInputs = () => {
    let errors = [];

    // Validar email
    if (!email.trim()) {
      errors.push("El email es obligatorio.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("El email no es válido.");
    }

    // Validar contraseña
    if (!password.trim()) {
      errors.push("La contraseña es obligatoria.");
    } else if (password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres.");
    }

    return errors;
  };

  // Función para mostrar los errores en los toasts
  const showErrorsInToast = (errors) => {
    errors.forEach((error) => {
      toast.error(error);
    });
  };

  // Simulación de login
  const handleLogin = (e) => {
    e.preventDefault();

    const errors = validateInputs();
    if (errors.length > 0) {
      showErrorsInToast(errors);
      return;
    }

    // Simulación de autenticación (reemplaza con tu API)
    if (email === "admin@correo.com" && password === "123456") {
      toast.success("Inicio de sesión exitoso");
      setTimeout(() => navigate("/dashboard"), 1500); // Redirigir tras éxito
    } else {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full h-screen flex justify-center items-center flex-col"
    >
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6 rounded-br-[45%] w-screen sm:w-3/4 lg:w-2/4 bg-gradient-to-r from-softBlue to-secundario h-full flex flex-col justify-center items-center"
      >
        <img src="/logo.webp" alt="Logo" className="w-40 sm:w-56 lg:w-64" />

        <motion.div
          id="inputs-forms"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col w-full sm:w-[90%] lg:w-[70%] justify-center items-center mt-8"
        >
          <form className="w-full" onSubmit={handleLogin}>
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
              />
            </div>

            <div className="w-full flex flex-col items-center gap-3 mt-5">
              <label htmlFor="password" className="text-left text-white font-cinzel">
                Ingrese su contraseña
              </label>
              <input
                className="bg-white w-[80%] sm:w-[80%] lg:w-[90%] px-3 py-2 rounded-md"
                type="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-md mt-10 flex items-center justify-center font-cinzel px-6 py-3 w-[80%] sm:w-[80%] lg:w-[60%] bg-gradient-to-r from-gray to-gray-400 text-white"
              >
                Iniciar sesión
                <TiChevronRight className="ml-2" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <div className="w-full flex px-6 justify-end">
        <Link to={"/login"} className="px-4 py-2 bg-primario rounded-md text-white flex items-center justify-center">
          Usuarios <RiExchangeLine />
        </Link>
      </div>
    </motion.section>
  );
}

export default Login;
