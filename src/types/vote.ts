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

// VoteContext types
export interface VoteContextType {
  votes: VoteResponse[];
  isLoading: boolean;
  error: string | null;
  createVote: (playerId: string, matchId: string) => Promise<VoteResponse>;
  validateVote: (matchId: string) => Promise<VoteValidationResponse>;
  getMatchStats: (matchId: string) => Promise<VoteStatistics[]>;
  getTop3Players: (matchId: string) => Promise<VoteStatistics[]>;
  getMatchWinner: (matchId: string) => Promise<VoteStatistics>;
  getTotalVotes: (matchId: string) => Promise<number>;
  clearError: () => void;
}