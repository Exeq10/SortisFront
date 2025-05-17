// eslint-disable-next-line react/prop-types
function PostPublics({ posts, onEdit  }) {
  const handlePreview = (post) => {
    alert(`📌 Vista previa:\n\nTítulo: ${post.titulo}\n\nContenido:\n${post.texto}`);
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primario">Entradas Publicadas</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">Aún no has publicado ninguna entrada.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border border-gray-200 p-4 rounded-lg shadow-md bg-white transition-transform hover:scale-[1.01]"
            >
              {post.imagen && (
                <img
                  src={post.imagen}
                  alt={post.titulo}
                  className="mt-3 max-h-48 w-full object-cover rounded-md shadow"
                />
              )}

              <h3 className="text-xl font-semibold text-primario">{post.titulo}</h3>
              <p className="mt-3 text-gray-700">{post.texto.slice(0, 200)}...</p>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => handlePreview(post)}
                  className="px-4 py-1 bg-softBlue text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Previsualizar
                </button>

                <button
                  onClick={() => onEdit(post)}
                  className="px-4 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                >
                  Editar
                </button>

             
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostPublics;
