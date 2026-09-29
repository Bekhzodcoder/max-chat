import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('greenapi_creds');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((idInstance, apiTokenInstance) => {
    const creds = { idInstance, apiTokenInstance };
    localStorage.setItem('greenapi_creds', JSON.stringify(creds));
    setCredentials(creds);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('greenapi_creds');
    setCredentials(null);
  }, []);

  return (
    <AuthContext.Provider value={{ credentials, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
