
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  BarChart3, 
  FileText, 
  Wallet, 
  Bot, 
  Settings,
  Layers,
  TrendingUp,
  PieChart
} from 'lucide-react';

const navigationItems = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/accounts', icon: Users, label: 'Аккаунты' },
  { to: '/statistics', icon: BarChart3, label: 'Статистика' },
  { to: '/listings', icon: FileText, label: 'Объявления' },
  { to: '/balance', icon: Wallet, label: 'Баланс' },
  { to: '/ai-tools', icon: Bot, label: 'ИИ-инструменты' },
  { to: '/reports', icon: PieChart, label: 'Отчеты' },
  { to: '/settings', icon: Settings, label: 'Настройки' },
];

const Sidebar = () => {
  return (
    <div className="w-16 lg:w-64 h-full glass-sidebar fixed left-0 top-0 z-30 transition-all duration-300">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-center lg:justify-start">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-400 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="ml-3 font-bold text-lg gradient-text hidden lg:block">
            AvitoNexus
          </span>
        </div>
      </div>
      
      <nav className="mt-8 px-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-item ${
                isActive
                  ? 'nav-item-active'
                  : 'nav-item-inactive'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section with additional info */}
      <div className="absolute bottom-4 left-2 right-2 hidden lg:block">
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs font-medium text-foreground">Статус системы</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Все сервисы</span>
            <div className="w-2 h-2 bg-success rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
