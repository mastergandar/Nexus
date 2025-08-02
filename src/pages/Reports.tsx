import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, FileText, Calendar, Grid, Minimize, Maximize, Users } from 'lucide-react';
import ReportConfigForm from '@/components/ReportConfigForm';
import ReportPreview from '@/components/ReportPreview';
import ReportScheduler from '@/components/ReportScheduler';
import SkeletonLoading from '@/components/SkeletonLoading';
import { toast } from 'sonner';
import axios from 'axios';

interface ReportConfig {
    id?: string;
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

interface ReportData {
    id: number;
    name: string;
    template: string;
    cabinet_id: number;
    metrics: string;
    graphs: string | null;
    period: string;
    time: string;
    tg_id: number;
}

const Reports = () => {
    const [activeTab, setActiveTab] = useState('config');
    const [reportConfig, setReportConfig] = useState<ReportConfig>({
        name: '',
        cabinets: [],
        metrics: [],
        period: 'daily',
        charts: [],
        layout: 'standard',
        isActive: false,
        time: '09:00'
    });

    const [savedReports, setSavedReports] = useState<ReportData[]>([]);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reportsLoading, setReportsLoading] = useState(true);

    const layoutOptions = [
        {
            id: 'standard',
            name: 'Стандартный',
            description: 'Стандартный макет с основными метриками в 4 колонки и графиками в 2 колонки',
            icon: Grid,
            preview: (
                <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-1">
                        <div className="h-4 bg-blue-500/30 rounded"></div>
                        <div className="h-4 bg-blue-500/30 rounded"></div>
                        <div className="h-4 bg-blue-500/30 rounded"></div>
                        <div className="h-4 bg-blue-500/30 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        <div className="h-6 bg-green-500/30 rounded"></div>
                        <div className="h-6 bg-green-500/30 rounded"></div>
                    </div>
                </div>
            )
        },
        {
            id: 'compact',
            name: 'Компактный',
            description: 'Компактный макет для быстрого просмотра с меньшими элементами',
            icon: Minimize,
            preview: (
                <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="h-3 bg-blue-500/30 rounded"></div>
                        <div className="h-3 bg-blue-500/30 rounded"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                        <div className="h-4 bg-green-500/30 rounded"></div>
                        <div className="h-4 bg-green-500/30 rounded"></div>
                        <div className="h-4 bg-green-500/30 rounded"></div>
                    </div>
                </div>
            )
        },
        {
            id: 'detailed',
            name: 'Детальный',
            description: 'Подробный макет с анализом и дополнительной информацией',
            icon: Maximize,
            preview: (
                <div className="space-y-2">
                    <div className="h-6 bg-blue-500/30 rounded"></div>
                    <div className="h-6 bg-blue-500/30 rounded"></div>
                    <div className="h-8 bg-green-500/30 rounded"></div>
                </div>
            )
        },
        {
            id: 'executive',
            name: 'Исполнительный',
            description: 'Исполнительный макет для руководства с акцентом на ключевые показатели',
            icon: Users,
            preview: (
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="h-6 bg-blue-500/30 rounded"></div>
                        <div className="h-6 bg-blue-500/30 rounded"></div>
                    </div>
                    <div className="h-4 bg-orange-500/30 rounded"></div>
                    <div className="h-6 bg-green-500/30 rounded"></div>
                </div>
            )
        }
    ];

    useEffect(() => {
        fetchSavedReports();
    }, []);

    const fetchSavedReports = async () => {
        try {
            setReportsLoading(true);
            const response = await axios.get('https://nexus_api.cryptspace.ru/report/get');
            setSavedReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Ошибка загрузки сохраненных отчетов');
        } finally {
            setReportsLoading(false);
        }
    };

    const formatMetricsForAPI = (metrics: string[]) => {
        return metrics.map(metric => {
            switch (metric) {
                case 'views': return 'просмотры';
                case 'contacts': return 'контакты';
                case 'favorites': return 'избранное';
                case 'conversion': return 'конверсия';
                case 'active_listings': return 'активные_объявления';
                default: return metric.replace(/\s+/g, '_');
            }
        }).join(',');
    };

    const formatChartsForAPI = (charts: string[]) => {
        return charts.map(chart => {
            switch (chart) {
                case 'line': return 'линейный_график';
                case 'bar': return 'столбчатая_диаграмма';
                case 'pie': return 'круговая_диаграмма';
                default: return chart.replace(/\s+/g, '_');
            }
        }).join(',');
    };

    const formatPeriodForAPI = (period: string) => {
        switch (period) {
            case 'daily': return 'Ежедневно';
            case 'weekly': return 'Еженедельно';
            case 'monthly': return 'Ежемесячно';
            default: return period;
        }
    };

    const handleSaveReport = async () => {
        if (!reportConfig.name || reportConfig.metrics.length === 0) {
            toast.error('Пожалуйста, заполните название отчета и выберите метрики');
            return;
        }

        if (!reportConfig.telegramChatId) {
            toast.error('Пожалуйста, укажите Telegram Chat ID');
            return;
        }

        try {
            setLoading(true);

            const requestData = {
                name: reportConfig.name,
                template: reportConfig.layout,
                cabinet_id: parseInt(reportConfig.cabinets[0]) || 1,
                metrics: formatMetricsForAPI(reportConfig.metrics),
                graphs: reportConfig.charts.length > 0 ? formatChartsForAPI(reportConfig.charts) : null,
                period: formatPeriodForAPI(reportConfig.period),
                time: `${reportConfig.time}:00`,
                tg_id: parseInt(reportConfig.telegramChatId)
            };

            await axios.post('https://nexus_api.cryptspace.ru/report/create', requestData);

            toast.success('Отчет успешно сохранен');
            await fetchSavedReports();

            // Сброс формы
            setReportConfig({
                name: '',
                cabinets: [],
                metrics: [],
                period: 'daily',
                charts: [],
                layout: 'standard',
                isActive: false,
                time: '09:00'
            });
        } catch (error) {
            console.error('Error saving report:', error);
            toast.error('Ошибка сохранения отчета');
        } finally {
            setLoading(false);
        }
    };

    const getPeriodName = (period: string) => {
        switch (period) {
            case 'Ежедневно': return 'Ежедневно';
            case 'Еженедельно': return 'Еженедельно';
            case 'Ежемесячно': return 'Ежемесячно';
            default: return period;
        }
    };

    const handlePreview = () => {
        if (!reportConfig.name || reportConfig.metrics.length === 0) {
            toast.error('Пожалуйста, заполните название отчета и выберите метрики для предпросмотра');
            return;
        }
        setIsPreviewVisible(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Отчеты</h1>
                    <p className="text-gray-400 mt-1">Настройка автоматических отчетов и их отправка</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={handlePreview}
                        variant="outline"
                        className="glass-button"
                        disabled={loading}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Предпросмотр
                    </Button>
                    <Button
                        onClick={handleSaveReport}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                                Сохранение...
                            </>
                        ) : (
                            <>
                                <FileText className="w-4 h-4 mr-2" />
                                Сохранить отчет
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-2">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <Settings className="w-5 h-5 mr-2" />
                                Настройка отчета
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="config">Конфигурация</TabsTrigger>
                                    <TabsTrigger value="layout">Макет</TabsTrigger>
                                    <TabsTrigger value="schedule">Расписание</TabsTrigger>
                                </TabsList>

                                <TabsContent value="config">
                                    <ReportConfigForm
                                        config={reportConfig}
                                        onChange={setReportConfig}
                                    />
                                </TabsContent>

                                <TabsContent value="layout">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Шаблон макета</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {layoutOptions.map((layout) => (
                                                <div
                                                    key={layout.id}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                        reportConfig.layout === layout.id
                                                            ? 'border-blue-500 bg-blue-500/20'
                                                            : 'border-gray-600 hover:border-gray-400'
                                                    }`}
                                                    onClick={() => setReportConfig({ ...reportConfig, layout: layout.id })}
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                                reportConfig.layout === layout.id
                                                                    ? 'bg-blue-500/30'
                                                                    : 'bg-gray-700'
                                                            }`}>
                                                                <layout.icon className="w-6 h-6 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-white">{layout.name}</h4>
                                                            <p className="text-sm text-gray-400 mt-1">{layout.description}</p>
                                                        </div>
                                                        <div className="flex-shrink-0 w-20">
                                                            <div className="p-2 bg-gray-800 rounded border">
                                                                {layout.preview}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="schedule">
                                    <ReportScheduler
                                        config={reportConfig}
                                        onChange={setReportConfig}
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Saved Reports */}
                <div>
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <Calendar className="w-5 h-5 mr-2" />
                                Сохраненные отчеты
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reportsLoading ? (
                                    <SkeletonLoading variant="card" count={3} />
                                ) : savedReports.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">
                                        Нет сохраненных отчетов
                                    </p>
                                ) : (
                                    savedReports.map((report) => (
                                        <div key={report.id} className="p-4 border border-gray-600 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-white">{report.name}</h4>
                                                <Badge variant="default">
                                                    ID: {report.id}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-2">
                                                Период: {getPeriodName(report.period)}
                                            </p>
                                            <p className="text-sm text-gray-400 mb-2">
                                                Время: {report.time}
                                            </p>
                                            <p className="text-sm text-gray-400 mb-3">
                                                Макет: {report.template}
                                            </p>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => window.open(`/reports/preview/${report.id}`, '_blank')}
                                                    className="flex-1"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Просмотр
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Preview Modal */}
            {isPreviewVisible && (
                <ReportPreview
                    config={reportConfig}
                    onClose={() => setIsPreviewVisible(false)}
                />
            )}
        </div>
    );
};

export default Reports;