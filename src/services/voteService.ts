import api from './api';
import type { Vote } from '../types/index';

export const voteService = {
  //Rutas Publicas
  //get match stats
  getMatchStats: async (matchId: string): Promise<Vote[]> => {
    const response = await api.get(`/votes/${matchId}/stats`);
    return response.data;
  },

  //get ganador del partido
  getMatchWinner: async (matchId: string): Promise<any> => {
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
  validateVote: async (matchId: string): Promise<boolean> => {
    const response = await api.get(`/votes/validate/${matchId}`);
    return response.data;
  },

  //Realizar un voto
  createVote: async (playerId: string, matchId: string): Promise<Vote> => {
    const response = await api.post(`/votes/`, { playerId, matchId });
    return response.data;
  }
};