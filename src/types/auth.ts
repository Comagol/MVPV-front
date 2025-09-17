//importo user

import type { Admin } from './admin';
import type { User } from './user';

// Creo el tipo de auth
export interface LoginRequest {
  email:string;
  password:string;
}

export interface RegisterRequest {
  email: string;
  nombre: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User | Admin;
  role: 'user' | 'admin';
}