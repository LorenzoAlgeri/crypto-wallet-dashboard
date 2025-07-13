import React from 'react';
import OverviewCards from './OverviewCards';
import HistoryChart from './HistoryChart';
import AllocationChart from './AllocationChart';
import AssetTable from './AssetTable';

const Dashboard = ({ wallets, portfolioData, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="loading-spinner"></div>
          <span className="text-gray-600">Loading portfolio data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-red-800 font-medium">Error Loading Data</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="loading-spinner"></div>
          <span className="text-gray-600">Preparing dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <OverviewCards data={portfolioData} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoryChart data={portfolioData} />
        <AllocationChart data={portfolioData} />
      </div>

      {/* Assets Table */}
      <AssetTable data={portfolioData} />

      {/* Last Updated */}
      {portfolioData?.lastUpdated && (
        <div className="text-center text-sm text-gray-500">
          Last updated: {portfolioData.lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
