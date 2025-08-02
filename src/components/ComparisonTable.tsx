
import React from 'react';

interface Account {
  id: number;
  name: string;
  email: string;
  status: string;
  balance: number;
  listings: number;
}

interface ComparisonTableProps {
  accounts: Account[];
}

interface ComparisonDataItem {
  label: string;
  getValue: (account?: Account) => string | number;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ accounts }) => {
  const comparisonData: ComparisonDataItem[] = [
    { label: 'Просмотры', getValue: () => Math.floor(Math.random() * 50000) + 10000 },
    { label: 'Отклики', getValue: () => Math.floor(Math.random() * 5000) + 500 },
    { label: 'CTR', getValue: () => (Math.random() * 10 + 2).toFixed(2) + '%' },
    { label: 'Конверсия', getValue: () => (Math.random() * 5 + 1).toFixed(2) + '%' },
    { label: 'Активных объявлений', getValue: (account) => account?.listings || 0 },
    { label: 'Баланс', getValue: (account) => `${account?.balance.toLocaleString() || 0} ₽` },
    { label: 'Статус', getValue: (account) => account?.status || '' },
    { label: 'Email', getValue: (account) => account?.email || '' },
  ];

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Детальное сравнение</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left p-4 text-gray-400 font-medium sticky left-0 bg-gray-900/80">
                Параметр
              </th>
              {accounts.map((account) => (
                <th key={account.id} className="text-center p-4 text-gray-400 font-medium min-w-[150px]">
                  {account.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium sticky left-0 bg-gray-900/80">
                  {item.label}
                </td>
                {accounts.map((account) => (
                  <td key={account.id} className="p-4 text-center text-white">
                    {item.getValue(account)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
