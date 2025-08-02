
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'pink';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'from-primary to-blue-400',
    green: 'from-success to-green-400',
    orange: 'from-warning to-orange-400',
    red: 'from-destructive to-red-400',
    purple: 'from-purple to-purple-400',
    pink: 'from-pink to-pink-400'
  };

  const iconBgClasses = {
    blue: 'bg-primary/20 text-primary',
    green: 'bg-success/20 text-success',
    orange: 'bg-warning/20 text-warning',
    red: 'bg-destructive/20 text-destructive',
    purple: 'bg-purple/20 text-purple',
    pink: 'bg-pink/20 text-pink'
  };

  const changeColor = change?.startsWith('+') ? 'text-success' : 'text-destructive';

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`text-sm ${changeColor} mt-1 flex items-center`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${iconBgClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
