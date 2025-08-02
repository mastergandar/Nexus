
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PrintMetricCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

const PrintMetricCard: React.FC<PrintMetricCardProps> = ({
                                                             title,
                                                             value,
                                                             icon,
                                                             size = 'medium'
                                                         }) => {
    const sizeClasses = {
        small: 'p-2',
        medium: 'p-4',
        large: 'p-6'
    };

    const textSizes = {
        small: { title: 'text-xs', value: 'text-base' },
        medium: { title: 'text-sm', value: 'text-xl' },
        large: { title: 'text-base', value: 'text-2xl' }
    };

    return (
        <Card className={`glass-card ${sizeClasses[size]} print-avoid-break`}>
            <CardContent className="p-0">
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-gray-400 ${textSizes[size].title}`}>{title}</p>
                        <p className={`font-bold text-white ${textSizes[size].value}`}>{value}</p>
                    </div>
                    <div className="text-blue-400 flex-shrink-0">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PrintMetricCard;