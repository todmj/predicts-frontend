import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import MarketsPage from './pages/MarketsPage';
import MarketDetailPage from './pages/MarketDetailPage';
import PortfolioPage from './pages/PortfolioPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import MmDashboardPage from './pages/MmDashboardPage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/markets"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MarketsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/markets/:marketId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MarketDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PortfolioPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LeaderboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mm-dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MmDashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Redirect root to markets */}
            <Route path="/" element={<Navigate to="/markets" replace />} />

            {/* 404 - redirect to markets */}
            <Route path="*" element={<Navigate to="/markets" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

