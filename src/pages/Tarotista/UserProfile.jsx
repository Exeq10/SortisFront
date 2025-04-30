import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTarotista } from "../../redux/tarotistaSlice";
import { FaEdit, FaPlus, FaTrash, FaSave } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Api from "../../utils/API";
import { toast, ToastContainer } from "react-toastify";

function UserProfile() {
  const tarotista = useSelector((state) => state.tarotista);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    description: "",
    services: [],
  });
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    link: "",
  });

  useEffect(() => {

    

    setUserData({
      name: tarotista.name || "",
      profileImage: tarotista.image || "/default.jpg",
      description: tarotista.bio || "",
      services: tarotista.services || [],
    });
  }, [tarotista]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedServices = [...userData.services];
    updatedServices[index] = { ...updatedServices[index], [name]: value };
    setUserData((prev) => ({ ...prev, services: updatedServices }));
  };

  const addService = () => {
    setShowAddServiceForm(true);
  };

  const removeService = (index) => {
    const updatedServices = userData.services.filter((_, i) => i !== index);
    setUserData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Sortis");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dwg5nklfq/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setUserData((prev) => ({
        ...prev,
        profileImage: data.secure_url,
      }));
    } catch (error) {
      console.error("Error al subir la imagen", error);
      toast.error("No se pudo subir la imagen");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        name: userData.name,
        bio: userData.description,
        services: userData.services,
        image: userData.profileImage,
      };

      const response = await fetch(`${Api}users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tarotista.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Error al guardar los cambios");

      const data = await response.json();
      dispatch(updateTarotista(data));

      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema al guardar los cambios");
    }
  };

  const handleAddServiceSubmit = () => {
    setUserData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
    setNewService({ name: "", description: "", price: "", link: "" });
    setShowAddServiceForm(false);
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };


  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Sortis");
    formData.append("resource_type", "auto");
  
    try {

      toast.info('Cargando archivo...')
      const res = await fetch("https://api.cloudinary.com/v1_1/dwg5nklfq/auto/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      setNewService((prev) => ({
        ...prev,
        link: data.secure_url,
      }));
    } catch (error) {
      console.error("Error al subir el PDF", error);
      toast.error('No se pudo subir el archivo')
    }
    finally{

      toast.success('Archivo cargado correctamente')
    }
  };

  return (
    <div className="flex flex-col items-center px-6 mt-10 w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-center font-cinzel text-2xl text-primario font-semibold flex justify-center items-center gap-2">
        MI PERFIL <CgProfile />
      </h1>

      <div className="relative mt-5">
        <img
          src={userData.profileImage}
          alt={userData.name}
          className="w-32 h-32 rounded-full border-4 border-accent shadow-lg object-cover"
        />
        <label className="absolute bottom-2 right-2 text-xl text-softBlue cursor-pointer">
          <FaEdit />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      <input
        type="text"
        name="name"
        value={userData.name}
        onChange={handleChange}
        className="text-xl font-cinzel mt-3 text-softBlue font-medium text-center border-b-2 focus:outline-none focus:border-accent"
      />

      <textarea
        name="description"
        value={userData.description}
        onChange={handleChange}
        className="text-center text-gray-600 mt-2 w-full p-2 border rounded-md focus:outline-none focus:border-accent"
        rows={3}
      />

      <div className="mt-6 w-full max-w-md bg-white rounded-lg p-4 shadow-lg">
        <h3 className="text-lg text-gray-700 font-semibold mb-4">Servicios</h3>
        <div className="flex overflow-x-auto space-x-4">
          {userData.services.map((service, index) => (
            <div
              key={index}
              className="p-4 border rounded-md flex   justify-center items-center gap-5 shadow-md hover:shadow-lg transition-all min-w-[200px]"
            >
              <h4 className="text-md font-semibold text-accent">{service.name || "Nombre del servicio"}</h4>
              <button
                onClick={() => removeService(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {showAddServiceForm ? (
          <div className="mt-4">
            <input
              type="text"
              name="name"
              value={newService.name}
              onChange={handleServiceInputChange}
              placeholder="Nombre del servicio"
              className="w-full mb-2 border-b-2 p-2 focus:outline-none focus:border-accent"
            />
            <textarea
              name="description"
              value={newService.description}
              onChange={handleServiceInputChange}
              placeholder="Descripción"
              className="w-full mb-2 border-b-2 p-2 focus:outline-none focus:border-accent"
            />
            <input
              type="number"
              name="price"
              value={newService.price}
              onChange={handleServiceInputChange}
              placeholder="Precio"
              className="w-full mb-2 border-b-2 p-2 focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              name="link"
              value={newService.link}
              onChange={handleServiceInputChange}
              placeholder="Link (si aplica)"
              className="w-full mb-2 border-b-2 p-2 focus:outline-none focus:border-accent"
            />
            <input
  type="file"
  accept="application/pdf"
  onChange={handlePdfUpload}
  className="mb-2 p-2 border rounded-md shadow-lg bg-softBlue text-white w-[90%] "
/>

            <button
              onClick={handleAddServiceSubmit}
              className="mt-3 px-4 py-2 bg-primario text-white rounded-md shadow-md hover:bg-opacity-80"
            >
              Guardar servicio
            </button>
          </div>
        ) : (
          <button
            onClick={addService}
            className="flex items-center gap-2 text-softBlue mt-4 hover:underline"
          >
            <FaPlus /> Agregar servicio
          </button>
        )}
      </div>

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
