import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { getAuthToken, clearAuthToken } from '../api/client';
import { User, AuthState } from '../types/domainTypes';
import { LoginRequest, UserProfileResponse } from '../types/apiTypes';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfileToUser = (profile: UserProfileResponse): User => ({
  id: profile.id,
  username: profile.username,
  role: profile.role === 'ADMIN' ? 'ADMIN' : 'USER',
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          // Fetch full user profile to validate token and get user data
          const profile = await authApi.getCurrentUser();
          setState({
            user: mapProfileToUser(profile),
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Token invalid, clear it
          clearAuthToken();
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Login returns { token, username, role }
      const loginResponse = await authApi.login(credentials);

      // Now fetch full profile to get user ID and other details
      const profile = await authApi.getCurrentUser();

      setState({
        user: mapProfileToUser(profile),
        token: loginResponse.token,
        isAuthenticated: true,
        isLoading: false,
      });
      navigate('/markets');
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authApi.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/login');
  }, [navigate]);

  const isAdmin = state.user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;

