'use client';
import { NAV_ITEMS } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import { SearchCommand } from './SearchCommand';
import { symbol } from 'better-auth';

const NavItems = ({
  initialStocks,
}: {
  initialStocks: StockWithWatchlistStatus[];
}) => {
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <ul className='flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium'>
      {NAV_ITEMS.map(({ href, label }) => {
        if (label === 'Search')
          return (
            <li key='search-trigger'>
              <SearchCommand
                renderAs='text'
                label='Search'
                initialStocks={initialStocks}
              />
            </li>
          );
        return (
          <li
            key={href}
            className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : ''}`}
          >
            <a href={href} className='nav-link'>
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
