import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const AllocationChart = ({ data }) => {
  // Prepare data for the doughnut chart
  const prepareChartData = () => {
    if (!data.assets || data.assets.length === 0) {
      return {
        labels: ['No Assets'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 0
        }]
      };
    }

    // Group assets by symbol and sum their values
    const assetGroups = data.assets.reduce((acc, asset) => {
      if (asset.value > 0) {
        if (acc[asset.symbol]) {
          acc[asset.symbol].value += asset.value;
          acc[asset.symbol].balance += asset.balance;
        } else {
          acc[asset.symbol] = {
            symbol: asset.symbol,
            name: asset.name,
            value: asset.value,
            balance: asset.balance
          };
        }
      }
      return acc;
    }, {});

    const assets = Object.values(assetGroups);
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

    // Sort by value and take top 8 (group others)
    assets.sort((a, b) => b.value - a.value);
    const topAssets = assets.slice(0, 8);
    const otherAssets = assets.slice(8);
    
    if (otherAssets.length > 0) {
      const otherValue = otherAssets.reduce((sum, asset) => sum + asset.value, 0);
      topAssets.push({
        symbol: 'Others',
        name: 'Other Assets',
        value: otherValue,
        balance: 0
      });
    }

    // Color palette
    const colors = [
      '#3b82f6', // Blue (ETH)
      '#f59e0b', // Orange (BTC)
      '#10b981', // Green
      '#8b5cf6', // Purple
      '#ef4444', // Red
      '#06b6d4', // Cyan
      '#84cc16', // Lime
      '#f97316', // Orange
      '#6b7280'  // Gray (Others)
    ];

    const labels = topAssets.map(asset => asset.symbol);
    const values = topAssets.map(asset => asset.value);
    const percentages = topAssets.map(asset => 
      totalValue > 0 ? (asset.value / totalValue * 100) : 0
    );

    return {
      labels,
      values,
      percentages,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, topAssets.length),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }],
      assets: topAssets
    };
  };

  const chartData = prepareChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // We'll create a custom legend
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const asset = chartData.assets[context.dataIndex];
            const percentage = chartData.percentages[context.dataIndex];
            return [
              `${asset.symbol}: $${asset.value.toLocaleString()}`,
              `${percentage.toFixed(1)}% of portfolio`
            ];
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Asset Allocation</h3>
        <p className="text-sm text-gray-600">
          Portfolio distribution by asset value
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center">
        {/* Chart */}
        <div className="w-64 h-64 relative">
          <Doughnut data={chartData} options={options} />
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-2xl font-bold text-gray-900">
              {chartData.assets.length > 1 ? chartData.assets.length - (chartData.assets.find(a => a.symbol === 'Others') ? 1 : 0) : 0}
            </div>
            <div className="text-sm text-gray-500">Assets</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 lg:ml-8 mt-6 lg:mt-0">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {chartData.assets.map((asset, index) => (
              <div key={asset.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{asset.symbol}</div>
                    {asset.symbol !== 'Others' && (
                      <div className="text-sm text-gray-500">
                        {asset.balance.toFixed(6)} {asset.symbol}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {formatCurrency(asset.value)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {chartData.percentages[index].toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.totalValue === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <div>No assets to display</div>
          <div className="text-sm">Add some crypto to see your allocation</div>
        </div>
      )}
    </div>
  );
};

export default AllocationChart;
