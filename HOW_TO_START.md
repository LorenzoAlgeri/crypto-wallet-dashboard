# 🚀 Come Avviare la Dashboard

## 📋 **Metodi di Avvio**

### 🥇 **Metodo 1: Script Automatico (Raccomandato)**
```bash
# Vai nella directory del progetto
cd wallet-dashboard

# Avvia entrambi i servizi con un comando
./start-dashboard.sh
```
**Vantaggi:**
- ✅ Avvia frontend e backend insieme
- ✅ Pulisce automaticamente i processi esistenti  
- ✅ Gestisce lo stop con Ctrl+C
- ✅ Mostra stato e URL di accesso

---

### 🥈 **Metodo 2: NPM Script**
```bash
cd wallet-dashboard
npm start
```

---

### 🥉 **Metodo 3: Manuale (Due Terminal)**

**Terminal 1 - Backend:**
```bash
cd wallet-dashboard
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd wallet-dashboard  
npm run frontend
```

---

## 🌐 **Accesso all'Applicazione**

Dopo l'avvio, apri nel browser:
- **Dashboard**: http://localhost:3000
- **API Backend**: http://localhost:3001

---

## ⚡ **Quick Start**

1. **Prima volta:**
   ```bash
   cd wallet-dashboard
   npm install           # Installa dipendenze
   ```

2. **Ogni volta dopo:**
   ```bash
   ./start-dashboard.sh  # Avvia tutto
   ```

3. **Per fermare:**
   - Premi `Ctrl+C` nel terminal

---

## 🔧 **Configurazione API**

Per dati reali, modifica il file `.env`:
```bash
MORALIS_API_KEY=la_tua_chiave_moralis
ETHERSCAN_API_KEY=V48YH1DY74AFF5PQFWMTXSHN8UYRG3NUZP  # Già configurata
```

---

## 🐛 **Risoluzione Problemi**

### Porta già in uso:
```bash
# Termina processi esistenti
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Errori Tailwind:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Script non eseguibile:
```bash
chmod +x start-dashboard.sh
```

---

## 📝 **Alias Utili**

Aggiungi al tuo `~/.zshrc` o `~/.bash_profile`:
```bash
alias crypto="cd /Users/lorenzoalgeri/Desktop/crypto_tracker_def/wallet-dashboard && ./start-dashboard.sh"
```

Poi puoi avviare da qualsiasi directory con:
```bash
crypto
```

---

**Happy Trading! 💰🚀**
