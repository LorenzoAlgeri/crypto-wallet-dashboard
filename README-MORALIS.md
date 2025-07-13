# Crypto Portfolio Tracker - Moralis v2.2 Integration

## 🚀 Overview

Crypto Portfolio Tracker integrato con **Moralis API v2.2** per il tracking di portafogli multi-wallet. Il progetto include un sistema di fallback robusto con **QuickNode GoldRush** e exponential backoff per gestire i rate limits.

## 🛠 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express  
- **APIs**: Moralis v2.2 (primary) + QuickNode GoldRush (fallback)
- **Styling**: Tailwind CSS v3.4.0

## ⚙️ Configuration

### Environment Variables

Copia `.env.example` in `.env` e configura:

```bash
# Moralis API Configuration
MORALIS_API_KEY=your_moralis_api_key_here
VITE_MORALIS_API_KEY=your_moralis_api_key_here

# Etherscan API Configuration  
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# QuickNode GoldRush API Configuration (fallback)
GOLDRUSH_API_KEY=your_goldrush_api_key_here
VITE_GOLDRUSH_API_KEY=your_goldrush_api_key_here

# Server Configuration
PORT=3001
LOCAL_SERVER=true  # Use Moralis v2.2 endpoints directly

# Development Configuration
NODE_ENV=development
```

### Local Server Mode

- `LOCAL_SERVER=true`: Usa direttamente Moralis v2.2 endpoints con exponential backoff
- `LOCAL_SERVER=false`: Usa endpoints legacy per compatibilità 

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm o yarn
- API Keys per Moralis e GoldRush

### Installation

```bash
# Clona repository
git clone <repository-url>
cd crypto_tracker_def/wallet-dashboard

# Installa dipendenze 
npm install

# Configura environment variables
cp .env.example .env
# Edita .env con le tue API keys

# Avvia development servers
npm run dev     # Frontend su http://localhost:3000
node server.js  # Backend su http://localhost:3001
```

## 📁 Architecture

### Frontend Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard component
│   └── AssetTable.jsx         # Asset table with portfolio data
├── hooks/
│   └── usePortfolioData.js    # Custom hook con Moralis v2.2 integration
├── utils/
│   └── moralisApi.js          # Moralis v2.2 API module with fallback
└── styles/
    └── index.css              # Tailwind CSS configuration
```

### API Integration Layer

#### `src/utils/moralisApi.js`

Modulo centrale per tutte le chiamate Moralis v2.2:

- ✅ **Exponential backoff** (300ms → 600ms → 1200ms → 2400ms max)
- ✅ **Rate limit handling** (429 errors) 
- ✅ **QuickNode GoldRush fallback** automatico
- ✅ **Error retry logic** (max 3 tentativi)
- ✅ **Timeout handling** (10s timeout)

#### Available Functions

```javascript
import { moralisApi } from '../utils/moralisApi.js';

// Get wallet native balance (ETH, BNB, etc.)
const balance = await moralisApi.getNativeBalance(address, 'eth');

// Get ERC20 token balances  
const tokens = await moralisApi.getWalletTokenBalances(address, 'eth');

// Get token balances with prices
const tokensWithPrices = await moralisApi.getWalletTokenBalancesPrices(address, 'eth');

// Get wallet transaction history
const history = await moralisApi.getWalletHistory(address, 'eth');

// Get token transfers
const transfers = await moralisApi.getWalletTokenTransfers(address, 'eth');
```

### Backend Proxy Layer

#### `server.js`

Express server con proxy endpoints:

- `/api/balance/:address` - Native balance proxy
- `/api/tokens/:address` - Token balances proxy  
- `/api/wallet/:address/history` - Wallet history (Moralis v2.2)
- `/api/wallet/:address/tokens` - Tokens with prices (Moralis v2.2)
- `/api/wallet/:address/transfers` - Token transfers (Moralis v2.2)
- `/api/prices` - CoinGecko price proxy con caching

## 🔄 Data Flow

1. **Frontend** (`usePortfolioData.js`) → 
2. **Moralis API Module** (`moralisApi.js`) → 
3. **Moralis v2.2 API** (primary) →
4. **QuickNode GoldRush** (fallback se Moralis fallisce) →
5. **Server Proxy** (fallback se entrambi falliscono) →
6. **Demo Data** (fallback finale per offline mode)

## 🚨 Error Handling

### Rate Limiting

- **Exponential backoff**: 300ms → 600ms → 1200ms → 2400ms max
- **Max 3 retries** per chiamata API
- **429 error detection** e retry automatico

### Fallback Strategy

1. **Moralis v2.2 API** (primary)
2. **QuickNode GoldRush API** (automatic fallback)  
3. **Server proxy endpoints** (fallback se client-side APIs falliscono)
4. **Demo data** (offline mode per development)

### Offline Support

La dashboard continua a funzionare anche offline utilizzando:
- Demo data predefiniti
- Cached prices da CoinGecko
- Dati di esempio realistici

## 🧪 Testing

```bash
# Test build
npm run build

# Test development mode
npm run dev

# Test server
node server.js

# Verifica endpoints
curl http://localhost:3001/api/balance/0x742d35Cc6635C0532925a3b8D3ac6Dba7f8E8a23
```

## 🔧 Troubleshooting

### API Key Issues

```bash
# Verifica che le API keys siano caricate
echo $MORALIS_API_KEY
echo $GOLDRUSH_API_KEY
```

### Rate Limiting

- Moralis free tier: 40k calls/month
- GoldRush fallback automatico
- Exponential backoff integrato

### Offline Mode

La dashboard funziona anche senza connessione internet usando demo data realistici.

## 📈 Features

### ✅ Completed

- [x] Moralis v2.2 API integration 
- [x] Exponential backoff per rate limits
- [x] QuickNode GoldRush fallback
- [x] Multi-wallet support
- [x] Portfolio overview con P&L
- [x] Asset table con sorting
- [x] Responsive design
- [x] Offline mode support
- [x] Error handling robusto

### 🚧 Future Enhancements

- [ ] Multi-chain support (Polygon, BSC, Arbitrum)
- [ ] Real-time price updates via WebSocket
- [ ] Transaction categorization (DeFi, NFT, etc.)
- [ ] Portfolio analytics e charts
- [ ] Export data (CSV, JSON)
- [ ] Historical P&L tracking

## 🤝 Contributing

1. Fork il repository
2. Crea feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push branch (`git push origin feature/new-feature`)
5. Crea Pull Request

## 📄 License

MIT License - vedi `LICENSE` file per dettagli.

---

*Crypto Portfolio Tracker - Powered by Moralis v2.2 & QuickNode GoldRush*
