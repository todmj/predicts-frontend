import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';
import { webSocketService } from '../api/websocket';
import {
  OrderBookResponse,
  OrderBookUpdateMessage,
  TradeMessage,
  RecentTrade
} from '../types/apiTypes';

export const orderBookQueryKeys = {
  all: ['orderBook'] as const,
  byMarket: (marketId: number) => ['orderBook', marketId] as const,
};

interface UseOrderBookOptions {
  enabled?: boolean;
  useWebSocket?: boolean;
}

export const useOrderBook = (marketId: number, options: UseOrderBookOptions = {}) => {
  const { enabled = true, useWebSocket = true } = options;
  const queryClient = useQueryClient();
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const unsubscribeRef = useRef<(() => void)[]>([]);

  // Initial fetch via REST
  const query = useQuery({
    queryKey: orderBookQueryKeys.byMarket(marketId),
    queryFn: () => ordersApi.getOrderBook(marketId),
    enabled: enabled && marketId > 0,
    staleTime: 1000, // Consider data stale after 1 second
    refetchInterval: useWebSocket && wsConnected ? false : 2000, // Fallback polling if WS not connected
  });

  // Update recent trades from initial data
  useEffect(() => {
    if (query.data?.recentTrades) {
      setRecentTrades(query.data.recentTrades);
    }
  }, [query.data?.recentTrades]);

  // WebSocket connection and subscriptions
  useEffect(() => {
    if (!enabled || !useWebSocket || marketId <= 0) return;

    const setupWebSocket = async () => {
      try {
        await webSocketService.connect();
        setWsConnected(true);

        // Subscribe to order book updates
        const unsubOrderBook = webSocketService.subscribeToOrderBook(
          marketId,
          (update: OrderBookUpdateMessage) => {
            queryClient.setQueryData(
              orderBookQueryKeys.byMarket(marketId),
              update.orderBook
            );
            if (update.orderBook.recentTrades) {
              setRecentTrades(update.orderBook.recentTrades);
            }
          }
        );

        // Subscribe to trades
        const unsubTrades = webSocketService.subscribeToTrades(
          marketId,
          (trade: TradeMessage) => {
            setRecentTrades((prev) => {
              const newTrade: RecentTrade = {
                price: trade.price,
                size: trade.size,
                side: trade.takerSide,
                timestamp: trade.timestamp,
              };
              return [newTrade, ...prev.slice(0, 19)]; // Keep last 20 trades
            });
          }
        );

        unsubscribeRef.current = [unsubOrderBook, unsubTrades];
      } catch (error) {
        console.error('[useOrderBook] WebSocket connection failed:', error);
        setWsConnected(false);
      }
    };

    setupWebSocket();

    // Listen for connection changes
    const unsubConnection = webSocketService.onConnectionChange(setWsConnected);

    return () => {
      unsubscribeRef.current.forEach((unsub) => unsub());
      unsubscribeRef.current = [];
      unsubConnection();
    };
  }, [marketId, enabled, useWebSocket, queryClient]);

  // Computed values
  const orderBook = query.data;
  const bestBid = orderBook?.bestBid ? parseFloat(orderBook.bestBid) : null;
  const bestAsk = orderBook?.bestAsk ? parseFloat(orderBook.bestAsk) : null;
  const midPrice = bestBid && bestAsk ? (bestBid + bestAsk) / 2 : null;
  const spread = orderBook?.spread ? parseFloat(orderBook.spread) : null;
  const lastTradePrice = orderBook?.lastTradePrice
    ? parseFloat(orderBook.lastTradePrice)
    : null;

  // Refresh manually
  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: orderBookQueryKeys.byMarket(marketId) });
  }, [queryClient, marketId]);

  return {
    orderBook,
    bids: orderBook?.bids ?? [],
    asks: orderBook?.asks ?? [],
    recentTrades,
    bestBid,
    bestAsk,
    midPrice,
    spread,
    lastTradePrice,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    wsConnected,
    refresh,
  };
};

export default useOrderBook;

