
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PrintChartContainerProps {
    title: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

const PrintChartContainer: React.FC<PrintChartContainerProps> = ({
                                                                     title,
                                                                     children,
                                                                     size = 'medium'
                                                                 }) => {
    const heights = {
        small: 'h-32',
        medium: 'h-48',
        large: 'h-64'
    };

    return (
        <Card className="glass-card print-avoid-break print-chart">
            <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`${heights[size]} w-full`}>
                    {children}
                </div>
            </CardContent>
        </Card>
    );
};

export default PrintChartContainer;