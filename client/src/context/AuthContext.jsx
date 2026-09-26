import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('kabir_admin_token'));
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('kabir_admin_token');
    setToken(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    api
      .get('/auth/me')
      .then((data) => setAdmin(data.admin))
      .catch(() => logout())
      .finally(() => setChecking(false));
  }, [token, logout]);

  const login = async (username, password) => {
    const data = await api.post('/auth/login', { username, password });
    localStorage.setItem('kabir_admin_token', data.token);
    setToken(data.token);
    setAdmin(data.admin);
    return data;
  };

  return (
    <AuthContext.Provider value={{ token, admin, checking, login, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
