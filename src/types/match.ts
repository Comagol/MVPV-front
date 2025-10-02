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

// MatchContext types
export interface MatchContextType {
  matches: MatchResponse[];
  activeMatches: MatchResponse[];
  programmedMatches: MatchResponse[];
  lastFinishedMatch: MatchResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchAllMatches: () => Promise<MatchResponse[]>;
  fetchActiveMatches: () => Promise<MatchResponse[]>;
  fetchProgrammedMatches: () => Promise<MatchResponse[]>;
  fetchMatchById: (id: string) => Promise<MatchResponse>;
  fetchLastFinishedMatch: () => Promise<MatchResponse | null>;
  clearError: () => void;
}