// Domain Types - For internal application use

export type MarketStatus = 'OPEN' | 'CLOSED' | 'RESOLVED' | 'VOID';
export type TradeSide = 'BUY_YES' | 'SELL_YES';
export type UserRole = 'USER' | 'ADMIN';
export type Outcome = 'YES' | 'NO';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Market {
  id: number;
  title: string;
  description: string;
  status: MarketStatus;
  resolvedOutcome?: Outcome | null;
  opensAt: Date;
  closesAt: Date;
  yesPrice: number;
  noPrice: number;
  tradeable: boolean;
  createdAt: Date;
  createdBy: string;
}

export interface Position {
  marketId: number;
  marketTitle: string;
  marketStatus: string;
  yesShares: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedPnL: number;
}

export interface Portfolio {
  userId: number;
  username: string;
  cashBalance: number;
  positions: Position[];
  netWorth: number;
}

export interface Quote {
  marketId: number;
  side: TradeSide;
  shares: number;
  cost: number;
  fee: number;
  totalCashImpact: number;
  averagePrice: number;
  priceBefore: number;
  priceAfter: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  netWorth: number;
  cashBalance: number;
  positionsValue: number;
}

export interface MarketMakerStats {
  totalFeesCollected: number;
  totalRealisedPnL: number;
  totalUnrealisedPnL: number;
  activeMarketsCount: number;
  resolvedMarketsCount: number;
}

