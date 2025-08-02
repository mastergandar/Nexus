
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Account {
  id: number;
  name: string;
  email: string;
  status: string;
  balance: number;
  listings: number;
}

interface ComparisonContextType {
  selectedAccounts: Account[];
  addToComparison: (account: Account) => void;
  removeFromComparison: (accountId: number) => void;
  clearComparison: () => void;
  isInComparison: (accountId: number) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

interface ComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);

  const addToComparison = (account: Account) => {
    setSelectedAccounts(prev => {
      if (prev.find(acc => acc.id === account.id)) {
        return prev;
      }
      return [...prev, account];
    });
  };

  const removeFromComparison = (accountId: number) => {
    setSelectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
  };

  const clearComparison = () => {
    setSelectedAccounts([]);
  };

  const isInComparison = (accountId: number) => {
    return selectedAccounts.some(acc => acc.id === accountId);
  };

  return (
    <ComparisonContext.Provider value={{
      selectedAccounts,
      addToComparison,
      removeFromComparison,
      clearComparison,
      isInComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
};
