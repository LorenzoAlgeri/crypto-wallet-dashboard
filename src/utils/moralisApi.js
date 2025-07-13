import axios from 'axios';

// Moralis API configuration
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2';
const API_KEY = import.meta.env.VITE_MORALIS_API_KEY;

// QuickNode GoldRush fallback configuration
const GOLDRUSH_BASE_URL = 'https://api.covalenthq.com/v1';
const GOLDRUSH_API_KEY = import.meta.env.VITE_GOLDRUSH_API_KEY;

// Exponential backoff configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 300, // 300ms initial delay
  maxDelay: 2400  // 2.4s max delay
};

// Sleep function for retry delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// QuickNode GoldRush fallback API call
const callGoldRushAPI = async (endpoint, params = {}) => {
  if (!GOLDRUSH_API_KEY) {
    throw new Error('GoldRush API key not configured');
  }

  try {
    const response = await axios.get(`${GOLDRUSH_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${GOLDRUSH_API_KEY}`
      },
      params,
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Unknown GoldRush API error';
    throw new Error(`GoldRush API failed: ${errorMessage}`);
  }
};

// Convert chain names for GoldRush
const getGoldRushChainId = (chain) => {
  const chainMap = {
    'eth': 1,
    'polygon': 137,
    'bsc': 56,
    'arbitrum': 42161,
    'avalanche': 43114
  };
  return chainMap[chain] || 1;
};

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
      console.warn('Moralis getNativeBalance failed, trying GoldRush fallback:', error.message);
      
      // Try GoldRush fallback
      try {
        const chainId = getGoldRushChainId(chain);
        const fallbackData = await callGoldRushAPI(`/${chainId}/address/${address}/balances_v2/`);
        
        // Transform GoldRush data to match Moralis format
        const nativeToken = fallbackData.data?.items?.find(item => item.native_token);
        return {
          balance: nativeToken?.balance || '0'
        };
      } catch (fallbackError) {
        console.error('Both Moralis and GoldRush failed for native balance:', fallbackError.message);
        throw error; // Throw original Moralis error
      }
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
      console.warn('Moralis getWalletTokenBalances failed, trying GoldRush fallback:', error.message);
      
      // Try GoldRush fallback
      try {
        const chainId = getGoldRushChainId(chain);
        const fallbackData = await callGoldRushAPI(`/${chainId}/address/${address}/balances_v2/`);
        
        // Transform GoldRush data to match Moralis format
        const tokens = fallbackData.data?.items?.filter(item => !item.native_token) || [];
        return tokens.map(token => ({
          token_address: token.contract_address,
          name: token.contract_name,
          symbol: token.contract_ticker_symbol,
          decimals: token.contract_decimals,
          balance: token.balance
        }));
      } catch (fallbackError) {
        console.error('Both Moralis and GoldRush failed for token balances:', fallbackError.message);
        throw error; // Throw original Moralis error
      }
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
      console.warn('Moralis getWalletTokenBalancesPrices failed, trying GoldRush fallback:', error.message);
      
      // Try GoldRush fallback
      try {
        const chainId = getGoldRushChainId(chain);
        const fallbackData = await callGoldRushAPI(`/${chainId}/address/${address}/balances_v2/`);
        
        // Transform GoldRush data to match Moralis format (includes pricing data)
        return {
          result: fallbackData.data?.items?.map(item => ({
            token_address: item.contract_address,
            name: item.contract_name,
            symbol: item.contract_ticker_symbol,
            decimals: item.contract_decimals,
            balance: item.balance,
            price: item.quote_rate,
            value: item.quote
          })) || []
        };
      } catch (fallbackError) {
        console.error('Both Moralis and GoldRush failed for token balances with prices:', fallbackError.message);
        throw error; // Throw original Moralis error
      }
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
      console.warn('Moralis getWalletHistory failed, trying GoldRush fallback:', error.message);
      
      // Try GoldRush fallback
      try {
        const chainId = getGoldRushChainId(chain);
        const fallbackData = await callGoldRushAPI(`/${chainId}/address/${address}/transactions_v2/`);
        
        // Transform GoldRush data to match Moralis format
        return {
          result: fallbackData.data?.items || [],
          total: fallbackData.data?.pagination?.total_count || 0
        };
      } catch (fallbackError) {
        console.error('Both Moralis and GoldRush failed for wallet history:', fallbackError.message);
        throw error; // Throw original Moralis error
      }
    }
  }
};

export { moralisApi };
export default moralisApi;
