import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== '') {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Escribe tu mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 transition duration-200"
      >
        Enviar
      </button>
    </form>
  );
};

export default MessageInput;
