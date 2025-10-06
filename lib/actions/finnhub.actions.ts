'use server';

import { getDateRange, validateArticle, formatArticle } from '@/lib/utils';

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
        articlesBySymbol.set(
          symbol,
          articles.filter(validateArticle)
        );
      }

      const articles = articlesBySymbol.get(symbol)!;
      const offset = offsets.get(symbol) ?? 0;

      if (offset < articles.length) {
        const formatted = formatArticle(
          articles[offset],
          true,
          symbol,
          round
        );
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
