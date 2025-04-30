import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Api from "../utils/API";
import Goback from "./Goback";

function PostDetail() {
  const { id } = useParams();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.user.token);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const response = await fetch(`${Api}post/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        console.log(response);


        if (!response.ok) {
          throw new Error("No se pudo obtener el post");
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error al obtener el post:", error.message);
      }
    };

    const foundPost = posts.find((p) => p._id === id);

    if (foundPost) {
      setPost(foundPost);
    } else {
      fetchPostById();
    }
  }, [id, posts, token]);

  if (!post) {
    return (
      <div className="text-center py-10 text-gray-500 font-cinzel text-lg">
        Cargando entrada...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl px-4">
      {post.imagen && (
        <img
          src={post.imagen}
          alt={post.titulo}
          className="w-full h-96 object-cover rounded-2xl mb-8"
        />
      )}

      <h1 className="text-center text-4xl md:text-5xl font-bold text-primario mb-6 leading-tight">
        {post.titulo}
      </h1>

      <div className="text-center text-sm text-gray-500 mb-10">
        Publicado por{" "}
        <span className="font-semibold">
          {post.usuario?.nombre || "Anónimo"}
        </span>{" "}
        el{" "}
        {post.createdAt
          ? format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })
          : "Fecha desconocida"}
      </div>

      
  <p className="text-center">{post.texto}</p>



      <Goback/>
    </div>
  );
}

export default PostDetail;
