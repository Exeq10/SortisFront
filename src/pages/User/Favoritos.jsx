import { useSelector, useDispatch } from "react-redux";
import { removeFavorito } from "../../redux/favoritosSlice";


function Favoritos() {
  const dispatch = useDispatch();
  const favoritos = useSelector((state) => state.favoritos);
  const tarotistas = useSelector((state) => state.tarotistas);

  

  const favoritosData = tarotistas.filter((t) => favoritos.includes(t._id));

 
  return (
    <div className="p-4 justify-center items-center">
      <h2 className="font-cinzel text-2xl mb-4">Mis favoritos</h2>
      {favoritosData.length === 0 ? (
        <p className="text-gray-500">No tienes favoritos aún.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {favoritosData.map((t) => (
            <div
              key={t._id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
            >
              {t.image && (
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mb-2"
                />
              )}
              <span className="text-primario font-cinzel">{t.name}</span>

              <button
                onClick={() => dispatch(removeFavorito(t._id))}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                Quitar de favoritos
              </button>

           
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoritos;
