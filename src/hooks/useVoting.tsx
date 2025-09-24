import { useState } from 'react';
import { voteService  } from '../services';
import type { VoteResponse, VoteStatistics, VoteValidationResponse } from '../types';

export const useVoting = () => {
  const [ votes, setVotes ] = useState<VoteResponse[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);

  // Crear un voto
  const createVote = async (playerId: string, matchId: string) => {
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
  };

  //valido si puede votar
  const validateVote = async (matchId: string): Promise<VoteValidationResponse> => {
    try{
      return await voteService.validateVote(matchId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al validar voto');
      return { puedeVotar: false,
        razon: 'Error al validar voto',
       };
    }
  };

  // obtener estadisticas del partido
  const getMatchStats = async (matchId: string): Promise<VoteStatistics[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await voteService.getMatchStats(matchId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener estadisticas');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  //obtener top 3 players
  const getTop3Players = async (matchId: string): Promise<VoteStatistics[]> => {
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
  };

  //obtener ganador de un partido
  const getMatchWinner = async (matchId: string): Promise<VoteStatistics> => {
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
  }

  //obtener total de votos
  const getTotalVotes = async (matchId: string): Promise<number> => {
    try {
      return await voteService.getTotalVotes(matchId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener total de votos');
      return 0;
    }
  };

  return {
    votes,
    isLoading,
    error,
    createVote,
    validateVote,
    getMatchStats,
    getTop3Players,
    getMatchWinner,
    getTotalVotes,
    clearError: () => setError(null)
  };
};