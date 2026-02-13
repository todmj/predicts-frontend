import { OrderBookLevel, RecentTrade } from '../../types/apiTypes';
import { formatPrice } from '../../utils/formatPrice';

interface OrderBookProps {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastTradePrice: number | null;
  spread: number | null;
  onPriceClick?: (price: string, side: 'BUY' | 'SELL') => void;
}

export const OrderBook = ({
  bids,
  asks,
  lastTradePrice,
  spread,
  onPriceClick
}: OrderBookProps) => {
  // Calculate max size for depth visualization
  const maxBidSize = Math.max(...bids.map((b) => parseFloat(b.size)), 0);
  const maxAskSize = Math.max(...asks.map((a) => parseFloat(a.size)), 0);
  const maxSize = Math.max(maxBidSize, maxAskSize, 1);

  // Get best bid/ask for top of book display
  const bestBid = bids.length > 0 ? parseFloat(bids[0].price) : null;
  const bestAsk = asks.length > 0 ? parseFloat(asks[0].price) : null;

  // Reverse asks so lowest ask is at bottom (closest to spread)
  const sortedAsks = [...asks].reverse();

  return (
    <div className="bg-[#080018] rounded-xl overflow-hidden">
      {/* Header with Top of Book */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Order Book</h3>
          {spread !== null && spread > 0 && (
            <span className="text-xs text-[#767771] font-medium">
              Spread: {(spread * 100).toFixed(1)}%
            </span>
          )}
        </div>

        {/* Top of Book - Prominent Display */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20">
            <div className="text-[10px] text-[#22c55e] uppercase tracking-wider mb-1 font-semibold">Best Bid</div>
            <div className="text-2xl font-bold text-[#22c55e] font-mono transition-all duration-300">
              {bestBid !== null ? formatPrice(bestBid) : '—'}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20">
            <div className="text-[10px] text-[#ef4444] uppercase tracking-wider mb-1 font-semibold">Best Ask</div>
            <div className="text-2xl font-bold text-[#ef4444] font-mono transition-all duration-300">
              {bestAsk !== null ? formatPrice(bestAsk) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-5 py-2 text-[10px] text-[#767771] uppercase tracking-wider border-b border-white/5 font-semibold">
        <div>Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Orders</div>
      </div>

      {/* Asks (sell orders) - shown in red */}
      <div className="max-h-32 overflow-y-auto">
        {sortedAsks.length === 0 ? (
          <div className="px-5 py-3 text-xs text-[#767771] text-center">No asks</div>
        ) : (
          sortedAsks.map((level, idx) => {
            const size = parseFloat(level.size);
            const depthPercent = (size / maxSize) * 100;

            return (
              <div
                key={`ask-${level.price}-${idx}`}
                className="relative grid grid-cols-3 px-5 py-1.5 text-xs hover:bg-white/5 cursor-pointer transition-all duration-150"
                onClick={() => onPriceClick?.(level.price, 'SELL')}
              >
                {/* Depth bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-[#ef4444]/10 transition-all duration-300"
                  style={{ width: `${depthPercent}%` }}
                />

                <div className="relative text-[#ef4444] font-mono font-medium">
                  {formatPrice(parseFloat(level.price))}
                </div>
                <div className="relative text-right text-[#EAEAF0] font-mono">
                  {parseFloat(level.size).toFixed(1)}
                </div>
                <div className="relative text-right text-[#767771] font-mono">
                  {level.orderCount}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Spread / Last Trade */}
      <div className="px-5 py-3 bg-white/5 border-y border-white/5 flex items-center justify-center gap-4">
        {lastTradePrice !== null ? (
          <>
            <span className="text-xl font-bold text-white font-mono">
              {formatPrice(lastTradePrice)}
            </span>
            <span className="text-xs text-[#767771] font-medium">Last trade</span>
          </>
        ) : (
          <span className="text-sm text-[#767771]">No trades yet</span>
        )}
      </div>

      {/* Bids (buy orders) - shown in green */}
      <div className="max-h-32 overflow-y-auto">
        {bids.length === 0 ? (
          <div className="px-5 py-3 text-xs text-[#767771] text-center">No bids</div>
        ) : (
          bids.map((level, idx) => {
            const size = parseFloat(level.size);
            const depthPercent = (size / maxSize) * 100;

            return (
              <div
                key={`bid-${level.price}-${idx}`}
                className="relative grid grid-cols-3 px-5 py-1.5 text-xs hover:bg-white/5 cursor-pointer transition-all duration-150"
                onClick={() => onPriceClick?.(level.price, 'BUY')}
              >
                {/* Depth bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-[#22c55e]/10 transition-all duration-300"
                  style={{ width: `${depthPercent}%` }}
                />

                <div className="relative text-[#22c55e] font-mono font-medium">
                  {formatPrice(parseFloat(level.price))}
                </div>
                <div className="relative text-right text-[#EAEAF0] font-mono">
                  {parseFloat(level.size).toFixed(1)}
                </div>
                <div className="relative text-right text-[#767771] font-mono">
                  {level.orderCount}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Recent Trades Component
interface RecentTradesProps {
  trades: RecentTrade[];
}

export const RecentTrades = ({ trades }: RecentTradesProps) => {
  if (trades.length === 0) {
    return (
      <div className="bg-[#080018] rounded-xl p-5">
        <h3 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider mb-3">Recent Trades</h3>
        <p className="text-xs text-[#767771] text-center py-4">No trades yet</p>
      </div>
    );
  }

  return (
    <div className="bg-[#080018] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <h3 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Recent Trades</h3>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {trades.map((trade, idx) => (
          <div
            key={`${trade.timestamp}-${idx}`}
            className="px-5 py-2.5 flex items-center justify-between text-xs border-b border-white/5 last:border-0 transition-all duration-150"
          >
            <div className="flex items-center gap-3">
              <span className={`font-mono font-medium ${
                trade.side === 'BUY' ? 'text-[#22c55e]' : 'text-[#ef4444]'
              }`}>
                {formatPrice(parseFloat(trade.price))}
              </span>
              <span className="text-[#767771]">×</span>
              <span className="text-[#EAEAF0] font-mono">
                {parseFloat(trade.size).toFixed(1)}
              </span>
            </div>
            <span className="text-[#767771] font-medium">
              {new Date(trade.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;

