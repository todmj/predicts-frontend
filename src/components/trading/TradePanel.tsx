import { useState, useEffect } from 'react';
import { MarketDTO } from '../../types/apiTypes';
import { TradeSide } from '../../types/domainTypes';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { QuotePreview } from './QuotePreview';
import { useTrade } from '../../hooks/useTrade';
import { usePortfolio } from '../../hooks/usePortfolio';
import { formatMoney } from '../../utils/formatMoney';

interface TradePanelProps {
  market: MarketDTO;
  onTradeComplete?: () => void;
}

export const TradePanel = ({ market, onTradeComplete }: TradePanelProps) => {
  const [side, setSide] = useState<TradeSide>('BUY_YES');
  const [amount, setAmount] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    quote,
    isLoadingQuote,
    quoteError,
    isExecutingTrade,
    tradeError,
    tradeResult,
    requestQuote,
    executeTrade,
    clearQuote,
    clearTradeResult,
    reset,
  } = useTrade();

  const { data: portfolio } = usePortfolio();

  const cashBalance = portfolio?.cashBalance ?? 0;
  const parsedAmount = parseFloat(amount) || 0;
  const isAmountValid = parsedAmount > 0;
  const hasEnoughBalance = side === 'BUY_YES' ? parsedAmount <= cashBalance : true;
  const canTrade = market.tradeable;

  useEffect(() => {
    if (tradeResult) {
      setShowSuccess(true);
      setAmount('');
      onTradeComplete?.();

      const timer = setTimeout(() => {
        setShowSuccess(false);
        clearTradeResult();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [tradeResult, onTradeComplete, clearTradeResult]);

  useEffect(() => {
    clearQuote();
  }, [side, amount, clearQuote]);

  const handleGetQuote = () => {
    if (!isAmountValid || !hasEnoughBalance) return;
    requestQuote({
      marketId: market.id,
      side,
      amount: parsedAmount,
    });
  };

  const handleExecuteTrade = () => {
    if (!quote) return;
    executeTrade({
      marketId: market.id,
      side,
      amount: parsedAmount,
    });
  };

  const handleCancel = () => {
    reset();
    setAmount('');
  };

  if (!canTrade) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="text-center py-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-zinc-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-300 mb-1">Trading is closed</p>
          <p className="text-xs text-zinc-500">This market is no longer accepting trades.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">Trade</h2>
        <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-xs text-emerald-400 font-medium">¢{formatMoney(cashBalance)}</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Success Message */}
        {showSuccess && tradeResult && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-emerald-400 text-sm font-medium">Trade executed!</span>
          </div>
        )}

        {/* Side Selection */}
        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Side</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide('BUY_YES')}
              disabled={!!quote}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                side === 'BUY_YES'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              } ${quote ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Buy YES
            </button>
            <button
              onClick={() => setSide('SELL_YES')}
              disabled={!!quote}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                side === 'SELL_YES'
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              } ${quote ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sell YES
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <Input
          label={side === 'BUY_YES' ? 'Amount (credits)' : 'Shares to sell'}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!!quote}
          error={!hasEnoughBalance && isAmountValid ? 'Insufficient balance' : undefined}
        />

        {/* Quote Preview */}
        {quote && <QuotePreview quote={quote} />}

        {/* Errors */}
        {quoteError && <ErrorDisplay error={quoteError} />}
        {tradeError && <ErrorDisplay error={tradeError} />}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex gap-2">
        {!quote ? (
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleGetQuote}
            isLoading={isLoadingQuote}
            disabled={!isAmountValid || !hasEnoughBalance}
          >
            Get Quote
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={handleCancel}
              disabled={isExecutingTrade}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              className="flex-1"
              onClick={handleExecuteTrade}
              isLoading={isExecutingTrade}
            >
              Confirm
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TradePanel;

