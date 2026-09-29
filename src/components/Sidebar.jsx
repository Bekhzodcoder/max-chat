import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import NewChatModal from './NewChatModal';

export default function Sidebar() {
  const { logout, credentials } = useAuth();
  const { chats, activeChat, setActiveChat } = useChat();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.chatId.includes(search)
  );

  return (
    <>
      <aside className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="url(#sg)"/>
                <path d="M10 20C10 14.477 14.477 10 20 10s10 4.477 10 10-4.477 10-10 10c-1.846 0-3.575-.5-5.063-1.375L10 30l1.375-4.937A9.963 9.963 0 0110 20z" fill="white"/>
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6C63FF"/>
                    <stop offset="1" stopColor="#3ECFCF"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="brand-name">MAX Chat</span>
          </div>
          <div className="sidebar-actions">
            <button className="icon-btn" title="Новый чат" onClick={() => setShowModal(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </button>
            <button className="icon-btn logout-btn" title="Выйти" onClick={logout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Instance info */}
        <div className="instance-info">
          <span className="instance-dot" />
          <span className="instance-id">#{credentials?.idInstance}</span>
        </div>

        {/* Search */}
        <div className="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Chat list */}
        <div className="chat-list">
          {filtered.length === 0 ? (
            <div className="empty-chats">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <p>Нет активных чатов</p>
              <span>Нажмите + чтобы начать новый чат</span>
            </div>
          ) : (
            filtered.map(chat => (
              <div
                key={chat.chatId}
                className={`chat-item ${activeChat === chat.chatId ? 'active' : ''}`}
                onClick={() => setActiveChat(chat.chatId)}
              >
                <div className="chat-avatar">
                  {chat.name.charAt(0).toUpperCase()}
                </div>
                <div className="chat-info">
                  <div className="chat-name-row">
                    <span className="chat-name">{chat.name}</span>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <p className="chat-last">{chat.lastMessage || 'Начать переписку...'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {showModal && <NewChatModal onClose={() => setShowModal(false)} />}
    </>
  );
}
