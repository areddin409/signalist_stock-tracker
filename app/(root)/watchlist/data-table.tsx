'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className='space-y-4'>
      {/* Search Filter */}
      <div className='flex items-center gap-2 justify-between w-full'>
        <div className='flex items-center gap-2 min-w-md'>
          <Search className='h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search by symbol or company name...'
            value={
              (table.getColumn('company')?.getFilterValue() as string) ?? ''
            }
            onChange={event =>
              table.getColumn('company')?.setFilterValue(event.target.value)
            }
            className='bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-yellow-500'
          />
        </div>
      </div>

      {/* Table */}
      <div className='rounded-md border border-gray-700'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className='border-b border-gray-700 hover:bg-transparent'
              >
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className='text-gray-400'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='border-b border-gray-700 hover:bg-gray-700/50 transition-colors'
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className='py-4'>
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
                  className='h-24 text-center text-gray-400'
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Info */}
      <div className='flex items-center justify-between text-sm text-gray-400'>
        <div>
          Showing {table.getFilteredRowModel().rows.length} of {data.length}{' '}
          stocks
        </div>
        <div>{table.getFilteredRowModel().rows.length} stocks in watchlist</div>
      </div>
    </div>
  );
}
