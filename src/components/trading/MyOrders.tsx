import { OrderResponse } from '../../types/apiTypes';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatPrice';
import { useOrders } from '../../hooks/useOrders';

interface MyOrdersProps {
  marketId?: number;
  userId?: number;
}

export const MyOrders = ({ marketId, userId }: MyOrdersProps) => {
  const { orders, isLoading, cancelOrder, isCancellingOrder } = useOrders({
    marketId,
    userId,
    enabled: true
  });

  // Filter to only open/partial orders
  const activeOrders = orders.filter(
    (o) => o.status === 'OPEN' || o.status === 'PARTIAL'
  );

  if (isLoading) {
    return (
      <div className="bg-[#080018] rounded-xl p-4">
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-2 border-[#3D0C63] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <div className="bg-[#080018] rounded-xl">
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">My Orders</h3>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs text-[#767771]">No open orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#080018] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">My Orders</h3>
        <span className="text-xs text-[#767771] font-medium">{activeOrders.length} open</span>
      </div>

      <div className="divide-y divide-white/5">
        {activeOrders.map((order) => (
          <OrderRow
            key={order.orderId}
            order={order}
            onCancel={() => cancelOrder(order.orderId)}
            isCancelling={isCancellingOrder}
          />
        ))}
      </div>
    </div>
  );
};

interface OrderRowProps {
  order: OrderResponse;
  onCancel: () => void;
  isCancelling: boolean;
}

const OrderRow = ({ order, onCancel, isCancelling }: OrderRowProps) => {
  const isBuy = order.side === 'BUY_YES';
  const filled = parseFloat(order.filledQuantity);
  const total = parseFloat(order.quantity);
  const fillPercent = total > 0 ? (filled / total) * 100 : 0;

  return (
    <div className="px-4 py-3 flex items-center gap-3">
      {/* Side indicator */}
      <div className={`w-1 h-10 rounded-full ${isBuy ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />

      {/* Order details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold ${isBuy ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
            {isBuy ? 'BUY' : 'SELL'}
          </span>
          <span className="text-xs text-[#767771] font-medium">
            {order.type}
          </span>
          {order.status === 'PARTIAL' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] font-bold">
              PARTIAL
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#EAEAF0] font-mono font-medium">
            {formatPrice(parseFloat(order.price))}
          </span>
          <span className="text-[#767771]">×</span>
          <span className="text-[#767771] font-mono">
            {parseFloat(order.remainingQuantity).toFixed(2)}
          </span>
          {filled > 0 && (
            <span className="text-[#767771]">
              ({filled.toFixed(2)} filled)
            </span>
          )}
        </div>

        {/* Fill progress bar */}
        {fillPercent > 0 && (
          <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#22c55e] transition-all"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Cancel button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        disabled={isCancelling}
        className="text-[#767771] hover:text-[#ef4444]"
      >
        {isCancelling ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </Button>
    </div>
  );
};

export default MyOrders;

