import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { toast } from "@/hooks/use-toast.ts";

interface CityReplaceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Cabinet {
    id: string;
    name: string;
}

const CityReplaceModal: React.FC<CityReplaceModalProps> = ({ open, onOpenChange }) => {
    const [selectedCabinet, setSelectedCabinet] = useState<string>('');
    const [oldCities, setOldCities] = useState<string>('');
    const [newAddresses, setNewAddresses] = useState<string>('');
    const [cabinets, setCabinets] = useState<Cabinet[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            const fetchCabinets = async () => {
                try {
                    const response = await axios.get('https://nexus_api.cryptspace.ru/cabinet/all');
                    setCabinets(response.data);
                } catch (error) {
                    console.error('Error fetching cabinets:', error);
                    toast({
                        title: 'Ошибка',
                        description: 'Не удалось загрузить список кабинетов',
                        variant: 'destructive',
                    });
                }
            };
            fetchCabinets();
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!selectedCabinet || !oldCities.trim() || !newAddresses.trim()) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        setIsLoading(true);
        try {
            const data = {
                old_cities: oldCities.split('\n').filter(city => city.trim() !== ''),
                new_addresses: newAddresses.split('\n').filter(address => address.trim() !== '')
            };
            await axios.post(`https://nexus_api.cryptspace.ru/vacancies/${selectedCabinet}/edit/bulk`, data);
            alert('Города успешно заменены!');
            onOpenChange(false);
            setSelectedCabinet('');
            setOldCities('');
            setNewAddresses('');
        } catch (error) {
            console.error('Error replacing cities:', error);
            alert('Ошибка при замене городов');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] bg-gray-900 border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white">Замена городов</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="cabinet" className="text-white">Выберите кабинет</Label>
                        <Select value={selectedCabinet} onValueChange={setSelectedCabinet}>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue placeholder="Выберите кабинет" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                                {cabinets.map((cabinet) => (
                                    <SelectItem key={cabinet.id} value={cabinet.id} className="text-white hover:bg-gray-700">
                                        {cabinet.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldCities" className="text-white">Старые города (по одному в строке)</Label>
                            <Textarea
                                id="oldCities"
                                placeholder="Москва\nСанкт-Петербург\nНовосибирск"
                                value={oldCities}
                                onChange={(e) => setOldCities(e.target.value)}
                                className="min-h-[200px] bg-gray-800 border-gray-600 text-white resize-none font-mono"
                                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newAddresses" className="text-white">Новые адреса (по одному в строке)</Label>
                            <Textarea
                                id="newAddresses"
                                placeholder="г. Москва, ул. Тверская\nг. Санкт-Петербург, Невский пр.\nг. Новосибирск, ул. Ленина"
                                value={newAddresses}
                                onChange={(e) => setNewAddresses(e.target.value)}
                                className="min-h-[200px] bg-gray-800 border-gray-600 text-white resize-none font-mono"
                                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                            />
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        <p>• Вводите по одному городу/адресу в строке</p>
                        <p>• Количество строк в обоих полях должно совпадать</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-gray-600 text-white hover:bg-gray-800"
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                        >
                            {isLoading ? 'Замена...' : 'Заменить города'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CityReplaceModal;