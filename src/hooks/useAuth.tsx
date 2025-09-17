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
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response: AuthResponse = await authService.userLogin(data);
      
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      sessionStorage.setItem('role', response.role); // Guardamos el rol
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response: AuthResponse = await authService.userRegister(data);
      
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      sessionStorage.setItem('role', response.role);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    setUser(null);
  };

  // Determinar si es admin basado en el rol guardado
  const isAdmin = sessionStorage.getItem('role') === 'admin';

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