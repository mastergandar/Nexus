
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useCabinets} from "@/hooks/useCabinets.ts";
import SkeletonLoading from "@/components/SkeletonLoading.tsx";


interface CabinetFileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CabinetFileModal: React.FC<CabinetFileModalProps> = ({ open, onOpenChange }) => {
    const { data: cabinets, isLoading, error } = useCabinets();
    const [expandedCabinet, setExpandedCabinet] = useState<string | null>(null);
    const [loadingCabinet, setLoadingCabinet] = useState<string | null>(null);
    const navigate = useNavigate();
    const currentPage = 1
    const itemsPerPage = 10

    const handleCabinetClick = async (cabinetId: string) => {
        if (expandedCabinet === cabinetId) {
            setExpandedCabinet(null);
            return;
        }

        setLoadingCabinet(cabinetId);
        setExpandedCabinet(cabinetId);

        try {
            const response = await axios.get(`https://nexus_api.cryptspace.ru/cabinet/${cabinetId}/file`, {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                },
            });

            // Перенаправляем на новую страницу с данными файла
            navigate(`/listings/file/${cabinetId}`, {
                state: {
                    fileData: response.data,
                    cabinetId,
                    cabinetName: cabinets.find(c => c.id === cabinetId)?.name
                }
            });

            onOpenChange(false);
        } catch (error) {
            console.error('Error fetching file:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить файл',
                variant: 'destructive',
            });
            setExpandedCabinet(null);
        } finally {
            setLoadingCabinet(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white">Выберите кабинет для просмотра файлов</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                        <SkeletonLoading variant="card" count={3} />
                    ) : (
                        <>
                        {cabinets.map((cabinet) => (
                            <div key={cabinet.id} className="border border-gray-700 rounded-lg">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between p-4 text-white hover:bg-gray-800"
                                    onClick={() => handleCabinetClick(cabinet.id)}
                                    disabled={loadingCabinet === cabinet.id}
                                >
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5" />
                                        <span>{cabinet.name}</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {loadingCabinet === cabinet.id && (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        )}
                                        {expandedCabinet === cabinet.id ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </div>
                                </Button>
                            </div>
                        ))}
                        {cabinets?.length === 0 && !isLoading && (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Кабинеты не найдены</p>
                            </div>
                        )}
                        </>
                    )}
                </div>

                {cabinets?.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">Кабинеты не найдены</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CabinetFileModal;