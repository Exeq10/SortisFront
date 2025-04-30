import { useEffect, useState, useRef } from 'react';
import { initializeChatClient } from '../../utils/chatService';
import Api from '../../utils/API';

const ChatComponent = () => {
  const identity = 'user123'; // Cambiar por el usuario autenticado

  const [token, setToken] = useState(null);
  const [conversationSid, setConversationSid] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef(null);

  // Crear o recuperar la conversación y token
  useEffect(() => {
    const setupConversation = async () => {
      try {
        const response = await fetch(`${Api}chat/conversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ friendlyName: 'Prueba', identity }),
        });

        if (!response.ok) throw new Error('Error creando conversación');

        const data = await response.json();

        console.log('Conversación creada o recuperada:', data);
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

  // Inicializar cliente y suscribirse a eventos
  useEffect(() => {
    const initializeClient = async () => {
      if (token && conversationSid) {
        try {
          const client = await initializeChatClient(token);

          console.log('Cliente de chat inicializado:', client);

          client.on('connectionStateChanged', (state) => {
            console.log('Estado de la conexión:', state);
          });
          
          client.on('tokenAboutToExpire', () => renewToken(client));
          client.on('tokenExpired', () => renewToken(client));

          const convo = await client.getConversationBySid(conversationSid);

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

  // Renovar token
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

  // Enviar mensaje
  const sendMessage = async (e) => {
    e.preventDefault();
    if (conversation && newMessage.trim() !== '') {
      try {
        await conversation.sendMessage(newMessage);
        setNewMessage('');
      } catch (error) {
        console.error('Error enviando mensaje:', error);
      }
    }
  };

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-blue-600 text-white text-xl font-bold">
        Chat
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.author === identity ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.author === identity ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.body}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex items-center p-4 bg-white border-t">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
