'use client';
import { useEffect, useRef } from 'react';

/**
 * A custom React hook that initializes and manages a TradingView widget in a container element.
 *
 * @param scriptUrl - The URL of the TradingView widget script to load
 * @param config - Configuration object for the TradingView widget. Contains widget-specific settings
 * @param height - The height of the widget container in pixels (defaults to 600)
 *
 * @returns React.RefObject<HTMLDivElement> - A ref object pointing to the container div element
 *
 * @example
 * ```tsx
 * const widgetConfig = {
 *   symbol: "NASDAQ:AAPL",
 *   interval: "D",
 *   timezone: "Etc/UTC",
 *   theme: "light",
 *   style: "1",
 *   locale: "en"
 * };
 *
 * const containerRef = useTradingViewWidget(
 *   "text/javascript",
 *   widgetConfig,
 *   500
 * );
 * ```
 *
 * @remarks
 * - The hook manages the lifecycle of the TradingView widget, including creation and cleanup
 * - Uses a dataset flag to prevent multiple widget initializations
 * - Automatically cleans up the widget when the component unmounts
 * - The container div must be added to the DOM for the widget to render
 *
 * @throws Will not initialize if containerRef.current is null
 */
const useTradingViewWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height: number = 600
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset.loaded) return;
    containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="height: ${height}px; width: 100%;"></div>`;

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    containerRef.current.appendChild(script);
    containerRef.current.dataset.loaded = 'true';

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        delete containerRef.current.dataset.loaded;
      }
    };
  }, [scriptUrl, config, height]);

  return containerRef;
};

export default useTradingViewWidget;
