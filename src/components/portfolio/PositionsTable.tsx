import { useNavigate } from 'react-router-dom';
import { PositionSummary } from '../../types/apiTypes';
import { formatMoney } from '../../utils/formatMoney';
import { formatPrice } from '../../utils/formatPrice';
import { EmptyState } from '../common/EmptyState';

interface PositionsTableProps {
  positions: PositionSummary[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'OPEN':
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#C6FF2F] text-[#080018]">Live</span>;
    case 'CLOSED':
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#767771] text-white">Closed</span>;
    case 'RESOLVED':
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#3D0C63] text-white">Resolved</span>;
    case 'VOID':
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#767771] text-white">Void</span>;
    default:
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-white/10 text-[#767771]">{status}</span>;
  }
};

export const PositionsTable = ({ positions }: PositionsTableProps) => {
  const navigate = useNavigate();

  if (positions.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          icon="📊"
          title="No positions yet"
          description="Start trading to build your portfolio!"
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left border-b border-white/10">
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider">Market</th>
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider">Status</th>
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">Shares</th>
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">Price</th>
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">Value</th>
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">P&L</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {positions.map((position) => (
            <tr
              key={position.marketId}
              onClick={() => navigate(`/markets/${position.marketId}`)}
              className="cursor-pointer transition-colors hover:bg-white/5"
            >
              <td className="px-5 py-3">
                <div className="text-sm text-[#EAEAF0] max-w-xs truncate hover:text-white transition-colors font-medium">
                  {position.marketTitle}
                </div>
              </td>
              <td className="px-5 py-3">
                {getStatusBadge(position.marketStatus)}
              </td>
              <td className="px-5 py-3 text-right">
                <span className="text-sm text-[#22c55e] font-bold">
                  {position.yesShares.toFixed(2)}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <span className="text-sm text-[#EAEAF0] font-mono">
                  {formatPrice(position.currentPrice)}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <span className="text-sm text-[#EAEAF0] font-bold">
                  ¢{formatMoney(position.marketValue)}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <span className={`text-sm font-bold ${
                  position.unrealizedPnL >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                }`}>
                  {position.unrealizedPnL >= 0 ? '+' : ''}¢{formatMoney(position.unrealizedPnL)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsTable;

