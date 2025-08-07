"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "./Header";
import StockChart, { StockChartRef } from "./StockChart";
import DataPanel from "./DataPanel";
import {
  fetchRkbData,
  convertRkbDataToChartData,
  fetchDecisions,
  abortAllRequests,
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

  // Technical indicators data - will be updated from API response
  const [technicalIndicators, setTechnicalIndicators] = useState({
    atr: 0,
    S1: 0,
    R1: 0,
    rkbSupport: undefined as number | undefined,
    rkbResistance: undefined as number | undefined,
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

  // Handle pivot data updates
  const handleSupportChange = useCallback((support: number | undefined) => {
    setTechnicalIndicators((prev) => ({
      ...prev,
      rkbSupport: support,
    }));
  }, []);

  const handleResistanceChange = useCallback(
    (resistance: number | undefined) => {
      setTechnicalIndicators((prev) => ({
        ...prev,
        rkbResistance: resistance,
      }));
    },
    []
  );

  /**
   * Load RKB data with auto-refresh functionality
   * Fetches chart data, prices, and technical indicators from the API
   * Auto-refreshes every minute to sync with backend data updates
   */
  useEffect(() => {
    const loadRkbData = async () => {
      try {
        setIsLoadingRkbData(true);
        const data = await fetchRkbData();
        const chartData = convertRkbDataToChartData(data);
        setRkbData(chartData);

        // Update current price data from latest RKB data
        if (chartData.length > 0) {
          const latest = chartData[chartData.length - 1];
          const previous = chartData[chartData.length - 2];

          // Calculate price changes for display
          setCurrentPrice(latest.close);
          setPriceChange(latest.close - previous.close);
          setPriceChangePercent(
            ((latest.close - previous.close) / previous.close) * 100
          );

          // Update current candle data for data panel
          setCurrentCandleData({
            date: new Date(latest.time * 1000).toISOString().split("T")[0],
            open: latest.open,
            high: latest.high,
            low: latest.low,
            close: latest.close,
            volume: latest.volume,
          });
        }

        // Extract and update technical indicators from API response
        if (data && data.length > 0) {
          const latestData = data[data.length - 1];
          setTechnicalIndicators((prev) => ({
            atr: latestData.atr || 0,
            S1: latestData.S1 || 0,
            R1: latestData.R1 || 0,
            rkbSupport: prev.rkbSupport, // Preserve pivot data
            rkbResistance: prev.rkbResistance, // Preserve pivot data
          }));
        }
      } catch (error) {
        console.error("❌ Error loading RKB data:", error);
        // Don't set fallback data - keep loading state for user feedback
      } finally {
        setIsLoadingRkbData(false);
      }
    };

    // Perform initial data load
    loadRkbData();

    // Set up auto-refresh every minute (60000ms) for real-time data synchronization
    const refreshInterval = setInterval(() => {
      console.log("🔄 Auto-refreshing RKB data...");
      loadRkbData();
    }, 60000);

    // Cleanup interval on component unmount to prevent memory leaks
    return () => {
      clearInterval(refreshInterval);
      // BUG FIX: Abort any ongoing API requests when component unmounts
      try {
        abortAllRequests();
      } catch (error) {
        console.warn("Error aborting requests during RKB cleanup:", error);
      }
      console.log("🛑 RKB data refresh interval cleared");
    };
  }, []);

  // Load pivot data on component mount
  useEffect(() => {
    const loadPivotData = async () => {
      try {
        const response = await fetch("/api/rkb/get-all-pivots");
        const data = await response.json();

        if (data.success && data.pivots) {
          const activePivots = data.pivots.filter(
            (p: { isdelete?: number }) => p.isdelete !== 1
          );
          const currentPivot = activePivots.find(
            (p: { symbol: string }) => p.symbol === symbol
          );
          if (currentPivot) {
            setTechnicalIndicators((prev) => ({
              ...prev,
              rkbSupport: currentPivot.support,
              rkbResistance: currentPivot.resistance,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading pivot data:", error);
      }
    };

    loadPivotData();
  }, [symbol]);

  /**
   * Load decisions data with auto-refresh functionality
   * Fetches trading decisions from the API and transforms them for display
   * Auto-refreshes every minute to show latest decision data
   */
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
      } catch (error) {
        console.error("Error loading decisions data:", error);
        // Don't set fallback data - keep loading state
      } finally {
        setIsLoadingDecisions(false);
      }
    };

    // Perform initial decisions data load
    loadDecisionsData();

    // Set up auto-refresh every minute (60000ms) for real-time decisions synchronization
    const decisionsRefreshInterval = setInterval(() => {
      console.log("🔄 Auto-refreshing decisions data...");
      loadDecisionsData();
    }, 60000);

    // Cleanup interval on component unmount to prevent memory leaks
    return () => {
      clearInterval(decisionsRefreshInterval);
      // BUG FIX: Additional cleanup for decisions requests
      try {
        abortAllRequests();
      } catch (error) {
        console.warn(
          "Error aborting requests during decisions cleanup:",
          error
        );
      }
      console.log("🛑 Decisions data refresh interval cleared");
    };
  }, []);

  // CHART STABILITY: Optimized theme toggle handler to prevent unnecessary re-renders
  const handleThemeToggle = useCallback((isDark: boolean) => {
    // isDark = true means we want dark mode, isDark = false means we want light mode
    const newTheme = isDark ? "dark" : "light";
    setTheme(newTheme);
  }, []);

  // CHART STABILITY: Optimized two-scale toggle handler to prevent unnecessary re-renders
  const handleTwoScaleToggle = useCallback((enabled: boolean) => {
    setTwoScaleEnabled(enabled);
  }, []);

  // CHART STABILITY: Optimized mobile menu toggle handler to prevent unnecessary re-renders
  const handleMobileMenuToggle = useCallback((open: boolean) => {
    setMobileMenuOpen(open);
  }, []);

  // CHART STABILITY: Optimized stats panel toggle handler to prevent unnecessary re-renders
  const handleStatsPanelToggle = useCallback((panel: boolean) => {
    setShowStatsPanel(panel);
  }, []);

  // CHART STABILITY: Optimized decision signals visibility toggle handler to prevent unnecessary re-renders
  const handleDecisionSignalsToggle = useCallback((signals: boolean) => {
    setShowDecisionSignals(signals);
  }, []);

  // CHART STABILITY: Optimized plotline visibility toggle handler to prevent unnecessary re-renders
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
        onSupportChange={handleSupportChange}
        onResistanceChange={handleResistanceChange}
      />

      <div className="relative grid grid-cols-[70%_30%]">
        {/* Professional Stock Chart - Main Trading View */}
        <div className="relative flex-1">
          <StockChart
            ref={chartRef}
            symbol={symbol}
            exchange={exchange}
            interval={currentInterval}
            theme={theme}
            showVolume={true} // Display volume histogram
            showIndicators={false} // Technical indicators disabled for cleaner view
            showGrid={true} // Show grid lines for better readability
            showCrosshair={true} // Enable crosshair for precise value reading
            height={height}
            width={width}
            className="w-full h-full dark:bg-gray-900"
            enableTwoScale={twoScaleEnabled} // Dual price scale functionality
            showPlotline={showPlotline} // RKB plotline indicator
            showDecisionSignals={showDecisionSignals} // Enhanced triangle markers for BUYYES/SELLYES decisions
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
                  lastDecisions={realDecisions.length > 0 ? realDecisions : []}
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
              lastDecisions={realDecisions}
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
