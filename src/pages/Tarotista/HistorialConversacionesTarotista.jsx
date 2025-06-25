import { useEffect, useState } from 'react';
import Api from '../../utils/API';

const CONVERSATIONS_PER_PAGE = 5;

const HistorialConversacionesTarotista = () => {
  const [conversations, setConversations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tarotista = JSON.parse(localStorage.getItem('Tarotista'));
  const identity = tarotista?.name;

  const fetchConversations = async (forceRefresh = false) => {
    try {
      console.log('🚀 Iniciando carga de conversaciones...');
      setLoading(true);

      if (!forceRefresh) {
        const cached = localStorage.getItem(`conversations-${identity}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          setConversations(parsed);
          setFiltered(parsed);
          console.log('✅ Conversaciones cargadas desde cache.');
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`${Api}chat/user-conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al obtener las conversaciones');

      const ordered = data.conversations
        .filter((conv) =>
          conv.friendlyName.toLowerCase().includes(identity.toLowerCase())
        )
        .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

      setConversations(ordered);
      setFiltered(ordered);
      localStorage.setItem(`conversations-${identity}`, JSON.stringify(ordered));
      console.log('✅ Conversaciones obtenidas y almacenadas correctamente.');
    } catch (err) {
      console.error('❌ Error cargando conversaciones:', err);
    } finally {
      setLoading(false);
      console.log('🏁 Fin de la carga de conversaciones.');
    }
  };

  useEffect(() => {

    console.log(identity ? `🔍 Cargando conversaciones para: ${identity}` : '🔍 No hay identidad definida');
    
    if (identity) fetchConversations();
  }, [identity]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const result = conversations.filter((conv) =>
      conv.friendlyName.toLowerCase().includes(lowerSearch)
    );
    setFiltered(result);
    setCurrentPage(1);
  }, [search, conversations]);

  const formatDate = (date) => new Date(date).toLocaleString();

  const totalPages = Math.ceil(filtered.length / CONVERSATIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * CONVERSATIONS_PER_PAGE;
  const currentConversations = filtered.slice(startIndex, startIndex + CONVERSATIONS_PER_PAGE);

  const handleRefresh = () => {
    localStorage.removeItem(`conversations-${identity}`);
    fetchConversations(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center flex-col justify-between mb-4">
        <h2 className="text-2xl font-bold text-accent">Historial de conversaciones</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-softBlue  text-white mt-4 rounded hover:bg-purple-600 transition"
        >
          🔄 Recargar historial
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre de cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border border-purple-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      {loading ? (
        <p className="text-gray-500">Cargando conversaciones...</p>
      ) : currentConversations.length === 0 ? (
        <p className="text-gray-500">No hay conversaciones encontradas.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentConversations.map((conv, index) => (
              <li
                key={index}
                className="p-4 border border-purple-300 rounded-lg shadow bg-white flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg text-purple-600">{conv.friendlyName}</h3>
                  <p className="text-sm text-gray-700">Último mensaje: {conv.lastMessage}</p>
                  <p className="text-xs text-gray-500">Fecha: {formatDate(conv.lastMessageDate)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-purple-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-purple-700 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-purple-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HistorialConversacionesTarotista;
