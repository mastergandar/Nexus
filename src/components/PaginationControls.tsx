import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PaginationControlsProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    pageSizeOptions?: number[];
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
                                                                   currentPage,
                                                                   totalItems,
                                                                   itemsPerPage,
                                                                   onPageChange,
                                                                   onItemsPerPageChange,
                                                                   pageSizeOptions = [10, 25, 50, 100],
                                                               }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    if (totalItems === 0) return null;

    return (
        <div className="flex items-center justify-between mt-6 px-4 pb-4">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Показать по:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
                        <SelectTrigger className="w-20 bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={size.toString()} className="text-white hover:bg-gray-700">
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <span className="text-sm text-gray-400">
                    Показано {startItem}-{endItem} из {totalItems}
                </span>
            </div>

            <Pagination className="justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            className={`text-white hover:bg-white/10 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </PaginationItem>

                    {generatePageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {page === '...' ? (
                                <PaginationEllipsis className="text-gray-400" />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(page as number)}
                                    isActive={currentPage === page}
                                    className={`text-white hover:bg-white/10 ${
                                        currentPage === page ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : ''
                                    }`}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            className={`text-white hover:bg-white/10 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginationControls;