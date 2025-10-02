import type { MatchResponse } from "./match";
import type { VoteResponse, VoteValidationResponse } from "./vote";
import type { VoteStatistics } from "./vote";


// src/types/appData.ts
export interface AppDataState {
  // Matches data
  matches: MatchResponse[];
  activeMatches: MatchResponse[];
  lastFinishedMatch: MatchResponse | null;
  
  // Voting data
  votes: VoteResponse[];
  matchStatistics: Record<string, VoteStatistics[]>; // matchId -> stats
  top3Players: Record<string, VoteStatistics[]>; // matchId -> top3
  matchWinners: Record<string, VoteStatistics>; // matchId -> winner
  totalVotes: Record<string, number>; // matchId -> total
  
  // Loading states
  isLoading: {
    matches: boolean;
    voting: boolean;
    statistics: boolean;
  };
  
  // Error states
  errors: {
    matches: string | null;
    voting: string | null;
    statistics: string | null;
  };
  
  // Cache control
  lastFetch: {
    matches: number;
    voting: number;
    statistics: number;
  };
  
  hasInitiallyLoaded: boolean;
}

export interface AppDataContextType extends AppDataState {
  // Match functions
  fetchMatches: (forceRefresh?: boolean) => Promise<void>;
  fetchActiveMatches: () => Promise<MatchResponse[]>;
  fetchMatchById: (id: string) => Promise<MatchResponse>;
  fetchLastFinishedMatch: () => Promise<MatchResponse | null>;
  
  // Voting functions
  createVote: (playerId: string, matchId: string) => Promise<VoteResponse>;
  validateVote: (matchId: string) => Promise<VoteValidationResponse>;
  fetchMatchStatistics: (matchId: string) => Promise<VoteStatistics[]>;
  fetchTop3Players: (matchId: string) => Promise<VoteStatistics[]>;
  fetchMatchWinner: (matchId: string) => Promise<VoteStatistics>;
  fetchTotalVotes: (matchId: string) => Promise<number>;
  
  // Utility functions
  refreshAllData: () => Promise<void>;
  clearErrors: () => void;
  clearError: (type: 'matches' | 'voting' | 'statistics') => void;
}