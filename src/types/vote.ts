// Creo el tipo de vote

export interface CreateVoteRequest {
  id: string;
  userId: string;
  playerId: string;
  matchId: string;
  fechaVoto: Date;
}

export interface VoteResponse {
  id: string;
  userId: string;
  playerId: string;
  matchId: string;
  fechaVoto: Date;
}

export interface VoteState {
  isLoading: boolean;
  error: string | null;
  vote: VoteResponse | null;
}