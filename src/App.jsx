import { useState, useEffect } from 'react'
import WalletForm from './components/WalletForm'
import Dashboard from './components/Dashboard'
import AlertsTable from './components/AlertsTable'
import usePortfolioData from './hooks/usePortfolioData'
import './App.css'

function App() {
  const [wallets, setWallets] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Carica i dati del portfolio una sola volta per condividerli tra i componenti
  const portfolioResult = usePortfolioData(wallets)
  const portfolioData = portfolioResult
  const loading = portfolioResult.loading
  const error = portfolioResult.error

  // Load wallets from localStorage on startup, if any
  useEffect(() => {
    const savedWallets = localStorage.getItem('trackedWallets')
    if (savedWallets) {
      try {
        const parsedWallets = JSON.parse(savedWallets)
        if (Array.isArray(parsedWallets) && parsedWallets.length > 0) {
          setWallets(parsedWallets)
        }
      } catch (error) {
        console.warn('Failed to parse saved wallets:', error)
      }
    }
  }, [])

  const handleAddWallet = (walletData) => {
    const newWallets = [...wallets, walletData]
    setWallets(newWallets)
    localStorage.setItem('trackedWallets', JSON.stringify(newWallets))
  }

  const handleRemoveWallet = (address) => {
    const newWallets = wallets.filter(wallet => (wallet.address || wallet) !== address)
    setWallets(newWallets)
    localStorage.setItem('trackedWallets', JSON.stringify(newWallets))
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'alerts', label: 'Price Alerts', icon: '🔔' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Crypto Portfolio Tracker
        </h1>
        
        <WalletForm 
          onAddWallet={handleAddWallet}
          wallets={wallets}
          onRemoveWallet={handleRemoveWallet}
        />
        
        {wallets.length > 0 && (
          <div className="mt-8">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm border">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <Dashboard 
                wallets={wallets} 
                portfolioData={portfolioData}
                loading={loading}
                error={error}
              />
            )}
            
            {activeTab === 'alerts' && (
              <AlertsTable 
                portfolioData={portfolioData}
                loading={loading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
