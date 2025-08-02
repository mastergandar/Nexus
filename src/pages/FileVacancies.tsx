import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import PaginationControls from "@/components/PaginationControls.tsx";
import EditListingForm from "@/components/EditListingForm.tsx";
import ListingMetrics from "@/components/ListingMetrics.tsx";

interface Vacancy {
    id: string;
    external_id: string;
    title: string;
    description: string;
    address: string;
    salary_from: number;
    salary_to: number;
    profession: string;
    industry: string;
    views: number;
    contacts: number;
    favourites: number;
}

const FileVacancies = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fileData, cabinetId, cabinetName } = location.state || {};

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(fileData?.total || 0);
    const [vacancies, setVacancies] = useState<Vacancy[]>(fileData?.results || []);
    const [isAddVacancyOpen, setIsAddVacancyOpen] = useState(false);
    const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);

    // Функция для загрузки вакансий с сервера
    const fetchVacancies = async (page: number, limit: number) => {
        try {
            const response = await axios.get(`https://nexus_api.cryptspace.ru/cabinet/${cabinetId}/file`, {
                params: {
                    page,
                    limit,
                },
            });
            setVacancies(response.data.results);
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

    const removeVacancyByExternalId = (externalId: string) => {
        setVacancies(prevVacancies =>
            prevVacancies.filter(vacancy => vacancy.external_id !== externalId)
        );
    };

    // Загрузка данных при изменении страницы, количества элементов или cabinetId
    useEffect(() => {
        if (cabinetId) {
            fetchVacancies(currentPage, itemsPerPage);
        }
    }, [currentPage, itemsPerPage, cabinetId, isAddVacancyOpen]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    if (!cabinetId) {
        return (
            <div className="space-y-6">
                <div className="flex items-center" space-x-4>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/listings')}
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Назад к объявлениям
                    </Button>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-400">Данные файла не найдены</p>
                </div>
            </div>
        );
    }

    const handleEditVacancy = (vacancy: Vacancy) => {
        setEditingVacancy(vacancy);
        setIsAddVacancyOpen(true);
    };

    const handleDeleteVacancy = async (external_id: string) => {
        try {
            await axios.delete(`https://nexus_api.cryptspace.ru/vacancies/${cabinetId}/${external_id}`);
            removeVacancyByExternalId(external_id);
            toast({
                title: 'Успешно',
                description: 'Вакансия удалена',
            });
        } catch (error) {
            console.error('Error deleting vacancy:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить вакансию',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/listings')}
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Назад к объявлениям
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Вакансии файла</h1>
                        <p className="text-gray-400">{cabinetName}</p>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить изменения
                    </Button>

                    <Dialog open={isAddVacancyOpen} onOpenChange={setIsAddVacancyOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Добавить вакансию
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
                            <DialogHeader>
                                <DialogTitle className="text-white">
                                    {editingVacancy ? 'Редактировать вакансию' : 'Добавить новую вакансию'}
                                </DialogTitle>
                            </DialogHeader>
                            <EditListingForm
                                initialData={editingVacancy}
                                onCancel={() => {
                                    setEditingVacancy(null);
                                    setIsAddVacancyOpen(false);
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-white/10">
                        <tr>
                            <th className="text-left p-6 text-gray-400 font-medium">Название</th>
                            <th className="text-left p-6 text-gray-400 font-medium">Профессия</th>
                            <th className="text-left p-6 text-gray-400 font-medium">Зарплата</th>
                            <th className="text-left p-6 text-gray-400 font-medium">Адрес</th>
                            <th className="text-left p-6 text-gray-400 font-medium">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {vacancies.map((vacancy) => (
                            <tr key={vacancy.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-6">
                                    <div>
                                        <p className="text-white font-medium">{vacancy.title}</p>
                                        <p className="text-gray-400 text-sm truncate max-w-xs">{vacancy.description}</p>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div>
                                        <p className="text-white">{vacancy.profession}</p>
                                        <p className="text-gray-400 text-sm">{vacancy.industry}</p>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="text-white">
                                        {vacancy.salary_from.toLocaleString()} - {vacancy.salary_to.toLocaleString()} ₽
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className="text-gray-300 text-sm">{vacancy.address}</span>
                                </td>
                                <td className="p-6">
                                    <ListingMetrics
                                        views={vacancy.views}
                                        contacts={vacancy.contacts}
                                        favourites={vacancy.favourites}
                                    />
                                </td>
                                <td className="p-6">
                                    <div className="flex space-x-2">
                                        <button
                                            className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                                            onClick={() => handleEditVacancy(vacancy)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                            onClick={() => handleDeleteVacancy(vacancy.external_id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <PaginationControls
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </div>

                {vacancies.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">Вакансии не найдены</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileVacancies;