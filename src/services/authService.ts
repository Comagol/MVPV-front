import api from './api';
import type {
  LoginRequest,
  RegisterRequest,
  UserAuthResponse,
  AdminAuthResponse,
} from '../types/index';

export const authService = {
  //Usuarios
  userLogin: async (data: LoginRequest): Promise<UserAuthResponse> => {
    const response = await api.post('/users/login', data);
    return response.data;
  },

  userRegister: async (data: RegisterRequest): Promise<UserAuthResponse> => {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  //Admins
  adminLogin: async (data: LoginRequest): Promise<AdminAuthResponse> => {
    const response = await api.post('/admin/login', data);
    return response.data;
  },

  adminRegister: async (data: RegisterRequest): Promise<AdminAuthResponse> => {
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
  }
};