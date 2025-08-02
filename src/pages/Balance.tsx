
import React, {useEffect, useState} from 'react';
import { Plus, TrendingUp, AlertTriangle, CreditCard } from 'lucide-react';
import PaginationControls from "@/components/PaginationControls.tsx";
import axios from "axios";

const Balance = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [balances, setBalances] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-orange-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const totalBalance = balances.reduce((sum, acc) => sum + acc.wallet + acc.prepayment / 100, 0);
  const totalSpent = balances.reduce((sum, acc) => sum + acc.spent, 0);
  const totalAlerts = balances.reduce((sum, balance) => {
    return sum + (balance.status === "Критично" || balance.status === "Предупреждение" ? 1 : 0);
  }, 0);

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
        const response = await axios.get('https://nexus_api.cryptspace.ru/profile/balance/list', {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }
        const newBalances = response.data.results;
        setBalances(newBalances);
        setTotalItems(response.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Управление балансом</h1>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Пополнить баланс
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Общий баланс</p>
          <p className="text-2xl font-bold text-white">{totalBalance} ₽</p>
          <p className="text-green-400 text-sm">Активных счетов: 12</p>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Потрачено за месяц</p>
          <p className="text-2xl font-bold text-white">{totalSpent} ₽</p>
          <p className="text-blue-400 text-sm">Средний расход в день: 1,840 ₽</p>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Предупреждения</p>
          <p className="text-2xl font-bold text-white">{totalAlerts}</p>
          <p className="text-orange-400 text-sm">Аккаунтов с низким балансом</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Баланс по аккаунтам</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left p-6 text-gray-400 font-medium">Аккаунт</th>
                <th className="text-left p-6 text-gray-400 font-medium">Текущий Аванс</th>
                <th className="text-left p-6 text-gray-400 font-medium">Текущий баланс Кошелька</th>
                <th className="text-left p-6 text-gray-400 font-medium">Потрачено</th>
                <th className="text-left p-6 text-gray-400 font-medium">Порог предупреждения</th>
                <th className="text-left p-6 text-gray-400 font-medium">Статус</th>
                <th className="text-left p-6 text-gray-400 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance) => (
                <tr key={balance.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <span className="text-white font-medium">{balance.name}</span>
                  </td>
                  <td className="p-6">
                    <span className={`font-medium ${getStatusColor(balance.status)}`}>
                      {balance.prepayment / 100} ₽
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`font-medium ${getStatusColor(balance.status)}`}>
                      {balance.wallet} ₽
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-white">{balance.spent} ₽</span>
                  </td>
                  <td className="p-6">
                    <span className="text-gray-400">{balance.threshold} ₽</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                          balance.status === 'Норма' ? 'bg-green-400' :
                              balance.status === 'Предупреждение' ? 'bg-orange-400' :
                        'bg-red-400'
                      }`}></div>
                      <span className={getStatusColor(balance.status)}>
                        {balance.status === 'Норма' ? 'Норма' :
                            balance.status === 'Предупреждение' ? 'Предупреждение' :
                         'Критично'}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <button className="btn-secondary text-sm">Пополнить</button>
                  </td>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 hidden">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">История пополнений</h3>
          <div className="space-y-4">
            {[
              { date: '2024-01-15', amount: 50000, account: 'Аккаунт #1', method: 'Банковская карта' },
              { date: '2024-01-12', amount: 25000, account: 'Аккаунт #3', method: 'СБП' },
              { date: '2024-01-10', amount: 75000, account: 'Аккаунт #2', method: 'Банковский перевод' },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                <div>
                  <p className="text-white font-medium">+{transaction.amount.toLocaleString('ru-RU')} ₽</p>
                  <p className="text-gray-400 text-sm">{transaction.account} • {transaction.method}</p>
                </div>
                <span className="text-gray-400 text-sm">{transaction.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl hidden">
          <h3 className="text-lg font-semibold text-white mb-4">Настройки уведомлений</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <span className="text-white">Уведомления о низком балансе</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="w-10 h-6 bg-gray-600 rounded-full"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform translate-x-4"></div>
                </div>
              </label>
            </div>
            <div>
              <label className="flex items-center justify-between">
                <span className="text-white">Email уведомления</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="w-10 h-6 bg-gray-600 rounded-full"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform translate-x-4"></div>
                </div>
              </label>
            </div>
            <div>
              <label className="flex items-center justify-between">
                <span className="text-white">Push уведомления</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-10 h-6 bg-gray-600 rounded-full"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
