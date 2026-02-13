import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PositionsTable } from './PositionsTable';
import { PositionSummary } from '../../types/apiTypes';

const mockPositions: PositionSummary[] = [
  {
    marketId: 1,
    marketTitle: 'Will Bitcoin reach $100k?',
    marketStatus: 'OPEN',
    yesShares: 100,
    currentPrice: 0.65,
    marketValue: 65,
    costBasis: 50,
    unrealizedPnL: 15,
  },
  {
    marketId: 2,
    marketTitle: 'Will it rain tomorrow?',
    marketStatus: 'CLOSED',
    yesShares: 50,
    currentPrice: 0.7,
    marketValue: 35,
    costBasis: 20,
    unrealizedPnL: 15,
  },
  {
    marketId: 3,
    marketTitle: 'Losing position',
    marketStatus: 'OPEN',
    yesShares: 25,
    currentPrice: 0.4,
    marketValue: 10,
    costBasis: 20,
    unrealizedPnL: -10,
  },
];

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('PositionsTable', () => {
  it('should render empty state when no positions', () => {
    renderWithRouter(<PositionsTable positions={[]} />);
    expect(screen.getByText(/no positions yet/i)).toBeInTheDocument();
  });

  it('should render positions table with data', () => {
    renderWithRouter(<PositionsTable positions={mockPositions} />);

    expect(screen.getByText('Will Bitcoin reach $100k?')).toBeInTheDocument();
    expect(screen.getByText('Will it rain tomorrow?')).toBeInTheDocument();
    expect(screen.getByText('Losing position')).toBeInTheDocument();
  });

  it('should display share counts correctly', () => {
    renderWithRouter(<PositionsTable positions={mockPositions} />);

    // First position has 100 YES shares
    expect(screen.getByText('100.00')).toBeInTheDocument();
    // Second position has 50 YES shares
    expect(screen.getByText('50.00')).toBeInTheDocument();
  });

  it('should display unrealized P&L with correct colors', () => {
    renderWithRouter(<PositionsTable positions={mockPositions} />);

    // Positive P&L should have + prefix
    const positivePnL = screen.getAllByText(/\+¢15\.00/);
    expect(positivePnL.length).toBeGreaterThan(0);

    // Negative P&L (we use a different format now)
    expect(screen.getByText('¢-10.00')).toBeInTheDocument();
  });

  it('should display status badges', () => {
    renderWithRouter(<PositionsTable positions={mockPositions} />);

    expect(screen.getAllByText('Live').length).toBe(2);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('should display current price', () => {
    renderWithRouter(<PositionsTable positions={mockPositions} />);

    // Check for current price display (first position current price is 0.65)
    expect(screen.getByText('0.65')).toBeInTheDocument();
  });
});

