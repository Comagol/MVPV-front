// Configuracion base de la api usando interceptores y axios
import axios, { type AxiosResponse } from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced request interceptor
api.interceptors.request.use(async (config) => {
  const token = sessionStorage.getItem('token');
  
  if (token) {
    // Check if token is expired
    if (authService.isAuthenticated()) {
      // Check if token needs refresh before making request
      if (authService.shouldRefreshToken()) {
        const refreshed = await authService.refreshToken();
        if (!refreshed) {
          // Refresh failed, redirect to login
          authService.logout();
          window.location.href = '/login';
          return Promise.reject(new Error('Token refresh failed'));
        }
      }
      
      // Use the (potentially refreshed) token
      const currentToken = sessionStorage.getItem('token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
    }
  }
  
  return config;
});

// Enhanced response interceptor with automatic token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshed = await authService.refreshToken();
        
        if (refreshed) {
          // Retry the original request with new token
          const newToken = sessionStorage.getItem('token');
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // Refresh failed, logout user
          authService.logout();
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        authService.logout();
        window.location.href = '/login';
      }
    }
    
    // Handle session timeout
    if (error.response?.status === 403 && error.response?.data?.message?.includes('session')) {
      authService.logout();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;