import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { BarChart3, TrendingUp, Eye, MousePointer } from 'lucide-react';
import DateRangePicker from '../components/DateRangePicker';
import PaginationControls from "@/components/PaginationControls.tsx";
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Statistics = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'detailed'>('global');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const dateFrom = dateRange?.from?.toLocaleDateString('en-CA');
  const dateTo = dateRange?.to?.toLocaleDateString('en-CA');

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://nexus_api.cryptspace.ru/profile/stats/list', {
          params: {
            date_from: dateFrom,
            date_to: dateTo,
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }
        const newStats = response.data.results;
        setStats(newStats);
        setTotalItems(response.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateFrom, dateTo, currentPage, itemsPerPage]);

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Статистика</h1>
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
                onClick={() => setActiveTab('global')}
                className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === 'global'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                        : 'text-gray-400 hover:text-white'
                }`}
            >
              Глобальная
            </button>
            <button
                onClick={() => setActiveTab('detailed')}
                className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === 'detailed'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                        : 'text-gray-400 hover:text-white'
                }`}
            >
              Детализированная
            </button>
          </div>
        </div>

        <DateRangePicker date={dateRange} onDateChange={setDateRange} />

        {activeTab === 'global' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Всего просмотров</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.reduce((acc, stat) => acc + stat.total_views, 0)}
                  </p>
                  <p className="text-green-400 text-sm">+15.3% за месяц</p>
                </div>

                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <MousePointer className="w-6 h-6 text-green-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Всего откликов</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.reduce((acc, stat) => acc + stat.total_responses, 0)}
                  </p>
                  <p className="text-green-400 text-sm">+8.7% за месяц</p>
                </div>

                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-orange-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">CTR</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.reduce((acc, stat) => acc + stat.ctr, 0) / stats.length / 100 || 0).toFixed(2)}%
                  </p>
                  <p className="text-green-400 text-sm">+2.1% за месяц</p>
                </div>

                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Конверсия подключений</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.reduce((acc, stat) => acc + stat.amo_ctr, 0) / stats.length || 0).toFixed(2)}%
                  </p>
                  <p className="text-green-400 text-sm">+0.9% за месяц</p>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">График активности</h3>
                <Line
                    data={{
                      labels: stats.map((stat) => stat.name),
                      datasets: [
                        {
                          label: 'Просмотры',
                          data: stats.map((stat) => stat.total_views),
                          borderColor: 'rgba(59, 130, 246, 0.5)',
                          backgroundColor: 'rgba(59, 130, 246, 0.5)',
                          fill: false,
                        },
                        {
                          label: 'Отклики',
                          data: stats.map((stat) => stat.total_responses),
                          borderColor: 'rgba(34, 197, 94, 0.5)',
                          backgroundColor: 'rgba(34, 197, 94, 0.5)',
                          fill: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Статистика по аккаунтам' },
                      },
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                />
              </div>
            </div>
        )}

        {activeTab === 'detailed' && (
            <div className="space-y-6">
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Статистика по аккаунтам</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-gray-400 font-medium">Аккаунт</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Просмотры</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Отклики</th>
                      <th className="text-left p-4 text-gray-400 font-medium">CTR</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Конверсия подключений</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Конверсия выходов</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stats.map((account, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-white font-medium">{account.name}</td>
                          <td className="p-4 text-white">{account.total_views}</td>
                          <td className="p-4 text-white">{account.total_responses}</td>
                          <td className="p-4 text-green-400 font-medium">{(account.ctr / 100).toFixed(2)}%</td>
                          <td className="p-4 text-blue-400 font-medium">{account.amo_ctr.toFixed(2)}%</td>
                          <td className="p-4 text-purple-400 font-medium">{account.amo_ecr.toFixed(2)}%</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </div>
        )}
      </div>
  );
};

export default Statistics;