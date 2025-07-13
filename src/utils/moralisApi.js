import axios from 'axios';

// Moralis API configuration
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2';
const API_KEY = import.meta.env.VITE_MORALIS_API_KEY;

// Exponential backoff configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 300, // 300ms initial delay
  maxDelay: 2400  // 2.4s max delay
};

// Sleep function for retry delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API call with exponential backoff
const callMoralisWithRetry = async (endpoint, params = {}) => {
  let lastError;
  
  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await axios.get(`${MORALIS_BASE_URL}${endpoint}`, {
        headers: {
          'X-API-Key': API_KEY,
          'Accept': 'application/json',
        },
        params,
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      lastError = error;
      
      // Check if it's a rate limit error (429) or server error (5xx)
      const isRetryableError = 
        error.response?.status === 429 || 
        error.response?.status >= 500 ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ENOTFOUND';
      
      if (!isRetryableError || attempt === RETRY_CONFIG.maxRetries - 1) {
        break;
      }
      
      // Calculate exponential backoff delay
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
        RETRY_CONFIG.maxDelay
      );
      
      console.warn(`Moralis API retry ${attempt + 1}/${RETRY_CONFIG.maxRetries} after ${delay}ms due to:`, error.response?.status || error.message);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

// Simple Moralis API module with basic functionality
const moralisApi = {
  async test() {
    return { message: 'Moralis API module loaded successfully' };
  },

  // Get native balance (ETH, BNB, etc.)
  async getNativeBalance(address, chain = 'eth') {
    try {
      if (!API_KEY) {
        throw new Error('Moralis API key not configured');
      }

      return await callMoralisWithRetry(`/${address}/balance`, { chain });
    } catch (error) {
      console.warn('Moralis getNativeBalance failed:', error.message);
      throw error;
    }
  },

  // Get ERC20 token balances
  async getWalletTokenBalances(address, chain = 'eth') {
    try {
      if (!API_KEY) {
        throw new Error('Moralis API key not configured');
      }

      return await callMoralisWithRetry(`/${address}/erc20`, { chain });
    } catch (error) {
      console.warn('Moralis getWalletTokenBalances failed:', error.message);
      throw error;
    }
  },

  // Get wallet token balances with prices (Moralis v2.2)
  async getWalletTokenBalancesPrices(address, chain = 'eth') {
    try {
      if (!API_KEY) {
        throw new Error('Moralis API key not configured');
      }

      return await callMoralisWithRetry(`/wallets/${address}/tokens`, { chain });
    } catch (error) {
      console.warn('Moralis getWalletTokenBalancesPrices failed:', error.message);
      throw error;
    }
  },

  // Get wallet transaction history (Moralis v2.2)
  async getWalletHistory(address, chain = 'eth') {
    try {
      if (!API_KEY) {
        throw new Error('Moralis API key not configured');
      }

      return await callMoralisWithRetry(`/wallets/${address}/history`, { chain });
    } catch (error) {
      console.warn('Moralis getWalletHistory failed:', error.message);
      throw error;
    }
  }
};

export { moralisApi };
export default moralisApi;
