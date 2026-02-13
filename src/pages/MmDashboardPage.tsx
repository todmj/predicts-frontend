import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { mmApi } from '../api/mmApi';
import { LoadingOverlay } from '../components/common/Loading';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { formatMoney } from '../utils/formatMoney';
import { formatPrice } from '../utils/formatPrice';
import { MMState } from '../types/apiTypes';

export const MmDashboardPage = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['mm-summary'],
    queryFn: mmApi.getSummary,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    enabled: isAdmin,
  });

  // Fetch all MM states for the table
  const { data: mmStates } = useQuery({
    queryKey: ['mm-states-all'],
    queryFn: mmApi.getAllMMStates,
    refetchInterval: 10000,
    enabled: isAdmin,
  });

  if (!authLoading && !isAdmin) {
    return <Navigate to="/markets" replace />;
  }

  if (authLoading || isLoading) {
    return (
      <div className="bg-[#F3F3F3] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <LoadingOverlay message="Loading market maker stats..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F3F3F3] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <ErrorDisplay error={error} onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const totalPnL = stats.totalRealisedPnL + stats.totalFeesCollected + stats.totalUnrealisedPnL;

  return (
    <div className="bg-[#F3F3F3] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1C1526] mb-2">Market Maker Dashboard</h1>
          <p className="text-[#767771] text-lg">Track fees, P&L, and market performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#080018] rounded-xl p-5">
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Fees</div>
            <div className="text-xl font-bold text-[#22c55e]">
              ¢{formatMoney(stats.totalFeesCollected)}
            </div>
          </div>

          <div className="bg-[#080018] rounded-xl p-5">
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Realised P&L</div>
            <div className={`text-xl font-bold ${
              stats.totalRealisedPnL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
            }`}>
              {stats.totalRealisedPnL >= 0 ? '+' : ''}¢{formatMoney(stats.totalRealisedPnL)}
            </div>
          </div>

          <div className="bg-[#080018] rounded-xl p-5">
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Unrealised</div>
            <div className={`text-xl font-bold ${
              stats.totalUnrealisedPnL >= 0 ? 'text-[#C6FF2F]' : 'text-[#f59e0b]'
            }`}>
              {stats.totalUnrealisedPnL >= 0 ? '+' : ''}¢{formatMoney(stats.totalUnrealisedPnL)}
            </div>
          </div>

          <div className="bg-[#080018] rounded-xl p-5">
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Active</div>
            <div className="text-xl font-bold text-[#EAEAF0]">
              {stats.activeMarketsCount}
            </div>
          </div>

          <div className="bg-[#080018] rounded-xl p-5">
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Resolved</div>
            <div className="text-xl font-bold text-[#767771]">
              {stats.resolvedMarketsCount}
            </div>
          </div>
        </div>

        {/* Total P&L Summary */}
        <div className="bg-[#080018] rounded-xl">
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">P&L Summary</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20">
                <div className="text-xs text-[#767771] mb-1 font-semibold">Net P&L (Realised + Fees)</div>
                <div className={`text-2xl font-bold ${
                  (stats.totalRealisedPnL + stats.totalFeesCollected) >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                }`}>
                  {(stats.totalRealisedPnL + stats.totalFeesCollected) >= 0 ? '+' : ''}
                  ¢{formatMoney(stats.totalRealisedPnL + stats.totalFeesCollected)}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-[#3D0C63]/20 border border-[#3D0C63]/30">
                <div className="text-xs text-[#767771] mb-1 font-semibold">Unrealised</div>
                <div className={`text-2xl font-bold ${
                  stats.totalUnrealisedPnL >= 0 ? 'text-[#C6FF2F]' : 'text-[#f59e0b]'
                }`}>
                  {stats.totalUnrealisedPnL >= 0 ? '+' : ''}
                  ¢{formatMoney(stats.totalUnrealisedPnL)}
                </div>
              </div>
              <div className={`text-center p-4 rounded-lg border ${
                totalPnL >= 0 
                  ? 'bg-[#22c55e]/10 border-[#22c55e]/20' 
                  : 'bg-[#ef4444]/10 border-[#ef4444]/20'
              }`}>
                <div className="text-xs text-[#767771] mb-1 font-semibold">Total</div>
                <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {totalPnL >= 0 ? '+' : ''}¢{formatMoney(totalPnL)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Per-Market MM States */}
        {mmStates && mmStates.length > 0 && (
          <div className="bg-[#080018] rounded-xl mt-6">
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Market Maker Positions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider">Market</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">Fair Price</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">Spread</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">Inventory</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">Total P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {mmStates.map((state: MMState) => {
                  const inventory = parseFloat(state.netInventory);
                  const totalPnL = parseFloat(state.totalPnL);
                  return (
                    <tr
                      key={state.marketId}
                      className="cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => navigate(`/markets/${state.marketId}`)}
                    >
                      <td className="px-5 py-3 text-sm text-[#EAEAF0]">
                        Market #{state.marketId}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm font-mono text-[#EAEAF0] font-medium">
                          {formatPrice(parseFloat(state.fairPrice))}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm font-mono text-[#C6FF2F] font-medium">
                          {(parseFloat(state.currentSpread) * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-sm font-mono font-medium ${
                          inventory > 0 ? 'text-[#22c55e]' : inventory < 0 ? 'text-[#ef4444]' : 'text-[#767771]'
                        }`}>
                          {inventory > 0 ? '+' : ''}{inventory.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-sm font-mono font-bold ${
                          totalPnL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                        }`}>
                          {totalPnL >= 0 ? '+' : ''}¢{totalPnL.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MmDashboardPage;

