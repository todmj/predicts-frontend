import apiClient from './client';
import { MarketDTO, CreateMarketRequest, ResolveMarketRequest } from '../types/apiTypes';

export const adminApi = {
  /**
   * Create a new market
   * Backend: POST /admin/markets
   */
  createMarket: async (market: CreateMarketRequest): Promise<MarketDTO> => {
    const response = await apiClient.post<MarketDTO>('/admin/markets', market);
    return response.data;
  },

  /**
   * Close a market
   * Backend: POST /admin/markets/{id}/close
   */
  closeMarket: async (marketId: number | string): Promise<MarketDTO> => {
    const response = await apiClient.post<MarketDTO>(`/admin/markets/${marketId}/close`);
    return response.data;
  },

  /**
   * Resolve a market
   * Backend: POST /admin/markets/{id}/resolve
   */
  resolveMarket: async (marketId: number | string, outcome: 'YES' | 'NO'): Promise<MarketDTO> => {
    const request: ResolveMarketRequest = { outcome };
    const response = await apiClient.post<MarketDTO>(`/admin/markets/${marketId}/resolve`, request);
    return response.data;
  },

  /**
   * Void a market
   * Backend: POST /admin/markets/{id}/void
   */
  voidMarket: async (marketId: number | string): Promise<MarketDTO> => {
    const response = await apiClient.post<MarketDTO>(`/admin/markets/${marketId}/void`);
    return response.data;
  },
};

export default adminApi;

