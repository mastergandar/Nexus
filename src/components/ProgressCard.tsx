
import React from 'react';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  unit: string;
  percentage: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  current, 
  total, 
  unit, 
  percentage 
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-destructive';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="text-muted-foreground text-sm">{percentage}%</span>
      </div>
      
      <div className="mb-4">
        <p className="text-2xl font-bold text-foreground mb-1">
          {current} <span className="text-lg text-muted-foreground">{unit}</span>
        </p>
        <p className="text-muted-foreground text-sm">из {total} {unit}</p>
      </div>
      
      <div className="progress-bar">
        <div 
          className={`progress-fill ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressCard;
