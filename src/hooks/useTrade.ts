import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tradingApi } from '../api/tradingApi';
import { TradeRequest, TradeQuoteResponse, TradeResponse } from '../types/apiTypes';
import { marketsQueryKeys } from './useMarkets';
import { portfolioQueryKeys } from './usePortfolio';

interface UseTradeState {
  quote: TradeQuoteResponse | null;
  isLoadingQuote: boolean;
  quoteError: Error | null;
  isExecutingTrade: boolean;
  tradeError: Error | null;
  tradeResult: TradeResponse | null;
}

export const useTrade = () => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<UseTradeState>({
    quote: null,
    isLoadingQuote: false,
    quoteError: null,
    isExecutingTrade: false,
    tradeError: null,
    tradeResult: null,
  });

  // Get quote mutation
  const quoteMutation = useMutation({
    mutationFn: tradingApi.getQuote,
    onMutate: () => {
      setState((prev) => ({
        ...prev,
        isLoadingQuote: true,
        quoteError: null,
        quote: null,
      }));
    },
    onSuccess: (data) => {
      setState((prev) => ({
        ...prev,
        isLoadingQuote: false,
        quote: data,
      }));
    },
    onError: (error: Error) => {
      setState((prev) => ({
        ...prev,
        isLoadingQuote: false,
        quoteError: error,
      }));
    },
  });

  // Execute trade mutation
  const tradeMutation = useMutation({
    mutationFn: tradingApi.executeTrade,
    onMutate: () => {
      setState((prev) => ({
        ...prev,
        isExecutingTrade: true,
        tradeError: null,
        tradeResult: null,
      }));
    },
    onSuccess: (data) => {
      setState((prev) => ({
        ...prev,
        isExecutingTrade: false,
        tradeResult: data,
        quote: null, // Clear quote after successful trade
      }));
      // Invalidate market and portfolio queries to refresh data
      queryClient.invalidateQueries({ queryKey: marketsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: marketsQueryKeys.detail(String(data.marketId)) });
      queryClient.invalidateQueries({ queryKey: portfolioQueryKeys.all });
    },
    onError: (error: Error) => {
      setState((prev) => ({
        ...prev,
        isExecutingTrade: false,
        tradeError: error,
      }));
    },
  });

  const requestQuote = useCallback((request: TradeRequest) => {
    quoteMutation.mutate(request);
  }, [quoteMutation]);

  const executeTrade = useCallback((request: TradeRequest) => {
    tradeMutation.mutate(request);
  }, [tradeMutation]);

  const clearQuote = useCallback(() => {
    setState((prev) => ({
      ...prev,
      quote: null,
      quoteError: null,
    }));
  }, []);

  const clearTradeResult = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tradeResult: null,
      tradeError: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      quote: null,
      isLoadingQuote: false,
      quoteError: null,
      isExecutingTrade: false,
      tradeError: null,
      tradeResult: null,
    });
  }, []);

  return {
    ...state,
    requestQuote,
    executeTrade,
    clearQuote,
    clearTradeResult,
    reset,
  };
};

export default useTrade;

