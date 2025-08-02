
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, Send } from 'lucide-react';

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

interface ReportSchedulerProps {
    config: ReportConfig;
    onChange: (config: ReportConfig) => void;
}

const ReportScheduler: React.FC<ReportSchedulerProps> = ({ config, onChange }) => {
    const [time, setTime] = React.useState('09:00');
    const [dayOfWeek, setDayOfWeek] = React.useState('monday');
    const [dayOfMonth, setDayOfMonth] = React.useState('1');

    const weekDays = [
        { value: 'monday', label: 'Понедельник' },
        { value: 'tuesday', label: 'Вторник' },
        { value: 'wednesday', label: 'Среда' },
        { value: 'thursday', label: 'Четверг' },
        { value: 'friday', label: 'Пятница' },
        { value: 'saturday', label: 'Суббота' },
        { value: 'sunday', label: 'Воскресенье' },
    ];

    const monthDays = Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `${i + 1} число`
    }));

    const getScheduleDescription = () => {
        switch (config.period) {
            case 'daily':
                return `Отчет будет отправляться каждый день в ${time}`;
            case 'weekly':
                return `Отчет будет отправляться каждую неделю в ${weekDays.find(d => d.value === dayOfWeek)?.label.toLowerCase()} в ${time}`;
            case 'monthly':
                return `Отчет будет отправляться каждый месяц ${dayOfMonth} числа в ${time}`;
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Время отправки
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label htmlFor="time" className="text-white">Время</Label>
                        <Select value={time} onValueChange={setTime}>
                            <SelectTrigger className="mt-2 bg-white/10 border-white/20 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                        {`${i.toString().padStart(2, '0')}:00`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {config.period === 'weekly' && (
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            День недели
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label htmlFor="dayOfWeek" className="text-white">Выберите день недели</Label>
                            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                                <SelectTrigger className="mt-2 bg-white/10 border-white/20 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {weekDays.map((day) => (
                                        <SelectItem key={day.value} value={day.value}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}

            {config.period === 'monthly' && (
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            День месяца
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label htmlFor="dayOfMonth" className="text-white">Выберите день месяца</Label>
                            <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
                                <SelectTrigger className="mt-2 bg-white/10 border-white/20 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthDays.map((day) => (
                                        <SelectItem key={day.value} value={day.value}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        Расписание отправки
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                        <p className="text-blue-200 font-medium">
                            {getScheduleDescription()}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportScheduler;