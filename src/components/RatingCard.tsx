
import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

interface RatingCardProps {
  accountName: string;
  efficiencyRating: number;
  profitabilityRating: number;
}

const RatingCard: React.FC<RatingCardProps> = ({ 
  accountName, 
  efficiencyRating, 
  profitabilityRating 
}) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 6) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 8) return 'bg-green-500/20 border-green-500/30';
    if (rating >= 6) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-white mb-4">{accountName}</h3>
      
      <div className="space-y-4">
        <div className={`p-4 rounded-lg border ${getRatingBg(efficiencyRating)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-white font-medium">Эффективность</span>
            </div>
            <span className={`text-2xl font-bold ${getRatingColor(efficiencyRating)}`}>
              {efficiencyRating.toFixed(1)}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Рейтинг активности и конверсий
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${getRatingBg(profitabilityRating)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-white font-medium">Прибыльность</span>
            </div>
            <span className={`text-2xl font-bold ${getRatingColor(profitabilityRating)}`}>
              {profitabilityRating.toFixed(1)}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Рейтинг доходности и ROI
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
