//Creo el tipo de player

export interface Player {
  _id: string;
  nombre: string;
  apodo: string;
  posicion: string;
  imagen: string;
  camiseta: number;
  activo: boolean;
  camada: number;
  fechaRegistro: string;
}

export interface CreatePlayerRequest {
  nombre: string;
  apodo: string;
  posicion: string;
  imagen: string;
  camiseta: number;
  camada: number;
}

export interface UpdatePlayerRequest {
  nombre?: string;
  apodo?: string;
  posicion?: string;
  imagen?: string;
  camiseta?: number;
  camada?: number;
  activo?: boolean;
}

export interface PlayerResponse {
  _id: string;
  nombre: string;
  apodo: string;
  posicion: string;
  imagen: string;
  camiseta: number;
  activo: boolean;
  camada: number;
}