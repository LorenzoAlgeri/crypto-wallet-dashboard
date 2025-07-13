# 🚀 Quick Start Guide

## Prerequisiti
- Node.js 18+ installato
- npm o yarn

## Setup in 3 Step

### 1. Installa Dipendenze
```bash
npm install
```

### 2. Configura API Keys
```bash
# Copia il file di esempio
cp .env.example .env

# Modifica .env con le tue API keys
# MORALIS_API_KEY=la_tua_chiave_moralis
# ETHERSCAN_API_KEY è già fornita
```

### 3. Avvia l'App
```bash
npm run dev
```

## 🎯 Accesso

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 🔑 Come Ottenere le API Keys

### Moralis (Necessaria)
1. Vai su https://moralis.io
2. Crea un account gratuito
3. Crea un nuovo progetto
4. Copia la "Web3 API Key"
5. Incollala nel file `.env`

### Etherscan (Già Fornita)
- API Key: `V48YH1DY74AFF5PQFWMTXSHN8UYRG3NUZP`
- Già configurata nel file `.env`

## 🎮 Demo

Il progetto include un wallet demo già configurato:
`0x4301537fAa05f87A733113Bdfb222833507f2917`

Puoi iniziare immediatamente a esplorare la dashboard!

## 🆘 Problemi Comuni

### "Failed to fetch portfolio data"
- Assicurati che il server backend sia avviato
- Verifica le API keys in `.env`

### Errori Tailwind CSS
- Assicurati che PostCSS sia configurato correttamente
- Riavvia il server di sviluppo

### Porta già in uso
```bash
# Cambia porta nel vite.config.js o termina processo esistente
lsof -ti:3000 | xargs kill -9
```

## 📱 Funzionalità Principali

1. **Aggiungi Wallet**: Inserisci indirizzi Ethereum nella form
2. **Visualizza Portfolio**: Cards con metriche principali
3. **Analizza Trend**: Grafico storico valore vs cost basis  
4. **Controlla Allocazione**: Distribuzione assets con chart
5. **Dettagli Assets**: Tabella completa con sorting

## 🎨 Personalizzazione

- Modifica colori in `tailwind.config.js`
- Aggiungi nuove metriche in `OverviewCards.jsx`
- Estendi API in `server.js`

---

**Happy Trading! 🚀💰**
