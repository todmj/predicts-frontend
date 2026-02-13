import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './LoginPage';
import * as authHook from '../hooks/useAuth';

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (authHook.useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      logout: vi.fn(),
      isAdmin: false,
    });
  });

  it('should render login form', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should disable submit button when fields are empty', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when fields are filled', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should call login on form submission', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should display error message on login failure', async () => {
    mockLogin.mockRejectedValueOnce({ message: 'Invalid credentials' });
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should show loading state during authentication check', () => {
    (authHook.useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,
      logout: vi.fn(),
      isAdmin: false,
    });

    render(<LoginPage />, { wrapper: createWrapper() });

    // Should show loading spinner, not the form
    expect(screen.queryByRole('heading', { name: /sign in/i })).not.toBeInTheDocument();
  });
});

