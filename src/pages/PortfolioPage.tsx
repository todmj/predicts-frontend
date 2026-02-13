import { usePortfolio } from '../hooks/usePortfolio';
import { PositionsTable } from '../components/portfolio/PositionsTable';
import { LoadingOverlay } from '../components/common/Loading';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { formatMoney } from '../utils/formatMoney';

export const PortfolioPage = () => {
  const { data: portfolio, isLoading, error, refetch } = usePortfolio();

  if (isLoading && !portfolio) {
    return (
      <div className="bg-[#F3F3F3] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <LoadingOverlay message="Loading portfolio..." />
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

  if (!portfolio) return null;

  const totalUnrealizedPnL = portfolio.positions.reduce(
    (sum, pos) => sum + pos.unrealizedPnL,
    0
  );

  const totalPositionsValue = portfolio.positions.reduce(
    (sum, pos) => sum + pos.marketValue,
    0
  );

  return (
    <div className="bg-[#F3F3F3] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1C1526] mb-2">Portfolio</h1>
          <p className="text-[#767771] text-lg">Welcome back, <span className="text-[#1C1526] font-semibold">{portfolio.username}</span></p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#080018] rounded-xl p-5">
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Cash Balance</div>
            <div className="text-xl font-bold text-[#22c55e]">
              ¢{formatMoney(portfolio.cashBalance)}
            </div>
          </div>

          <div className="bg-[#080018] rounded-xl p-5">
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Positions Value</div>
            <div className="text-xl font-bold text-[#EAEAF0]">
              ¢{formatMoney(totalPositionsValue)}
            </div>
          </div>

          <div className="bg-[#080018] rounded-xl p-5">
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Net Worth</div>
            <div className="text-xl font-bold text-[#C6FF2F]">
              ¢{formatMoney(portfolio.netWorth)}
            </div>
          </div>

          <div className="bg-[#080018] rounded-xl p-5">
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Unrealized P&L</div>
            <div className={`text-xl font-bold ${
              totalUnrealizedPnL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
            }`}>
              {totalUnrealizedPnL >= 0 ? '+' : ''}¢{formatMoney(totalUnrealizedPnL)}
            </div>
          </div>
        </div>

        {/* Positions */}
        <div className="bg-[#080018] rounded-xl">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Positions</h2>
            <span className="text-xs text-[#767771] font-medium">
              {portfolio.positions.length} position{portfolio.positions.length !== 1 ? 's' : ''}
            </span>
          </div>
          <PositionsTable positions={portfolio.positions} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;

