import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Settings } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddAccountForm from '../components/AddAccountForm';
import { toast } from '@/hooks/use-toast';
import PaginationControls from "@/components/PaginationControls.tsx";

const Accounts = () => {
  const { selectedAccounts, addToComparison, removeFromComparison } = useComparison();
  const [cabinets, setCabinets] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const fetchCabinets = async () => {
    try {
      const response = await axios.get('https://nexus_api.cryptspace.ru/cabinet/list', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      setCabinets(response.data.results);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching cabinets:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список кабинетов',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCabinets();
  }, [currentPage, itemsPerPage]);

  const handleAddAccount = async (data) => {
    try {
      await axios.post('https://nexus_api.cryptspace.ru/cabinet/', data);
      setIsAddAccountOpen(false);
      fetchCabinets();
      toast({
        title: 'Аккаунт добавлен',
        description: `Кабинет "${data.name}" успешно добавлен`,
      });
    } catch (error) {
      console.error('Error adding cabinet:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить кабинет',
        variant: 'destructive',
      });
    }
  };

  const isSelected = (cabinetId) => {
    return selectedAccounts.some(acc => acc.id === cabinetId);
  };

  const handleToggleComparison = (cabinet) => {
    if (isSelected(cabinet.id)) {
      removeFromComparison(cabinet.id);
    } else {
      addToComparison(cabinet);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Аккаунты</h1>
        <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Добавить аккаунт
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Добавить новый аккаунт</DialogTitle>
            </DialogHeader>
            <AddAccountForm onSubmit={handleAddAccount} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Список аккаунтов</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
            <tr>
              <th className="text-left p-6 text-gray-400 font-medium">ID</th>
              <th className="text-left p-6 text-gray-400 font-medium">Название</th>
              <th className="text-left p-6 text-gray-400 font-medium">Client ID</th>
              <th className="text-left p-6 text-gray-400 font-medium">Действия</th>
            </tr>
            </thead>
            <tbody>
            {cabinets.map((cabinet) => (
                <tr key={cabinet.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-white">{cabinet.id}</td>
                  <td className="p-6 text-white">{cabinet.name}</td>
                  <td className="p-6 text-white">{cabinet.client_id}</td>
                  <td className="p-6">
                    <div className="flex space-x-2">
                      <button
                          onClick={() => handleToggleComparison(cabinet)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              isSelected(cabinet.id)
                                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                      >
                        {isSelected(cabinet.id) ? 'Убрать' : 'Сравнить'}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
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

      {selectedAccounts.length > 0 && (
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
              <span className="text-white font-medium">
                Выбрано для сравнения: {selectedAccounts.length}
              </span>
                <div className="flex space-x-2">
                  {selectedAccounts.map((account) => (
                      <span
                          key={account.id}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                      >
                    {account.name}
                  </span>
                  ))}
                </div>
              </div>
              <a
                  href="/comparison"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-all"
            >
              Сравнить аккаунты
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
