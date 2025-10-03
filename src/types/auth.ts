//importo user

import type { Admin } from './admin';
import type { User } from './user';

// Creo el tipo de auth
export interface LoginRequest {
  email:string;
  password:string;
  rememberMe: boolean;
}

// Nuevo tipo para Firebase login
export interface FirebaseLoginRequest {
  token: string; // Token de Firebase
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
  refreshToken?: string;
  expiresAt?: number;
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
  token: string;
  refreshToken?: string;
  expiresAt: number;
  issuedAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  sessionTimeout?: number;
  tokenExpiresAt?: number;
}

export interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  extendSession: () => void;
  checkSessionTimeout: () => boolean;
}

export interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

