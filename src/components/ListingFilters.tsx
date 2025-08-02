
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

interface Cabinet {
    id: string;
    name: string;
}

interface FilterGroup {
    id: string;
    name: string;
    items: { id: string; label: string; checked: boolean }[];
    showAll: boolean;
}

const ListingFilters = ({ onFiltersChange }) => {
    const [cabinets, setCabinets] = useState<Cabinet[]>([]);
    const [filters, setFilters] = useState<FilterGroup[]>([
        {
            id: 'cabinets',
            name: 'Кабинеты',
            items: [],
            showAll: false,
        },
        {
            id: 'transport',
            name: 'Тип транспорта',
            items: [
                { id: 'auto', label: 'Авто', checked: false },
                { id: 'bike', label: 'Вело', checked: false },
                { id: 'walk', label: 'Пеший', checked: false },
            ],
            showAll: false,
        },
    ]);

    useEffect(() => {
        console.log('Filters changed:', filters);
        const selectedCabinets = filters.find(f => f.id === 'cabinets')?.items.filter(i => i.checked).map(i => i.id) || [];
        onFiltersChange?.({ selectedCabinets });
    }, [filters, onFiltersChange]);

    const fetchCabinets = async () => {
        try {
            const response = await axios.get('https://nexus_api.cryptspace.ru/cabinet/all');
            setCabinets(response.data);

            // Update cabinet filter items
            setFilters(prev => prev.map(filter =>
                filter.id === 'cabinets'
                    ? {
                        ...filter,
                        items: response.data.map((cabinet: Cabinet) => ({
                            id: cabinet.id,
                            label: cabinet.name,
                            checked: false,
                        }))
                    }
                    : filter
            ));
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
    }, []);

    const toggleShowAll = (filterId: string) => {
        setFilters(prev => prev.map(filter =>
            filter.id === filterId
                ? { ...filter, showAll: !filter.showAll }
                : filter
        ));
    };

    const toggleCheckbox = (filterId: string, itemId: string) => {
        setFilters(prev => prev.map(filter => {
            if (filter.id === filterId) {
                if (filterId === 'cabinets') {
                    // Разрешаем выбор только одного кабинета
                    const isCurrentlyChecked = filter.items.find(item => item.id === itemId)?.checked;
                    return {
                        ...filter,
                        items: filter.items.map(item => ({
                            ...item,
                            checked: item.id === itemId ? !isCurrentlyChecked : false
                        }))
                    };
                } else {
                    // Для других фильтров (например, транспорт) сохраняем множественный выбор
                    return {
                        ...filter,
                        items: filter.items.map(item =>
                            item.id === itemId ? { ...item, checked: !item.checked } : item
                        )
                    };
                }
            }
            return filter;
        }));
    };

    const getVisibleItems = (filter: FilterGroup) => {
        if (filter.showAll || filter.items.length <= 5) {
            return filter.items;
        }
        return filter.items.slice(0, 5);
    };

    const shouldShowToggle = (filter: FilterGroup) => {
        return filter.items.length > 5;
    };

    return (
        <div className="space-y-6">
            {filters.map((filter) => (
                <div key={filter.id} className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">{filter.name}</h3>
                    <div className="space-y-3">
                        {getVisibleItems(filter).map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${filter.id}-${item.id}`}
                                    checked={item.checked}
                                    onCheckedChange={() => toggleCheckbox(filter.id, item.id)}
                                    className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                />
                                <label
                                    htmlFor={`${filter.id}-${item.id}`}
                                    className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                                >
                                    {item.label}
                                </label>
                            </div>
                        ))}

                        {shouldShowToggle(filter) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleShowAll(filter.id)}
                                className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                            >
                                {filter.showAll ? (
                                    <>
                                        <ChevronUp className="w-4 h-4 mr-1" />
                                        Скрыть
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4 mr-1" />
                                        Показать все ({filter.items.length})
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListingFilters;