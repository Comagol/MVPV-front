import api from './api';
import type {
  CreatePlayerRequest,
  UpdatePlayerRequest,
  PlayerResponse,
  PlayerPagination,
} from '../types/index';

export const playerService = {
  // Rutas protegidas por auth y ademas solo para admins
  //get all players
  getAllPlayers: async (pagination?: PlayerPagination): Promise<PlayerResponse[]> => {
    const response = await api.get('/players/', { params: pagination });
    return response.data;
  },

  //get player by id
  getPlayerById: async (id: string): Promise<PlayerResponse> => {
    const response = await api.get(`/players/${id}`);
    return response.data;
  },

  //create player
  createPlayer: async (playerData: CreatePlayerRequest): Promise<PlayerResponse> => {
    const response = await api.post('/players/', playerData);
    return response.data;
  },

  //update player
  updatePlayer: async (id: string, playerData: UpdatePlayerRequest): Promise<PlayerResponse> => {
    const response = await api.put(`/players/${id}`, playerData);
    return response.data;
  },

  //delete player
  deletePlayer: async (id: string): Promise<void> => {
    await api.delete(`/players/${id}`);
  },

  //toggle player active
  togglePlayerActive: async (id: string, activo: boolean): Promise<PlayerResponse> => {
    const response = await api.put(`/players/${id}`, { activo: !activo });
    return response.data;
  },
};