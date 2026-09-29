import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { greenApi } from '../api/greenApi';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import '../styles/Chat.css';

export default function Chat() {
  const { credentials } = useAuth();
  const { activeChat, updateLastMessage } = useChat();
  const [messages, setMessages] = useState({});
  const pollingRef = useRef(null);
  const isPolling = useRef(false);

  const addMessage = useCallback((chatId, msg) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), msg],
    }));
  }, []);

  // Polling for incoming messages
  const poll = useCallback(async () => {
    if (isPolling.current) return;
    isPolling.current = true;
    try {
      const notification = await greenApi.receiveNotification(
        credentials.idInstance,
        credentials.apiTokenInstance
      );
      if (notification && notification.body) {
        const body = notification.body;
        const receiptId = notification.receiptId;

        // Handle incoming text messages
        if (
          body.typeWebhook === 'incomingMessageReceived' &&
          body.messageData?.typeMessage === 'textMessage'
        ) {
          const senderChatId = body.senderData?.chatId?.replace('@c.us', '');
          const text = body.messageData.textMessageData?.textMessage || '';
          const time = new Date(body.timestamp * 1000).toLocaleTimeString('ru-RU', {
            hour: '2-digit', minute: '2-digit'
          });

          if (senderChatId) {
            addMessage(senderChatId, {
              id: `${Date.now()}-in`,
              text,
              time,
              outgoing: false,
            });
            updateLastMessage(senderChatId, text, time);
          }
        }

        // Always delete the notification
        await greenApi.deleteNotification(
          credentials.idInstance,
          credentials.apiTokenInstance,
          receiptId
        );
      }
    } catch (err) {
      console.warn('Polling error:', err);
    } finally {
      isPolling.current = false;
    }
  }, [credentials, addMessage, updateLastMessage]);

  useEffect(() => {
    pollingRef.current = setInterval(poll, 3000);
    return () => clearInterval(pollingRef.current);
  }, [poll]);

  const handleSend = useCallback(async (text) => {
    if (!activeChat || !text.trim()) return;
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    const tempMsg = {
      id: `${Date.now()}-out`,
      text,
      time,
      outgoing: true,
      status: 'sending',
    };
    addMessage(activeChat, tempMsg);
    updateLastMessage(activeChat, text, time);

    try {
      await greenApi.sendMessage(
        credentials.idInstance,
        credentials.apiTokenInstance,
        activeChat,
        text
      );
      // Update status to sent
      setMessages(prev => ({
        ...prev,
        [activeChat]: (prev[activeChat] || []).map(m =>
          m.id === tempMsg.id ? { ...m, status: 'sent' } : m
        ),
      }));
    } catch (err) {
      console.error('Send failed:', err);
      setMessages(prev => ({
        ...prev,
        [activeChat]: (prev[activeChat] || []).map(m =>
          m.id === tempMsg.id ? { ...m, status: 'error' } : m
        ),
      }));
    }
  }, [activeChat, credentials, addMessage, updateLastMessage]);

  const activeChatMessages = messages[activeChat] || [];

  return (
    <div className="chat-layout">
      <Sidebar />
      <ChatWindow messages={activeChatMessages} onSend={handleSend} />
    </div>
  );
}
