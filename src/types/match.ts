/* Match interface */

//Importo player
import type { PlayerResponse } from './player';

export interface CreateMatchRequest {
  fecha: Date;
  jugadores: string[];  // Array de IDs de jugadores (15-23)
  description: string;
  rival: string;
}

export interface MatchResponse {
  id: string;
  fecha: Date;
  jugadores: PlayerResponse[];
  description: string;
  rival: string;
  estado: 'programado' | 'en_proceso' | 'finalizado';
}