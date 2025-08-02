
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart, LineChart, TrendingUp, Users, Eye, Heart, Phone } from 'lucide-react';
import {useCabinets} from "@/hooks/useCabinets.ts";

interface ReportConfig {
    name: string;
    cabinets: string[];
    metrics: string[];
    period: 'daily' | 'weekly' | 'monthly';
    charts: string[];
    layout: string;
    telegramChatId?: string;
    isActive: boolean;
    time?: string;
}

interface ReportConfigFormProps {
    config: ReportConfig;
    onChange: (config: ReportConfig) => void;
}

const ReportConfigForm: React.FC<ReportConfigFormProps> = ({ config, onChange }) => {

    const { data: cabinets, isLoading, error } = useCabinets();

    const availableMetrics = [
        { id: 'views', name: 'Просмотры', icon: Eye },
        { id: 'contacts', name: 'Контакты', icon: Phone },
        { id: 'favorites', name: 'Избранное', icon: Heart },
        { id: 'conversion', name: 'Конверсия', icon: TrendingUp },
        { id: 'active_listings', name: 'Активные объявления', icon: Users },
    ];

    const availableCharts = [
        { id: 'line', name: 'Линейный график', icon: LineChart },
        { id: 'bar', name: 'Столбчатая диаграмма', icon: BarChart },
        { id: 'pie', name: 'Круговая диаграмма', icon: PieChart },
    ];

    const handleCabinetChange = (cabinetId: string, checked: boolean) => {
        const newCabinets = checked
            ? [...config.cabinets, cabinetId]
            : config.cabinets.filter(id => id !== cabinetId);
        onChange({ ...config, cabinets: newCabinets });
    };

    const handleMetricChange = (metricId: string, checked: boolean) => {
        const newMetrics = checked
            ? [...config.metrics, metricId]
            : config.metrics.filter(id => id !== metricId);
        onChange({ ...config, metrics: newMetrics });
    };

    const handleChartChange = (chartId: string, checked: boolean) => {
        const newCharts = checked
            ? [...config.charts, chartId]
            : config.charts.filter(id => id !== chartId);
        onChange({ ...config, charts: newCharts });
    };

    return (
        <div className="space-y-6">
            {/* Report Name */}
            <div>
                <Label htmlFor="reportName" className="text-white">Название отчета</Label>
                <Input
                    id="reportName"
                    value={config.name}
                    onChange={(e) => onChange({ ...config, name: e.target.value })}
                    placeholder="Введите название отчета"
                    className="mt-2 bg-white/10 border-white/20 text-white"
                />
            </div>

            {/* Cabinets Selection */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-white">Выбор кабинетов</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {cabinets?.map((cabinet) => (
                            <div key={cabinet.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`cabinet-${cabinet.id}`}
                                    checked={config.cabinets.includes(cabinet.id)}
                                    onCheckedChange={(checked) => handleCabinetChange(cabinet.id, checked as boolean)}
                                />
                                <Label htmlFor={`cabinet-${cabinet.id}`} className="text-white">
                                    {cabinet.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Metrics Selection */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-white">Метрики</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                        {availableMetrics.map((metric) => (
                            <div key={metric.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`metric-${metric.id}`}
                                    checked={config.metrics.includes(metric.id)}
                                    onCheckedChange={(checked) => handleMetricChange(metric.id, checked as boolean)}
                                />
                                <Label htmlFor={`metric-${metric.id}`} className="text-white flex items-center">
                                    <metric.icon className="w-4 h-4 mr-2" />
                                    {metric.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Period Selection */}
            <div>
                <Label className="text-white">Период предоставления</Label>
                <Select value={config.period} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => onChange({ ...config, period: value })}>
                    <SelectTrigger className="mt-2 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Ежедневно</SelectItem>
                        <SelectItem value="weekly">Еженедельно</SelectItem>
                        <SelectItem value="monthly">Ежемесячно</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Time Selection */}
            <div>
                <Label htmlFor="reportTime" className="text-white">Время отправки</Label>
                <Input
                    id="reportTime"
                    type="time"
                    value={config.time || '09:00'}
                    onChange={(e) => onChange({ ...config, time: e.target.value })}
                    className="mt-2 bg-white/10 border-white/20 text-white"
                />
            </div>

            {/* Charts Selection */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-white">Графики и диаграммы</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {availableCharts.map((chart) => (
                            <div key={chart.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`chart-${chart.id}`}
                                    checked={config.charts.includes(chart.id)}
                                    onCheckedChange={(checked) => handleChartChange(chart.id, checked as boolean)}
                                />
                                <Label htmlFor={`chart-${chart.id}`} className="text-white flex items-center">
                                    <chart.icon className="w-4 h-4 mr-2" />
                                    {chart.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Telegram Settings */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-white">Настройки Telegram</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label htmlFor="telegramChatId" className="text-white">Chat ID Telegram</Label>
                        <Input
                            id="telegramChatId"
                            value={config.telegramChatId || ''}
                            onChange={(e) => onChange({ ...config, telegramChatId: e.target.value })}
                            placeholder="Введите Chat ID"
                            className="mt-2 bg-white/10 border-white/20 text-white"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                            Для получения Chat ID напишите боту @userinfobot
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportConfigForm;