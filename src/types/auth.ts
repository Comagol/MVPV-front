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
  success: boolean;
  userType: 'user' | 'admin';
  token: string;
  user?: User;
  admin?: Admin;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyResetTokenResponse {
  success: boolean;
  valid: boolean;
  message: string;
}

export interface TokenData {
  token: string,
  refreshToken?: string,
  expiresAt: number,
  issuedAt: number,
}

export interface AuthState {
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  isAdmin: boolean,
  sessionTimeout?: number,
  tokenExpiresAt?: number,
}