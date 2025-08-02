
import React from 'react';
import { Search, Bell, User, ChevronDown, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const { selectedAccounts } = useComparison();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="glass-header h-16 flex items-center justify-between px-6 ml-16 lg:ml-64 fixed top-0 right-0 left-0 lg:left-64 z-20">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск аккаунтов, объявлений, файлов..."
            className="w-full glass-input pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/accounts/compare')}
          className={`relative p-2 rounded-lg transition-colors ${
            selectedAccounts.length > 0 
              ? 'text-primary hover:text-primary/80 bg-primary/20 hover:bg-primary/30' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          disabled={selectedAccounts.length === 0}
        >
          <BarChart3 className="w-5 h-5" />
          {selectedAccounts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
              {selectedAccounts.length}
            </span>
          )}
        </button>

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
        </button>

        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-info rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-foreground">Георгий Джонсон</p>
            <p className="text-xs text-muted-foreground">johnson@example.com</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;
