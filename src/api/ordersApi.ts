import apiClient from './client';
import { OrderBookResponse, OrderRequest, OrderResponse } from '../types/apiTypes';

export const ordersApi = {
  /**
   * Get order book for a market
   * Backend endpoint: GET /orders/book/{marketId}
   */
  getOrderBook: async (marketId: number): Promise<OrderBookResponse> => {
    const response = await apiClient.get<OrderBookResponse>(`/orders/book/${marketId}`);
    return response.data;
  },

  /**
   * Place a new order
   * Backend endpoint: POST /orders
   */
  placeOrder: async (request: OrderRequest): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponse>('/orders', request);
    return response.data;
  },

  /**
   * Cancel an order
   * Backend endpoint: DELETE /orders/{orderId}
   */
  cancelOrder: async (orderId: number): Promise<OrderResponse> => {
    const response = await apiClient.delete<OrderResponse>(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Get user's open orders
   * Backend endpoint: GET /orders/my?marketId={marketId}
   */
  getMyOrders: async (marketId?: number): Promise<OrderResponse[]> => {
    const params = marketId ? { marketId } : {};
    const response = await apiClient.get<OrderResponse[]>('/orders/my', { params });
    return response.data;
  },
};

export default ordersApi;

