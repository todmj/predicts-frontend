import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TradePanel } from './TradePanel';
import { MarketDTO } from '../../types/apiTypes';
import * as tradeHook from '../../hooks/useTrade';
import * as portfolioHook from '../../hooks/usePortfolio';

// Mock hooks
vi.mock('../../hooks/useTrade', () => ({
  useTrade: vi.fn(),
}));

vi.mock('../../hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
  portfolioQueryKeys: { all: ['portfolio'] },
}));

const mockMarket: MarketDTO = {
  id: 1,
  title: 'Test Market',
  description: 'A test market',
  status: 'OPEN',
  yesPrice: 0.5,
  noPrice: 0.5,
  tradeable: true,
  opensAt: '2026-01-01T00:00:00Z',
  closesAt: '2026-12-31T23:59:59Z',
  createdAt: '2026-01-01T00:00:00Z',
  createdBy: 'admin',
};

const mockQuote = {
  marketId: 1,
  side: 'BUY_YES' as const,
  shares: 180,
  cost: 100,
  fee: 2,
  totalCashImpact: -102,
  averagePrice: 0.52,
  priceBefore: 0.5,
  priceAfter: 0.55,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('TradePanel', () => {
  const mockRequestQuote = vi.fn();
  const mockExecuteTrade = vi.fn();
  const mockClearQuote = vi.fn();
  const mockClearTradeResult = vi.fn();
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (tradeHook.useTrade as ReturnType<typeof vi.fn>).mockReturnValue({
      quote: null,
      isLoadingQuote: false,
      quoteError: null,
      isExecutingTrade: false,
      tradeError: null,
      tradeResult: null,
      requestQuote: mockRequestQuote,
      executeTrade: mockExecuteTrade,
      clearQuote: mockClearQuote,
      clearTradeResult: mockClearTradeResult,
      reset: mockReset,
    });

    (portfolioHook.usePortfolio as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        id: 1,
        username: 'test',
        role: 'USER',
        cashBalance: 1000,
        positions: [],
        netWorth: 1000
      },
      isLoading: false,
      error: null,
    });
  });

  it('should render trade panel for open market', () => {
    render(<TradePanel market={mockMarket} />, { wrapper: createWrapper() });

    expect(screen.getByText('Trade')).toBeInTheDocument();
    expect(screen.getByText('Buy YES')).toBeInTheDocument();
    expect(screen.getByText('Sell YES')).toBeInTheDocument();
    expect(screen.getByText('Get Quote')).toBeInTheDocument();
  });

  it('should show trading closed message for non-tradeable market', () => {
    const closedMarket = { ...mockMarket, tradeable: false };
    render(<TradePanel market={closedMarket} />, { wrapper: createWrapper() });

    expect(screen.getByText('Trading is closed')).toBeInTheDocument();
  });

  it('should display available balance', () => {
    render(<TradePanel market={mockMarket} />, { wrapper: createWrapper() });

    expect(screen.getByText('¢1000.00')).toBeInTheDocument();
  });

  it('should disable Get Quote button when amount is empty', () => {
    render(<TradePanel market={mockMarket} />, { wrapper: createWrapper() });

    const button = screen.getByRole('button', { name: /get quote/i });
    expect(button).toBeDisabled();
  });

  it('should enable Get Quote button when amount is valid', async () => {
    const user = userEvent.setup();
    render(<TradePanel market={mockMarket} />, { wrapper: createWrapper() });

    await user.type(screen.getByRole('spinbutton'), '100');

    const button = screen.getByRole('button', { name: /get quote/i });
    expect(button).not.toBeDisabled();
  });

  it('should show insufficient balance error', async () => {
    const user = userEvent.setup();
    render(<TradePanel market={mockMarket} />, { wrapper: createWrapper() });

    await user.type(screen.getByRole('spinbutton'), '2000');

    expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
  });

  it('should call requestQuote when Get Quote is clicked', async () => {
    const user = userEvent.setup();
    render(<TradePanel market={mockMarket} />, { wrapper: createWrapper() });

    await user.type(screen.getByRole('spinbutton'), '100');
    await user.click(screen.getByRole('button', { name: /get quote/i }));

    expect(mockRequestQuote).toHaveBeenCalledWith({
      marketId: 1,
      side: 'BUY_YES',
      amount: 100,
    });
  });

  it('should display quote preview when quote is available', () => {
    (tradeHook.useTrade as ReturnType<typeof vi.fn>).mockReturnValue({
      quote: mockQuote,
      isLoadingQuote: false,
      quoteError: null,
      isExecutingTrade: false,
      tradeError: null,
      tradeResult: null,
      requestQuote: mockRequestQuote,
      executeTrade: mockExecuteTrade,
      clearQuote: mockClearQuote,
      clearTradeResult: mockClearTradeResult,
      reset: mockReset,
    });

    render(<TradePanel market={mockMarket} />, { wrapper: createWrapper() });

    expect(screen.getByText('Quote')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});

