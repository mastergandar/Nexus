
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonLoadingProps {
    variant: 'listing' | 'metric-card' | 'table' | 'card' | 'form';
    count?: number;
    rows?: number;
    columns?: number;
    className?: string;
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
                                                             variant,
                                                             count = 1,
                                                             rows = 5,
                                                             columns = 4,
                                                             className
                                                         }) => {
    const renderListingSkeleton = () => (
        <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10">
                    <tr>
                        <th className="text-left p-6">
                            <Skeleton className="h-4 w-24 bg-white/10" />
                        </th>
                        <th className="text-left p-6">
                            <Skeleton className="h-4 w-16 bg-white/10" />
                        </th>
                        <th className="text-left p-6">
                            <Skeleton className="h-4 w-20 bg-white/10" />
                        </th>
                        <th className="text-left p-6">
                            <Skeleton className="h-4 w-20 bg-white/10" />
                        </th>
                        <th className="text-left p-6">
                            <Skeleton className="h-4 w-24 bg-white/10" />
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({ length: count }).map((_, index) => (
                        <tr key={index} className="border-b border-white/5">
                            <td className="p-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48 bg-white/10" />
                                    <Skeleton className="h-3 w-24 bg-white/10" />
                                </div>
                            </td>
                            <td className="p-6">
                                <Skeleton className="h-4 w-20 bg-white/10" />
                            </td>
                            <td className="p-6">
                                <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                            </td>
                            <td className="p-6">
                                <div className="flex items-center space-x-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="flex items-center space-x-1">
                                            <Skeleton className="w-4 h-4 bg-white/10" />
                                            <Skeleton className="w-8 h-3 bg-white/10" />
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex space-x-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="w-8 h-8 bg-white/10" />
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderMetricCardSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-2 bg-white/10" />
                            <Skeleton className="h-8 w-16 mb-1 bg-white/10" />
                            <Skeleton className="h-3 w-20 bg-white/10" />
                        </div>
                        <Skeleton className="w-12 h-12 rounded-lg bg-white/10" />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderTableSkeleton = () => (
        <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10">
                    <tr>
                        {Array.from({ length: columns }).map((_, index) => (
                            <th key={index} className="text-left p-4">
                                <Skeleton className="h-4 w-20 bg-white/10" />
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-white/5">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="p-4">
                                    <Skeleton className="h-4 w-full bg-white/10" />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCardSkeleton = () => (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="glass-card p-6 rounded-xl">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-32 bg-white/10" />
                        <Skeleton className="h-4 w-full bg-white/10" />
                        <Skeleton className="h-4 w-3/4 bg-white/10" />
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-4 w-24 bg-white/10" />
                            <Skeleton className="h-8 w-20 bg-white/10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderFormSkeleton = () => (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="space-y-4">
                    <div>
                        <Skeleton className="h-4 w-24 mb-2 bg-white/10" />
                        <Skeleton className="h-10 w-full bg-white/10" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-32 mb-2 bg-white/10" />
                        <Skeleton className="h-20 w-full bg-white/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton className="h-4 w-20 mb-2 bg-white/10" />
                            <Skeleton className="h-10 w-full bg-white/10" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-20 mb-2 bg-white/10" />
                            <Skeleton className="h-10 w-full bg-white/10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSkeleton = () => {
        switch (variant) {
            case 'listing':
                return renderListingSkeleton();
            case 'metric-card':
                return renderMetricCardSkeleton();
            case 'table':
                return renderTableSkeleton();
            case 'card':
                return renderCardSkeleton();
            case 'form':
                return renderFormSkeleton();
            default:
                return null;
        }
    };

    return (
        <div className={cn(className)}>
            {renderSkeleton()}
        </div>
    );
};

export default SkeletonLoading;