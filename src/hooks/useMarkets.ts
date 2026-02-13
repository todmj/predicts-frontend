import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { marketsApi } from '../api/marketsApi';
import { MarketDTO } from '../types/apiTypes';

const MARKETS_QUERY_KEY = 'markets';
const MARKET_QUERY_KEY = 'market';

// Polling interval in milliseconds (5-10 seconds as specified)
const POLLING_INTERVAL = 7000;

export const useMarkets = (options?: Omit<UseQueryOptions<MarketDTO[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<MarketDTO[], Error>({
    queryKey: [MARKETS_QUERY_KEY],
    queryFn: marketsApi.getMarkets,
    refetchInterval: POLLING_INTERVAL,
    // Pause polling when tab is not visible to avoid hammering backend
    refetchIntervalInBackground: false,
    staleTime: 5000,
    ...options,
  });
};

export const useMarket = (
  marketId: string | number,
  options?: Omit<UseQueryOptions<MarketDTO, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<MarketDTO, Error>({
    queryKey: [MARKET_QUERY_KEY, marketId],
    queryFn: () => marketsApi.getMarket(marketId),
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: 5000,
    enabled: !!marketId,
    ...options,
  });
};

export const useOpenMarkets = (options?: Omit<UseQueryOptions<MarketDTO[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<MarketDTO[], Error>({
    queryKey: [MARKETS_QUERY_KEY, 'open'],
    queryFn: marketsApi.getOpenMarkets,
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: 5000,
    ...options,
  });
};

export const marketsQueryKeys = {
  all: [MARKETS_QUERY_KEY] as const,
  detail: (id: string) => [MARKET_QUERY_KEY, id] as const,
  open: [MARKETS_QUERY_KEY, 'open'] as const,
};

