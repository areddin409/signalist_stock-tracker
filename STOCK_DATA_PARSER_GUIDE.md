# Stock Data Parser for Watchlist

This guide explains how to parse and display stock metrics data from Finnhub API in your watchlist data table.

## Overview

The stock data parser takes the raw metrics from Finnhub's `/stock/metric` endpoint and transforms it into a structured format suitable for display in your data table.

## Key Components

### 1. Data Types

**Input:** Raw stock metrics from Finnhub API

```javascript
{
  "metric": {
    "52WeekHigh": 191.05,
    "52WeekLow": 86.62,
    "52WeekPriceReturnDaily": 51.0297,
    "5DayPriceReturnDaily": -0.5574,
    "beta": 2.3058953,
    "epsTTM": 3.5135,
    "marketCapitalization": 4550539.5,
    "netProfitMarginTTM": 52.41,
    "peTTM": 52.5485,
    "revenueGrowthTTMYoy": 71.55,
    "roeTTM": 105.22,
    "yearToDatePriceReturnDaily": 38.1637,
    // ... many more metrics
  },
  "symbol": "NVDA"
}
```

**Output:** Structured `WatchlistStockData`

```typescript
{
  symbol: string;
  company: string;
  marketCap: number;
  pe: number;
  eps: number;
  weekHigh52: number;
  weekLow52: number;
  beta: number;
  grossMargin: number;
  netMargin: number;
  roe: number;
  revenueGrowth: number;
  ytdReturn: number;
  weekReturn5Day: number;
  weekReturn52: number;
  priceToSales: number;
  priceToBook: number;
  rawMetrics: object; // Original metrics for advanced use
}
```

### 2. Data Parsing Function

The `getWatchlistTableData(symbols: string[])` function in `lib/actions/finnhub.actions.ts`:

1. **Fetches data** for each symbol from Finnhub API
2. **Parses metrics** using the `parseStockMetrics` utility
3. **Gets company names** from the profile endpoint
4. **Returns structured data** ready for the data table

### 3. Data Table Columns

The updated columns in `app/(root)/watchlist/columns.tsx` include:

- **Company** - Symbol and company name with link to stock details
- **Market Cap** - Formatted market capitalization ($4.55T, $900B, etc.)
- **P/E Ratio** - Price-to-earnings ratio
- **EPS (TTM)** - Earnings per share (trailing twelve months)
- **Beta** - Volatility measure
- **YTD Return** - Year-to-date return percentage with color coding
- **52W Return** - 52-week return percentage with color coding
- **Revenue Growth** - Revenue growth percentage with color coding
- **Alert** - Button to add price alerts

### 4. Formatting Utilities

Located in `lib/utils.ts`:

- `formatStockCurrency(value)` - Formats large numbers as $4.55T, $900B, etc.
- `formatStockPercentage(value)` - Formats percentages with proper decimals
- `formatStockNumber(value)` - Formats regular numbers with commas
- `parseStockMetrics(metrics)` - Safely parses raw metrics with fallbacks

## Usage Examples

### Basic Usage

```typescript
// In your React component
import { getWatchlistTableData } from '@/lib/actions/finnhub.actions';

const symbols = ['NVDA', 'AAPL', 'MSFT'];
const { data } = await getWatchlistTableData(symbols);

// data is now an array of WatchlistStockData objects
console.log(data[0]);
// {
//   symbol: 'NVDA',
//   company: 'NVIDIA Corporation',
//   marketCap: 4550539.5,
//   pe: 52.5485,
//   eps: 3.5135,
//   ytdReturn: 38.1637,
//   // ... other metrics
// }
```

### Using Helper Functions

```typescript
import {
  formatParsedDataForDisplay,
  getStockPerformanceSummary,
  sortStocksByMetric,
  filterStocks,
} from '@/lib/helpers/stock-data-parser';

// Format data for display
const formatted = formatParsedDataForDisplay(stockData);
console.log(formatted.marketCapFormatted); // "$4.55T"
console.log(formatted.ytdReturnFormatted); // "38.16%"

// Get performance summary
const summary = getStockPerformanceSummary(stockData);
console.log(summary.growth); // "High Growth"
console.log(summary.valuation); // "Expensive"

// Sort stocks by market cap (descending)
const sortedStocks = sortStocksByMetric(stocks, 'marketCap', 'desc');

// Filter high-growth stocks
const growthStocks = filterStocks(stocks, {
  minRevenueGrowth: 20,
  minROE: 15,
});
```

## Error Handling

The parser includes robust error handling:

- **API failures** - Continues processing other symbols
- **Missing data** - Uses safe defaults (0 for numbers, 'N/A' for display)
- **Invalid values** - Filters out NaN and infinite values
- **Type safety** - TypeScript ensures data structure consistency

## Performance Optimizations

- **Caching** - API responses are cached (5 minutes for metrics, 1 hour for profiles)
- **Parallel requests** - Company profiles fetched in parallel with metrics
- **Efficient parsing** - Single-pass parsing with fallback values
- **Minimal re-renders** - Memoized formatting functions

## Data Table Features

- **Sorting** - Click column headers to sort by any metric
- **Color coding** - Green/red indicators for positive/negative returns
- **Responsive** - Adapts to different screen sizes
- **Interactive** - Click company names to view detailed stock pages
- **Alerts** - Add price alerts directly from the table

## Next Steps

1. **Add more columns** - The raw metrics contain 50+ data points you can display
2. **Advanced filtering** - Add dropdown filters for sectors, market cap ranges, etc.
3. **Real-time updates** - Implement WebSocket connections for live data
4. **Charts** - Add mini-charts showing price trends
5. **Exports** - Allow CSV/Excel export of watchlist data

## NVDA Example Data

Based on your provided NVDA data, here's how it would be parsed:

```javascript
// Raw input (your data)
{
  "marketCapitalization": 4550539.5,
  "peTTM": 52.5485,
  "epsTTM": 3.5135,
  "52WeekHigh": 191.05,
  "52WeekLow": 86.62,
  "beta": 2.3058953,
  "yearToDatePriceReturnDaily": 38.1637,
  "52WeekPriceReturnDaily": 51.0297,
  "revenueGrowthTTMYoy": 71.55,
  "roeTTM": 105.22
}

// Parsed output
{
  symbol: "NVDA",
  company: "NVIDIA Corporation",
  marketCap: 4550539.5,     // $4.55T
  pe: 52.5485,              // 52.55
  eps: 3.5135,              // $3.51
  weekHigh52: 191.05,       // $191.05
  weekLow52: 86.62,         // $86.62
  beta: 2.31,               // 2.31 (High Risk)
  ytdReturn: 38.16,         // 38.16% (Positive)
  weekReturn52: 51.03,      // 51.03% (Positive)
  revenueGrowth: 71.55,     // 71.55% (High Growth)
  roe: 105.22              // 105.22% (Excellent)
}
```

This gives you a rich, sortable, and filterable watchlist experience with comprehensive financial metrics!
