import { useNavigate } from 'react-router-dom';
import { MarketDTO } from '../../types/apiTypes';
import { formatPrice } from '../../utils/formatPrice';
import { EmptyState } from '../common/EmptyState';

interface AdminMarketListProps {
  markets: MarketDTO[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'OPEN':
      return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#C6FF2F] text-[#080018]">LIVE</span>;
    case 'CLOSED':
      return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#767771] text-white">CLOSED</span>;
    case 'RESOLVED':
      return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#3D0C63] text-white">RESOLVED</span>;
    case 'VOID':
      return <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#767771] text-white">VOID</span>;
    default:
      return null;
  }
};

export const AdminMarketList = ({ markets }: AdminMarketListProps) => {
  const navigate = useNavigate();

  if (markets.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No markets created yet"
        description="Create your first market using the form."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left border-b border-white/10">
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider">Title</th>
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider">Status</th>
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">YES</th>
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">Tradeable</th>
            <th className="px-5 py-3 text-[10px] font-semibold text-[#767771] uppercase tracking-wider text-right">Closes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {markets.map((market, index) => (
            <tr
              key={market.id}
              onClick={() => navigate(`/markets/${market.id}`)}
              className="cursor-pointer transition-colors hover:bg-white/5"
            >
              <td className="px-5 py-3">
                <div className="text-[#EAEAF0] font-medium max-w-xs truncate hover:text-white transition-colors">
                  {market.title}
                </div>
              </td>
              <td className="px-5 py-3">
                {getStatusBadge(market.status)}
              </td>
              <td className="px-5 py-3 text-right">
                <span className="text-[#22c55e] font-bold font-mono">
                  {formatPrice(market.yesPrice)}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <span className={market.tradeable ? 'text-[#C6FF2F]' : 'text-[#767771]'}>
                  {market.tradeable ? '✓' : '✗'}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <span className="text-[#767771] text-sm font-medium">
                  {new Date(market.closesAt).toLocaleDateString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMarketList;

