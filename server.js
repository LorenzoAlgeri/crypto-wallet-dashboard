import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Debug: Log if API key is loaded
console.log('Moralis API Key loaded:', process.env.MORALIS_API_KEY ? 'Yes' : 'No');
console.log('Etherscan API Key loaded:', process.env.ETHERSCAN_API_KEY ? 'Yes' : 'No');

app.use(cors());
app.use(express.json());

// Moralis API proxy
app.get('/api/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'eth' } = req.query;
    
    const response = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/balance`, {
      params: { chain },
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching balance:', error.message);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Moralis token balances proxy
app.get('/api/tokens/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'eth' } = req.query;
    
    const response = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/erc20`, {
      params: { chain },
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching tokens:', error.message);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

// Etherscan transactions proxy
app.get('/api/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { startblock = '0', endblock = '99999999' } = req.query;
    
    const [normalTxs, internalTxs] = await Promise.all([
      axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock,
          endblock,
          sort: 'desc',
          apikey: process.env.ETHERSCAN_API_KEY
        }
      }),
      axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'txlistinternal',
          address,
          startblock,
          endblock,
          sort: 'desc',
          apikey: process.env.ETHERSCAN_API_KEY
        }
      })
    ]);
    
    res.json({
      normal: normalTxs.data.result || [],
      internal: internalTxs.data.result || []
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Simple in-memory cache for prices
let priceCache = {
  data: null,
  timestamp: 0,
  ttl: 30000 // 30 seconds cache
};

// CoinGecko price proxy with caching
app.get('/api/prices', async (req, res) => {
  try {
    const { ids, vs_currencies = 'usd' } = req.query;
    const now = Date.now();
    
    // Check if we have valid cached data
    if (priceCache.data && (now - priceCache.timestamp) < priceCache.ttl) {
      console.log('Returning cached prices');
      return res.json(priceCache.data);
    }
    
    console.log('Fetching fresh prices from CoinGecko');
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids,
        vs_currencies,
        include_24hr_change: true
      }
    });
    
    // Cache the response
    priceCache.data = response.data;
    priceCache.timestamp = now;
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching prices:', error.message);
    
    // If we have cached data, return it even if expired
    if (priceCache.data) {
      console.log('Returning stale cached prices due to API error');
      return res.json(priceCache.data);
    }
    
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
