import Api from "./API";

export async function enviarNotificacion(tarotistaIdentity, title, body, data = {}) {
  try {
    const response = await fetch(`${Api}tokens/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tarotistaIdentity,
        title,
        body,
        data,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar notificación');
    }

    const result = await response.json();
    console.log('Notificación enviada:', result);
    return result;
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    throw error;
  }
}