
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useComparison } from '../contexts/ComparisonContext';
import { X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from '../components/DateRangePicker';
import RatingCard from '../components/RatingCard';
import ComparisonTable from '../components/ComparisonTable';

const AccountComparison = () => {
  const { selectedAccounts, removeFromComparison, clearComparison } = useComparison();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  if (selectedAccounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Нет аккаунтов для сравнения</h2>
        <p className="text-gray-400 mb-6">Выберите аккаунты на странице аккаунтов для их сравнения</p>
        <button
          onClick={() => navigate('/accounts')}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-all"
        >
          Перейти к аккаунтам
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/accounts')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            Сравнение аккаунтов ({selectedAccounts.length})
          </h1>
        </div>
        <button
          onClick={clearComparison}
          className="px-4 py-2 text-red-400 hover:text-red-300 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-all"
        >
          Очистить все
        </button>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker 
        date={dateRange} 
        onDateChange={setDateRange}
      />

      {/* Selected Accounts */}
      <div className="flex flex-wrap gap-3 p-4 glass-card rounded-xl">
        {selectedAccounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
          >
            <span>{account.name}</span>
            <button
              onClick={() => removeFromComparison(account.id)}
              className="hover:text-blue-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* AI Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedAccounts.map((account) => (
          <RatingCard
            key={account.id}
            accountName={account.name}
            efficiencyRating={7.8 + Math.random() * 2}
            profitabilityRating={6.5 + Math.random() * 3}
          />
        ))}
      </div>

      {/* Comparison Table */}
      <ComparisonTable accounts={selectedAccounts} />
    </div>
  );
};

export default AccountComparison;
