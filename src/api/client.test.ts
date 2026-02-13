/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock localStorage before importing client
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('API Client', () => {
  describe('Token Management', () => {
    beforeEach(async () => {
      // Reset mocks and store
      vi.resetModules();
      localStorageMock.store = {};
      vi.clearAllMocks();
    });

    it('should set auth token in memory and localStorage', async () => {
      const { setAuthToken, getAuthToken } = await import('./client');

      setAuthToken('test-token-123');

      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'test-token-123');
      expect(getAuthToken()).toBe('test-token-123');
    });

    it('should clear auth token from memory and localStorage', async () => {
      const { setAuthToken, clearAuthToken, getAuthToken } = await import('./client');

      setAuthToken('test-token');
      clearAuthToken();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(getAuthToken()).toBeNull();
    });

    it('should set null token and remove from localStorage', async () => {
      const { setAuthToken } = await import('./client');

      setAuthToken('test-token');
      setAuthToken(null);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    });

    it('should return token from memory if available', async () => {
      const { setAuthToken, getAuthToken } = await import('./client');

      setAuthToken('memory-token');

      // Token should be in memory
      expect(getAuthToken()).toBe('memory-token');
    });
  });
});

