import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareIds, setCompareIds] = useState(() => {
    try {
      const saved = localStorage.getItem('shopsense_compare');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-2']; // default 2 products for quick demo
    } catch {
      return ['prod-1', 'prod-2'];
    }
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('shopsense_compare', JSON.stringify(compareIds));
    } catch (e) {
      console.error('Failed to save compare list', e);
    }
  }, [compareIds]);

  const addToCompare = (productId) => {
    if (compareIds.includes(productId)) {
      removeFromCompare(productId);
      return;
    }
    if (compareIds.length >= 4) {
      setNotification('You can compare a maximum of 4 products at once.');
      setTimeout(() => setNotification(''), 3000);
      return false;
    }
    setCompareIds(prev => [...prev, productId]);
    return true;
  };

  const removeFromCompare = (productId) => {
    setCompareIds(prev => prev.filter(id => id !== productId));
  };

  const isInCompare = (productId) => {
    return compareIds.includes(productId);
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  return (
    <CompareContext.Provider value={{
      compareIds,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      compareCount: compareIds.length,
      notification
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within a CompareProvider');
  return context;
}
