export default function MessageBubble({ message }) {
  const { text, time, outgoing, status } = message;

  return (
    <div className={`message-row ${outgoing ? 'outgoing' : 'incoming'}`}>
      {!outgoing && (
        <div className="msg-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      )}
      <div className="bubble-wrapper">
        <div className={`bubble ${outgoing ? 'bubble-out' : 'bubble-in'}`}>
          <p className="bubble-text">{text}</p>
          <div className="bubble-meta">
            <span className="bubble-time">{time}</span>
            {outgoing && (
              <span className={`bubble-status status-${status}`}>
                {status === 'sending' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="status-icon spin">
                    <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="15"/>
                  </svg>
                )}
                {status === 'sent' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="status-icon">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {status === 'error' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="status-icon error">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
