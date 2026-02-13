import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MarketDTO } from '../../types/apiTypes';
import { Button } from '../common/Button';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { adminApi } from '../../api/adminApi';
import { marketsQueryKeys } from '../../hooks/useMarkets';
import { formatPrice } from '../../utils/formatPrice';

interface MarketControlsProps {
  market: MarketDTO;
}

export const MarketControls = ({ market }: MarketControlsProps) => {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState<'close' | 'resolveYes' | 'resolveNo' | 'void' | null>(null);

  const closeMutation = useMutation({
    mutationFn: () => adminApi.closeMarket(market.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: marketsQueryKeys.detail(String(market.id)) });
      setShowConfirm(null);
    },
  });

  const resolveMutation = useMutation({
    mutationFn: (resolution: 'YES' | 'NO') => adminApi.resolveMarket(market.id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: marketsQueryKeys.detail(String(market.id)) });
      setShowConfirm(null);
    },
  });

  const voidMutation = useMutation({
    mutationFn: () => adminApi.voidMarket(market.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: marketsQueryKeys.detail(String(market.id)) });
      setShowConfirm(null);
    },
  });

  const error = closeMutation.error || resolveMutation.error || voidMutation.error;
  const isLoading = closeMutation.isPending || resolveMutation.isPending || voidMutation.isPending;

  const handleAction = () => {
    switch (showConfirm) {
      case 'close':
        closeMutation.mutate();
        break;
      case 'resolveYes':
        resolveMutation.mutate('YES');
        break;
      case 'resolveNo':
        resolveMutation.mutate('NO');
        break;
      case 'void':
        voidMutation.mutate();
        break;
    }
  };

  const confirmConfig = {
    close: { message: 'Close this market? Trading will be stopped.' },
    resolveYes: { message: 'Resolve as YES? This cannot be undone.' },
    resolveNo: { message: 'Resolve as NO? This cannot be undone.' },
    void: { message: 'Void this market? All positions will be refunded.' },
  };

  return (
    <div className="bg-[#080018] rounded-xl">
      <div className="px-5 py-4 border-b border-white/10">
        <h3 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Admin Controls</h3>
      </div>
      <div className="p-5">
        {error && <ErrorDisplay error={error as Error} className="mb-4" />}

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="p-3 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30 mb-4">
            <p className="text-[#f59e0b] text-sm mb-3 font-medium">{confirmConfig[showConfirm].message}</p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleAction}
                isLoading={isLoading}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}

        {/* Market Info */}
        <div className="text-sm space-y-2 mb-4 p-3 rounded-lg bg-white/5">
          <div className="flex justify-between">
            <span className="text-[#767771] font-medium">Status</span>
            <span className="text-[#EAEAF0] font-bold">{market.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#767771] font-medium">YES Price</span>
            <span className="text-[#22c55e] font-bold">{formatPrice(market.yesPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#767771] font-medium">Tradeable</span>
            <span className={market.tradeable ? 'text-[#C6FF2F] font-bold' : 'text-[#767771]'}>
              {market.tradeable ? 'Yes' : 'No'}
            </span>
          </div>
          {market.resolvedOutcome && (
            <div className="flex justify-between">
              <span className="text-[#767771] font-medium">Resolution</span>
              <span className="text-[#3D0C63] font-bold">{market.resolvedOutcome}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {market.status === 'OPEN' && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowConfirm('close')}
              disabled={!!showConfirm}
            >
              Close Market
            </Button>
          )}

          {market.status === 'CLOSED' && (
            <>
              <Button
                variant="success"
                size="sm"
                className="w-full"
                onClick={() => setShowConfirm('resolveYes')}
                disabled={!!showConfirm}
              >
                Resolve YES
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => setShowConfirm('resolveNo')}
                disabled={!!showConfirm}
              >
                Resolve NO
              </Button>
            </>
          )}

          {(market.status === 'OPEN' || market.status === 'CLOSED') && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setShowConfirm('void')}
              disabled={!!showConfirm}
            >
              Void Market
            </Button>
          )}

          {market.status === 'RESOLVED' && (
            <p className="text-center text-[#767771] text-sm py-4">
              ✓ Resolved as <span className="text-[#C6FF2F] font-bold">{market.resolvedOutcome}</span>
            </p>
          )}

          {market.status === 'VOID' && (
            <p className="text-center text-[#767771] text-sm py-4">
              This market has been voided.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketControls;

