import { useMatch } from '../contexts/MatchContext';

export const useMatches = () => {
  return useMatch();
};