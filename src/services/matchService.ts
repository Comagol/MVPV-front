import api from './api';
import type { MatchResponse, CreateMatchRequest } from '../types/index';

export const matchService = {
  //Rutas publicas
  //get all matches
  getAllMatches: async (): Promise<MatchResponse[]> => {
    const response = await api.get('/matches/');
    return response.data.match;
  },

  //get partidos activos
  getActiveMatches: async (): Promise<MatchResponse[]> => {
    const response = await api.get('/matches/active/matches');
    return response.data.match;
  },

  //Get match By ID
  getMatchById: async (id: string): Promise<MatchResponse> => {
    const response = await api.get(`/matches/${id}`);
    return response.data.match;
  },

  //rutas protegidas
  //create match
  createMatch: async (matchData: CreateMatchRequest): Promise<MatchResponse> => {
    const response = await api.post('/matches/', matchData);
    return response.data.match;
  },

  //update Match
  updateMatch: async (id: string, matchData: Partial<CreateMatchRequest>): Promise<MatchResponse> => {
    const response = await api.put(`/matches/${id}`, matchData);
    return response.data;
  },

  //start match
  startMatch: async (id: string): Promise<MatchResponse> => {
    const response = await api.put(`/matches/${id}/start`);
    return response.data.match;
  },

  //finish match
  finishMatch: async (id: string): Promise<MatchResponse> => {
    const response = await api.put(`/matches/${id}/finish`);
    return response.data.match;
  },

  //delete match
  deleteMatch: async (id: string): Promise<void> => {
    await api.delete(`/matches/${id}`);
  },

};