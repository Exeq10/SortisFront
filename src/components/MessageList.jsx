import React from 'react';

const MessageList = ({ messages, identity }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.sid}
          className={`flex ${msg.author === identity ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-xs px-4 py-2 rounded-lg text-white ${msg.author === identity ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <p className="text-sm">{msg.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
