"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
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
  enableTwoScale?: boolean; // New prop for two-scale feature
  showPlotline?: boolean; // New prop for plotline indicator
  showDecisionSignals?: boolean; // New prop for decision signals
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

export interface StockChartRef {
  chartRef: React.RefObject<HTMLDivElement>;
  chart: IChartApi | null;
}

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
      enableTwoScale = true, // Default to true for two-scale feature
      showPlotline = true, // Default to true for plotline indicator
      showDecisionSignals = true, // Default to true for decision signals
    },
    ref
  ) => {
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
    const decisionSignalsRef = useRef<ISeriesApi<"Line">[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [priceChange, setPriceChange] = useState<number | null>(null);
    const [priceChangePercent, setPriceChangePercent] = useState<number | null>(
      null
    );
    const [currentTrend, setCurrentTrend] = useState<string | null>(null);
    const [currentDecision, setCurrentDecision] = useState<string | null>(null);

    // Expose ref to parent
    useImperativeHandle(ref, () => ({
      chartRef: chartContainerRef,
      chart: chartRef.current,
    }));

    // Generate sample data for demonstration (fallback)
    const generateSampleData = useCallback(
      (days: number = 100): ChartData[] => {
        const data: ChartData[] = [];
        let basePrice = 19000; // Starting price for NIFTY
        const baseTime = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;

        for (let i = 0; i < days; i++) {
          const time = (baseTime + i * 24 * 60 * 60) as UTCTimestamp;
          const volatility = 0.02; // 2% daily volatility
          const change = (Math.random() - 0.5) * volatility * basePrice;
          const open = basePrice;
          const close = basePrice + change;
          const high =
            Math.max(open, close) + Math.random() * Math.abs(change) * 0.5;
          const low =
            Math.min(open, close) - Math.random() * Math.abs(change) * 0.5;
          const volume = Math.floor(Math.random() * 1000000) + 500000;

          data.push({
            time,
            open,
            high,
            low,
            close,
            volume,
          });

          basePrice = close;
        }

        return data;
      },
      []
    );

    // Load RKB data from API
    const loadRkbData = useCallback(async (): Promise<ChartData[]> => {
      try {
        const rkbData = await fetchRkbData();
        const chartData = convertRkbDataToChartData(rkbData);

        // Convert to UTCTimestamp format for lightweight-charts
        return chartData.map((item) => ({
          ...item,
          time: item.time as UTCTimestamp,
        }));
      } catch (error) {
        console.error("Error loading RKB data:", error);
        // Fallback to sample data if API fails
        return generateSampleData(100);
      }
    }, [generateSampleData]);

    // Calculate SMA (Simple Moving Average)
    const calculateSMA = useCallback(
      (data: ChartData[], period: number = 20): IndicatorData[] => {
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

    // Calculate EMA (Exponential Moving Average)
    const calculateEMA = useCallback(
      (data: ChartData[], period: number = 20): IndicatorData[] => {
        const emaData: IndicatorData[] = [];
        const multiplier = 2 / (period + 1);

        if (data.length === 0) return emaData;

        // First EMA value is SMA
        let ema =
          data.slice(0, period).reduce((acc, item) => acc + item.close, 0) /
          period;
        emaData.push({ time: data[period - 1].time, value: ema });

        for (let i = period; i < data.length; i++) {
          ema = data[i].close * multiplier + ema * (1 - multiplier);
          emaData.push({ time: data[i].time, value: ema });
        }

        return emaData;
      },
      []
    );

    // Calculate RSI (Relative Strength Index)
    const calculateRSI = useCallback(
      (data: ChartData[], period: number = 14): IndicatorData[] => {
        const rsiData: IndicatorData[] = [];

        if (data.length < period + 1) return rsiData;

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

        // Calculate RSI for remaining periods
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

    // Create colored plotline segments based on trend changes
    const createColoredPlotlineSegments = useCallback(
      (chartData: ChartData[]) => {
        if (!chartRef.current || !showPlotline || !chartContainerRef.current)
          return;

        // Clear existing segments with proper null checks
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

        let segmentStart = 0;

        for (let i = 1; i < plotlineData.length; i++) {
          const currentItem = plotlineData[i];
          const previousItem = plotlineData[i - 1];

          // Check if trend changed
          if (currentItem.trend !== previousItem.trend) {
            // Create segment for the previous trend
            if (i > segmentStart) {
              const segmentData = plotlineData
                .slice(segmentStart, i)
                .map((item) => ({
                  time: item.time,
                  value: item.plotline!,
                }));

              // Determine color based on trend
              const trendUpper = (
                previousItem.trend || "NEUTRAL"
              ).toUpperCase();
              const color =
                trendUpper === "BUY"
                  ? "#00ff88" // Bright green for BUY
                  : trendUpper === "SELL"
                  ? "#ff4757" // Bright red for SELL
                  : "#ff6b35"; // Bright orange for neutral

              // Create new series for this segment
              try {
                const segmentSeries = chartRef.current!.addSeries(LineSeries, {
                  color,
                  lineWidth: 2,
                  lineType: 1,
                  crosshairMarkerVisible: true,
                  priceLineVisible: false, // Hide price line for segments
                  lastValueVisible: false, // Hide last value for segments
                });

                segmentSeries.setData(segmentData);
                plotlineSegmentsRef.current.push(segmentSeries);
              } catch (error) {
                console.warn("Error creating plotline segment:", error);
              }
            }

            // Update for next segment
            segmentStart = i;
          }
        }

        // Create final segment
        if (segmentStart < plotlineData.length) {
          const segmentData = plotlineData.slice(segmentStart).map((item) => ({
            time: item.time,
            value: item.plotline!,
          }));

          const trendUpper = (
            plotlineData[plotlineData.length - 1].trend || "NEUTRAL"
          ).toUpperCase();
          const color =
            trendUpper === "BUY"
              ? "#00ff88" // Bright green for BUY
              : trendUpper === "SELL"
              ? "#ff4757" // Bright red for SELL
              : "#ff6b35"; // Bright orange for neutral

          try {
            const segmentSeries = chartRef.current!.addSeries(LineSeries, {
              color,
              lineWidth: 2,
              lineType: 1,
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
      [showPlotline]
    );

    // Create decision signals with triangle indicators
    const createDecisionSignals = useCallback(
      (chartData: ChartData[]) => {
        if (
          !chartRef.current ||
          !showDecisionSignals ||
          !chartContainerRef.current
        )
          return;

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
        const decisionSignals = getDecisionSignals(chartData.map(item => ({
          ...item,
          volume: item.volume || 0, // Ensure volume is always a number
        })));
        if (decisionSignals.length === 0) return;

        // Group signals by type for better visualization
        const buySignals = decisionSignals.filter(
          (signal) => signal.shape === "triangleUp"
        );
        const sellSignals = decisionSignals.filter(
          (signal) => signal.shape === "triangleDown"
        );

        // Create buy signal series (triangle up)
        if (buySignals.length > 0) {
          try {
            const buySeries = chartRef.current!.addSeries(LineSeries, {
              color: "#10b981", // Green
              lineWidth: 1, // No line, just markers
              title: "BUY Signals",
              crosshairMarkerVisible: true,
              priceLineVisible: false,
              lastValueVisible: false,
            });

            // Create triangle up markers
            const buyData = buySignals.map((signal) => ({
              time: signal.time as UTCTimestamp,
              value: signal.price,
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
              color: "#ef4444", // Red
              lineWidth: 1, // No line, just markers
              title: "SELL Signals",
              crosshairMarkerVisible: true,
              priceLineVisible: false,
              lastValueVisible: false,
            });

            // Create triangle down markers
            const sellData = sellSignals.map((signal) => ({
              time: signal.time as UTCTimestamp,
              value: signal.price,
            }));

            sellSeries.setData(sellData);
            decisionSignalsRef.current.push(sellSeries);
          } catch (error) {
            console.warn("Error creating sell signals:", error);
          }
        }
      },
      [showDecisionSignals]
    );

    // Calculate MACD
    const calculateMACD = useCallback(
      (
        data: ChartData[],
        fastPeriod: number = 12,
        slowPeriod: number = 26,
        signalPeriod: number = 9
      ) => {
        const ema12 = calculateEMA(data, fastPeriod);
        const ema26 = calculateEMA(data, slowPeriod);

        const macdLine: IndicatorData[] = [];
        // const signalLine: IndicatorData[] = [];
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

    // Initialize chart
    const initializeChart = useCallback(() => {
      if (!chartContainerRef.current) return;

      const chartOptions = {
        layout: {
          background: {
            type: ColorType.Solid,
            color: theme === "dark" ? "#1a1a1a" : "#ffffff",
          },
          textColor: theme === "dark" ? "#d1d5db" : "#374151",
        },
        grid: {
          vertLines: {
            color: theme === "dark" ? "#374151" : "#e5e7eb",
            style: LineStyle.Solid,
            visible: showGrid,
          },
          horzLines: {
            color: theme === "dark" ? "#374151" : "#e5e7eb",
            style: LineStyle.Solid,
            visible: showGrid,
          },
        },
        crosshair: {
          mode: showCrosshair ? CrosshairMode.Normal : CrosshairMode.Hidden,
          vertLine: {
            color: theme === "dark" ? "#3b82f6" : "#2563eb",
            style: LineStyle.Solid,
          },
          horzLine: {
            color: theme === "dark" ? "#3b82f6" : "#2563eb",
            style: LineStyle.Solid,
          },
        },
        rightPriceScale: {
          borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
          visible: true,
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
        leftPriceScale: {
          borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
          visible: enableTwoScale,
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
        timeScale: {
          borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
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

      // Create candlestick series for right scale (default)
      candlestickSeriesRef.current = chartRef.current.addSeries(
        CandlestickSeries,
        {
          upColor: "#10b981",
          downColor: "#ef4444",
          borderVisible: false,
          wickUpColor: "#10b981",
          wickDownColor: "#ef4444",
          title: "Price (Right)",
        }
      );

      // Create candlestick series for left scale (if two-scale enabled)
      if (enableTwoScale) {
        candlestickLeftSeriesRef.current = chartRef.current.addSeries(
          CandlestickSeries,
          {
            priceScaleId: "left",
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
            title: "Price (Left)",
          }
        );
      }

      // Create volume series if enabled
      if (showVolume) {
        volumeSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
          color: "#3b82f6",
          priceFormat: {
            type: "volume",
          },
          priceScaleId: "volume",
        });

        // Set price scale options for volume
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

      // Create indicators if enabled
      if (showIndicators) {
        // SMA series (right scale)
        smaSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: "#f59e0b",
          lineWidth: 2,
          title: "SMA 20",
        });

        // EMA series (right scale)
        emaSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: "#8b5cf6",
          lineWidth: 2,
          title: "EMA 20",
        });

        // RSI series (on separate pane)
        rsiSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: "#ec4899",
          lineWidth: 2,
          title: "RSI",
          priceScaleId: "rsi",
        });

        // Set price scale options for RSI
        const rsiPriceScale = chartRef.current.priceScale("rsi");
        if (rsiPriceScale) {
          rsiPriceScale.applyOptions({
            scaleMargins: {
              top: 0.6,
              bottom: 0.2,
            },
          });
        }

        // MACD series
        macdSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
          color: "#3b82f6",
          title: "MACD Histogram",
          priceScaleId: "macd",
        });

        // Set price scale options for MACD
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
          color: "#f59e0b",
          lineWidth: 2,
          title: "MACD Line",
          priceScaleId: "macd",
        });

        signalLineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: "#ef4444",
          lineWidth: 2,
          title: "Signal Line",
          priceScaleId: "macd",
        });
      }

      // Create plotline indicator if enabled (independent of other indicators)
      if (showPlotline) {
        // Create main plotline series for fallback
        plotlineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: "#ff6b35", // Bright orange color for better visibility
          lineWidth: 2, // Increased thickness
          lineType: 1, // Solid line
          crosshairMarkerVisible: true, // Show crosshair marker
          priceLineVisible: true, // Show price line
          priceLineWidth: 2, // Price line width
          priceLineColor: "#ff6b35", // Price line color
          lastValueVisible: true, // Show last value
        });
      }

      // Handle chart resize
      const handleResize = () => {
        if (chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current?.clientWidth,
            height: chartContainerRef.current?.clientHeight,
          });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
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
      theme,
    ]); // Added theme to dependencies

    // Load and update data
    const loadData = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load RKB data
        const chartData = await loadRkbData();

        // Calculate indicators
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
          // Create slightly different data for left scale (e.g., different timeframe or symbol)
          const leftScaleData = chartData.map((item) => ({
            ...item,
            open: item.open * 0.98, // Slightly different prices for demonstration
            high: item.high * 0.98,
            low: item.low * 0.98,
            close: item.close * 0.98,
          }));
          candlestickLeftSeriesRef.current.setData(leftScaleData);
        }

        // Set volume data
        if (volumeSeriesRef.current) {
          const volumeData = chartData.map((item) => ({
            time: item.time,
            value: item.volume || 0,
            color: item.close >= item.open ? "#10b981" : "#ef4444",
          }));
          volumeSeriesRef.current.setData(volumeData);
        }

        // Set indicator data
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
            color: item.value >= 0 ? "#10b981" : "#ef4444",
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
          // Create colored plotline segments based on trend changes
          createColoredPlotlineSegments(chartData);

          // Update current trend for UI indicator
          const latestData = chartData[chartData.length - 1];
          if (latestData.trend) {
            setCurrentTrend(latestData.trend);
          } else {
            setCurrentTrend(null);
          }
        }

        // Set custom decision signals with triangle indicators
        if (showDecisionSignals && chartRef.current) {
          // Create decision signals with triangle indicators
          createDecisionSignals(chartData);

          // Update current decision for UI indicator
          const latestData = chartData[chartData.length - 1];
          if (latestData.decision) {
            setCurrentDecision(latestData.decision);
          } else {
            setCurrentDecision(null);
          }
        }

        // Update current price and change
        if (chartData.length > 0) {
          const latest = chartData[chartData.length - 1];
          const previous = chartData[chartData.length - 2];

          setCurrentPrice(latest.close);
          setPriceChange(latest.close - previous.close);
          setPriceChangePercent(
            ((latest.close - previous.close) / previous.close) * 100
          );
        }

        // Fit content to view
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent();
        }

        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load chart data"
        );
        setIsLoading(false);
      }
    }, [
      loadRkbData,
      calculateSMA,
      calculateEMA,
      calculateRSI,
      calculateMACD,
      enableTwoScale,
      showPlotline,
      showDecisionSignals,
      createColoredPlotlineSegments,
      createDecisionSignals,
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
              color: theme === "dark" ? "#1a1a1a" : "#ffffff",
            },
            textColor: theme === "dark" ? "#d1d5db" : "#374151",
          },
          grid: {
            vertLines: {
              color: theme === "dark" ? "#374151" : "#e5e7eb",
            },
            horzLines: {
              color: theme === "dark" ? "#374151" : "#e5e7eb",
            },
          },
          crosshair: {
            vertLine: {
              color: theme === "dark" ? "#3b82f6" : "#2563eb",
            },
            horzLine: {
              color: theme === "dark" ? "#3b82f6" : "#2563eb",
            },
          },
          rightPriceScale: {
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
          },
          leftPriceScale: {
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
          },
          timeScale: {
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
          },
        });
      }
    }, [theme]);

    // Real-time price updates simulation (only for demo data)
    useEffect(() => {
      if (!chartRef.current || !candlestickSeriesRef.current) return;

      // Only run real-time updates if we're using sample data (not RKB data)
      const interval = setInterval(async () => {
        try {
          // Try to fetch latest RKB data
          const latestData = await loadRkbData();
          if (latestData.length > 0) {
            const latest = latestData[latestData.length - 1];

            // Update candlestick
            if (candlestickSeriesRef.current) {
              candlestickSeriesRef.current.update({
                time: latest.time,
                open: latest.open,
                high: latest.high,
                low: latest.low,
                close: latest.close,
              });
            }

            // Update left scale series if enabled
            if (enableTwoScale && candlestickLeftSeriesRef.current) {
              const leftCandle = {
                ...latest,
                open: latest.open * 0.98,
                high: latest.high * 0.98,
                low: latest.low * 0.98,
                close: latest.close * 0.98,
              };
              candlestickLeftSeriesRef.current.update(leftCandle);
            }

            // Update plotline segments if available
            if (
              showPlotline &&
              latest.plotline !== undefined &&
              chartRef.current
            ) {
              // Recreate colored segments with updated data
              const updatedData = await loadRkbData();
              if (updatedData.length > 0) {
                createColoredPlotlineSegments(updatedData);

                // Update current trend for UI indicator
                if (latest.trend) {
                  setCurrentTrend(latest.trend);
                } else {
                  setCurrentTrend(null);
                }
              }
            }

            // Update decision signals if available
            if (showDecisionSignals && chartRef.current) {
              // Recreate decision signals with updated data
              const updatedData = await loadRkbData();
              if (updatedData.length > 0) {
                createDecisionSignals(updatedData);

                // Update current decision for UI indicator
                if (latest.decision) {
                  setCurrentDecision(latest.decision);
                } else {
                  setCurrentDecision(null);
                }
              }
            }

            setCurrentPrice(latest.close);
          }
        } catch (error) {
          console.error("Error updating real-time data:", error);
          // Fallback to simulation if API fails
          if (candlestickSeriesRef.current) {
            const now = Math.floor(Date.now() / 1000) as UTCTimestamp;
            const lastCandle = {
              time: now,
              open: currentPrice || 19000,
              high: (currentPrice || 19000) + Math.random() * 50,
              low: (currentPrice || 19000) - Math.random() * 50,
              close: (currentPrice || 19000) + (Math.random() - 0.5) * 20,
            };

            candlestickSeriesRef.current.update(lastCandle);

            // Update left scale series if enabled
            if (enableTwoScale && candlestickLeftSeriesRef.current) {
              const leftCandle = {
                ...lastCandle,
                open: lastCandle.open * 0.98,
                high: lastCandle.high * 0.98,
                low: lastCandle.low * 0.98,
                close: lastCandle.close * 0.98,
              };
              candlestickLeftSeriesRef.current.update(leftCandle);
            }

            setCurrentPrice(lastCandle.close);
          }
        }
      }, 30000); // Update every 30 seconds for real data

      return () => clearInterval(interval);
    }, [currentPrice, enableTwoScale, loadRkbData, showPlotline, showDecisionSignals, createColoredPlotlineSegments, createDecisionSignals]);

    return (
      <div className={`relative ${className}`}>
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 text-white">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Loading chart data...</span>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center z-10">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Price display */}
        {currentPrice && (
          <div
            className={`absolute top-4 right-4 z-20 px-3 py-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-800/80 text-white border border-gray-600"
                : "bg-white/80 text-gray-900 border border-gray-200"
            } shadow-lg`}
          >
            <div className="text-lg font-bold">
              ₹{currentPrice.toLocaleString()}
            </div>
            {priceChange !== null && priceChangePercent !== null && (
              <div
                className={`text-sm ${
                  priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
              </div>
            )}
            {currentTrend && (
              <div className="text-xs mt-1">
                <span className="text-gray-400">Trend: </span>
                <span className={`font-semibold ${
                  currentTrend.toUpperCase() === 'BUY' ? 'text-green-400' :
                  currentTrend.toUpperCase() === 'SELL' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {currentTrend}
                </span>
              </div>
            )}
            {currentDecision && (
              <div className="text-xs mt-1">
                <span className="text-gray-400">Signal: </span>
                <span className={`font-semibold ${
                  currentDecision.toUpperCase().includes('BUY') ? 'text-green-400' :
                  currentDecision.toUpperCase().includes('SELL') ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {currentDecision}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Chart container */}
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
