import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { ordersApi } from '../api/ordersApi';
import { webSocketService } from '../api/websocket';
import {
  OrderRequest,
  OrderResponse,
  OrderUpdateMessage
} from '../types/apiTypes';
import { portfolioQueryKeys } from './usePortfolio';
import { orderBookQueryKeys } from './useOrderBook';

export const ordersQueryKeys = {
  all: ['orders'] as const,
  my: (marketId?: number) => marketId
    ? ['orders', 'my', marketId] as const
    : ['orders', 'my'] as const,
};

interface UseOrdersOptions {
  marketId?: number;
  enabled?: boolean;
  userId?: number;
}

export const useOrders = (options: UseOrdersOptions = {}) => {
  const { marketId, enabled = true, userId } = options;
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Fetch user's open orders
  const ordersQuery = useQuery({
    queryKey: ordersQueryKeys.my(marketId),
    queryFn: () => ordersApi.getMyOrders(marketId),
    enabled,
    refetchInterval: 10000, // Fallback polling
  });

  // Subscribe to order updates via WebSocket
  useEffect(() => {
    if (!enabled || !userId) return;

    const setupSubscription = async () => {
      try {
        await webSocketService.connect(userId);

        unsubscribeRef.current = webSocketService.subscribeToUserOrders(
          userId,
          (update: OrderUpdateMessage) => {
            // Update the order in cache
            queryClient.setQueryData<OrderResponse[]>(
              ordersQueryKeys.my(update.marketId),
              (oldOrders) => {
                if (!oldOrders) return oldOrders;
                return oldOrders.map((order) =>
                  order.orderId === update.orderId
                    ? {
                        ...order,
                        status: update.status,
                        filledQuantity: update.filledQuantity,
                        remainingQuantity: update.remainingQuantity,
                      }
                    : order
                ).filter((order) => order.status !== 'CANCELLED' && order.status !== 'FILLED');
              }
            );

            // Also invalidate all orders query
            queryClient.invalidateQueries({ queryKey: ordersQueryKeys.my() });

            // Refresh portfolio when order fills
            if (update.status === 'FILLED' || update.status === 'PARTIAL') {
              queryClient.invalidateQueries({ queryKey: portfolioQueryKeys.all });
            }
          }
        );
      } catch (error) {
        console.error('[useOrders] WebSocket setup failed:', error);
      }
    };

    setupSubscription();

    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [enabled, userId, queryClient]);

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: ordersApi.placeOrder,
    onSuccess: (newOrder) => {
      // Add to orders list
      queryClient.setQueryData<OrderResponse[]>(
        ordersQueryKeys.my(newOrder.marketId),
        (oldOrders) => {
          if (!oldOrders) return [newOrder];
          // Don't add if it's already filled
          if (newOrder.status === 'FILLED') return oldOrders;
          return [newOrder, ...oldOrders];
        }
      );

      // Invalidate order book and portfolio
      queryClient.invalidateQueries({
        queryKey: orderBookQueryKeys.byMarket(newOrder.marketId)
      });
      queryClient.invalidateQueries({ queryKey: portfolioQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.my() });
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: ordersApi.cancelOrder,
    onSuccess: (cancelledOrder) => {
      // Remove from orders list
      queryClient.setQueryData<OrderResponse[]>(
        ordersQueryKeys.my(cancelledOrder.marketId),
        (oldOrders) => {
          if (!oldOrders) return oldOrders;
          return oldOrders.filter((o) => o.orderId !== cancelledOrder.orderId);
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: orderBookQueryKeys.byMarket(cancelledOrder.marketId)
      });
      queryClient.invalidateQueries({ queryKey: portfolioQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.my() });
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,

    // Place order
    placeOrder: (request: OrderRequest) => placeOrderMutation.mutateAsync(request),
    isPlacingOrder: placeOrderMutation.isPending,
    placeOrderError: placeOrderMutation.error,

    // Cancel order
    cancelOrder: (orderId: number) => cancelOrderMutation.mutateAsync(orderId),
    isCancellingOrder: cancelOrderMutation.isPending,
    cancelOrderError: cancelOrderMutation.error,
  };
};

export default useOrders;

