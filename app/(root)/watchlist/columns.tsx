'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type WatchlistStock = {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
};

export const columns: ColumnDef<WatchlistStock>[] = [
  {
    accessorKey: 'company',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent"
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const symbol = row.original.symbol;
      const company = row.getValue('company') as string;
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-gray-300">
              {symbol.charAt(0)}
            </span>
          </div>
          <Link
            href={`/stocks/${symbol}`}
            className="text-gray-100 hover:text-yellow-500 font-medium transition-colors"
          >
            {company}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent"
        >
          Symbol
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <span className="text-gray-300 font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const price = getValue() as number;
      return (
        <span className="text-gray-100 font-medium">
          ${price.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: 'changePercent',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent"
        >
          Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const changePercent = getValue() as number;
      const isPositive = changePercent >= 0;
      return (
        <span
          className={`font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </span>
      );
    },
  },
  {
    accessorKey: 'marketCap',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent"
        >
          Market Cap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <span className="text-gray-300">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'peRatio',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent"
        >
          P/E Ratio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const peRatio = getValue() as number;
      return <span className="text-gray-300">{peRatio.toFixed(1)}</span>;
    },
  },
  {
    id: 'actions',
    header: () => <span className="text-gray-400 font-medium">Alert</span>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <Button
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium"
          >
            Add Alert
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];