import apiClient from './client';
import { TradeRequest, TradeQuoteResponse, TradeResponse } from '../types/apiTypes';

export const tradingApi = {
  /**
   * Request a quote for a trade
   * Backend endpoint: POST /trade/quote
   */
  getQuote: async (request: TradeRequest): Promise<TradeQuoteResponse> => {
    const response = await apiClient.post<TradeQuoteResponse>('/trade/quote', request);
    return response.data;
  },

  /**
   * Execute a trade
   * Backend endpoint: POST /trade/execute
   */
  executeTrade: async (request: TradeRequest): Promise<TradeResponse> => {
    const response = await apiClient.post<TradeResponse>('/trade/execute', request);
    return response.data;
  },
};

export default tradingApi;

