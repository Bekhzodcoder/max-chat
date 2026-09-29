import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const addChat = useCallback((phone, name) => {
    const chatId = phone.replace(/\D/g, '');
    setChats(prev => {
      if (prev.find(c => c.chatId === chatId)) return prev;
      return [...prev, { chatId, name: name || phone, lastMessage: '', time: '' }];
    });
    setActiveChat(chatId);
    return chatId;
  }, []);

  const updateLastMessage = useCallback((chatId, text, time) => {
    setChats(prev =>
      prev.map(c =>
        c.chatId === chatId ? { ...c, lastMessage: text, time } : c
      )
    );
  }, []);

  return (
    <ChatContext.Provider value={{ chats, activeChat, setActiveChat, addChat, updateLastMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
