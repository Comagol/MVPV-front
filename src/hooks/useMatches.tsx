import { useEffect, useState } from "react";
import { matchService } from "../services";
import type { MatchResponse } from "../types";

export const useMatches = () => {
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [activeMatches, setActiveMatches] = useState<MatchResponse[]>([]);
  const [lastFinishedMatch, setLastFinishedMatch] = useState<MatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //obtengo los partidos
  const fetchAllMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allMatches = await matchService.getAllMatches();
      setMatches(allMatches);
      return allMatches;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener todos los partidos');
      throw err;
    }finally {
      setIsLoading(false);
    }
  };

  //obtengo los partidos activos
  const fetchActiveMatches = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const active = await matchService.getActiveMatches();
      setActiveMatches(active);
      return active;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener los partidos activos');
      throw err;
    }finally {
      setIsLoading(false);
    }
  };

  //obtengo partido por id
  const fetchMatchById = async (id:string) => {
    setIsLoading(true);
    setError(null);

    try {
      const match = await matchService.getMatchById(id);
      return match;
    } catch (err: any) {
      setError(err.reponse?.data.message || 'Error al obtener el partido');
      throw err;
    }finally {
      setIsLoading(false);
    }
  };

  //obtener el ultimo partido finalizado
  const fetchLastFinishedMatch = async () => {
    console.log('🔍 useMatches: Iniciando fetchLastFinishedMatch');
    setIsLoading(true);
    setError(null);

    try {
      const lastMatch = await matchService.getLastFinishedMatch();
      console.log('✅ useMatches: Ultimo partido finalizado obtenido:', lastMatch);
      setLastFinishedMatch(lastMatch);
      return lastMatch;
    } catch (err: any) {
      console.error('❌ useMatches: Error al obtener el ultimo partido finalizado:', err);
      setError(err.response?.data?.message || 'Error al obtener el ultimo partido finalizado');
      throw err;
    }finally {
      setIsLoading(false);
    }
  }

  // cargar los datos al montar el hook
  useEffect(() => {
    fetchAllMatches();
    fetchActiveMatches();
    fetchLastFinishedMatch();
  }, []);

  return {
    matches,
    activeMatches,
    isLoading,
    error,
    fetchAllMatches,
    fetchActiveMatches,
    fetchMatchById,
    fetchLastFinishedMatch,
    lastFinishedMatch,
    clearError: () => setError(null)
  };
};