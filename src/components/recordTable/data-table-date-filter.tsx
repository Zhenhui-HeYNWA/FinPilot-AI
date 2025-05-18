'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Column } from '@tanstack/react-table';
import { CalendarSearch, X } from 'lucide-react';

interface DataTableDateRangeFilterProps<TData> {
  column?: Column<TData, unknown>;
  title?: string;
  data: TData[]; // 用于生成日期范围
  dateAccessor: (item: TData) => string; // 提取日期字段
}

export function DataTableDateRangeFilter<TData>({
  column,
  title = '日期范围',
  data,
  dateAccessor,
}: DataTableDateRangeFilterProps<TData>) {
  const allDates = data
    .map((item) => new Date(dateAccessor(item)))
    .filter((d) => !isNaN(d.getTime()));
  const timestamps = allDates.map((d) => d.getTime());
  const minDate = new Date(Math.min(...timestamps));
  const maxDate = new Date(Math.max(...timestamps));

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    const filterValue = column?.getFilterValue() as DateRange | undefined;
    setDateRange(filterValue);
  }, [column?.getFilterValue()]);

  const displayLabel =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, 'yyyy-MM-dd')} ~ ${format(dateRange.to, 'yyyy-MM-dd')}`
      : 'Date Range';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-8 border-dashed  justify-center text-center'>
          <CalendarSearch />
          {displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-auto p-0'>
        <Calendar
          mode='range'
          selected={dateRange}
          onSelect={(range) => {
            setDateRange(range);
            if (range?.from && range?.to) {
              column?.setFilterValue(range);
            } else {
              column?.setFilterValue(undefined);
            }
          }}
          fromDate={minDate}
          toDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  );
}
