import { useState, useEffect } from 'react';

const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  // Carica gli alert dal localStorage all'avvio
  useEffect(() => {
    const savedAlerts = localStorage.getItem('priceAlerts');
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error('Error loading alerts from localStorage:', error);
        setAlerts([]);
      }
    }
  }, []);

  // Salva gli alert nel localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  }, [alerts]);

  // Aggiungi nuovo alert
  const addAlert = (symbol, highThreshold, lowThreshold, costBasis, priceTarget, emailNotification) => {
    const newAlert = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      highThreshold: parseFloat(highThreshold) || 0,
      lowThreshold: parseFloat(lowThreshold) || 0,
      costBasis: parseFloat(costBasis) || 0,
      priceTarget: parseFloat(priceTarget) || 0,
      emailNotification: Boolean(emailNotification),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  };

  // Rimuovi alert
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Attiva/Disattiva alert
  const toggleAlert = (id) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, isActive: !alert.isActive }
          : alert
      )
    );
  };

  // Aggiorna alert esistente
  const updateAlert = (id, updates) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, ...updates }
          : alert
      )
    );
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    toggleAlert,
    updateAlert
  };
};

export default useAlerts;
