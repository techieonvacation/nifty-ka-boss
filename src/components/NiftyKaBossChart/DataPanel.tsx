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
} from "@/lib/api/rkb";
import {
  Dialog,
  DialogContent,
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
}

const DataPanel: React.FC<DataPanelProps> = ({
  theme,
  symbol,
  currentPrice,
  priceChange,
  priceChangePercent,
  lastUpdate,
  ohlcData,
  lastDecisions,
  technicalIndicators,
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasLoadedDecisions, setHasLoadedDecisions] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Fetch nifty movement data with optimized loading
  useEffect(() => {
    const fetchNiftyMovementsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const movements = await fetchNiftyMovements();

        // Transform the API data to match our component's format
        const transformedData = movements
          .slice(0, 5)
          .map((item: NiftyMovementData) => {
            // Extract numeric values from strings like "+16.25" and "(+0.06%)"
            const changeStr = item.change.replace(/[+%]/g, "");
            const percentStr = item.percent_change.replace(/[()%]/g, "");

            const change = parseFloat(changeStr);
            const changePercent = parseFloat(percentStr);

            return {
              date: item.date,
              change: isNaN(change) ? 0 : change,
              changePercent: isNaN(changePercent) ? 0 : changePercent,
            };
          });

        setDailyMovements(transformedData);
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

  // Function to handle dialog open - triggers data fetch only when needed
  const handleDialogOpen = async (open: boolean) => {
    setDialogOpen(open);
    if (open && !hasLoadedDecisions) {
      await fetchAllDecisions();
    }
    // Reset pagination when opening dialog
    if (open) {
      setCurrentPage(1);
    }
  };

  // Function to format decision data for display
  const formatDecisionForDisplay = (decision: DecisionData) => {
    // Extract date and time from datetime
    const dateTime = new Date(decision.datetime);
    const date = dateTime.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = dateTime.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Clean up decision text
    let cleanDecision = decision.decision;
    if (cleanDecision === "SELLYES") cleanDecision = "SELL";
    if (cleanDecision === "BUYYES") cleanDecision = "BUY";

    // Format H Date and L Date
    const formatDateString = (dateString: string | undefined) => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + " " + date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } catch {
        return "N/A";
      }
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

  // Function to get row background color based on returns
  const getRowBackgroundColor = (
    returns: "Profit" | "Loss" | undefined,
    favMoves: number
  ) => {
    if (returns === "Profit" || favMoves > 0) {
      return theme ? "bg-green-50" : "bg-green-900/20";
    } else if (returns === "Loss") {
      return theme ? "bg-red-50" : "bg-red-900/20";
    }
    return "";
  };

  return (
    <div
      className={`w-full h-full flex flex-col max-h-[600px] overflow-y-auto ${
        theme ? "bg-white text-gray-900" : "bg-gray-900 text-white"
      } transition-all duration-300`}
    >
      {/* Enhanced Header Section - Responsive */}
      <div
        className={`p-3 sm:p-4 border-b ${
          theme
            ? "border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100"
            : "border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900"
        }`}
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="text-white" size={20} />
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
            <div className="text-left sm:text-right">
              <div
                className={`text-2xl sm:text-3xl font-bold ${
                  theme ? "text-gray-900" : "text-white"
                }`}
              >
                ₹{currentPrice.toFixed(2)}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {priceChange >= 0 ? (
                  <ArrowUp className="text-green-500" size={14} />
                ) : (
                  <ArrowDown className="text-red-500" size={14} />
                )}
                <span
                  className={`text-sm sm:text-base font-semibold ${
                    priceChange >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <div
                className={`flex items-center space-x-2 ${
                  theme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                <Clock size={12} />
                <span>Last updated at: {lastUpdate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 p-4 space-y-6">
        {/* OHLC Data Panel */}
        <div
          className={`space-y-3 border-b ${
            theme ? "border-gray-200" : "border-gray-700"
          }`}
        >
          <h3
            className={`text-base font-bold ${
              theme ? "text-gray-900" : "text-white"
            }`}
          >
            OHLC Data
          </h3>
          <div className="grid grid-cols-6 gap-4 text-sm">
            <div className="text-center">
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
            <div className="text-center">
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
            <div className="text-center">
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
            <div className="text-center">
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
            <div className="text-center">
              <div
                className={`text-xs ${
                  theme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Vol
              </div>
              <div
                className={`font-medium ${
                  theme ? "text-gray-900" : "text-white"
                }`}
              >
                {(ohlcData.volume / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-xs ${
                  theme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Avg Vol
              </div>
              <div
                className={`font-medium ${
                  theme ? "text-gray-900" : "text-white"
                }`}
              >
                36.3M
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Movements and Indicators */}
        <div className="grid grid-cols-[55%_45%] gap-2">
          {/* Last 5 Days Movements */}
          <div className="space-y-3">
            <h3
              className={`text-base font-bold ${
                theme ? "text-gray-900" : "text-white"
              }`}
            >
              Last 5 Days Movements
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-4 space-x-2">
                <Loader2 className="animate-spin text-blue-500" size={16} />
                <span
                  className={`text-sm ${
                    theme ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Loading movements...
                </span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-4 space-x-2">
                <div className="text-sm text-red-400">Error: {error}</div>
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
                {dailyMovements.map((movement, index) => (
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
                        <ArrowUp className="text-green-500" size={12} />
                      ) : (
                        <ArrowDown className="text-red-500" size={12} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <span
                  className={`text-sm ${
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
              className={`text-base font-bold ${
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
                <div className={`${theme ? "text-gray-900" : "text-white"}`}>
                  {technicalIndicators.atr.toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`${theme ? "text-gray-700" : "text-gray-300"}`}>
                  Support
                </div>
                <div className="text-red-500">
                  {technicalIndicators.S1.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`${theme ? "text-gray-700" : "text-gray-300"}`}>
                  Resistance
                </div>
                <div className="text-green-500">
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
                  <div className="text-blue-500">
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
                  <div className="text-orange-500">
                    {technicalIndicators.rkbResistance.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Last 5 Decisions Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className={`text-base font-bold ${
                theme ? "text-gray-900" : "text-white"
              }`}
            >
              Last 5 Decisions
            </h3>
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Eye size={14} />
                  <span>See More</span>
                </button>
              </DialogTrigger>
              <DialogContent
                className={`max-w-[95vw] max-h-[90vh] w-full transition-all duration-300 ease-in-out ${
                  theme
                    ? "bg-white border-gray-200 text-gray-900"
                    : "bg-gray-900 border-gray-700 text-white"
                }`}
              >
                <DialogHeader>
                  <DialogTitle
                    className={`text-xl font-bold flex items-center space-x-2 ${
                      theme ? "text-gray-900" : "text-white"
                    }`}
                  >
                    <BarChart3 size={20} />
                    <span>Nifty Ka Boss Decisions</span>
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-4 transition-all duration-300 ease-in-out">
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
                      className={`rounded-lg border overflow-hidden transition-all duration-300 ease-in-out ${
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
                        <p className="text-sm text-gray-500">
                          Last 10 Years Nifty Ka Boss Decisions
                        </p>
                        <p className="text-sm text-gray-500">
                          {allDecisions.length} total decisions
                        </p>
                      </div>

                      {/* Scrollable Container */}
                      <div className="overflow-auto max-h-[60vh] transition-all duration-300 ease-in-out">
                        <div className="min-w-[800px]">
                          {/* Table Header */}
                          <div
                            className={`grid grid-cols-9 gap-2 px-2 py-2 text-sm font-semibold border-b sticky top-0 ${
                              theme
                                ? "text-gray-700 border-gray-200 bg-gray-100"
                                : "text-gray-300 border-gray-700 bg-gray-900"
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
                                  className={`grid grid-cols-9 gap-2 px-2 py-2 text-sm transition-all duration-200 ease-in-out ${getRowBackgroundColor(
                                    formattedDecision.returns,
                                    formattedDecision.favMoves
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
                                          ? "bg-green-600 text-white shadow-lg"
                                          : "bg-red-600 text-white shadow-lg"
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
                                        formattedDecision.returns ===
                                          "Profit" ||
                                        formattedDecision.favMoves > 0
                                          ? "bg-green-600 text-white shadow-lg"
                                          : "bg-red-600 text-white shadow-lg"
                                      }`}
                                    >
                                      {formattedDecision.returns}
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
              className={`rounded-lg border overflow-hidden ${
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
                    className={`grid grid-cols-9 gap-2 px-2 py-2 text-sm font-semibold border-b sticky top-0 ${
                      theme
                        ? "text-gray-700 border-gray-200 bg-gray-100"
                        : "text-gray-300 border-gray-700 bg-gray-900"
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
                    {lastDecisions.map((decision, index) => (
                      <div
                        key={index}
                        className={`grid grid-cols-9 gap-2 px-2 py-2 text-sm transition-colors duration-200 ${getRowBackgroundColor(
                          decision.returns,
                          decision.favMoves
                        )}`}
                      >
                        <div className="min-w-[80px]">
                          <div
                            className={`font-medium text-xs ${
                              theme ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {decision.date}
                          </div>
                          <div
                            className={`text-xs ${
                              theme ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            {decision.time}
                          </div>
                        </div>
                        <div className="min-w-[70px] flex items-center">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              decision.decision === "BUY"
                                ? "bg-green-600 text-white shadow-lg"
                                : "bg-red-600 text-white shadow-lg"
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
                            {decision.hDate}
                          </div>
                        </div>
                        <div className="min-w-[80px]">
                          <div
                            className={`text-xs ${
                              theme ? "text-gray-700" : "text-gray-300"
                            }`}
                          >
                            {decision.lDate}
                          </div>
                        </div>
                        <div className="min-w-[70px] flex items-center">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              decision.returns === "Profit" ||
                              decision.favMoves > 0
                                ? "bg-green-600 text-white shadow-lg"
                                : "bg-red-600 text-white shadow-lg"
                            }`}
                          >
                            {decision.returns}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`rounded-lg border overflow-hidden ${
                theme
                  ? "bg-gray-50 border-gray-200"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <div className="flex items-center justify-center py-8 space-x-2">
                <Loader2 className="animate-spin text-blue-500" size={16} />
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
