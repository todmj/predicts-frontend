# PredictsFuture

A production-quality frontend for a prediction market demo with real-time order book trading. Built with React, TypeScript, and modern tooling.

## Features

- 📈 **Markets List** - Browse all prediction markets with real-time price updates
- 🎯 **Market Detail** - View market details with live order book
- 📊 **Order Book Trading** - Place limit and market orders with real-time depth visualization
- 💰 **Portfolio** - Track your positions, cash balance, and net worth
- 🏆 **Leaderboard** - See top traders ranked by net worth
- 👤 **Admin Dashboard** - Create and manage markets (admin only)
- 📉 **Market Maker Dashboard** - Track fees, P&L, and dynamic MM controls

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **TanStack Query** - Server state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **SockJS + STOMP** - WebSocket for real-time updates
- **Axios** - HTTP client
- **Vitest** + **Testing Library** - Testing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
# API Base URL (default: http://localhost:8080/api)
VITE_API_BASE_URL=http://localhost:8080/api
```

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests once
npm run test:run

# Lint code
npm run lint
```

## Project Structure

```
src/
├── api/              # API layer (HTTP client, typed endpoints)
│   ├── client.ts     # Base Axios client with JWT injection
│   ├── authApi.ts    # Authentication endpoints
│   ├── marketsApi.ts # Markets CRUD endpoints
│   ├── tradingApi.ts # Quote and trade endpoints
│   ├── portfolioApi.ts # Portfolio and leaderboard
│   ├── adminApi.ts   # Admin operations
│   └── mmApi.ts      # Market maker stats
│
├── components/       # Reusable UI components
│   ├── common/       # Buttons, cards, loading, errors
│   ├── markets/      # Market cards, lists, details
│   ├── trading/      # Trade panel, quote preview
│   ├── portfolio/    # Positions table
│   ├── leaderboard/  # Leaderboard table
│   ├── admin/        # Admin controls, forms
│   ├── Layout.tsx    # Main app layout
│   └── ProtectedRoute.tsx
│
├── hooks/            # Custom React hooks
│   ├── useAuth.ts    # Authentication context
│   ├── useMarkets.ts # Markets queries
│   ├── useTrade.ts   # Trading mutations
│   └── usePortfolio.ts # Portfolio queries
│
├── pages/            # Page components
│   ├── LoginPage.tsx
│   ├── MarketsPage.tsx
│   ├── MarketDetailPage.tsx
│   ├── PortfolioPage.tsx
│   ├── LeaderboardPage.tsx
│   ├── AdminPage.tsx
│   └── MmDashboardPage.tsx
│
├── types/            # TypeScript definitions
│   ├── apiTypes.ts   # API DTOs
│   └── domainTypes.ts # Domain models
│
├── utils/            # Utility functions
│   ├── formatMoney.ts
│   ├── formatPrice.ts
│   └── rounding.ts
│
├── test/             # Test setup
│   └── setup.ts
│
├── App.tsx           # Root component with routes
└── main.tsx          # Entry point
```

## API Integration

The frontend expects a backend API at `VITE_API_BASE_URL` with the following endpoints (aligned with Swagger spec):

### Authentication
- `POST /auth/login` - Login → `{ token, username, role }`
- `GET /me` - Get current user profile → `{ id, username, role, cashBalance, netWorth, positions[] }`

### Markets
- `GET /markets` - List all markets
- `GET /markets/:id` - Get market details

### Trading
- `POST /trade/quote` - Get trade quote → `TradeQuoteResponse`
- `POST /trade/execute` - Execute trade → `TradeResponse`

### Portfolio
- `GET /leaderboard` - Get leaderboard → `LeaderboardEntry[]`

### Admin (requires ADMIN role)
- `POST /admin/markets` - Create market
- `POST /admin/markets/:id/close` - Close market
- `POST /admin/markets/:id/resolve` - Resolve market (YES/NO)
- `POST /admin/markets/:id/void` - Void market

### Market Maker (Admin only)
- `GET /mm/summary` - Get MM summary statistics
- `GET /mm/markets/:id` - Get MM stats for specific market

## Testing

```bash
# Run all tests in watch mode
npm run test

# Run tests once (64 tests)
npm run test:run

# Run with coverage
npm run test:coverage
```

## Display Rules

- **Prices**: 2 decimal places (e.g., 0.65)
- **Probabilities**: Percentage with 1 decimal (e.g., 65.0%)
- **Money**: 2 decimal places with ¢ symbol (e.g., ¢100.00)

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework

3. **Configure Environment Variables**
   In Vercel project settings, add:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://api.example.com/api` |

### Important Notes

- The frontend expects the backend to be deployed and accessible at `VITE_API_URL`
- WebSocket connections require the backend to support CORS for your Vercel domain
- For local development, use `http://localhost:8080/api`

## License

MIT
