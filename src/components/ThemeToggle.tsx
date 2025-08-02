import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent ${className}`}
      aria-label={isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle; 