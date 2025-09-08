//importo user

import type { User } from './user';

// Creo el tipo de auth
export interface LoginRequest {
  email:string;
  password:string;
}

export interface registerRequest {
  email: string;
  nombre: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
