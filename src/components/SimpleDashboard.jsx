import React from 'react';
import usePortfolioData from '../hooks/usePortfolioData';

const SimpleDashboard = ({ wallets }) => {
  const portfolioData = usePortfolioData(wallets);

  console.log('🎯 SimpleDashboard render:', { 
    wallets, 
    loading: portfolioData.loading, 
    error: portfolioData.error,
    assetsCount: portfolioData.assets?.length || 0,
    totalValue: portfolioData.totalValue
  });

  if (portfolioData.loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="loading-spinner"></div>
            <span className="text-gray-600">Loading portfolio data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (portfolioData.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-red-800 font-medium">Error Loading Data</h3>
            <p className="text-red-700 text-sm mt-1">{portfolioData.error}</p>
            <button
              onClick={portfolioData.refresh}
              className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(portfolioData.totalValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(portfolioData.totalCost)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Unrealized P&L</h3>
              <p className={`text-2xl font-bold ${portfolioData.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolioData.unrealizedPL)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Assets</h3>
              <p className="text-2xl font-bold text-gray-900">
                {portfolioData.assets?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Portfolio Assets</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {portfolioData.assets && portfolioData.assets.length > 0 ? (
            portfolioData.assets.map((asset, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                    <p className="text-sm text-gray-500">{asset.symbol} on {asset.network}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {asset.balance.toFixed(6)} {asset.symbol}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(asset.value)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No assets found</p>
            </div>
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
        <strong>Debug Info:</strong>
        <br />
        • Wallets: {JSON.stringify(wallets)}
        <br />
        • Assets: {portfolioData.assets?.length || 0}
        <br />
        • Total Value: {formatCurrency(portfolioData.totalValue || 0)}
        <br />
        • Loading: {portfolioData.loading ? 'Yes' : 'No'}
        <br />
        • Error: {portfolioData.error || 'None'}
        <br />
        • Last Updated: {portfolioData.lastUpdated?.toLocaleString() || 'Never'}
      </div>
    </div>
  );
};

export default SimpleDashboard;
