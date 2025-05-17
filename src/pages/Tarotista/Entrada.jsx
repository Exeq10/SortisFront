import { useState, useEffect } from "react";
import { FaRegFileAlt, FaImage } from "react-icons/fa";
import Api from "../../utils/API";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "../../redux/postSlice"; 
import PostPublics from "../../components/PostPublics";
import { toast, ToastContainer } from "react-toastify";

const PostEditor = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.tarotista.token);
  const user_id = useSelector((state) => state.tarotista._id);
  const user_name = useSelector((state) => state.tarotista.name);
  const posts = useSelector((state) => state.posts); 

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [id, setId] = useState(null); 

  useEffect(() => {
    getPosts();
  }, [user_id, token]);

  const getPosts = async () => {
    try {
      const response = await fetch(`${Api}post/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      
      dispatch(setPosts(data || [])); // Guardamos en Redux
      console.log("Entradas publicadas:", data);
    } catch (error) {
      console.error("Error al cargar las entradas:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Sortis");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwg5nklfq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setImageURL(data.secure_url);
    } catch (error) {
      console.error("Error subiendo imagen a Cloudinary:", error);
      toast.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !content || !imageURL) {
      toast.error("Todos los campos son obligatorios, incluyendo la imagen.");
      return;
    }

    const postData = {
      titulo: title,
      imagen: imageURL,
      texto: content,
      usuario: user_id,
      nameUser: user_name,
    };

    try {
      const url = editando ? `${Api}post/${id}` : `${Api}post/create`;
      const method = editando ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success(editando ? "Entrada editada con éxito" : "Entrada publicada con éxito");
        resetForm();
        await reloadUserPosts();
      } else {
        toast.error("Hubo un error al guardar la entrada");
      }
    } catch (error) {
      console.error("Error al enviar la publicación:", error);
      toast.error("Error de conexión con el servidor");
    }
  };

  const reloadUserPosts = async () => {
    try {
      const updatedPosts = await fetch(`${Api}post/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedPosts.json();
      dispatch(setPosts(updatedData || [])); // Actualizamos el store
    } catch (error) {
      console.error("Error al recargar entradas:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImagePreview(null);
    setImageURL(null);
    setEditando(false);
    setId(null);
  };

  const handleEditPost = (post) => {
    setTitle(post.titulo);
    setContent(post.texto);
    setImagePreview(post.imagen);
    setImageURL(post.imagen);
    setEditando(true);
    setId(post._id);
  };


  const handleDeletePost = async (postId) => {

    console.log(token);
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta entrada?")) return;
  
    try {
      const response = await fetch(`${Api}post/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        toast.success("Entrada eliminada correctamente");
        await reloadUserPosts(); // actualiza el listado
      } else {
        toast.error("Error al eliminar la entrada");
        console.log(response);
      }
    } catch (error) {
      console.error("Error al eliminar entrada:", error);
      toast.error("Error de conexión con el servidor");
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto p-6 border rounded-md shadow-lg bg-white">
      <ToastContainer/>
      <h1 className="text-center font-cinzel text-2xl flex items-center justify-center text-primario font-semibold gap-2">
        {editando ? "Editar entrada" : "Crear nueva entrada"} <FaRegFileAlt />
      </h1>

      <input
        type="text"
        placeholder="Título de la entrada"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md text-lg font-semibold mt-6"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe el contenido de tu entrada..."
        className="w-full p-2 border rounded-md mt-4 min-h-[150px]"
      />

      <div className="mt-4 flex flex-col items-center">
        <label
          htmlFor="imageUpload"
          className="flex items-center gap-2 bg-softBlue text-white px-4 py-2 rounded-md cursor-pointer hover:bg-accent transition"
        >
          <FaImage /> {uploading ? "Subiendo..." : "Subir Imagen"}
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Vista previa"
            className="mt-4 max-h-60 rounded shadow"
          />
        )}
      </div>

      <button
        className="mt-6 w-full bg-yellow-600 text-white p-3 rounded-md hover:bg-softBlue transition font-semibold"
        onClick={handlePublish}
        disabled={uploading}
      >
        {uploading
          ? "Subiendo imagen..."
          : editando
          ? "Guardar cambios"
          : "Publicar Entrada"}
      </button>

      <PostPublics posts={posts} onEdit={handleEditPost} onDelete={handleDeletePost} />
    </div>
  );
};

export default PostEditor;
