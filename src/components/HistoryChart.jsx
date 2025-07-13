import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HistoryChart = ({ data }) => {
  const chartRef = useRef(null);

  // Generate sample historical data (in a real app, this would come from API)
  const generateHistoricalData = () => {
    const days = 30;
    const labels = [];
    const portfolioValues = [];
    const costBasisValues = [];
    
    const today = new Date();
    const currentValue = data.totalValue;
    const currentCost = data.totalCost;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Simulate some volatility around current values
      const volatility = 0.1;
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      
      portfolioValues.push(currentValue * randomFactor);
      costBasisValues.push(currentCost); // Cost basis remains relatively stable
    }
    
    return { labels, portfolioValues, costBasisValues };
  };

  const historicalData = generateHistoricalData();

  const chartData = {
    labels: historicalData.labels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: historicalData.portfolioValues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'rgb(59, 130, 246)',
        pointRadius: 3,
        pointHoverRadius: 6
      },
      {
        label: 'Cost Basis',
        data: historicalData.costBasisValues,
        borderColor: 'rgb(107, 114, 128)',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointBackgroundColor: 'rgb(107, 114, 128)',
        pointBorderColor: 'rgb(107, 114, 128)',
        pointRadius: 2,
        pointHoverRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Value Over Time</h3>
        <p className="text-sm text-gray-600">
          Track your portfolio performance compared to your cost basis
        </p>
      </div>
      
      <div className="chart-container">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>Last 30 days</span>
        <span>Values in USD</span>
      </div>
    </div>
  );
};

export default HistoryChart;
