interface WatchlistAlertWidgetProps {
  watchlistSymbols: string[];
  watchlistCount: number;
}

export default function WatchlistAlertWidget({
  watchlistSymbols,
  watchlistCount,
}: WatchlistAlertWidgetProps) {
  return (
    <div className='lg:col-span-1'>
      <div className='bg-gray-800 rounded-lg p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-gray-100'>Alerts</h2>
          <button className='bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded text-sm font-medium'>
            Create Alert
          </button>
        </div>

        <div className='space-y-4'>
          {/* Sample alerts */}
          {watchlistSymbols.slice(0, 5).map((symbol, index) => (
            <div key={`alert-${symbol}`} className='bg-gray-700 rounded-lg p-4'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-8 h-8 bg-gray-600 rounded flex items-center justify-center'>
                  <span className='text-xs font-bold text-gray-300'>
                    {symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className='text-gray-100 font-medium'>{symbol}</div>
                  <div
                    className={`text-sm ${index % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {index % 2 === 0 ? '+1.4%' : '-2.5%'}
                  </div>
                </div>
              </div>
              <div className='text-sm text-gray-400'>
                Alert • ${(Math.random() * 1000 + 100).toFixed(2)}
              </div>
              <div className='text-xs text-gray-500 mt-1'>
                Price • ${(Math.random() * 500 + 50).toFixed(2)}
              </div>
              <div className='mt-2'>
                <span className='text-xs bg-yellow-500 text-gray-900 px-2 py-1 rounded'>
                  Give one day
                </span>
              </div>
            </div>
          ))}

          {watchlistCount === 0 && (
            <div className='text-center py-8'>
              <div className='text-gray-400 text-sm mb-2'>No alerts set</div>
              <div className='text-gray-500 text-xs'>
                Add stocks to create alerts
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
