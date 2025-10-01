// src/contexts/AppDataContext.tsx
import { createContext, useContext, useReducer, useCallback, useMemo, useRef, useEffect } from 'react';
import { matchService, voteService } from '../services';
import type { 
  VoteResponse, 
  VoteStatistics,
  AppDataContextType,
  AppDataState 
} from '../types';

const AppDataContext = createContext<AppDataContextType | null>(null);

// HOOK PERSONALIZADO PARA USAR EL CONTEXTO
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData debe usarse dentro de AppDataProvider');
  }
  return context;
};

// REDUCER PARA MANEJAR ESTADO COMPLEJO
const appDataReducer = (state: AppDataState, action: any): AppDataState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.payload.type]: action.payload.value
        }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.type]: action.payload.value
        }
      };
    
    case 'SET_MATCHES_DATA':
      return {
        ...state,
        matches: action.payload.matches,
        activeMatches: action.payload.activeMatches,
        lastFinishedMatch: action.payload.lastFinishedMatch,
        lastFetch: {
          ...state.lastFetch,
          matches: Date.now()
        },
        hasInitiallyLoaded: true
      };
    
    case 'ADD_VOTE':
      return {
        ...state,
        votes: [...state.votes, action.payload.vote]
      };
    
    case 'SET_MATCH_STATISTICS':
      return {
        ...state,
        matchStatistics: {
          ...state.matchStatistics,
          [action.payload.matchId]: action.payload.statistics
        }
      };
    
    // ... más casos del reducer
    
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {
          matches: null,
          voting: null,
          statistics: null
        }
      };
    
    default:
      return state;
  }
};

// ✅ ESTADO INICIAL
const initialState: AppDataState = {
  matches: [],
  activeMatches: [],
  lastFinishedMatch: null,
  votes: [],
  matchStatistics: {},
  top3Players: {},
  matchWinners: {},
  totalVotes: {},
  isLoading: {
    matches: false,
    voting: false,
    statistics: false
  },
  errors: {
    matches: null,
    voting: null,
    statistics: null
  },
  lastFetch: {
    matches: 0,
    voting: 0,
    statistics: 0
  },
  hasInitiallyLoaded: false
};

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appDataReducer, initialState);
  
  // ✅ REFS PARA PREVENIR LLAMADAS DUPLICADAS
  const isLoadingRef = useRef({
    matches: false,
    voting: false,
    statistics: false
  });
  
  const CACHE_DURATION = 30000; // 30 segundos
  
  // ✅ FUNCIÓN PRINCIPAL: Cargar todos los datos de matches
  const fetchMatches = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Prevenir llamadas duplicadas
    if (isLoadingRef.current.matches) {
      console.log('🔄 Carga de matches ya en progreso, omitiendo...');
      return;
    }

    // Verificar cache
    if (!forceRefresh && (now - state.lastFetch.matches) < CACHE_DURATION) {
      console.log('💾 Usando datos de matches en cache');
      return;
    }

    console.log('🔄 Iniciando carga de matches...');
    isLoadingRef.current.matches = true;
    dispatch({ type: 'SET_LOADING', payload: { type: 'matches', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { type: 'matches', value: null } });

    try {
      // ✅ OPTIMIZACIÓN: Todas las llamadas en paralelo
      const [allMatches, activeMatchesData, lastFinishedMatchData] = await Promise.all([
        matchService.getAllMatches(),
        matchService.getActiveMatches(),
        matchService.getLastFinishedMatch()
      ]);

      // ✅ Una sola actualización de estado
      dispatch({
        type: 'SET_MATCHES_DATA',
        payload: {
          matches: allMatches,
          activeMatches: activeMatchesData,
          lastFinishedMatch: lastFinishedMatchData
        }
      });
      
      console.log('✅ Matches cargados exitosamente');
    } catch (err: any) {
      console.error('❌ Error cargando matches:', err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          type: 'matches', 
          value: err.response?.data?.message || 'Error al obtener los partidos' 
        } 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'matches', value: false } });
      isLoadingRef.current.matches = false;
    }
  }, [state.lastFetch.matches]);

  // ✅ FUNCIÓN PARA CREAR VOTO
  const createVote = useCallback(async (playerId: string, matchId: string): Promise<VoteResponse> => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'voting', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { type: 'voting', value: null } });

    try {
      const newVote = await voteService.createVote(playerId, matchId);
      
      // ✅ Actualizar estado local
      dispatch({ type: 'ADD_VOTE', payload: { vote: newVote } });
      
      return newVote;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al votar';
      dispatch({ type: 'SET_ERROR', payload: { type: 'voting', value: errorMessage } });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'voting', value: false } });
    }
  }, []);

  // ✅ FUNCIÓN PARA OBTENER ESTADÍSTICAS
  const fetchMatchStatistics = useCallback(async (matchId: string): Promise<VoteStatistics[]> => {
    // Verificar si ya tenemos las estadísticas en cache
    if (state.matchStatistics[matchId]) {
      return state.matchStatistics[matchId];
    }

    dispatch({ type: 'SET_LOADING', payload: { type: 'statistics', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { type: 'statistics', value: null } });

    try {
      const statistics = await voteService.getMatchStats(matchId);
      
      // ✅ Guardar en cache
      dispatch({ 
        type: 'SET_MATCH_STATISTICS', 
        payload: { matchId, statistics } 
      });
      
      return statistics;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al obtener estadísticas';
      dispatch({ type: 'SET_ERROR', payload: { type: 'statistics', value: errorMessage } });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'statistics', value: false } });
    }
  }, [state.matchStatistics]);

  // ✅ FUNCIÓN PARA REFRESCAR TODOS LOS DATOS
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      fetchMatches(true),
      // Aquí podrías agregar más funciones de refresh si las necesitas
    ]);
  }, [fetchMatches]);

  // ✅ FUNCIÓN PARA LIMPIAR ERRORES
  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const clearError = useCallback((type: 'matches' | 'voting' | 'statistics') => {
    dispatch({ type: 'SET_ERROR', payload: { type, value: null } });
  }, []);

  // ✅ EFECTO PARA CARGA INICIAL
  useEffect(() => {
    if (!state.hasInitiallyLoaded) {
      fetchMatches();
    }
  }, [fetchMatches, state.hasInitiallyLoaded]);

  // ✅ VALOR MEMOIZADO DEL CONTEXTO
  const contextValue = useMemo(() => ({
    // Estados
    ...state,
    
    // Funciones de matches
    fetchMatches,
    fetchActiveMatches: async () => {
      await fetchMatches();
      return state.activeMatches;
    },
    fetchMatchById: async (id: string) => {
      return await matchService.getMatchById(id);
    },
    fetchLastFinishedMatch: async () => {
      await fetchMatches();
      return state.lastFinishedMatch;
    },
    
    // Funciones de voting
    createVote,
    validateVote: async (matchId: string) => {
      return await voteService.validateVote(matchId);
    },
    fetchMatchStatistics,
    fetchTop3Players: async (matchId: string) => {
      return await voteService.getTop3Players(matchId);
    },
    fetchMatchWinner: async (matchId: string) => {
      return await voteService.getMatchWinner(matchId);
    },
    fetchTotalVotes: async (matchId: string) => {
      return await voteService.getTotalVotes(matchId);
    },
    
    // Funciones de utilidad
    refreshAllData,
    clearErrors,
    clearError
  }), [state, fetchMatches, createVote, fetchMatchStatistics, refreshAllData, clearErrors, clearError]);

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};