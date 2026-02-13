import { TradeQuoteResponse } from '../../types/apiTypes';
import { formatMoney } from '../../utils/formatMoney';
import { formatPrice, formatPriceAsPercentage } from '../../utils/formatPrice';

interface QuotePreviewProps {
  quote: TradeQuoteResponse;
}

export const QuotePreview = ({ quote }: QuotePreviewProps) => {
  const isBuy = quote.side === 'BUY_YES';

  return (
    <div className={`rounded-lg border p-4 ${
      isBuy 
        ? 'bg-emerald-500/5 border-emerald-500/20' 
        : 'bg-red-500/5 border-red-500/20'
    }`}>
      <h3 className={`text-sm font-medium mb-3 flex items-center gap-1.5 ${
        isBuy ? 'text-emerald-400' : 'text-red-400'
      }`}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Quote
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-zinc-500">Shares</span>
          <span className={`font-medium ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}>
            {quote.shares.toFixed(4)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-500">Avg price</span>
          <span className="text-zinc-300">
            {formatPrice(quote.averagePrice)}
            <span className="text-zinc-500 ml-1 text-xs">({formatPriceAsPercentage(quote.averagePrice)})</span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-500">Fee</span>
          <span className="text-amber-400">¢{formatMoney(quote.fee)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-500">{isBuy ? 'Cost' : 'Proceeds'}</span>
          <span className="text-zinc-300">¢{formatMoney(Math.abs(quote.cost))}</span>
        </div>

        <div className="h-px bg-zinc-800 my-2" />

        <div className="flex justify-between items-center">
          <span className="text-zinc-400 font-medium">Total</span>
          <span className={`font-semibold ${
            quote.totalCashImpact >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {quote.totalCashImpact >= 0 ? '+' : ''}¢{formatMoney(quote.totalCashImpact)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-zinc-500">Price after</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-xs">{formatPrice(quote.priceBefore)}</span>
            <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-indigo-400 font-medium">{formatPrice(quote.priceAfter)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;

