import React from "react";
import { ThemeButton } from "./ThemeButton";
import {
  ArrowDownUp,
  Camera,
  TrendingDown,
  BarChart2,
  Menu,
  X,
  Settings,
  RefreshCw,
  Info,
  Clock,
} from "lucide-react";

interface HeaderProps {
  StockInterval: string;
  exchange: string;
  symbol: string;
  setTheme: (theme: boolean) => void;
  Theme: boolean;
  setTakeSnapshot: (snapshot: boolean) => void;
  setCandleSignals: (signals: boolean) => void;
  CandleSignals: boolean;
  setKemadOption: (option: boolean) => void;
  KemadOption: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  showStatsPanel?: boolean;
  setShowStatsPanel?: (panel: boolean) => void;
  currentCandleData?: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
  twoScaleEnabled?: boolean;
  setTwoScaleEnabled?: (enabled: boolean) => void;
}

function Header({
  StockInterval,
  exchange,
  symbol,
  setTheme,
  Theme,
  setTakeSnapshot,
  setCandleSignals,
  CandleSignals,
  setKemadOption,
  KemadOption,
  mobileMenuOpen,
  setMobileMenuOpen,
  showStatsPanel,
  setShowStatsPanel,
  currentCandleData,
  twoScaleEnabled = false,
  setTwoScaleEnabled,
}: HeaderProps) {
  const handleScreenshot = () => {
    setTakeSnapshot(true);
    // Auto-download functionality will be handled in the main component
  };

  const handleThemeToggle = () => {
    // Pass the new theme state (opposite of current) to the parent
    setTheme(!Theme);
  };

  const handleSignalsToggle = () => {
    setCandleSignals(!CandleSignals);
  };

  const handleTrendsToggle = () => {
    setKemadOption(!KemadOption);
  };

  const handleTwoScaleToggle = () => {
    if (setTwoScaleEnabled) {
      setTwoScaleEnabled(!twoScaleEnabled);
    }
  };

  return (
    <div className="relative w-full">
      {/* Header */}
      <div
        className={`${
          Theme
            ? "bg-white border-b border-gray-200 text-gray-900 shadow-sm"
            : "bg-gray-900 border-b border-gray-700 text-white shadow-lg"
        } w-full transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
          {/* Left - Symbol and Interval */}
          <div className="flex gap-2 md:gap-4 items-center">
            <div
              className={`flex items-center space-x-2 cursor-pointer px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-blue-900/20 hover:bg-blue-900/30 text-blue-300 border border-blue-700/30"
              } text-sm md:text-base font-medium`}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              {exchange}: {symbol}
            </div>
            <div
              className={`flex items-center space-x-2 cursor-pointer px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
              } text-sm md:text-base font-medium`}
            >
              <Clock size={14} className="mr-1" />
              {StockInterval}
            </div>
          </div>

          {/* Center - Current Candle Data */}
          {currentCandleData && (
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className={`${Theme ? "text-gray-700" : "text-gray-300"}`}>
                Date: {currentCandleData.date}
              </div>
              <div className={`${Theme ? "text-gray-700" : "text-gray-300"}`}>
                O: {currentCandleData.open.toFixed(2)} H:{" "}
                {currentCandleData.high.toFixed(2)} L:{" "}
                {currentCandleData.low.toFixed(2)} C:{" "}
                {currentCandleData.close.toFixed(2)}
              </div>
              <div className={`${Theme ? "text-gray-700" : "text-gray-300"}`}>
                Vol: {(currentCandleData.volume / 1000000).toFixed(2)}M
              </div>
            </div>
          )}

          {/* Right - Controls */}
          <div className="hidden md:flex gap-3 justify-center items-center mx-4">
            <div onClick={handleThemeToggle}>
              <ThemeButton isDark={Theme} onToggle={handleThemeToggle} />
            </div>

            <button
              onClick={handleScreenshot}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
              } group`}
              title="Take Screenshot"
            >
              <Camera
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
            </button>

            <button
              onClick={handleSignalsToggle}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                CandleSignals
                  ? Theme
                    ? "bg-green-100 hover:bg-green-200 text-green-700 border border-green-300"
                    : "bg-green-900/20 hover:bg-green-900/30 text-green-300 border border-green-700/30"
                  : Theme
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
              } group`}
              title="Toggle Candle Signals"
            >
              <ArrowDownUp
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-medium">Signals</span>
            </button>

            <button
              onClick={handleTrendsToggle}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                KemadOption
                  ? Theme
                    ? "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300"
                    : "bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 border border-purple-700/30"
                  : Theme
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
              } group`}
              title="Toggle Trend Lines"
            >
              <TrendingDown
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-medium">Trends</span>
            </button>

            <button
              onClick={handleTwoScaleToggle}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                twoScaleEnabled
                  ? Theme
                    ? "bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300"
                    : "bg-orange-900/20 hover:bg-orange-900/30 text-orange-300 border border-orange-700/30"
                  : Theme
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
              } group`}
              title="Toggle Dual Price Scales"
            >
              <BarChart2
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-medium">Dual Scale</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
              } group`}
              title="Refresh Data"
            >
              <RefreshCw
                size={16}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>

          {/* Right - Mobile menu and stats panel toggles */}
          <div className="flex gap-2 md:hidden">
            <button
              className={`p-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              }`}
              onClick={() =>
                setShowStatsPanel && setShowStatsPanel(!showStatsPanel)
              }
              title="Toggle Stats Panel"
            >
              <BarChart2 size={20} />
            </button>
            <button
              className={`p-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300"
                  : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed md:hidden w-full z-50 transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "top-16" : "-top-64"
        } ${
          Theme
            ? "bg-white border-b border-gray-200 text-gray-900 shadow-lg"
            : "bg-gray-900 border-b border-gray-700 text-white shadow-xl"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-medium flex items-center">
            <Settings size={16} className="mr-2" />
            Quick Actions
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          <button
            onClick={handleScreenshot}
            className={`flex items-center justify-center space-x-2 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
              Theme
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
            } group`}
          >
            <Camera
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">Screenshot</span>
          </button>

          <button
            onClick={handleSignalsToggle}
            className={`flex items-center justify-center space-x-2 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
              CandleSignals
                ? Theme
                  ? "bg-green-100 hover:bg-green-200 text-green-700 border border-green-300"
                  : "bg-green-900/20 hover:bg-green-900/30 text-green-300 border border-green-700/30"
                : Theme
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
            } group`}
          >
            <ArrowDownUp
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">Signals</span>
          </button>

          <button
            onClick={handleTrendsToggle}
            className={`flex items-center justify-center space-x-2 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
              KemadOption
                ? Theme
                  ? "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300"
                  : "bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 border border-purple-700/30"
                : Theme
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
            } group`}
          >
            <TrendingDown
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">Trends</span>
          </button>

          <button
            onClick={handleTwoScaleToggle}
            className={`flex items-center justify-center space-x-2 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
              twoScaleEnabled
                ? Theme
                  ? "bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300"
                  : "bg-orange-900/20 hover:bg-orange-900/30 text-orange-300 border border-orange-700/30"
                : Theme
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
            } group`}
          >
            <BarChart2
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">Dual Scale</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className={`flex items-center justify-center space-x-2 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
              Theme
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
            } group`}
          >
            <RefreshCw
              size={16}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className={`${
          Theme
            ? "bg-blue-50 border-b border-blue-200 text-blue-800"
            : "bg-blue-900/10 border-b border-blue-700/30 text-blue-300"
        } px-4 py-2 text-xs text-center transition-all duration-300`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Info size={12} />
          <span>
            Professional Trading Chart - Real-time data with 5-minute delay |
            Powered by TradingView
          </span>
        </div>
      </div>
    </div>
  );
}

export default Header;
