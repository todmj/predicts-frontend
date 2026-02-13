import apiClient from './client';
import { MarketDTO, CreateMarketRequest } from '../types/apiTypes';

export const marketsApi = {
  /**
   * Get all markets
   */
  getMarkets: async (): Promise<MarketDTO[]> => {
    const response = await apiClient.get<MarketDTO[]>('/markets');
    return response.data;
  },

  /**
   * Get a single market by ID
   */
  getMarket: async (marketId: number | string): Promise<MarketDTO> => {
    const response = await apiClient.get<MarketDTO>(`/markets/${marketId}`);
    return response.data;
  },

  /**
   * Get open markets only
   */
  getOpenMarkets: async (): Promise<MarketDTO[]> => {
    const markets = await marketsApi.getMarkets();
    return markets.filter(m => m.status === 'OPEN');
  },
};

export default marketsApi;

