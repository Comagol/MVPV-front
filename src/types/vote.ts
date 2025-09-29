// Creo el tipo de vote

export interface CreateVoteRequest {
  userId: string;
  playerId: string;
  matchId: string;
}

export interface VoteResponse {
  id: string;
  playerId: string;
  matchId: string;
  fechaVoto: Date;
}

export interface VoteState {
  isLoading: boolean;
  error: string | null;
  vote: VoteResponse | null;
}

export interface VoteStatistics {
  playerId: string;
  playerName: string;
  playerApodo?: string;
  playerImagen: string;
  totalVotos: number;
  porcentaje?: number;
}

export interface VoteValidationResponse {
  puedeVotar: boolean;
  razon?: string;
  tiempoRestante?: number;
}