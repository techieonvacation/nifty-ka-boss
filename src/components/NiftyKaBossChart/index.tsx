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
      // IST TIME CONVERSION: Display time in IST format
      const istTime = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setCurrentTime(istTime);
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
  const [theme, setTheme] = useState<"light" | "dark">("light"); // Default to light mode

  // DECISION CLICK INTEGRATION: State for managing decision popup dialog and highlighting
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [highlightedDecisionDatetime, setHighlightedDecisionDatetime] =
    useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [currentInterval] = useState(interval);
  const [showDataPanel] = useState(true);
  const [twoScaleEnabled, setTwoScaleEnabled] = useState(enableTwoScale);
  const [showDecisionSignals, setShowDecisionSignals] = useState(true); // Add state for decision signals visibility
  const [showPlotline, setShowPlotline] = useState(true); // Add state for plotline visibility
  const [isRefreshing, setIsRefreshing] = useState(false); // Add state for refresh loading indicator

  // Chart data state
  const [currentPrice, setCurrentPrice] = useState<number>(24844.55);
  const [priceChange, setPriceChange] = useState<number>(14.15);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0.06);
  // REAL-TIME FIX: Set initial state with current datetime to avoid showing old dates
  const [currentCandleData, setCurrentCandleData] = useState({
    date: "Loading...", // Will be updated with real API datetime
    open: 24859.5,
    high: 24860.45,
    low: 24840.75,
    close: 24844.55,
    volume: 21500000,
  });
  const [, setRkbData] = useState<ChartDataPoint[]>([]);
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

  // DECISION CLICK INTEGRATION: Handler for when decision triangles are clicked
  const handleDecisionClick = useCallback(
    (decisionData: {
      decision: "BUY" | "SELL";
      datetime: string;
      price: number;
      time: number;
    }) => {
      console.log("🎯 Decision triangle clicked in parent:", decisionData);
      console.log(
        "🔍 DEBUG - Triangle datetime format:",
        `"${decisionData.datetime}"`
      );
      console.log(
        "🔍 DEBUG - Triangle datetime length:",
        decisionData.datetime.length
      );
      console.log(
        "🔍 DEBUG - Triangle datetime type:",
        typeof decisionData.datetime
      );

      // Set the datetime to highlight and open the decision dialog
      setHighlightedDecisionDatetime(decisionData.datetime);
      setDecisionDialogOpen(true);
    },
    []
  );

  // DECISION CLICK INTEGRATION: Handler for closing the decision dialog
  const handleDecisionDialogClose = useCallback(() => {
    setDecisionDialogOpen(false);
    setHighlightedDecisionDatetime(""); // Clear highlighting
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
        // REAL-TIME FIX: Use cache busting for more aggressive real-time updates
        const data = await fetchRkbData(true); // Force fresh data for trading charts
        const chartData = convertRkbDataToChartData(data);

        // REAL-TIME FIX: Log API data info for debugging datetime issues
        if (data.length > 0) {
          const latestApiData = data[data.length - 1];
          // IST TIME CONVERSION: Log current time in IST format
          const currentIstTime = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          console.log(
            `📊 API Response at ${currentIstTime} IST - Latest candle: ${latestApiData.datetime}, Total candles: ${data.length}`
          );
        }

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

          // IST TIME CONVERSION: Update current candle data with IST datetime format
          const candleDateTime =
            latest.originalDatetime ||
            new Date(latest.time * 1000).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
          // IST TIME CONVERSION: Log current time in IST format
          const currentIstTime = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          console.log(
            `🕐 Updating candle datetime at ${currentIstTime} IST from API: ${candleDateTime} (was: ${currentCandleData.date})`
          );

          setCurrentCandleData({
            date: candleDateTime,
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

    // REAL-TIME FIX: Set up auto-refresh every 30 seconds for faster real-time data synchronization
    const refreshInterval = setInterval(() => {
      // IST TIME CONVERSION: Log refresh time in IST format
      const istTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      console.log(`🔄 Auto-refreshing RKB data at ${istTime} IST...`);
      loadRkbData();
    }, 30000); // Reduced from 60000ms to 30000ms for more responsive updates

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
        // REAL-TIME FIX: Use cache busting for fresh decision data
        const decisions = await fetchDecisions(true); // Force fresh data for trading decisions

        // DATETIME FIX: Transform decisions data preserving original datetime formats from API
        const transformedDecisions = decisions
          .slice(0, 5) // Show only last 5 decisions
          .map((item: DecisionData) => {
            // DATETIME FIX: Helper function to clean GMT strings by removing " GMT" suffix only
            // This preserves the exact datetime format from API but removes trailing GMT
            const cleanDateTimeString = (dateString: string): string => {
              if (!dateString) return "N/A";
              // Remove only the " GMT" suffix if present, keep everything else as-is
              return dateString.replace(/ GMT$/, "");
            };

            // DATETIME FIX: Helper function to split datetime into date and time parts
            // This handles both formats: "2015-01-09 09:15" and "Thu, 24 Jul 2025 11:15:00"
            const splitDateTime = (
              dateTimeString: string
            ): { date: string; time: string } => {
              const cleaned = cleanDateTimeString(dateTimeString);

              // Handle format like "Thu, 24 Jul 2025 11:15:00"
              if (cleaned.includes(",")) {
                const parts = cleaned.split(" ");
                if (parts.length >= 5) {
                  const datePart = parts.slice(0, 4).join(" "); // "Thu, 24 Jul 2025"
                  const timePart = parts[4] || "00:00:00"; // "11:15:00"
                  return { date: datePart, time: timePart };
                }
              }

              // Handle format like "2015-01-09 09:15"
              if (cleaned.includes(" ")) {
                const [datePart, timePart] = cleaned.split(" ");
                return { date: datePart || "N/A", time: timePart || "00:00" };
              }

              // Fallback: treat entire string as date
              return { date: cleaned, time: "00:00" };
            };

            // Helper function to determine decision type
            const getDecisionType = (decision: string): "BUY" | "SELL" => {
              const upperDecision = decision.toUpperCase();
              if (upperDecision.includes("BUY")) return "BUY";
              if (upperDecision.includes("SELL")) return "SELL";
              return "BUY"; // Default fallback
            };

            // DATETIME FIX: Use original datetime strings without transformation
            const { date, time } = splitDateTime(item.datetime);
            const { date: hDate } = splitDateTime(item.HighDate);
            const { date: lDate } = splitDateTime(item.LowDate);
            const returns =
              item.returns || (item.FavourableMove > 0 ? "Profit" : "Loss");

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
        // IST TIME CONVERSION: Log current time in IST format
        const currentIstTime = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        console.log(
          `Loaded real decisions data at ${currentIstTime} IST:`,
          transformedDecisions
        );
      } catch (error) {
        console.error("Error loading decisions data:", error);
        // Don't set fallback data - keep loading state
      } finally {
        setIsLoadingDecisions(false);
      }
    };

    // Perform initial decisions data load
    loadDecisionsData();

    // REAL-TIME FIX: Set up auto-refresh every 30 seconds for faster real-time decisions synchronization
    const decisionsRefreshInterval = setInterval(() => {
      // IST TIME CONVERSION: Log refresh time in IST format
      const istTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      console.log(`📊 Auto-refreshing decisions data at ${istTime} IST...`);
      loadDecisionsData();
    }, 30000); // Reduced from 60000ms to 30000ms for more responsive updates

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

  // CHART REFRESH: Handle manual refresh button click to reload chart data
  const handleRefresh = useCallback(async () => {
    if (chartRef.current?.refresh) {
      try {
        setIsRefreshing(true);
        console.log("🔄 Manual refresh triggered - reloading chart data...");
        await chartRef.current.refresh();
        console.log("✅ Chart data refresh completed successfully");
      } catch (error) {
        console.error("❌ Error during manual chart refresh:", error);
      } finally {
        setIsRefreshing(false);
      }
    } else {
      console.warn("⚠️ Chart ref not available for refresh");
    }
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
      if ((event.ctrlKey || event.metaKey) && event.key === "r") {
        event.preventDefault();
        handleRefresh();
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
    handleRefresh,
  ]);

  // REAL-TIME FIX: Disable simulation since we have real API data updates every 30 seconds
  // This simulation was overriding the real API datetime and causing old data to display
  useEffect(() => {
    // DISABLED: Simulation is no longer needed with real-time API updates
    // The simulation was causing "08:45" to override the real API datetime "15:15"
    // IST TIME CONVERSION: Log current time in IST format
    const currentIstTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    console.log(
      `📈 Real-time API data mode at ${currentIstTime} IST: Simulation disabled`
    );
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-col w-full ${className}`}>
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
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onSupportChange={handleSupportChange}
        onResistanceChange={handleResistanceChange}
      />

      {/* Mobile-first responsive layout */}
      <div className="relative flex flex-col lg:grid lg:grid-cols-[70%_30%] w-full">
        {/* Professional Stock Chart - Main Trading View - Mobile responsive */}
        <div className="relative flex-1 w-full order-1 lg:order-1">
          {/* RKB Nifty Ka Boss Watermark Overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            <div
              className={`text-4xl sm:text-5xl lg:text-8xl font-bold tracking-wider opacity-10 select-none ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Nifty Ka Boss
            </div>
          </div>

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
            showSLIndicators={true} // SL (Stop Loss) indicators - circular markers on candles
            showNewBaseIndicators={true} // New Base indicators - diamond markers on candles
            autoRefresh={false} // REAL-TIME FIX: Disable StockChart auto-refresh to prevent conflicts (index handles it)
            onDecisionClick={handleDecisionClick} // DECISION CLICK INTEGRATION: Handle triangle marker clicks
            technicalIndicators={technicalIndicators} // TECHNICAL INDICATORS: Pass support and resistance values
          />

          {/* Stats Panel for Mobile - Enhanced mobile experience */}
          {showStatsPanel && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
              <div
                className={`w-full max-w-sm sm:w-80 max-h-[80vh] sm:max-h-96 overflow-y-auto rounded-lg shadow-xl relative ${
                  theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {/* RKB Watermark for Mobile Stats Panel */}
                <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                  <div
                    className={`text-xl font-bold tracking-wide opacity-5 select-none ${
                      theme === "dark" ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    RKB
                  </div>
                </div>

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
                  openDecisionDialog={decisionDialogOpen} // DECISION CLICK INTEGRATION: Control dialog state
                  onDecisionDialogClose={handleDecisionDialogClose} // DECISION CLICK INTEGRATION: Handle dialog close
                  highlightDecisionDatetime={highlightedDecisionDatetime} // DECISION CLICK INTEGRATION: Highlight specific decision
                />
              </div>
            </div>
          )}
        </div>

        {/* Data Panel - Right Side - Mobile responsive */}
        {showDataPanel && (
          <div className="w-full lg:h-full order-2 lg:order-2 relative">
            {/* RKB Watermark for Data Panel */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div
                className={`text-2xl sm:text-3xl font-bold tracking-wide opacity-5 select-none ${
                  theme === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                RKB
              </div>
            </div>

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
              openDecisionDialog={decisionDialogOpen} // DECISION CLICK INTEGRATION: Control dialog state
              onDecisionDialogClose={handleDecisionDialogClose} // DECISION CLICK INTEGRATION: Handle dialog close
              highlightDecisionDatetime={highlightedDecisionDatetime} // DECISION CLICK INTEGRATION: Highlight specific decision
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
