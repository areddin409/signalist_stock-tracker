'use server';

import { getDateRange, validateArticle, formatArticle } from '@/lib/utils';
import { POPULAR_STOCK_SYMBOLS } from '../constants';
import { cache } from 'react';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

/**
 * Generic fetch function with caching options for Finnhub API calls
 */
async function fetchJSON<T>(
  url: string,
  revalidateSeconds?: number
): Promise<T> {
  const options: RequestInit =
    revalidateSeconds !== undefined
      ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
      : { cache: 'no-store' };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches news articles for the given symbols or general market news.
 *
 * @param symbols - Optional array of stock symbols to fetch news for
 * @returns Promise resolving to an array of formatted news articles (max 6)
 */
export const getNews = async (
  symbols?: string[]
): Promise<MarketNewsArticle[]> => {
  try {
    const { from, to } = getDateRange(5);

    // If symbols are provided, fetch company-specific news
    if (symbols && symbols.length > 0) {
      const cleanedSymbols = symbols
        .map(s => s.trim().toUpperCase())
        .filter(Boolean);

      if (cleanedSymbols.length === 0) {
        return await fetchGeneralNews(from, to);
      }

      return await fetchSymbolNews(cleanedSymbols, from, to);
    }

    // Otherwise, fetch general market news
    return await fetchGeneralNews(from, to);
  } catch (error) {
    console.error('Error in getNews:', error);
    throw new Error('Failed to fetch news');
  }
};

/**
 * Fetches news for specific symbols using round-robin approach
 */
async function fetchSymbolNews(
  symbols: string[],
  from: string,
  to: string
): Promise<MarketNewsArticle[]> {
  const collectedArticles: MarketNewsArticle[] = [];
  const maxRounds = 6;

  const articlesBySymbol = new Map<string, RawNewsArticle[]>();
  const offsets = new Map<string, number>();

  for (let round = 0; round < maxRounds; round++) {
    const symbolIndex = round % symbols.length;
    const symbol = symbols[symbolIndex];

    try {
      if (!articlesBySymbol.has(symbol)) {
        const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
        const articles = await fetchJSON<RawNewsArticle[]>(url);
        articlesBySymbol.set(symbol, articles.filter(validateArticle));
      }

      const articles = articlesBySymbol.get(symbol)!;
      const offset = offsets.get(symbol) ?? 0;

      if (offset < articles.length) {
        const formatted = formatArticle(articles[offset], true, symbol, round);
        collectedArticles.push(formatted);
        offsets.set(symbol, offset + 1);
      }

      if (collectedArticles.length >= 6) {
        break;
      }
    } catch (error) {
      console.error(`Error fetching news for symbol ${symbol}:`, error);
      continue;
    }
  }

  // Sort by datetime (most recent first)
  return collectedArticles.sort((a, b) => b.datetime - a.datetime);
}

/**
 * Fetches general market news
 */
async function fetchGeneralNews(
  from: string,
  to: string
): Promise<MarketNewsArticle[]> {
  const url = `${FINNHUB_BASE_URL}/news?category=general&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
  const articles = await fetchJSON<RawNewsArticle[]>(url);

  // Deduplicate by id, url, and headline
  const seen = new Set<string>();
  const deduplicated: RawNewsArticle[] = [];

  for (const article of articles) {
    if (!validateArticle(article)) continue;

    const key = `${article.id}-${article.url}-${article.headline}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(article);
    }

    // Stop after collecting 6 unique articles
    if (deduplicated.length >= 6) {
      break;
    }
  }

  // Format the articles
  return deduplicated.map((article, index) =>
    formatArticle(article, false, undefined, index)
  );
}

/**
 * Searches for stocks using Finnhub API or returns popular stocks if no query provided.
 *
 * @param query - Optional search query string for stock symbol or company name
 * @returns Promise resolving to an array of stocks with watchlist status (max 15 results)
 */
export const searchStocks = cache(
  async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
      const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
      if (!token) {
        // If no token, log and return empty to avoid throwing per requirements
        console.error(
          'Error in stock search:',
          new Error('FINNHUB API key is not configured')
        );
        return [];
      }

      const trimmed = typeof query === 'string' ? query.trim() : '';

      let results: FinnhubSearchResult[] = [];

      if (!trimmed) {
        // Fetch top 10 popular symbols' profiles
        const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
        const profiles = await Promise.all(
          top.map(async sym => {
            try {
              const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
              // Revalidate every hour
              const profile = await fetchJSON<any>(url, 3600);
              return { sym, profile } as { sym: string; profile: any };
            } catch (e) {
              console.error('Error fetching profile2 for', sym, e);
              return { sym, profile: null } as { sym: string; profile: any };
            }
          })
        );

        results = profiles
          .map(({ sym, profile }) => {
            const symbol = sym.toUpperCase();
            const name: string | undefined =
              profile?.name || profile?.ticker || undefined;
            const exchange: string | undefined = profile?.exchange || undefined;
            if (!name) return undefined;
            const r: FinnhubSearchResult = {
              symbol,
              description: name,
              displaySymbol: symbol,
              type: 'Common Stock',
            };
            // We don't include exchange in FinnhubSearchResult type, so carry via mapping later using profile
            // To keep pipeline simple, attach exchange via closure map stage
            // We'll reconstruct exchange when mapping to final type
            (r as any).__exchange = exchange; // internal only
            return r;
          })
          .filter((x): x is FinnhubSearchResult => Boolean(x));
      } else {
        const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
        const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
        results = Array.isArray(data?.result) ? data.result : [];
      }

      const mapped: StockWithWatchlistStatus[] = results
        .map(r => {
          const upper = (r.symbol || '').toUpperCase();
          const name = r.description || upper;
          const exchangeFromDisplay =
            (r.displaySymbol as string | undefined) || undefined;
          const exchangeFromProfile = (r as any).__exchange as
            | string
            | undefined;
          const exchange = exchangeFromDisplay || exchangeFromProfile || 'US';
          const type = r.type || 'Stock';
          const item: StockWithWatchlistStatus = {
            symbol: upper,
            name,
            exchange,
            type,
            isInWatchlist: false,
          };
          return item;
        })
        .slice(0, 15);

      return mapped;
    } catch (err) {
      console.error('Error in stock search:', err);
      return [];
    }
  }
);
