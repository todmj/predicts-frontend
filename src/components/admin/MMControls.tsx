import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mmApi } from '../../api/mmApi';
import { MMState } from '../../types/apiTypes';
import { Button } from '../common/Button';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { formatPrice } from '../../utils/formatPrice';
import { orderBookQueryKeys } from '../../hooks/useOrderBook';

interface MMControlsProps {
  marketId: number;
}

export const MMControls = ({ marketId }: MMControlsProps) => {
  const queryClient = useQueryClient();
  const [newFairPrice, setNewFairPrice] = useState('');
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Fetch MM state
  const { data: mmState, isLoading, error, refetch } = useQuery({
    queryKey: ['mm-state', marketId],
    queryFn: () => mmApi.getMMState(marketId),
    refetchInterval: 5000,
  });

  // Set fair price mutation
  const setFairPriceMutation = useMutation({
    mutationFn: (price: string) => mmApi.setFairPrice(marketId, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mm-state', marketId] });
      queryClient.invalidateQueries({ queryKey: orderBookQueryKeys.byMarket(marketId) });
      setNewFairPrice('');
      showSuccessMessage('Fair price updated');
    },
  });

  // Requote mutation
  const requoteMutation = useMutation({
    mutationFn: () => mmApi.requote(marketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mm-state', marketId] });
      queryClient.invalidateQueries({ queryKey: orderBookQueryKeys.byMarket(marketId) });
      showSuccessMessage('Orders requoted');
    },
  });

  const showSuccessMessage = (msg: string) => {
    setShowSuccess(msg);
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleSetFairPrice = () => {
    const price = parseFloat(newFairPrice);
    if (price >= 0.01 && price <= 0.99) {
      setFairPriceMutation.mutate(price.toFixed(2));
    }
  };

  const mutationError = setFairPriceMutation.error || requoteMutation.error;

  return (
    <div className="bg-[#080018] rounded-xl">
      <div className="px-5 py-4 border-b border-white/10">
        <h3 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Market Maker Controls</h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Success Message */}
        {showSuccess && (
          <div className="p-2 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs text-center font-semibold">
            {showSuccess}
          </div>
        )}

        {/* Error */}
        {mutationError && <ErrorDisplay error={mutationError as Error} />}

        {/* MM State */}
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-[#3D0C63] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <ErrorDisplay error={error as Error} onRetry={() => refetch()} />
        ) : mmState ? (
          <div className="space-y-3">
            {/* Fair Price & Spread */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-white/5 text-center">
                <div className="text-[10px] text-[#767771] uppercase font-semibold">Fair Price</div>
                <div className="text-lg font-bold text-[#EAEAF0] font-mono">
                  {formatPrice(parseFloat(mmState.fairPrice))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 text-center">
                <div className="text-[10px] text-[#767771] uppercase font-semibold">Spread</div>
                <div className="text-lg font-bold text-[#C6FF2F] font-mono">
                  {(parseFloat(mmState.currentSpread) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#767771] font-semibold">Net Inventory</span>
                <span className={`text-sm font-mono font-bold ${
                  parseFloat(mmState.netInventory) > 0 
                    ? 'text-[#22c55e]' 
                    : parseFloat(mmState.netInventory) < 0 
                      ? 'text-[#ef4444]' 
                      : 'text-[#767771]'
                }`}>
                  {parseFloat(mmState.netInventory) > 0 ? '+' : ''}
                  {parseFloat(mmState.netInventory).toFixed(2)}
                </span>
              </div>
            </div>

            {/* P&L */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-[10px] text-[#767771] font-semibold">Realized</div>
                <div className={`text-xs font-mono font-bold ${
                  parseFloat(mmState.realizedPnL) >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                }`}>
                  {parseFloat(mmState.realizedPnL) >= 0 ? '+' : ''}
                  {parseFloat(mmState.realizedPnL).toFixed(2)}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-[10px] text-[#767771] font-semibold">Unrealized</div>
                <div className={`text-xs font-mono font-bold ${
                  parseFloat(mmState.unrealizedPnL) >= 0 ? 'text-[#C6FF2F]' : 'text-[#f59e0b]'
                }`}>
                  {parseFloat(mmState.unrealizedPnL) >= 0 ? '+' : ''}
                  {parseFloat(mmState.unrealizedPnL).toFixed(2)}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-[10px] text-[#767771] font-semibold">Fees</div>
                <div className="text-xs font-mono font-bold text-[#22c55e]">
                  +{parseFloat(mmState.feesEarned).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Set Fair Price */}
        <div>
          <label className="block text-xs text-[#EAEAF0] uppercase tracking-wider mb-2 font-semibold">
            Adjust Fair Price
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0.01"
              max="0.99"
              step="0.01"
              value={newFairPrice}
              onChange={(e) => setNewFairPrice(e.target.value)}
              placeholder={mmState?.fairPrice || '0.50'}
              className="flex-1 px-3 py-2 bg-[#080018] border border-white/10 rounded-lg text-[#EAEAF0] text-sm font-mono focus:outline-none focus:border-[#C6FF2F] focus:ring-2 focus:ring-[#C6FF2F]/20"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleSetFairPrice}
              disabled={!newFairPrice || setFairPriceMutation.isPending}
              isLoading={setFairPriceMutation.isPending}
            >
              Set
            </Button>
          </div>
          <p className="mt-1 text-[10px] text-[#767771]">
            MM will shift quotes toward this price
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => requoteMutation.mutate()}
            isLoading={requoteMutation.isPending}
          >
            Force Requote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MMControls;

