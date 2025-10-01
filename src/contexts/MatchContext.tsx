import { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { matchService } from '../services';
import type { MatchResponse, MatchContextType } from '../types';

const MatchContext = createContext<MatchContextType | null>(null);

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch debe usarse dentro de MatchProvider');
  }
  return context;
};

export const MatchProvider = ({children}: { children: React.ReactNode }) => {
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [activeMatches, setActiveMatches] = useState<MatchResponse[]>([]);
  const [lastFinishedMatch, setLastFinishedMatch] = useState<MatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los partidos
  const fetchAllMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allMatches = await matchService.getAllMatches();
      setMatches(allMatches);
      return allMatches;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener todos los partidos');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener partidos activos
  const fetchActiveMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const active = await matchService.getActiveMatches();
      setActiveMatches(active);
      return active;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener los partidos activos');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener partido por ID
  const fetchMatchById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const match = await matchService.getMatchById(id);
      return match;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener el partido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener el último partido finalizado
  const fetchLastFinishedMatch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const lastMatch = await matchService.getLastFinishedMatch();
      setLastFinishedMatch(lastMatch);
      return lastMatch;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener el último partido finalizado');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchAllMatches();
    fetchActiveMatches();
    fetchLastFinishedMatch();
  }, [fetchAllMatches, fetchActiveMatches, fetchLastFinishedMatch]);

  // Memoized context value
  const value = useMemo(() => ({
    matches,
    activeMatches,
    lastFinishedMatch,
    isLoading,
    error,
    fetchAllMatches,
    fetchActiveMatches,
    fetchMatchById,
    fetchLastFinishedMatch,
    clearError,
  }), [matches, activeMatches, lastFinishedMatch, isLoading, error, fetchAllMatches, fetchActiveMatches, fetchMatchById, fetchLastFinishedMatch, clearError]);

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};