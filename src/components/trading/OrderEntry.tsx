import { useState, useEffect, useCallback, useMemo } from 'react';
import { OrderSide, OrderType, OrderRequest } from '../../types/apiTypes';
import { Button } from '../common/Button';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { formatMoney } from '../../utils/formatMoney';
import { formatPrice } from '../../utils/formatPrice';
import { useOrders } from '../../hooks/useOrders';
import { usePortfolio } from '../../hooks/usePortfolio';

interface OrderEntryProps {
  marketId: number;
  bestBid: number | null;
  bestAsk: number | null;
  midPrice: number | null;
  onOrderPlaced?: () => void;
}

export const OrderEntry = ({
  marketId,
  bestBid,
  bestAsk,
  midPrice,
  onOrderPlaced
}: OrderEntryProps) => {
  const [side, setSide] = useState<OrderSide>('BUY_YES');
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { placeOrder, isPlacingOrder, placeOrderError } = useOrders({ marketId });
  const { data: portfolio } = usePortfolio();

  const cashBalance = portfolio?.cashBalance ?? 0;

  // Get user's position for this market
  const position = portfolio?.positions.find((p) => p.marketId === marketId);
  const yesShares = position?.yesShares ?? 0;

  // Parse values
  const parsedPrice = parseFloat(price) || 0;
  const parsedQuantity = parseFloat(quantity) || 0;

  // Determine if order will cross (trade immediately) or rest on book
  const willCross = useMemo(() => {
    if (orderType === 'MARKET') return true;
    if (!parsedPrice) return false;

    if (side === 'BUY_YES' && bestAsk !== null) {
      return parsedPrice >= bestAsk;
    }
    if (side === 'SELL_YES' && bestBid !== null) {
      return parsedPrice <= bestBid;
    }
    return false;
  }, [side, orderType, parsedPrice, bestAsk, bestBid]);

  // Calculate estimated cost/proceeds
  const estimatedCost = side === 'BUY_YES'
    ? parsedPrice * parsedQuantity
    : 0;
  const estimatedProceeds = side === 'SELL_YES'
    ? parsedPrice * parsedQuantity
    : 0;

  // Validation
  const isPriceValid = orderType === 'MARKET' || (parsedPrice > 0 && parsedPrice < 1);
  const isQuantityValid = parsedQuantity > 0;
  const hasEnoughBalance = side === 'BUY_YES' ? estimatedCost <= cashBalance : true;
  const hasEnoughShares = side === 'SELL_YES' ? parsedQuantity <= yesShares : true;
  const canSubmit = isPriceValid && isQuantityValid && hasEnoughBalance && hasEnoughShares;

  // Set price to best bid/ask when changing side
  useEffect(() => {
    if (side === 'BUY_YES' && bestAsk) {
      setPrice(bestAsk.toFixed(2));
    } else if (side === 'SELL_YES' && bestBid) {
      setPrice(bestBid.toFixed(2));
    }
  }, [side, bestBid, bestAsk]);

  // Quick price buttons
  const setQuickPrice = useCallback((type: 'best' | 'mid' | 'improve') => {
    if (type === 'mid' && midPrice) {
      setPrice(midPrice.toFixed(2));
    } else if (type === 'best') {
      if (side === 'BUY_YES' && bestAsk) {
        setPrice(bestAsk.toFixed(2));
      } else if (side === 'SELL_YES' && bestBid) {
        setPrice(bestBid.toFixed(2));
      }
    } else if (type === 'improve') {
      // Improve by 1 cent
      if (side === 'BUY_YES' && bestBid) {
        setPrice((bestBid + 0.01).toFixed(2));
      } else if (side === 'SELL_YES' && bestAsk) {
        setPrice((bestAsk - 0.01).toFixed(2));
      }
    }
  }, [side, bestBid, bestAsk, midPrice]);

  // Handle submit
  const handleSubmit = async () => {
    if (!canSubmit) return;

    const request: OrderRequest = {
      marketId,
      side,
      type: orderType,
      quantity: parsedQuantity.toFixed(2),
      ...(orderType === 'LIMIT' && { price: parsedPrice.toFixed(2) }),
    };

    try {
      await placeOrder(request);
      setShowSuccess(true);
      setQuantity('');
      onOrderPlaced?.();
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      // Error is handled by placeOrderError
    }
  };

  return (
    <div className="bg-[#080018] rounded-xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Place Order</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#767771] font-medium">Balance:</span>
          <span className="text-xs text-[#C6FF2F] font-bold">
            ¢{formatMoney(cashBalance)}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Success Message */}
        {showSuccess && (
          <div className="p-3 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-[#22c55e] text-sm font-semibold">Order placed!</span>
          </div>
        )}

        {/* Error */}
        {placeOrderError && <ErrorDisplay error={placeOrderError} />}

        {/* Side Selection */}
        <div>
          <label className="block text-xs text-[#EAEAF0] uppercase tracking-wider mb-2 font-semibold">Side</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide('BUY_YES')}
              className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                side === 'BUY_YES'
                  ? 'bg-[#22c55e] text-white'
                  : 'bg-white/5 text-[#EAEAF0] hover:bg-white/10'
              }`}
            >
              Buy YES
            </button>
            <button
              onClick={() => setSide('SELL_YES')}
              className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                side === 'SELL_YES'
                  ? 'bg-[#ef4444] text-white'
                  : 'bg-white/5 text-[#EAEAF0] hover:bg-white/10'
              }`}
            >
              Sell YES
            </button>
          </div>
          {side === 'SELL_YES' && (
            <p className="mt-2 text-xs text-[#EAEAF0]">
              You have <span className="text-[#C6FF2F] font-semibold">{yesShares.toFixed(1)}</span> YES shares
            </p>
          )}
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-xs text-[#EAEAF0] uppercase tracking-wider mb-2 font-semibold">Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOrderType('LIMIT')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                orderType === 'LIMIT'
                  ? 'bg-[#3D0C63] text-white'
                  : 'bg-white/5 text-[#EAEAF0] hover:bg-white/10'
              }`}
            >
              Limit
            </button>
            <button
              onClick={() => setOrderType('MARKET')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                orderType === 'MARKET'
                  ? 'bg-[#3D0C63] text-white'
                  : 'bg-white/5 text-[#EAEAF0] hover:bg-white/10'
              }`}
            >
              Market
            </button>
          </div>
        </div>

        {/* Price Input (for LIMIT orders) */}
        {orderType === 'LIMIT' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-[#EAEAF0] uppercase tracking-wider font-semibold">Price</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setQuickPrice('best')}
                  className="px-2 py-1 text-[10px] text-[#EAEAF0] hover:text-white bg-white/5 hover:bg-white/10 rounded font-semibold"
                >
                  Best
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPrice('mid')}
                  className="px-2 py-1 text-[10px] text-[#EAEAF0] hover:text-white bg-white/5 hover:bg-white/10 rounded font-semibold"
                >
                  Mid
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPrice('improve')}
                  className="px-2 py-1 text-[10px] text-[#EAEAF0] hover:text-white bg-white/5 hover:bg-white/10 rounded font-semibold"
                >
                  +1¢
                </button>
              </div>
            </div>
            <input
              type="number"
              min="0.01"
              max="0.99"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.50"
              className="block w-full px-4 py-3 bg-[#080018] border border-white/10 rounded-lg text-white placeholder-[#767771] text-sm font-mono focus:outline-none focus:border-[#C6FF2F] focus:ring-2 focus:ring-[#C6FF2F]/20"
            />
            {!isPriceValid && price && (
              <p className="mt-1.5 text-xs text-[#ef4444] font-medium">Price must be between 0.01 and 0.99</p>
            )}
          </div>
        )}

        {/* Quantity Input */}
        <div>
          <label className="block text-xs text-[#EAEAF0] uppercase tracking-wider mb-2 font-semibold">Quantity</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="10.00"
            className="block w-full px-4 py-3 bg-[#080018] border border-white/10 rounded-lg text-white placeholder-[#767771] text-sm font-mono focus:outline-none focus:border-[#C6FF2F] focus:ring-2 focus:ring-[#C6FF2F]/20"
          />
          {!hasEnoughBalance && isQuantityValid && (
            <p className="mt-1.5 text-xs text-[#ef4444] font-medium">Insufficient balance</p>
          )}
          {!hasEnoughShares && isQuantityValid && (
            <p className="mt-1.5 text-xs text-[#ef4444] font-medium">Insufficient shares</p>
          )}
        </div>

        {/* Order Preview with Cross/Rest Indicator */}
        {isQuantityValid && isPriceValid && (
          <div className="space-y-3">
            {/* Trade Type Indicator */}
            <div className={`p-3 rounded-lg border ${
              willCross 
                ? 'bg-[#C6FF2F]/10 border-[#C6FF2F]/30' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {willCross ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#C6FF2F] animate-pulse" />
                    <span className="text-[#C6FF2F] text-xs font-bold uppercase tracking-wider">Trades Immediately</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#767771]" />
                    <span className="text-[#767771] text-xs font-bold uppercase tracking-wider">Rests on Book</span>
                  </>
                )}
              </div>
              <p className="text-[#EAEAF0] text-xs">
                {willCross
                  ? 'Your order will execute against existing orders'
                  : 'Your order will wait for someone to trade against it'
                }
              </p>
            </div>

            {/* Cost/Proceeds */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#EAEAF0] font-medium">
                  {side === 'BUY_YES' ? 'Est. Cost' : 'Est. Proceeds'}
                </span>
                <span className={`font-bold ${side === 'BUY_YES' ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
                  {side === 'BUY_YES' ? '-' : '+'}¢{formatMoney(side === 'BUY_YES' ? estimatedCost : estimatedProceeds)}
                </span>
              </div>
              {orderType === 'LIMIT' && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#767771]">Price × Qty</span>
                  <span className="text-[#EAEAF0] font-mono">
                    {formatPrice(parsedPrice)} × {parsedQuantity.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="px-5 pb-5">
        <Button
          variant="primary"
          className={`w-full ${side === 'BUY_YES' ? '!bg-[#22c55e] hover:!bg-[#16a34a]' : '!bg-[#ef4444] hover:!bg-[#dc2626]'}`}
          onClick={handleSubmit}
          isLoading={isPlacingOrder}
          disabled={!canSubmit}
        >
          {willCross ? '⚡ ' : ''}{side === 'BUY_YES' ? 'Buy' : 'Sell'} {parsedQuantity > 0 ? `${parsedQuantity.toFixed(1)} YES` : 'YES'}
        </Button>
      </div>
    </div>
  );
};

export default OrderEntry;

