import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { portfolioApi } from '../api/portfolioApi';
import { UserProfileResponse, LeaderboardEntry } from '../types/apiTypes';

const PORTFOLIO_QUERY_KEY = 'portfolio';
const LEADERBOARD_QUERY_KEY = 'leaderboard';

// Polling intervals
const PORTFOLIO_POLLING_INTERVAL = 10000;
const LEADERBOARD_POLLING_INTERVAL = 15000;

export const usePortfolio = (options?: Omit<UseQueryOptions<UserProfileResponse, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<UserProfileResponse, Error>({
    queryKey: [PORTFOLIO_QUERY_KEY],
    queryFn: portfolioApi.getPortfolio,
    refetchInterval: PORTFOLIO_POLLING_INTERVAL,
    // Pause polling when tab is not visible
    refetchIntervalInBackground: false,
    staleTime: 5000,
    ...options,
  });
};

export const useLeaderboard = (
  limit?: number,
  options?: Omit<UseQueryOptions<LeaderboardEntry[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<LeaderboardEntry[], Error>({
    queryKey: [LEADERBOARD_QUERY_KEY, limit],
    queryFn: () => portfolioApi.getLeaderboard(limit),
    refetchInterval: LEADERBOARD_POLLING_INTERVAL,
    // Pause polling when tab is not visible
    refetchIntervalInBackground: false,
    staleTime: 10000,
    ...options,
  });
};

export const portfolioQueryKeys = {
  all: [PORTFOLIO_QUERY_KEY] as const,
  leaderboard: (limit?: number) => [LEADERBOARD_QUERY_KEY, limit] as const,
};

