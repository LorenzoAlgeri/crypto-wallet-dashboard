import React from 'react';
import { render } from '@testing-library/react';
import OverviewCards from '../components/OverviewCards.jsx';

describe('OverviewCards', () => {
  const mockData = {
    totalValue: 10000,
    totalCost: 8000,
    unrealizedPL: 2000,
    realizedPL: 500
  };

  const mockDataNegative = {
    totalValue: 6000,
    totalCost: 8000,
    unrealizedPL: -2000,
    realizedPL: -500
  };

  const mockDataZero = {
    totalValue: 0,
    totalCost: 0,
    unrealizedPL: 0,
    realizedPL: 0
  };

  it('renders correctly with positive P/L data', () => {
    const { container } = render(<OverviewCards data={mockData} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with negative P/L data', () => {
    const { container } = render(<OverviewCards data={mockDataNegative} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with zero values', () => {
    const { container } = render(<OverviewCards data={mockDataZero} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays correct formatted currency values', () => {
    const { getByText } = render(<OverviewCards data={mockData} />);
    
    expect(getByText('$10,000.00')).toBeInTheDocument();
    expect(getByText('$8,000.00')).toBeInTheDocument();
    expect(getByText('$2,000.00')).toBeInTheDocument();
    expect(getByText('$500.00')).toBeInTheDocument();
  });

  it('displays correct percentage for unrealized P/L', () => {
    const { getByText } = render(<OverviewCards data={mockData} />);
    
    // 2000 / 8000 * 100 = 25%
    expect(getByText('+25.00%')).toBeInTheDocument();
  });

  it('displays correct icons and colors for positive values', () => {
    const { container } = render(<OverviewCards data={mockData} />);
    
    // Check for profit indicators
    const profitEmojis = container.querySelectorAll('[class*="text-green"]');
    expect(profitEmojis.length).toBeGreaterThan(0);
    
    // Check for trend up emoji
    expect(container.textContent).toContain('📈');
  });

  it('displays correct icons and colors for negative values', () => {
    const { container } = render(<OverviewCards data={mockDataNegative} />);
    
    // Check for loss indicators
    const lossEmojis = container.querySelectorAll('[class*="text-red"]');
    expect(lossEmojis.length).toBeGreaterThan(0);
    
    // Check for trend down emoji
    expect(container.textContent).toContain('📉');
  });

  it('handles zero total cost correctly for percentage calculation', () => {
    const { container } = render(<OverviewCards data={mockDataZero} />);
    
    // Should not throw error and should display 0.00%
    expect(container.textContent).toContain('+0.00%');
  });

  it('renders all four cards', () => {
    const { container } = render(<OverviewCards data={mockData} />);
    
    const cards = container.querySelectorAll('[class*="rounded-lg shadow-sm border p-6"]');
    expect(cards).toHaveLength(4);
  });

  it('displays correct card titles', () => {
    const { getByText } = render(<OverviewCards data={mockData} />);
    
    expect(getByText('Total Value')).toBeInTheDocument();
    expect(getByText('Total Cost')).toBeInTheDocument();
    expect(getByText('Unrealized P/L')).toBeInTheDocument();
    expect(getByText('Realized P/L')).toBeInTheDocument();
  });
});
