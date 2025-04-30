import { useEffect, useState } from 'react';
import { initializeChatClient } from '../../utils/chatService';
import Api from '../../utils/API';

const TarotistaChatComponent = ({ conversationSid, identity }) => {
  const [token, setToken] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchTokenAndJoinConversation = async () => {
      try {
        // Generar token para el tarotista
        const response = await fetch(`${Api}chat/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identity }),
        });

        if (!response.ok) throw new Error('Error obteniendo token para el tarotista');
        
        const data = await response.json();
        setToken(data.twilioToken); // Guardar el token del tarotista

        // Inicializar el cliente de chat
        const client = await initializeChatClient(data.twilioToken);
        setChatClient(client);

        // Obtener la conversación por SID
        const convo = await client.getConversationBySid(conversationSid);
        setConversation(convo);

        // Suscribirse a los mensajes nuevos
        convo.on('messageAdded', (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
        
        // Unirse a la conversación
        await convo.addParticipant(identity);
      } catch (error) {
        console.error('Error al unirse a la conversación:', error);
      }
    };

    if (identity && conversationSid) {
      fetchTokenAndJoinConversation();
    }
  }, [identity, conversationSid]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const newMessage = e.target.elements.message.value;
    if (conversation && newMessage.trim() !== '') {
      try {
        await conversation.sendMessage(newMessage);
        e.target.elements.message.value = ''; // Limpiar el campo de texto
      } catch (error) {
        console.error('Error enviando mensaje:', error);
      }
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.author}:</strong> {msg.body}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input type="text" name="message" placeholder="Escribe tu mensaje..." />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default TarotistaChatComponent;
