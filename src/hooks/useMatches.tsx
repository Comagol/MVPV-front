import { useEffect, useState, useCallback, useRef } from "react";
import { matchService } from "../services";
import type { MatchResponse } from "../types";

export const useMatches = () => {
  // ✅ ESTADO CONSOLIDADO
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [activeMatches, setActiveMatches] = useState<MatchResponse[]>([]);
  const [lastFinishedMatch, setLastFinishedMatch] = useState<MatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
  // ✅ REFS PARA PREVENIR LLAMADAS DUPLICADAS
  const isLoadingRef = useRef(false);
  const lastFetchRef = useRef<number>(0);
  const CACHE_DURATION = 30000; // 30 segundos de cache

  // ✅ FUNCIÓN PRINCIPAL: Cargar todos los datos en paralelo
  const loadAllData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Prevenir llamadas duplicadas
    if (isLoadingRef.current) {
      console.log('🔄 Carga ya en progreso, omitiendo...');
      return;
    }

    // Verificar cache (solo si no es forzado)
    if (!forceRefresh && (now - lastFetchRef.current) < CACHE_DURATION) {
      console.log('💾 Usando datos en cache');
      return;
    }

    console.log('🔄 Iniciando carga de datos de partidos...');
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // ✅ OPTIMIZACIÓN CLAVE: Todas las llamadas en paralelo
      const [allMatches, activeMatchesData, lastFinishedMatchData] = await Promise.all([
        matchService.getAllMatches(),
        matchService.getActiveMatches(),
        matchService.getLastFinishedMatch()
      ]);

      // ✅ OPTIMIZACIÓN CLAVE: Una sola actualización de estado
      setMatches(allMatches);
      setActiveMatches(activeMatchesData);
      setLastFinishedMatch(lastFinishedMatchData);
      setHasInitiallyLoaded(true);
      
      lastFetchRef.current = now;
      console.log('✅ Datos cargados exitosamente:', {
        totalMatches: allMatches.length,
        activeMatches: activeMatchesData.length,
        hasLastFinished: !!lastFinishedMatchData
      });
    } catch (err: any) {
      console.error('❌ Error cargando datos:', err);
      setError(err.response?.data?.message || 'Error al obtener los datos de partidos');
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // ✅ FUNCIONES INDIVIDUALES MEMOIZADAS
  const fetchAllMatches = useCallback(async () => {
    await loadAllData();
    return matches;
  }, [loadAllData, matches]);

  const fetchActiveMatches = useCallback(async () => {
    await loadAllData();
    return activeMatches;
  }, [loadAllData, activeMatches]);

  const fetchMatchById = useCallback(async (id: string) => {
    try {
      const match = await matchService.getMatchById(id);
      return match;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener el partido');
      throw err;
    }
  }, []);

  const fetchLastFinishedMatch = useCallback(async () => {
    await loadAllData();
    return lastFinishedMatch;
  }, [loadAllData, lastFinishedMatch]);

  // ✅ FUNCIÓN DE REFRESH FORZADO
  const refreshData = useCallback(async () => {
    await loadAllData(true);
  }, [loadAllData]);

  // ✅ FUNCIÓN PARA LIMPIAR ERRORES
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ EFECTO PRINCIPAL: Cargar datos al montar
  useEffect(() => {
    if (!hasInitiallyLoaded) {
      loadAllData();
    }
  }, [loadAllData, hasInitiallyLoaded]);

  // ✅ RETORNO OPTIMIZADO
  return {
    // Estados
    matches,
    activeMatches,
    lastFinishedMatch,
    isLoading,
    error,
    hasInitiallyLoaded,
    
    // Funciones de datos
    fetchAllMatches,
    fetchActiveMatches,
    fetchMatchById,
    fetchLastFinishedMatch,
    
    // Funciones de utilidad
    refreshData,
    clearError
  };
};