import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import {Plus, Upload, X} from 'lucide-react';

// Схема валидации, соответствующая vacancySchema
const vacancySchema = z.object({
    title: z.string().min(1, 'Заголовок обязателен'),
    description: z.string().min(1, 'Описание обязательно'),
    address: z.string().min(1, 'Адрес обязателен'),
    profession: z.string().min(1, 'Профессия обязательна'),
    industry: z.string().min(1, 'Отрасль обязательна'),
    salaryFrom: z.string().min(1, 'Минимальная зарплата обязательна'),
    salaryTo: z.string().min(1, 'Максимальная зарплата обязательна'),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

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
    image_url?: string;
}

interface EditListingFormProps {
    initialData: Vacancy;
    onSubmit?: (data: Vacancy) => void;
    onCancel?: () => void;
}

const EditListingForm: React.FC<EditListingFormProps> = ({ initialData, onCancel }) => {
    const { cabinetId } = useParams<{ cabinetId: string }>();
    const [cabinetName, setCabinetName] = useState<string>('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const [showImageGallery, setShowImageGallery] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<VacancyFormData>({
        resolver: zodResolver(vacancySchema),
        defaultValues: {
            title: initialData.title,
            description: initialData.description,
            address: initialData.address,
            profession: initialData.profession,
            industry: initialData.industry,
            salaryFrom: initialData.salary_from.toString(),
            salaryTo: initialData.salary_to.toString(),
        },
    });

    React.useEffect(() => {
        if (cabinetId) {
            loadAvailableImages(cabinetId);
            setSelectedImages([initialData.image_url])
        }
    }, [cabinetId]);

    const loadAvailableImages = async (cabinetId: string) => {
        try {
            const response = await fetch(`https://nexus_api.cryptspace.ru/cabinet/${cabinetId}/get-images`);
            const data = await response.json();
            setAvailableImages(data.urls || []);
        } catch (error) {
            console.error('Ошибка загрузки изображений:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить изображения',
                variant: 'destructive',
            });
        }
    };

    const uploadImages = async (files: FileList, cabinetId: string) => {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch(`https://nexus_api.cryptspace.ru/cabinet/${cabinetId}/upload-images`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setAvailableImages(prev => [...prev, ...data.urls]);
            toast({
                title: 'Успех',
                description: 'Изображения успешно загружены',
            });
        } catch (error) {
            console.error('Ошибка загрузки изображений:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить изображения',
                variant: 'destructive',
            });
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && cabinetId) {
            uploadImages(files, cabinetId);
        }
    };

    const toggleImageSelection = (imageUrl: string) => {
        setSelectedImages(prev =>
            prev.includes(imageUrl)
                ? prev.filter(url => url !== imageUrl)
                : [...prev, imageUrl]
        );
    };

    const removeSelectedImage = (imageUrl: string) => {
        setSelectedImages(prev => prev.filter(url => url !== imageUrl));
    };

    useEffect(() => {
        const fetchCabinets = async () => {
            try {
                const response = await axios.get('https://nexus_api.cryptspace.ru/cabinet/all');
                const cabinets = response.data;
                const cabinet = cabinets.find((cab: any) => cab.id === cabinetId);
                if (cabinet) {
                    setCabinetName(cabinet.name);
                }
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
    }, [cabinetId]);

    const handleSubmit = async (data: VacancyFormData) => {
        try {
            const updatedVacancy: Vacancy = {
                ...initialData,
                title: data.title,
                description: data.description,
                address: data.address,
                profession: data.profession,
                industry: data.industry,
                salary_from: parseInt(data.salaryFrom),
                salary_to: parseInt(data.salaryTo),
                image_url: selectedImages[0],
            };

            await axios.put(`https://nexus_api.cryptspace.ru/cabinet/${cabinetId}/vacancy/${initialData.id}`, updatedVacancy);

            toast({
                title: 'Успешно',
                description: 'Вакансия обновлена',
            });

        } catch (error) {
            console.error('Error updating vacancy:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить вакансию',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="glass-card p-6 rounded-xl max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-6">Редактировать вакансию</h3>
            <p className="text-white mb-4">Кабинет: {cabinetName}</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Заголовок</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                        placeholder="Введите заголовок"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Описание</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[120px]"
                                        placeholder="Введите описание вакансии..."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Адрес</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                        placeholder="Введите адрес"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Профессия</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                            placeholder="Введите профессию"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="industry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Отрасль</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                            placeholder="Введите отрасль"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="salaryFrom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Зарплата от</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                            placeholder="Введите минимальную зарплату"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="salaryTo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Зарплата до</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                            placeholder="Введите максимальную зарплату"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <FormLabel className="text-white">Изображения</FormLabel>

                        {/* Selected Images */}
                        {selectedImages.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                                {selectedImages.map((imageUrl, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={imageUrl}
                                            alt={`Выбранное изображение ${index + 1}`}
                                            className="w-full h-20 object-cover rounded border-2 border-blue-500"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => removeSelectedImage(imageUrl)}
                                            className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-red-500 hover:bg-red-600"
                                            variant="destructive"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                onClick={() => setShowImageGallery(!showImageGallery)}
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Выбрать из галереи
                            </Button>
                            <Button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Загрузить новые
                            </Button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {/* Image Gallery */}
                        {showImageGallery && (
                            <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                                <h4 className="text-white mb-3">Доступные изображения</h4>
                                {availableImages.length > 0 ? (
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                        {availableImages.map((imageUrl, index) => (
                                            <div
                                                key={index}
                                                className={`relative cursor-pointer rounded border-2 transition-all ${
                                                    selectedImages.includes(imageUrl)
                                                        ? 'border-blue-500 ring-2 ring-blue-300'
                                                        : 'border-gray-600 hover:border-gray-400'
                                                }`}
                                                onClick={() => toggleImageSelection(imageUrl)}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={`Изображение ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded"
                                                />
                                                {selectedImages.includes(imageUrl) && (
                                                    <div className="absolute inset-0 bg-blue-500/30 rounded flex items-center justify-center">
                                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs">✓</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">Нет доступных изображений</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                        >
                            Обновить вакансию
                        </Button>
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                Отмена
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default EditListingForm;