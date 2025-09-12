import { useEffect, useState } from "react";
import { matchService } from "../services";
import type { Match } from "../types";

export const useMatches = () => {
  const [matches, setMatches] = usetState<Match[]>([]);
  const [activeMatches, setActiveMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //obtengo los partidos
  const fectchAllMatches = async () => {
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
}