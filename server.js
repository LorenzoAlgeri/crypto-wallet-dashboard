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
const LOCAL_SERVER = process.env.LOCAL_SERVER === 'true';

// Moralis API configuration
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2';
const MORALIS_V22_BASE_URL = 'https://deep-index.moralis.io/api/v2.2';

// Debug: Log configuration
console.log('🔧 Server Configuration:');
console.log('Moralis API Key loaded:', process.env.MORALIS_API_KEY ? 'Yes' : 'No');
console.log('Etherscan API Key loaded:', process.env.ETHERSCAN_API_KEY ? 'Yes' : 'No');
console.log('Local Server Mode:', LOCAL_SERVER ? 'Enabled' : 'Disabled');
console.log('Port:', PORT);

app.use(cors());
app.use(express.json());

// Exponential backoff helper for Moralis API calls
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callMoralisWithRetry = async (url, options, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.get(url, options);
      return response;
    } catch (error) {
      lastError = error;
      
      const isRetryableError = 
        error.response?.status === 429 || 
        error.response?.status >= 500 ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ENOTFOUND';
      
      if (!isRetryableError || attempt === maxRetries - 1) {
        break;
      }
      
      const delay = Math.min(300 * Math.pow(2, attempt), 2400);
      console.warn(`Server: Moralis API retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

// Moralis API proxy with v2.2 support
app.get('/api/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'eth' } = req.query;
    
    const baseUrl = LOCAL_SERVER ? MORALIS_V22_BASE_URL : MORALIS_BASE_URL;
    const url = `${baseUrl}/${address}/balance`;
    
    const response = await callMoralisWithRetry(url, {
      params: { chain },
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY
      },
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching balance:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch balance',
      details: error.message
    });
  }
});

// Moralis token balances proxy with v2.2 support
app.get('/api/tokens/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'eth' } = req.query;
    
    const baseUrl = LOCAL_SERVER ? MORALIS_V22_BASE_URL : MORALIS_BASE_URL;
    const url = `${baseUrl}/${address}/erc20`;
    
    const response = await callMoralisWithRetry(url, {
      params: { chain },
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY
      },
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching tokens:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch tokens',
      details: error.message
    });
  }
});

// Moralis v2.2 wallet history endpoint
app.get('/api/wallet/:address/history', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'eth' } = req.query;
    
    const url = `${MORALIS_V22_BASE_URL}/wallets/${address}/history`;
    
    const response = await callMoralisWithRetry(url, {
      params: { chain },
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY
      },
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching wallet history:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch wallet history',
      details: error.message
    });
  }
});

// Moralis v2.2 wallet tokens with prices
app.get('/api/wallet/:address/tokens', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain = 'eth' } = req.query;
    
    const url = `${MORALIS_V22_BASE_URL}/wallets/${address}/tokens`;
    
    const response = await callMoralisWithRetry(url, {
      params: { chain },
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY
      },
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching wallet tokens with prices:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch wallet tokens with prices',
      details: error.message
    });
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
    
    console.log(`Price request for: ${ids}`);
    
    // Check if we have valid cached data
    if (priceCache.data && (now - priceCache.timestamp) < priceCache.ttl) {
      console.log('Returning cached prices');
      return res.json(priceCache.data);
    }
    
    console.log('Fetching fresh prices from CoinGecko for:', ids);
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids,
        vs_currencies,
        include_24hr_change: true
      }
    });
    
    console.log('CoinGecko response success');
    
    // Cache the response
    priceCache.data = response.data;
    priceCache.timestamp = now;
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching prices:', error.message);
    console.error('Error details:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
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
