import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function PostWiewUser({ posts = [] }) {
  return (
    <div className="w-full">
      {posts.length === 0 ? (
        <p className="text-gray-500">Aún no hay ninguna entrada.</p>
      ) : (
        <div className="overflow-x-auto py-4 px-1 scrollbar-hide">
          <div className="flex gap-6">
            {posts.map((post) => (
          
              <div
                key={post._id}
                className="flex flex-col w-[320px] flex-shrink-0 border border-gray-300 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-transform hover:scale-105"
              >
                {/* Imagen */}
                {post.imagen && (
                  <img
                    src={post.imagen}
                    alt={post.titulo}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Contenido */}
                <div className="flex flex-col flex-1 p-4">
                  {/* Título */}
                  <h2 className="text-xl font-bold text-primario mb-2 line-clamp-2">
                    {post.titulo}
                  </h2>

                  {/* Texto */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                    {post.texto.slice(0, 250)}...
                  </p>

                  {/* Autor y Fecha */}
                  <div className="mt-auto text-xs text-gray-500">
                    <p className="mb-1">
                      Publicado por: <span className="font-semibold">{post.nameUser || 'Anónimo'}</span>
                    </p>
                    <p>
                      {post.createdAt
                        ? format(new Date(post.createdAt), "dd/MM/yyyy HH:mm", { locale: es })
                        : 'Fecha desconocida'}
                    </p>
                  </div>

                  {/* Botón */}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostWiewUser;
