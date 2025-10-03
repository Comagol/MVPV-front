import api from './api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyResetTokenResponse,
} from '../types/index';

//token management utilities
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRES_KEY = 'tokenExpiresAt';
const USER_KEY = 'user';
const USER_TYPE_KEY = 'userType';
const SESSION_TIMEOUT_KEY = 'sessionTimeout';

//session timeout in milliseconds
const SESSION_TIMEOUT_DURATION = 30 * 60 * 1000;

export const authService = {
  //Usuarios
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    const authData = response.data;

    if (authData.token) {
      const expiresAt = authData.expiresAt || Date.now() + (24*60*60*1000);
      authService.setTokenData({
        token: authData.token,
        refreshToken: authData.refreshToken,
        expiresAt,
        issuedAt: Date.now(),
      });

      if (authData.userType) {
        sessionStorage.setItem(USER_TYPE_KEY, authData.userType);
      }
    }
    return authData;
  },

  userRegister: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/users/register', data);
    const authData = response.data;

    if (authData.token) {
      const expiresAt = authData.expiresAt || Date.now() + (24*60*60*1000);
      authService.setTokenData({
        token: authData.token,
        refreshToken: authData.refreshToken,
        expiresAt,
        issuedAt: Date.now(),
      });

      if (authData.userType) {
        sessionStorage.setItem(USER_TYPE_KEY, authData.userType);
      }
    }
    return authData;
  },

  adminRegister: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/admin/register', data);
    const authData = response.data;

    if (authData.token) {
      const expiresAt = authData.expiresAt || Date.now() + (24*60*60*1000);
      authService.setTokenData({
        token: authData.token,
        refreshToken: authData.refreshToken,
        expiresAt,
        issuedAt: Date.now(),
      });

      if (authData.userType) {
        sessionStorage.setItem(USER_TYPE_KEY, authData.userType);
      }
    }
    return authData;
  },

  refreshToken: async (): Promise<boolean> => {
    try {
      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        return false;
      }
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const tokenData = response.data;
      authService.setTokenData({
        token: tokenData.token,
        refreshToken: tokenData.refreshToken,
        expiresAt: tokenData.expiresAt,
        issuedAt: Date.now(),
      });
      return true;
    } catch (error) {
      console.error('Error al actualizar el token:', error);
      authService.logout();
      return false;
    }
  },

  // enhanced authentication check
  isAuthenticated: (): boolean => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const expiresAt = sessionStorage.getItem(TOKEN_EXPIRES_KEY);
    if (!token || !expiresAt) {
      return false;
    }
    const now = Date.now();
    const expirationTime = parseInt(expiresAt);

    if (now >= expirationTime) {
      return false;
    }
    return true;
  },

  shouldRefreshToken: (): boolean => {
    const expiresAt = sessionStorage.getItem(TOKEN_EXPIRES_KEY);
    if (!expiresAt) return false;
    
    const now = Date.now();
    const expirationTime = parseInt(expiresAt);
    const refreshThreshold = 5 * 60 * 1000; // 5 minutes
    
    return (expirationTime - now) <= refreshThreshold;
  },

  // Enhanced logout
  logout: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRES_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_TYPE_KEY);
    sessionStorage.removeItem(SESSION_TIMEOUT_KEY);
  },

  // Token data management
  setTokenData: (tokenData: { token: string; refreshToken?: string; expiresAt: number; issuedAt: number }) => {
    sessionStorage.setItem(TOKEN_KEY, tokenData.token);
    if (tokenData.refreshToken) {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken);
    }
    sessionStorage.setItem(TOKEN_EXPIRES_KEY, tokenData.expiresAt.toString());
  },

   // Session timeout management
   extendSession: () => {
    const timeoutTime = Date.now() + SESSION_TIMEOUT_DURATION;
    sessionStorage.setItem(SESSION_TIMEOUT_KEY, timeoutTime.toString());
  },

  isSessionExpired: (): boolean => {
    const timeoutTime = sessionStorage.getItem(SESSION_TIMEOUT_KEY);
    if (!timeoutTime) return true;
    
    return Date.now() > parseInt(timeoutTime);
  },

  // Get current token expiration time
  getTokenExpirationTime: (): number | null => {
    const expiresAt = sessionStorage.getItem(TOKEN_EXPIRES_KEY);
    return expiresAt ? parseInt(expiresAt) : null;
  },

  // Password reset methods (keeping your existing ones)
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  verifyResetToken: async (token: string): Promise<VerifyResetTokenResponse> => {
    const response = await api.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  },

  // Firebase login method
  firebaseLogin: async (firebaseToken: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/firebase-login', { firebaseToken: firebaseToken });
    const authData = response.data;

    if (authData.token) {
      const expiresAt = authData.expiresAt || Date.now() + (24*60*60*1000);
      authService.setTokenData({
        token: authData.token,
        refreshToken: authData.refreshToken,
        expiresAt,
        issuedAt: Date.now(),
      });

      if (authData.userType) {
        sessionStorage.setItem(USER_TYPE_KEY, authData.userType);
      }
    }
    return authData;
  },
};