
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateRangePickerProps {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  date,
  onDateChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetRanges = [
    {
      label: 'Сегодня',
      range: { from: new Date(), to: new Date() }
    },
    {
      label: 'Вчера',
      range: { 
        from: new Date(Date.now() - 24 * 60 * 60 * 1000), 
        to: new Date(Date.now() - 24 * 60 * 60 * 1000) 
      }
    },
    {
      label: 'Последние 7 дней',
      range: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date()
      }
    },
    {
      label: 'Последние 14 дней',
      range: {
        from: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        to: new Date()
      }
    },
    {
      label: 'Последние 30 дней',
      range: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date()
      }
    },
    {
      label: 'Эта Неделя',
      range: {
        from: new Date(Date.now() - (new Date().getDay() - 1) * 24 * 60 * 60 * 1000),
        to: new Date()
      }
    },
    {
      label: 'Последняя Неделя',
      range: {
        from: new Date(Date.now() - (new Date().getDay() + 6) * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() - new Date().getDay() * 24 * 60 * 60 * 1000)
      }
    },
    {
      label: 'Этот Месяц',
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date()
      }
    },
    {
      label: 'Последний Месяц',
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      }
    }
  ];

  const handlePresetClick = (range: DateRange) => {
    onDateChange?.(range);
    setIsOpen(false);
  };

  const formatDateRange = (dateRange?: DateRange) => {
    if (!dateRange?.from) return 'Выберите период';
    if (!dateRange.to) return format(dateRange.from, 'dd.MM.yyyy');
    return `${format(dateRange.from, 'dd.MM.yyyy')} - ${format(dateRange.to, 'dd.MM.yyyy')}`;
  };

  return (
    <div className={cn("glass-card p-4 rounded-xl", className)}>
      <div className="flex items-center space-x-4">
        <span className="text-white font-medium">Период</span>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-between text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                !date && "text-gray-400"
              )}
            >
              {formatDateRange(date)}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700" align="start">
            <div className="flex max-w-3xl">
              <div className="border-r border-gray-700 p-4 space-y-2">
                {presetRanges.map((preset, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/10"
                    onClick={() => handlePresetClick(preset.range)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <div className="p-4">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={onDateChange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 border-gray-600 hover:bg-gray-700"
                  >
                    Отмена
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400"
                  >
                    Применить
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangePicker;
