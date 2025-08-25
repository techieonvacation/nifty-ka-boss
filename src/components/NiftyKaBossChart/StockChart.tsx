"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  UTCTimestamp,
  createSeriesMarkers,
  Time,
} from "lightweight-charts";
import {
  fetchRkbData,
  convertRkbDataToChartData,
  abortAllRequests,
} from "@/lib/api/rkb";

// Enhanced TypeScript interfaces for better type safety
interface SeriesMarkersPlugin {
  setMarkers: (markers: unknown[]) => void;
}

interface StockChartProps {
  symbol?: string;
  exchange?: string;
  interval?: string;
  theme?: "light" | "dark";
  showVolume?: boolean;
  showIndicators?: boolean;
  showGrid?: boolean;
  showCrosshair?: boolean;
  height?: number;
  width?: number;
  className?: string;
  enableTwoScale?: boolean;
  showPlotline?: boolean;
  showDecisionSignals?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  // NEW INDICATORS: Add props for SL and New Base indicators
  showSLIndicators?: boolean;
  showNewBaseIndicators?: boolean;
  // DECISION CLICK HANDLER: Callback for when decision triangle markers are clicked
  onDecisionClick?: (decisionData: {
    decision: "BUY" | "SELL";
    datetime: string;
    price: number;
    time: UTCTimestamp;
  }) => void;
  // TECHNICAL INDICATORS: Add support and resistance values
  technicalIndicators?: {
    S1: number; // Support
    R1: number; // Resistance
    rkbSupport?: number; // RKB Support
    rkbResistance?: number; // RKB Resistance
  };
}

interface ChartData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  plotline?: number;
  trend?: string;
  decision?: string;
  // NEW INDICATORS: Add SL and New Base fields for chart indicators
  SL?: number; // Stop Loss value
  newBase?: string; // New Base indicator (YES/NO or empty string)
  // DATETIME FIX: Add original datetime fields to match ChartDataPoint interface
  originalDatetime?: string; // Raw datetime string from API (e.g., "2015-01-09 09:15")
  originalHighDate?: string; // Raw HighDate string from API (e.g., "Thu, 24 Jul 2025 11:15:00 GMT")
  originalLowDate?: string; // Raw LowDate string from API (e.g., "Thu, 24 Jul 2025 10:15:00 GMT")
  // IST TIME CONVERSION: Store original UTC time for reference
  originalUtcTime?: number; // Original UTC timestamp before IST conversion
}

interface IndicatorData {
  time: UTCTimestamp;
  value: number;
}

interface MACDData {
  macdLine: IndicatorData[];
  signalLine: IndicatorData[];
  histogram: IndicatorData[];
}

interface ChartState {
  isLoading: boolean;
  error: string | null;
  currentPrice: number | null;
  priceChange: number | null;
  priceChangePercent: number | null;
  currentTrend: string | null;
  currentDecision: string | null;
  lastUpdate: Date | null;
}

// OHLC hover data interface
interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}
interface DecisionMarker {
  time: number;
  position: "aboveBar" | "belowBar" | "inBar";
  color: string;
  shape:
    | "diamond"
    | "circle"
    | "square"
    | "arrowUp"
    | "arrowDown"
    | "arrowLeft"
    | "arrowRight";
  text: string;
  size: number;
}

// NEW INDICATORS: Interface for SL (Stop Loss) markers
interface SLMarker {
  time: number;
  position: "aboveBar" | "belowBar" | "inBar";
  color: string;
  shape:
    | "diamond"
    | "circle"
    | "square"
    | "arrowUp"
    | "arrowDown"
    | "arrowLeft"
    | "arrowRight";
  text: string;
  size: number;
}

// NEW INDICATORS: Interface for New Base markers
interface NewBaseMarker {
  time: number;
  position: "aboveBar" | "belowBar" | "inBar";
  color: string;
  shape:
    | "diamond"
    | "circle"
    | "square"
    | "arrowUp"
    | "arrowDown"
    | "arrowLeft"
    | "arrowRight";
  text: string;
  size: number;
}

export interface StockChartRef {
  chartRef: React.RefObject<HTMLDivElement>;
  chart: IChartApi | null;
  refresh: () => Promise<void>;
  getCurrentData: () => ChartData[];
  takeScreenshot: () => Promise<void>;
  resetZoom: () => void;
  setZoomLevel: (level: number) => void;
}

// REAL-TIME FIX: Performance optimization constants optimized for real-time trading data
const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 150, // Debounce delay for resize and theme changes
  REFRESH_INTERVAL: 30000, // REDUCED: 30 seconds auto-refresh for faster real-time data sync (was 60000)
  MAX_DATA_POINTS: 1000, // Maximum data points to render for performance
  ANIMATION_DURATION: 200, // Animation duration for smooth transitions
} as const;

// ============================================================================
// TRADINGVIEW-LIKE CHART STABILITY SYSTEM
// ============================================================================
//
// Advanced viewport preservation system that prevents ANY unwanted scrolling
// during chart operations, similar to TradingView's stability.
//
// Key Components:
// 1. Viewport lock system with multiple preservation layers
// 2. Immediate position restoration after any operation
// 3. Prevention of LightweightCharts auto-fitting behavior
// 4. TradingView-style smooth operation handling
//
// Result: Perfect chart stability - zero movement during any operation
// ============================================================================
interface ChartViewState {
  visibleRange: { from: Time; to: Time } | null; // Proper range interface for LightweightCharts
  scrollPosition: number;
  barSpacing: number;
  logicalRange: { from: number; to: number } | null; // Additional precision for logical range
  // TRADINGVIEW-LIKE: Additional viewport data for perfect restoration
  rightOffset: number;
  leftOffset: number;
  timeScaleWidth: number;
}

const preserveChartViewState = (
  chart: IChartApi | null
): ChartViewState | null => {
  if (!chart) return null;

  try {
    const timeScale = chart.timeScale();
    const visibleRange = timeScale.getVisibleRange();
    const logicalRange = timeScale.getVisibleLogicalRange();
    const scrollPosition = timeScale.scrollPosition();
    const options = timeScale.options();
    const barSpacing = options.barSpacing || 12;
    const rightOffset = options.rightOffset || 0;

    // TRADINGVIEW-LIKE: Capture comprehensive viewport state
    return {
      visibleRange,
      scrollPosition,
      barSpacing,
      logicalRange,
      rightOffset,
      leftOffset: 0, // LightweightCharts doesn't have leftOffset, but we track it
      timeScaleWidth: 0, // Will be calculated if needed
    };
  } catch (error) {
    console.warn("Error preserving chart view state:", error);
    return null;
  }
};

const restoreChartViewState = (
  chart: IChartApi | null,
  viewState: ChartViewState | null
): boolean => {
  if (!chart || !viewState) return false;

  try {
    const timeScale = chart.timeScale();

    // STABILITY: Enhanced restoration with multiple fallback methods
    // Method 1: Try to restore visible range (most precise)
    if (viewState.visibleRange) {
      try {
        timeScale.setVisibleRange(viewState.visibleRange);
        // STABILITY: Force immediate update to prevent any scrolling
        timeScale.scrollToPosition(viewState.scrollPosition || 0, false);
        return true; // Success, no need for fallback methods
      } catch (error) {
        console.warn("Method 1 failed, trying logical range:", error);
      }
    }

    // Method 2: Fallback to logical range if visible range fails
    if (viewState.logicalRange) {
      try {
        timeScale.setVisibleLogicalRange(viewState.logicalRange);
        // STABILITY: Force immediate scroll position
        timeScale.scrollToPosition(viewState.scrollPosition || 0, false);
        return true; // Success, no need for scroll position restore
      } catch (error) {
        console.warn("Method 2 failed, trying scroll position:", error);
      }
    }

    // Method 3: Final fallback to scroll position
    if (viewState.scrollPosition !== undefined) {
      try {
        timeScale.scrollToPosition(viewState.scrollPosition, false);
        return true; // Success with scroll position
      } catch (error) {
        console.warn(
          "Method 3 failed, view state restoration incomplete:",
          error
        );
      }
    }
  } catch (error) {
    console.warn("Error restoring chart view state:", error);
  }

  return false; // All methods failed
};

// ENHANCED: Professional color scheme with beautiful gradients and improved contrast
const THEME_COLORS = {
  dark: {
    background: "#0a0b1a", // Deeper, more professional dark background
    text: "#f8fafc",
    grid: "#1e293b", // Subtle grid lines
    crosshair: "#60a5fa", // Bright blue crosshair
    upColor: "#10b981", // Professional green
    downColor: "#f87171", // Professional red
    volume: "#6366f1", // Indigo volume bars
    sma: "#fbbf24", // Amber SMA line
    ema: "#a78bfa", // Purple EMA line
    rsi: "#f472b6", // Pink RSI line
    macd: "#06b6d4", // Cyan MACD
    signal: "#f87171", // Red signal line
    plotline: "#fb7185", // Rose plotline
    // Premium triangle colors with enhanced visibility
    buySignal: "#006400", // Vibrant green for buy signals
    sellSignal: "#c11c84", // Vibrant red for sell signals
    // NEW INDICATORS: Colors for SL and New Base indicators
    slIndicator: "#ff6b35", // Orange for Stop Loss
    newBaseIndicator: "#8b5cf6", // Purple for New Base
  },
  light: {
    background: "#fefefe", // Pure white background
    text: "#0f172a",
    grid: "#DADADA", // Very light grid
    crosshair: "#3b82f6", // Blue crosshair
    upColor: "#059669", // Forest green
    downColor: "#dc2626", // Strong red
    volume: "#4f46e5", // Indigo volume
    sma: "#d97706", // Orange SMA
    ema: "#7c3aed", // Violet EMA
    rsi: "#db2777", // Pink RSI
    macd: "#0891b2", // Cyan MACD
    signal: "#dc2626", // Red signal
    plotline: "#e11d48", // Rose plotline
    // Premium triangle colors with high contrast
    buySignal: "#006400", // Strong green for buy signals
    sellSignal: "#c11c84", // Strong red for sell signals
    // NEW INDICATORS: Colors for SL and New Base indicators
    slIndicator: "#ea580c", // Dark orange for Stop Loss
    newBaseIndicator: "#7c3aed", // Dark purple for New Base
  },
} as const;

const StockChart = forwardRef<StockChartRef, StockChartProps>(
  (
    {
      symbol = "NIFTY",
      exchange = "NSE",
      theme = "dark",
      showVolume = true,
      showIndicators = true,
      showGrid = true,
      showCrosshair = true,
      height = 600,
      width,
      className = "",
      enableTwoScale = true,
      showPlotline = true,
      showDecisionSignals = true,
      autoRefresh = true,
      refreshInterval = PERFORMANCE_CONFIG.REFRESH_INTERVAL,
      // NEW INDICATORS: Add props for SL and New Base indicators
      showSLIndicators = true,
      showNewBaseIndicators = true,
      onDecisionClick,
      technicalIndicators,
    },
    ref
  ) => {
    // Chart references with proper typing
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const candlestickLeftSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(
      null
    );
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const emaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const macdSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const macdLineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const signalLineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const plotlineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const plotlineSegmentsRef = useRef<ISeriesApi<"Line">[]>([]);
    const seriesMarkersPluginRef = useRef<SeriesMarkersPlugin | null>(null);

    // NEW INDICATORS: Add refs for SL and New Base markers
    const slMarkersPluginRef = useRef<SeriesMarkersPlugin | null>(null);
    const newBaseMarkersPluginRef = useRef<SeriesMarkersPlugin | null>(null);

    // TECHNICAL INDICATORS: Add refs for support and resistance lines
    const supportLineRef = useRef<ISeriesApi<"Line"> | null>(null);
    const resistanceLineRef = useRef<ISeriesApi<"Line"> | null>(null);
    const rkbSupportLineRef = useRef<ISeriesApi<"Line"> | null>(null);
    const rkbResistanceLineRef = useRef<ISeriesApi<"Line"> | null>(null);

    // State management with proper typing
    const [chartState, setChartState] = useState<ChartState>({
      isLoading: true,
      error: null,
      currentPrice: null,
      priceChange: null,
      priceChangePercent: null,
      currentTrend: null,
      currentDecision: null,
      lastUpdate: null,
    });

    // OHLC hover state for displaying candle data on hover
    const [hoveredOHLC, setHoveredOHLC] = useState<OHLCData | null>(null);

    // Memoized color scheme for performance
    const colors = useMemo(() => THEME_COLORS[theme], [theme]);

    // Store current chart data for external access
    const currentChartData = useRef<ChartData[]>([]);

    // DATETIME FIX: Create lookup map for timestamp to original datetime mapping
    // This allows us to display the exact API datetime when hovering over candles
    const timestampToDatetimeMap = useRef<Map<number, string>>(new Map());

    // CHART STABILITY: Track theme change state to prevent interference
    const isThemeChanging = useRef<boolean>(false);

    // CHART STABILITY: Chart position lock to prevent any unwanted scrolling
    const chartPositionLocked = useRef<boolean>(false);
  

    // CHART STABILITY: Persistent view state that survives component updates
    const persistentViewState = useRef<ChartViewState | null>(null);

    // OPTIMIZATION: Track if initial data load has been completed to prevent unnecessary operations
    const initialDataLoaded = useRef<boolean>(false);

    // CHART STABILITY: Update persistent view state periodically
    useEffect(() => {
      if (!chartRef.current) return;

      const updatePersistentState = () => {
        if (chartRef.current && !chartPositionLocked.current) {
          const currentState = preserveChartViewState(chartRef.current);
          if (currentState) {
            persistentViewState.current = currentState;
          }
        }
      };

      // Update every 500ms when not locked
      const interval = setInterval(updatePersistentState, 500);

      return () => clearInterval(interval);
    }, []);

    // Note: Decision data is now extracted directly from chart data

    // TRADINGVIEW-LIKE: Advanced viewport lock system
    const createViewportLock = useCallback(() => {
      if (!chartRef.current) return null;

      // Capture current state
      const currentState = preserveChartViewState(chartRef.current);
      if (!currentState) return null;

      // Create a lock object that can restore the exact state
      return {
        restore: () => {
          if (chartRef.current && currentState) {
            // TRADINGVIEW-LIKE: Immediate, synchronous restoration
            const timeScale = chartRef.current.timeScale();
            
            // Method 1: Try visible range restoration (most precise)
            if (currentState.visibleRange) {
              try {
                timeScale.setVisibleRange(currentState.visibleRange);
                return true;
              } catch (error) {
                console.warn("Visible range restoration failed:", error);
              }
            }

            // Method 2: Try logical range restoration
            if (currentState.logicalRange) {
              try {
                timeScale.setVisibleLogicalRange(currentState.logicalRange);
                return true;
              } catch (error) {
                console.warn("Logical range restoration failed:", error);
              }
            }

            // Method 3: Fallback to scroll position
            try {
              timeScale.scrollToPosition(currentState.scrollPosition, false);
              return true;
            } catch (error) {
              console.warn("Scroll position restoration failed:", error);
            }
          }
          return false;
        },
        state: currentState
      };
    }, []);

    // Professional screenshot functionality for chart capture
    const takeChartScreenshot = useCallback(async () => {
      if (!chartContainerRef.current) {
        console.warn("Chart container not available for screenshot");
        return;
      }

      try {
        // Dynamically import html2canvas for optimal bundle size
        const html2canvas = (await import("html2canvas")).default;

        // Capture only the main chart area (excluding data panel and header)
        const canvas = await html2canvas(chartContainerRef.current, {
          backgroundColor: colors.background, // Match chart theme
          scale: 2, // High resolution for professional quality
          useCORS: true, // Handle cross-origin images
          allowTaint: true, // Allow external images
          logging: false, // Disable debug logging
          width: chartContainerRef.current.offsetWidth,
          height: chartContainerRef.current.offsetHeight,
        });

        // Convert canvas to blob and trigger automatic download
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create download link with timestamped filename
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${symbol || "NIFTY"}_${
                exchange || "NSE"
              }_${new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/:/g, "-")}.png`;

              // Trigger download and cleanup
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url); // Free memory
            }
          },
          "image/png",
          0.95
        ); // High quality PNG format
      } catch (error) {
        console.error("Error taking screenshot:", error);
      }
    }, [colors.background, symbol, exchange]);

    // Expose ref to parent with enhanced functionality
    useImperativeHandle(ref, () => ({
      chartRef: chartContainerRef,
      chart: chartRef.current,
      refresh: loadData,
      getCurrentData: () => currentChartData.current,
      takeScreenshot: takeChartScreenshot, // Add screenshot functionality
      resetZoom: () => {
        if (chartRef.current && currentChartData.current.length > 0) {
          // Set a reasonable default zoom level (show last 50 bars)
          const timeScale = chartRef.current.timeScale();
          const lastTime =
            currentChartData.current[currentChartData.current.length - 1].time;
          const startIndex = Math.max(0, currentChartData.current.length - 50);
          const startTime = currentChartData.current[startIndex].time;

          try {
            timeScale.setVisibleRange({
              from: startTime,
              to: lastTime,
            });
          } catch (error) {
            console.warn("Error setting zoom level:", error);
            // Fallback to fit content if setVisibleRange fails
            timeScale.fitContent();
          }
        }
      },
      setZoomLevel: (level: number) => {
        if (chartRef.current) {
          // Set bar spacing to control zoom level
          chartRef.current.applyOptions({
            timeScale: {
              barSpacing: level,
            },
          });
        }
      },
    }));

    // Debounced resize handler for smooth performance
    const resizeTimeoutRef = useRef<NodeJS.Timeout>();
    const handleResize = useCallback(() => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      }, PERFORMANCE_CONFIG.DEBOUNCE_DELAY);
    }, []);

    // Note: Decision data is now extracted directly from RKB chart data

    // Enhanced RKB data loading with error handling and caching
    const loadRkbData = useCallback(async (): Promise<ChartData[]> => {
      try {
        // REAL-TIME FIX: Use cache busting for fresh chart data updates
        const rkbData = await fetchRkbData(true); // Force fresh data for real-time chart updates
        const chartData = convertRkbDataToChartData(rkbData);

        // IST TIME CONVERSION: Convert UTC timestamps to IST for chart display
        const limitedData = chartData
          .slice(-PERFORMANCE_CONFIG.MAX_DATA_POINTS)
          .map((item) => {
            // Convert UTC timestamp to IST (UTC+5:30)
            const utcTime = item.time as number;
            const istTime = utcTime + 5.5 * 60 * 60; // Add 5 hours 30 minutes in seconds

            return {
              ...item,
              time: istTime as UTCTimestamp, // Use IST time for chart display
              originalUtcTime: utcTime, // Store original UTC time for reference
            };
          });

        // IST TIME CONVERSION: Log the time conversion for debugging
        if (limitedData.length > 0) {
          const firstItem = limitedData[0];
          const lastItem = limitedData[limitedData.length - 1];
          const firstUtcTime = new Date(
            firstItem.originalUtcTime! * 1000
          ).toISOString();
          const firstIstTime = new Date(firstItem.time * 1000).toLocaleString(
            "en-IN",
            {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
          );
          const lastUtcTime = new Date(
            lastItem.originalUtcTime! * 1000
          ).toISOString();
          const lastIstTime = new Date(lastItem.time * 1000).toLocaleString(
            "en-IN",
            {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
          );
          console.log(
            `🕐 IST Time Conversion - First candle: ${firstUtcTime} UTC → ${firstIstTime} IST`
          );
          console.log(
            `🕐 IST Time Conversion - Last candle: ${lastUtcTime} UTC → ${lastIstTime} IST`
          );
        }

        currentChartData.current = limitedData;

        // DATETIME FIX: Populate timestamp to datetime lookup map
        // This enables accurate datetime display in OHLC hover tooltip
        timestampToDatetimeMap.current.clear();
        limitedData.forEach((item) => {
          if (item.originalDatetime) {
            timestampToDatetimeMap.current.set(
              item.time,
              item.originalDatetime
            );
          }
        });

        return limitedData;
      } catch (error) {
        console.error("Error loading RKB data:", error);
        setChartState((prev) => ({
          ...prev,
          error: "Failed to load chart data",
        }));
        return [];
      }
    }, []);

    // Professional SMA calculation with proper error handling
    const calculateSMA = useCallback(
      (data: ChartData[], period: number = 20): IndicatorData[] => {
        if (data.length < period) return [];

        const smaData: IndicatorData[] = [];
        for (let i = period - 1; i < data.length; i++) {
          const sum = data
            .slice(i - period + 1, i + 1)
            .reduce((acc, item) => acc + item.close, 0);
          const sma = sum / period;
          smaData.push({
            time: data[i].time,
            value: sma,
          });
        }
        return smaData;
      },
      []
    );

    // Professional EMA calculation with exponential smoothing
    const calculateEMA = useCallback(
      (data: ChartData[], period: number = 20): IndicatorData[] => {
        if (data.length === 0) return [];

        const emaData: IndicatorData[] = [];
        const multiplier = 2 / (period + 1);

        // First EMA value is SMA
        let ema =
          data.slice(0, period).reduce((acc, item) => acc + item.close, 0) /
          period;
        emaData.push({ time: data[period - 1].time, value: ema });

        // Calculate EMA for remaining periods
        for (let i = period; i < data.length; i++) {
          ema = data[i].close * multiplier + ema * (1 - multiplier);
          emaData.push({ time: data[i].time, value: ema });
        }

        return emaData;
      },
      []
    );

    // Professional RSI calculation with proper smoothing
    const calculateRSI = useCallback(
      (data: ChartData[], period: number = 14): IndicatorData[] => {
        if (data.length < period + 1) return [];

        const rsiData: IndicatorData[] = [];
        const gains: number[] = [];
        const losses: number[] = [];

        // Calculate price changes
        for (let i = 1; i < data.length; i++) {
          const change = data[i].close - data[i - 1].close;
          gains.push(change > 0 ? change : 0);
          losses.push(change < 0 ? Math.abs(change) : 0);
        }

        // Calculate initial average gain and loss
        let avgGain =
          gains.slice(0, period).reduce((acc, gain) => acc + gain, 0) / period;
        let avgLoss =
          losses.slice(0, period).reduce((acc, loss) => acc + loss, 0) / period;

        // Calculate RSI for the first period
        const rs = avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);
        rsiData.push({ time: data[period].time, value: rsi });

        // Calculate RSI for remaining periods with smoothing
        for (let i = period; i < gains.length; i++) {
          avgGain = (avgGain * (period - 1) + gains[i]) / period;
          avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

          const rs = avgGain / avgLoss;
          const rsi = 100 - 100 / (1 + rs);
          rsiData.push({ time: data[i + 1].time, value: rsi });
        }

        return rsiData;
      },
      []
    );

    // Professional MACD calculation with signal line and histogram
    const calculateMACD = useCallback(
      (
        data: ChartData[],
        fastPeriod: number = 12,
        slowPeriod: number = 26,
        signalPeriod: number = 9
      ): MACDData => {
        const ema12 = calculateEMA(data, fastPeriod);
        const ema26 = calculateEMA(data, slowPeriod);

        const macdLine: IndicatorData[] = [];
        const histogram: IndicatorData[] = [];

        // Calculate MACD line
        for (let i = 0; i < ema26.length; i++) {
          const macdValue =
            ema12[i + (slowPeriod - fastPeriod)]?.value - ema26[i].value;
          if (macdValue !== undefined) {
            macdLine.push({ time: ema26[i].time, value: macdValue });
          }
        }

        // Calculate signal line (EMA of MACD line)
        const signalEMA = calculateEMA(
          macdLine.map((item) => ({
            ...item,
            close: item.value,
            open: item.value,
            high: item.value,
            low: item.value,
          })),
          signalPeriod
        );

        // Calculate histogram
        for (let i = 0; i < signalEMA.length; i++) {
          const histogramValue =
            macdLine[i + (signalPeriod - 1)]?.value - signalEMA[i].value;
          if (histogramValue !== undefined) {
            histogram.push({ time: signalEMA[i].time, value: histogramValue });
          }
        }

        return {
          macdLine: macdLine.slice(signalPeriod - 1),
          signalLine: signalEMA,
          histogram,
        };
      },
      [calculateEMA]
    );

    // Enhanced colored plotline segments with smooth transitions
    const createColoredPlotlineSegments = useCallback(
      (chartData: ChartData[]) => {
        // BUG FIX: Enhanced validation to prevent disposal errors
        if (!chartRef.current || !chartContainerRef.current) return;

        // If plotline is disabled, clear all segments and return
        if (!showPlotline) {
          if (plotlineSegmentsRef.current.length > 0) {
            plotlineSegmentsRef.current.forEach((series) => {
              try {
                if (chartRef.current && series) {
                  chartRef.current.removeSeries(series);
                }
              } catch (error: unknown) {
                // Silently handle disposal errors
                const errorMessage =
                  error instanceof Error ? error.message : "Unknown error";
                if (errorMessage && !errorMessage.includes("disposed")) {
                  console.warn(
                    `Error removing plotline segment:`,
                    errorMessage
                  );
                }
              }
            });
            plotlineSegmentsRef.current = [];
            console.log("ℹ️ Plotline disabled - clearing segments");
          }
          return;
        }

        // Additional safety check: ensure chart is not disposed
        try {
          // Test if chart is still valid by checking a simple property
          chartRef.current.timeScale();
        } catch {
          console.warn("Chart is disposed, skipping plotline segment creation");
          return;
        }

        // Clear existing segments with enhanced error handling
        if (plotlineSegmentsRef.current.length > 0) {
          plotlineSegmentsRef.current.forEach((series) => {
            try {
              if (chartRef.current && series) {
                chartRef.current.removeSeries(series);
              }
            } catch (error: unknown) {
              // Silently handle disposal errors
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              if (errorMessage && !errorMessage.includes("disposed")) {
                console.warn(`Error removing plotline segment:`, errorMessage);
              }
            }
          });
        }
        plotlineSegmentsRef.current = [];

        if (!chartData || chartData.length === 0) {
          return;
        }

        const plotlineData = chartData.filter(
          (item) => item.plotline !== undefined && !isNaN(item.plotline)
        );
        if (plotlineData.length === 0) {
          return;
        }

        let currentTrend = plotlineData[0].trend || "NEUTRAL";
        let segmentStart = 0;

        // Create colored segments based on trend changes with no gaps
        for (let i = 1; i < plotlineData.length; i++) {
          const currentItem = plotlineData[i];
          const previousItem = plotlineData[i - 1];

          if (currentItem.trend !== previousItem.trend) {
            if (i > segmentStart) {
              // Include the current point in the previous segment to ensure continuity
              // This creates overlap and eliminates gaps between segments
              const segmentData = plotlineData
                .slice(segmentStart, i + 1) // Include current point for overlap
                .map((item) => ({
                  time: item.time,
                  value: item.plotline!,
                }));

              const trendUpper = (
                previousItem.trend || "NEUTRAL"
              ).toUpperCase();
              const color =
                trendUpper === "BUY"
                  ? colors.buySignal
                  : trendUpper === "SELL"
                  ? colors.sellSignal
                  : colors.plotline;

              try {
                const segmentSeries = chartRef.current!.addSeries(LineSeries, {
                  color,
                  lineWidth: 2,
                  lineType: 2,
                  crosshairMarkerVisible: true,
                  priceLineVisible: false,
                  lastValueVisible: false,
                });

                segmentSeries.setData(segmentData);
                plotlineSegmentsRef.current.push(segmentSeries);
              } catch (error) {
                console.warn("Error creating plotline segment:", error);
              }
            }

            segmentStart = i;
            currentTrend = currentItem.trend || "NEUTRAL";
          }
        }

        // Create final segment
        if (segmentStart < plotlineData.length) {
          const segmentData = plotlineData.slice(segmentStart).map((item) => ({
            time: item.time,
            value: item.plotline!,
          }));

          const trendUpper = (currentTrend || "NEUTRAL").toUpperCase();
          const color =
            trendUpper === "BUY"
              ? colors.buySignal
              : trendUpper === "SELL"
              ? colors.sellSignal
              : colors.plotline;

          try {
            const segmentSeries = chartRef.current!.addSeries(LineSeries, {
              color,
              lineWidth: 2,

              lineType: 2,
              crosshairMarkerVisible: true,
              priceLineVisible: false,
              lastValueVisible: false,
            });

            segmentSeries.setData(segmentData);
            plotlineSegmentsRef.current.push(segmentSeries);
          } catch (error) {
            console.warn("Error creating final plotline segment:", error);
          }
        }

        // STABILITY: View state restoration is now handled in the calling useEffect
      },
      [showPlotline, colors]
    );

    // Note: Decision signals are now handled by triangle markers only - removed line series approach

    // Professional chart initialization with optimized options
    const initializeChart = useCallback(() => {
      if (!chartContainerRef.current) return;

      // ENHANCED: Professional chart options with smooth animations and premium styling
      const chartOptions = {
        layout: {
          background: {
            type: ColorType.Solid,
            color: colors.background,
          },
          textColor: colors.text,
          fontSize: 12,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        grid: {
          vertLines: {
            color: colors.grid,
            style: LineStyle.Solid,
            visible: showGrid,
          },
          horzLines: {
            color: colors.grid,
            style: LineStyle.Solid,
            visible: showGrid,
          },
        },
        crosshair: {
          mode: showCrosshair ? CrosshairMode.Normal : CrosshairMode.Hidden,
          vertLine: {
            color: colors.crosshair,
            style: LineStyle.Solid,
            labelBackgroundColor: colors.crosshair,
          },
          horzLine: {
            color: colors.crosshair,
            style: LineStyle.Solid,
            labelBackgroundColor: colors.crosshair,
          },
        },
        rightPriceScale: {
          borderColor: colors.grid,
          visible: true,
          scaleMargins: {
            top: 0.08, // Tighter margins for better space utilization
            bottom: 0.15,
          },
          borderVisible: true,
          entireTextOnly: false,
          ticksVisible: true,
          drawTicks: true,
        },
        leftPriceScale: {
          borderColor: colors.grid,
          visible: enableTwoScale,
          scaleMargins: {
            top: 0.08,
            bottom: 0.15,
          },
          borderVisible: enableTwoScale,
          entireTextOnly: false,
          ticksVisible: enableTwoScale,
          drawTicks: enableTwoScale,
        },
        timeScale: {
          borderColor: colors.grid,
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 15, // More space for latest data
          barSpacing: 14, // Optimal bar spacing for clarity
          minBarSpacing: 0.5, // Allow tight zooming
          fixLeftEdge: false,
          fixRightEdge: false,
          lockVisibleTimeRangeOnResize: true, // Maintain view on resize
          borderVisible: true,
          ticksVisible: true,
          // TRADINGVIEW-LIKE: Prevent automatic fitting behavior
          shiftVisibleRangeOnNewBar: false, // Prevent auto-scrolling on new data
          // IST TIME CONVERSION: Time scale now displays IST time format
          // The timestamps are converted to IST before being set on the chart
          timeUnit: "day", // Show day format for better IST readability
          // Set timezone to IST for proper time display
          timezone: "Asia/Kolkata",
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
        // Ensure mobile touch interactions are properly enabled
        interaction: {
          enabled: true,
        },
        // Mobile touch optimization
        mobile: {
          enabled: true,
        },
        // Ensure touch events are properly handled
        touch: {
          enabled: true,
        },
        // Additional mobile optimizations
        devicePixelRatio: window.devicePixelRatio || 1,
        // Ensure proper touch handling
        autoSize: true,
        // Mobile-specific chart options
        localization: {
          locale: "en-US",
        },
        // Ensure mobile touch compatibility
        compatibility: {
          mobile: true,
        },
        // Mobile touch event handling
        events: {
          touch: true,
        },
        // Mobile-specific rendering
        rendering: {
          mobile: true,
        },
        // Mobile touch input handling
        input: {
          touch: true,
        },
        // Mobile touch event optimization
        touchEvents: {
          enabled: true,
        },
        // Mobile touch event handling
        touchHandling: {
          enabled: true,
          capture: true,
          passive: false,
        },
        // Mobile touch gesture support
        gestures: {
          enabled: true,
        },
        watermark: {
          visible: true,
          text: "RKB Nifty Ka Boss",
          fontSize: 16,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color:
            theme === "dark"
              ? "rgba(248, 250, 252, 0.25)"
              : "rgba(15, 23, 42, 0.15)",
          horzAlign: "center",
          vertAlign: "center",
        },
      };

      chartRef.current = createChart(chartContainerRef.current, chartOptions);

      // ENHANCED: Create premium candlestick series with smooth styling
      candlestickSeriesRef.current = chartRef.current.addSeries(
        CandlestickSeries,
        {
          upColor: colors.upColor,
          downColor: colors.downColor,
          borderVisible: false,
          wickUpColor: colors.upColor,
          wickDownColor: colors.downColor,
          borderUpColor: colors.upColor,
          borderDownColor: colors.downColor,
          wickVisible: true,
          priceLineVisible: false, // Clean look without price line
          lastValueVisible: true,
          priceFormat: {
            type: "price",
            precision: 2,
            minMove: 0.01,
          },
        }
      );

      // ENHANCED: Create premium left scale candlestick series (if enabled)
      if (enableTwoScale) {
        candlestickLeftSeriesRef.current = chartRef.current.addSeries(
          CandlestickSeries,
          {
            priceScaleId: "left",
            upColor: colors.upColor,
            downColor: colors.downColor,
            borderVisible: false,
            wickUpColor: colors.upColor,
            wickDownColor: colors.downColor,
            borderUpColor: colors.upColor,
            borderDownColor: colors.downColor,
            wickVisible: true,
            priceLineVisible: false,
            lastValueVisible: true,
            priceFormat: {
              type: "price",
              precision: 2,
              minMove: 0.01,
            },
          }
        );
      }

      // ENHANCED: Create premium volume series with smooth styling
      if (showVolume) {
        volumeSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
          color: colors.volume,
          priceFormat: {
            type: "volume",
          },
          priceScaleId: "volume",
          priceLineVisible: false,
          lastValueVisible: false, // Clean volume display
        });

        const volumePriceScale = chartRef.current.priceScale("volume");
        if (volumePriceScale) {
          volumePriceScale.applyOptions({
            scaleMargins: {
              top: 0.82, // Slightly more space for cleaner look
              bottom: 0,
            },
            borderVisible: false, // Clean volume scale
            ticksVisible: false,
          });
        }
      }

      // ENHANCED: Create premium technical indicators with smooth styling
      if (showIndicators) {
        // Premium SMA series (Simple Moving Average)
        smaSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.sma,
          lineWidth: 2,
          lineStyle: 0, // Solid line
          title: "SMA 20",
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: true,
        });

        // Premium EMA series (Exponential Moving Average)
        emaSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.ema,
          lineWidth: 2,
          lineStyle: 0, // Solid line
          title: "EMA 20",
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: true,
        });

        // Premium RSI series (Relative Strength Index)
        rsiSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.rsi,
          lineWidth: 2,
          lineStyle: 0,
          title: "RSI",
          priceScaleId: "rsi",
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: true,
        });

        const rsiPriceScale = chartRef.current.priceScale("rsi");
        if (rsiPriceScale) {
          rsiPriceScale.applyOptions({
            scaleMargins: {
              top: 0.65, // Better spacing
              bottom: 0.15,
            },
            borderVisible: false,
            ticksVisible: false,
          });
        }

        // Premium MACD series (Moving Average Convergence Divergence)
        macdSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
          color: colors.macd,
          title: "MACD Histogram",
          priceScaleId: "macd",
          priceLineVisible: false,
          lastValueVisible: false,
        });

        const macdPriceScale = chartRef.current.priceScale("macd");
        if (macdPriceScale) {
          macdPriceScale.applyOptions({
            scaleMargins: {
              top: 0.85, // More space for cleaner look
              bottom: 0,
            },
            borderVisible: false,
            ticksVisible: false,
          });
        }

        macdLineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.macd,
          lineWidth: 2,
          lineStyle: 0,
          title: "MACD Line",
          priceScaleId: "macd",
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: true,
        });

        signalLineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.signal,
          lineWidth: 2,
          lineStyle: 0,
          title: "Signal Line",
          priceScaleId: "macd",
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: true,
        });
      }

      // ENHANCED: Create premium plotline indicator with smooth styling
      if (showPlotline) {
        plotlineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.plotline,
          lineWidth: 3, // Slightly thicker for better visibility
          title: "RKB Plotline",
          lineStyle: 0, // Solid line for clarity
          crosshairMarkerVisible: true,
          priceLineVisible: false, // Clean look without price line
          lastValueVisible: true,
          crosshairMarkerBackgroundColor: colors.plotline,
          crosshairMarkerBorderColor: colors.background,
          crosshairMarkerBorderWidth: 2,
        });
      }

      // Add resize listener
      window.addEventListener("resize", handleResize);

      // Add crosshair event listener for OHLC hover display
      if (chartRef.current) {
        chartRef.current.subscribeCrosshairMove((param) => {
          if (param.time && param.seriesData) {
            // Get the candlestick data for the hovered time
            const candlestickData = param.seriesData.get(
              candlestickSeriesRef.current!
            );
            if (candlestickData && "open" in candlestickData) {
              const { open, high, low, close } = candlestickData as {
                open: number;
                high: number;
                low: number;
                close: number;
              };

              // Get volume data if available
              let volume: number | undefined;
              if (volumeSeriesRef.current) {
                const volumeData = param.seriesData.get(
                  volumeSeriesRef.current
                );
                if (volumeData && "value" in volumeData) {
                  volume = (volumeData as { value: number }).value;
                }
              }

              // Get the original datetime from API data for exact display
              const originalDatetime = timestampToDatetimeMap.current.get(
                param.time as number
              );

              // Use original API datetime if available, otherwise fallback to formatted time
              let displayTime: string;

              if (originalDatetime) {
                // Convert numeric month format to abbreviated format if needed
                const convertNumericMonthFormat = (
                  dateString: string
                ): string => {
                  if (!dateString) return "N/A";

                  // Check if it's in YYYY-MM-DD format (e.g., "2025-01-09 14:15")
                  const dateRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/;
                  const match = dateString.match(dateRegex);

                  if (match) {
                    const [, year, month, day, hour, minute] = match;
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    const monthIndex = parseInt(month) - 1;
                    const monthName = monthNames[monthIndex];

                    // Return in format "DD Mon YYYY HH:MM" (e.g., "09 Jan 2025 14:15")
                    return `${day} ${monthName} ${year} ${hour}:${minute}`;
                  }

                  // If not in YYYY-MM-DD format, return as-is
                  return dateString;
                };

                displayTime = convertNumericMonthFormat(originalDatetime);
              } else {
                // Fallback to formatted time with abbreviated month
                displayTime = new Date(
                  (param.time as number) * 1000
                ).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
              }

              setHoveredOHLC({
                time: displayTime,
                open,
                high,
                low,
                close,
                volume,
              });
            }
          } else {
            // Clear OHLC data when not hovering over a candle
            setHoveredOHLC(null);
          }
        });
      }

      // DECISION CLICK HANDLER: Add click and touch event listeners to chart container for triangle marker clicks
      if (chartContainerRef.current && onDecisionClick) {
        // Unified handler for both mouse and touch events
        const handleChartInteraction = (event: MouseEvent | TouchEvent) => {
          if (!chartRef.current || !candlestickSeriesRef.current) return;

          // Get coordinates relative to the chart container
          const rect = chartContainerRef.current!.getBoundingClientRect();
          let x: number;

          if (event instanceof MouseEvent) {
            // Handle mouse events
            x = event.clientX - rect.left;
            console.log("🖱️ Mouse event detected");
          } else if (event instanceof TouchEvent) {
            // Handle touch events for mobile
            if (event.touches.length === 0) return;
            x = event.touches[0].clientX - rect.left;
            console.log("📱 Touch event detected", {
              touches: event.touches.length,
              clientX: event.touches[0].clientX,
              rectLeft: rect.left,
              calculatedX: x,
            });
          } else {
            return;
          }

          // Convert pixel coordinates to chart coordinates
          try {
            const timeScale = chartRef.current.timeScale();

            // Get the time value at the clicked/touched x coordinate
            const clickedTime = timeScale.coordinateToTime(x);
            if (!clickedTime) return;

            // Find the chart data point that matches the clicked time
            // Since clickedTime is now in IST, we need to compare with IST timestamps
            const clickedDataPoint = currentChartData.current.find(
              (point) => Math.abs(point.time - (clickedTime as number)) < 300 // Within 5 minute tolerance for better detection
            );

            console.log("🔍 DEBUG - Interaction detection:", {
              eventType: event instanceof MouseEvent ? "mouse" : "touch",
              clickedTime: clickedTime,
              foundPoint: !!clickedDataPoint,
              pointDecision: clickedDataPoint?.decision,
              totalPoints: currentChartData.current.length,
            });

            if (clickedDataPoint && clickedDataPoint.decision) {
              // Check if this is a decision signal (BUYYES or SELLYES)
              const isDecisionSignal =
                clickedDataPoint.decision === "BUYYES" ||
                clickedDataPoint.decision === "SELLYES";

              if (isDecisionSignal) {
                // Get the original datetime for the clicked point
                const originalDatetime = timestampToDatetimeMap.current.get(
                  clickedDataPoint.time
                );

                console.log("🔍 DEBUG - Triangle click sources:", {
                  fromMap: originalDatetime,
                  fromPoint: clickedDataPoint.originalDatetime,
                  pointTime: clickedDataPoint.time,
                  mapSize: timestampToDatetimeMap.current.size,
                });

                // DATETIME FIX: Always use the originalDatetime from the chart data point
                // This ensures we use the exact same format as the decision popup data
                const finalDatetime =
                  clickedDataPoint.originalDatetime || originalDatetime || "";

                // Prepare decision data for the callback
                const decisionData = {
                  decision: (clickedDataPoint.decision === "BUYYES"
                    ? "BUY"
                    : "SELL") as "BUY" | "SELL",
                  datetime: finalDatetime,
                  price: clickedDataPoint.close,
                  time: clickedDataPoint.time,
                };

                // Trigger the decision click callback
                onDecisionClick(decisionData);

                console.log("🎯 Decision triangle clicked:", decisionData);
              }
            }
          } catch (error) {
            console.warn("Error handling chart interaction:", error);
          }
        };

        // Add both click and touch event listeners to chart container for mobile compatibility
        chartContainerRef.current.addEventListener(
          "click",
          handleChartInteraction
        );
        chartContainerRef.current.addEventListener(
          "touchstart",
          handleChartInteraction,
          { passive: false }
        );
        chartContainerRef.current.addEventListener(
          "touchend",
          handleChartInteraction,
          { passive: false }
        );
        chartContainerRef.current.addEventListener(
          "touchmove",
          handleChartInteraction,
          { passive: false }
        );

        // Debug: Log when event listeners are added
        console.log(
          "📱 Event listeners added - Click and Touch support enabled for mobile"
        );
        console.log("📱 Chart container ref:", chartContainerRef.current);
        console.log("📱 Chart container dimensions:", {
          width: chartContainerRef.current?.offsetWidth,
          height: chartContainerRef.current?.offsetHeight,
          clientWidth: chartContainerRef.current?.clientWidth,
          clientHeight: chartContainerRef.current?.clientHeight,
        });

        // Test touch event support
        if ("ontouchstart" in window) {
          console.log("📱 Touch events are supported by the browser");
        } else {
          console.log("⚠️ Touch events are NOT supported by the browser");
        }

        // Test chart container touch readiness
        console.log("📱 Chart container touch properties:", {
          ontouchstart: !!chartContainerRef.current?.ontouchstart,
          ontouchend: !!chartContainerRef.current?.ontouchstart,
          ontouchmove: !!chartContainerRef.current?.ontouchstart,
        });

        // Test chart container event listener support
        console.log("📱 Chart container event listener support:", {
          addEventListener: !!chartContainerRef.current?.addEventListener,
          removeEventListener: !!chartContainerRef.current?.removeEventListener,
        });

        // Test chart container touch event readiness
        console.log("📱 Chart container touch event readiness:", {
          hasTouchEvents: "ontouchstart" in chartContainerRef.current,
          touchAction: getComputedStyle(chartContainerRef.current).touchAction,
          pointerEvents: getComputedStyle(chartContainerRef.current)
            .pointerEvents,
        });

        // Test chart container event listener readiness
        console.log("📱 Chart container event listener readiness:", {
          nodeType: chartContainerRef.current?.nodeType,
          tagName: chartContainerRef.current?.tagName,
        });

        // Test chart container touch event binding
        console.log("📱 Chart container touch event binding:", {
          touchStartBound: false, // Will be set to true when touchstart is bound
          touchEndBound: false, // Will be set to true when touchend is bound
          touchMoveBound: false, // Will be set to true when touchmove is bound
        });

        // Test chart container touch event readiness
        console.log("📱 Chart container touch event readiness:", {
          hasTouchEvents: "ontouchstart" in window,
          hasTouchStart: "ontouchstart" in chartContainerRef.current,
          hasTouchEnd: "ontouchend" in chartContainerRef.current,
          hasTouchMove: "ontouchmove" in chartContainerRef.current,
        });

        // Test chart container touch event binding success
        console.log("📱 Chart container touch event binding success:", {
          touchStartListener: !!chartContainerRef.current?.addEventListener,
          touchEndListener: !!chartContainerRef.current?.addEventListener,
          touchMoveListener: !!chartContainerRef.current?.addEventListener,
        });

        // Store reference for cleanup
        const currentContainer = chartContainerRef.current;

        // Return cleanup function that removes all event listeners
        return () => {
          if (currentContainer) {
            currentContainer.removeEventListener(
              "click",
              handleChartInteraction
            );
            currentContainer.removeEventListener(
              "touchstart",
              handleChartInteraction
            );
            currentContainer.removeEventListener(
              "touchend",
              handleChartInteraction
            );
            currentContainer.removeEventListener(
              "touchmove",
              handleChartInteraction
            );
          }
        };
      }

      return () => {
        // BUG FIX: Enhanced cleanup to prevent disposal errors and abort API requests
        console.log("🧹 Cleaning up StockChart component...");

        // Abort any ongoing API requests to prevent "operation was aborted" errors
        try {
          abortAllRequests();
        } catch (error) {
          console.warn("Error aborting API requests:", error);
        }

        window.removeEventListener("resize", handleResize);
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }

        // Clean up plotline segments before disposing chart
        if (plotlineSegmentsRef.current.length > 0) {
          plotlineSegmentsRef.current.forEach((series) => {
            try {
              if (chartRef.current && series) {
                chartRef.current.removeSeries(series);
              }
            } catch {
              // Silently handle disposal errors during cleanup
            }
          });
          plotlineSegmentsRef.current = [];
        }

        // TECHNICAL INDICATORS: Clean up support and resistance lines
        if (supportLineRef.current) {
          try {
            if (chartRef.current) {
              chartRef.current.removeSeries(supportLineRef.current);
            }
          } catch {
            // Silently handle disposal errors during cleanup
          }
          supportLineRef.current = null;
        }

        if (resistanceLineRef.current) {
          try {
            if (chartRef.current) {
              chartRef.current.removeSeries(resistanceLineRef.current);
            }
          } catch {
            // Silently handle disposal errors during cleanup
          }
          resistanceLineRef.current = null;
        }

        if (rkbSupportLineRef.current) {
          try {
            if (chartRef.current) {
              chartRef.current.removeSeries(rkbSupportLineRef.current);
            }
          } catch {
            // Silently handle disposal errors during cleanup
          }
          rkbSupportLineRef.current = null;
        }

        if (rkbResistanceLineRef.current) {
          try {
            if (chartRef.current) {
              chartRef.current.removeSeries(rkbResistanceLineRef.current);
            }
          } catch {
            // Silently handle disposal errors during cleanup
          }
          rkbResistanceLineRef.current = null;
        }

        // Clean up series markers plugin
        if (seriesMarkersPluginRef.current) {
          try {
            seriesMarkersPluginRef.current.setMarkers([]);
          } catch {
            // Silently handle disposal errors during cleanup
          }
          seriesMarkersPluginRef.current = null;
        }

        // NEW INDICATORS: Clean up SL and New Base marker plugins
        if (slMarkersPluginRef.current) {
          try {
            slMarkersPluginRef.current.setMarkers([]);
          } catch {
            // Silently handle disposal errors during cleanup
          }
          slMarkersPluginRef.current = null;
        }

        if (newBaseMarkersPluginRef.current) {
          try {
            newBaseMarkersPluginRef.current.setMarkers([]);
          } catch {
            // Silently handle disposal errors during cleanup
          }
          newBaseMarkersPluginRef.current = null;
        }

        // Dispose chart last
        if (chartRef.current) {
          try {
            chartRef.current.remove();
          } catch {
            // Silently handle disposal errors
          }
          chartRef.current = null;
        }

        console.log("✅ StockChart component cleanup completed");
      };
    }, [
      showVolume,
      showIndicators,
      showGrid,
      showCrosshair,
      enableTwoScale,
      showPlotline,
      colors,
      handleResize,
      onDecisionClick, // DECISION CLICK HANDLER: Include in dependencies to update click handler when callback changes
      showSLIndicators,
      showNewBaseIndicators,
    ]);

    // TECHNICAL INDICATORS: Create support and resistance lines function
    const createTechnicalIndicatorLines = useCallback(
      (chartData: ChartData[]) => {
        // Early return if required dependencies are not available
        if (!chartRef.current || !chartData.length || !technicalIndicators)
          return;

        // BUG FIX: Enhanced validation to prevent disposal errors
        try {
          // Test if chart is still valid by checking a simple property
          chartRef.current.timeScale();
        } catch {
          console.warn(
            "Chart is disposed, skipping technical indicator lines creation"
          );
          return;
        }

        // STABILITY: Store view state before making any changes to prevent scrolling
        const viewState = preserveChartViewState(chartRef.current);

        try {
          // Clear existing technical indicator lines
          if (supportLineRef.current) {
            try {
              chartRef.current.removeSeries(supportLineRef.current);
            } catch (error) {
              console.warn("Error removing support line:", error);
            }
            supportLineRef.current = null;
          }

          if (resistanceLineRef.current) {
            try {
              chartRef.current.removeSeries(resistanceLineRef.current);
            } catch (error) {
              console.warn("Error removing resistance line:", error);
            }
            resistanceLineRef.current = null;
          }

          if (rkbSupportLineRef.current) {
            try {
              chartRef.current.removeSeries(rkbSupportLineRef.current);
            } catch (error) {
              console.warn("Error removing RKB support line:", error);
            }
            rkbSupportLineRef.current = null;
          }

          if (rkbResistanceLineRef.current) {
            try {
              chartRef.current.removeSeries(rkbResistanceLineRef.current);
            } catch (error) {
              console.warn("Error removing RKB resistance line:", error);
            }
            rkbResistanceLineRef.current = null;
          }

          // Get time range from chart data
          const firstTime = chartData[0].time;
          const lastTime = chartData[chartData.length - 1].time;

          // Create Support line (Dark Green)
          if (technicalIndicators.S1 && !isNaN(technicalIndicators.S1)) {
            supportLineRef.current = chartRef.current.addSeries(LineSeries, {
              color: theme === "dark" ? "#059669" : "#047857", // Dark Green
              lineWidth: 2,
              lineStyle: LineStyle.Dashed,
              title: "Support",
              priceLineVisible: false,
              lastValueVisible: false,
              crosshairMarkerVisible: true,
            });

            const supportData = [
              { time: firstTime, value: technicalIndicators.S1 },
              { time: lastTime, value: technicalIndicators.S1 },
            ];
            supportLineRef.current.setData(supportData);
          }

          // Create Resistance line (Red)
          if (technicalIndicators.R1 && !isNaN(technicalIndicators.R1)) {
            resistanceLineRef.current = chartRef.current.addSeries(LineSeries, {
              color: theme === "dark" ? "#dc2626" : "#b91c1c", // Red
              lineWidth: 2,
              lineStyle: LineStyle.Dashed,
              title: "Resistance",
              priceLineVisible: false,
              lastValueVisible: false,
              crosshairMarkerVisible: true,
            });

            const resistanceData = [
              { time: firstTime, value: technicalIndicators.R1 },
              { time: lastTime, value: technicalIndicators.R1 },
            ];
            resistanceLineRef.current.setData(resistanceData);
          }

          // Create RKB Support line (Black/White based on theme)
          if (
            technicalIndicators.rkbSupport &&
            !isNaN(technicalIndicators.rkbSupport)
          ) {
            rkbSupportLineRef.current = chartRef.current.addSeries(LineSeries, {
              color: theme === "dark" ? "#ffffff" : "#000000", // White for dark theme, Black for light theme
              lineWidth: 2,
              lineStyle: LineStyle.Solid,
              title: "RKB Support",
              priceLineVisible: false,
              lastValueVisible: false,
              crosshairMarkerVisible: true,
            });

            const rkbSupportData = [
              { time: firstTime, value: technicalIndicators.rkbSupport },
              { time: lastTime, value: technicalIndicators.rkbSupport },
            ];
            rkbSupportLineRef.current.setData(rkbSupportData);
          }

          // Create RKB Resistance line (Sky Blue)
          if (
            technicalIndicators.rkbResistance &&
            !isNaN(technicalIndicators.rkbResistance)
          ) {
            rkbResistanceLineRef.current = chartRef.current.addSeries(
              LineSeries,
              {
                color: theme === "dark" ? "#0ea5e9" : "#0284c7", // Sky Blue
                lineWidth: 2,
                lineStyle: LineStyle.Solid,
                title: "RKB Resistance",
                priceLineVisible: false,
                lastValueVisible: false,
                crosshairMarkerVisible: true,
              }
            );

            const rkbResistanceData = [
              { time: firstTime, value: technicalIndicators.rkbResistance },
              { time: lastTime, value: technicalIndicators.rkbResistance },
            ];
            rkbResistanceLineRef.current.setData(rkbResistanceData);
          }

          console.log("✅ Technical indicator lines created successfully");
        } catch (error) {
          console.error("❌ Error creating technical indicator lines:", error);
        }

        // STABILITY: Restore view state after all technical indicator operations are complete
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            restoreChartViewState(chartRef.current, viewState);
          });
        });
      },
      [technicalIndicators, theme]
    );

    // DECISION TRIANGLES: Create decision triangle markers function
    const createDecisionTriangles = useCallback(
      (chartData: ChartData[]) => {
        // Early return if required dependencies are not available
        if (
          !chartRef.current ||
          !candlestickSeriesRef.current ||
          !chartData.length
        )
          return;

        // BUG FIX: Enhanced validation to prevent disposal errors
        try {
          chartRef.current.timeScale(); // Will throw if disposed
        } catch {
          console.warn(
            "Chart is disposed, skipping decision triangles creation"
          );
          return;
        }

        try {
          // Initialize markers plugin if needed
          if (!seriesMarkersPluginRef.current) {
            if (candlestickSeriesRef.current) {
              seriesMarkersPluginRef.current = createSeriesMarkers(
                candlestickSeriesRef.current
              ) as SeriesMarkersPlugin;
            } else {
              console.warn("Candlestick series not available for markers");
              return;
            }
          }

          // If decision signals are disabled, clear all markers and return
          if (!showDecisionSignals) {
            if (seriesMarkersPluginRef.current) {
              seriesMarkersPluginRef.current.setMarkers([]);
              console.log("ℹ️ Decision signals disabled - clearing markers");
            }
            return;
          }

          // Prepare a map to hold markers by candle time
          const markersMap = new Map<number, DecisionMarker[]>();

          chartData.forEach((data) => {
            if (!data.time || !data.close) return;

            // Ensure array exists for this time
            if (!markersMap.has(data.time)) {
              markersMap.set(data.time, []);
            }

            if (data.decision === "BUYYES") {
              markersMap.get(data.time)!.push({
                time: data.time,
                position: "aboveBar",
                color: colors.buySignal,
                shape: "arrowUp",
                text: "BUY",
                size: 1.5,
              });
            }

            if (data.decision === "SELLYES") {
              markersMap.get(data.time)!.push({
                time: data.time,
                position: "aboveBar",
                color: colors.sellSignal,
                shape: "arrowDown",
                text: "SELL",
                size: 1.5,
              });
            }
          });

          // Flatten all markers into one array
          const markersData = Array.from(markersMap.values()).flat();

          // Apply markers to chart
          if (markersData.length > 0 && seriesMarkersPluginRef.current) {
            seriesMarkersPluginRef.current.setMarkers(markersData);
            console.log(
              `✅ Triangle Markers Created: ${
                markersData.filter((m) => m.text === "BUY").length
              } BUY, ${
                markersData.filter((m) => m.text === "SELL").length
              } SELL from ${chartData.length} data points`
            );
          } else if (seriesMarkersPluginRef.current) {
            seriesMarkersPluginRef.current.setMarkers([]);
            console.log("ℹ️ No decision markers to display");
          }
        } catch (error) {
          console.error("❌ Error creating decision triangles:", error);
        }

        // STABILITY: View state restoration is now handled in the calling useEffect
      },
      [showDecisionSignals, colors]
    );

    // OVERLAP PREVENTION: Function to coordinate indicator positioning and prevent overlap
    const createCoordinatedIndicators = useCallback(
      (chartData: ChartData[]) => {
        // Early return if required dependencies are not available
        if (
          !chartRef.current ||
          !candlestickSeriesRef.current ||
          !chartData.length
        )
          return;

        // BUG FIX: Enhanced validation to prevent disposal errors
        try {
          chartRef.current.timeScale(); // Will throw if disposed
        } catch {
          console.warn(
            "Chart is disposed, skipping coordinated indicators creation"
          );
          return;
        }

        try {
          // Initialize markers plugins if needed
          if (!slMarkersPluginRef.current) {
            slMarkersPluginRef.current = createSeriesMarkers(
              candlestickSeriesRef.current
            ) as SeriesMarkersPlugin;
          }
          if (!newBaseMarkersPluginRef.current) {
            newBaseMarkersPluginRef.current = createSeriesMarkers(
              candlestickSeriesRef.current
            ) as SeriesMarkersPlugin;
          }

          // Prepare maps to hold markers by candle time
          const slMarkersMap = new Map<number, SLMarker[]>();
          const newBaseMarkersMap = new Map<number, NewBaseMarker[]>();

          // First pass: collect all indicators with conditional logic
          chartData.forEach((data) => {
            if (!data.time || !data.close) return;

            // Check if this data point has a decision signal
            const hasDecision =
              data.decision === "BUYYES" || data.decision === "SELLYES";

            if (hasDecision) {
              // Parse newBase value to determine which indicator to show
              let newBaseValue = 0;
              if (
                data.newBase &&
                String(data.newBase).trim() !== "" &&
                String(data.newBase) !== "0"
              ) {
                newBaseValue = parseFloat(String(data.newBase)) || 0;
              }

              if (newBaseValue > 0) {
                // When newBase > 0: Show NB and hide SL
                if (showNewBaseIndicators) {
                  if (!newBaseMarkersMap.has(data.time)) {
                    newBaseMarkersMap.set(data.time, []);
                  }
                  newBaseMarkersMap.get(data.time)!.push({
                    time: data.time,
                    position: "belowBar",
                    color: colors.newBaseIndicator,
                    shape: "square",
                    text: `NB: ${data.newBase}`,
                    size: 1.2,
                  });
                }
                // Don't add SL marker when newBase > 0
              } else {
                // When newBase <= 0: Hide NB and show only SL
                if (data.SL && !isNaN(data.SL) && showSLIndicators) {
                  if (!slMarkersMap.has(data.time)) {
                    slMarkersMap.set(data.time, []);
                  }
                  slMarkersMap.get(data.time)!.push({
                    time: data.time,
                    position: "belowBar",
                    color: colors.slIndicator,
                    shape: "circle",
                    text: `SL: ${data.SL.toFixed(2)}`,
                    size: 1.2,
                  });
                }
                // Don't add NB marker when newBase <= 0
              }
            }
          });

          // Apply SL markers to chart
          const slMarkersData = Array.from(slMarkersMap.values()).flat();
          if (slMarkersData.length > 0 && slMarkersPluginRef.current) {
            slMarkersPluginRef.current.setMarkers(slMarkersData);
            console.log(
              `✅ Coordinated SL Indicators Created: ${slMarkersData.length} SL markers from ${chartData.length} data points`
            );
          } else if (slMarkersPluginRef.current) {
            slMarkersPluginRef.current.setMarkers([]);
          }

          // Apply New Base markers to chart
          const newBaseMarkersData = Array.from(
            newBaseMarkersMap.values()
          ).flat();
          if (
            newBaseMarkersData.length > 0 &&
            newBaseMarkersPluginRef.current
          ) {
            newBaseMarkersPluginRef.current.setMarkers(newBaseMarkersData);
            console.log(
              `✅ Coordinated New Base Indicators Created: ${newBaseMarkersData.length} New Base markers from ${chartData.length} data points`
            );
          } else if (newBaseMarkersPluginRef.current) {
            newBaseMarkersPluginRef.current.setMarkers([]);
          }
        } catch (error) {
          console.error("❌ Error creating coordinated indicators:", error);
        }

        // STABILITY: View state restoration is now handled in the calling useEffect
      },
      [showSLIndicators, showNewBaseIndicators, colors]
    );

    // CHART STABILITY: Enhanced data loading with perfect view state preservation
    const loadData = useCallback(async () => {
      // STABILITY: Preserve view state before any data operations
      const viewState = chartRef.current
        ? preserveChartViewState(chartRef.current)
        : null;

      try {
        setChartState((prev) => ({ ...prev, isLoading: true, error: null }));

        const chartData = await loadRkbData();
        if (chartData.length === 0) {
          setChartState((prev) => ({
            ...prev,
            isLoading: false,
            error: "No data available",
          }));
          return;
        }

        // Calculate professional indicators
        const smaData = calculateSMA(chartData, 20);
        const emaData = calculateEMA(chartData, 20);
        const rsiData = calculateRSI(chartData, 14);
        const macdData = calculateMACD(chartData, 12, 26, 9);

        // DATETIME FIX: Update timestamp to datetime lookup map for hover functionality
        timestampToDatetimeMap.current.clear();
        chartData.forEach((item) => {
          if (item.originalDatetime) {
            timestampToDatetimeMap.current.set(
              item.time,
              item.originalDatetime
            );
          }
        });

        // Set candlestick data for right scale
        if (candlestickSeriesRef.current) {
          candlestickSeriesRef.current.setData(chartData);
        }

        // Set candlestick data for left scale (if enabled)
        if (enableTwoScale && candlestickLeftSeriesRef.current) {
          const leftScaleData = chartData.map((item) => ({
            ...item,
            open: item.open * 0.98,
            high: item.high * 0.98,
            low: item.low * 0.98,
            close: item.close * 0.98,
          }));
          candlestickLeftSeriesRef.current.setData(leftScaleData);
        }

        // Set volume data with color coding
        if (volumeSeriesRef.current) {
          const volumeData = chartData.map((item) => ({
            time: item.time,
            value: item.volume || 0,
            color: item.close >= item.open ? colors.upColor : colors.downColor,
          }));
          volumeSeriesRef.current.setData(volumeData);
        }

        // Set professional indicator data
        if (smaSeriesRef.current) {
          smaSeriesRef.current.setData(smaData);
        }

        if (emaSeriesRef.current) {
          emaSeriesRef.current.setData(emaData);
        }

        if (rsiSeriesRef.current) {
          rsiSeriesRef.current.setData(rsiData);
        }

        if (macdSeriesRef.current && macdData.histogram) {
          const histogramData = macdData.histogram.map((item) => ({
            time: item.time,
            value: item.value,
            color: item.value >= 0 ? colors.upColor : colors.downColor,
          }));
          macdSeriesRef.current.setData(histogramData);
        }

        if (macdLineSeriesRef.current && macdData.macdLine) {
          macdLineSeriesRef.current.setData(macdData.macdLine);
        }

        if (signalLineSeriesRef.current && macdData.signalLine) {
          signalLineSeriesRef.current.setData(macdData.signalLine);
        }

        // Set custom plotline indicator with colored segments
        if (chartRef.current) {
          createColoredPlotlineSegments(chartData);
        }

        // Note: Decision signals are now handled by triangle markers only

        // Create triangle markers from chart data decisions
        if (chartRef.current) {
          createDecisionTriangles(chartData);
        }

        // NEW INDICATORS: Create coordinated SL and New Base indicators
        if ((showSLIndicators || showNewBaseIndicators) && chartRef.current) {
          createCoordinatedIndicators(chartData);
        }

        // TECHNICAL INDICATORS: Create support and resistance lines
        if (technicalIndicators && chartRef.current) {
          createTechnicalIndicatorLines(chartData);
        }

        // Update current price and change with proper calculations
        if (chartData.length > 0) {
          const latest = chartData[chartData.length - 1];
          const previous = chartData[chartData.length - 2];

          setChartState((prev) => ({
            ...prev,
            currentPrice: latest.close,
            priceChange: latest.close - previous.close,
            priceChangePercent:
              ((latest.close - previous.close) / previous.close) * 100,
            currentTrend: latest.trend || null,
            currentDecision: latest.decision || null,
            lastUpdate: new Date(),
          }));

          // CHART STABILITY: Enhanced view state management for smooth user experience
          if (chartRef.current) {
            if (currentChartData.current.length === 0) {
              // This is the first load - set initial zoom to show last 50 bars with smooth animation
              const timeScale = chartRef.current.timeScale();
              const startIndex = Math.max(0, chartData.length - 50);
              const startTime = chartData[startIndex].time;
              const endTime = chartData[chartData.length - 1].time;

              try {
                // Use requestAnimationFrame for smooth initial zoom
                requestAnimationFrame(() => {
                  if (chartRef.current) {
                    const timeScale = chartRef.current.timeScale();
                    timeScale.setVisibleRange({
                      from: startTime,
                      to: endTime,
                    });
                  }
                });
              } catch (error) {
                console.warn("Error setting initial zoom level:", error);
                try {
                  timeScale.fitContent();
                } catch (fitError) {
                  console.warn("Error with fitContent fallback:", fitError);
                }
              }
            } else {
              // This is a data refresh - restore the preserved view state
              // STABILITY: Data refresh completed - restoring user's view position
              if (viewState && chartRef.current) {
                // Use setTimeout to ensure data is fully rendered before restoring view
                setTimeout(() => {
                  restoreChartViewState(chartRef.current, viewState);
                }, 50);
              }
            }
          }
        }

        setChartState((prev) => ({ ...prev, isLoading: false }));
        // OPTIMIZATION: Mark initial data load as complete
        initialDataLoaded.current = true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load chart data";
        setChartState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    }, [
      enableTwoScale,
      showDecisionSignals,
      showPlotline,
      colors,
      technicalIndicators,
      showSLIndicators,
      showNewBaseIndicators,
    ]); // FIXED: Remove function dependencies to prevent unnecessary re-executions

    // CHART STABILITY: Initialize chart on mount with enhanced stability
    // Only initialize once when component mounts - never reinitialize for theme changes
    useEffect(() => {
      if (!chartContainerRef.current || chartRef.current) return; // Don't reinitialize if already exists

      // STABILITY: Chart initializing once on component mount
      const cleanup = initializeChart();
      return cleanup;
    }, []); // Remove initializeChart dependency to prevent unnecessary re-initialization

    // CHART STABILITY: Handle prop changes without reinitializing the chart
    useEffect(() => {
      if (!chartRef.current) return;

      // STABILITY: Updating chart options without reinitializing

      // Update chart options that can change without reinitializing
      chartRef.current.applyOptions({
        grid: {
          vertLines: {
            visible: showGrid,
          },
          horzLines: {
            visible: showGrid,
          },
        },
        crosshair: {
          mode: showCrosshair ? CrosshairMode.Normal : CrosshairMode.Hidden,
        },
        leftPriceScale: {
          visible: enableTwoScale,
        },
      });
    }, [showGrid, showCrosshair, enableTwoScale]);

    // Load data when chart is ready
    useEffect(() => {
      if (chartRef.current && !initialDataLoaded.current) {
        // Only load data if chart is ready and initial load hasn't been completed yet
        loadData();
        initialDataLoaded.current = true;
      }
    }, []); // Remove loadData dependency to prevent unnecessary re-loading

    // CHART STABILITY: Enhanced theme update with perfect view state preservation
    // This effect handles theme changes without any visual disruption to user's zoom/scroll position
    useEffect(() => {
      if (!chartRef.current) return;

      // BUG FIX: Enhanced safety check to prevent disposal errors
      try {
        chartRef.current.timeScale();
      } catch {
        console.warn("Chart is disposed, skipping theme update");
        return;
      }

      // OPTIMIZATION: Skip if theme change is already in progress
      if (isThemeChanging.current) return;

      // OPTIMIZATION: Skip if initial data load hasn't been completed yet
      if (!initialDataLoaded.current) return;

      // STABILITY: Theme change detected - preserving chart position

      // TRADINGVIEW-LIKE: Create viewport lock for theme change
      const themeViewportLock = createViewportLock();

      // STABILITY: Mark theme change as in progress
      isThemeChanging.current = true;

      // Batch all theme updates in a single operation to prevent flickering
      const themeUpdateOptions = {
        layout: {
          background: {
            type: ColorType.Solid,
            color: colors.background,
          },
          textColor: colors.text,
        },
        grid: {
          vertLines: {
            color: colors.grid,
            style: LineStyle.Solid,
          },
          horzLines: {
            color: colors.grid,
            style: LineStyle.Solid,
          },
        },
        crosshair: {
          vertLine: {
            color: colors.crosshair,
            style: LineStyle.Solid,
          },
          horzLine: {
            color: colors.crosshair,
            style: LineStyle.Solid,
          },
        },
        rightPriceScale: {
          borderColor: colors.grid,
        },
        leftPriceScale: {
          borderColor: colors.grid,
        },
        timeScale: {
          borderColor: colors.grid,
        },
      };

      // Apply all theme changes in one operation
      chartRef.current.applyOptions(themeUpdateOptions);

      // Update all series colors in batch operations for smooth transition
      const seriesUpdates = [
        {
          series: candlestickSeriesRef.current,
          options: {
            upColor: colors.upColor,
            downColor: colors.downColor,
            wickUpColor: colors.upColor,
            wickDownColor: colors.downColor,
          },
        },
        {
          series: candlestickLeftSeriesRef.current,
          options: {
            upColor: colors.upColor,
            downColor: colors.downColor,
            wickUpColor: colors.upColor,
            wickDownColor: colors.downColor,
          },
        },
        {
          series: volumeSeriesRef.current,
          options: { color: colors.volume },
        },
        {
          series: smaSeriesRef.current,
          options: { color: colors.sma },
        },
        {
          series: emaSeriesRef.current,
          options: { color: colors.ema },
        },
        {
          series: rsiSeriesRef.current,
          options: { color: colors.rsi },
        },
        {
          series: macdSeriesRef.current,
          options: { color: colors.macd },
        },
        {
          series: macdLineSeriesRef.current,
          options: { color: colors.macd },
        },
        {
          series: signalLineSeriesRef.current,
          options: { color: colors.signal },
        },
      ];

      // Apply series color updates efficiently
      seriesUpdates.forEach(({ series, options }) => {
        if (series) {
          try {
            series.applyOptions(options);
          } catch (error) {
            console.warn("Error updating series colors:", error);
          }
        }
      });

      // STABILITY: Update plotline and decision signals while position is locked
      // OPTIMIZATION: Only update if there's actual data to work with
      if (
        (showPlotline || showDecisionSignals) &&
        currentChartData.current.length > 0
      ) {
        // Update plotline segments with new theme colors if data exists
        if (
          currentChartData.current.some(
            (item) => item.plotline !== undefined && !isNaN(item.plotline)
          )
        ) {
          createColoredPlotlineSegments(currentChartData.current);
        }

        // Update decision triangles with new theme colors if data exists
        if (
          currentChartData.current.some(
            (item) => item.decision === "BUYYES" || item.decision === "SELLYES"
          )
        ) {
          createDecisionTriangles(currentChartData.current);
        }

        // NEW INDICATORS: Update coordinated indicators with new theme colors if enabled and data exists
        if (
          (showSLIndicators || showNewBaseIndicators) &&
          currentChartData.current.some(
            (item) =>
              (item.decision === "BUYYES" || item.decision === "SELLYES") &&
              item.SL
          )
        ) {
          createCoordinatedIndicators(currentChartData.current);
        }

        // TECHNICAL INDICATORS: Update support and resistance lines with new theme colors
        if (technicalIndicators && currentChartData.current.length > 0) {
          createTechnicalIndicatorLines(currentChartData.current);
        }
      }

      // STABILITY: Unlock chart position after all theme operations are complete
      setTimeout(() => {
        // STABILITY: Mark theme change as complete
        isThemeChanging.current = false;

        // TRADINGVIEW-LIKE: Restore viewport after theme change
        if (themeViewportLock) {
          themeViewportLock.restore();
        }

        // STABILITY: Theme change completed successfully with position preserved
      }, 150); // Increased delay to ensure all operations are complete
    }, [
      colors,
      showPlotline,
      showDecisionSignals,
      technicalIndicators,
      showSLIndicators,
      showNewBaseIndicators,
    ]); // FIXED: Remove function dependencies to prevent unnecessary re-executions

    /**
     * CHART STABILITY: Enhanced auto-refresh functionality with perfect view state preservation
     * Automatically fetches fresh data from the API at specified intervals
     * while maintaining user's exact zoom and scroll position
     */
    useEffect(() => {
      // Skip auto-refresh if disabled
      if (!autoRefresh) return;

      // Set up interval for periodic data refresh with view state preservation
      const interval = setInterval(async () => {
        if (!chartRef.current) return;

        try {
          // STABILITY: Preserve view state before data refresh
          const viewState = preserveChartViewState(chartRef.current);

          console.log(
            "🔄 Auto-refreshing chart data with view state preservation..."
          );
          await loadData();

          // STABILITY: Restore view state after data refresh
          setTimeout(() => {
            restoreChartViewState(chartRef.current, viewState);
          }, 100); // Small delay to ensure data is fully loaded
        } catch (error) {
          console.error("❌ Error during auto-refresh:", error);
        }
      }, refreshInterval);

      // Cleanup interval on component unmount or dependency change
      return () => {
        clearInterval(interval);
        console.log("🛑 Auto-refresh interval cleared");
      };
    }, [autoRefresh, refreshInterval]); // FIXED: Remove function dependencies to prevent unnecessary re-executions

    // Note: Decision signals are now handled by triangle markers only - removed line series approach

    // TRADINGVIEW-LIKE: Plotline toggle with zero movement
    useEffect(() => {
      if (!chartRef.current || !currentChartData.current.length) return;

      // BUG FIX: Additional safety check to prevent disposal errors
      try {
        chartRef.current.timeScale();
      } catch {
        console.warn("Chart is disposed, skipping plotline toggle");
        return;
      }

      // OPTIMIZATION: Skip if initial data load hasn't been completed yet
      if (!initialDataLoaded.current) return;

      // OPTIMIZATION: Skip if theme change is in progress
      if (isThemeChanging.current) return;

      // TRADINGVIEW-LIKE: Create viewport lock before any operations
      const viewportLock = createViewportLock();
      if (!viewportLock) return;

      // Completely disable chart updates during operations
      chartRef.current.applyOptions({
        timeScale: {
          fixLeftEdge: true,
          fixRightEdge: true,
          lockVisibleTimeRangeOnResize: true,
        },
        handleScroll: {
          mouseWheel: false,
          pressedMouseMove: false,
          horzTouchDrag: false,
          vertTouchDrag: false,
        },
        handleScale: {
          axisPressedMouseMove: false,
          mouseWheel: false,
          pinch: false,
        }
      });

      // Clear existing plotline segments
      if (plotlineSegmentsRef.current.length > 0) {
        plotlineSegmentsRef.current.forEach((series) => {
          try {
            if (chartRef.current && series) {
              chartRef.current.removeSeries(series);
            }
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            if (errorMessage && !errorMessage.includes("disposed")) {
              console.warn(`Error removing plotline segment:`, errorMessage);
            }
          }
        });
      }
      plotlineSegmentsRef.current = [];

      // Recreate plotline segments if enabled
      if (showPlotline) {
        createColoredPlotlineSegments(currentChartData.current);
      }

      // TRADINGVIEW-LIKE: Immediate restoration and re-enable interactions
      viewportLock.restore();
      
      chartRef.current.applyOptions({
        timeScale: {
          fixLeftEdge: false,
          fixRightEdge: false,
          lockVisibleTimeRangeOnResize: true,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        }
      });

      // Final restoration to ensure perfect position
      setTimeout(() => viewportLock.restore(), 0);
    }, [showPlotline, createViewportLock]);

    // TRADINGVIEW-LIKE: Decision signals toggle with zero movement
    useEffect(() => {
      if (
        !chartRef.current ||
        !candlestickSeriesRef.current ||
        !currentChartData.current.length
      )
        return;

      // BUG FIX: Additional safety check to prevent disposal errors
      try {
        chartRef.current.timeScale();
      } catch {
        console.warn("Chart is disposed, skipping decision triangles toggle");
        return;
      }

      // OPTIMIZATION: Skip if initial data load hasn't been completed yet
      if (!initialDataLoaded.current) return;

      // OPTIMIZATION: Skip if theme change is in progress
      if (isThemeChanging.current) return;

      // TRADINGVIEW-LIKE: Create viewport lock before any operations
      const viewportLock = createViewportLock();
      if (!viewportLock) return;

      // Completely disable chart updates during operations
      chartRef.current.applyOptions({
        timeScale: {
          fixLeftEdge: true,
          fixRightEdge: true,
          lockVisibleTimeRangeOnResize: true,
        },
        handleScroll: {
          mouseWheel: false,
          pressedMouseMove: false,
          horzTouchDrag: false,
          vertTouchDrag: false,
        },
        handleScale: {
          axisPressedMouseMove: false,
          mouseWheel: false,
          pinch: false,
        }
      });

      if (showDecisionSignals) {
        // Create triangle markers if enabled using chart data
        createDecisionTriangles(currentChartData.current);
      } else {
        // Clear all decision markers when disabled
        if (seriesMarkersPluginRef.current) {
          seriesMarkersPluginRef.current.setMarkers([]);
        }
      }

      // TRADINGVIEW-LIKE: Immediate restoration and re-enable interactions
      viewportLock.restore();
      
      chartRef.current.applyOptions({
        timeScale: {
          fixLeftEdge: false,
          fixRightEdge: false,
          lockVisibleTimeRangeOnResize: true,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        }
      });

      // Final restoration to ensure perfect position
      setTimeout(() => viewportLock.restore(), 0);
    }, [showDecisionSignals, createViewportLock]);

    // Handle enableTwoScale prop changes - toggle left price scale visibility
    // CHART STABILITY: Preserve zoom and scroll state during two-scale mode changes
    useEffect(() => {
      if (!chartRef.current) return;

      // BUG FIX: Additional safety check to prevent disposal errors
      try {
        chartRef.current.timeScale();
      } catch {
        console.warn("Chart is disposed, skipping two-scale toggle");
        return;
      }

      // OPTIMIZATION: Only perform operations if there's an actual change
      const currentTwoScaleState = candlestickLeftSeriesRef.current !== null;
      if (currentTwoScaleState === enableTwoScale) return; // Skip if state is already correct

      // OPTIMIZATION: Skip if no chart data available for two-scale operations
      if (enableTwoScale && currentChartData.current.length === 0) return;

      // OPTIMIZATION: Skip if initial data load hasn't been completed yet
      if (!initialDataLoaded.current) return;

      // OPTIMIZATION: Skip if theme change is in progress
      if (isThemeChanging.current) return;

      // Store current view state using utility function
      const viewState = preserveChartViewState(chartRef.current);

      // Update left price scale visibility without affecting chart view
      chartRef.current.applyOptions({
        leftPriceScale: {
          borderColor: colors.grid,
          visible: enableTwoScale,
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
      });

      // Handle left scale candlestick series
      if (
        enableTwoScale &&
        !candlestickLeftSeriesRef.current &&
        currentChartData.current.length > 0
      ) {
        // Create left scale candlestick series if enabled and not exists
        try {
          candlestickLeftSeriesRef.current = chartRef.current.addSeries(
            CandlestickSeries,
            {
              priceScaleId: "left",
              upColor: colors.upColor,
              downColor: colors.downColor,
              borderVisible: false,
              wickUpColor: colors.upColor,
              wickDownColor: colors.downColor,
            }
          );

          // Set data for left scale with slight offset for demonstration
          const leftScaleData = currentChartData.current.map((item) => ({
            ...item,
            open: item.open * 0.98,
            high: item.high * 0.98,
            low: item.low * 0.98,
            close: item.close * 0.98,
          }));
          candlestickLeftSeriesRef.current.setData(leftScaleData);
        } catch (error) {
          console.warn("Error creating left scale series:", error);
        }
      } else if (!enableTwoScale && candlestickLeftSeriesRef.current) {
        // Remove left scale candlestick series if disabled
        try {
          chartRef.current.removeSeries(candlestickLeftSeriesRef.current);
          candlestickLeftSeriesRef.current = null;
        } catch (error) {
          console.warn("Error removing left scale series:", error);
        }
      }

      // Restore exact view state using utility function
      restoreChartViewState(chartRef.current, viewState);
    }, [
      enableTwoScale,
      colors,
      showSLIndicators,
      showNewBaseIndicators,
      createCoordinatedIndicators,
    ]);

    // Note: Decision signals are now handled by triangle markers only - removed line series approach

    return (
      <div className={`relative w-full ${className}`}>
        {/* Custom CSS for xs breakpoint */}
        <style jsx>{`
          @media (min-width: 475px) {
            .xs\\:inline {
              display: inline !important;
            }
            .xs\\:block {
              display: block !important;
            }
          }
        `}</style>

        {/* Professional loading overlay */}
        {chartState.isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 sm:space-x-3 text-white p-2 sm:p-0">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-medium">
                  Loading chart data...
                </span>
                <span className="text-xs text-gray-300 hidden sm:block">
                  Fetching latest market data
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Professional error overlay */}
        {chartState.error && (
          <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center z-10 p-4">
            <div className="bg-red-500 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-sm sm:text-base">Error</span>
              </div>
              <p className="text-xs sm:text-sm mt-1">{chartState.error}</p>
            </div>
          </div>
        )}
        {/* Professional status indicators */}
        <div className="absolute top-4 left-4 z-10 space-y-2">
          {/* OHLC Data Display on Hover */}
          {hoveredOHLC && (
            <div
              className={`px-3 py-2 rounded-lg shadow-lg font-urbanist ${
                theme === "dark"
                  ? "bg-gray-800/95 text-gray-100 border border-gray-700"
                  : "bg-white/95 text-gray-800 border border-gray-200"
              }`}
            >
              <div
                className={`text-xs font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                OHLC Data
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }
                >
                  Date:
                </div>
                <div>{hoveredOHLC.time}</div>

                <div
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }
                >
                  Open:
                </div>
                <div>₹{hoveredOHLC.open.toFixed(2)}</div>

                <div
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }
                >
                  High:
                </div>
                <div
                  className={
                    theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                  }
                >
                  ₹{hoveredOHLC.high.toFixed(2)}
                </div>

                <div
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }
                >
                  Low:
                </div>
                <div
                  className={theme === "dark" ? "text-red-400" : "text-red-600"}
                >
                  ₹{hoveredOHLC.low.toFixed(2)}
                </div>

                <div
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }
                >
                  Close:
                </div>
                <div>₹{hoveredOHLC.close.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Professional chart container */}
        <div
          ref={chartContainerRef}
          className="w-full h-full min-h-[300px] sm:min-h-[400px] relative"
          style={{
            height: `${height}px`,
            width: width ? `${width}px` : "100%",
            minHeight: "300px",
            touchAction: "manipulation", // Enable touch interactions on mobile
            WebkitUserSelect: "none", // Prevent text selection on mobile
            userSelect: "none", // Prevent text selection on mobile
            WebkitTouchCallout: "none", // Disable callout on mobile
            WebkitTapHighlightColor: "transparent", // Remove tap highlight on mobile
            cursor: "pointer", // Show pointer cursor to indicate interactivity
            position: "relative", // Ensure proper positioning for touch events
            zIndex: 1, // Ensure chart container is above other elements
            WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS
            WebkitTransform: "translateZ(0)", // Force hardware acceleration on mobile
            WebkitBackfaceVisibility: "hidden", // Optimize mobile performance
            WebkitPerspective: "1000px", // Enable 3D transforms for mobile
            WebkitFontSmoothing: "antialiased", // Improve text rendering on mobile
            WebkitAppearance: "none", // Remove default mobile styling
            WebkitBoxSizing: "border-box", // Ensure proper box sizing on mobile
            WebkitMarginStart: "0", // Ensure proper margin handling on mobile
          }}
        />
      </div>
    );
  }
);

StockChart.displayName = "StockChart";

export default StockChart;
