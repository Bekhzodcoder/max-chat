import { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, onSend }) {
  const { activeChat, chats } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const activeInfo = chats.find(c => c.chatId === activeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeChat) {
    return (
      <div className="chat-window empty-window">
        <div className="welcome-screen">
          <div className="welcome-icon">
            <svg viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="40" fill="url(#wg)"/>
              <path d="M20 40C20 28.954 28.954 20 40 20s20 8.954 20 20-8.954 20-20 20c-3.692 0-7.15-1-10.127-2.75L20 60l2.75-9.873A19.927 19.927 0 0120 40z" fill="white" fillOpacity="0.9"/>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6C63FF"/>
                  <stop offset="1" stopColor="#3ECFCF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2>Добро пожаловать в MAX Chat</h2>
          <p>Выберите чат слева или создайте новый, чтобы начать общение</p>
          <div className="welcome-features">
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Безопасная связь</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Быстрые сообщения</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌐</span>
              <span>Через GREEN-API</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar large">
            {activeInfo?.name?.charAt(0)?.toUpperCase() || '#'}
          </div>
          <div>
            <h3 className="chat-contact-name">{activeInfo?.name || activeChat}</h3>
            <span className="chat-contact-phone">+{activeChat}</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <div className="online-badge">
            <span className="online-dot" />
            В сети
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-msg-icon">💬</div>
            <p>Сообщений пока нет</p>
            <span>Отправьте первое сообщение!</span>
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            className="message-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Написать сообщение... (Enter — отправить, Shift+Enter — новая строка)"
            rows={1}
          />
          <button
            className={`send-btn ${input.trim() ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
