import { getCurrentUser } from '@/lib/actions/user.actions';
import { getUserWatchlist } from '@/lib/actions/watchlist.actions';
import { DataTable } from './data-table';
import { columns } from './columns';
import { getWatchlistTableData } from '@/lib/actions/finnhub.actions';

export default async function WatchlistPage() {
  const user = await getCurrentUser();

  const { watchlistSymbols } = await getUserWatchlist(user.email);
  console.log(`🚀 ~ WatchlistPage ~ watchlistSymbols:`, watchlistSymbols);

  const { data } = await getWatchlistTableData(watchlistSymbols);

  if (!data) {
    return <div>Your watchlist is empty.</div>;
  }

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold mb-2'>My Watchlist</h1>
        <p className='text-xs text-muted-foreground'>
          Monitor your favorite stocks and stay updated with real-time data.
        </p>
      </div>
      <div className='w-full lg:w-4/5'>
        <DataTable columns={columns} data={data} />
      </div>
      {/* right side alerts widget */}
      <div className='w-1/5 hidden lg:block'>{/* <AlertsWidget /> */}</div>
    </div>
  );
}
