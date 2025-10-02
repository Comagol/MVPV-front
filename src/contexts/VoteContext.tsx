import { useState, createContext, useContext, useMemo, useCallback } from 'react';
import { voteService } from '../services';
import type { VoteResponse, VoteStatistics, VoteValidationResponse, VoteContextType } from '../types';

const VoteContext = createContext<VoteContextType | null>(null);

export const useVote = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error('useVote debe usarse dentro de VoteProvider');
  }
  return context;
};

export const VoteProvider = ({children}: { children: React.ReactNode }) => {
  const [votes, setVotes] = useState<VoteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear un voto
  const createVote = useCallback(async (playerId: string, matchId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const newVote = await voteService.createVote(playerId, matchId);
      setVotes(prev => [...prev, newVote]);
      return newVote;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al votar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validar si puede votar
  const validateVote = useCallback(async (matchId: string): Promise<VoteValidationResponse> => {
    try {
      return await voteService.validateVote(matchId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al validar voto');
      return {
        puedeVotar: false,
        razon: 'Error al validar voto',
      };
    }
  }, []);

  // Obtener estadísticas del partido
  const getMatchStats = useCallback(async (matchId: string): Promise<VoteStatistics[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await voteService.getMatchStats(matchId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener estadísticas');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener top 3 players
  const getTop3Players = useCallback(async (matchId: string): Promise<VoteStatistics[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await voteService.getTop3Players(matchId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener top 3 players');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener ganador de un partido
  const getMatchWinner = useCallback(async (matchId: string): Promise<VoteStatistics> => {
    setIsLoading(true);
    setError(null);

    try {
      return await voteService.getMatchWinner(matchId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener al ganador');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener total de votos
  const getTotalVotes = useCallback(async (matchId: string): Promise<number> => {
    try {
      return await voteService.getTotalVotes(matchId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener total de votos');
      return 0;
    }
  }, []);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoized context value
  const value = useMemo(() => ({
    votes,
    isLoading,
    error,
    createVote,
    validateVote,
    getMatchStats,
    getTop3Players,
    getMatchWinner,
    getTotalVotes,
    clearError,
  }), [votes, isLoading, error, createVote, validateVote, getMatchStats, getTop3Players, getMatchWinner, getTotalVotes, clearError]);

  return (
    <VoteContext.Provider value={value}>
      {children}
    </VoteContext.Provider>
  );
};