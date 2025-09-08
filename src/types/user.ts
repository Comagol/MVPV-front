/*User interface*/ 

export interface User {
  _id: string;
  email: string;
  nombre: string;
  fechaRegistro: string;
  ultimoVoto?: string;
  votosRealizados: number;
  activo: boolean;
}