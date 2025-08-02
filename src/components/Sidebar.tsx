
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
  Layers
} from 'lucide-react';

const navigationItems = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/accounts', icon: Users, label: 'Аккаунты' },
  { to: '/statistics', icon: BarChart3, label: 'Статистика' },
  { to: '/listings', icon: FileText, label: 'Объявления' },
  { to: '/balance', icon: Wallet, label: 'Баланс' },
  { to: '/ai-tools', icon: Bot, label: 'ИИ-инструменты' },
  { to: '/settings', icon: Settings, label: 'Настройки' },
];

const Sidebar = () => {
  return (
    <div className="w-16 lg:w-64 h-full glass-card fixed left-0 top-0 z-30 transition-all duration-300">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-center lg:justify-start">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
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
              `flex items-center px-3 py-3 mb-2 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
