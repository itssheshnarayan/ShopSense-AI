import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_WEIGHTS, validateWeights, calculateValueScore } from '../utils/valueScore';

const ValueScoreContext = createContext();

export function ValueScoreProvider({ children }) {
  const [weights, setWeights] = useState(() => {
    try {
      const saved = localStorage.getItem('shopsense_valuescore_weights');
      return saved ? JSON.parse(saved) : DEFAULT_WEIGHTS;
    } catch {
      return DEFAULT_WEIGHTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('shopsense_valuescore_weights', JSON.stringify(weights));
    } catch (e) {
      console.error('Failed to save weights', e);
    }
  }, [weights]);

  const updateWeight = (key, value) => {
    const num = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
    setWeights(prev => ({
      ...prev,
      [key]: num
    }));
  };

  const resetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  const validation = validateWeights(weights);

  const getProductScore = (product) => {
    return calculateValueScore(product, weights);
  };

  return (
    <ValueScoreContext.Provider value={{
      weights,
      updateWeight,
      resetWeights,
      validation,
      getProductScore,
      isDefault: JSON.stringify(weights) === JSON.stringify(DEFAULT_WEIGHTS)
    }}>
      {children}
    </ValueScoreContext.Provider>
  );
}

export function useValueScore() {
  const context = useContext(ValueScoreContext);
  if (!context) throw new Error('useValueScore must be used within a ValueScoreProvider');
  return context;
}
