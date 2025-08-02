import React, {useEffect, useState} from 'react';
import {
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  FolderOpen,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AddListingForm from '../components/AddListingForm';
import ListingFilters from '../components/ListingFilters';
import CabinetFileModal from '../components/CabinetFileModal';
import ListingMetrics from "@/components/ListingMetrics.tsx";
import axios from "axios";
import {toast} from "@/hooks/use-toast.ts";
import PaginationControls from "@/components/PaginationControls.tsx";
import {useLocation} from "react-router-dom";
import {DateRange} from "react-day-picker";
import DateRangePicker from "@/components/DateRangePicker.tsx";
import CityReplaceModal from "@/components/CityReplaceModal.tsx";

const Listings = () => {
  const location = useLocation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isCityReplaceOpen, setIsCityReplaceOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const { fileData } = location.state || {};
  const [totalItems, setTotalItems] = useState(fileData?.total || 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [cabinetId, setCabinetId] = useState();
  const dateFrom = dateRange?.from?.toLocaleDateString('en-CA');
  const dateTo = dateRange?.to?.toLocaleDateString('en-CA');

  const handleFiltersChange = ({ selectedCabinets }) => {
    console.log('Выбранные кабинеты:', selectedCabinets);
    setCabinetId(selectedCabinets.length > 0 ? selectedCabinets[0] : null);
  };

  const fetchVacancies = async (page: number, limit: number) => {
    try {
      const response = await axios.get(`https://nexus_api.cryptspace.ru/cabinet/${cabinetId}/vacancies`, {
        params: {
          date_from: dateFrom,
          date_to: dateTo,
          page,
          limit,
        },
      });
      setListings(response.data.results);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить вакансии',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (cabinetId) {
      fetchVacancies(currentPage, itemsPerPage);
    }
  }, [dateFrom, dateTo, currentPage, itemsPerPage, cabinetId]);


  const handleAddListing = () => {
    setIsAddListingOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Активно':
        return 'text-green-400 bg-green-400/20';
      case 'Модерация':
        return 'text-orange-400 bg-orange-400/20';
      case 'Неактивно':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Объявления</h1>
          <div className="flex space-x-3">
            {/* Quick Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Settings className="w-4 h-4 mr-2" />
                  Быстрые действия
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  <Edit className="w-4 h-4 mr-2" />
                  Массовое редактирование
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-white hover:bg-gray-800"
                    onClick={() => setIsCityReplaceOpen(true)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Замена городов
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки автовыгрузки
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Statistics Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Статистика
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700 min-w-[200px]">
                <div className="p-3">
                  <h4 className="text-white font-medium mb-2">Статистика объявлений</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Всего объявлений:</span>
                      <span className="text-white font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Активных:</span>
                      <span className="text-green-400 font-medium">892</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">На модерации:</span>
                      <span className="text-orange-400 font-medium">234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Неактивных:</span>
                      <span className="text-red-400 font-medium">121</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setIsFileModalOpen(true)}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Просмотр файлов
            </Button>

            <button className="btn-secondary flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Скачать XML
            </button>
            <Dialog open={isAddListingOpen} onOpenChange={setIsAddListingOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать объявление
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Создать новое объявление</DialogTitle>
                </DialogHeader>
                <AddListingForm onSubmit={handleAddListing} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-6 text-gray-400 font-medium">Объявление</th>
                    <th className="text-left p-6 text-gray-400 font-medium">Цена</th>
                    <th className="text-left p-6 text-gray-400 font-medium">Статус</th>
                    <th className="text-left p-6 text-gray-400 font-medium">Просмотры</th>
                    <th className="text-left p-6 text-gray-400 font-medium">Действия</th>
                  </tr>
                  </thead>
                  <tbody>
                  {listings.map((listing) => (
                      <tr key={listing.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-6">
                          <div>
                            <p className="text-white font-medium">{listing.title}</p>
                            <p className="text-gray-400 text-sm">{listing.category}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-white font-medium">{listing.price}</span>
                        </td>
                        <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                          {listing.status}
                        </span>
                        </td>
                        <td className="p-6">
                          <ListingMetrics
                              views={listing.views}
                              contacts={listing.contacts}
                              favourites={listing.favourites}
                          />
                        </td>
                        <td className="p-6">
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
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
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </div>

          <div className="space-y-6">
            <ListingFilters onFiltersChange={handleFiltersChange} />

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">XML Генерация</h3>
              <p className="text-gray-400 text-sm mb-4">
                Последняя генерация XML файла была 2 часа назад
              </p>
              <button className="w-full btn-primary">
                Сгенерировать XML
              </button>
            </div>
          </div>
        </div>

        <CabinetFileModal
            open={isFileModalOpen}
            onOpenChange={setIsFileModalOpen}
        />
        <CityReplaceModal
            open={isCityReplaceOpen}
            onOpenChange={setIsCityReplaceOpen}
        />
      </div>
  );
};

export default Listings;