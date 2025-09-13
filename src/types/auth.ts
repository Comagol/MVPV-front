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

export interface AdminAuthResponse {
  token: string;
  admin: Admin;
}

// Si también tienes usuarios, crea este tipo:
export interface UserAuthResponse {
  token: string;
  user: User;
}