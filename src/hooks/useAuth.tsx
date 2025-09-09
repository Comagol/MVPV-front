import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services';
import type { User, AuthResponse, LoginRequest, RegisterRequest } from '../types';

//Contexto para compartir el estado de autenticacion
const AuthContext = createContext<{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest, isAdmin?: boolean) => Promise<void>;
  register: (data: RegisterRequest, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
} | null>(null);

// Hook personalizado para autenticacion
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({children}: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
       const userData = sessionStorage.getItem('user');
       if (userData) {
        setUser(JSON.parse(userData));
       }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (data: LoginRequest, isAdmin = false) => {
    try {
      const response: AuthResponse = isAdmin 
      ? await authService.adminLogin(data)
      : await authService.userLogin(data);

      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest, isAdmin = false) => {
    try {
      const response: AuthResponse = isAdmin 
      ? await authService.adminRegister(data)
      : await authService.userRegister(data);

      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
