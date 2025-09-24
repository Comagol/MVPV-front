import api from './api';
import type { CreateVoteRequest, VoteResponse, VoteStatistics, VoteValidationResponse } from '../types/index';

export const voteService = {
  //Rutas Publicas
  //get match stats
  getMatchStats: async (matchId: string): Promise<VoteStatistics[]> => {
    const response = await api.get(`/votes/${matchId}/stats`);
    return response.data;
  },

  //get top 3 players
  getTop3Players: async (matchId: string): Promise<VoteStatistics[]> => {
    const response = await api.get(`/votes/${matchId}/top3`);
    return response.data;
  },

  //get ganador del partido
  getMatchWinner: async (matchId: string): Promise<VoteStatistics> => {
    const response = await api.get(`/votes/${matchId}/winner`);
    return response.data;
  },

  //Get total votos
  getTotalVotes: async (MatchId: string): Promise<number> => {
    const response = await api.get(`/votes/${MatchId}/total-votes`);
    return response.data;
  },

  //Rutas protegidas (usuario autenticado)
  //Validar voto
  validateVote: async (matchId: string): Promise<VoteValidationResponse> => {
    const response = await api.get(`/votes/validate/${matchId}`);
    return response.data;
  },

  // Realizar un voto
  createVote: async (playerId: string, matchId: string): Promise<VoteResponse> => {
    const voteData: CreateVoteRequest = {
      userId: '', // Se obtiene del token en el backend
      playerId,
      matchId,
    };
    const response = await api.post(`/votes/`, voteData);
    return response.data;
  }
}