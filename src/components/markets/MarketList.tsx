import { MarketDTO } from '../../types/apiTypes';
import { MarketCard } from './MarketCard';
import { LoadingOverlay } from '../common/Loading';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { EmptyState } from '../common/EmptyState';

interface MarketListProps {
  markets: MarketDTO[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export const MarketList = ({ markets, isLoading, error, onRetry }: MarketListProps) => {
  if (isLoading && !markets) {
    return <LoadingOverlay message="Loading markets..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} />;
  }

  if (!markets || markets.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No markets available"
        description="Check back soon for new prediction markets!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market, index) => (
        <div
          key={market.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <MarketCard market={market} />
        </div>
      ))}
    </div>
  );
};

export default MarketList;

