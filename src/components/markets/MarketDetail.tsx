import { MarketDTO } from '../../types/apiTypes';
import { formatPrice } from '../../utils/formatPrice';

interface MarketDetailProps {
  market: MarketDTO;
}

const getStatusDisplay = (status: MarketDTO['status'], resolvedOutcome?: 'YES' | 'NO' | null) => {
  switch (status) {
    case 'OPEN':
      return {
        text: 'Live',
        className: 'bg-[#C6FF2F] text-[#080018]',
        icon: null
      };
    case 'CLOSED':
      return { text: 'Closed', className: 'bg-[#767771] text-white', icon: null };
    case 'RESOLVED':
      return {
        text: `Resolved: ${resolvedOutcome}`,
        className: 'bg-[#3D0C63] text-white',
        icon: null
      };
    case 'VOID':
      return { text: 'Void', className: 'bg-[#767771] text-white', icon: null };
    default:
      return { text: status, className: 'bg-[#767771] text-white', icon: null };
  }
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const MarketDetail = ({ market }: MarketDetailProps) => {
  const statusDisplay = getStatusDisplay(market.status, market.resolvedOutcome);

  return (
    <div className="bg-[#080018] rounded-xl">
      <div className="p-6">
        {/* Title and Status */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-bold text-white">{market.title}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex-shrink-0 ${statusDisplay.className}`}>
              {statusDisplay.icon}
              {statusDisplay.text}
            </span>
          </div>
          {market.tradeable && (
            <span className="inline-flex items-center gap-2 text-xs text-[#C6FF2F] font-semibold">
              <span className="w-2 h-2 bg-[#C6FF2F] rounded-full animate-pulse" />
              Open for trading
            </span>
          )}
        </div>

        {/* Description */}
        {market.description && (
          <p className="text-[#EAEAF0] text-base mb-6 leading-relaxed">
            {market.description}
          </p>
        )}

        {/* Price Tags - More prominent Top of Book */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 px-5 py-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#22c55e] uppercase tracking-wider font-semibold">Yes</span>
              <span className="text-2xl font-bold text-[#22c55e]">{formatPrice(market.yesPrice)}</span>
            </div>
          </div>
          <div className="flex-1 px-5 py-4 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#ef4444] uppercase tracking-wider font-semibold">No</span>
              <span className="text-2xl font-bold text-[#ef4444]">{formatPrice(market.noPrice)}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 border-t border-white/10">
          <div>
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Opens</div>
            <div className="text-xs text-[#EAEAF0]">{formatDateTime(market.opensAt)}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Closes</div>
            <div className="text-xs text-[#EAEAF0]">{formatDateTime(market.closesAt)}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Creator</div>
            <div className="text-xs text-[#C6FF2F]">{market.createdBy}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">ID</div>
            <div className="text-xs text-[#EAEAF0] font-mono">#{market.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;

