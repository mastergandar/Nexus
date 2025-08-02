
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { DateRange } from 'react-day-picker';
import MetricCard from '../components/MetricCard';
import ProgressCard from '../components/ProgressCard';
import DateRangePicker from '../components/DateRangePicker';
import { Users, FileText, Eye, MousePointer, TrendingUp, Activity, Zap, Target } from 'lucide-react';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const dateFrom = dateRange?.from?.toLocaleDateString('en-CA');
  const dateTo = dateRange?.to?.toLocaleDateString('en-CA');
  const cacheKey = `stats_${dateFrom}_${dateTo}`;

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          setStats(JSON.parse(cachedData));
        }

        const response = await axios.post('https://nexus_api.cryptspace.ru/statistics', {
          query: `
            query GetAggregatedStats($dateFrom: String!, $dateTo: String!) {
              aggregatedStats(dateFrom: $dateFrom, dateTo: $dateTo) {
                activeCabinets
                totalViews
                totalResponses
                totalVacancies
                averageCtr
                averageConnectionConversion
                averageExitConversion
              }
            }
          `,
          variables: { dateFrom, dateTo },
        });

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }

        const newStats = response.data.data.aggregatedStats;
        setStats(newStats);
        localStorage.setItem(cacheKey, JSON.stringify(newStats));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Панель управления</h1>
          <p className="text-muted-foreground mt-1">Обзор производительности ваших аккаунтов</p>
        </div>
        
        {/* Date Range Picker */}
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Активных аккаунтов"
          value={stats?.activeCabinets?.toString() || '0'}
          change="+2 за неделю"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Всего объявлений"
          value={stats?.totalVacancies?.toString() || '0'}
          change="+156 за неделю"
          icon={FileText}
          color="green"
        />
        <MetricCard
          title="Просмотры"
          value={stats?.totalViews?.toLocaleString() || '0'}
          change="+12% за неделю"
          icon={Eye}
          color="orange"
        />
        <MetricCard
          title="Отклики"
          value={stats?.totalResponses?.toLocaleString() || '0'}
          change="+8% за неделю"
          icon={MousePointer}
          color="red"
        />
      </div>

      {/* Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Usage */}
        <ProgressCard
          title="Использование хранилища"
          current={650}
          total={1000}
          unit="ГБ"
          percentage={65}
        />

        {/* Conversion Rate */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Конверсия</h3>
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {(stats?.averageConnectionConversion * 100)?.toFixed(1) || '0'}%
          </div>
          <div className="flex items-center text-success text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2.5% с прошлой недели
          </div>
        </div>

        {/* CTR */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Средний CTR</h3>
            <Activity className="w-5 h-5 text-info" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {(stats?.averageCtr)?.toFixed(1) || '0'}%
          </div>
          <div className="flex items-center text-success text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +1.2% с прошлой недели
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Производительность</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Текущий период</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">График производительности</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">Последняя активность</h3>
          <div className="space-y-4">
            {[
              { action: 'Создано новое объявление', account: 'Аккаунт #3', time: '2 мин назад', status: 'success' },
              { action: 'Обновлен баланс', account: 'Аккаунт #7', time: '15 мин назад', status: 'info' },
              { action: 'Сгенерирован XML файл', account: 'Группа "Электроника"', time: '1 час назад', status: 'success' },
              { action: 'Низкий баланс', account: 'Аккаунт #12', time: '2 часа назад', status: 'warning' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border/50 last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.status === 'success' ? 'bg-success' :
                    activity.status === 'warning' ? 'bg-warning' :
                    'bg-info'
                  }`}></div>
                  <div>
                    <p className="text-foreground font-medium">{activity.action}</p>
                    <p className="text-muted-foreground text-sm">{activity.account}</p>
                  </div>
                </div>
                <span className="text-muted-foreground text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">
            <FileText className="w-4 h-4 mr-2" />
            Создать объявление
          </button>
          <button className="btn-secondary">
            <Users className="w-4 h-4 mr-2" />
            Добавить аккаунт
          </button>
          <button className="btn-success">
            <TrendingUp className="w-4 h-4 mr-2" />
            Сгенерировать отчет
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
