import { useLeaderboard } from '../hooks/usePortfolio';
import { useAuth } from '../hooks/useAuth';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { LoadingOverlay } from '../components/common/Loading';
import { ErrorDisplay } from '../components/common/ErrorDisplay';

export const LeaderboardPage = () => {
  const { data: entries, isLoading, error, refetch } = useLeaderboard();
  const { user } = useAuth();

  return (
    <div className="bg-[#F3F3F3] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#1C1526] mb-2">Leaderboard</h1>
          <p className="text-[#767771] text-lg">Top traders ranked by net worth</p>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-[#080018] rounded-xl">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">Rankings</h2>
            {entries && (
              <span className="text-xs text-[#767771] font-medium">
                {entries.length} trader{entries.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {isLoading && !entries ? (
            <div className="p-8">
              <LoadingOverlay message="Loading leaderboard..." />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorDisplay error={error} onRetry={() => refetch()} />
            </div>
          ) : entries ? (
            <LeaderboardTable entries={entries} currentUsername={user?.username} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

