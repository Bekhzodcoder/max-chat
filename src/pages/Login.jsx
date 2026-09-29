import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { greenApi } from '../api/greenApi';
import '../styles/Login.css';

export default function Login() {
  const { login } = useAuth();
  const [idInstance, setIdInstance] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idInstance.trim() || !apiToken.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const state = await greenApi.getStateInstance(idInstance.trim(), apiToken.trim());
      if (state.stateInstance === 'authorized' || state.stateInstance === 'notAuthorized') {
        login(idInstance.trim(), apiToken.trim());
      } else {
        setError('Аккаунт не найден. Проверьте данные.');
      }
    } catch {
      setError('Неверные данные или ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb orb-1" />
        <div className="login-orb orb-2" />
        <div className="login-orb orb-3" />
      </div>
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="url(#grad)" />
              <path d="M10 20C10 14.477 14.477 10 20 10s10 4.477 10 10-4.477 10-10 10c-1.846 0-3.575-.5-5.063-1.375L10 30l1.375-4.937A9.963 9.963 0 0110 20z" fill="white"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6C63FF"/>
                  <stop offset="1" stopColor="#3ECFCF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="logo-text">MAX Chat</h1>
        </div>
        <p className="login-subtitle">Подключение через GREEN-API</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idInstance">ID Инстанса</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <input
                id="idInstance"
                type="text"
                value={idInstance}
                onChange={e => setIdInstance(e.target.value)}
                placeholder="Например: 1101234567"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="apiToken">API Токен Инстанса</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </span>
              <input
                id="apiToken"
                type="password"
                value={apiToken}
                onChange={e => setApiToken(e.target.value)}
                placeholder="Введите API токен"
                autoComplete="off"
              />
            </div>
          </div>

          {error && (
            <div className="error-msg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <span>Войти</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="login-hint">
          Зарегистрируйтесь на сайте GREEN-API и получите ID инстанса и API токен
        </p>
      </div>
    </div>
  );
}
