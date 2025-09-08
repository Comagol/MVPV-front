// Creo el tipo de vote

export interface Vote {
  _id: string;
  userId: string;
  playerId: string;
  matchId: string;
  fechaVoto: string;
}