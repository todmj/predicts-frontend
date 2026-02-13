// API Response Types - DTOs from backend
// Aligned with API v2 (Order Book model)

export interface LoginRequest {
  username: string;
  password: string;
}

// Backend LoginResponse: { token, username, role }
export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

// Backend UserProfileResponse from GET /me
export interface UserProfileResponse {
  id: number;
  username: string;
  role: string;
  cashBalance: number;
  netWorth: number;
  positions: PositionSummary[];
}

// Backend PositionSummary
export interface PositionSummary {
  marketId: number;
  marketTitle: string;
  marketStatus: string;
  yesShares: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedPnL: number;
}

// Backend MarketResponse
export interface MarketDTO {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED' | 'RESOLVED' | 'VOID';
  opensAt: string;
  closesAt: string;
  resolvedOutcome?: 'YES' | 'NO' | null;
  createdBy: string;
  createdAt: string;
  yesPrice: number;  // Will be derived from best bid/ask
  noPrice: number;
  tradeable: boolean;
}

// ===========================================
// ORDER BOOK v2 TYPES
// ===========================================

export type OrderSide = 'BUY_YES' | 'SELL_YES';
export type OrderType = 'LIMIT' | 'MARKET';
export type OrderStatus = 'OPEN' | 'PARTIAL' | 'FILLED' | 'CANCELLED';

// Order Book Level (aggregated price level)
export interface OrderBookLevel {
  price: string;
  size: string;
  orderCount: number;
  isMarketMaker: boolean;
}

// Recent Trade
export interface RecentTrade {
  price: string;
  size: string;
  side: 'BUY' | 'SELL';
  timestamp: number;
}

// Order Book Snapshot (GET /orders/book/{marketId})
export interface OrderBookResponse {
  marketId: number;
  marketTitle: string;
  lastTradePrice: string | null;
  bestBid: string | null;
  bestAsk: string | null;
  spread: string | null;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  recentTrades: RecentTrade[];
  timestamp: number;
}

// Order Request (POST /orders)
export interface OrderRequest {
  marketId: number;
  side: OrderSide;
  type: OrderType;
  price?: string;  // Required for LIMIT orders
  quantity: string;
}

// Order Response
export interface OrderResponse {
  orderId: number;
  marketId: number;
  side: OrderSide;
  type: OrderType;
  price: string;
  quantity: string;
  filledQuantity: string;
  remainingQuantity: string;
  status: OrderStatus;
  createdAt: string;
}

// ===========================================
// WEBSOCKET MESSAGE TYPES
// ===========================================

export type WebSocketMessageType =
  | 'ORDERBOOK_UPDATE'
  | 'TRADE'
  | 'ORDER_UPDATE'
  | 'MARKET_STATUS'
  | 'NEW_MARKET';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  timestamp: number;
}

export interface OrderBookUpdateMessage extends WebSocketMessage {
  type: 'ORDERBOOK_UPDATE';
  marketId: number;
  orderBook: OrderBookResponse;
}

export interface TradeMessage extends WebSocketMessage {
  type: 'TRADE';
  marketId: number;
  price: string;
  size: string;
  takerSide: 'BUY' | 'SELL';
}

export interface OrderUpdateMessage extends WebSocketMessage {
  type: 'ORDER_UPDATE';
  orderId: number;
  marketId: number;
  status: OrderStatus;
  filledQuantity: string;
  remainingQuantity: string;
  lastFillPrice?: string;
  lastFillSize?: string;
}

export interface MarketStatusMessage extends WebSocketMessage {
  type: 'MARKET_STATUS';
  marketId: number;
  status: 'OPEN' | 'CLOSED' | 'RESOLVED' | 'VOID';
  resolvedOutcome?: 'YES' | 'NO';
}

export interface NewMarketMessage extends WebSocketMessage {
  type: 'NEW_MARKET';
  marketId: number;
  title: string;
}

// ===========================================
// LEGACY TYPES (deprecated, kept for compatibility)
// ===========================================

/** @deprecated Use OrderRequest instead */
export interface TradeRequest {
  marketId: number;
  side: 'BUY_YES' | 'SELL_YES';
  amount: number;
}

/** @deprecated No longer used in v2 */
export interface TradeQuoteResponse {
  marketId: number;
  side: 'BUY_YES' | 'SELL_YES';
  shares: number;
  cost: number;
  fee: number;
  totalCashImpact: number;
  averagePrice: number;
  priceBefore: number;
  priceAfter: number;
}

/** @deprecated Use OrderResponse instead */
export interface TradeResponse {
  id: number;
  marketId: number;
  marketTitle: string;
  side: 'BUY_YES' | 'SELL_YES';
  shares: number;
  cost: number;
  fee: number;
  averagePrice: number;
  priceBefore: number;
  priceAfter: number;
  createdAt: string;
}

// Backend LeaderboardEntry
export interface LeaderboardEntry {
  rank: number;
  username: string;
  netWorth: number;
  cashBalance: number;
  positionsValue: number;
}

// Backend CreateMarketRequest (v2 with initialYesProbability)
export interface CreateMarketRequest {
  title: string;
  description?: string;
  opensAt: string;
  closesAt: string;
  initialYesProbability?: number;  // New in v2: 0.01 - 0.99
}

// Backend BulkCreateMarketRequest
export interface BulkCreateMarketOption {
  value: string;
  label: string;
  initialYesProbability: number;
}

export interface BulkCreateMarketRequest {
  baseTitle: string;
  description?: string;
  opensAt: string;
  closesAt: string;
  options: BulkCreateMarketOption[];
}

// Backend ResolveMarketRequest
export interface ResolveMarketRequest {
  outcome: 'YES' | 'NO';
}

// Backend MarketMakerSummary
export interface MarketMakerSummary {
  totalFeesCollected: number;
  totalRealisedPnL: number;
  totalUnrealisedPnL: number;
  activeMarketsCount: number;
  resolvedMarketsCount: number;
}

// Backend MarketMakerPnLResponse (legacy)
export interface MarketMakerPnLResponse {
  marketId: number;
  marketTitle: string;
  marketStatus: string;
  feesCollected: number;
  mmInventoryYes: number;
  realisedPnL: number;
  unrealisedPnL: number;
  currentYesPrice: number;
}

// ===========================================
// MM STATE v3 TYPES (Dynamic Market Maker)
// ===========================================

// MM State for a single market
export interface MMState {
  marketId: number;
  fairPrice: string;
  netInventory: string;
  realizedPnL: string;
  unrealizedPnL: string;
  totalPnL: string;
  feesEarned: string;
  currentSpread: string;
}

// Seed order for admin
export interface SeedOrder {
  side: OrderSide;
  price: string;
  size: string;
}

// Request to seed orders
export interface SeedOrdersRequest {
  marketId: number;
  fairPrice?: string;
  orders?: SeedOrder[];
}

// Frontend error type
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}

