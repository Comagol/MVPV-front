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

export const authService = {
  //Usuarios
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  userRegister: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  adminRegister: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/admin/register', data);
    return response.data;
  },

  //utilities
  logout: () => {
    sessionStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    const token = sessionStorage.getItem('token');
    console.log('Token en sessionStorage:', token);
    console.log('¿Token existe?', !!token);
    return !!token;
  },

  //forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  //reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  //verify reset token
  verifyResetToken: async (token: string): Promise<VerifyResetTokenResponse> => {
    const response = await api.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  },
};