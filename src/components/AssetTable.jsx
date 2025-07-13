import React, { useState } from 'react';
import Papa from 'papaparse';

const AssetTable = ({ data }) => {
  const [sortBy, setSortBy] = useState('value');
  const [sortOrder, setSortOrder] = useState('desc');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value, decimals = 6) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const assets = data.assets || [];
    const csvData = assets.map(asset => ({
      Symbol: asset.symbol,
      Name: asset.name,
      Balance: asset.balance,
      Price: asset.price,
      Value: asset.value,
      'Avg Cost': asset.avgCost,
      'Unrealized P/L': asset.unrealizedPL,
      Network: asset.network,
      Address: asset.address
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `portfolio-assets-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const sortedAssets = [...(data.assets || [])].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'symbol':
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      case 'balance':
        aValue = a.balance;
        bValue = b.balance;
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'value':
        aValue = a.value;
        bValue = b.value;
        break;
      case 'avgCost':
        aValue = a.avgCost;
        bValue = b.avgCost;
        break;
      case 'unrealizedPL':
        aValue = a.unrealizedPL;
        bValue = b.unrealizedPL;
        break;
      default:
        aValue = a.value;
        bValue = b.value;
    }

    if (typeof aValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return <span className="text-gray-400">↕️</span>;
    }
    return <span className="text-primary-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  if (!data.assets || data.assets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets</h3>
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <div className="text-lg font-medium">No assets found</div>
          <div className="text-sm">Your portfolio assets will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {data.assets.length} asset{data.assets.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th 
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center space-x-1">
                  <span>Asset</span>
                  <SortIcon column="symbol" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('balance')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Balance</span>
                  <SortIcon column="balance" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Price</span>
                  <SortIcon column="price" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Value</span>
                  <SortIcon column="value" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('avgCost')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Avg Cost</span>
                  <SortIcon column="avgCost" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('unrealizedPL')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Unrealized P/L</span>
                  <SortIcon column="unrealizedPL" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map((asset, index) => (
              <tr 
                key={`${asset.symbol}-${asset.address}-${index}`}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {asset.symbol?.slice(0, 2) || '??'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{asset.symbol}</div>
                      <div className="text-sm text-gray-500">{asset.name}</div>
                      <div className="text-xs text-gray-400">{asset.network}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="font-medium text-gray-900">
                    {formatNumber(asset.balance)}
                  </div>
                  <div className="text-sm text-gray-500">{asset.symbol}</div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="font-medium text-gray-900">
                    {asset.price > 0 ? formatCurrency(asset.price) : '-'}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="font-medium text-gray-900">
                    {formatCurrency(asset.value)}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="font-medium text-gray-900">
                    {asset.avgCost > 0 ? formatCurrency(asset.avgCost) : '-'}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className={`font-medium ${
                    asset.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(asset.unrealizedPL)}
                  </div>
                  <div className={`text-sm ${
                    asset.unrealizedPL >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {asset.unrealizedPL >= 0 ? '📈' : '📉'}
                    {asset.avgCost > 0 ? 
                      ` ${((asset.unrealizedPL / (asset.balance * asset.avgCost)) * 100).toFixed(2)}%` 
                      : ''
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span>Click column headers to sort</span>
        <span>Values in USD</span>
      </div>
    </div>
  );
};

export default AssetTable;
