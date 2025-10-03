import { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { authService, firebaseService } from '../services';
import type { User, LoginRequest, RegisterRequest, AuthResponse, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState<number | undefined>();
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | undefined>();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Check if session is expired
          if (authService.isSessionExpired()) {
            authService.logout();
            setIsLoading(false);
            return;
          }

          // Check if token needs refresh
          if (authService.shouldRefreshToken()) {
            const refreshed = await authService.refreshToken();
            if (!refreshed) {
              authService.logout();
              setIsLoading(false);
              return;
            }
          }

          // Load user data
          const userData = sessionStorage.getItem('user');
          const userType = sessionStorage.getItem('userType');
          
          if (userData && userData !== 'null' && userData !== 'undefined') {
            setUser(JSON.parse(userData));
            setIsAdmin(userType === 'admin');
          }

          // Set session timeout
          const timeoutTime = Date.now() + (30 * 60 * 1000); // 30 minutes
          setSessionTimeout(timeoutTime);
          
          // Set token expiration
          const tokenExpiration = authService.getTokenExpirationTime();
          setTokenExpiresAt(tokenExpiration || undefined);

        }
      } catch (error) {
        console.error('Error en initializeAuth:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!tokenExpiresAt) return;

    const checkTokenExpiration = async () => {
      if (authService.shouldRefreshToken()) {
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          const newExpiration = authService.getTokenExpirationTime();
          setTokenExpiresAt(newExpiration || undefined);
        } else {
          // Refresh failed, logout user
          logout();
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [tokenExpiresAt]);

  // Check session timeout every minute
  useEffect(() => {
    if (!sessionTimeout) return;

    const checkSessionTimeout = () => {
      if (authService.isSessionExpired()) {
        logout();
      }
    };

    const interval = setInterval(checkSessionTimeout, 60000);
    return () => clearInterval(interval);
  }, [sessionTimeout]);

  // Enhanced login
  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response: AuthResponse = await authService.login(data);
      
      // Store user data
      if (response.userType === 'admin' && response.admin) {
        sessionStorage.setItem('user', JSON.stringify(response.admin));
        setUser(response.admin);
        setIsAdmin(true);
      } else if (response.userType === 'user' && response.user) {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAdmin(false);
      }

      // Set session timeout
      const timeoutTime = Date.now() + (30 * 60 * 1000);
      setSessionTimeout(timeoutTime);
      authService.extendSession();

      // Set token expiration
      const tokenExpiration = authService.getTokenExpirationTime();
      setTokenExpiresAt(tokenExpiration || undefined);

    } catch (error) {
      throw error;
    }
  }, []);

  // Enhanced register
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response: AuthResponse = await authService.userRegister(data);
      
      if (response.userType === 'admin' && response.admin) {
        sessionStorage.setItem('user', JSON.stringify(response.admin));
        setUser(response.admin);
        setIsAdmin(true);
      } else if (response.userType === 'user' && response.user) {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAdmin(false);
      }

      // Set session timeout
      const timeoutTime = Date.now() + (30 * 60 * 1000);
      setSessionTimeout(timeoutTime);
      authService.extendSession();

      // Set token expiration
      const tokenExpiration = authService.getTokenExpirationTime();
      setTokenExpiresAt(tokenExpiration || undefined);

    } catch (error) {
      throw error;
    }
  }, []);

  // Enhanced logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAdmin(false);
    setSessionTimeout(undefined);
    setTokenExpiresAt(undefined);
  }, []);

  // Manual token refresh
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const success = await authService.refreshToken();
      if (success) {
        const newExpiration = authService.getTokenExpirationTime();
        setTokenExpiresAt(newExpiration || undefined);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  }, []);

  // Extend session (call this on user activity)
  const extendSession = useCallback(() => {
    const timeoutTime = Date.now() + (30 * 60 * 1000);
    setSessionTimeout(timeoutTime);
    authService.extendSession();
  }, []);

  // Check if session is about to timeout
  const checkSessionTimeout = useCallback((): boolean => {
    return authService.isSessionExpired();
  }, []);

  // Enhanced Google login
  const loginWithGoogle = useCallback(async () => {
    try {
      const response: AuthResponse = await firebaseService.signInWithGoogle();
      
      // Store user data
      if (response.userType === 'admin' && response.admin) {
        sessionStorage.setItem('user', JSON.stringify(response.admin));
        setUser(response.admin);
        setIsAdmin(true);
      } else if (response.userType === 'user' && response.user) {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAdmin(false);
      }

      // Set session timeout
      const timeoutTime = Date.now() + (30 * 60 * 1000);
      setSessionTimeout(timeoutTime);
      authService.extendSession();

      // Set token expiration
      const tokenExpiration = authService.getTokenExpirationTime();
      setTokenExpiresAt(tokenExpiration || undefined);

    } catch (error) {
      throw error;
    }
  }, []);

  // Memoized context value
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    sessionTimeout,
    tokenExpiresAt,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshToken,
    extendSession,
    checkSessionTimeout,
  }), [user, isLoading, isAdmin, sessionTimeout, tokenExpiresAt, login, register, loginWithGoogle, logout, refreshToken, extendSession, checkSessionTimeout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};