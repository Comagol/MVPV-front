import api from './api';
import type { Match } from '../types/index';

export const matchService = {
  //Rutas publicas
  //get all matches
  getAllMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches/');
    return response.data;
  },

  //get partidos activos
  getActiveMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches/active/matches');
    return response.data;
  },

  //Get match By ID
  getMatchById: async (id: string): Promise<Match> => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  //rutas protegidas
  //create match
  createMatch: async (matchData: Omit<Match, '_id'>): Promise<Match> => {
    const response = await api.post('/matches/', matchData);
    return response.data;
  },

  //update Match
  updateMatch: async (id: string, matchData: Partial<Match>): Promise<Match> => {
    const response = await api.put(`/matches/${id}`, matchData);
    return response.data;
  },

  //start match
  startMatch: async (id: string): Promise<Match> => {
    const response = await api.put(`/matches/${id}/start`);
    return response.data;
  },

  //finish match
  finishMatch: async (id: string): Promise<Match> => {
    const response = await api.put(`/matches/${id}/finish`);
    return response.data;
  }

};