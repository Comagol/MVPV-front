import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { authService } from '../services';
import type { User, LoginRequest, RegisterRequest, AdminAuthResponse, UserAuthResponse } from '../types';

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
      try {
        console.log('checkAuth ejecutándose...');
        const isAuth = authService.isAuthenticated();
        console.log('isAuthenticated() retorna:', isAuth);
        
        if (isAuth) {
         const userData = sessionStorage.getItem('user');
         console.log('userData:', userData);
         if (userData && userData !== 'null' && userData !== 'undefined') {
          setUser(JSON.parse(userData));
          console.log('Usuario seteado correctamente');
         } else {
          console.log('No hay userData válido');
         }
        } else {
          console.log('Usuario no autenticado');
        }
      } catch (error) {
        console.error('Error en checkAuth:', error);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      } finally {
        console.log('setIsLoading(false) ejecutándose...');
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data: LoginRequest, isAdmin = false) => {
    try {
      console.log('Iniciando login con datos:', data);
      console.log('isAdmin:', isAdmin);
      
      if (isAdmin) {
        const response: AdminAuthResponse = await authService.adminLogin(data);
        console.log('Respuesta del backend (admin):', response);
        
        // Ahora accede directamente al token y admin
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.admin));
        setUser(response.admin);
      } else {
        const response: UserAuthResponse = await authService.userLogin(data);
        console.log('Respuesta del backend (user):', response);
        
        // Accede directamente al token y user
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      console.log('Login exitoso');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest, isAdmin = false) => {
    try {
      if (isAdmin) {
        const response: AdminAuthResponse = await authService.adminRegister(data);
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.admin));
        setUser(response.admin);
      } else {
        const response: UserAuthResponse = await authService.userRegister(data);
        sessionStorage.setItem('token', response.token);
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
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
