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