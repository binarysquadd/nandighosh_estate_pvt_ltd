import { dummyProjects } from '@/lib/dummy-data';

export default function DashboardPage() {
  // Calculate analytics
  const totalProjects = dummyProjects.length;
  const activeProjects = dummyProjects.filter(p => p.status === 'In Progress').length;
  const completedProjects = dummyProjects.filter(p => p.status === 'Completed').length;
  
  const totalBudget = dummyProjects.reduce((sum, p) => {
    return sum + parseFloat(p.budget.replace(/[₹\sCr]/g, ''));
  }, 0);
  
  const totalSpent = dummyProjects.reduce((sum, p) => {
    return sum + parseFloat(p.spent.replace(/[₹\sCr]/g, ''));
  }, 0);
  
  const totalUnits = dummyProjects.reduce((sum, p) => sum + p.totalUnits, 0);
  const soldUnits = dummyProjects.reduce((sum, p) => sum + p.soldUnits, 0);

  return (
    <>
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{totalProjects}</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Active Projects</p>
            <p className="text-2xl font-semibold text-blue-600 mt-1">{activeProjects}</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-semibold text-green-600 mt-1">{completedProjects}</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Units Sold</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{soldUnits}/{totalUnits}</p>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Budget Overview</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-xl font-semibold text-gray-900">₹{totalBudget.toFixed(1)} Cr</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-semibold text-gray-900">₹{totalSpent.toFixed(1)} Cr</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-xl font-semibold text-gray-900">₹{(totalBudget - totalSpent).toFixed(1)} Cr</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {dummyProjects
                .flatMap(p => p.recentUpdates.map(u => ({ ...u, projectName: p.name })))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((update, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-gray-900 font-medium">{update.projectName}</p>
                    <p className="text-gray-600">{update.update}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{update.date}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}