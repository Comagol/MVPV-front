import api from './api';
import type { User } from '../types/index';

export const userService = {
  //rutas protegidas por auth y ademas solo para admins
  //get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users/');
    return response.data;
  },

  //activar usuario
  activateUser: async (id: string): Promise<User> => {
    const response = await api.put(`/users/${id}/activate`);
    return response.data;
  },

  //desactivar usuario
  deactivateUser: async (id: string): Promise<User> => {
    const response = await api.put(`/users/${id}/deactivate`);
    return response.data;
  }
};