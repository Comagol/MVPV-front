import { 
  signInWithPopup, 
  signOut, 
  type User as FirebaseUser,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from './api';
import type { AuthResponse, FirebaseLoginRequest } from '../types';

export const firebaseService = {
  // Login con Google
  signInWithGoogle: async (): Promise<AuthResponse> => {
    try {
      // Autenticar con Google usando popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Obtener el token de ID de Firebase
      const idToken = await user.getIdToken();
      
      // Enviar el token al backend
      const response = await api.post('/auth/firebase-login', { token: idToken });
      
      return response.data;
    } catch (error: any) {
      console.error('Error en Google Sign-In:', error);
      
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('El popup de Google fue cerrado. Intenta nuevamente.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('El popup fue bloqueado. Permite popups para este sitio.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Solicitud de popup cancelada. Intenta nuevamente.');
      } else {
        throw new Error('Error al iniciar sesión con Google. Intenta nuevamente.');
      }
    }
  },

  // Logout de Firebase
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión de Firebase:', error);
      throw new Error('Error al cerrar sesión');
    }
  },

  // Obtener usuario actual de Firebase
  getCurrentUser: (): FirebaseUser | null => {
    return auth.currentUser;
  },

  // Escuchar cambios en el estado de autenticación
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Obtener token de ID actual
  getCurrentIdToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken();
      } catch (error) {
        console.error('Error al obtener token:', error);
        return null;
      }
    }
    return null;
  },

  // Forzar renovación del token
  refreshIdToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken(true); // true = forzar renovación
      } catch (error) {
        console.error('Error al renovar token:', error);
        return null;
      }
    }
    return null;
  }
};

export default firebaseService;