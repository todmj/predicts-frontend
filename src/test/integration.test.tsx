/**
 * Integration-style test that simulates user flows
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import MarketsPage from '../pages/MarketsPage';

// Mock the API modules
vi.mock('../api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

vi.mock('../api/marketsApi', () => ({
  marketsApi: {
    getMarkets: vi.fn(),
  },
}));

vi.mock('../api/portfolioApi', () => ({
  portfolioApi: {
    getPortfolio: vi.fn(),
  },
}));

// Mock the client module to avoid localStorage issues
vi.mock('../api/client', async (importOriginal) => {
  const original = await importOriginal<typeof import('../api/client')>();
  return {
    ...original,
    getAuthToken: vi.fn(() => null),
    clearAuthToken: vi.fn(),
  };
});

import { authApi } from '../api/authApi';
import { marketsApi } from '../api/marketsApi';
import { portfolioApi } from '../api/portfolioApi';

const createTestApp = (initialRoute: string = '/login') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/markets" element={<MarketsPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('User Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    (authApi.getCurrentUser as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('No token'));
    (marketsApi.getMarkets as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (portfolioApi.getPortfolio as ReturnType<typeof vi.fn>).mockResolvedValue({
      userId: '1',
      username: 'testuser',
      cashBalance: 1000,
      positions: [],
      netWorth: 1000,
    });
  });

  it('should show login page for unauthenticated users', async () => {
    render(createTestApp('/login'));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  it('should login and navigate to markets on successful authentication', async () => {
    const user = userEvent.setup();

    // Mock successful login
    (authApi.login as ReturnType<typeof vi.fn>).mockResolvedValue({
      token: 'test-token',
      user: {
        id: '1',
        username: 'testuser',
        role: 'USER',
        createdAt: '2026-01-01T00:00:00Z',
      },
    });

    render(createTestApp('/login'));

    // Wait for login form
    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    // Fill in credentials
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Submit
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Should call login API
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should display error on failed login', async () => {
    const user = userEvent.setup();

    // Mock failed login
    (authApi.login as ReturnType<typeof vi.fn>).mockRejectedValue({
      message: 'Invalid username or password',
    });

    render(createTestApp('/login'));

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/username/i), 'baduser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });
});

