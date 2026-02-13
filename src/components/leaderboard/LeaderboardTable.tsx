import { LeaderboardEntry } from '../../types/apiTypes';
import { formatMoney } from '../../utils/formatMoney';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUsername?: string;
}

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-[#C6FF2F] text-[#080018]';
    case 2:
      return 'bg-[#EAEAF0] text-[#080018]';
    case 3:
      return 'bg-[#f59e0b] text-[#080018]';
    default:
      return 'bg-white/10 text-[#767771]';
  }
};

export const LeaderboardTable = ({ entries, currentUsername }: LeaderboardTableProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#767771] text-sm">No leaderboard data available yet.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {entries.map((entry) => {
        const isCurrentUser = entry.username === currentUsername;

        return (
          <div
            key={entry.username}
            className={`flex items-center gap-4 px-5 py-4 transition-colors ${
              isCurrentUser ? 'bg-[#3D0C63]/20' : 'hover:bg-white/5'
            }`}
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getRankStyle(entry.rank)}`}>
              {entry.rank}
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#3D0C63] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {entry.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-semibold truncate ${isCurrentUser ? 'text-[#C6FF2F]' : 'text-[#EAEAF0]'}`}>
                  {entry.username}
                  {isCurrentUser && <span className="text-xs ml-1.5 text-[#C6FF2F]/70">(you)</span>}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-bold text-[#C6FF2F]">¢{formatMoney(entry.netWorth)}</div>
              <div className="text-xs text-[#767771] font-medium">
                ¢{formatMoney(entry.cashBalance)} cash
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardTable;

