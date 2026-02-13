import apiClient from './client';
import { MarketMakerSummary, MarketMakerPnLResponse, MMState, SeedOrdersRequest } from '../types/apiTypes';

export const mmApi = {
  /**
   * Get market maker summary statistics
   * Backend endpoint: GET /mm/summary
   */
  getSummary: async (): Promise<MarketMakerSummary> => {
    const response = await apiClient.get<MarketMakerSummary>('/mm/summary');
    return response.data;
  },

  /**
   * Get market maker stats for a specific market (legacy)
   * Backend endpoint: GET /mm/markets/{id}
   */
  getMarketPnL: async (marketId: number | string): Promise<MarketMakerPnLResponse> => {
    const response = await apiClient.get<MarketMakerPnLResponse>(`/mm/markets/${marketId}`);
    return response.data;
  },

  // ===========================================
  // V3 DYNAMIC MARKET MAKER ENDPOINTS
  // ===========================================

  /**
   * Get MM state for a specific market
   * Backend endpoint: GET /admin/mm/{id}/state
   */
  getMMState: async (marketId: number): Promise<MMState> => {
    const response = await apiClient.get<MMState>(`/admin/mm/${marketId}/state`);
    return response.data;
  },

  /**
   * Get all MM states
   * Backend endpoint: GET /admin/mm/all
   */
  getAllMMStates: async (): Promise<MMState[]> => {
    const response = await apiClient.get<MMState[]>('/admin/mm/all');
    return response.data;
  },

  /**
   * Seed orders for a market
   * Backend endpoint: POST /admin/mm/seed
   */
  seedOrders: async (request: SeedOrdersRequest): Promise<void> => {
    await apiClient.post('/admin/mm/seed', request);
  },

  /**
   * Update fair price for a market
   * Backend endpoint: POST /admin/mm/{id}/fair-price?price=X
   */
  setFairPrice: async (marketId: number, price: string): Promise<void> => {
    await apiClient.post(`/admin/mm/${marketId}/fair-price`, null, {
      params: { price }
    });
  },

  /**
   * Force requote for a market
   * Backend endpoint: POST /admin/mm/{id}/requote
   */
  requote: async (marketId: number): Promise<void> => {
    await apiClient.post(`/admin/mm/${marketId}/requote`);
  },
};

export default mmApi;

