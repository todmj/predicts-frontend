import { useMarkets } from '../hooks/useMarkets';
import { MarketList } from '../components/markets/MarketList';

export const MarketsPage = () => {
  const { data: markets, isLoading, error, refetch } = useMarkets();

  const openCount = markets?.filter(m => m.status === 'OPEN').length ?? 0;
  const closedCount = markets?.filter(m => m.status === 'CLOSED').length ?? 0;
  const resolvedCount = markets?.filter(m => m.status === 'RESOLVED').length ?? 0;

  return (
    <div className="bg-[#F3F3F3] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1C1526] mb-2">Markets</h1>
          <p className="text-[#767771] text-lg">Trade on real-world outcomes</p>
        </div>

        {/* Stats Bar */}
        {markets && markets.length > 0 && (
          <div className="flex items-center gap-8 mb-10">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#1C1526]">{markets.length}</span>
              <span className="text-sm text-[#767771] font-medium">total markets</span>
            </div>
            <div className="w-px h-8 bg-[#E5E5E5]" />
            <div className="flex items-center gap-6 text-sm font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF2F]" />
                <span className="text-[#1C1526]">{openCount} open</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#767771]" />
                <span className="text-[#1C1526]">{closedCount} closed</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3D0C63]" />
                <span className="text-[#1C1526]">{resolvedCount} resolved</span>
              </span>
            </div>
          </div>
        )}

        {/* Markets Grid */}
        <MarketList
          markets={markets}
          isLoading={isLoading}
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    </div>
  );
};

export default MarketsPage;

