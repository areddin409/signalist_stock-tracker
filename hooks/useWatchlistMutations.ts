'use client';

import { useState } from 'react';
import {
  addStockToWatchlist,
  removeStockFromWatchlist,
} from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';

/**
 * Client-side hook for watchlist mutations
 * Handles add/remove operations with loading states and notifications
 */
export function useWatchlistMutations(userEmail: string) {
  const [loading, setLoading] = useState(false);

  const addStock = async (symbol: string, company: string) => {
    if (!userEmail) {
      toast.error('You must be logged in to manage your watchlist');
      return { success: false };
    }

    setLoading(true);
    try {
      const result = await addStockToWatchlist(userEmail, symbol, company);
      if (result.success) {
        toast.success(result.message || 'Added to watchlist');
      } else {
        toast.error(result.message || 'Failed to add to watchlist');
      }
      return result;
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
      toast.error('An error occurred. Please try again.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const removeStock = async (symbol: string) => {
    if (!userEmail) {
      toast.error('You must be logged in to manage your watchlist');
      return { success: false };
    }

    setLoading(true);
    try {
      const result = await removeStockFromWatchlist(userEmail, symbol);
      if (result.success) {
        toast.success(result.message || 'Removed from watchlist');
      } else {
        toast.error(result.message || 'Failed to remove from watchlist');
      }
      return result;
    } catch (error) {
      console.error('Error removing stock from watchlist:', error);
      toast.error('An error occurred. Please try again.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const toggleStock = async (
    symbol: string,
    company: string,
    isCurrentlyInWatchlist: boolean
  ) => {
    if (isCurrentlyInWatchlist) {
      return await removeStock(symbol);
    } else {
      return await addStock(symbol, company);
    }
  };

  return {
    addStock,
    removeStock,
    toggleStock,
    loading,
  };
}
