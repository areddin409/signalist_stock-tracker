'use client';
import useTradingViewWidget from '@/hooks/useTradingViewWidget';
import { MARKET_OVERVIEW_WIDGET_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

function TradingViewWidget({
  title,
  scriptUrl,
  config,
  height,
  className,
  size = 'large',
}: TradingViewWidgetProps) {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);

  // Define size-based styles
  const sizeStyles = {
    small: {
      titleClass: 'font-medium text-sm text-gray-100 mb-2',
      height: height || 200,
    },
    medium: {
      titleClass: 'font-semibold text-lg text-gray-100 mb-3',
      height: height || 400,
    },
    large: {
      titleClass: 'font-semibold text-2xl text-gray-100 mb-5',
      height: height || 600,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div className='w-full'>
      {title && <h3 className={currentSize.titleClass}>{title}</h3>}
      <div
        className={cn('tradingview-widget-container', className)}
        ref={containerRef}
        style={{ height: '100%', width: '100%' }}
      >
        <div
          className='tradingview-widget-container__widget'
          style={{ height: currentSize.height, width: '100%' }}
        />
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
