import { useState } from "react";
import { motion } from "framer-motion";
import { TiChevronRight } from "react-icons/ti";
import { RiExchangeLine } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

/* Alertas */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* API y Redux */
import Api from "../../utils/API";
import { useDispatch } from "react-redux";
import { setTarotista } from "../../redux/tarotistaSlice";

function LoginTarot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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

  const showErrorsInToast = (errors) => {
    errors.forEach((error) => toast.error(error));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const errors = validateInputs();
    if (errors.length > 0) {
      showErrorsInToast(errors);
      return;
    }

    try {
      const response = await fetch(`${Api}auth/login-tarotista`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {

     
        
        localStorage.setItem('Tarotista',JSON.stringify(data.user))
        dispatch(setTarotista(data.user));

        toast.success("Inicio de sesión exitoso");
        navigate('/dashboard')

      
      } else {
        toast.error(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      toast.error("Hubo un error al intentar iniciar sesión");
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col w-full sm:w-[90%] lg:w-[70%] justify-center items-center mt-8"
        >
          <form className="w-full" onSubmit={handleLogin}>
            <div className="w-full flex flex-col items-center gap-3">
              <label htmlFor="email" className="text-white font-cinzel">
                Ingrese su email
              </label>
              <input
                id="email"
                className="bg-white w-[80%] px-3 py-2 rounded-md"
                type="email"
                placeholder="correo@correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col items-center gap-3 mt-6">
              <label htmlFor="password" className="text-white font-cinzel">
                Ingrese su contraseña
              </label>
              <div className="relative w-[80%]">
                <input
                  id="password"
                  className="bg-white w-full px-3 py-2 rounded-md"
                  type={showPassword ? "text" : "password"}
                  placeholder="*********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="text-gray-500" />
                  ) : (
                    <AiFillEye className="text-gray-500" />
                  )}
                </div>
              </div>
              <Link to={"/recoveryPass"} className="text-white underline mt-2">
                ¿Has olvidado tu contraseña?
              </Link>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md mt-10 flex items-center justify-center font-cinzel px-6 py-3 w-[80%] bg-gradient-to-r from-[#323465] to-primario text-white"
            >
              Iniciar sesión
              <TiChevronRight className="ml-2" />
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <div className="w-full flex justify-end px-6 mt-4">
        <Link
          to={"/login"}
          className="px-4 py-2 bg-highlight rounded-md text-white flex items-center justify-center"
        >
          Usuarios <RiExchangeLine />
        </Link>
      </div>
    </motion.section>
  );
}

export default LoginTarot;
