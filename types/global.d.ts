declare global {
  type SignInFormData = {
    email: string;
    password: string;
  };

  type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
    country: string;
    investmentGoals: string;
    riskTolerance: string;
    preferredIndustry: string;
  };

  type CountrySelectProps = {
    name: string;
    label: string;
    control: Control;
    error?: FieldError;
    required?: boolean;
  };

  type FormInputProps = {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    register: UseFormRegister;
    error?: FieldError;
    validation?: RegisterOptions;
    disabled?: boolean;
    value?: string;
  };

  type Option = {
    value: string;
    label: string;
  };

  type SelectFieldProps = {
    name: string;
    label: string;
    placeholder: string;
    options: readonly Option[];
    control: Control;
    error?: FieldError;
    required?: boolean;
  };

  type FooterLinkProps = {
    text: string;
    linkText: string;
    href: string;
  };

  type SearchCommandProps = {
    renderAs?: 'button' | 'text';
    label?: string;
    initialStocks: StockWithWatchlistStatus[];
  };

  type WelcomeEmailData = {
    email: string;
    name: string;
    intro: string;
  };

  type User = {
    id: string;
    name: string;
    email: string;
    image: string | null | undefined;
  };

  type Stock = {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
  };

  type StockWithWatchlistStatus = Stock & {
    isInWatchlist: boolean;
  };

  type FinnhubSearchResult = {
    symbol: string;
    description: string;
    displaySymbol?: string;
    type: string;
  };

  type FinnhubSearchResponse = {
    count: number;
    result: FinnhubSearchResult[];
  };

  type StockDetailsPageProps = {
    params: Promise<{
      symbol: string;
    }>;
  };

  type WatchlistButtonProps = {
    symbol: string;
    company: string;
    isInWatchlist: boolean;
    showTrashIcon?: boolean;
    type?: 'button' | 'icon';
    onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
    userEmail?: string;
  };

  type QuoteData = {
    c?: number;
    dp?: number;
  };

  type ProfileData = {
    name?: string;
    marketCapitalization?: number;
  };

  type FinancialsData = {
    metric?: { [key: string]: number };
  };

  type SelectedStock = {
    symbol: string;
    company: string;
    currentPrice?: number;
  };

  type WatchlistTableProps = {
    watchlist: StockWithData[];
  };

  type StockWithData = {
    userId: string;
    symbol: string;
    company: string;
    addedAt: Date;
    currentPrice?: number;
    changePercent?: number;
    priceFormatted?: string;
    changeFormatted?: string;
    marketCap?: string;
    peRatio?: string;
  };

  type AlertsListProps = {
    alertData: Alert[] | undefined;
  };

  type MarketNewsArticle = {
    id: number;
    headline: string;
    summary: string;
    source: string;
    url: string;
    datetime: number;
    category: string;
    related: string;
    image?: string;
  };

  type WatchlistNewsProps = {
    news?: MarketNewsArticle[];
  };

  type SearchCommandProps = {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    renderAs?: 'button' | 'text';
    buttonLabel?: string;
    buttonVariant?: 'primary' | 'secondary';
    className?: string;
  };

  type AlertData = {
    symbol: string;
    company: string;
    alertName: string;
    alertType: 'upper' | 'lower';
    threshold: string;
  };

  type AlertModalProps = {
    alertId?: string;
    alertData?: AlertData;
    action?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
  };

  type RawNewsArticle = {
    id: number;
    headline?: string;
    summary?: string;
    source?: string;
    url?: string;
    datetime?: number;
    image?: string;
    category?: string;
    related?: string;
  };

  type Alert = {
    id: string;
    symbol: string;
    company: string;
    alertName: string;
    currentPrice: number;
    alertType: 'upper' | 'lower';
    threshold: number;
    changePercent?: number;
  };

  // Enhanced stock data types for watchlist
  type StockMetrics = {
    metric: {
      '52WeekHigh': number;
      '52WeekLow': number;
      '52WeekPriceReturnDaily': number;
      '5DayPriceReturnDaily': number;
      beta: number;
      currentRatioAnnual: number;
      currentRatioQuarterly: number;
      epsTTM: number;
      evRevenueTTM: number;
      grossMarginAnnual: number;
      grossMarginTTM: number;
      marketCapitalization: number;
      netMarginGrowth5Y: number;
      netProfitMarginAnnual: number;
      netProfitMarginTTM: number;
      pb: number;
      peAnnual: number;
      peTTM: number;
      psAnnual: number;
      psTTM: number;
      revenueGrowthTTMYoy: number;
      revenueGrowth5Y: number;
      roe5Y: number;
      roeTTM: number;
      yearToDatePriceReturnDaily: number;
      [key: string]: number;
    };
    metricType: string;
    series: {
      annual: Record<string, Array<{ period: string; v: number }>>;
      quarterly: Record<string, Array<{ period: string; v: number }>>;
    };
    symbol: string;
  };

  type WatchlistStockData = {
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
    rawMetrics: StockMetrics['metric'];
  };
}

export {};
