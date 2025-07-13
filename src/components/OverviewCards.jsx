import React from 'react';

const OverviewCards = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    const percentage = data.totalCost > 0 ? (value / data.totalCost) * 100 : 0;
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const cards = [
    {
      title: 'Total Value',
      value: formatCurrency(data.totalValue),
      icon: '💰',
      color: 'blue'
    },
    {
      title: 'Total Cost',
      value: formatCurrency(data.totalCost),
      icon: '📊',
      color: 'gray'
    },
    {
      title: 'Unrealized P/L',
      value: formatCurrency(data.unrealizedPL),
      percentage: formatPercentage(data.unrealizedPL),
      icon: '📈',
      color: data.unrealizedPL >= 0 ? 'green' : 'red',
      isProfit: data.unrealizedPL >= 0
    },
    {
      title: 'Realized P/L',
      value: formatCurrency(data.realizedPL),
      icon: '💸',
      color: data.realizedPL >= 0 ? 'green' : 'red',
      isProfit: data.realizedPL >= 0
    }
  ];

  const getColorClasses = (color, isProfit) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200',
      gray: 'bg-gray-50 border-gray-200',
      green: 'bg-green-50 border-green-200',
      red: 'bg-red-50 border-red-200'
    };

    const iconColorMap = {
      blue: 'text-blue-600',
      gray: 'text-gray-600',
      green: 'text-green-600',
      red: 'text-red-600'
    };

    return {
      background: colorMap[color],
      icon: iconColorMap[color]
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color, card.isProfit);
        
        return (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-sm border p-6 ${colors.background}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.background}`}>
                  <span className={`text-xl ${colors.icon}`}>{card.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${
                    card.color === 'green' ? 'text-green-600' : 
                    card.color === 'red' ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {card.value}
                  </p>
                  {card.percentage && (
                    <p className={`text-sm font-medium ${
                      card.isProfit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.percentage}
                    </p>
                  )}
                </div>
              </div>
              {card.isProfit !== undefined && (
                <div className={`text-2xl ${card.isProfit ? 'text-green-500' : 'text-red-500'}`}>
                  {card.isProfit ? '📈' : '📉'}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;
