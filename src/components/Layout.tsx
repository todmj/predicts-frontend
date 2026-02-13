import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePortfolio } from '../hooks/usePortfolio';
import { formatMoney } from '../utils/formatMoney';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { data: portfolio } = usePortfolio();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/markets', label: 'Markets' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  if (isAdmin) {
    navLinks.push({ path: '/admin', label: 'Admin' });
    navLinks.push({ path: '/mm-dashboard', label: 'MM Stats' });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Dark header */}
      <nav className="sticky top-0 z-50 bg-[#080018]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Nav */}
            <div className="flex items-center gap-10">
              <Link to="/markets" className="flex items-center gap-2.5">
                <span className="text-xl font-bold text-white">Predictions</span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'text-[#C6FF2F] bg-white/5'
                        : 'text-[#EAEAF0] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - Balance & User */}
            <div className="flex items-center gap-4">
              {/* Balance */}
              {portfolio && (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5">
                  <span className="text-sm text-[#C6FF2F] font-semibold">
                    ¢{formatMoney(portfolio.cashBalance)}
                  </span>
                </div>
              )}

              {/* User */}
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-[#3D0C63] flex items-center justify-center text-white text-sm font-semibold">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm text-[#EAEAF0] font-medium">{user?.username}</span>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-[#EAEAF0] hover:text-white font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-white/10 px-4 py-2">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive(link.path)
                    ? 'bg-white/10 text-[#C6FF2F]'
                    : 'text-[#EAEAF0] hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="animate-fade-in-up">{children}</main>
    </div>
  );
};

export default Layout;

