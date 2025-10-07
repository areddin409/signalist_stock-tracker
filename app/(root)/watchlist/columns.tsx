'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SYMBOL_INFO_WIDGET_CONFIG } from '@/lib/constants';
import TradingViewWidget from '@/components/TradingViewWidget';
import { WatchlistStockData } from '@/lib/actions/finnhub.actions';

// Utility function to format numbers
const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === 0 || isNaN(value)) return 'N/A';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Utility function to format currency
const formatCurrency = (value: number): string => {
  if (value === 0 || isNaN(value)) return 'N/A';

  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

// Utility function to format percentage
const formatPercentage = (value: number): string => {
  if (value === 0 || isNaN(value)) return 'N/A';
  return `${value.toFixed(2)}%`;
};

// Utility component for percentage with color
const PercentageCell = ({ value }: { value: number }) => {
  if (value === 0 || isNaN(value))
    return <span className='text-gray-400'>N/A</span>;

  const isPositive = value > 0;
  const color = isPositive ? 'text-green-400' : 'text-red-400';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={`flex items-center gap-1 ${color}`}>
      <Icon className='h-3 w-3' />
      <span>{formatPercentage(value)}</span>
    </div>
  );
};

export const columns: ColumnDef<WatchlistStockData>[] = [
  {
    accessorKey: 'company',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent'
        >
          Company
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
      const symbol = row.original.symbol;

      return (
        <div className='flex items-center gap-3'>
          <div className='min-w-0 flex-1'>
            <Link
              href={`/stocks/${symbol}`}
              className='hover:text-blue-400 transition-colors'
            >
              <div className='font-medium text-white'>{symbol}</div>
              <div className='text-sm text-gray-400 truncate'>
                {row.original.company}
              </div>
            </Link>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // Custom filter function that searches both symbol and company name
      const symbol = row.original.symbol.toLowerCase();
      const company = row.original.company.toLowerCase();
      const searchValue = value.toLowerCase();

      return symbol.includes(searchValue) || company.includes(searchValue);
    },
  },
  {
    accessorKey: 'marketCap',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent'
        >
          Market Cap
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className='text-white'>
        {formatCurrency(row.getValue('marketCap'))}
      </span>
    ),
  },
  {
    accessorKey: 'pe',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent'
        >
          P/E Ratio
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className='text-white'>{formatNumber(row.getValue('pe'))}</span>
    ),
  },
  {
    accessorKey: 'eps',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent'
        >
          EPS (TTM)
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className='text-white'>{formatNumber(row.getValue('eps'))}</span>
    ),
  },
  {
    accessorKey: 'beta',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent'
        >
          Beta
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className='text-white'>{formatNumber(row.getValue('beta'))}</span>
    ),
  },
  {
    accessorKey: 'ytdReturn',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent'
        >
          YTD Return
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <PercentageCell value={row.getValue('ytdReturn')} />,
  },
  {
    accessorKey: 'weekReturn52',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent'
        >
          52W Return
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <PercentageCell value={row.getValue('weekReturn52')} />,
  },
  {
    accessorKey: 'revenueGrowth',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium text-gray-400 hover:text-gray-200 hover:bg-transparent'
        >
          Revenue Growth
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <PercentageCell value={row.getValue('revenueGrowth')} />,
  },
  {
    id: 'actions',
    header: () => <span className='text-gray-400 font-medium'>Alert</span>,
    cell: ({ row }) => {
      return (
        <div className='text-center'>
          <Button
            size='sm'
            className='bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium'
          >
            Add Alert
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
