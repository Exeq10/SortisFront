import { Client as ConversationsClient } from '@twilio/conversations';

export const initializeChatClient = async (token) => {
  try {
    const conversationsClient = await new ConversationsClient(token);
    console.log('🟢 Cliente de chat inicializado',conversationsClient);
    return conversationsClient;
  } catch (error) {
    console.error('❌ Error inicializando cliente de chat:', error);
    if (error.code === 21205) {
      console.error('El token es inválido o ha expirado');
    }
    throw error;
  }

  
};
