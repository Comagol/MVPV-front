import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { authService } from '../services';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

const AuthContext = createContext<{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
         const userData = sessionStorage.getItem('user');
         if (userData && userData !== 'null' && userData !== 'undefined') {
          setUser(JSON.parse(userData));
         }
        }
      } catch (error) {
        console.error('Error en checkAuth:', error);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userType');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response: AuthResponse = await authService.login(data);
      
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('userType', response.userType);
      
      // Guardar usuario según el tipo
      if (response.userType === 'admin' && response.admin) {
        sessionStorage.setItem('user', JSON.stringify(response.admin));
        setUser(response.admin);
      } else if (response.userType === 'user' && response.user) {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response: AuthResponse = await authService.userRegister(data);
      
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('userType', response.userType);
      
      if (response.userType === 'admin' && response.admin) {
        sessionStorage.setItem('user', JSON.stringify(response.admin));
        setUser(response.admin);
      } else if (response.userType === 'user' && response.user) {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userType');
    setUser(null);
  };

  const isAdmin = sessionStorage.getItem('userType') === 'admin';

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    login,
    register,
    logout,
  }), [user, isLoading, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};