
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { DateRange } from 'react-day-picker';
import MetricCard from '../components/MetricCard';
import ProgressCard from '../components/ProgressCard';
import DateRangePicker from '../components/DateRangePicker';
import { Users, FileText, Eye, MousePointer, TrendingUp } from 'lucide-react';

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

      {/* Date Range Picker */}
      <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
            title="Активных аккаунтов"
            value={stats?.activeCabinets?.toString() || '0'}
            change="+2 за неделю" // Это можно динамически вычислять
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Usage */}
        <ProgressCard
          title="Использование хранилища"
          current={650}
          total={1000}
          unit="ГБ"
          percentage={65}
        />

        {/* Monthly Performance */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Производительность за месяц</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Конверсия</span>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-white font-medium">
                  {(stats?.averageConnectionConversion * 100)?.toFixed(1) || '0'}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Средний CTR</span>
              <span className="text-white font-medium">
                {(stats?.averageCtr)?.toFixed(1) || '0'}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Активность</span>
              <span className="text-green-400 font-medium">Высокая</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Последняя активность</h3>
        <div className="space-y-4">
          {[
            { action: 'Создано новое объявление', account: 'Аккаунт #3', time: '2 мин назад', status: 'success' },
            { action: 'Обновлен баланс', account: 'Аккаунт #7', time: '15 мин назад', status: 'info' },
            { action: 'Сгенерирован XML файл', account: 'Группа "Электроника"', time: '1 час назад', status: 'success' },
            { action: 'Низкий баланс', account: 'Аккаунт #12', time: '2 часа назад', status: 'warning' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.status === 'success' ? 'bg-green-400' :
                  activity.status === 'warning' ? 'bg-orange-400' :
                  'bg-blue-400'
                }`}></div>
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.account}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
