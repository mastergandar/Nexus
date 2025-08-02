
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
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-gray-400 text-sm">{percentage}%</span>
      </div>
      
      <div className="mb-4">
        <p className="text-2xl font-bold text-white mb-1">
          {current} <span className="text-lg text-gray-400">{unit}</span>
        </p>
        <p className="text-gray-400 text-sm">из {total} {unit}</p>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressCard;
