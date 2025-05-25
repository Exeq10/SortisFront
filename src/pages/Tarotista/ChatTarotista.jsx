import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Client as TwilioChatClient } from '@twilio/conversations';
import Api from '../../utils/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatTarotista = () => {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [newMessage, setNewMessage] = useState('');
  const oneMinuteWarned = useRef(false);+
  const messagesEndRef = useRef(null);

  const conversationSid = searchParams.get('conversationSid');
  const identity = searchParams.get('identity');
  const user = searchParams.get('user');

  const chatActive = timeLeft > 0;

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  useEffect(() => {
    const initChat = async () => {
      if (!conversationSid || !identity) {
        setError('Faltan parámetros en el link.');
        return;
      }

      try {
        const res = await fetch(`${Api}chat/join-conversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationSid, identity }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al obtener token');

        const client = await TwilioChatClient.create(data.twilioToken);

        client.on('tokenAboutToExpire', async () => {
          // Podés renovar el token si querés
        });

        const conv = await client.getConversationBySid(conversationSid);

        conv.on('messageAdded', (msg) => {
          setMessages((prev) => [...prev, msg]);
        });

        const msgsPaginator = await conv.getMessages();
        setMessages(msgsPaginator.items);
        setConversation(conv);
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar al chat.');
      }
    };

    initChat();
  }, [conversationSid, identity]);

  // Temporizador de cuenta regresiva
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 61 && !oneMinuteWarned.current) {
          toast.warn('⏳ Queda 1 minuto de sesión.');
          oneMinuteWarned.current = true;
        }

        if (prevTime <= 1) {
          clearInterval(timer);
          toast.error('⏰ El tiempo ha terminado');
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !chatActive) return;

    try {
      await conversation.sendMessage(newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Error enviando mensaje:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;
  if (!conversation) return <p className="text-center mt-4">Conectando al chat...</p>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 to-green-100 font-sans">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-highlight text-white text-xl font-bold shadow-md tracking-wide flex justify-between items-center">
        <span>{user} </span>
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

export default ChatTarotista;
