import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Phone, Heart, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SkeletonLoading from '@/components/SkeletonLoading';
import PrintMetricCard from '@/components/PrintMetricCard';
import PrintChartContainer from '@/components/PrintChartContainer';
import axios from 'axios';

interface ReportRenderData {
    template: string;
    metrics: string;
    graphs: string;
    total_views: number;
    total_contacts: number;
    total_favourites: number;

    computed_metrics?: string[];
    computed_graphs?: string[];
}

// Клиентская часть (TypeScript)
const METRIC_MAPPING: Record<string, string> = {
    "просмотры": "views",
    "избранное": "favourites",
    "контакты": "contacts",
    "конверсия": "conversion"
};

const CHART_MAPPING: Record<string, string> = {
    "столбчатая_диаграмма": "bar",
    "линейный_график": "line",
    "круговая_диаграмма": "pie"
};

const ReportView = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<ReportRenderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReportData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await axios.get(`https://nexus_api.cryptspace.ru/report/${id}/render_data`);

                // Обработка данных сразу после получения
                const processedData = {
                    ...response.data,
                    computed_metrics: response.data.metrics
                        .split(',')
                        .map((m: string) => METRIC_MAPPING[m.trim()] || m.trim()),
                    computed_graphs: response.data.graphs
                        .split(',')
                        .map((g: string) => CHART_MAPPING[g.trim()] || g.trim())
                };

                setData(processedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching report data:', err);
                setError('Ошибка загрузки данных отчета');
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, [id]);

    const sampleData = [
        { name: 'Пн', views: data?.total_views ? Math.floor(data.total_views * 0.12) : 1200, contacts: data?.total_contacts ? Math.floor(data.total_contacts * 0.12) : 85, favorites: data?.total_favourites ? Math.floor(data.total_favourites * 0.12) : 45 },
        { name: 'Вт', views: data?.total_views ? Math.floor(data.total_views * 0.15) : 1450, contacts: data?.total_contacts ? Math.floor(data.total_contacts * 0.15) : 92, favorites: data?.total_favourites ? Math.floor(data.total_favourites * 0.15) : 52 },
        { name: 'Ср', views: data?.total_views ? Math.floor(data.total_views * 0.13) : 1350, contacts: data?.total_contacts ? Math.floor(data.total_contacts * 0.13) : 78, favorites: data?.total_favourites ? Math.floor(data.total_favourites * 0.13) : 38 },
        { name: 'Чт', views: data?.total_views ? Math.floor(data.total_views * 0.16) : 1580, contacts: data?.total_contacts ? Math.floor(data.total_contacts * 0.16) : 105, favorites: data?.total_favourites ? Math.floor(data.total_favourites * 0.16) : 65 },
        { name: 'Пт', views: data?.total_views ? Math.floor(data.total_views * 0.17) : 1720, contacts: data?.total_contacts ? Math.floor(data.total_contacts * 0.17) : 118, favorites: data?.total_favourites ? Math.floor(data.total_favourites * 0.17) : 72 },
        { name: 'Сб', views: data?.total_views ? Math.floor(data.total_views * 0.19) : 1890, contacts: data?.total_contacts ? Math.floor(data.total_contacts * 0.19) : 135, favorites: data?.total_favourites ? Math.floor(data.total_favourites * 0.19) : 89 },
        { name: 'Вс', views: data?.total_views ? Math.floor(data.total_views * 0.08) : 1650, contacts: data?.total_contacts ? Math.floor(data.total_contacts * 0.08) : 124, favorites: data?.total_favourites ? Math.floor(data.total_favourites * 0.08) : 76 },
    ];

    const pieData = [
        { name: 'Просмотры', value: 35, color: '#3b82f6' },
        { name: 'Контакты', value: 25, color: '#10b981' },
        { name: 'Избранное', value: 20, color: '#f59e0b' },
        { name: 'Конверсия', value: 20, color: '#ef4444' },
    ];

    const getMetricIcon = (metric: string) => {
        switch (metric) {
            case 'views': return <Eye className="w-4 h-4" />;
            case 'contacts': return <Phone className="w-4 h-4" />;
            case 'favourites': return <Heart className="w-4 h-4" />;
            case 'conversion': return <TrendingUp className="w-4 h-4" />;
            default: return null;
        }
    };

    const getMetricName = (metric: string) => {
        switch (metric) {
            case 'views': return 'Просмотры';
            case 'contacts': return 'Контакты';
            case 'favourites': return 'Избранное';
            case 'conversion': return 'Конверсия';
            default: return metric;
        }
    };

    const getMetricValue = (metric: string) => {
        if (!data) return '0';

        switch (metric) {
            case 'views': return data.total_views.toLocaleString();
            case 'contacts': return data.total_contacts.toLocaleString();
            case 'favourites': return data.total_favourites.toLocaleString();
            case 'conversion': return data.total_views > 0 ? ((data.total_contacts / data.total_views) * 100).toFixed(1) + '%' : '0.0%';
            default: return '0';
        }
    };

    const renderChart = (chartType: string, size: 'small' | 'medium' | 'large' = 'medium') => {
        const heights = { small: 120, medium: 180, large: 220 };
        const height = heights[size];

        const chartContent = (() => {
            switch (chartType) {
                case 'line':
                    return (
                        <ResponsiveContainer width="100%" height={height}>
                            <LineChart data={sampleData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                                <Legend fontSize={12} />
                                <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Просмотры" strokeWidth={2} />
                                <Line type="monotone" dataKey="contacts" stroke="#10b981" name="Контакты" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    );
                case 'bar':
                    return (
                        <ResponsiveContainer width="100%" height={height}>
                            <BarChart data={sampleData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                                <Legend fontSize={12} />
                                <Bar dataKey="views" fill="#3b82f6" name="Просмотры" />
                                <Bar dataKey="contacts" fill="#10b981" name="Контакты" />
                            </BarChart>
                        </ResponsiveContainer>
                    );
                case 'pie':
                    return (
                        <ResponsiveContainer width="100%" height={height}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={height * 0.35}
                                    fill="#8884d8"
                                    dataKey="value"
                                    fontSize={10}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    );
                default:
                    return null;
            }
        })();

        return (
            <PrintChartContainer title={chartType === 'line' ? 'Динамика метрик' : chartType === 'bar' ? 'Столбчатая диаграмма' : 'Распределение метрик'} size={size}>
                {chartContent}
            </PrintChartContainer>
        );
    };

    const renderLayoutContent = () => {
        if (!data) return null;

        switch (data.template) {
            case 'standard':
                return (
                    <>
                        {/* Page 1: Header + Metrics */}
                        <div className="print-page">
                            <div className="print-metrics">
                                <h3 className="text-lg font-semibold text-white mb-4">Основные метрики</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {data.computed_metrics.map((metric) => (
                                        <PrintMetricCard
                                            key={metric}
                                            title={getMetricName(metric)}
                                            value={getMetricValue(metric)}
                                            icon={getMetricIcon(metric)}
                                            size="medium"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Page 2: Charts */}
                        <div className="print-page print-page-break">
                            <h3 className="text-lg font-semibold text-white mb-4">Графики и диаграммы</h3>
                            <div className="space-y-6">
                                {data.computed_graphs.slice(0, 2).map((chart) => renderChart(chart, 'medium'))}
                            </div>
                        </div>

                        {/* Page 3: Additional chart if needed */}
                        {data.computed_graphs.length > 2 && (
                            <div className="print-page print-page-break">
                                {renderChart(data.computed_graphs[2], 'large')}
                            </div>
                        )}
                    </>
                );

            case 'compact':
                return (
                    <div className="print-page">
                        <div className="print-metrics">
                            <h3 className="text-base font-semibold text-white mb-3">Основные метрики</h3>
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                {data.computed_metrics.map((metric) => (
                                    <PrintMetricCard
                                        key={metric}
                                        title={getMetricName(metric)}
                                        value={getMetricValue(metric)}
                                        icon={getMetricIcon(metric)}
                                        size="small"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-white mb-3">Графики</h3>
                            <div className="space-y-4">
                                {data.computed_graphs.map((chart) => renderChart(chart, 'small'))}
                            </div>
                        </div>
                    </div>
                );

            case 'detailed':
                return (
                    <>
                        {/* Page 1: Detailed metrics */}
                        <div className="print-page">
                            <h3 className="text-xl font-semibold text-white mb-4">Детальная аналитика</h3>
                            <div className="space-y-4">
                                {data.computed_metrics.slice(0, 2).map((metric) => (
                                    <Card key={metric} className="glass-card print-avoid-break">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="text-gray-400 text-base">{getMetricName(metric)}</p>
                                                    <p className="text-2xl font-bold text-white">{getMetricValue(metric)}</p>
                                                </div>
                                                <div className="text-blue-400">
                                                    {getMetricIcon(metric)}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400 space-y-1">
                                                <p>Изменение за период: +{Math.floor(Math.random() * 20) + 5}%</p>
                                                <p>Средний показатель: {Math.floor(Math.random() * 1000) + 500}</p>
                                                <p>Лучший день: {['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'][Math.floor(Math.random() * 5)]}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Page 2: Remaining metrics */}
                        <div className="print-page print-page-break">
                            <div className="space-y-4">
                                {data.computed_metrics.slice(2).map((metric) => (
                                    <Card key={metric} className="glass-card print-avoid-break">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="text-gray-400 text-base">{getMetricName(metric)}</p>
                                                    <p className="text-2xl font-bold text-white">{getMetricValue(metric)}</p>
                                                </div>
                                                <div className="text-blue-400">
                                                    {getMetricIcon(metric)}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400 space-y-1">
                                                <p>Изменение за период: +{Math.floor(Math.random() * 20) + 5}%</p>
                                                <p>Средний показатель: {Math.floor(Math.random() * 1000) + 500}</p>
                                                <p>Лучший день: {['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'][Math.floor(Math.random() * 5)]}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Page 3: Charts */}
                        <div className="print-page print-page-break">
                            <h3 className="text-xl font-semibold text-white mb-4">Подробная визуализация</h3>
                            <div className="space-y-6">
                                {data.computed_graphs.map((chart) => renderChart(chart, 'medium'))}
                            </div>
                        </div>
                    </>
                );

            case 'executive':
                return (
                    <>
                        {/* Page 1: Key metrics + summary */}
                        <div className="print-page">
                            <h3 className="text-2xl font-bold text-white mb-4">Ключевые показатели</h3>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {data.computed_metrics.slice(0, 4).map((metric) => (
                                    <PrintMetricCard
                                        key={metric}
                                        title={getMetricName(metric)}
                                        value={getMetricValue(metric)}
                                        icon={getMetricIcon(metric)}
                                        size="large"
                                    />
                                ))}
                            </div>

                            <Card className="glass-card print-avoid-break">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Краткие выводы</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <p className="text-white">Рост просмотров на {Math.floor(Math.random() * 20) + 10}% за последний период</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <p className="text-white">Конверсия в контакты остается стабильной</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                            <p className="text-white">Рекомендуется увеличить активность в выходные</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Page 2: Main trend chart */}
                        <div className="print-page print-page-break">
                            <h3 className="text-2xl font-bold text-white mb-4">Основной тренд</h3>
                            {renderChart(data.computed_graphs[0], 'large')}

                            {data.computed_graphs.length > 1 && (
                                <div className="grid grid-cols-1 gap-4 mt-6">
                                    {data.computed_graphs.slice(1, 2).map((chart) => renderChart(chart, 'medium'))}
                                </div>
                            )}
                        </div>

                        {/* Page 3: Additional charts if available */}
                        {data.computed_graphs.length > 2 && (
                            <div className="print-page print-page-break">
                                {renderChart(data.computed_graphs[2], 'large')}
                            </div>
                        )}
                    </>
                );

            default:
                return (
                    <>
                        <div className="print-page">
                            <div className="print-metrics">
                                <h3 className="text-lg font-semibold text-white mb-4">Основные метрики</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {data.computed_metrics.map((metric) => (
                                        <PrintMetricCard
                                            key={metric}
                                            title={getMetricName(metric)}
                                            value={getMetricValue(metric)}
                                            icon={getMetricIcon(metric)}
                                            size="medium"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="print-page print-page-break">
                            <h3 className="text-lg font-semibold text-white mb-4">Графики и диаграммы</h3>
                            <div className="space-y-6">
                                {data.computed_graphs.map((chart) => renderChart(chart, 'medium'))}
                            </div>
                        </div>
                    </>
                );
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <SkeletonLoading variant="card" count={1} />
                <SkeletonLoading variant="metric-card" count={4} />
                <SkeletonLoading variant="card" count={2} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="glass-card p-8">
                    <div className="text-center">
                        <p className="text-red-400 text-lg mb-2">Ошибка</p>
                        <p className="text-gray-400">{error}</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="glass-card p-8">
                    <div className="text-center">
                        <p className="text-gray-400">Отчет не найден</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Report Header - Always on first page */}
            <div className="text-center border-b border-gray-700 pb-4 mb-6 print-header">
                <h2 className="text-2xl font-bold text-white mb-2">
                    Отчет по объявлениям
                </h2>
                <p className="text-gray-400">
                    Дата: {new Date().toLocaleDateString('ru-RU')}
                </p>
            </div>

            {/* Dynamic Layout Content */}
            {renderLayoutContent()}

            {/* Layout Info - Hidden on print */}
            <div className="pt-4 border-t border-gray-700 mt-6 hidden-on-print">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400">Макет: {data.template}</p>
                    </div>
                    <Badge variant="outline" className="text-gray-300">
                        Отчет #{id}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default ReportView;