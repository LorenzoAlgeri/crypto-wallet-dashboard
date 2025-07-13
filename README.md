# 🚀 Crypto Wallet Dashboard

Una dashboard moderna e locale per il tracking del portfolio crypto multi-wallet.

## ✨ Caratteristiche

- **Multi-wallet Tracking**: Monitora più indirizzi Ethereum contemporaneamente
- **Real-time Data**: Dati in tempo reale tramite API Moralis ed Etherscan
- **Portfolio Analytics**: Calcolo P/L, cost basis e metriche avanzate
- **Interactive Charts**: Grafici storici e di allocazione con Chart.js
- **Responsive Design**: UI moderna e responsive con Tailwind CSS
- **Local Storage**: Persistenza dati senza database esterno

## 🛠️ Stack Tecnologico

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Backend**: Node.js + Express
- **APIs**: Moralis, Etherscan, CoinGecko

## 🚀 Quick Start

1. **Clona e installa le dipendenze**:
   ```bash
   cd wallet-dashboard
   npm install
   ```

2. **Configura le API keys**:
   ```bash
   cp .env.example .env
   # Edita .env con le tue API keys
   ```

3. **Avvia l'applicazione**:
   ```bash
   npm run dev
   ```

4. **Accedi alla dashboard**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🔑 API Keys Necessarie

### Moralis (Richiesta)
- Registrati su [moralis.io](https://moralis.io)
- Crea un nuovo progetto
- Copia la Web3 API Key

### Etherscan (Inclusa)
- API Key già fornita: `V48YH1DY74AFF5PQFWMTXSHN8UYRG3NUZP`
- Per uso intensivo, registrati su [etherscan.io](https://etherscan.io/apis)

### CoinGecko (Gratuita)
- Nessuna registrazione richiesta per l'API gratuita
- Rate limit: 30 chiamate/minuto

## 🌐 Reti Supportate

- Ethereum
- Arbitrum  
- Optimism
- Base
- Polygon
- Binance Smart Chain
- Avalanche

## 📊 Funzionalità

### Portfolio Overview
- Valore totale portfolio
- Cost basis totale
- P/L realizzati e non realizzati
- Percentuali di guadagno/perdita

### Grafici
- **Grafico storico**: Andamento valore vs cost basis nel tempo
- **Allocazione assets**: Distribuzione portfolio con doughnut chart

### Tabella Assets
- Lista dettagliata di tutti gli asset
- Ordinamento per colonna
- Dati real-time di prezzo e valore

### Gestione Wallet
- Aggiunta/rimozione indirizzi
- Validazione formato Ethereum
- Wallet demo pre-caricato

## 🏗️ Architettura

```
wallet-dashboard/
├── src/
│   ├── components/          # Componenti React
│   │   ├── WalletForm.jsx
│   │   ├── Dashboard.jsx
│   │   ├── OverviewCards.jsx
│   │   ├── HistoryChart.jsx
│   │   ├── AllocationChart.jsx
│   │   └── AssetTable.jsx
│   ├── hooks/
│   │   └── usePortfolioData.js  # Hook per gestione dati
│   ├── App.jsx              # Componente principale
│   └── main.jsx             # Entry point
├── server.js                # Backend Express
└── .env                     # Configurazione
```

## 🔧 Personalizzazione

### Aggiungere Nuove Reti
Modifica il file `usePortfolioData.js` per includere nuove blockchain supportate da Moralis.

### Modificare Calcolo Cost Basis
Il metodo attuale usa la media ponderata. Puoi implementare FIFO, LIFO o altri metodi modificando la funzione `calculateCostBasis`.

### Estendere Metriche
Aggiungi nuove metriche nel componente `OverviewCards.jsx` e relative logiche di calcolo.

## 🐛 Risoluzione Problemi

### Errore "Failed to fetch portfolio data"
- Verifica che le API keys siano configurate correttamente
- Controlla la connessione internet
- Verifica che il server backend sia in esecuzione

### Grafici non si caricano
- Assicurati che Chart.js sia installato correttamente
- Controlla la console per errori JavaScript

### Dati non aggiornati
- La dashboard si aggiorna automaticamente ogni 30 secondi
- Usa il pulsante "Refresh" per aggiornamenti manuali

## 📝 Note

- Il wallet demo (`0x4301537fAa05f87A733113Bdfb222833507f2917`) è incluso per testing
- I dati storici sono simulati per la demo
- Per uso in produzione, implementa un sistema di caching robusto
- Considera l'uso di WebSocket per aggiornamenti real-time

## 🤝 Contributi

Sentiti libero di contribuire al progetto con pull request e segnalazioni di bug!

## 📄 Licenza

MIT License - Vedi LICENSE file per dettagli.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
