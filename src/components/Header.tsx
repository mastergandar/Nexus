
import React from 'react';
import { Search, Bell, User, ChevronDown, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';

const Header = () => {
  const navigate = useNavigate();
  const { selectedAccounts } = useComparison();

  return (
    <header className="glass-header h-16 flex items-center justify-between px-6 ml-16 lg:ml-64 fixed top-0 right-0 left-0 lg:left-64 z-20">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск аккаунтов, объявлений, файлов..."
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/accounts/compare')}
          className={`relative p-2 rounded-lg transition-colors ${
            selectedAccounts.length > 0 
              ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-400/20' 
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          disabled={selectedAccounts.length === 0}
        >
          <BarChart3 className="w-5 h-5" />
          {selectedAccounts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 text-black text-xs rounded-full flex items-center justify-center font-bold">
              {selectedAccounts.length}
            </span>
          )}
        </button>

        <button className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-white">Георгий Джонсон</p>
            <p className="text-xs text-gray-400">johnson@example.com</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;
