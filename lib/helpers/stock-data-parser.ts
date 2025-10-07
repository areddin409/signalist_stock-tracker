/**
 * Stock Data Parser Helper
 *
 * This helper file demonstrates how to parse and use the stock metrics data
 * from Finnhub API in your watchlist data table.
 */

import {
  parseStockMetrics,
  formatStockCurrency,
  formatStockPercentage,
  formatStockNumber,
} from '@/lib/utils';

/**
 * Example of how to format the parsed data for display
 */
export function formatParsedDataForDisplay(stockData: WatchlistStockData) {
  return {
    symbol: stockData.symbol,
    company: stockData.company,

    // Formatted financial metrics
    marketCapFormatted: formatStockCurrency(stockData.marketCap),
    peFormatted: formatStockNumber(stockData.pe),
    epsFormatted: formatStockNumber(stockData.eps),
    betaFormatted: formatStockNumber(stockData.beta),

    // Formatted percentage returns
    ytdReturnFormatted: formatStockPercentage(stockData.ytdReturn),
    weekReturn52Formatted: formatStockPercentage(stockData.weekReturn52),
    revenueGrowthFormatted: formatStockPercentage(stockData.revenueGrowth),
    roeFormatted: formatStockPercentage(stockData.roe),

    // Performance indicators
    isPositiveYTD: stockData.ytdReturn > 0,
    isPositive52Week: stockData.weekReturn52 > 0,
    isGrowthStock: stockData.revenueGrowth > 20, // Define growth as >20% revenue growth
    isProfitable: stockData.roe > 0,
  };
}

/**
 * Example of how to sort stocks by different metrics
 */
export function sortStocksByMetric(
  stocks: WatchlistStockData[],
  metric: keyof WatchlistStockData,
  direction: 'asc' | 'desc' = 'desc'
): WatchlistStockData[] {
  return [...stocks].sort((a, b) => {
    const valueA = a[metric] as number;
    const valueB = b[metric] as number;

    // Handle NaN or invalid values
    if (!Number.isFinite(valueA) && !Number.isFinite(valueB)) return 0;
    if (!Number.isFinite(valueA)) return 1;
    if (!Number.isFinite(valueB)) return -1;

    return direction === 'desc' ? valueB - valueA : valueA - valueB;
  });
}

/**
 * Example of filtering stocks based on criteria
 */
export function filterStocks(
  stocks: WatchlistStockData[],
  filters: {
    minMarketCap?: number;
    maxPE?: number;
    minRevenueGrowth?: number;
    minROE?: number;
  }
) {
  return stocks.filter(stock => {
    // Market cap filter
    if (filters.minMarketCap && stock.marketCap < filters.minMarketCap) {
      return false;
    }

    // P/E ratio filter
    if (filters.maxPE && stock.pe > filters.maxPE) {
      return false;
    }

    // Revenue growth filter
    if (
      filters.minRevenueGrowth &&
      stock.revenueGrowth < filters.minRevenueGrowth
    ) {
      return false;
    }

    // ROE filter
    if (filters.minROE && stock.roe < filters.minROE) {
      return false;
    }

    return true;
  });
}

/**
 * Get performance summary for a stock
 */
export function getStockPerformanceSummary(stock: WatchlistStockData) {
  const summary = {
    symbol: stock.symbol,
    company: stock.company,

    // Valuation category
    valuation: (() => {
      if (stock.pe < 15) return 'Undervalued';
      if (stock.pe > 30) return 'Expensive';
      return 'Fair Value';
    })(),

    // Growth category
    growth: (() => {
      if (stock.revenueGrowth > 25) return 'High Growth';
      if (stock.revenueGrowth > 10) return 'Moderate Growth';
      if (stock.revenueGrowth > 0) return 'Low Growth';
      return 'Declining';
    })(),

    // Risk category based on beta
    risk: (() => {
      if (stock.beta > 1.5) return 'High Risk';
      if (stock.beta > 1) return 'Market Risk';
      if (stock.beta > 0.5) return 'Low Risk';
      return 'Very Low Risk';
    })(),

    // Profitability
    profitability: (() => {
      if (stock.roe > 20) return 'Excellent';
      if (stock.roe > 15) return 'Good';
      if (stock.roe > 10) return 'Average';
      if (stock.roe > 0) return 'Below Average';
      return 'Unprofitable';
    })(),
  };

  return summary;
}

/**
 * Parse NVDA-like stock data (example based on your provided data)
 */
export function parseExampleStockData(
  symbol: string,
  rawMetrics: any
): WatchlistStockData {
  const parsedData = parseStockMetrics(rawMetrics);

  return {
    symbol,
    company: `${symbol} Corporation`, // Fallback company name
    ...parsedData,
    rawMetrics: rawMetrics as any, // Type assertion for raw metrics
  };
}

/**
 * Example usage with NVDA data structure
 */
export function demonstrateNvidiaDataParsing() {
  // Sample NVDA metrics (from your provided data)
  const nvidiaRawMetrics = {
    '52WeekHigh': 191.05,
    '52WeekLow': 86.62,
    '52WeekPriceReturnDaily': 51.0297,
    '5DayPriceReturnDaily': -0.5574,
    beta: 2.3058953,
    epsTTM: 3.5135,
    marketCapitalization: 4550539.5,
    netProfitMarginTTM: 52.41,
    peTTM: 52.5485,
    revenueGrowthTTMYoy: 71.55,
    roeTTM: 105.22,
    yearToDatePriceReturnDaily: 38.1637,
    grossMarginTTM: 70.2,
    psTTM: 27.5426,
    pb: 45.4459,
  };

  const parsedStock = parseExampleStockData('NVDA', nvidiaRawMetrics);
  const formattedData = formatParsedDataForDisplay(parsedStock);
  const summary = getStockPerformanceSummary(parsedStock);

  return {
    parsed: parsedStock,
    formatted: formattedData,
    summary,
  };
}
