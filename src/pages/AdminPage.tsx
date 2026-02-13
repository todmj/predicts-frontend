import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMarkets } from '../hooks/useMarkets';
import { CreateMarketForm } from '../components/admin/CreateMarketForm';
import { AdminMarketList } from '../components/admin/AdminMarketList';
import { LoadingOverlay } from '../components/common/Loading';

export const AdminPage = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { data: markets, isLoading: marketsLoading } = useMarkets();

  if (!authLoading && !isAdmin) {
    return <Navigate to="/markets" replace />;
  }

  return (
    <div className="bg-[#F3F3F3] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1C1526] mb-2">Admin Dashboard</h1>
          <p className="text-[#767771] text-lg">Manage markets and view statistics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Market Form */}
          <div className="lg:col-span-1">
            <CreateMarketForm />
          </div>

          {/* Markets List */}
          <div className="lg:col-span-2">
            <div className="bg-[#080018] rounded-xl">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-[#C6FF2F] text-sm font-bold uppercase tracking-wider">All Markets</h2>
                {markets && (
                  <span className="text-xs text-[#767771] font-medium">
                    {markets.length} market{markets.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {marketsLoading ? (
                <LoadingOverlay message="Loading markets..." />
              ) : markets ? (
                <AdminMarketList markets={markets} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

