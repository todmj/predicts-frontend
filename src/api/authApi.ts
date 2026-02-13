import apiClient, { setAuthToken, clearAuthToken } from './client';
import { LoginRequest, LoginResponse, UserProfileResponse } from '../types/apiTypes';

export const authApi = {
  /**
   * Login with username and password
   * Returns: { token, username, role }
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    // Store token after successful login
    setAuthToken(response.data.token);
    return response.data;
  },

  /**
   * Logout - clear stored token
   */
  logout: (): void => {
    clearAuthToken();
  },

  /**
   * Get current user profile
   * Returns full profile with positions, balance, etc.
   */
  getCurrentUser: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/me');
    return response.data;
  },
};

export default authApi;

