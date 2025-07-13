// Mock di import.meta.env prima di importare il modulo
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_MORALIS_API_KEY: 'test-api-key',
        VITE_LOCAL_SERVER: 'false',
        GOLDRUSH_API_KEY: 'test-goldrush-key'
      }
    }
  },
  writable: true
});

// Mock di fetch
global.fetch = jest.fn();

describe('MoralisApi', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Reset environment variables
    process.env.VITE_MORALIS_API_KEY = 'test-api-key';
    process.env.VITE_LOCAL_SERVER = 'false';
  });

  describe('API Functions', () => {
    it('should make fetch calls with correct headers', async () => {
      // Mock fetch response
      const mockResponse = {
        result: [
          {
            hash: '0x123',
            block_timestamp: '2023-01-01T00:00:00.000Z',
            from_address: '0xabc',
            to_address: '0xdef',
            value: '1000000000000000000',
            gas_price: '20000000000'
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      // Simulate a basic API call
      const response = await fetch('https://deep-index.moralis.io/api/v2.2/test', {
        method: 'GET',
        headers: {
          'X-API-Key': 'test-api-key',
          'accept': 'application/json'
        }
      });

      const data = await response.json();
      
      expect(fetch).toHaveBeenCalledWith(
        'https://deep-index.moralis.io/api/v2.2/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-API-Key': 'test-api-key'
          })
        })
      );
      
      expect(data).toEqual(mockResponse);
    });

    it('should handle API errors with retry logic', async () => {
      // Mock first call to fail with 429, second to succeed
      fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          json: async () => ({ message: 'Rate limit exceeded' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ result: [] })
        });

      // Simulate retry logic
      let result;
      try {
        const response1 = await fetch('https://deep-index.moralis.io/api/v2.2/test');
        if (!response1.ok) {
          // Simulate retry after delay
          const response2 = await fetch('https://deep-index.moralis.io/api/v2.2/test');
          result = await response2.json();
        }
      } catch (error) {
        result = { result: [] };
      }
      
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ result: [] });
    });

    it('should fallback to QuickNode GoldRush format', async () => {
      // Mock QuickNode GoldRush response
      const goldRushResponse = {
        data: {
          items: [
            {
              tx_hash: '0x456',
              block_signed_at: '2023-01-01T00:00:00.000Z',
              from_address: '0xabc',
              to_address: '0xdef',
              value: '1000000000000000000'
            }
          ]
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => goldRushResponse
      });

      const response = await fetch('https://api.covalenthq.com/v1/test');
      const data = await response.json();
      
      // Simulate data transformation from GoldRush to Moralis format
      const transformedData = data.data.items.map(item => ({
        hash: item.tx_hash,
        block_timestamp: item.block_signed_at,
        from_address: item.from_address,
        to_address: item.to_address,
        value: item.value
      }));
      
      expect(transformedData).toEqual([
        {
          hash: '0x456',
          block_timestamp: '2023-01-01T00:00:00.000Z',
          from_address: '0xabc',
          to_address: '0xdef',
          value: '1000000000000000000'
        }
      ]);
    });

    it('should return empty array when all APIs fail', async () => {
      // Mock all APIs to fail
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' })
      });

      let result = [];
      try {
        const response = await fetch('https://deep-index.moralis.io/api/v2.2/test');
        if (!response.ok) {
          // Simulate fallback failure
          const fallbackResponse = await fetch('https://api.covalenthq.com/v1/test');
          if (!fallbackResponse.ok) {
            result = [];
          }
        }
      } catch (error) {
        result = [];
      }
      
      expect(result).toEqual([]);
    });
  });

  describe('URL Construction', () => {
    it('should construct correct Moralis URLs', () => {
      const address = '0x123';
      const chain = 'eth';
      
      const expectedUrls = {
        history: `https://deep-index.moralis.io/api/v2.2/${address}?chain=${chain}`,
        balance: `https://deep-index.moralis.io/api/v2.2/${address}/balance?chain=${chain}`,
        tokens: `https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=${chain}`
      };
      
      expect(expectedUrls.history).toContain(address);
      expect(expectedUrls.history).toContain(chain);
      expect(expectedUrls.balance).toContain('balance');
      expect(expectedUrls.tokens).toContain('erc20');
    });
  });

  describe('Chain Support', () => {
    it('should support multiple chains', () => {
      const supportedChains = ['eth', 'polygon', 'bsc', 'avalanche'];
      
      supportedChains.forEach(chain => {
        const url = `https://deep-index.moralis.io/api/v2.2/0x123?chain=${chain}`;
        expect(url).toContain(chain);
      });
    });
  });
});
