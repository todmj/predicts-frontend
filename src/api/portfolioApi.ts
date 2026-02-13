import apiClient from './client';
import { UserProfileResponse, LeaderboardEntry } from '../types/apiTypes';

export const portfolioApi = {
  /**
   * Get current user's portfolio (via /me endpoint)
   * The backend returns portfolio data as part of user profile
   */
  getPortfolio: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/me');
    return response.data;
  },

  /**
   * Get leaderboard
   */
  getLeaderboard: async (limit?: number): Promise<LeaderboardEntry[]> => {
    const response = await apiClient.get<LeaderboardEntry[]>('/leaderboard', {
      params: limit ? { limit } : undefined,
    });
    return response.data;
  },
};

export default portfolioApi;

