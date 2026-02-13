# PredictsFuture - Feature Implementation Tracker

## Legend
- ✅ = Implemented AND tested
- ⚠️ = Implemented but NOT tested (or partially tested)
- ❌ = Not implemented

## Summary

| Category | Status | Notes |
|----------|--------|-------|
| Auth Flow | ✅ | Core login tested, JWT storage tested |
| Markets List | ✅ | Rendering tested, polling implemented |
| Market Detail | ⚠️ | Implemented with Order Book v2/v3 |
| Order Book | ⚠️ | Real-time Order Book with WebSocket |
| Order Entry | ⚠️ | Limit/Market orders, cross/rest indicator |
| Portfolio | ⚠️ | Implemented, only PositionsTable tested |
| Leaderboard | ⚠️ | Implemented, no tests |
| Admin Controls | ⚠️ | Implemented with initial probability |
| MM Dashboard | ⚠️ | v3 Dynamic MM with live controls |
| API Client | ✅ | Token management tested |
| WebSocket | ⚠️ | STOMP/SockJS implemented |
| UI Theme | ✅ | Editorial theme with dark cards |
| Unit Tests | ✅ | formatMoney, formatPrice, rounding |

---

## 🎨 Editorial Theme (v4)

| Element | Color | Hex |
|---------|-------|-----|
| Background | White | `#FFFFFF` |
| Secondary background | Light grey | `#F3F3F3` |
| Dark surface cards | Near-black | `#080018` |
| Primary text (light bg) | Dark | `#1C1526` |
| Secondary text | Grey | `#767771` |
| Accent headings | Lime | `#C6FF2F` |
| Primary buttons | Purple | `#3D0C63` |
| Text on dark | Light | `#EAEAF0` |
| Success | Green | `#22c55e` |
| Danger | Red | `#ef4444` |

### UX Improvements
- **Order Entry**: Shows "Trades Immediately" vs "Rests on Book" indicator
- **Top of Book**: Best bid/ask prominently displayed
- **No percentage**: Removed large probability percentage, shows prices directly
- **Responsive animations**: Order book depth bars animate smoothly

---

## 🚀 API v2/v3 Changes (Order Book + Dynamic MM)

The system has migrated from **AMM (Automated Market Maker)** to **Order Book** model with **Dynamic Market Maker**:

| v1 (AMM) | v2 (Order Book) | v3 (Dynamic MM) |
|----------|-----------------|-----------------|
| Single price from formula | Bid/Ask spread | Dynamic spread based on inventory |
| Instant execution | Orders may rest on book | MM adjusts prices after trades |
| No limit orders | Full limit order support | MM uses inventory skew |
| REST only | WebSocket for real-time | Real-time MM state updates |

### New v3 MM Features

| Feature | Description |
|---------|-------------|
| Dynamic Spread | Widens when inventory is imbalanced (2-12%) |
| Inventory Skew | Shifts prices to reduce position |
| Size Jitter | ±20% random variation on order sizes |
| Price Jitter | ±0.5% random variation on prices |
| Partial Refresh | Updates 1-2 orders at a time for organic feel |

### New v3 Admin Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /admin/mm/{id}/state` | Get MM state for market |
| `GET /admin/mm/all` | Get all MM states |
| `POST /admin/mm/seed` | Seed orders with optional fair price |
| `POST /admin/mm/{id}/fair-price?price=X` | Update fair price |
| `POST /admin/mm/{id}/requote` | Force requote |

### New v3 Components

| Component | File | Description |
|-----------|------|-------------|
| MMControls | `src/components/admin/MMControls.tsx` | Admin controls for MM (fair price, requote) |

### MM State Response

```json
{
  "marketId": 1,
  "fairPrice": "0.55",
  "netInventory": "-150.00",
  "realizedPnL": "12.50",
  "unrealizedPnL": "-7.50",
  "totalPnL": "5.00",
  "feesEarned": "8.75",
  "currentSpread": "0.06"
}
```

---

| Component | File | Description |
|-----------|------|-------------|
| OrderBook | `src/components/trading/OrderBook.tsx` | Visual order book with depth bars |
| OrderEntry | `src/components/trading/OrderEntry.tsx` | Limit/Market order form |
| MyOrders | `src/components/trading/MyOrders.tsx` | User's open orders panel |
| RecentTrades | `src/components/trading/OrderBook.tsx` | Trade ticker |

### New Hooks

| Hook | File | Description |
|------|------|-------------|
| useOrderBook | `src/hooks/useOrderBook.ts` | Real-time order book with WebSocket |
| useOrders | `src/hooks/useOrders.ts` | Place/cancel orders |

### New API Layer

| File | Description |
|------|-------------|
| `src/api/ordersApi.ts` | REST API for orders |
| `src/api/websocket.ts` | WebSocket service (STOMP/SockJS) |

### WebSocket Subscriptions

| Topic | Purpose |
|-------|---------|
| `/topic/market/{id}/orderbook` | Order book updates |
| `/topic/market/{id}/trades` | Trade stream |
| `/topic/market/{id}/status` | Market status changes |
| `/topic/markets` | New market announcements |
| `/queue/user/{id}/orders` | User order updates |

---

## Auth Flow

| Feature | Status | Files | Tests |
|---------|--------|-------|-------|
| Login form with username/password | ✅ | `src/pages/LoginPage.tsx` | `src/pages/LoginPage.test.tsx` |
| JWT storage in memory + localStorage | ✅ | `src/api/client.ts` | `src/api/client.test.ts` |
| Auto-inclusion of JWT in API calls | ⚠️ | `src/api/client.ts` | — (integration only) |
| Redirect unauthenticated users | ✅ | `src/components/ProtectedRoute.tsx` | `src/test/integration.test.tsx` |
| 401 handling clears token and redirects | ⚠️ | `src/api/client.ts` | — |

---

## Markets List

| Feature | Status | Files | Tests |
|---------|--------|-------|-------|
| Display market title, YES price, status | ✅ | `src/components/markets/MarketCard.tsx`, `MarketList.tsx` | `src/components/markets/MarketList.test.tsx` |
| Time remaining display | ✅ | `src/components/markets/MarketCard.tsx` | `src/components/markets/MarketList.test.tsx` |
| Poll markets every 7 seconds | ⚠️ | `src/hooks/useMarkets.ts` | — (no polling test) |
| Pause polling when tab hidden | ⚠️ | `src/hooks/useMarkets.ts` (`refetchIntervalInBackground: false`) | — |

---

## Market Detail

| Feature | Status | Files | Tests |
|---------|--------|-------|-------|
| Show description and rules | ⚠️ | `src/components/markets/MarketDetail.tsx` | — |
| Display current YES/NO prices | ⚠️ | `src/components/markets/MarketDetail.tsx` | — |
| Show user's position in market | ⚠️ | `src/pages/MarketDetailPage.tsx` | — |

---

## Trading Panel

| Feature | Status | Files | Tests |
|---------|--------|-------|-------|
| Enter amount and select side | ✅ | `src/components/trading/TradePanel.tsx` | `src/components/trading/TradePanel.test.tsx` |
| Request and display quote | ✅ | `src/components/trading/TradePanel.tsx`, `QuotePreview.tsx` | `src/components/trading/TradePanel.test.tsx` |
| Display fee, shares, avg price, price after | ✅ | `src/components/trading/QuotePreview.tsx` | `src/components/trading/TradePanel.test.tsx` |
| Prevent trades exceeding balance | ✅ | `src/components/trading/TradePanel.tsx` | `src/components/trading/TradePanel.test.tsx` |
| Display backend errors | ⚠️ | `src/components/trading/TradePanel.tsx` | — |

---

## Portfolio

| Feature | Status | Files | Tests |
|---------|--------|-------|-------|
| Display cash balance | ⚠️ | `src/pages/PortfolioPage.tsx` | — |
| Display positions table | ✅ | `src/components/portfolio/PositionsTable.tsx` | `src/components/portfolio/PositionsTable.test.tsx` |
| Display net worth (from server) | ⚠️ | `src/pages/PortfolioPage.tsx` | — |

---

## Leaderboard

| Feature | Status | Files | Tests |
|---------|--------|-------|-------|
| Ranked list with username and net worth | ⚠️ | `src/components/leaderboard/LeaderboardTable.tsx`, `src/pages/LeaderboardPage.tsx` | — |
| Refresh every 15 seconds | ⚠️ | `src/hooks/usePortfolio.ts` | — |
| Pause polling when tab hidden | ⚠️ | `src/hooks/usePortfolio.ts` | — |

---

## Admin Controls

| Feature | Status | Files | Tests |
|---------|--------|-------|-------|
| Create market form | ⚠️ | `src/components/admin/CreateMarketForm.tsx` | — |
| Close market control | ⚠️ | `src/components/admin/MarketControls.tsx` | — |
| Resolve YES/NO control | ⚠️ | `src/components/admin/MarketControls.tsx` | — |
| Void market control | ⚠️ | `src/components/admin/MarketControls.tsx` | — |
| Admin-only visibility | ⚠️ | `src/pages/AdminPage.tsx` | — |

---

## MM Dashboard (Admin-only)

| Feature | Status | Files | Tests |
|---------|--------|-------|-------|
| Display fees, realised P&L, unrealised P&L | ⚠️ | `src/pages/MmDashboardPage.tsx` | — |
| Display market counts | ⚠️ | `src/pages/MmDashboardPage.tsx` | — |
| Total P&L summary | ⚠️ | `src/pages/MmDashboardPage.tsx` | — |

---

## API Client

| Feature | Status | Files | Tests |
|---------|--------|-------|-------|
| Base HTTP client with JWT injection | ✅ | `src/api/client.ts` | `src/api/client.test.ts` |
| Typed API modules | ⚠️ | `src/api/*.ts` | — (type checking only) |
| Error handling | ⚠️ | `src/api/client.ts` | — |
| Loading states | ⚠️ | Components use React Query | — |

---

## Unit Tests

| Test Type | Status | Files |
|-----------|--------|-------|
| formatMoney utilities | ✅ | `src/utils/formatMoney.test.ts` |
| formatPrice utilities | ✅ | `src/utils/formatPrice.test.ts` |
| rounding utilities | ✅ | `src/utils/rounding.test.ts` |
| API client token management | ✅ | `src/api/client.test.ts` |

## Component Tests

| Test Type | Status | Files |
|-----------|--------|-------|
| LoginPage form + submission | ✅ | `src/pages/LoginPage.test.tsx` |
| MarketList renders API data | ✅ | `src/components/markets/MarketList.test.tsx` |
| TradePanel quote preview | ✅ | `src/components/trading/TradePanel.test.tsx` |
| PositionsTable renders positions | ✅ | `src/components/portfolio/PositionsTable.test.tsx` |

## Integration Tests

| Test Type | Status | Files |
|-----------|--------|-------|
| Login → navigation flow | ✅ | `src/test/integration.test.tsx` |
| Full trade flow (quote → trade → portfolio) | ❌ | — |

---

## Display Rules Implementation

| Rule | Status | Implementation |
|------|--------|----------------|
| Prices: 2 decimal places | ✅ | `src/utils/formatPrice.ts` (tested) |
| Probabilities: percentage with 1 decimal | ✅ | `src/utils/formatPrice.ts` (tested) |
| Credits: consistent formatting | ✅ | `src/utils/formatMoney.ts` (tested) |
| No client-side business logic | ✅ | All calculations from server |

---

## API Endpoint Alignment (v2 Order Book)

| Frontend Calls | Backend Endpoint | Status |
|----------------|------------------|--------|
| `POST /auth/login` | `POST /auth/login` → `LoginResponse {token, username, role}` | ✅ |
| `GET /me` | `GET /me` → `UserProfileResponse` | ✅ |
| `GET /markets` | `GET /markets` → `MarketResponse[]` | ✅ |
| `GET /markets/:id` | `GET /markets/:id` → `MarketResponse` | ✅ |
| `GET /orders/book/:id` | `GET /orders/book/:id` → `OrderBookResponse` | ⚠️ |
| `POST /orders` | `POST /orders` → `OrderResponse` | ⚠️ |
| `DELETE /orders/:id` | `DELETE /orders/:id` → `OrderResponse` | ⚠️ |
| `GET /orders/my` | `GET /orders/my?marketId=` → `OrderResponse[]` | ⚠️ |
| `GET /leaderboard` | `GET /leaderboard` → `LeaderboardEntry[]` | ✅ |
| `POST /admin/markets` | `POST /admin/markets` → `MarketResponse` | ✅ |
| `POST /admin/markets/bulk` | `POST /admin/markets/bulk` → `MarketResponse[]` | ❌ |
| `POST /admin/markets/:id/close` | `POST /admin/markets/:id/close` → `MarketResponse` | ✅ |
| `POST /admin/markets/:id/resolve` | `POST /admin/markets/:id/resolve` → `MarketResponse` | ✅ |
| `POST /admin/markets/:id/void` | `POST /admin/markets/:id/void` → `MarketResponse` | ✅ |
| `GET /mm/summary` | `GET /mm/summary` → `MarketMakerSummary` | ✅ |

### Deprecated v1 Endpoints (no longer used)

| Endpoint | Replacement |
|----------|-------------|
| `POST /trade/quote` | Use order book best prices |
| `POST /trade/execute` | `POST /orders` |

---

## Known Gaps / TODO

1. **No integration test for full trade flow** - quote → execute → verify portfolio update
2. **No test for 401 token expiry redirect** - implemented in client.ts but not tested
3. **Admin/MM dashboard components untested** - functional but risky for refactoring
4. **Polling tests missing** - rely on TanStack Query behavior, not verified

---

## UI Design System

### Theme (Updated)

The design has been updated to a **premium, refined dark theme** inspired by Stripe, Linear, and Vercel:

| Element | Old Style | New Style |
|---------|-----------|-----------|
| Primary background | `#0a0a0f` (blue-tinted) | `#09090b` (pure zinc) |
| Accent color | Neon cyan `#00d4ff` | Indigo `#6366f1` |
| Success | Neon green `#22c55e` | Emerald `#10b981` |
| Card styling | Heavy gradients, glows | Subtle borders, minimal shadows |
| Typography | Bold/Black weights | Medium/Semibold, cleaner hierarchy |
| Animations | Heavy glows, floats | Subtle fades, minimal transitions |
| Icons | Emoji-heavy | SVG icons or minimal emoji |

### Files Updated

| File | Changes |
|------|---------|
| `src/index.css` | New CSS variables, refined animations, cleaner card/button styles |
| `src/components/Layout.tsx` | Cleaner navigation, minimal design |
| `src/components/markets/MarketCard.tsx` | Probability bar, cleaner price tags |
| `src/components/markets/MarketDetail.tsx` | Streamlined layout |
| `src/pages/*.tsx` | Consistent styling across all pages |
| `src/components/common/Button.tsx` | Refined button variants |
| `src/components/common/Input.tsx` | Proper label association, cleaner styling |
| `src/components/common/Loading.tsx` | Minimal spinner |
| `src/components/leaderboard/LeaderboardTable.tsx` | Cleaner rank badges |
| `src/components/trading/TradePanel.tsx` | Streamlined trade flow |
| `src/components/trading/QuotePreview.tsx` | Cleaner quote display |
| `src/components/portfolio/PositionsTable.tsx` | Refined table styling |
| `src/components/admin/CreateMarketForm.tsx` | Cleaner form design |
| `src/components/admin/MarketControls.tsx` | Refined admin controls |

---

## Role Model

- **USER** - Can view markets, trade, view portfolio and leaderboard
- **ADMIN** - All USER permissions + create/close/resolve/void markets + view MM dashboard

Note: Simplified to two roles. No separate MARKET_MAKER role.

---

## Backend Types Alignment

All frontend types in `src/types/apiTypes.ts` are aligned with the Swagger spec:
- `LoginResponse` - flat object with `{token, username, role}` (not nested user object)
- `UserProfileResponse` - includes `positions[]` with `PositionSummary`
- `MarketDTO` - uses `closesAt`/`opensAt`, `tradeable`, `resolvedOutcome`
- `TradeRequest` - uses `BUY_YES`/`SELL_YES` enum
- `TradeQuoteResponse` - includes `totalCashImpact`, `priceBefore`, `priceAfter`
- `LeaderboardEntry` - includes `positionsValue`, `cashBalance`
- `MarketMakerSummary` - uses `Realised`/`Unrealised` spelling

