import { getCurrentUser } from '@/lib/actions/user.actions';
import { getUserWatchlist } from '@/lib/actions/watchlist.actions';
import WatchlistTable from '@/components/WatchlistTable';
import WatchlistAlertWidget from '@/components/WatchlistAlertWidget';
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function WatchlistPage() {
  const user = await getCurrentUser();
  const { watchlistSymbols, watchlistCount } = await getUserWatchlist(
    user.email
  );

  const testData = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150.12,
      company: 'Apple Inc.',
      change: 2.5,
      changePercent: 1.67,
      marketCap: '2.5T',
      peRatio: 25.4,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 2800.45,
      company: 'Alphabet Inc.',
      change: -1.2,
      changePercent: -0.04,
      marketCap: '1.8T',
      peRatio: 28.1,
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 3400.67,
      company: 'Amazon.com Inc.',
      change: 5.8,
      changePercent: 0.17,
      marketCap: '1.7T',
      peRatio: 60.5,
    },
  ];

  return (
    <div>
      {/* left side watchlist table */}
      <div className=''>
        <DataTable columns={columns} data={testData} />
      </div>
      {/* right side alerts widget */}
      <div></div>
    </div>
  );
}
