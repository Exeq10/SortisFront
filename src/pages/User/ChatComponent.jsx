import { useEffect, useState, useRef } from 'react';
import { initializeChatClient } from '../../utils/chatService';
import Api from '../../utils/API';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

const ChatComponent = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const tarotista = JSON.parse(localStorage.getItem('tarotistaSeleccionado'));

  const identity = user?.name || 'desconocido';
  const nameTarotista = tarotista?.name || 'tarotista';
  const [token, setToken] = useState(null);
  const [conversationSid, setConversationSid] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [friendlyName, setFriendlyName] = useState('');
  const [timeLeft, setTimeLeft] = useState(Number(localStorage.getItem('chatDuracionPlan')) || 300);
  const [chatActive, setChatActive] = useState(true);
  const oneMinuteWarned = useRef(false);
  const messagesEndRef = useRef(null);

  const getTarotistaIdentity = async () => {


    
    try {
      const res = await fetch(`${Api}users/find`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: JSON.parse(localStorage.getItem('Tarotista'))?.email }),

      });

      if (!res.ok) throw new Error('Error al obtener el perfil');

      const data = await res.json();
      return [data._id, data.name];
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
  };

  useEffect(() => {
    const finalizado = localStorage.getItem('chatFinalizado') === 'true';
    if (finalizado) {
      setTimeLeft(0);
      setChatActive(false);
    }
  }, []);

  useEffect(() => {
    const uniqueFriendlyName = [identity, Date.now()].join('_');
    setFriendlyName(uniqueFriendlyName);
    localStorage.removeItem('chatFinalizado');

    const fcmToken = localStorage.getItem('fcmToken');

    const setupConversation = async () => {
      const tarotistaIdentity = await getTarotistaIdentity();
      if (!tarotistaIdentity) return;

      try {
        const response = await fetch(`${Api}chat/conversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            friendlyName: uniqueFriendlyName,
            identity,
            tarotistaIdentity,
            fcmToken,
            nameTarotista,
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
          });

          setChatClient(client);
          setConversation(convo);
        } catch (error) {
          console.error('Error inicializando cliente:', error);
        }
      }
    };

    initializeClient();
  }, [token, conversationSid]);

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

  useEffect(() => {
    if (!chatActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 61 && !oneMinuteWarned.current) {
          toast.warning('⏳ Queda 1 minuto de sesión.', {
            position: 'top-center',
            autoClose: 5000,
          });
          oneMinuteWarned.current = true;
        }

        if (prevTime <= 1) {
          clearInterval(timer);
          setChatActive(false);
          localStorage.setItem('chatFinalizado', 'true');

          toast.info(
            <div>
              Gracias por comunicarse. <br />
              Para continuar deberá abonar nuevamente.{' '}
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
  }, [chatActive]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 to-green-100 font-sans">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-highlight text-white text-xl font-bold shadow-md tracking-wide flex justify-between items-center">
        <span>{tarotista?.name || 'Tarotista'}</span>
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
              <div className="text-sm font-semibold mb-1">{msg.author}</div>
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
