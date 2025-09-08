import api from './api';

export const adminService = {
  changePassword: async (newPassword: string): Promise<void> => {
  const response = await api.put('/admin/change-password', { newPassword });
  return response.data;
  }
};