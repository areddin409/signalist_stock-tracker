import { getCurrentUser } from '@/lib/actions/user.actions';
import {
  getUserWatchlist,
  getWatchlistTableData,
} from '@/lib/actions/watchlist.actions';
import TradingViewWidget from '@/components/TradingViewWidget';
import { SYMBOL_INFO_WIDGET_CONFIG } from '@/lib/constants';

export default async function WatchlistPage() {
  const user = await getCurrentUser();
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
  const { watchlistSymbols } = await getUserWatchlist(user.email);
  console.log(`🚀 ~ WatchlistPage ~ watchlistSymbols:`, watchlistSymbols);

  const { data } = await getWatchlistTableData(watchlistSymbols);
  console.log(`🚀 ~ WatchlistPage ~ data:`, data);

  if (!data) {
    return <div>Your watchlist is empty.</div>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6 lg:p-8 w-full'>
      {data.map(item => (
        <TradingViewWidget
          scriptUrl={`${scriptUrl}symbol-info.js`}
          config={SYMBOL_INFO_WIDGET_CONFIG(item.symbol)}
          height={100}
        />
      ))}

      {/* right side alerts widget */}
      <div></div>
    </div>
  );
}
