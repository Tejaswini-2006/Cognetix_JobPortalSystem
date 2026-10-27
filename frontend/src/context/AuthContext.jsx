import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careerconnect_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('careerconnect_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify and refresh user info on initial load
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('careerconnect_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session invalid or expired.');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('careerconnect_token', res.data.token);
      localStorage.setItem('careerconnect_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('careerconnect_token', res.data.token);
      localStorage.setItem('careerconnect_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('careerconnect_token');
    localStorage.removeItem('careerconnect_user');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('careerconnect_user', JSON.stringify(merged));
      return merged;
    });
  };

  const isCandidate = user?.role === 'candidate';
  const isEmployer = user?.role === 'employer';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isCandidate,
        isEmployer,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
