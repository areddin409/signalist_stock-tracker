'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { formatMarketCapValue } from '../utils';
import { getWatchlistStocks } from './finnhub.actions';

/**
 * Helper function to get database connection
 */
async function getDbConnection() {
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection not found');
  return db;
}

/**
 * Helper function to get userId from email
 */
async function getUserIdByEmail(email: string): Promise<string | null> {
  const db = await getDbConnection();
  const user = await db
    .collection('user')
    .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

  if (!user) return null;

  const userId = (user.id as string) || String(user._id || '');
  return userId || null;
}

/**
 * Retrieves all watchlist symbols for a user by their email address.
 *
 * @param email - The user's email address
 * @returns Promise resolving to an array of stock symbols (strings)
 */
export async function getWatchlistSymbolsByEmail(
  email: string
): Promise<string[]> {
  if (!email) return [];

  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map(i => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

/**
 * Adds a stock to a user's watchlist.
 *
 * @param email - The user's email address
 * @param symbol - The stock symbol to add
 * @param company - The company name
 * @returns Promise resolving to an object with success status and optional message
 */
export async function addStockToWatchlist(
  email: string,
  symbol: string,
  company: string
): Promise<{ success: boolean; message?: string }> {
  if (!email || !symbol || !company) {
    return {
      success: false,
      message: 'Missing required fields: email, symbol, or company',
    };
  }

  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const normalizedSymbol = symbol.toUpperCase().trim();

    const existingItem = await Watchlist.findOne({
      userId,
      symbol: normalizedSymbol,
    });

    if (existingItem) {
      return {
        success: false,
        message: 'Stock already exists in watchlist',
      };
    }

    await Watchlist.create({
      userId,
      symbol: normalizedSymbol,
      company: company.trim(),
      addedAt: new Date(),
    });

    return {
      success: true,
      message: 'Stock added to watchlist successfully',
    };
  } catch (err) {
    console.error('addStockToWatchlist error:', err);
    return {
      success: false,
      message: 'Failed to add stock to watchlist',
    };
  }
}

/**
 * Removes a stock from a user's watchlist.
 *
 * @param email - The user's email address
 * @param symbol - The stock symbol to remove
 * @returns Promise resolving to an object with success status and optional message
 */
export async function removeStockFromWatchlist(
  email: string,
  symbol: string
): Promise<{ success: boolean; message?: string }> {
  if (!email || !symbol) {
    return {
      success: false,
      message: 'Missing required fields: email or symbol',
    };
  }

  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const normalizedSymbol = symbol.toUpperCase().trim();

    const result = await Watchlist.deleteOne({
      userId,
      symbol: normalizedSymbol,
    });

    if (result.deletedCount === 0) {
      return {
        success: false,
        message: 'Stock not found in watchlist',
      };
    }

    return {
      success: true,
      message: 'Stock removed from watchlist successfully',
    };
  } catch (err) {
    console.error('removeStockFromWatchlist error:', err);
    return {
      success: false,
      message: 'Failed to remove stock from watchlist',
    };
  }
}

/**
 * Get user's watchlist symbols and utility functions
 */
export async function getUserWatchlist(userEmail: string) {
  const watchlistSymbols = await getWatchlistSymbolsByEmail(userEmail);

  const isInWatchlist = (symbol: string) => {
    return watchlistSymbols.includes(symbol.toUpperCase());
  };

  return {
    watchlistSymbols,
    isInWatchlist,
    watchlistCount: watchlistSymbols.length,
  };
}

/**
 * Get user with watchlist data combined
 */
export async function getUserWithWatchlist(userEmail: string) {
  const watchlistData = await getUserWatchlist(userEmail);

  return {
    email: userEmail,
    ...watchlistData,
  };
}

export async function getWatchlistTableData(symbols: string[]) {
  // Placeholder function to simulate fetching table data
  // In a real application, this would fetch data from an API or database
  const data = symbols.map(symbol => ({
    symbol,
    company: `Company ${symbol}`,
    price: Math.random() * 1000, // Random price for demo purposes
    change: (Math.random() - 0.5) * 10, // Random change for demo purposes
    changePercent: (Math.random() - 0.5) * 2, // Random % change
    marketCap: formatMarketCapValue(Math.random() * 1e12), // Random market cap
    peRatio: Math.random() * 30, // Random P/E ratio
  }));

  const stocks = await getWatchlistStocks(symbols);
  console.log(`🚀 ~ getWatchlistTableData ~ stocks:`, stocks);
  return { data };
}
