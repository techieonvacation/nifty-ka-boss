"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "./Header";
import StockChart, { StockChartRef } from "./StockChart";
import DataPanel from "./DataPanel";
import {
  fetchRkbData,
  convertRkbDataToChartData,
  fetchDecisions,
  type ChartDataPoint,
  type DecisionData,
} from "@/lib/api/rkb";

interface NiftyKaBossChartProps {
  symbol?: string;
  exchange?: string;
  interval?: string;
  height?: number;
  width?: number;
  className?: string;
  enableTwoScale?: boolean; // New prop for two-scale feature
}

// Client-side only time display component to prevent hydration mismatch
const ClientTimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return <span>{currentTime}</span>;
};

const NiftyKaBossChart: React.FC<NiftyKaBossChartProps> = ({
  symbol = "NIFTY",
  exchange = "NSE",
  interval = "1D",
  height = 600,
  width,
  className = "",
  enableTwoScale = true, // Default to true for two-scale feature
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [currentInterval] = useState(interval);
  const [showDataPanel] = useState(true);
  const [twoScaleEnabled, setTwoScaleEnabled] = useState(enableTwoScale);
  const [showDecisionSignals, setShowDecisionSignals] = useState(true); // Add state for decision signals visibility
  const [showPlotline, setShowPlotline] = useState(true); // Add state for plotline visibility

  // Chart data state
  const [currentPrice, setCurrentPrice] = useState<number>(24844.55);
  const [priceChange, setPriceChange] = useState<number>(14.15);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0.06);
  const [currentCandleData, setCurrentCandleData] = useState({
    date: "2025-07-30",
    open: 24859.5,
    high: 24860.45,
    low: 24840.75,
    close: 24844.55,
    volume: 21500000,
  });
  const [rkbData, setRkbData] = useState<ChartDataPoint[]>([]);
  const [, setIsLoadingRkbData] = useState(false);

  // Real decisions data state
  const [realDecisions, setRealDecisions] = useState<
    Array<{
      date: string;
      time: string;
      decision: "BUY" | "SELL";
      price: number;
      has: number;
      las: number;
      favMoves: number;
      favMovesPercent: number;
      hDate?: string;
      lDate?: string;
      returns?: "Profit" | "Loss";
    }>
  >([]);
  const [, setIsLoadingDecisions] = useState(false);

  // Sample data for the data panel (fallback)
  const [lastDecisions] = useState([
    {
      date: "24 Jul 2025",
      time: "11:15",
      decision: "SELL" as const,
      price: 25049.45,
      has: 25148.7,
      las: 24598.6,
      favMoves: 450.85,
      favMovesPercent: 1.8,
      hDate: "24 Jul 2025",
      lDate: "29 Jul 2025",
      returns: "Profit" as const,
    },
    {
      date: "23 Jul 2025",
      time: "14:15",
      decision: "BUY" as const,
      price: 25229.35,
      has: 25246.25,
      las: 25146.85,
      favMoves: 16.9,
      favMovesPercent: 0.07,
      hDate: "24 Jul 2025",
      lDate: "24 Jul 2025",
      returns: "Loss" as const,
    },
    {
      date: "10 Jul 2025",
      time: "11:15",
      decision: "SELL" as const,
      price: 25368.7,
      has: 25431.05,
      las: 24882.3,
      favMoves: 486.4,
      favMovesPercent: 1.92,
      hDate: "10 Jul 2025",
      lDate: "21 Jul 2025",
      returns: "Profit" as const,
    },
  ]);

  // Technical indicators data - will be updated from API response
  const [technicalIndicators, setTechnicalIndicators] = useState({
    atr: 0,
    S1: 0,
    R1: 0,
  });

  // Chart ref for accessing chart methods
  const chartRef = useRef<StockChartRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Professional screenshot handler - captures only the main chart area
  const handleScreenshot = useCallback(async () => {
    if (chartRef.current?.takeScreenshot) {
      try {
        await chartRef.current.takeScreenshot();
      } catch (error) {
        console.error("Error taking screenshot:", error);
      }
    }
  }, []);

  // Reset zoom handler
  const handleResetZoom = useCallback(() => {
    if (chartRef.current?.resetZoom) {
      chartRef.current.resetZoom();
    }
  }, []);

  // Screenshot handler for Header component
  const handleScreenshotForHeader = useCallback(() => {
    handleScreenshot();
  }, [handleScreenshot]);

  // Load RKB data on component mount
  useEffect(() => {
    const loadRkbData = async () => {
      try {
        setIsLoadingRkbData(true);
        const data = await fetchRkbData();
        const chartData = convertRkbDataToChartData(data);
        setRkbData(chartData);

        // Update current price from RKB data if available
        if (chartData.length > 0) {
          const latest = chartData[chartData.length - 1];
          const previous = chartData[chartData.length - 2];

          setCurrentPrice(latest.close);
          setPriceChange(latest.close - previous.close);
          setPriceChangePercent(
            ((latest.close - previous.close) / previous.close) * 100
          );

          setCurrentCandleData({
            date: new Date(latest.time * 1000).toISOString().split("T")[0],
            open: latest.open,
            high: latest.high,
            low: latest.low,
            close: latest.close,
            volume: latest.volume,
          });
        }

        // Extract technical indicators from API response
        if (data && data.length > 0) {
          const latestData = data[data.length - 1];
          setTechnicalIndicators({
            atr: latestData.atr || 0,
            S1: latestData.S1 || 0,
            R1: latestData.R1 || 0,
          });
        }
      } catch (error) {
        console.error("Error loading RKB data:", error);
      } finally {
        setIsLoadingRkbData(false);
      }
    };

    loadRkbData();
  }, []);

  // Load decisions data on component mount
  useEffect(() => {
    const loadDecisionsData = async () => {
      try {
        setIsLoadingDecisions(true);
        const decisions = await fetchDecisions();

        // Transform decisions data to match component format
        const transformedDecisions = decisions
          .slice(0, 5) // Show only last 5 decisions
          .map((item: DecisionData) => {
            // Helper function to format date from GMT string
            const formatDateFromGMT = (
              gmtString: string
            ): { date: string; time: string } => {
              try {
                let date: Date;
                if (gmtString.includes("GMT")) {
                  date = new Date(gmtString);
                } else {
                  date = new Date(gmtString);
                }

                if (isNaN(date.getTime())) {
                  return { date: "Invalid Date", time: "00:00" };
                }

                const dateStr = `${date
                  .getUTCDate()
                  .toString()
                  .padStart(2, "0")} ${
                  date
                    .toLocaleDateString("en-GB", {
                      month: "short",
                      year: "numeric",
                    })
                    .split(" ")[1]
                }`;

                const timeStr = `${date
                  .getUTCHours()
                  .toString()
                  .padStart(2, "0")}:${date
                  .getUTCMinutes()
                  .toString()
                  .padStart(2, "0")}`;

                return { date: dateStr, time: timeStr };
              } catch (error) {
                console.error("Error formatting date:", error);
                return { date: "Invalid Date", time: "00:00" };
              }
            };

            // Helper function to determine decision type
            const getDecisionType = (decision: string): "BUY" | "SELL" => {
              const upperDecision = decision.toUpperCase();
              if (upperDecision.includes("BUY")) return "BUY";
              if (upperDecision.includes("SELL")) return "SELL";
              return "BUY"; // Default fallback
            };

            const { date, time } = formatDateFromGMT(item.datetime);
            const { date: hDate } = formatDateFromGMT(item.HighDate);
            const { date: lDate } = formatDateFromGMT(item.LowDate);
            const returns = item.FavourableMove > 0 ? "Profit" : "Loss";

            return {
              date,
              time,
              decision: getDecisionType(item.decision),
              price: item.close_x || 0,
              has: item.HighAfterSignal || 0,
              las: item.LowAfterSignal || 0,
              favMoves: item.FavourableMove || 0,
              favMovesPercent: item["Favourable%"] || 0,
              hDate,
              lDate,
              returns: returns as "Profit" | "Loss",
            };
          });

        setRealDecisions(transformedDecisions);
        console.log("Loaded real decisions data:", transformedDecisions);
      } catch {
        console.error("Error loading decisions data");
        // Keep using fallback data if API fails
      } finally {
        setIsLoadingDecisions(false);
      }
    };

    loadDecisionsData();
  }, []);

  // Theme toggle handler
  const handleThemeToggle = useCallback((isDark: boolean) => {
    // isDark = true means we want dark mode, isDark = false means we want light mode
    setTheme(isDark ? "dark" : "light");
  }, []);

  // Two-scale toggle handler
  const handleTwoScaleToggle = useCallback((enabled: boolean) => {
    setTwoScaleEnabled(enabled);
  }, []);

  // Mobile menu toggle handler
  const handleMobileMenuToggle = useCallback((open: boolean) => {
    setMobileMenuOpen(open);
  }, []);

  // Stats panel toggle handler
  const handleStatsPanelToggle = useCallback((panel: boolean) => {
    setShowStatsPanel(panel);
  }, []);

  // Decision signals visibility toggle handler
  const handleDecisionSignalsToggle = useCallback((signals: boolean) => {
    setShowDecisionSignals(signals);
  }, []);

  // Plotline visibility toggle handler
  const handlePlotlineToggle = useCallback((visible: boolean) => {
    setShowPlotline(visible);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "t") {
        event.preventDefault();
        handleThemeToggle(theme === "light"); // Pass the new desired state
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleScreenshot();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        event.preventDefault();
        handleTwoScaleToggle(!twoScaleEnabled);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault();
        handleResetZoom();
      }
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setShowStatsPanel(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    theme,
    handleThemeToggle,
    handleScreenshot,
    twoScaleEnabled,
    handleTwoScaleToggle,
    handleResetZoom,
  ]);

  // Update current candle data periodically (only if no RKB data)
  useEffect(() => {
    if (rkbData.length > 0) return; // Don't run simulation if we have real data

    const interval = setInterval(() => {
      const newPrice = currentPrice + (Math.random() - 0.5) * 20;
      const newChange = newPrice - currentPrice;
      const newChangePercent = (newChange / currentPrice) * 100;

      setCurrentPrice(newPrice);
      setPriceChange(newChange);
      setPriceChangePercent(newChangePercent);

      setCurrentCandleData((prev) => ({
        ...prev,
        close: newPrice,
        high: Math.max(prev.high, newPrice),
        low: Math.min(prev.low, newPrice),
        volume: prev.volume + Math.floor(Math.random() * 100000),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPrice, rkbData.length]);

  return (
    <div ref={containerRef} className={`flex flex-col ${className}`}>
      <Header
        StockInterval={currentInterval}
        exchange={exchange}
        symbol={symbol}
        setTheme={handleThemeToggle}
        Theme={theme === "dark"}
        setTakeSnapshot={handleScreenshotForHeader}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={handleMobileMenuToggle}
        showStatsPanel={showStatsPanel}
        setShowStatsPanel={handleStatsPanelToggle}
        twoScaleEnabled={twoScaleEnabled}
        setTwoScaleEnabled={handleTwoScaleToggle}
        showDecisionSignals={showDecisionSignals}
        setShowDecisionSignals={handleDecisionSignalsToggle}
        showPlotline={showPlotline}
        setShowPlotline={handlePlotlineToggle}
        onResetZoom={handleResetZoom}
      />

      <div className="relative grid grid-cols-[70%_30%]">
        {/* Stock Chart - Left Side */}
        <div className="relative flex-1">
          <StockChart
            ref={chartRef}
            symbol={symbol}
            exchange={exchange}
            interval={currentInterval}
            theme={theme}
            showVolume={true}
            showIndicators={false} // candleSignals is removed
            showGrid={true}
            showCrosshair={true}
            height={height}
            width={width}
            className="w-full h-full dark:bg-gray-900"
            enableTwoScale={twoScaleEnabled}
            showPlotline={showPlotline}
            showDecisionSignals={showDecisionSignals}
          />

          {/* Stats Panel for Mobile */}
          {showStatsPanel && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
              <div
                className={`w-80 max-h-96 overflow-y-auto rounded-lg shadow-xl ${
                  theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <DataPanel
                  theme={theme === "light"}
                  symbol={symbol}
                  currentPrice={currentPrice}
                  priceChange={priceChange}
                  priceChangePercent={priceChangePercent}
                  lastUpdate={<ClientTimeDisplay />}
                  ohlcData={currentCandleData}
                  lastDecisions={
                    realDecisions.length > 0 ? realDecisions : lastDecisions
                  }
                  technicalIndicators={technicalIndicators}
                />
              </div>
            </div>
          )}
        </div>

        {/* Data Panel - Right Side */}
        {showDataPanel && (
          <div className="h-full">
            <DataPanel
              theme={theme === "light"}
              symbol={symbol}
              currentPrice={currentPrice}
              priceChange={priceChange}
              priceChangePercent={priceChangePercent}
              lastUpdate={<ClientTimeDisplay />}
              ohlcData={currentCandleData}
              lastDecisions={
                realDecisions.length > 0 ? realDecisions : lastDecisions
              }
              technicalIndicators={technicalIndicators}
            />
          </div>
        )}
      </div>

      {/* Attribution Footer */}
      {/* <div
        className={`text-xs text-center py-2 ${
          theme === "dark"
            ? "text-gray-400 bg-gray-900"
            : "text-gray-600 bg-gray-50"
        }`}
      >
        Powered by TradingView Lightweight Charts | Professional Trading
        Platform
      </div> */}
    </div>
  );
};

export default NiftyKaBossChart;
