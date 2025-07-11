import { useState } from "react";
import { TiChevronRight } from "react-icons/ti";
import { RiExchangeLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

/* Alertas */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Api from "../../utils/API";
/* Redux */
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

const [isCliked, setIsCliked] = useState(false);
  const handleClick = () => { 

    setIsCliked(!isCliked);
    }


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
    setIsCliked(true); // Bloquea y muestra "Iniciando sesión..."
  
    const errors = validateInputs();
    if (errors.length > 0) {
      showErrorsInToast(errors);
      setIsCliked(false);
      return;
    }
  
    try {
      const response = await fetch(`${Api}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        dispatch(setUser(data.user));
        toast.success("Inicio de sesión exitoso");
  
        if (data.user.isFirstLogin) {
          navigate("/onboarding");
  
          await fetch(`${Api}auth/firstLoginDone`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify({ userId: data.user._id }),
          });
        } else {
          navigate("/dashboardUser");
        }
      } else {
        toast.error(data.message || "Credenciales incorrectas");
        setIsCliked(false);
      }
    } catch (error) {
      toast.error("Hubo un error al intentar iniciar sesión");
      setIsCliked(false);
    }
  
  };
  return (
    <motion.section
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-screen flex justify-center items-center flex-col bg-white"
    >
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-6 rounded-br-[40%] w-screen sm:w-3/4 lg:w-2/4 bg-gradient-to-r from-secundario to-highlight h-full flex flex-col justify-center items-center p-8"
      >
        <img src="/logo.webp" alt="Logo" className="w-40 sm:w-56 lg:w-40" />

        <motion.form
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col w-full sm:w-[90%] lg:w-[70%] justify-center items-center mt-8"
          onSubmit={handleLogin}
        >
          <div className="w-full flex flex-col items-center gap-3">
            <label htmlFor="email" className="text-left text-white font-cinzel">Ingrese su email</label>
            <input
              className="bg-white w-full sm:w-[80%] lg:w-[90%] px-3 py-2 rounded-md"
              type="email"
              placeholder="correo@correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col items-center gap-3 mt-6">
            <label htmlFor="password" className="text-left text-white font-cinzel">Ingrese su contraseña</label>
            <div className="relative w-full sm:w-[80%] lg:w-[90%]">
              <input
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
            <Link to={'/recoveryPass'} className="text-white underline mt-2">¿Has olvidado tu contraseña?</Link>
          </div>
          <motion.button
  type="submit"
  whileHover={isCliked ? {} : { scale: 1.1 }} // Desactiva hover si isCliked es true
  whileTap={{ scale: 0.95 }}
  disabled={isCliked}
  className={`rounded-md mt-10 flex items-center justify-center font-cinzel px-6 py-3 w-full sm:w-[80%] lg:w-[60%]
    bg-gradient-to-r from-primario to-[#323465] text-white transition-all duration-300
    ${isCliked ? "animate-pulse cursor-not-allowed" : "hover:scale-110"}`}
>
  {isCliked ? "Iniciando sesión..." : "Iniciar sesión"}
  <TiChevronRight className="ml-2" />
</motion.button>
        </motion.form>
      </motion.div>

      <div className="w-full flex justify-end px-6 mt-4">
        <Link to={"/loginTarot"} className="px-4 py-2 bg-softBlue rounded-md text-white flex items-center justify-center">
          Tarotistas <RiExchangeLine />
        </Link>
      </div>
    </motion.section>
  );
}

export default Login;
