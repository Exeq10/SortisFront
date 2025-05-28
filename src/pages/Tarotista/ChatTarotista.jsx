import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Client as TwilioChatClient } from '@twilio/conversations';
import Api from '../../utils/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdMonochromePhotos } from "react-icons/md";

const ChatTarotista = () => {
  // Hook para obtener los parámetros de la URL
  const [searchParams] = useSearchParams();

  // Estados del componente
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const oneMinuteWarned = useRef(false);
  const messagesEndRef = useRef(null);

  // Parámetros de la URL
  const conversationSid = searchParams.get('conversationSid');
  const identity = searchParams.get('identity');
  const user = searchParams.get('user');
  const nameTarotista = searchParams.get('nameTarotista');

  const chatActive = timeLeft > 0;

  // Inicializa el cliente de Twilio y la conversación
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
          // Podrías renovar el token aquí si lo deseas
        });

        const conv = await client.getConversationBySid(conversationSid);

        // Cuando llega un mensaje nuevo, lo agregamos al estado
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

  // Contador de tiempo de 5 minutos (no se muestra en la UI, solo notifica)
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

  // Envía un mensaje de texto
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

  // Envía una imagen
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !conversation || !chatActive) return;

    try {
      await conversation.sendMessage({ contentType: file.type, media: file });
    } catch (err) {
      console.error('Error enviando imagen:', err);
    }
  };

  // Scroll automático hacia el último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Si hay error, lo mostramos
  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;
  if (!conversation) return <p className="text-center mt-4">Conectando al chat...</p>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 to-green-100 font-sans">
      
      {/* Header superior con nombre del usuario */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-highlight text-white text-xl font-bold shadow-md tracking-wide flex justify-between items-center">
        <span>{user}</span>
        {/* Ya no se muestra el contador aquí */}
      </div>

      <ToastContainer />

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => {
          const isUser = msg.author === identity;
          const isImage = msg.type === 'media';

          return (
            <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                  isUser ? 'bg-highlight text-white' : 'bg-purple-200 text-gray-800'
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {isUser ? 'Tú' : nameTarotista}
                </div>
                {isImage ? (
                  <img
                    src={msg.media.getContentTemporaryUrl()}
                    alt="Imagen enviada"
                    className="max-w-full h-auto rounded"
                  />
                ) : (
                  msg.body
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulario de envío de mensajes y botón para subir imagen */}
      <form onSubmit={sendMessage} className="flex items-center p-4 bg-white border-t border-purple-200">
        <input
          type="text"
          placeholder={chatActive ? 'Escribe tu mensaje...' : 'El tiempo ha terminado'}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!chatActive}
          className="flex-1 p-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
       <label className="ml-2 cursor-pointer">
  <span
    className={`inline-flex items-center w-10 justify-center p-2 rounded-lg ${
      chatActive ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    } transition duration-200`}
    title="Enviar imagen"
  >
    <MdMonochromePhotos />
  </span>
  <input
    type="file"
    accept="image/*"
    onChange={handleSendImage}
    disabled={!chatActive}
    className="hidden"
  />
</label>
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
