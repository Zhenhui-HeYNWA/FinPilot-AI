'use client';

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import { DataTableViewOptions } from './data-table-view-options';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Input } from '../ui/input';

import { ArrowBigLeft, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { categoryOptions, recordTypeOptions } from '@/types/recordType';
import { DataTableDateRangeFilter } from './data-table-date-filter';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // ✅ 自定义全局过滤函数
  const globalFilterFn = (row: any, _columnId: string, filterValue: string) => {
    const search = filterValue.toLowerCase();
    const { category, recordType, amount } = row.original;

    return (
      category?.toLowerCase().includes(search) ||
      recordType?.toLowerCase().includes(search) ||
      String(amount)?.includes(search)
    );
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div>
      <div className=' flex flex-col  py-4 gap-2'>
        <Input
          placeholder='Search...'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='max-w-xl'
        />
        <div className=' sm:flex gap-4 grid grid-cols-1'>
          {table.getColumn('category') && (
            <DataTableFacetedFilter
              column={table.getColumn('category')}
              title='Category'
              options={categoryOptions}
            />
          )}
          {table.getColumn('recordType') && (
            <DataTableFacetedFilter
              column={table.getColumn('recordType')}
              title='Type'
              options={recordTypeOptions}
            />
          )}
          {table.getColumn('date') && (
            <DataTableDateRangeFilter
              column={table.getColumn('date')}
              title='Date'
              data={table
                .getPreFilteredRowModel()
                .rows.map((row) => row.original)} // 使用未过滤的全部数据
              dateAccessor={(item) => item.date}
            />
          )}

          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => table.resetColumnFilters()}
              className='h-8 px-2 lg:px-3 bg-red-700 text-white'>
              Reset
            </Button>
          )}
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader className=''>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className=''>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='capitalize '>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className='flex items-center justify-center cursor-pointer'>
          <ArrowLeft className=' h-4 w-4' />
        </Button>
        <span className='mx-2 w-24 text-center'>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className='flex items-center justify-center cursor-pointer'>
          <ArrowRight className=' h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
