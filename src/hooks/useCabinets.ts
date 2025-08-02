import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

interface Cabinet {
    id: string;
    name: string;
}

export const useCabinets = () => {
    return useQuery<Cabinet[], Error>({
        queryKey: ['cabinets'],
        queryFn: async () => {
            try {
                const response = await axios.get<Cabinet[]>('https://nexus_api.cryptspace.ru/cabinet/all');

                return [
                    ...response.data.map(c => ({
                        id: String(c.id),
                        name: c.name || `Кабинет ${c.id}`
                    }))
                ];
            } catch (error) {
                console.error('Error fetching cabinets:', error);
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось загрузить список кабинетов',
                    variant: 'destructive',
                });
                return [{ id: 'all', name: 'Все кабинеты' }]; // Fallback
            }
        },
        staleTime: 60 * 60 * 1000, // Кэшировать 1 час
        retry: 2, // 2 попытки повтора
    });
};