'use server';

import { connectToDatabase } from '@/database/mongoose';
import Watchlist from '@/database/models/watchlist.model';

/**
 * Retrieves all watchlist symbols for a user by their email address.
 *
 * @param email - The user's email address
 * @returns Promise resolving to an array of stock symbols (strings)
 */
export const getWatchlistSymbolsByEmail = async (
  email: string
): Promise<string[]> => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      console.error('Database connection not established');
      return [];
    }

    // Find the user by email in the user collection (Better Auth)
    const user = await db
      .collection('user')
      .findOne<{ _id?: string; id?: string; email?: string }>({ email });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return [];
    }

    const userId = (user.id as string) || String(user._id || '');

    // Query the Watchlist by userId
    const watchlistItems = await Watchlist.find(
      { userId },
      { symbol: 1, _id: 0 }
    ).lean();

    return watchlistItems.map(item => item.symbol);
  } catch (error) {
    console.error('Error fetching watchlist symbols by email:', error);
    return [];
  }
};
