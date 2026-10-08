import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cocoa_bliss_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cocoa_bliss_token') || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('cocoa_bliss_user', JSON.stringify(freshUser));
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('cocoa_bliss_token');
          localStorage.removeItem('cocoa_bliss_user');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('cocoa_bliss_token', res.token);
    localStorage.setItem('cocoa_bliss_user', JSON.stringify(res.user));
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('cocoa_bliss_token', res.token);
    localStorage.setItem('cocoa_bliss_user', JSON.stringify(res.user));
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('cocoa_bliss_token');
      localStorage.removeItem('cocoa_bliss_user');
    }
  };

  const updateProfile = async (data: any) => {
    const res = await authService.updateProfile(data);
    setUser(res.user);
    localStorage.setItem('cocoa_bliss_user', JSON.stringify(res.user));
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = !!user && (user.role === 'admin' || user.is_staff || user.is_superuser);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
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
