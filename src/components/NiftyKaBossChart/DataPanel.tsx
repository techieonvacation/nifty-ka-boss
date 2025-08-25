import React, { useState, useEffect } from "react";
import {
  Clock,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchNiftyMovements,
  type NiftyMovementData,
  fetchDecisions,
  type DecisionData,
  fetchRkbData,
} from "@/lib/api/rkb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";

interface DataPanelProps {
  theme: boolean;
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  lastUpdate: React.ReactNode;
  ohlcData: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    avgVolume?: number;
  };
  lastDecisions: Array<{
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
  }>;
  technicalIndicators: {
    atr: number;
    S1: number;
    R1: number;
    rkbSupport?: number | undefined;
    rkbResistance?: number | undefined;
  };
  // DECISION CLICK INTEGRATION: Props for handling clicked decision highlighting and dialog control
  openDecisionDialog?: boolean;
  onDecisionDialogClose?: () => void;
  highlightDecisionDatetime?: string;
}

const DataPanel: React.FC<DataPanelProps> = ({
  theme,
  symbol,
  currentPrice,
  priceChange,
  priceChangePercent,
  ohlcData,
  lastDecisions,
  technicalIndicators,
  openDecisionDialog = false,
  onDecisionDialogClose,
  highlightDecisionDatetime,
}) => {
  const [dailyMovements, setDailyMovements] = useState<
    Array<{
      date: string;
      change: number;
      changePercent: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for all decisions popup with proper state management
  const [allDecisions, setAllDecisions] = useState<DecisionData[]>([]);
  const [loadingAllDecisions, setLoadingAllDecisions] = useState(false);
  // DECISION CLICK INTEGRATION: Dialog state management with external control
  const [dialogOpen, setDialogOpen] = useState(openDecisionDialog);
  const [hasLoadedDecisions, setHasLoadedDecisions] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // State for last updated time - will continuously update during market hours
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("Loading...");
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);

  // Function to check if market is currently open
  const checkMarketStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Market hours: 9:15 AM to 3:30 PM IST
    const marketStartHour = 9;
    const marketStartMinute = 15;
    const marketEndHour = 15; // 3:30 PM
    const marketEndMinute = 30;

    const isOpen =
      (currentHour > marketStartHour ||
        (currentHour === marketStartHour &&
          currentMinute >= marketStartMinute)) &&
      (currentHour < marketEndHour ||
        (currentHour === marketEndHour && currentMinute <= marketEndMinute));

    setIsMarketOpen(isOpen);
    return isOpen;
  };

  // Function to get last updated time - continuously updates during market hours
  const getLastUpdatedTime = () => {
    const now = new Date();

    // Format date as DD/MMM/YYYY
    const day = now.getDate().toString().padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const dateStr = `${day}/${month}/${year}`;

    // Check market status
    const marketOpen = checkMarketStatus();

    if (marketOpen) {
      // Market is open - show current time and it will keep updating
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${dateStr}, ${timeStr}`;
    } else {
      // Market is closed - show last market close time (3:30 PM)
      const timeStr = "3:30 PM";
      return `${dateStr}, ${timeStr}`;
    }
  };

  // Function to get last updated time from API for market closed scenarios
  const getLastUpdatedTimeFromAPI = async () => {
    try {
      // Fetch the latest RKB data to get the last candle datetime
      const rkbData = await fetchRkbData();

      if (rkbData && rkbData.length > 0) {
        // Sort by datetime to get the most recent entry
        const sortedData = rkbData.sort((a, b) => {
          const dateA = new Date(a.datetime);
          const dateB = new Date(b.datetime);
          return dateB.getTime() - dateA.getTime(); // Descending order
        });

        const lastCandle = sortedData[0]; // Most recent entry

        if (lastCandle && lastCandle.datetime) {
          // Parse the datetime from API (format: "2025-08-22 14:15")
          const apiDate = new Date(lastCandle.datetime);

          if (!isNaN(apiDate.getTime())) {
            // Format date as DD/MMM/YYYY
            const day = apiDate.getDate().toString().padStart(2, "0");
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[apiDate.getMonth()];
            const year = apiDate.getFullYear();
            const dateStr = `${day}/${month}/${year}`;

            // Format time as HH:MM AM/PM
            let timeStr = apiDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

            // Special case: If time is 3:15 PM, show as 3:30 PM (market close time)
            if (timeStr === "3:15 PM") {
              timeStr = "3:30 PM";
            }

            const formattedTime = `${dateStr}, ${timeStr}`;
            console.log("🕐 Last Updated Time from API:", {
              original: lastCandle.datetime,
              parsed: apiDate.toISOString(),
              formatted: formattedTime,
              originalTime: apiDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
              adjustedTime: timeStr,
            });

            return formattedTime;
          } else {
            console.warn("Invalid datetime from API:", lastCandle.datetime);
          }
        } else {
          console.warn("No datetime field in last candle data");
        }
      } else {
        console.warn("No RKB data available for last updated time");
      }

      // Fallback: if API data is not available, use current time logic
      console.log("🔄 Using fallback time calculation");
      return getLastUpdatedTime();
    } catch (error) {
      console.error("Error fetching last updated time from API:", error);
      // Fallback: if API fails, use current time logic
      console.log("🔄 Using fallback time calculation due to API error");
      return getLastUpdatedTime();
    }
  };

  // Update last updated time - continuously during market hours, from API when closed
  useEffect(() => {
    const updateLastUpdatedTime = async () => {
      // Check if market is open
      const marketOpen = checkMarketStatus();

      if (marketOpen) {
        // Market is open - use current time (will update every second)
        const currentTime = getLastUpdatedTime();
        setLastUpdatedTime(currentTime);
      } else {
        // Market is closed - fetch from API to get last candle time
        const apiTime = await getLastUpdatedTimeFromAPI();
        setLastUpdatedTime(apiTime);
      }
    };

    // Initial update
    updateLastUpdatedTime();

    // Set up intervals based on market status
    let timeInterval: NodeJS.Timeout;

    const setupIntervals = () => {
      const marketOpen = checkMarketStatus();

      if (marketOpen) {
        // Market is open - update every second for real-time display
        timeInterval = setInterval(() => {
          const currentTime = getLastUpdatedTime();
          setLastUpdatedTime(currentTime);
        }, 1000);

        console.log("🕐 Market is OPEN - Time updating every second");
      } else {
        // Market is closed - update every minute (for API data changes)
        timeInterval = setInterval(async () => {
          const apiTime = await getLastUpdatedTimeFromAPI();
          setLastUpdatedTime(apiTime);
        }, 60000);

        console.log(
          "🕐 Market is CLOSED - Time updating every minute from API"
        );
      }
    };

    // Initial setup
    setupIntervals();

    // Check market status every minute and adjust intervals accordingly
    const marketCheckInterval = setInterval(() => {
      const wasOpen = isMarketOpen;
      const isNowOpen = checkMarketStatus();

      if (wasOpen !== isNowOpen) {
        // Market status changed - clear old interval and setup new one
        if (timeInterval) {
          clearInterval(timeInterval);
        }
        setupIntervals();

        console.log(
          `🔄 Market status changed: ${wasOpen ? "OPEN" : "CLOSED"} → ${
            isNowOpen ? "OPEN" : "CLOSED"
          }`
        );
      }
    }, 60000);

    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
      clearInterval(marketCheckInterval);
    };
  }, [isMarketOpen]);

  // DECISION CLICK INTEGRATION: Sync external dialog control with internal state
  useEffect(() => {
    if (openDecisionDialog !== dialogOpen) {
      setDialogOpen(openDecisionDialog);
      if (openDecisionDialog) {
        // Reset pagination and fetch decisions when opening
        setCurrentPage(1);
        if (!hasLoadedDecisions) {
          fetchAllDecisions();
        }
      }
    }
  }, [openDecisionDialog]);

  // DECISION CLICK INTEGRATION: Auto-scroll and pagination to highlighted decision
  useEffect(() => {
    if (highlightDecisionDatetime && allDecisions.length > 0 && dialogOpen) {
      console.log(
        "🔍 DEBUG - Looking for highlighted datetime:",
        `"${highlightDecisionDatetime}"`
      );
      console.log(
        "🔍 DEBUG - Available decision datetimes:",
        allDecisions.slice(0, 5).map((d) => `"${d.datetime}"`)
      );

      // DATETIME FIX: Enhanced datetime matching with multiple format support
      const normalizeDateTime = (dt: string) => {
        if (!dt) return "";
        // Remove GMT suffix and trim
        let normalized = dt.replace(/ GMT$/, "").trim();

        // Handle different date formats for comparison
        // Format 1: "2025-07-24 11:15" -> "Thu, 24 Jul 2025 11:15:00"
        // Format 2: "Thu, 24 Jul 2025 11:15:00" -> "Thu, 24 Jul 2025 11:15:00"

        // If it's in YYYY-MM-DD format, convert to the decision format
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;
        const match = normalized.match(dateRegex);

        if (match) {
          const [, year, month, day, hour, minute] = match;
          const date = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute)
          );
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

          const dayName = dayNames[date.getDay()];
          const monthName = monthNames[date.getMonth()];

          normalized = `${dayName}, ${day} ${monthName} ${year} ${hour}:${minute}:00`;
        }

        return normalized;
      };

      const normalizedHighlight = normalizeDateTime(highlightDecisionDatetime);

      // Find the index of the highlighted decision
      const highlightedIndex = allDecisions.findIndex((decision, index) => {
        const normalizedDecision = normalizeDateTime(decision.datetime);

        if (index < 3) {
          // Debug first few entries
          console.log(`🔍 DEBUG ${index} - Comparing:`, {
            highlight: `"${normalizedHighlight}"`,
            decision: `"${normalizedDecision}"`,
            match: normalizedHighlight === normalizedDecision,
          });
        }

        return normalizedHighlight === normalizedDecision;
      });

      console.log("🔍 DEBUG - Found highlighted index:", highlightedIndex);

      if (highlightedIndex !== -1) {
        // Calculate which page the highlighted decision is on
        const targetPage = Math.floor(highlightedIndex / itemsPerPage) + 1;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
          console.log(
            `📍 Auto-navigated to page ${targetPage} for highlighted decision`
          );
        }
      } else {
        console.log("❌ DEBUG - No matching decision found for highlighting");
      }
    }
  }, [
    highlightDecisionDatetime,
    allDecisions,
    dialogOpen,
    currentPage,
    itemsPerPage,
  ]);

  // Fetch nifty movement data with optimized loading
  useEffect(() => {
    const fetchNiftyMovementsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const movements = await fetchNiftyMovements();

        // Transform the API data to match our component's format
        // Keep all movements for price display, but exclude latest from the 5-day display
        const allTransformedData = movements.map((item: NiftyMovementData) => {
          // Extract numeric values from strings like "+16.25" and "(+0.06%)"
          const changeStr = item.change.replace(/[+%]/g, "");
          const percentStr = item.percent_change.replace(/[()%]/g, "");

          const change = parseFloat(changeStr);
          const changePercent = parseFloat(percentStr);

          // Convert numeric month format if present
          const convertNumericMonthFormat = (dateString: string): string => {
            if (!dateString) return "N/A";
            
            // Check if it's in YYYY-MM-DD format (e.g., "2025-01-09")
            const dateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
            const match = dateString.match(dateRegex);
            
            if (match) {
              const [, year, month, day] = match;
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const monthIndex = parseInt(month) - 1;
              const monthName = monthNames[monthIndex];
              
              // Return in format "DD Mon YYYY" (e.g., "09 Jan 2025")
              return `${day} ${monthName} ${year}`;
            }
            
            // If not in YYYY-MM-DD format, return as-is
            return dateString;
          };

          return {
            date: convertNumericMonthFormat(item.date),
            change: isNaN(change) ? 0 : change,
            changePercent: isNaN(changePercent) ? 0 : changePercent,
          };
        });

        // Store all movements for price display (latest first)
        setDailyMovements(allTransformedData.reverse());
      } catch (err) {
        console.error("Error fetching nifty movements:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        // Don't set fallback data - keep loading state
      } finally {
        setLoading(false);
      }
    };

    fetchNiftyMovementsData();
  }, []);

  // Function to fetch all decisions for the popup - optimized to prevent unnecessary fetches
  const fetchAllDecisions = async () => {
    // Only fetch if we haven't loaded decisions yet or if there's an error
    if (hasLoadedDecisions && allDecisions.length > 0 && !error) {
      return;
    }

    try {
      setLoadingAllDecisions(true);
      setError(null);
      const decisions = await fetchDecisions();
      setAllDecisions(decisions);
      setHasLoadedDecisions(true);
    } catch (err) {
      console.error("Error fetching all decisions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch all decisions"
      );
    } finally {
      setLoadingAllDecisions(false);
    }
  };

  // DECISION CLICK INTEGRATION: Enhanced dialog open handler with external control support
  const handleDialogOpen = async (open: boolean) => {
    setDialogOpen(open);

    // If externally controlled, notify parent component
    if (!open && onDecisionDialogClose) {
      onDecisionDialogClose();
    }

    if (open && !hasLoadedDecisions) {
      await fetchAllDecisions();
    }
    // Reset pagination when opening dialog
    if (open) {
      setCurrentPage(1);
    }
  };

  // DATETIME FIX: Function to format decision data preserving original API datetime format
  const formatDecisionForDisplay = (decision: DecisionData) => {
    // DATETIME FIX: Helper function to clean GMT strings by removing " GMT" suffix only
    // This preserves the exact datetime format from API but removes trailing GMT
    const cleanDateTimeString = (dateString: string): string => {
      if (!dateString) return "N/A";
      // Remove only the " GMT" suffix if present, keep everything else as-is
      return dateString.replace(/ GMT$/, "");
    };

    // DATETIME FIX: Helper function to convert YYYY-MM-DD format to abbreviated month format
    const convertNumericMonthFormat = (dateString: string): string => {
      if (!dateString) return "N/A";
      
      // Check if it's in YYYY-MM-DD format (e.g., "2025-01-09")
      const dateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
      const match = dateString.match(dateRegex);
      
      if (match) {
        const [, year, month, day] = match;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = parseInt(month) - 1;
        const monthName = monthNames[monthIndex];
        
        // Return in format "DD Mon YYYY" (e.g., "09 Jan 2025")
        return `${day} ${monthName} ${year}`;
      }
      
      // If not in YYYY-MM-DD format, return as-is
      return dateString;
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
        // Convert numeric month format for the date part
        const convertedDatePart = convertNumericMonthFormat(datePart || "N/A");
        return { date: convertedDatePart, time: timePart || "00:00" };
      }

      // Fallback: treat entire string as date
      const convertedDate = convertNumericMonthFormat(cleaned);
      return { date: convertedDate, time: "00:00" };
    };

    // DATETIME FIX: Use original datetime strings without transformation
    const { date, time } = splitDateTime(decision.datetime);

    // Clean up decision text
    let cleanDecision = decision.decision;
    if (cleanDecision === "SELLYES") cleanDecision = "SELL";
    if (cleanDecision === "BUYYES") cleanDecision = "BUY";

    // DATETIME FIX: Format H Date and L Date with month format conversion
    const formatDateString = (dateString: string | undefined) => {
      if (!dateString) return "N/A";
      // First clean the GMT suffix, then convert numeric month format if needed
      const cleaned = cleanDateTimeString(dateString);
      return convertNumericMonthFormat(cleaned);
    };

    return {
      date,
      time,
      decision: cleanDecision as "BUY" | "SELL",
      price: decision.close_x,
      has: decision.HighAfterSignal,
      las: decision.LowAfterSignal,
      favMoves: decision.FavourableMove,
      favMovesPercent: decision["Favourable%"],
      hDate: formatDateString(decision.HighDate),
      lDate: formatDateString(decision.LowDate),
      returns: decision.returns as "Profit" | "Loss",
    };
  };

  // Pagination calculations
  const totalPages = Math.ceil(allDecisions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDecisions = allDecisions.slice(startIndex, endIndex);

  // ENHANCED ROW BACKGROUND COLOR: Best variant for both light and dark modes
  const getRowBackgroundColor = (
    returns: "Profit" | "Loss" | undefined,
    favMoves: number,
    decisionDatetime?: string
  ) => {
    // PRIORITY 1: Check if this row should be highlighted due to triangle click
    if (highlightDecisionDatetime && decisionDatetime) {
      // DATETIME FIX: Use the same enhanced normalization function for consistent matching
      const normalizeDateTime = (dt: string) => {
        if (!dt) return "";
        // Remove GMT suffix and trim
        let normalized = dt.replace(/ GMT$/, "").trim();

        // Handle different date formats for comparison
        // Format 1: "2025-07-24 11:15" -> "Thu, 24 Jul 2025 11:15:00"
        // Format 2: "Thu, 24 Jul 2025 11:15:00" -> "Thu, 24 Jul 2025 11:15:00"

        // If it's in YYYY-MM-DD format, convert to the decision format
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;
        const match = normalized.match(dateRegex);

        if (match) {
          const [, year, month, day, hour, minute] = match;
          const date = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute)
          );
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

          const dayName = dayNames[date.getDay()];
          const monthName = monthNames[date.getMonth()];

          normalized = `${dayName}, ${day} ${monthName} ${year} ${hour}:${minute}:00`;
        }

        return normalized;
      };

      const normalizedHighlight = normalizeDateTime(highlightDecisionDatetime);
      const normalizedDecision = normalizeDateTime(decisionDatetime);

      // Debug logging for row highlighting
      if (normalizedHighlight === normalizedDecision) {
        console.log("🎯 HIGHLIGHTING ROW:", {
          highlight: normalizedHighlight,
          decision: normalizedDecision,
          theme: theme ? "light" : "dark",
        });
        // Bright highlight for clicked decision
        return theme
          ? "bg-blue-200 border-2 border-blue-400"
          : "bg-blue-800 border-2 border-blue-500";
      }
    }

    // PRIORITY 2: Enhanced profit/loss coloring with best variants for both themes
    if (returns === "Profit") {
      // Green for profit - best variants for both themes
      return theme
        ? "bg-green-50 border-l-4 border-green-400 hover:bg-green-100"
        : "bg-green-900/30 border-l-4 border-green-500 hover:bg-green-900/40";
    } else if (returns === "Loss") {
      // Red for loss - best variants for both themes
      return theme
        ? "bg-red-50 border-l-4 border-red-400 hover:bg-red-100"
        : "bg-red-900/30 border-l-4 border-red-500 hover:bg-red-900/40";
    } else {
      // Yellow for no returns/undefined - best variants for both themes
      return theme
        ? "bg-yellow-50 border-l-4 border-yellow-400 hover:bg-yellow-100"
        : "bg-yellow-900/30 border-l-4 border-yellow-500 hover:bg-yellow-900/40";
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col max-h-[600px] overflow-y-auto ${
        theme ? "bg-white text-gray-900" : "bg-gray-900 text-white"
      } transition-all duration-300`}
    >
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

      {/* Enhanced Header Section - Mobile responsive */}
      <div
        className={`p-2 border-b ${
          theme
            ? "border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100"
            : "border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900"
        }`}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2
                  className={`text-lg sm:text-xl font-bold ${
                    theme ? "text-gray-900" : "text-white"
                  }`}
                >
                  {symbol}
                </h2>
                <p
                  className={`text-xs sm:text-sm ${
                    theme ? "text-gray-600" : "text-gray-400"
                  }`}
                ></p>
              </div>
            </div>
            <div className="text-left">
              <div
                className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                  theme ? "text-gray-900" : "text-white"
                }`}
              >
                ₹{currentPrice.toFixed(2)}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {dailyMovements.length > 0 && dailyMovements[0].change >= 0 ? (
                  <ArrowUp className="text-green-500 w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <ArrowDown className="text-red-500 w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span
                  className={`text-sm sm:text-base font-semibold ${
                    dailyMovements.length > 0 && dailyMovements[0].change >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {dailyMovements.length > 0 && dailyMovements[0].change >= 0
                    ? "+"
                    : ""}
                  {dailyMovements.length > 0
                    ? dailyMovements[0].change.toFixed(2)
                    : priceChange.toFixed(2)}{" "}
                  (
                  {dailyMovements.length > 0
                    ? dailyMovements[0].changePercent.toFixed(2)
                    : priceChangePercent.toFixed(2)}
                  %)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <div
                className={`flex items-center space-x-2 ${
                  theme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>
                  Last updated at:{" "}
                  {lastUpdatedTime === "Loading..." ? (
                    <span className="inline-flex items-center space-x-1">
                      <Loader2 className="animate-spin w-3 h-3" />
                      <span>Loading...</span>
                    </span>
                  ) : (
                    lastUpdatedTime
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Mobile responsive */}
      <div className="flex-1 p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* OHLC Data Panel - Mobile responsive grid */}
        <div
          className={`space-y-3 border-b ${
            theme ? "border-gray-200" : "border-gray-700"
          }`}
        >
          <h3
            className={`text-sm sm:text-base font-bold ${
              theme ? "text-gray-900" : "text-white"
            }`}
          >
            OHLC Data
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="">
              <div
                className={`text-xs ${
                  theme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Open
              </div>
              <div
                className={`font-medium ${
                  theme ? "text-gray-900" : "text-white"
                }`}
              >
                {ohlcData.open.toFixed(1)}
              </div>
            </div>
            <div className="">
              <div
                className={`text-xs ${
                  theme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Low
              </div>
              <div className="text-green-500 font-medium">
                {ohlcData.low.toFixed(2)}
              </div>
            </div>
            <div className="">
              <div
                className={`text-xs ${
                  theme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                High
              </div>
              <div className="text-red-500 font-medium">
                {ohlcData.high.toFixed(2)}
              </div>
            </div>
            <div className="">
              <div
                className={`text-xs ${
                  theme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Close
              </div>
              <div
                className={`font-medium ${
                  theme ? "text-gray-900" : "text-white"
                }`}
              >
                {ohlcData.close.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Movements and Indicators - Mobile responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-4 sm:gap-6">
          {/* Last 5 Days Movements */}
          <div className="space-y-3">
            <h3
              className={`text-sm sm:text-base font-bold ${
                theme ? "text-gray-900" : "text-white"
              }`}
            >
              Last 5 Days Movements
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-4 space-x-2">
                <Loader2 className="animate-spin text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                <span
                  className={`text-xs sm:text-sm ${
                    theme ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Loading movements...
                </span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-4 space-x-2">
                <div className="text-xs sm:text-sm text-red-400">
                  Error: {error}
                </div>
              </div>
            ) : dailyMovements.length > 0 ? (
              <div className="space-y-2">
                <div
                  className={`grid grid-cols-[40%_60%] gap-2 text-xs font-medium ${
                    theme ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  <div>Days</div>
                  <div>Returns</div>
                </div>
                {/* Show last 5 movements excluding the latest one */}
                {dailyMovements.slice(1, 6).map((movement, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[40%_60%] gap-2 text-xs"
                  >
                    <div
                      className={`text-xs ${
                        theme ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {movement.date}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span
                        className={
                          movement.change >= 0
                            ? "text-green-500 text-xs"
                            : "text-red-500 text-xs"
                        }
                      >
                        {movement.change >= 0 ? "+" : ""}
                        {movement.change.toFixed(2)} (
                        {movement.changePercent.toFixed(2)}%)
                      </span>
                      {movement.change >= 0 ? (
                        <ArrowUp className="text-green-500 w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <ArrowDown className="text-red-500 w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <span
                  className={`text-xs sm:text-sm ${
                    theme ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  No movement data available
                </span>
              </div>
            )}
          </div>

          {/* Technical Indicators */}
          <div className="space-y-3">
            <h3
              className={`text-sm sm:text-base font-bold ${
                theme ? "text-gray-900" : "text-white"
              }`}
            >
              Technical Indicators
            </h3>
            <div className="space-y-2">
              <div
                className={`grid grid-cols-[45%_55%] gap-2 text-xs font-medium ${
                  theme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                <div>Indicators</div>
                <div>Values</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`${theme ? "text-gray-700" : "text-gray-300"}`}>
                  ATR
                </div>
                <div className="text-amber-700">
                  {technicalIndicators.atr.toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`${theme ? "text-gray-700" : "text-gray-300"}`}>
                  Support
                </div>
                <div className="text-green-700">
                  {technicalIndicators.S1.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`${theme ? "text-gray-700" : "text-gray-300"}`}>
                  Resistance
                </div>
                <div className="text-red-500">
                  {technicalIndicators.R1.toFixed(2)}
                </div>
              </div>

              {technicalIndicators.rkbSupport !== undefined && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`${theme ? "text-gray-700" : "text-gray-300"}`}
                  >
                    RKB Support
                  </div>
                  <div className={`${theme ? "text-black" : "text-white"}`}>
                    {technicalIndicators.rkbSupport.toFixed(2)}
                  </div>
                </div>
              )}

              {technicalIndicators.rkbResistance !== undefined && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`${theme ? "text-gray-700" : "text-gray-300"}`}
                  >
                    RKB Resistance
                  </div>
                  <div className="text-sky-500">
                    {technicalIndicators.rkbResistance.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decisions Section - Mobile responsive */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <h3
              className={`text-sm sm:text-base font-bold ${
                theme ? "text-gray-900" : "text-white"
              }`}
            >
              Last 5 Decisions
            </h3>
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant={"primary"}
                  size={"sm"}
                  onClick={() => handleDialogOpen(true)}
                  className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                  leftIcon={<Eye className="size-4" />}
                >
                  View All
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`max-w-[95vw] max-h-[95vh] w-full transition-all duration-300 ease-in-out p-2 lg:p-4 ${
                  theme
                    ? "bg-white border-gray-200 text-gray-900"
                    : "bg-gray-900 border-gray-700 text-white"
                }`}
              >
                <DialogHeader>
                  <DialogTitle
                    className={`text-xl font-bold text-center flex items-center justify-center space-x-2 ${
                      theme ? "text-gray-900" : "text-white"
                    }`}
                  >
                    <BarChart3 size={20} />
                    <span>Nifty Ka Boss Decisions</span>
                  </DialogTitle>
                  <DialogDescription
                    className={`text-xs sm:text-sm text-center ${
                      theme ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Complete history of RKB trading decisions
                    {highlightDecisionDatetime &&
                      " - Highlighted: Selected triangle decision"}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-1 transition-all duration-300 ease-in-out overflow-x-auto">
                  {loadingAllDecisions ? (
                    <div className="flex items-center justify-center py-8 space-x-2">
                      <Loader2
                        className="animate-spin text-blue-500"
                        size={20}
                      />
                      <div
                        className={`${
                          theme ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        Loading all decisions...
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-red-400 text-center py-8">{error}</div>
                  ) : allDecisions.length > 0 ? (
                    <div
                      className={`rounded-lg border overflow-hidden transition-all duration-300 ease-in-out shadow-lg ${
                        theme
                          ? "bg-gray-50 border-gray-200"
                          : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      {/* Data source info */}
                      <div
                        className={`text-sm p-3 border-b w-full flex items-center justify-between ${
                          theme
                            ? "text-gray-500 border-gray-200 bg-gray-100"
                            : "text-gray-500 border-gray-700 bg-gray-900"
                        }`}
                      >
                        <p className="text-xs sm:text-sm text-gray-500">
                          Last 10 Years Nifty Ka Boss Decisions
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {allDecisions.length} total decisions
                        </p>
                      </div>

                      {/* Scrollable Container */}
                      <div className="overflow-auto max-h-[60vh] transition-all duration-300 ease-in-out">
                        <div className="min-w-[800px]">
                          {/* Table Header */}
                          <div
                            className={`grid grid-cols-9 gap-2 px-3 py-3 text-sm font-semibold border-b sticky top-0 ${
                              theme
                                ? "text-gray-700 border-gray-200 bg-gradient-to-r from-gray-100 to-gray-200"
                                : "text-gray-300 border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800"
                            }`}
                          >
                            <div className="min-w-[80px]">Date</div>
                            <div className="min-w-[70px]">Decision</div>
                            <div className="min-w-[80px]">Price</div>
                            <div className="min-w-[70px]">HAS</div>
                            <div className="min-w-[70px]">LAS</div>
                            <div className="min-w-[100px]">Fav. Moves</div>
                            <div className="min-w-[80px]">H. Date</div>
                            <div className="min-w-[80px]">L. Date</div>
                            <div className="min-w-[70px]">Returns</div>
                          </div>

                          {/* Table Rows */}
                          <div
                            className={`divide-y ${
                              theme ? "divide-gray-200" : "divide-gray-700"
                            }`}
                          >
                            {currentDecisions.map((decision, index) => {
                              const formattedDecision =
                                formatDecisionForDisplay(decision);
                              return (
                                <div
                                  key={`${decision.datetime}-${index}`}
                                  className={`grid grid-cols-9 gap-2 px-3 py-3 text-sm transition-all duration-300 ease-in-out cursor-pointer rounded-md ${getRowBackgroundColor(
                                    formattedDecision.returns,
                                    formattedDecision.favMoves,
                                    decision.datetime // DECISION CLICK INTEGRATION: Pass original datetime for highlighting
                                  )}`}
                                >
                                  <div className="min-w-[80px]">
                                    <div
                                      className={`font-medium text-xs ${
                                        theme ? "text-gray-900" : "text-white"
                                      }`}
                                    >
                                      {formattedDecision.date}
                                    </div>
                                    <div
                                      className={`text-xs ${
                                        theme
                                          ? "text-gray-600"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {formattedDecision.time}
                                    </div>
                                  </div>
                                  <div className="min-w-[70px] flex items-center">
                                    <span
                                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                        formattedDecision.decision === "BUY"
                                          ? "bg-green-600 text-white shadow-lg hover:bg-green-700"
                                          : "bg-red-600 text-white shadow-lg hover:bg-red-700"
                                      }`}
                                    >
                                      {formattedDecision.decision}
                                    </span>
                                  </div>
                                  <div
                                    className={`min-w-[80px] font-medium text-xs ${
                                      theme ? "text-gray-900" : "text-white"
                                    }`}
                                  >
                                    {formattedDecision.price.toFixed(2)}
                                  </div>
                                  <div
                                    className={`min-w-[70px] text-xs ${
                                      theme ? "text-gray-900" : "text-white"
                                    }`}
                                  >
                                    {formattedDecision.has.toFixed(2)}
                                  </div>
                                  <div
                                    className={`min-w-[70px] text-xs ${
                                      theme ? "text-gray-900" : "text-white"
                                    }`}
                                  >
                                    {formattedDecision.las.toFixed(2)}
                                  </div>
                                  <div className="min-w-[100px]">
                                    <div
                                      className={`font-medium text-xs ${
                                        theme ? "text-gray-900" : "text-white"
                                      }`}
                                    >
                                      {formattedDecision.favMoves >= 0
                                        ? "+"
                                        : ""}
                                      {formattedDecision.favMoves.toFixed(2)}
                                    </div>
                                    <div
                                      className={`text-xs ${
                                        theme
                                          ? "text-gray-600"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      (
                                      {formattedDecision.favMovesPercent.toFixed(
                                        2
                                      )}
                                      %)
                                    </div>
                                  </div>
                                  <div className="min-w-[80px]">
                                    <div
                                      className={`text-xs ${
                                        theme
                                          ? "text-gray-700"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      {formattedDecision.hDate}
                                    </div>
                                  </div>
                                  <div className="min-w-[80px]">
                                    <div
                                      className={`text-xs ${
                                        theme
                                          ? "text-gray-700"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      {formattedDecision.lDate}
                                    </div>
                                  </div>
                                  <div className="min-w-[70px] flex items-center">
                                    <span
                                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                        formattedDecision.returns === "Profit"
                                          ? "bg-green-600 text-white shadow-lg hover:bg-green-700"
                                          : formattedDecision.returns === "Loss"
                                          ? "bg-red-600 text-white shadow-lg hover:bg-red-700"
                                          : "bg-yellow-600 text-white shadow-lg hover:bg-yellow-700"
                                      }`}
                                    >
                                      {formattedDecision.returns || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div
                          className={`p-3 border-t flex items-center justify-between ${
                            theme
                              ? "border-gray-200 bg-gray-100"
                              : "border-gray-700 bg-gray-900"
                          }`}
                        >
                          <div
                            className={`text-sm ${
                              theme ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            Showing {startIndex + 1}-
                            {Math.min(endIndex, allDecisions.length)} of{" "}
                            {allDecisions.length} decisions
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                              }
                              disabled={currentPage === 1}
                              className="flex items-center space-x-1"
                            >
                              <ChevronLeft size={16} />
                              <span>Previous</span>
                            </Button>
                            <div
                              className={`text-sm font-medium ${
                                theme ? "text-gray-700" : "text-gray-300"
                              }`}
                            >
                              Page {currentPage} of {totalPages}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage(
                                  Math.min(totalPages, currentPage + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                              className="flex items-center space-x-1"
                            >
                              <span>Next</span>
                              <ChevronRight size={16} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <span
                        className={`${
                          theme ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        No decisions available
                      </span>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

                     {/* Show real decisions data only */}
           {lastDecisions.length > 0 ? (
             <div
               className={`rounded-lg border overflow-hidden shadow-lg ${
                 theme
                   ? "bg-gray-50 border-gray-200"
                   : "bg-gray-800 border-gray-700"
               }`}
             >
               {/* Data source info */}
               {/* <div
                 className={`text-sm p-3 border-b ${
                   theme
                     ? "text-gray-500 border-gray-200 bg-gray-100"
                     : "text-gray-500 border-gray-700 bg-gray-900"
                 }`}
               >
                 Last {lastDecisions.length} decisions
               </div> */}

               {/* Scrollable Container */}
               <div className="overflow-x-auto max-h-96">
                 <div className="min-w-[800px]">
                   {/* Table Header */}
                   <div
                     className={`grid grid-cols-9 gap-2 px-3 py-3 text-sm font-semibold border-b sticky top-0 ${
                       theme
                         ? "text-gray-700 border-gray-200 bg-gradient-to-r from-gray-100 to-gray-200"
                         : "text-gray-300 border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800"
                     }`}
                   >
                     <div className="min-w-[80px]">Date</div>
                     <div className="min-w-[70px]">Decision</div>
                     <div className="min-w-[80px]">Price</div>
                     <div className="min-w-[70px]">HAS</div>
                     <div className="min-w-[70px]">LAS</div>
                     <div className="min-w-[100px]">Fav. Moves</div>
                     <div className="min-w-[80px]">H. Date</div>
                     <div className="min-w-[80px]">L. Date</div>
                     <div className="min-w-[70px]">Returns</div>
                   </div>

                   {/* Table Rows */}
                   <div
                     className={`divide-y ${
                       theme ? "divide-gray-200" : "divide-gray-700"
                     }`}
                   >
                     {lastDecisions.map((decision, index) => {
                       // Apply the same month format conversion for lastDecisions
                       const convertNumericMonthFormat = (dateString: string): string => {
                         if (!dateString) return "N/A";
                         
                         // Check if it's in YYYY-MM-DD format (e.g., "2025-01-09")
                         const dateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
                         const match = dateString.match(dateRegex);
                         
                         if (match) {
                           const [, year, month, day] = match;
                           const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                           const monthIndex = parseInt(month) - 1;
                           const monthName = monthNames[monthIndex];
                           
                           // Return in format "DD Mon YYYY" (e.g., "09 Jan 2025")
                           return `${day} ${monthName} ${year}`;
                         }
                         
                         // If not in YYYY-MM-DD format, return as-is
                         return dateString;
                       };

                       // Convert the date and time to abbreviated month format
                       const convertedDate = convertNumericMonthFormat(decision.date);
                       const convertedTime = decision.time; // Time usually doesn't need month conversion
                       const convertedHDate = convertNumericMonthFormat(decision.hDate || "");
                       const convertedLDate = convertNumericMonthFormat(decision.lDate || "");

                       return (
                         <div
                           key={index}
                           className={`grid grid-cols-9 gap-2 px-3 py-3 text-sm transition-all duration-300 ease-in-out cursor-pointer rounded-md ${getRowBackgroundColor(
                             decision.returns,
                             decision.favMoves,
                             `${decision.date} ${decision.time}` // DECISION CLICK INTEGRATION: Reconstruct datetime for highlighting
                           )}`}
                         >
                           <div className="min-w-[80px]">
                             <div
                               className={`font-medium text-xs ${
                                 theme ? "text-gray-900" : "text-white"
                               }`}
                             >
                               {convertedDate}
                             </div>
                             <div
                               className={`text-xs ${
                                 theme ? "text-gray-600" : "text-gray-400"
                               }`}
                             >
                               {convertedTime}
                             </div>
                           </div>
                           <div className="min-w-[70px] flex items-center">
                             <span
                               className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                 decision.decision === "BUY"
                                   ? "bg-green-600 text-white shadow-lg hover:bg-green-700"
                                   : "bg-red-600 text-white shadow-lg hover:bg-red-700"
                               }`}
                             >
                               {decision.decision}
                             </span>
                           </div>
                           <div
                             className={`min-w-[80px] font-medium text-xs ${
                               theme ? "text-gray-900" : "text-white"
                             }`}
                           >
                             {decision.price.toFixed(2)}
                           </div>
                           <div
                             className={`min-w-[70px] text-xs ${
                               theme ? "text-gray-900" : "text-white"
                             }`}
                           >
                             {decision.has.toFixed(2)}
                           </div>
                           <div
                             className={`min-w-[70px] text-xs ${
                               theme ? "text-gray-900" : "text-white"
                             }`}
                           >
                             {decision.las.toFixed(2)}
                           </div>
                           <div className="min-w-[100px]">
                             <div
                               className={`font-medium text-xs ${
                                 theme ? "text-gray-900" : "text-white"
                               }`}
                             >
                               {decision.favMoves >= 0 ? "+" : ""}
                               {decision.favMoves.toFixed(2)}
                             </div>
                             <div
                               className={`text-xs ${
                                 theme ? "text-gray-600" : "text-gray-400"
                               }`}
                             >
                               ({decision.favMovesPercent.toFixed(2)}%)
                             </div>
                           </div>
                           <div className="min-w-[80px]">
                             <div
                               className={`text-xs ${
                                 theme ? "text-gray-700" : "text-gray-300"
                               }`}
                             >
                               {convertedHDate}
                             </div>
                           </div>
                           <div className="min-w-[80px]">
                             <div
                               className={`text-xs ${
                                 theme ? "text-gray-700" : "text-gray-300"
                               }`}
                             >
                               {convertedLDate}
                             </div>
                           </div>
                           <div className="min-w-[70px] flex items-center">
                             <span
                               className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                 decision.returns === "Profit"
                                   ? "bg-green-600 text-white shadow-lg hover:bg-green-700"
                                   : decision.returns === "Loss"
                                   ? "bg-red-600 text-white shadow-lg hover:bg-red-700"
                                   : "bg-yellow-600 text-white shadow-lg hover:bg-yellow-700"
                               }`}
                             >
                               {decision.returns || "N/A"}
                             </span>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
               </div>
             </div>
          ) : (
            <div
              className={`rounded-lg border overflow-hidden shadow-lg ${
                theme
                  ? "bg-gray-50 border-gray-200"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <div className="flex items-center justify-center py-8 space-x-2">
                <Loader2 className="animate-spin text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                <span
                  className={`${theme ? "text-gray-600" : "text-gray-400"}`}
                >
                  Loading decisions...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
