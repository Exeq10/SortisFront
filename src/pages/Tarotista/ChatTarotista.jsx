import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Client as TwilioChatClient } from '@twilio/conversations';
import Api from '../../utils/API';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdMonochromePhotos } from "react-icons/md";

const ChatTarotista = () => {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [mediaUrls, setMediaUrls] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [timerActivo, setTimerActivo] = useState(false);
  const messagesEndRef = useRef(null);

  const conversationSid = searchParams.get('conversationSid');
  const identity = searchParams.get('identity');
  const image = searchParams.get('image');
  const user = searchParams.get('user');
  const nameTarotista = searchParams.get('nameTarotista');
  const tiempoPlan = parseInt(searchParams.get('tiempoPlan'), 10);

  const identityMap = {
    [identity]: user,
    [nameTarotista]: nameTarotista,
  };

  useEffect(() => {
    const chatActivo = localStorage.getItem('chatActivo') === 'true';
    const tiempoGuardado = parseInt(localStorage.getItem('tiempoChat'), 10);
    const paramsGuardados = localStorage.getItem('chatParams');

    if (chatActivo && tiempoGuardado > 0 && paramsGuardados) {
      window.location.href = `/sala/tarotista${paramsGuardados}`;
    }
  }, []);

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
        const conv = await client.getConversationBySid(conversationSid);

        conv.on('messageAdded', async (msg) => {
          if (msg.type === 'media') {
            try {
              const url = await msg.media.getContentTemporaryUrl();
              setMediaUrls((prev) => ({ ...prev, [msg.sid]: url }));
            } catch (err) {
              console.error('Error obteniendo imagen:', err);
            }
          }
          setMessages((prev) => [...prev, msg]);

          if (!timerActivo && msg.author !== identity) {
            setTiempoRestante(tiempoPlan);
            setTimerActivo(true);
          }
        });

        const msgsPaginator = await conv.getMessages();
        setMessages(msgsPaginator.items);

        for (const msg of msgsPaginator.items) {
          if (msg.type === 'media') {
            try {
              const url = await msg.media.getContentTemporaryUrl();
              setMediaUrls((prev) => ({ ...prev, [msg.sid]: url }));
            } catch (err) {
              console.error('Error obteniendo URL de media inicial:', err);
            }
          }
        }

        setConversation(conv);
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar al chat.');
      }
    };

    initChat();
  }, [conversationSid, identity]);

  useEffect(() => {
    if (!timerActivo || tiempoRestante === null) return;

    const interval = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActivo(false);
          localStorage.removeItem('chatActivo');
          localStorage.removeItem('tiempoChat');
          localStorage.removeItem('chatParams');
          alert('⏱️ La sesión ha finalizado.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActivo]);

  useEffect(() => {
    if (timerActivo && tiempoRestante !== null) {
      localStorage.setItem('tiempoChat', tiempoRestante);
      localStorage.setItem('chatActivo', 'true');
      localStorage.setItem('chatParams', window.location.search);
    }
  }, [tiempoRestante, timerActivo]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (tiempoRestante > 0 && timerActivo) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [tiempoRestante, timerActivo]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    try {
      await conversation.sendMessage(newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Error enviando mensaje:', err);
    }
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !conversation) return;

    try {
      await conversation.sendMessage({ contentType: file.type, media: file });
    } catch (err) {
      console.error('Error enviando imagen:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;
  if (!conversation) return <p className="text-center mt-4">Conectando al chat...</p>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 to-green-100 font-sans">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-highlight text-white text-xl font-bold shadow-md tracking-wide flex justify-start gap-5 items-center">
        <img className='md:w-20 md:h-20 bg-white w-10 h-10 rounded-full border-2 md:border-4 border-green-500' src={image} alt="avatar" />
        <span>{user}</span>
      </div>

      {tiempoRestante !== null && (
        <div className="text-center text-sm bg-white text-purple-700 p-2">
          Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}
        </div>
      )}

      <ToastContainer />

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => {
          const isUser = msg.author === identity;
          const isImage = msg.type === 'media';
          const imageUrl = mediaUrls[msg.sid];

          return (
            <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${isUser ? 'bg-highlight text-white' : 'bg-purple-200 text-gray-800'}`}>
                <div className="text-sm font-semibold mb-1">
                  {identityMap[msg.author] || msg.author}
                </div>
                {isImage ? (
                  imageUrl ? (
                    <img src={imageUrl} alt="Imagen enviada" className="max-w-full h-auto rounded" />
                  ) : (
                    <p className="italic">Cargando imagen...</p>
                  )
                ) : (
                  msg.body
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex items-center p-4 bg-white border-t border-purple-200">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <label className="ml-2 cursor-pointer">
          <span className="inline-flex items-center w-10 justify-center p-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition duration-200" title="Enviar imagen">
            <MdMonochromePhotos />
          </span>
          <input type="file" accept="image/*" onChange={handleSendImage} className="hidden" />
        </label>
        <button type="submit" className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatTarotista;
