import { LuMessageCircleMore } from "react-icons/lu";

function ChatList() {


    const chatsData = [
        { id: 1, name: "Isabel Rodríguez", hasNewMessages: true },
        { id: 2, name: "Carlos Pérez", hasNewMessages: false },
        { id: 3, name: "Ana Gómez", hasNewMessages: true },
        { id: 4, name: "María López", hasNewMessages: false },
        { id: 5, name: "Juan Martínez", hasNewMessages: false },
        { id: 6, name: "Sofía Ramírez", hasNewMessages: true },
      ];
      

  return (
    <div className="flex flex-col items-center px-6 mt-10 w-full">
      <h1 className="text-center font-cinzel text-2xl gap-2 text-primario flex items-center justify-center  font-semibold">
        LISTADO DE CHATS   <LuMessageCircleMore  />
      </h1>
     
      <div className="w-full mt-5 flex flex-col gap-3">
        {chatsData.map((chat, index) => (
          <div
            key={index}
            className="relative bg-white border rounded-md px-4 py-2 shadow-md flex justify-between items-center"
          >
            <span className="text-lg text-gray-700">{chat.name}</span>
            {chat.unread && (
              <span className="absolute right-2 top-2 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;