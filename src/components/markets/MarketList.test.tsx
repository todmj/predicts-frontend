import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MarketList } from './MarketList';
import { MarketDTO } from '../../types/apiTypes';

const mockMarkets: MarketDTO[] = [
  {
    id: 1,
    title: 'Will Bitcoin reach $100k?',
    description: 'Market for Bitcoin price prediction',
    status: 'OPEN',
    yesPrice: 0.65,
    noPrice: 0.35,
    tradeable: true,
    opensAt: '2026-01-01T00:00:00Z',
    closesAt: '2026-12-31T23:59:59Z',
    createdAt: '2026-01-01T00:00:00Z',
    createdBy: 'admin',
  },
  {
    id: 2,
    title: 'Will it rain tomorrow?',
    description: 'Weather prediction market',
    status: 'CLOSED',
    yesPrice: 0.5,
    noPrice: 0.5,
    tradeable: false,
    opensAt: '2026-02-01T00:00:00Z',
    closesAt: '2026-02-10T23:59:59Z',
    createdAt: '2026-02-01T00:00:00Z',
    createdBy: 'admin',
  },
  {
    id: 3,
    title: 'Election outcome',
    description: 'Political prediction',
    status: 'RESOLVED',
    resolvedOutcome: 'YES',
    yesPrice: 1.0,
    noPrice: 0.0,
    tradeable: false,
    opensAt: '2026-01-01T00:00:00Z',
    closesAt: '2026-01-15T23:59:59Z',
    createdAt: '2026-01-01T00:00:00Z',
    createdBy: 'admin',
  },
];

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('MarketList', () => {
  it('should render loading state', () => {
    renderWithRouter(
      <MarketList markets={undefined} isLoading={true} error={null} />
    );
    expect(screen.getByText(/loading markets/i)).toBeInTheDocument();
  });

  it('should render error state', () => {
    const error = new Error('Failed to fetch markets');
    const onRetry = vi.fn();
    renderWithRouter(
      <MarketList markets={undefined} isLoading={false} error={error} onRetry={onRetry} />
    );
    expect(screen.getByText(/failed to fetch markets/i)).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it('should render empty state', () => {
    renderWithRouter(
      <MarketList markets={[]} isLoading={false} error={null} />
    );
    expect(screen.getByText(/no markets available/i)).toBeInTheDocument();
  });

  it('should render markets list', () => {
    renderWithRouter(
      <MarketList markets={mockMarkets} isLoading={false} error={null} />
    );

    expect(screen.getByText('Will Bitcoin reach $100k?')).toBeInTheDocument();
    expect(screen.getByText('Will it rain tomorrow?')).toBeInTheDocument();
    expect(screen.getByText('Election outcome')).toBeInTheDocument();
  });

  it('should display market status badges', () => {
    renderWithRouter(
      <MarketList markets={mockMarkets} isLoading={false} error={null} />
    );

    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.getByText('YES')).toBeInTheDocument();
  });

  it('should display market prices', () => {
    renderWithRouter(
      <MarketList markets={mockMarkets} isLoading={false} error={null} />
    );

    // Check for YES price of first market (0.65) - shown as price format 0.65
    expect(screen.getByText('0.65')).toBeInTheDocument();
  });
});

