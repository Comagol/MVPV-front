import type { User } from './user';

export interface Admin extends User {
  _id: string;
  email: string;
  nombre: string;
  fechaRegistro: string;
  activo: boolean;
  role: 'admin';
}