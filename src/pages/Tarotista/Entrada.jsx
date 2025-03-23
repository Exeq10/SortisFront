import { useState } from "react";
import { FaRegFileAlt, FaImage } from "react-icons/fa";

const PostEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!title || !content) {
      alert("El título y el contenido son obligatorios.");
      return;
    }

    const postData = { title, content, image };

    try {
      const response = await fetch("https://tu-api.com/publicar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert("Entrada publicada con éxito");
        setTitle("");
        setContent("");
        setImage(null);
      } else {
        alert("Hubo un error al publicar la entrada");
      }
    } catch (error) {
      console.error("Error al enviar la publicación:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border rounded-md shadow-lg bg-white">
      <h1 className="text-center font-cinzel text-2xl flex items-center justify-center text-primario font-semibold gap-2">
        Crear nueva entrada <FaRegFileAlt />
      </h1>

      {/* Título de la entrada */}
      <input
        type="text"
        placeholder="Título de la entrada"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md text-lg font-semibold mt-6"
      />

      {/* Contenido de la entrada */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe el contenido de tu entrada..."
        className="w-full p-2 border rounded-md mt-4 min-h-[150px]"
      />

      {/* Botón de Subir Imagen */}
      <div className="mt-4 flex flex-col items-center">
        <label
          htmlFor="imageUpload"
          className="flex items-center gap-2 bg-softBlue text-white px-4 py-2 rounded-md cursor-pointer hover:bg-accent transition"
        >
          <FaImage /> Subir Imagen
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Botón de Publicar */}
      <button
        className="mt-6 w-full bg-accent text-white p-3 rounded-md hover:bg-softBlue transition font-semibold"
        onClick={handlePublish}
      >
        Publicar Entrada
      </button>
    </div>
  );
};

export default PostEditor;
