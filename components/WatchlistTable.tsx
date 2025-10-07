import Link from 'next/link';

interface WatchlistTableProps {
  watchlistSymbols: string[];
  watchlistCount: number;
}

export default function WatchlistTable({
  watchlistSymbols,
  watchlistCount,
}: WatchlistTableProps) {
  return (
    <div className='lg:col-span-3'>
      <div className='bg-gray-800 rounded-lg p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold text-gray-100'>Watchlist</h1>
          <button className='bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-medium'>
            Add Stock
          </button>
        </div>

        {watchlistCount > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-700'>
                  <th className='text-left py-3 px-2 text-gray-400 font-medium'>
                    Company
                  </th>
                  <th className='text-left py-3 px-2 text-gray-400 font-medium'>
                    Symbol
                  </th>
                  <th className='text-left py-3 px-2 text-gray-400 font-medium'>
                    Price
                  </th>
                  <th className='text-left py-3 px-2 text-gray-400 font-medium'>
                    Change
                  </th>
                  <th className='text-left py-3 px-2 text-gray-400 font-medium'>
                    Market Cap
                  </th>
                  <th className='text-left py-3 px-2 text-gray-400 font-medium'>
                    P/E Ratio
                  </th>
                  <th className='text-center py-3 px-2 text-gray-400 font-medium'>
                    Alert
                  </th>
                </tr>
              </thead>
              <tbody>
                {watchlistSymbols.map((symbol, index) => (
                  <tr
                    key={symbol}
                    className='border-b border-gray-700 hover:bg-gray-700/50 transition-colors'
                  >
                    <td className='py-4 px-2'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-gray-600 rounded flex items-center justify-center'>
                          <span className='text-xs font-bold text-gray-300'>
                            {symbol.charAt(0)}
                          </span>
                        </div>
                        <Link
                          href={`/stocks/${symbol}`}
                          className='text-gray-100 hover:text-yellow-500 font-medium'
                        >
                          {symbol} Inc
                        </Link>
                      </div>
                    </td>
                    <td className='py-4 px-2 text-gray-300 font-medium'>
                      {symbol}
                    </td>
                    <td className='py-4 px-2 text-gray-100 font-medium'>
                      $0.00
                    </td>
                    <td className='py-4 px-2'>
                      <span
                        className={`${index % 2 === 0 ? 'text-green-400' : 'text-red-400'} font-medium`}
                      >
                        {index % 2 === 0 ? '+1.64%' : '-0.54%'}
                      </span>
                    </td>
                    <td className='py-4 px-2 text-gray-300'>$0.00T</td>
                    <td className='py-4 px-2 text-gray-300'>0.0</td>
                    <td className='py-4 px-2 text-center'>
                      <button className='bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded text-sm font-medium'>
                        Add Alert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-lg mb-4'>
              Your watchlist is empty
            </div>
            <div className='text-gray-500 mb-6'>
              Add stocks to track their performance
            </div>
            <button className='bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-medium'>
              Browse Stocks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
