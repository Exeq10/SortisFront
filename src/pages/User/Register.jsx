import { useState } from "react";
import { TiChevronRight } from "react-icons/ti";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { paisesHispanohablantes } from "../../utils/countries";
import SelectSigno from "../../components/SelectSigno";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import axios from "axios";

import Api from "../../utils/API";


function Register() {
  const navigate = useNavigate();

  /* SPINNER */
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    fechaNacimiento: "",
    email: "",
    password: "",
    pais: "",
    terminos: false,
  });

  const validateInputs = () => {
    let errors = [];
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const selectedDate = new Date(formData.fechaNacimiento);

    if (!formData.nombre.trim()) errors.push("El nombre es obligatorio.");
    if (!formData.fechaNacimiento) {
      errors.push("La fecha de nacimiento es obligatoria.");
    } else if (selectedDate > minDate) {
      errors.push("Debes ser mayor de 18 años.");
    }

    if (!formData.email.trim()) {
      errors.push("El email es obligatorio.");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("El email no es válido.");
    }

    if (!formData.password.trim()) {
      errors.push("La contraseña es obligatoria.");
    } else if (formData.password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres.");
    }

    if (!formData.pais) errors.push("Debe seleccionar un país de residencia.");
    if (!formData.terminos) errors.push("Debe aceptar los términos y condiciones.");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInputs();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${Api}auth/register`, {
        name: formData.nombre,
        email: formData.email,
        password: formData.password,
        role: "cliente",
        sign: localStorage.getItem("Signo"),
        birthdate: formData.fechaNacimiento,
        image:"/avatar.png"
      });

      toast.success("Registro exitoso. Felicidades tienes recompensa...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error al crear usuario:", error.response?.data );
      toast.error(JSON.stringify(error.response?.data.error) || "Error al registrar usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      
      {state ? (
        <section className="w-full h-screen flex justify-center items-center flex-col">
          <div className="mb-6 px-3 rounded-br-[45%] w-screen sm:w-3/4 lg:w-2/4 bg-gradient-to-r from-secundario to-highlight h-full flex flex-col justify-start items-center">
            <div id="inputs-forms" className="flex flex-col w-full sm:w-[90%] lg:w-[70%] justify-start items-center mt-8">
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex mb-5">
                  <div className="w-full flex flex-col items-start gap-3">
                    <label className="text-left text-white font-cinzel text-sm">Nombre</label>
                    <input
                      className="bg-white w-[80%] px-3 py-2 rounded-md"
                      type="text"
                      placeholder="Nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                  <div className="w-full flex flex-col items-start gap-3">
                    <label className="text-left text-white font-cinzel text-sm">Fecha de nacimiento</label>
                    <input
                      className="bg-white w-[80%] px-3 py-2 rounded-md"
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col items-start gap-3">
                  <label className="text-left text-white font-cinzel text-sm">Email</label>
                  <input
                    className="bg-white w-[80%] px-3 py-2 rounded-md"
                    type="email"
                    placeholder="correo@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-3 mt-5">
                  <label className="text-left text-white font-cinzel text-sm">Contraseña</label>
                  <input
                    className="bg-white w-[80%] px-3 py-2 rounded-md"
                    type="password"
                    placeholder="*********"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-3 mt-5">
                  <label className="text-left text-white font-cinzel text-sm">País de residencia</label>
                  <select
                    className="bg-white w-[80%] px-3 py-2 rounded-md"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  >
                    <option value="">Seleccione un país</option>
                    {paisesHispanohablantes.map((country, key) => (
                      <option key={key} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div className="w-[80%] mt-4 flex gap-3 items-center">
                  <input
                    type="checkbox"
                    checked={formData.terminos}
                    onChange={(e) => setFormData({ ...formData, terminos: e.target.checked })}
                  />
                  <Link to={'/terms&conditions'} className="font-cinzel text-white text-sm">Acepto los términos y condiciones</Link>
                </div>
                <button type="submit" className="rounded-md mt-6 mb-8 flex items-center justify-center font-cinzel px-6 py-3 w-[80%] bg-gradient-to-r from-primario to-[#323465] text-white">
                  {isLoading ? <Spinner /> : "Continuar"}
                  <TiChevronRight className="ml-2" />
                </button>
              </form>
            </div>
          </div>

          {isLoading && <Spinner />}
        </section>
      ) : (
        <SelectSigno setState={setState} state={state} />
      )}
    </>
  );
}

export default Register;
