import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosts } from "../../redux/postSlice";
import Api from "../../utils/API";
import { Link } from "react-router-dom";

function BlogPosts() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${Api}post/`);
        if (!response.ok) throw new Error("Error al obtener posts");
        const data = await response.json();
        dispatch(setPosts(data || []));
      } catch (error) {
        console.error("Error al obtener posts:", error.message);
      }
    };

    if (posts.length === 0) {
      fetchPosts();
    }
  }, [dispatch]);

  const postsOrdenados = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-cinzel text-accent mb-10 text-center">Blog de Novedades</h1>
      <div className="grid gap-10">
       
        {postsOrdenados.length > 0 ? ( postsOrdenados.map((post) => (
          <div
            key={post._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {post.imagen && (
              <img
                src={post.imagen}
                alt={post.titulo}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <div className="text-sm text-gray-500 mb-2">
                Publicado por{" "}
                <span className="font-medium text-gray-700">
                  {post.nameUser || "Anónimo"}
                </span>{" "}
                el{" "}
                {new Date(post.createdAt).toLocaleDateString("es-UY", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <h2 className="text-2xl font-semibold text-accent mb-3">{post.titulo}</h2>
              <p className="text-gray-700 mb-4 line-clamp-4">
                {post.texto.slice(0, 300)}...
              </p>
              <div className="flex justify-end mt-4">
                    <Link
                      to={`/post/${post._id}`}
                      className="px-4 py-2 text-sm font-semibold border-2 border-accent bg-accent text-white rounded-md hover:bg-highlight transition duration-300"
                    >
                      Leer más
                    </Link>
                  </div>
            </div>
          </div>
        )) )  : <p className=" text-center">No hay posts en este momento ...</p>}


      </div>
    </div>
  );
}

export default BlogPosts;
