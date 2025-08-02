
import React from 'react';
import { Eye, Phone, Heart, TrendingUp } from 'lucide-react';

interface ListingMetricsProps {
    views: number;
    contacts: number;
    favourites: number;
}

const ListingMetrics: React.FC<ListingMetricsProps> = ({
                                                           views = 0,
                                                           contacts = 0,
                                                           favourites = 0
                                                       }) => {
    const conversion = views > 0
        ? ((contacts / views) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{views}</span>
            </div>

            <div className="flex items-center space-x-1 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{contacts}</span>
            </div>

            <div className="flex items-center space-x-1 text-gray-400">
                <Heart className="w-4 h-4" />
                <span>{favourites}</span>
            </div>

            <div className="flex items-center space-x-1 text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>{conversion}%</span>
            </div>
        </div>
    );
};

export default ListingMetrics;