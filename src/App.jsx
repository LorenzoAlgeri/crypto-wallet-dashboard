import { useState, useEffect } from 'react'
import WalletForm from './components/WalletForm'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [wallets, setWallets] = useState([])

  // Load demo wallet on startup
  useEffect(() => {
    const demoWallet = '0x6339037ddF59e9a830980cc0a7DF990Ecd463F31'
    setWallets([{ address: demoWallet, chains: ['eth'] }])
  }, [])

  const handleAddWallet = (walletData) => {
    setWallets(prev => [...prev, walletData])
  }

  const handleRemoveWallet = (address) => {
    setWallets(prev => prev.filter(wallet => (wallet.address || wallet) !== address))
  }

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
          <Dashboard wallets={wallets} />
        )}
      </div>
    </div>
  )
}

export default App
