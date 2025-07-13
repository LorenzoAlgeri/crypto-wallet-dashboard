import React, { useState } from 'react';

const WalletForm = ({ onAddWallet, wallets, onRemoveWallet }) => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [selectedChains, setSelectedChains] = useState(['eth']);

  const validateEthereumAddress = (addr) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const chains = [
    { id: 'eth', name: 'Ethereum', icon: '🔷' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵' },
    { id: 'polygon', name: 'Polygon', icon: '🟣' },
    { id: 'bsc', name: 'BSC', icon: '🟡' }
  ];

  const toggleChain = (chainId) => {
    setSelectedChains(prev => 
      prev.includes(chainId) 
        ? prev.filter(id => id !== chainId)
        : [...prev, chainId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!validateEthereumAddress(address)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    if (wallets.some(wallet => (wallet.address || wallet) === address)) {
      setError('This wallet is already being tracked');
      return;
    }

    onAddWallet({ address, chains: selectedChains });
    setAddress('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Wallet Addresses</h2>
        <button 
          onClick={() => window.location.reload()} 
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Chain Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Supported Networks:
        </label>
        <div className="flex flex-wrap gap-2">
          {chains.map(chain => (
            <button
              key={chain.id}
              type="button"
              onClick={() => toggleChain(chain.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                selectedChains.includes(chain.id)
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {chain.icon} {chain.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Wallets will be monitored across all 7 networks automatically using Ethereum V2 API
        </p>
      </div>

      {/* Add Wallet Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder=""
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            ➕ Add Wallet
          </button>
        </div>
      </form>

      {/* Supported Networks Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-600 text-sm font-medium">Supported Networks:</span>
          </div>
          <div className="ml-3 text-sm text-blue-700">
            <span className="inline-flex items-center space-x-1">
              <span>Ethereum</span>
              <span>•</span>
              <span>Arbitrum</span>
              <span>•</span>
              <span>Optimism</span>
              <span>•</span>
              <span>Base</span>
              <span>•</span>
              <span>Polygon</span>
              <span>•</span>
              <span>BSC</span>
              <span>•</span>
              <span>Avalanche</span>
            </span>
            <div className="mt-1 text-xs">
              Wallets will be monitored across all 7 networks automatically using Ethereum V2 API
            </div>
          </div>
        </div>
      </div>

      {/* Tracked Wallets */}
      {wallets.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Tracked Wallets ({wallets.length})
          </h3>
          <div className="space-y-2">
            {wallets.map((wallet, index) => (
              <div key={wallet.address || wallet} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <code className="text-sm text-gray-700 bg-white px-2 py-1 rounded border">
                      {(wallet.address || wallet).slice(0, 6)}...{(wallet.address || wallet).slice(-4)}
                    </code>
                    {wallet.chains && (
                      <div className="text-xs text-gray-500 mt-1">
                        {wallet.chains.map(chainId => chains.find(c => c.id === chainId)?.name).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveWallet(wallet.address || wallet)}
                  className="text-red-500 hover:text-red-700 p-1 rounded"
                  title="Remove wallet"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletForm;
