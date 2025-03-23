import { useState } from "react";
import { TiChevronRight } from "react-icons/ti";
import { RiExchangeLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* Alertas */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Api from "../../utils/API";
/* Redux */
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice"; 

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Para despachar acciones de Redux

  // Estados para los inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Función de validación de los inputs
  const validateInputs = () => {
    let errors = [];

    if (!email.trim()) {
      errors.push("El email es obligatorio.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("El email no es válido.");
    }

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

  // Función para hacer la petición POST
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(password);
    

    const errors = validateInputs();
    if (errors.length > 0) {
      showErrorsInToast(errors);
      return;
    }

    try {
      const response = await fetch(`${Api}auth/login`, { // Cambia esta URL por la del servidor
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {

        console.log(response);
        // Si la respuesta es exitosa, guardar los datos en el estado global
        dispatch(setUser(data.user)); 
        toast.success("Inicio de sesión exitoso");
        setTimeout(() => navigate("/dashboardUser"), 1500);
      } else {
        toast.error(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      toast.error("Hubo un error al intentar iniciar sesión");
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
          onSubmit={handleLogin}
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md mt-10 flex items-center justify-center font-cinzel px-6 py-3 w-[80%] sm:w-[80%] lg:w-[60%] bg-gradient-to-r from-primario to-[#323465] text-white"
            >
              Iniciar sesión
              <TiChevronRight className="ml-2" />
            </motion.button>
          </div>
        </motion.form>
      </motion.div>

      <div className="w-full flex px-6 justify-end">
        <Link
          to={"/loginTarot"}
          className="px-4 py-2 bg-softBlue rounded-md text-white flex items-center justify-center"
        >
          Tarotistas <RiExchangeLine />
        </Link>
      </div>
    </motion.section>
  );
}

export default Login;
