import React, { useState, useEffect } from "react";
import {
  Clock,
  ArrowUp,
  ArrowDown,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { fetchNiftyMovements, type NiftyMovementData } from "@/lib/api/rkb";

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
    rsi: number;
    macd: number;
    ma20: number;
    ma50: number;
    ma200: number;
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

  // Fetch nifty movement data
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

        // Fallback to default data if API fails
        setDailyMovements([
          { date: "29 Jul 2025", change: -14.15, changePercent: -0.06 },
          { date: "28 Jul 2025", change: -170.6, changePercent: -0.69 },
          { date: "25 Jul 2025", change: -12.35, changePercent: -0.05 },
          { date: "24 Jul 2025", change: 207.35, changePercent: 0.83 },
          { date: "23 Jul 2025", change: 364.65, changePercent: 1.47 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNiftyMovementsData();
  }, []);

  return (
    <div
      className={`w-full h-full flex flex-col max-h-[600px] overflow-y-auto ${
        theme ? "bg-white text-gray-900" : "bg-gray-900 text-white"
      } transition-all duration-300`}
    >
      {/* Enhanced Header Section - Responsive */}
      <div className="p-3 sm:p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {symbol}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  Nifty 50 Index
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-white">
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
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock size={12} />
                <span>Last update: {lastUpdate}</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-500">
                <AlertTriangle size={12} />
                <span className="text-xs">Delayed by 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 p-4 space-y-6">
        {/* OHLC Data Panel */}
        <div className="space-y-3  border-b border-border">
          <h3 className="text-base font-bold text-white">OHLC Data</h3>
          <div className="grid grid-cols-6 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400 text-xs">Open</div>
              <div className="text-white font-medium">
                {ohlcData.open.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs">Low</div>
              <div className="text-green-500 font-medium">
                {ohlcData.low.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs">High</div>
              <div className="text-red-500 font-medium">
                {ohlcData.high.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs">Close</div>
              <div className="text-white font-medium">
                {ohlcData.close.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs">Vol</div>
              <div className="text-white font-medium">
                {(ohlcData.volume / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs">Avg Vol</div>
              <div className="text-white font-medium">36.3M</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Movements and Indicators */}
        <div className="grid grid-cols-[55%_45%] gap-2">
          {/* Last 5 Days Movements */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">
              Last 5 Days Movements
            </h3>
            {loading ? (
              <div className="text-sm text-gray-400">Loading movements...</div>
            ) : error ? (
              <div className="text-sm text-red-400">Error: {error}</div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[40%_60%] gap-2 text-xs font-medium text-gray-400">
                  <div>Days</div>
                  <div>Returns</div>
                </div>
                {dailyMovements.map((movement, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[40%_60%] gap-2 text-xs"
                  >
                    <div className="text-gray-300 text-xs">{movement.date}</div>
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
            )}
          </div>

          {/* Technical Indicators */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">
              Technical Indicators
            </h3>
            <div className="space-y-2">
              <div className="grid grid-cols-[45%_55%] gap-2 text-xs font-medium text-gray-400">
                <div>Indicators</div>
                <div>Values</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-300">RSI (14)</div>
                <div className="text-red-500">
                  {technicalIndicators.rsi.toFixed(2)}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-300">MACD</div>
                <div className="text-red-500">
                  {technicalIndicators.macd.toFixed(2)}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-300">MA (20)</div>
                <div className="text-white">
                  {technicalIndicators.ma20.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-300">MA (50)</div>
                <div className="text-white">
                  {technicalIndicators.ma50.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-300">MA (200)</div>
                <div className="text-white">
                  {technicalIndicators.ma200.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last 5 Decisions Panel */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Last 5 Decisions</h3>
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {/* Data source info */}
            <div className="text-sm text-gray-500 p-3 border-b border-gray-700 bg-gray-900">
              Showing {lastDecisions.length} decisions from API
            </div>

            {/* Scrollable Container */}
            <div className="overflow-x-auto max-h-96">
              <div className="min-w-[800px]">
                {/* Table Header */}
                <div className="grid grid-cols-9 gap-2 px-2 py-2 text-sm font-semibold text-gray-300 border-b border-gray-700 bg-gray-900 sticky top-0">
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
                <div className="divide-y divide-gray-700">
                  {lastDecisions.map((decision, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-9 gap-2 px-2 py-2 text-sm hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="min-w-[80px]">
                        <div className="text-white font-medium text-xs">
                          {decision.date}
                        </div>
                        <div className="text-gray-400 text-xs">
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
                      <div className="min-w-[80px] text-white font-medium text-xs ">
                        {decision.price.toFixed(2)}
                      </div>
                      <div className="min-w-[70px] text-white text-xs">
                        {decision.has.toFixed(2)}
                      </div>
                      <div className="min-w-[70px] text-white text-xs">
                        {decision.las.toFixed(2)}
                      </div>
                      <div className="min-w-[100px]">
                        <div className="text-white font-medium text-xs">
                          {decision.favMoves >= 0 ? "+" : ""}
                          {decision.favMoves.toFixed(2)}
                        </div>
                        <div className="text-gray-400 text-xs">
                          ({decision.favMovesPercent.toFixed(2)}%)
                        </div>
                      </div>
                      <div className="min-w-[80px]">
                        <div className="text-gray-300 text-xs">
                          {decision.hDate || "24 Jul 2025"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {decision.time}
                        </div>
                      </div>
                      <div className="min-w-[80px]">
                        <div className="text-gray-300">
                          {decision.lDate || "29 Jul 2025"}
                        </div>
                        <div className="text-gray-500 text-xs">09:15</div>
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
                          {decision.returns ||
                            (decision.favMoves > 0 ? "Profit" : "Loss")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
