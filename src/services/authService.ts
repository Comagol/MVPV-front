import api from './api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../types/index';

export const authService = {
  //Usuarios
  userLogin: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  userRegister: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  //Admins
  adminLogin: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/admin/login', data);
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
    return !!sessionStorage.getItem('token');
  }
};