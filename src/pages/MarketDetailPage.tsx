import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../hooks/useMarkets';
import { useOrderBook } from '../hooks/useOrderBook';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAuth } from '../hooks/useAuth';
import { MarketDetail } from '../components/markets/MarketDetail';
import { OrderBook, RecentTrades } from '../components/trading/OrderBook';
import { OrderEntry } from '../components/trading/OrderEntry';
import { MyOrders } from '../components/trading/MyOrders';
import { MarketControls } from '../components/admin/MarketControls';
import { MMControls } from '../components/admin/MMControls';
import { Button } from '../components/common/Button';
import { LoadingOverlay } from '../components/common/Loading';
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { formatMoney } from '../utils/formatMoney';
import { formatPrice } from '../utils/formatPrice';

export const MarketDetailPage = () => {
  const { marketId } = useParams<{ marketId: string }>();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const { data: market, isLoading, error, refetch } = useMarket(marketId ? parseInt(marketId) : 0);
  const { data: portfolio } = usePortfolio();

  // Order book with WebSocket
  const {
    bids,
    asks,
    recentTrades,
    bestBid,
    bestAsk,
    midPrice,
    spread,
    lastTradePrice,
    wsConnected
  } = useOrderBook(marketId ? parseInt(marketId) : 0, {
    enabled: !!marketId && !!market?.tradeable,
  });

  const position = portfolio?.positions.find((p) => String(p.marketId) === marketId);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <LoadingOverlay message="Loading market..." />
        </div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <ErrorDisplay error={error || 'Market not found'} onRetry={() => refetch()} />
          <Button variant="outline" className="mt-4" onClick={() => navigate('/markets')}>
            ← Back to Markets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F3F3] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/markets')}
            className="flex items-center gap-2 text-sm text-[#767771] hover:text-[#1C1526] font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Markets
          </button>

          {/* WebSocket status indicator */}
          {market.tradeable && (
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-[#C6FF2F]' : 'bg-[#767771]'}`} />
              <span className="text-[#767771]">{wsConnected ? 'Live' : 'Polling'}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <MarketDetail market={market} />

          {/* Order Book */}
          {market.tradeable && (
            <OrderBook
              bids={bids}
              asks={asks}
              lastTradePrice={lastTradePrice}
              spread={spread}
            />
          )}

          {/* Recent Trades */}
          {market.tradeable && recentTrades.length > 0 && (
            <RecentTrades trades={recentTrades} />
          )}

          {/* User's Position */}
          {position && (
            <div className="bg-[#080018] rounded-xl">
              <div className="px-5 py-4 border-b border-white/10">
                <h2 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Your Position</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20">
                    <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Shares</div>
                    <div className="text-lg font-bold text-[#22c55e]">
                      {position.yesShares.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Price</div>
                    <div className="text-lg font-bold text-[#EAEAF0]">
                      {formatPrice(position.currentPrice)}
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[#3D0C63]/20 border border-[#3D0C63]/30">
                    <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">Value</div>
                    <div className="text-lg font-bold text-[#EAEAF0]">
                      ¢{formatMoney(position.marketValue)}
                    </div>
                  </div>
                  <div className={`text-center p-3 rounded-lg border ${
                    position.unrealizedPnL >= 0 
                      ? 'bg-[#22c55e]/10 border-[#22c55e]/20' 
                      : 'bg-[#ef4444]/10 border-[#ef4444]/20'
                  }`}>
                    <div className="text-[10px] text-[#767771] uppercase tracking-wider mb-1 font-semibold">P&L</div>
                    <div className={`text-lg font-bold ${
                      position.unrealizedPnL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                    }`}>
                      {position.unrealizedPnL >= 0 ? '+' : ''}¢{formatMoney(position.unrealizedPnL)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Entry */}
          {market.tradeable && (
            <OrderEntry
              marketId={market.id}
              bestBid={bestBid}
              bestAsk={bestAsk}
              midPrice={midPrice}
              onOrderPlaced={() => refetch()}
            />
          )}

          {/* My Orders */}
          {market.tradeable && user && (
            <MyOrders marketId={market.id} userId={user.id} />
          )}

          {/* Trading Closed */}
          {!market.tradeable && (
            <div className="bg-[#080018] rounded-xl p-6">
              <div className="text-center py-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#767771]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm text-[#EAEAF0] font-medium mb-1">Trading is closed</p>
                <p className="text-xs text-[#767771]">This market is no longer accepting orders.</p>
              </div>
            </div>
          )}

          {isAdmin && <MarketControls market={market} />}
          {isAdmin && market.tradeable && <MMControls marketId={market.id} />}
        </div>
      </div>
    </div>
    </div>
  );
};

export default MarketDetailPage;

