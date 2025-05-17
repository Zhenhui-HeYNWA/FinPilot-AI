'use client';

import { ColumnDef, FilterFn } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Settings, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RecordCategory } from '@/types/recordType';

export type Record = {
  userId: string;
  recordType: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
};

const recordTypeOptions = [
  {
    label: 'Expense',
    value: 'expense',
    icon: undefined, // 或者你可以添加自定义图标
  },
  {
    label: 'Income',
    value: 'income',
    icon: undefined,
  },
];

const dateRangeFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue || !filterValue.from || !filterValue.to) return true;

  const rowDate = new Date(row.getValue(columnId));
  const from = new Date(filterValue.from);
  const to = new Date(filterValue.to);

  return rowDate >= from && rowDate <= to;
};

export const columns: ColumnDef<Record>[] = [
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Category
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const recordType = row.original.recordType as keyof typeof RecordCategory;
      const category = row.getValue('category') as string;

      const categoryOption = RecordCategory[recordType]?.find(
        (option) => option.value === category
      );

      if (!categoryOption)
        return <span className='capitalize'>{category}</span>;

      const Icon = categoryOption.icon;

      return (
        <div className='flex items-center space-x-2 capitalize'>
          <Icon className='h-4 w-4 text-muted-foreground' />
          <span>{categoryOption.label}</span>
        </div>
      );
    },
    filterFn: 'includesString',
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return <span className='text-xs'>{formattedDate}</span>;
    },
    filterFn: dateRangeFilterFn, // 这里加上过滤函数
  },
  {
    accessorKey: 'recordType',
    header: 'Type',
    filterFn: 'includesString',

    cell: ({ row }) => {
      const recordType = row.getValue(
        'recordType'
      ) as keyof typeof RecordCategory;
      return (
        <div
          className={`w-20  border rounded-2xl py-1  px-4 flex justify-center items-center ${recordType === 'expense' && 'bg-gray-200'} `}>
          <span
            className={`capitalize 
    ${recordType === 'expense' ? 'text-[#ae1919] ' : 'text-[#2aae19]'}`}>
            {recordType}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    filterFn: 'includesString',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Amount
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const recordType = row.original.recordType as keyof typeof RecordCategory;

      const amount = row.getValue('amount') as number;
      return (
        <span
          className={`${recordType === 'expense' ? 'text-[#ae1919]' : 'text-[#2aae19]'}`}>
          {recordType === 'expense' ? '-' : '+'}
          {amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const record = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='cursor-pointer'>
              <Settings />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer'>
              <Trash2 />
              Delete
            </DropdownMenuItem>

            {/* TODO:add the export record  */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
