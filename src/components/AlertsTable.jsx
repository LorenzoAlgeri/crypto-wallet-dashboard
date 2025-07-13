import React, { useState } from 'react';
import useAlerts from '../hooks/useAlerts';

const AlertsTable = ({ portfolioData, loading }) => {
  const { alerts, addAlert, removeAlert, toggleAlert } = useAlerts();
  
  const [formData, setFormData] = useState({
    symbol: '',
    highThreshold: '',
    lowThreshold: '',
    costBasis: '',
    priceTarget: '',
    emailNotification: false
  });

  // Estrai i token disponibili dai dati del portfolio
  const availableTokens = React.useMemo(() => {
    if (!portfolioData || !portfolioData.assets) return [];
    
    return portfolioData.assets.map(asset => ({
      symbol: asset.symbol,
      name: asset.name || asset.symbol,
      currentPrice: asset.currentPrice || 0
    }));
  }, [portfolioData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.symbol) {
      alert('Please select a token');
      return;
    }

    addAlert(
      formData.symbol,
      formData.highThreshold,
      formData.lowThreshold,
      formData.costBasis,
      formData.priceTarget,
      formData.emailNotification
    );

    // Reset form
    setFormData({
      symbol: '',
      highThreshold: '',
      lowThreshold: '',
      costBasis: '',
      priceTarget: '',
      emailNotification: false
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      removeAlert(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form per creare nuovi alert */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Price Alert</h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Token Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token
            </label>
            <select
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">
                {loading ? 'Loading tokens...' : 'Select a token...'}
              </option>
              {availableTokens.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol} - ${token.currentPrice.toFixed(4)}
                </option>
              ))}
            </select>
          </div>

          {/* High Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              High Threshold (%)
            </label>
            <input
              type="number"
              name="highThreshold"
              value={formData.highThreshold}
              onChange={handleInputChange}
              placeholder="e.g. 20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.1"
            />
          </div>

          {/* Low Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Low Threshold (%)
            </label>
            <input
              type="number"
              name="lowThreshold"
              value={formData.lowThreshold}
              onChange={handleInputChange}
              placeholder="e.g. -15"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.1"
            />
          </div>

          {/* Cost Basis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Basis ($)
            </label>
            <input
              type="number"
              name="costBasis"
              value={formData.costBasis}
              onChange={handleInputChange}
              placeholder="e.g. 2500"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
            />
          </div>

          {/* Price Target */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Target ($)
            </label>
            <input
              type="number"
              name="priceTarget"
              value={formData.priceTarget}
              onChange={handleInputChange}
              placeholder="e.g. 3000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
            />
          </div>

          {/* Email Notification */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="emailNotification"
              checked={formData.emailNotification}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Email Notification
            </label>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Alert
            </button>
          </div>
        </form>
      </div>

      {/* Tabella degli alert esistenti */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Price Alerts</h3>
        </div>
        
        {alerts.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No price alerts set up yet. Create your first alert above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    High %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Low %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost Basis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alerts.map(alert => (
                  <tr key={alert.id} className={!alert.isActive ? 'opacity-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {alert.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.highThreshold > 0 ? `+${alert.highThreshold}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.lowThreshold < 0 ? `${alert.lowThreshold}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.costBasis > 0 ? `$${alert.costBasis.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.priceTarget > 0 ? `$${alert.priceTarget.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.emailNotification ? '✅' : '❌'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        alert.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.isActive ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`${
                          alert.isActive 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {alert.isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsTable;
