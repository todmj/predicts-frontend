import { useNavigate } from 'react-router-dom';
import { MarketDTO } from '../../types/apiTypes';
import { formatPrice } from '../../utils/formatPrice';

interface MarketCardProps {
  market: MarketDTO;
}

const getStatusBadge = (status: MarketDTO['status'], resolvedOutcome?: 'YES' | 'NO' | null) => {
  switch (status) {
    case 'OPEN':
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#C6FF2F] text-[#080018]">
          Live
        </span>
      );
    case 'CLOSED':
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#767771] text-white">
          Closed
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#3D0C63] text-white">
          {resolvedOutcome}
        </span>
      );
    case 'VOID':
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#767771] text-white">
          Void
        </span>
      );
    default:
      return null;
  }
};

const getTimeRemaining = (closesAt: string, status: string) => {
  if (status !== 'OPEN') return null;

  const close = new Date(closesAt);
  const now = new Date();
  const diff = close.getTime() - now.getTime();

  if (diff <= 0) return 'Ending soon';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const MarketCard = ({ market }: MarketCardProps) => {
  const navigate = useNavigate();
  const timeLeft = getTimeRemaining(market.closesAt, market.status);

  return (
    <div
      onClick={() => navigate(`/markets/${market.id}`)}
      className="group bg-[#080018] rounded-xl cursor-pointer hover:shadow-2xl transition-all duration-200 h-full flex flex-col overflow-hidden"
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {getStatusBadge(market.status, market.resolvedOutcome)}
          {timeLeft && (
            <span className="text-[#767771] text-xs font-medium">
              {timeLeft}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[#C6FF2F] text-lg font-bold mb-2 line-clamp-2 leading-tight">
          {market.title}
        </h3>

        {/* Description */}
        {market.description && (
          <p className="text-[#EAEAF0]/70 text-sm line-clamp-2 mb-6 flex-grow">
            {market.description}
          </p>
        )}

        {/* Price Display - Top of Book */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xs text-[#767771] uppercase tracking-wider mb-1">Yes</div>
            <div className="text-xl font-bold text-[#22c55e] font-mono">
              {formatPrice(market.yesPrice)}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-xs text-[#767771] uppercase tracking-wider mb-1">No</div>
            <div className="text-xl font-bold text-[#ef4444] font-mono">
              {formatPrice(market.noPrice)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCard;

