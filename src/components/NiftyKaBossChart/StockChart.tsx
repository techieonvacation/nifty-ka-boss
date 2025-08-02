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
} from "lightweight-charts";
import {
  fetchRkbData,
  convertRkbDataToChartData,
  getDecisionSignals,
} from "@/lib/api/rkb";

// Enhanced TypeScript interfaces for better type safety
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

export interface StockChartRef {
  chartRef: React.RefObject<HTMLDivElement>;
  chart: IChartApi | null;
  refresh: () => Promise<void>;
  getCurrentData: () => ChartData[];
}

// Performance optimization constants
const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 150,
  REFRESH_INTERVAL: 30000,
  MAX_DATA_POINTS: 1000,
  ANIMATION_DURATION: 300,
} as const;

// Professional color scheme for different themes
const THEME_COLORS = {
  dark: {
    background: "#0f0f23",
    text: "#ffffff",
    grid: "#2a2a3c",
    crosshair: "#3b82f6",
    upColor: "#00d4aa",
    downColor: "#ff4757",
    volume: "#3b82f6",
    sma: "#f59e0b",
    ema: "#8b5cf6",
    rsi: "#ec4899",
    macd: "#3b82f6",
    signal: "#ef4444",
    plotline: "#ff6b35",
    buySignal: "#00ff88",
    sellSignal: "#ff4757",
  },
  light: {
    background: "#ffffff",
    text: "#1f2937",
    grid: "#e5e7eb",
    crosshair: "#2563eb",
    upColor: "#10b981",
    downColor: "#ef4444",
    volume: "#3b82f6",
    sma: "#f59e0b",
    ema: "#8b5cf6",
    rsi: "#ec4899",
    macd: "#3b82f6",
    signal: "#ef4444",
    plotline: "#ff6b35",
    buySignal: "#00ff88",
    sellSignal: "#ff4757",
  },
} as const;

const StockChart = forwardRef<StockChartRef, StockChartProps>(
  (
    {
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
    },
    ref
  ) => {
    // Chart references with proper typing
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const candlestickLeftSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const emaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const macdSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const macdLineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const signalLineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const plotlineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const plotlineSegmentsRef = useRef<ISeriesApi<"Line">[]>([]);
    const decisionSignalsRef = useRef<ISeriesApi<"Line">[]>([]);

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

    // Memoized color scheme for performance
    const colors = useMemo(() => THEME_COLORS[theme], [theme]);

    // Expose ref to parent with enhanced functionality
    useImperativeHandle(ref, () => ({
      chartRef: chartContainerRef,
      chart: chartRef.current,
      refresh: loadData,
      getCurrentData: () => currentChartData.current,
    }));

    // Store current chart data for external access
    const currentChartData = useRef<ChartData[]>([]);

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

    // Enhanced RKB data loading with error handling and caching
    const loadRkbData = useCallback(async (): Promise<ChartData[]> => {
      try {
        const rkbData = await fetchRkbData();
        const chartData = convertRkbDataToChartData(rkbData);

        // Limit data points for performance
        const limitedData = chartData
          .slice(-PERFORMANCE_CONFIG.MAX_DATA_POINTS)
          .map((item) => ({
            ...item,
            time: item.time as UTCTimestamp,
          }));

        currentChartData.current = limitedData;
        return limitedData;
      } catch (error) {
        console.error("Error loading RKB data:", error);
        setChartState(prev => ({ ...prev, error: "Failed to load chart data" }));
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
        let ema = data.slice(0, period).reduce((acc, item) => acc + item.close, 0) / period;
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
        let avgGain = gains.slice(0, period).reduce((acc, gain) => acc + gain, 0) / period;
        let avgLoss = losses.slice(0, period).reduce((acc, loss) => acc + loss, 0) / period;

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
          const macdValue = ema12[i + (slowPeriod - fastPeriod)]?.value - ema26[i].value;
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
          const histogramValue = macdLine[i + (signalPeriod - 1)]?.value - signalEMA[i].value;
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
        if (!chartRef.current || !showPlotline || !chartContainerRef.current) return;

        // Clear existing segments
        plotlineSegmentsRef.current.forEach((series) => {
          try {
            if (chartRef.current && series) {
              chartRef.current.removeSeries(series);
            }
          } catch (error) {
            console.warn("Error removing plotline segment:", error);
          }
        });
        plotlineSegmentsRef.current = [];

        if (!chartData || chartData.length === 0) return;

        const plotlineData = chartData.filter(
          (item) => item.plotline !== undefined && !isNaN(item.plotline)
        );
        if (plotlineData.length === 0) return;

        let currentTrend = plotlineData[0].trend || "NEUTRAL";
        let segmentStart = 0;

        // Create colored segments based on trend changes
        for (let i = 1; i < plotlineData.length; i++) {
          const currentItem = plotlineData[i];
          const previousItem = plotlineData[i - 1];

          if (currentItem.trend !== previousItem.trend) {
            if (i > segmentStart) {
              const segmentData = plotlineData.slice(segmentStart, i).map((item) => ({
                time: item.time,
                value: item.plotline!,
              }));

              const trendUpper = (previousItem.trend || "NEUTRAL").toUpperCase();
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
                  title: `RKB Plotline ${currentTrend}`,
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

          const trendUpper = (plotlineData[plotlineData.length - 1].trend || "NEUTRAL").toUpperCase();
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
              title: `RKB Plotline ${currentTrend}`,
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
      },
      [showPlotline, colors]
    );

    // Enhanced decision signals with professional triangle indicators
    const createDecisionSignals = useCallback(
      (chartData: ChartData[]) => {
        if (!chartRef.current || !showDecisionSignals || !chartContainerRef.current) return;

        // Clear existing decision signals
        decisionSignalsRef.current.forEach((series) => {
          try {
            if (chartRef.current && series) {
              chartRef.current.removeSeries(series);
            }
          } catch (error) {
            console.warn("Error removing decision signal:", error);
          }
        });
        decisionSignalsRef.current = [];

        if (!chartData || chartData.length === 0) return;

        // Get decision signals from the data
        const decisionSignals = getDecisionSignals(
          chartData.map((data) => ({
            ...data,
            volume: data.volume || 0,
          }))
        );
        if (decisionSignals.length === 0) return;

        // Group signals by type for better visualization
        const buySignals = decisionSignals.filter((signal) => signal.shape === "triangleUp");
        const sellSignals = decisionSignals.filter((signal) => signal.shape === "triangleDown");

        // Create buy signal series (triangle up)
        if (buySignals.length > 0) {
          try {
            const buySeries = chartRef.current!.addSeries(LineSeries, {
              color: colors.buySignal,
              lineWidth: 1,
              title: "BUY Signals",
              crosshairMarkerVisible: true,
              priceLineVisible: false,
              lastValueVisible: false,
            });

            const buyData = buySignals.map((signal) => ({
              time: signal.time as UTCTimestamp,
              value: signal.price + (signal.price * 0.003),
            }));

            buySeries.setData(buyData);
            decisionSignalsRef.current.push(buySeries);
          } catch (error) {
            console.warn("Error creating buy signals:", error);
          }
        }

        // Create sell signal series (triangle down)
        if (sellSignals.length > 0) {
          try {
            const sellSeries = chartRef.current!.addSeries(LineSeries, {
              color: colors.sellSignal,
              lineWidth: 1,
              title: "SELL Signals",
              crosshairMarkerVisible: true,
              priceLineVisible: false,
              lastValueVisible: false,
            });

            const sellData = sellSignals.map((signal) => ({
              time: signal.time as UTCTimestamp,
              value: signal.price - (signal.price * 0.003),
            }));

            sellSeries.setData(sellData);
            decisionSignalsRef.current.push(sellSeries);
          } catch (error) {
            console.warn("Error creating sell signals:", error);
          }
        }
      },
      [showDecisionSignals, colors]
    );

    // Professional chart initialization with optimized options
    const initializeChart = useCallback(() => {
      if (!chartContainerRef.current) return;

      const chartOptions = {
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
          },
          horzLine: {
            color: colors.crosshair,
            style: LineStyle.Solid,
          },
        },
        rightPriceScale: {
          borderColor: colors.grid,
          visible: true,
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
        leftPriceScale: {
          borderColor: colors.grid,
          visible: enableTwoScale,
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
        timeScale: {
          borderColor: colors.grid,
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 12,
          barSpacing: 6,
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
        watermark: {
          visible: false,
        },
      };

      chartRef.current = createChart(chartContainerRef.current, chartOptions);

      // Create candlestick series for right scale
      candlestickSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
        upColor: colors.upColor,
        downColor: colors.downColor,
        borderVisible: false,
        wickUpColor: colors.upColor,
        wickDownColor: colors.downColor,
        title: "Price (Right)",
      });

      // Create candlestick series for left scale (if enabled)
      if (enableTwoScale) {
        candlestickLeftSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
          priceScaleId: "left",
          upColor: colors.upColor,
          downColor: colors.downColor,
          borderVisible: false,
          wickUpColor: colors.upColor,
          wickDownColor: colors.downColor,
          title: "Price (Left)",
        });
      }

      // Create volume series if enabled
      if (showVolume) {
        volumeSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
          color: colors.volume,
          priceFormat: {
            type: "volume",
          },
          priceScaleId: "volume",
        });

        const volumePriceScale = chartRef.current.priceScale("volume");
        if (volumePriceScale) {
          volumePriceScale.applyOptions({
            scaleMargins: {
              top: 0.8,
              bottom: 0,
            },
          });
        }
      }

      // Create professional indicators if enabled
      if (showIndicators) {
        // SMA series (Simple Moving Average)
        smaSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.sma,
          lineWidth: 2,
          title: "SMA 20",
        });

        // EMA series (Exponential Moving Average)
        emaSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.ema,
          lineWidth: 2,
          title: "EMA 20",
        });

        // RSI series (Relative Strength Index)
        rsiSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.rsi,
          lineWidth: 2,
          title: "RSI",
          priceScaleId: "rsi",
        });

        const rsiPriceScale = chartRef.current.priceScale("rsi");
        if (rsiPriceScale) {
          rsiPriceScale.applyOptions({
            scaleMargins: {
              top: 0.6,
              bottom: 0.2,
            },
          });
        }

        // MACD series (Moving Average Convergence Divergence)
        macdSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
          color: colors.macd,
          title: "MACD Histogram",
          priceScaleId: "macd",
        });

        const macdPriceScale = chartRef.current.priceScale("macd");
        if (macdPriceScale) {
          macdPriceScale.applyOptions({
            scaleMargins: {
              top: 0.8,
              bottom: 0,
            },
          });
        }

        macdLineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.macd,
          lineWidth: 2,
          title: "MACD Line",
          priceScaleId: "macd",
        });

        signalLineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.signal,
          lineWidth: 2,
          title: "Signal Line",
          priceScaleId: "macd",
        });
      }

      // Create plotline indicator if enabled
      if (showPlotline) {
        plotlineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: colors.plotline,
          lineWidth: 2,
          title: "RKB Plotline",
          lineType: 1,
          crosshairMarkerVisible: true,
          priceLineVisible: true,
          priceLineWidth: 2,
          priceLineColor: colors.plotline,
          lastValueVisible: true,
        });
      }

      // Add resize listener
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }
        if (chartRef.current) {
          chartRef.current.remove();
        }
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
    ]);

    // Enhanced data loading with proper error handling and state management
    const loadData = useCallback(async () => {
      try {
        setChartState(prev => ({ ...prev, isLoading: true, error: null }));

        const chartData = await loadRkbData();
        if (chartData.length === 0) {
          setChartState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: "No data available" 
          }));
          return;
        }

        // Calculate professional indicators
        const smaData = calculateSMA(chartData, 20);
        const emaData = calculateEMA(chartData, 20);
        const rsiData = calculateRSI(chartData, 14);
        const macdData = calculateMACD(chartData, 12, 26, 9);

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
        if (showPlotline && chartRef.current) {
          createColoredPlotlineSegments(chartData);
        }

        // Set custom decision signals with triangle indicators
        if (showDecisionSignals && chartRef.current) {
          createDecisionSignals(chartData);
        }

        // Update current price and change with proper calculations
        if (chartData.length > 0) {
          const latest = chartData[chartData.length - 1];
          const previous = chartData[chartData.length - 2];

          setChartState(prev => ({
            ...prev,
            currentPrice: latest.close,
            priceChange: latest.close - previous.close,
            priceChangePercent: ((latest.close - previous.close) / previous.close) * 100,
            currentTrend: latest.trend || null,
            currentDecision: latest.decision || null,
            lastUpdate: new Date(),
          }));
        }

        // Fit content to view for optimal display
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent();
        }

        setChartState(prev => ({ ...prev, isLoading: false }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load chart data";
        setChartState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorMessage 
        }));
      }
    }, [
      loadRkbData,
      calculateSMA,
      calculateEMA,
      calculateRSI,
      calculateMACD,
      enableTwoScale,
      createColoredPlotlineSegments,
      createDecisionSignals,
      colors,
    ]);

    // Initialize chart on mount
    useEffect(() => {
      const cleanup = initializeChart();
      return cleanup;
    }, [initializeChart]);

    // Load data when chart is ready
    useEffect(() => {
      if (chartRef.current) {
        loadData();
      }
    }, [loadData]);

    // Update theme when it changes
    useEffect(() => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
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
            },
            horzLines: {
              color: colors.grid,
            },
          },
          crosshair: {
            vertLine: {
              color: colors.crosshair,
            },
            horzLine: {
              color: colors.crosshair,
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
        });
      }
    }, [colors]);

    // Auto-refresh functionality
    useEffect(() => {
      if (!autoRefresh) return;

      const interval = setInterval(async () => {
        try {
          await loadData();
        } catch (error) {
          console.error("Error during auto-refresh:", error);
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, loadData]);

    return (
      <div className={`relative ${className}`}>
        {/* Professional loading overlay */}
        {chartState.isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="flex items-center space-x-3 text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Loading chart data...</span>
                <span className="text-xs text-gray-300">Fetching latest market data</span>
              </div>
            </div>
          </div>
        )}

        {/* Professional error overlay */}
        {chartState.error && (
          <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center z-10">
            <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Error</span>
              </div>
              <p className="text-sm mt-1">{chartState.error}</p>
            </div>
          </div>
        )}

        {/* Professional status indicators */}
        <div className="absolute top-4 left-4 z-20 space-y-2">

          {/* Current Price Indicator */}
          {chartState.currentPrice && (
            <div
              className={`px-3 py-1 rounded-lg shadow-lg font-urbanist flex items-center gap-x-2 ${
                theme === "dark"
                  ? "bg-gray-800/80 text-white border border-gray-600"
                  : "bg-white/80 text-gray-900 border border-gray-200"
              }`}
            >
              <div className="text-sm font-medium">
                ₹{chartState.currentPrice.toLocaleString()}
              </div>
              {chartState.priceChange && (
                <div className={`text-xs ${
                  chartState.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {chartState.priceChange >= 0 ? '+' : ''}
                  {chartState.priceChange.toFixed(2)} 
                  ({chartState.priceChangePercent?.toFixed(2)}%)
                </div>
              )}
            </div>
          )}

          {/* Trend Indicator */}
          {chartState.currentTrend && (
            <div
              className={`px-3 py-1 rounded-lg shadow-lg flex items-center gap-x-2 font-urbanist ${
                theme === "dark"
                  ? "bg-gray-800/80 text-white border border-gray-600"
                  : "bg-white/80 text-gray-900 border border-gray-200"
              }`}
            >
              <div className="text-sm font-medium font-urbanist">Trend</div>
              <div className={`text-xs font-urbanist ${
                chartState.currentTrend === 'BUY' ? 'text-green-400' : 
                chartState.currentTrend === 'SELL' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {chartState.currentTrend}
              </div>
            </div>
          )}
        </div>

        {/* Professional chart container */}
        <div
          ref={chartContainerRef}
          className="w-full h-full"
          style={{
            height: `${height}px`,
            width: width ? `${width}px` : "100%",
          }}
        />
      </div>
    );
  }
);

StockChart.displayName = "StockChart";

export default StockChart;
