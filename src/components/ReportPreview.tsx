
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Send, Eye, Phone, Heart, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportConfig {
    name: string;
    cabinets: string[];
    metrics: string[];
    period: 'daily' | 'weekly' | 'monthly';
    charts: string[];
    layout: string;
    telegramChatId?: string;
    isActive: boolean;
}

interface ReportPreviewProps {
    config: ReportConfig;
    onClose: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ config, onClose }) => {
    // Sample data for preview
    const sampleData = [
        { name: 'Пн', views: 1200, contacts: 85, favorites: 45 },
        { name: 'Вт', views: 1450, contacts: 92, favorites: 52 },
        { name: 'Ср', views: 1350, contacts: 78, favorites: 38 },
        { name: 'Чт', views: 1580, contacts: 105, favorites: 65 },
        { name: 'Пт', views: 1720, contacts: 118, favorites: 72 },
        { name: 'Сб', views: 1890, contacts: 135, favorites: 89 },
        { name: 'Вс', views: 1650, contacts: 124, favorites: 76 },
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
            case 'favorites': return <Heart className="w-4 h-4" />;
            case 'conversion': return <TrendingUp className="w-4 h-4" />;
            default: return null;
        }
    };

    const getMetricName = (metric: string) => {
        switch (metric) {
            case 'views': return 'Просмотры';
            case 'contacts': return 'Контакты';
            case 'favorites': return 'Избранное';
            case 'conversion': return 'Конверсия';
            default: return metric;
        }
    };

    const getMetricValue = (metric: string) => {
        switch (metric) {
            case 'views': return '10,847';
            case 'contacts': return '737';
            case 'favorites': return '437';
            case 'conversion': return '6.8%';
            default: return '0';
        }
    };

    const handleDownloadPDF = () => {
        console.log('Downloading PDF report...');
    };

    const handleSendToTelegram = () => {
        console.log('Sending report to Telegram...');
    };

    const renderChart = (chartType: string, size: 'small' | 'medium' | 'large' = 'medium') => {
        const heights = { small: 150, medium: 200, large: 300 };
        const height = heights[size];

        switch (chartType) {
            case 'line':
                return (
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-white">Динамика метрик</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={height}>
                                <LineChart data={sampleData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Просмотры" />
                                    <Line type="monotone" dataKey="contacts" stroke="#10b981" name="Контакты" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                );
            case 'bar':
                return (
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-white">Столбчатая диаграмма</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={height}>
                                <BarChart data={sampleData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                    <Legend />
                                    <Bar dataKey="views" fill="#3b82f6" name="Просмотры" />
                                    <Bar dataKey="contacts" fill="#10b981" name="Контакты" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                );
            case 'pie':
                return (
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-white">Распределение метрик</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={height}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={height * 0.3}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                );
            default:
                return null;
        }
    };

    const renderMetricCard = (metric: string, size: 'small' | 'medium' | 'large' = 'medium') => {
        const sizeClasses = {
            small: 'p-3',
            medium: 'p-4',
            large: 'p-6'
        };

        const textSizes = {
            small: { title: 'text-xs', value: 'text-lg' },
            medium: { title: 'text-sm', value: 'text-2xl' },
            large: { title: 'text-base', value: 'text-3xl' }
        };

        return (
            <Card key={metric} className={`glass-card ${sizeClasses[size]}`}>
                <CardContent className="p-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-gray-400 ${textSizes[size].title}`}>{getMetricName(metric)}</p>
                            <p className={`font-bold text-white ${textSizes[size].value}`}>{getMetricValue(metric)}</p>
                        </div>
                        <div className="text-blue-400">
                            {getMetricIcon(metric)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderLayoutContent = () => {
        switch (config.layout) {
            case 'standard':
                return (
                    <>
                        {/* Metrics Overview - 4 columns */}
                        {config.metrics.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Основные метрики</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {config.metrics.map((metric) => renderMetricCard(metric, 'medium'))}
                                </div>
                            </div>
                        )}

                        {/* Charts - 2 columns */}
                        {config.charts.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Графики и диаграммы</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {config.charts.map((chart) => renderChart(chart, 'medium'))}
                                </div>
                            </div>
                        )}
                    </>
                );

            case 'compact':
                return (
                    <>
                        {/* Metrics Overview - 2 columns */}
                        {config.metrics.length > 0 && (
                            <div>
                                <h3 className="text-base font-semibold text-white mb-3">Основные метрики</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {config.metrics.map((metric) => renderMetricCard(metric, 'small'))}
                                </div>
                            </div>
                        )}

                        {/* Charts - 3 columns, smaller */}
                        {config.charts.length > 0 && (
                            <div>
                                <h3 className="text-base font-semibold text-white mb-3">Графики</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {config.charts.map((chart) => renderChart(chart, 'small'))}
                                </div>
                            </div>
                        )}
                    </>
                );

            case 'detailed':
                return (
                    <>
                        {/* Metrics Overview - 1 column with detailed info */}
                        {config.metrics.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-4">Детальная аналитика</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {config.metrics.map((metric) => (
                                        <Card key={metric} className="glass-card">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <p className="text-gray-400 text-lg">{getMetricName(metric)}</p>
                                                        <p className="text-3xl font-bold text-white">{getMetricValue(metric)}</p>
                                                    </div>
                                                    <div className="text-blue-400">
                                                        {getMetricIcon(metric)}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    <p>Изменение за период: +12.5%</p>
                                                    <p>Средний показатель: {Math.floor(Math.random() * 1000) + 500}</p>
                                                    <p>Лучший день: {['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'][Math.floor(Math.random() * 5)]}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Charts - Full width with detailed descriptions */}
                        {config.charts.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-4">Подробная визуализация</h3>
                                <div className="space-y-6">
                                    {config.charts.map((chart) => (
                                        <div key={chart} className="space-y-2">
                                            {renderChart(chart, 'large')}
                                            <p className="text-sm text-gray-400 px-4">
                                                Данный график показывает динамику изменения ключевых показателей за выбранный период.
                                                Анализ позволяет выявить тенденции и принять обоснованные решения.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                );

            case 'executive':
                return (
                    <>
                        {/* Key Metrics - Large emphasis on important metrics */}
                        {config.metrics.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">Ключевые показатели</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {config.metrics.slice(0, 4).map((metric) => renderMetricCard(metric, 'large'))}
                                </div>

                                {/* Summary insights */}
                                <Card className="glass-card mt-6">
                                    <CardHeader>
                                        <CardTitle className="text-white text-xl">Краткие выводы</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <p className="text-white">Рост просмотров на 15% за последний период</p>
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
                        )}

                        {/* Charts - Only the most important one, large */}
                        {config.charts.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">Основной тренд</h3>
                                <div className="space-y-4">
                                    {renderChart(config.charts[0], 'large')}
                                    {config.charts.length > 1 && (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {config.charts.slice(1).map((chart) => renderChart(chart, 'medium'))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                );

            default:
                return (
                    <>
                        {/* Fallback to standard layout */}
                        {config.metrics.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Основные метрики</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {config.metrics.map((metric) => renderMetricCard(metric, 'medium'))}
                                </div>
                            </div>
                        )}

                        {config.charts.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Графики и диаграммы</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {config.charts.map((chart) => renderChart(chart, 'medium'))}
                                </div>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center justify-between">
                        <span>Предпросмотр отчета: {config.name}</span>
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={handleDownloadPDF}
                                variant="outline"
                                size="sm"
                                className="glass-button"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                PDF
                            </Button>
                            <Button
                                onClick={handleSendToTelegram}
                                size="sm"
                                className="bg-gradient-to-r from-blue-500 to-cyan-400"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Отправить
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Report Header */}
                    <div className="text-center border-b border-gray-700 pb-4">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {config.name || 'Отчет по объявлениям'}
                        </h2>
                        <p className="text-gray-400">
                            Период: {config.period === 'daily' ? 'Ежедневный' :
                            config.period === 'weekly' ? 'Еженедельный' : 'Ежемесячный'} отчет
                        </p>
                        <p className="text-gray-400">
                            Дата: {new Date().toLocaleDateString('ru-RU')}
                        </p>
                    </div>

                    {/* Dynamic Layout Content */}
                    {renderLayoutContent()}

                    {/* Layout Info */}
                    <div className="pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Макет: {config.layout}</p>
                                <p className="text-sm text-gray-400">
                                    Кабинеты: {config.cabinets.length > 0 ? config.cabinets.join(', ') : 'Не выбраны'}
                                </p>
                            </div>
                            <Badge variant="outline" className="text-gray-300">
                                Предпросмотр
                            </Badge>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReportPreview;