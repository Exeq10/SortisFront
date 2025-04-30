import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const SalirButton = () => {
  const navigate = useNavigate();

  const handleResponse = (response) => {
    if (response === "yes") {
      localStorage.removeItem("user"); // Eliminar el usuario del localStorage
      navigate("/"); // Redirigir al usuario a la página principal (o donde desees)
    } else {
      toast.dismiss(); // Si el usuario elige no salir, se cierra la toast
    }
  };

  const askExitConfirmation = () => {
    toast.info(
      <div>
        <p>¿Estás seguro de que quieres salir?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleResponse("yes")}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Sí
          </button>
          <button
            onClick={() => handleResponse("no")}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: "custom-toast",
      }
    );
  };

  return (
    <div className="flex justify-center w-full">
      <button
        onClick={askExitConfirmation}
        className="w-[90%] font-cinzel border-2 border-white px-5 py-1 rounded-md mt-64 hover:bg-highlight hover:text-white duration-200 bg-primario text-white"
      >
        Salir
      </button>
      <ToastContainer />
    </div>
  );
};

export default SalirButton;
