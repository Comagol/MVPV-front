/*User interface*/ 

export interface User {
  _id?: string;
  id?: string;
  email: string;
  nombre: string;
  fechaRegistro: string;
  ultimoVoto?: string;
  votosRealizados: number;
  activo: boolean;
  role: 'user' | 'admin';
  avatar?: string;
  provider?: string;
  displayName?: string;
}