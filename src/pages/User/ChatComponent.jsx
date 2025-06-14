import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initializeChatClient } from '../../utils/chatService';
import Api from '../../utils/API';
import { toast, ToastContainer } from 'react-toastify';
import { enviarNotificacion } from '../../utils/notifications';
const ChatComponent = () => {
  const navigate = useNavigate(); // ➤ Para redirigir al dashboard al finalizar el chat

  // ⚙️ Datos del usuario
  const user = JSON.parse(localStorage.getItem('user'));
  const identity = user?.name || 'desconocido';
  const image = user?.image || '/avatar.png';

  // 📦 Estados del componente
  const [token, setToken] = useState(null);
  const [conversationSid, setConversationSid] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [friendlyName, setFriendlyName] = useState('');
  const [timeLeft, setTimeLeft] = useState(parseInt(localStorage.getItem('chatDuracionPlan')) || 300);
  const [chatActive, setChatActive] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);
  const [nameTarotista, setNameTarotista] = useState('');

  const oneMinuteWarned = useRef(false);
  const messagesEndRef = useRef(null);

  // 🛑 Previene recarga del componente (F5, Ctrl+R)
useEffect(() => {
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = '⚠️ Serás redirigido al inicio y perderás el tiempo de conversación con el tarotista. ¿Estás seguro de salir?';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
      e.preventDefault();
      toast.warning('No recargues la página: serás redirigido al inicio y perderás el tiempo de conversación con el tarotista.', {
        position: 'top-center',
        autoClose: 5000
      });
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('keydown', handleKeyDown);
  };
}, []);

  // 🔎 Obtener el perfil del tarotista por ID
  const getTarotistaIdentity = async () => {
    try {
      const res = await fetch(`${Api}users/findById`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: JSON.parse(localStorage.getItem('tarotistaSeleccionado'))._id }),
      });

      if (!res.ok) throw new Error('Error al obtener el perfil');
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // 🔁 Revisar si el chat ya estaba finalizado
  useEffect(() => {
    const finalizado = localStorage.getItem('chatFinalizado') === 'true';
    if (finalizado) {
      setTimeLeft(0);
      setChatActive(false);
    }
  }, []);

  // 🧩 Configuración inicial del chat
  useEffect(() => {
    const uniqueFriendlyName = [identity, Date.now()].join('_');
    setFriendlyName(uniqueFriendlyName);
    localStorage.removeItem('chatFinalizado');

    const fcmToken = localStorage.getItem('fcmToken');

    const setupConversation = async () => {
      const user = await getTarotistaIdentity();
      const tarotistaIdentity = user._id;
      setNameTarotista(user.name);

      try {
        const response = await fetch(`${Api}chat/conversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            friendlyName: uniqueFriendlyName,
            identity,
            image,
            tarotistaIdentity,
            fcmToken,
            nameTarotista: user.name,
          }),
        });

        if (!response.ok) throw new Error('Error creando conversación');
        const data = await response.json();
        setToken(data.twilioToken);
        setConversationSid(data.sid);
      } catch (error) {
        console.error('Error configurando conversación:', error);
      }
    };

    if (identity) {
      setupConversation();
    }
  }, [identity]);

  // 🧠 Inicializar cliente de Twilio
  useEffect(() => {
    const initializeClient = async () => {
      if (token && conversationSid) {
        try {
          const client = await initializeChatClient(token);
          client.on('tokenAboutToExpire', () => renewToken(client));
          client.on('tokenExpired', () => renewToken(client));

          let convo;
          try {
            convo = await client.getConversationBySid(conversationSid);
          } catch {
            convo = await client.peekConversationBySid(conversationSid);
          }

          convo.on('messageAdded', (message) => {
            setMessages((prev) => [...prev, message]);
            if (message.author !== identity && !timerStarted) {
              setTimerStarted(true); // ⏱️ Comienza el conteo al recibir mensaje del tarotista
            }
          });

          setChatClient(client);
          setConversation(convo);
        } catch (error) {
          console.error('Error inicializando cliente:', error);
        }
      }
    };

    initializeClient();
  }, [token, conversationSid, timerStarted]);

  // 🔄 Renovación automática del token de Twilio
  const renewToken = async (client) => {
    try {
      const response = await fetch(`${Api}chat/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity }),
      });

      if (!response.ok) throw new Error('Error renovando token');
      const data = await response.json();
      await client.updateToken(data.twilioToken);
    } catch (error) {
      console.error('Error renovando token:', error);
    }
  };

  // 💬 Envío de mensajes
  const sendMessage = async (e) => {
    e.preventDefault();
    if (conversation && newMessage.trim() !== '' && chatActive) {
      try {
        await conversation.sendMessage(newMessage);
        setNewMessage('');
      } catch (error) {
        console.error('Error enviando mensaje:', error);
      }
    }
  };

  // ⏱️ Timer de duración del chat
  useEffect(() => {
    if (!chatActive || !timerStarted) return;

    const timer = setInterval(async () => {
      setTimeLeft((prevTime) => {
        // ⏳ Aviso de 1 minuto restante
        if (prevTime === 61 && !oneMinuteWarned.current) {
          toast.warning('⏳ Queda 1 minuto de sesión.', {
            position: 'top-center',
            autoClose: 5000,
          });
          oneMinuteWarned.current = true;
        }

        // 🚫 Fin de tiempo
        if (prevTime <= 1) {
          clearInterval(timer);
          setChatActive(false);
          localStorage.setItem('chatFinalizado', 'true');

          // ✅ Enviar notificación al tarotista
          const tarotista = JSON.parse(localStorage.getItem('tarotistaSeleccionado'));
          enviarNotificacion(
            tarotista._id,
            '⏱️ Sesión finalizada',
            `El tiempo de conversación del usuario ${identity} ha finalizado.`,

            
            
          );

           // Redirigir al dashboard luego de unos segundos
           setTimeout(() => {
            navigate('/dashboard');
          }, 8000); 

          toast.info(
            <div>
              Gracias por comunicarte. <br />
              Para continuar deberás abonar nuevamente.{' '}
              <Link to="/selectPlan" className="underline text-blue-500">
                Ir a pagar
              </Link>
            </div>,
            {
              position: 'top-center',
              autoClose: false,
              closeOnClick: true,
            }
          );

          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [chatActive, timerStarted]);

  // 🔽 Auto-scroll de mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ⏰ Formatear minutos y segundos
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 🧱 Render del componente
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 to-green-100 font-sans">

   


      <div className="p-4 bg-gradient-to-r from-purple-600 to-highlight text-white text-xl font-bold shadow-md tracking-wide flex justify-between items-center">
       <div className='flex items-center justify-center gap-2'>
         <img className='md:w-20 md:h-20  w-10 h-10 rounded-full  border-2 md:border-4 border-green-500' src={JSON.parse(localStorage.getItem('tarotistaSeleccionado'))?.image || "/avatar.png" } alt="image"  />
        <span>{JSON.parse(localStorage.getItem('tarotistaSeleccionado'))?.name}</span>
       </div>
        <span className="text-sm font-medium bg-white text-purple-600 px-3 py-1 rounded">
          {chatActive ? `Tiempo restante: ${formatTime(timeLeft)}` : 'Tiempo finalizado'}
        </span>
      </div>

      <ToastContainer />

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.author === identity ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                msg.author === identity ? 'bg-highlight text-white' : 'bg-purple-200 text-gray-800'
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {msg.author === identity ? 'Tú' : nameTarotista}
              </div>
              {msg.body}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex items-center p-4 bg-white border-t border-purple-200">
        <input
          type="text"
          placeholder={chatActive ? 'Escribe tu mensaje...' : 'El tiempo ha terminado'}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!chatActive}
          className="flex-1 p-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          disabled={!chatActive}
          className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
