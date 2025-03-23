import { useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaSave } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
function UserProfile() {
  const [userData, setUserData] = useState({
    name: "Cristian Francia",
    profileImage: "/cristian.jpg",
    description: "Soy un psíquico con experiencia en lecturas de tarot y energías.",
    services: [
      "Lectura de tarot",
      "Interpretación de sueños",
      "Sanación energética",
      "Consulta espiritual",
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...userData.services];
    updatedServices[index] = value;
    setUserData((prev) => ({ ...prev, services: updatedServices }));
  };

  const addService = () => {
    setUserData((prev) => ({
      ...prev,
      services: [...prev.services, ""],
    }));
  };

  const removeService = (index) => {
    const updatedServices = userData.services.filter((_, i) => i !== index);
    setUserData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("https://api.ejemplo.com/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Error al guardar los cambios");

      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al guardar los cambios");
    }
  };

  return (
    <div className="flex flex-col items-center px-6 mt-10 w-full">
      <h1 className="text-center font-cinzel text-2xl text-primario font-semibold flex justify-center items-center gap-2" >
        MI PERFIL <CgProfile />
      </h1> 

      {/* Imagen de perfil editable */}
      <div className="relative mt-5">
        <img
          src={userData.profileImage}
          alt={userData.name}
          className="w-32 h-32 rounded-full border-4 border-accent shadow-lg"
        />
        <label className="absolute bottom-2 right-2 text-xl text-softBlue cursor-pointer">
          <FaEdit />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      {/* Nombre Editable */}
      <input
        type="text"
        name="name"
        value={userData.name}
        onChange={handleChange}
        className="text-xl font-cinzel mt-3 text-softBlue font-medium text-center border-b-2 focus:outline-none focus:border-accent"
      />

      {/* Descripción Editable */}
      <textarea
        name="description"
        value={userData.description}
        onChange={handleChange}
        className="text-center text-gray-600 mt-2 w-full p-2 border rounded-md focus:outline-none focus:border-accent"
      />

      {/* Servicios Editables */}
      <div className="mt-4 w-full">
        <h3 className="text-lg text-gray-700 font-semibold">Servicios</h3>
        <ul className="mt-2 text-gray-600">
          {userData.services.map((service, index) => (
            <li key={index} className="flex items-center gap-2 border-b py-1">
              <input
                type="text"
                value={service}
                onChange={(e) => handleServiceChange(index, e.target.value)}
                className="w-full border-b focus:outline-none focus:border-accent"
              />
              <button onClick={() => removeService(index)} className="text-red-500">
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={addService}
          className="mt-2 flex items-center gap-2 text-softBlue hover:underline"
        >
          <FaPlus /> Agregar servicio
        </button>
      </div>

      {/* Botón para guardar cambios */}
      <button
        onClick={handleSaveChanges}
        className="mt-5 px-4 py-2 bg-primario text-white rounded-md flex items-center gap-2 shadow-md hover:bg-opacity-80"
      >
        <FaSave /> Guardar cambios
      </button>
    </div>
  );
}

export default UserProfile;
