
import React, {useState, useRef, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, X, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from "axios";
import {Textarea} from "@/components/ui/textarea.tsx";



const listingSchema = z.object({
    cabinet: z.string().min(1, 'Выберите кабинет'),
    dateBegin: z.string().min(1, 'Укажите дату начала'),
    dateEnd: z.string().min(1, 'Укажите дату окончания'),
    managerName: z.string().min(1, 'Имя менеджера обязательно'),
    contactPhone: z.string().min(1, 'Телефон обязателен'),
    industry: z.string().min(1, 'Отрасль обязательна'),
    profession: z.string().min(1, 'Профессия обязательна'),
    salaryFrom: z.string().min(1, 'Зарплата от обязательна'),
    salaryTo: z.string().min(1, 'Зарплата до обязательна'),
    count: z.number().min(1, 'Количество объявлений должно быть больше 0'),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface Vacancy {
    id: string;
    title: string;
    description: string;
    address: string;
    salary_from: number;
    salary_to: number;
    profession: string;
    industry: string;
}

interface AddListingFormProps {
    onSubmit?: (data: any) => void;
    onCancel?: () => void;
    initialData?: Vacancy;
}

const jobBonusesOptions = [
    'Медицинская страховка',
    'Оплата бензина',
    'Парковка',
    'Зоны отдыха',
    'Скидки в компании',
    'Оплата мобильной связи',
    'Обучение',
    'Компенсация проезда с работы',
];

const deliveryMethodOptions = [
    'На автомобиле',
    'На самокате',
    'Пешком',
    'На велосипеде',
];

const AddListingForm: React.FC<AddListingFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const [bonusesOpen, setBonusesOpen] = useState(false);
    const [deliveryOpen, setDeliveryOpen] = useState(false);
    const [description, setDescription] = useState(initialData?.description || '');
    const [addresses, setAddresses] = useState<string[]>(initialData?.address ? [initialData.address] : []);
    const [titles, setTitles] = useState<string[]>(initialData?.title ? [initialData.title] : []);
    const [currentAddress, setCurrentAddress] = useState('');
    const [currentTitle, setCurrentTitle] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [cabinets, setCabinets] = useState([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ListingFormData>({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            cabinet: '',
            dateBegin: '',
            dateEnd: '',
            managerName: '',
            contactPhone: '',
            industry: initialData?.industry || '',
            profession: initialData?.profession || '',
            salaryFrom: initialData?.salary_from?.toString() || '',
            salaryTo: initialData?.salary_to?.toString() || '',
            count: 1,
        },
    });

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

    useEffect(() => {
        fetchCabinets();
    }, []);

    const addAddress = () => {
        if (currentAddress.trim()) {
            setAddresses([...addresses, currentAddress.trim()]);
            setCurrentAddress('');
        }
    };

    const removeAddress = (index: number) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    const addTitle = () => {
        if (currentTitle.trim()) {
            setTitles([...titles, currentTitle.trim()]);
            setCurrentTitle('');
        }
    };

    const removeTitle = (index: number) => {
        setTitles(titles.filter((_, i) => i !== index));
    };

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
        const cabinetId = form.getValues('cabinet');

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

    const generateIds = (count: number): string[] => {
        return Array.from({ length: count }, () => uuidv4());
    };

    const handleSubmit = async (data: ListingFormData) => {
        console.log('Form submitted with data:', data);

        if (addresses.length === 0 && !currentAddress.trim()) {
            toast({
                title: 'Ошибка',
                description: 'Добавьте хотя бы один адрес',
                variant: 'destructive',
            });
            return;
        }

        if (titles.length === 0 && !currentTitle.trim()) {
            toast({
                title: 'Ошибка',
                description: 'Добавьте хотя бы один заголовок',
                variant: 'destructive',
            });
            return;
        }

        if (!description.trim()) {
            toast({
                title: 'Ошибка',
                description: 'Описание обязательно',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const submissionData = {
                id: generateIds(data.count),
                date_from: new Date(data.dateBegin).toISOString(),
                date_to: new Date(data.dateEnd).toISOString(),
                manager_name: data.managerName,
                contact_phone: data.contactPhone,
                address: addresses.length > 0 ? addresses : [currentAddress.trim()],
                title: titles.length > 0 ? titles : [currentTitle.trim()],
                description: description.trim(),
                industry: data.industry,
                profession: data.profession,
                salary_from: parseInt(data.salaryFrom),
                salary_to: parseInt(data.salaryTo),
                count: data.count,
                images_url: selectedImages,
            };

            console.log('Отправка данных объявления:', submissionData);

            const response = await fetch(`https://nexus_api.cryptspace.ru/cabinet/${data.cabinet}/add_vacancy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Ответ сервера:', result);

            toast({
                title: 'Объявление создано',
                description: `${data.count} объявлений успешно создано`,
            });

            // Reset form
            form.reset();
            setDescription('');
            setAddresses([]);
            setTitles([]);
            setSelectedImages([]);
            setCurrentAddress('');
            setCurrentTitle('');

            onSubmit?.(result);
        } catch (error) {
            console.error('Ошибка при создании объявления:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось создать объявление. Проверьте подключение к серверу.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const watchedCabinet = form.watch('cabinet');

    React.useEffect(() => {
        if (watchedCabinet) {
            loadAvailableImages(watchedCabinet);
        }
    }, [watchedCabinet]);

    return (
        <div className="glass-card p-6 rounded-xl max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-6">
                {initialData ? 'Редактировать вакансию' : 'Добавить новое объявление'}
            </h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="cabinet"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Кабинет</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                                <SelectValue placeholder="Выберите кабинет" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            {cabinets.map((cabinet) => (
                                                <SelectItem key={cabinet.id} value={String(cabinet.id)} className="text-white">
                                                    {cabinet.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="count"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Количество объявлений</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min="1"
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                            placeholder="1"
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
                            name="dateBegin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Дата начала</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="datetime-local"
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dateEnd"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Дата окончания</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="datetime-local"
                                            className="bg-white/10 border-white/20 text-white"
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
                            name="managerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Имя менеджера</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                            placeholder="Введите имя менеджера"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Контактный телефон</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                            placeholder="Введите номер телефона"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <FormLabel className="text-white">Адреса</FormLabel>
                        <div className="flex space-x-2">
                            <Input
                                value={currentAddress}
                                onChange={(e) => setCurrentAddress(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                placeholder="Введите адрес"
                            />
                            <Button
                                type="button"
                                onClick={addAddress}
                                className="px-3"
                                variant="outline"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        {addresses.length > 0 && (
                            <div className="space-y-2">
                                {addresses.map((address, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                                        <span className="text-white">{address}</span>
                                        <Button
                                            type="button"
                                            onClick={() => removeAddress(index)}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <FormLabel className="text-white">Заголовки</FormLabel>
                        <div className="flex space-x-2">
                            <Input
                                value={currentTitle}
                                onChange={(e) => setCurrentTitle(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                placeholder="Введите заголовок"
                            />
                            <Button
                                type="button"
                                onClick={addTitle}
                                className="px-3"
                                variant="outline"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        {titles.length > 0 && (
                            <div className="space-y-2">
                                {titles.map((title, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                                        <span className="text-white">{title}</span>
                                        <Button
                                            type="button"
                                            onClick={() => removeTitle(index)}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
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

                    <div className="space-y-2">
                        <FormLabel className="text-white">Описание</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[120px]"
                            placeholder="Введите описание объявления..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <Collapsible open={bonusesOpen} onOpenChange={setBonusesOpen}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-between border-white/20 text-white hover:bg-white/10"
                                type="button"
                            >
                                Льготы и бонусы
                                {bonusesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 mt-2">
                            {jobBonusesOptions.map((bonus, index) => (
                                <div key={index} className="p-2 bg-gray-700 rounded text-gray-300 text-sm">
                                    {bonus}
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible open={deliveryOpen} onOpenChange={setDeliveryOpen}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-between border-white/20 text-white hover:bg-white/10"
                                type="button"
                            >
                                Способы доставки
                                {deliveryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 mt-2">
                            {deliveryMethodOptions.map((method, index) => (
                                <div key={index} className="p-2 bg-gray-700 rounded text-gray-300 text-sm">
                                    {method}
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>

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

                    <div className="flex space-x-4 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                        >
                            {isSubmitting ? 'Создание...' : initialData ? 'Обновить объявление' : 'Создать объявление'}
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

export default AddListingForm;