
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-green-500 to-emerald-400',
    orange: 'from-orange-500 to-yellow-400',
    red: 'from-red-500 to-pink-400'
  };

  const changeColor = change?.startsWith('+') ? 'text-green-400' : 'text-red-400';

  return (
    <div className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-sm ${changeColor} mt-1`}>{change}</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
