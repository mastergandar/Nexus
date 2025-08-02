import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const accountSchema = z.object({
    id: z.number().gte(1),
    name: z.string().min(1, 'Название кабинета обязательно'),
    client_id: z.string().min(1, 'Client ID обязателен'),
    client_secret: z.string().min(1, 'Client Secret обязателен'),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AddAccountFormProps {
    onSubmit?: (data: AccountFormData) => void;
    onCancel?: () => void;
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({ onSubmit, onCancel }) => {
    const form = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            id: 99999999,
            name: '',
            client_id: '',
            client_secret: '',
        },
    });

    const handleSubmit = (data: AccountFormData) => {
        onSubmit?.(data);
        form.reset();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Название кабинета</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                    placeholder="Введите название кабинета"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="client_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Client ID</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                    placeholder="Введите Client ID"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="client_secret"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Client Secret</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                    placeholder="Введите Client Secret"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex space-x-4 pt-4">
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                    >
                        Добавить аккаунт
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
    );
};

export default AddAccountForm;