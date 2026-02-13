import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types/apiTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Token storage
let authToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  authToken = localStorage.getItem('auth_token');
  return authToken;
};

export const clearAuthToken = (): void => {
  authToken = null;
  localStorage.removeItem('auth_token');
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login on unauthorized
      clearAuthToken();
      window.location.href = '/login';
    }

    // Extract error message from response
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      code: error.response?.data?.code,
      details: error.response?.data?.details,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;

