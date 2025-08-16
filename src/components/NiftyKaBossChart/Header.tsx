import React, { memo } from "react";
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
  Clock,
  ZoomIn,
  Sun,
  Moon,
  AlertTriangle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import PivotManagement from "./PivotManagement";
import { dummy } from "../../lib/dummy";

interface HeaderProps {
  StockInterval: string;
  exchange: string;
  symbol: string;
  setTheme: (theme: boolean) => void;
  Theme?: boolean; // Made optional with default value
  setTakeSnapshot: (snapshot: boolean) => void;
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
  showDecisionSignals?: boolean;
  setShowDecisionSignals?: (signals: boolean) => void;
  showPlotline?: boolean;
  setShowPlotline?: (visible: boolean) => void;
  onResetZoom?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onSupportChange?: (support: number | undefined) => void;
  onResistanceChange?: (resistance: number | undefined) => void;
}

// CHART STABILITY: Memoized Header component to prevent unnecessary re-renders
const Header = memo(function Header({
  StockInterval,
  exchange,
  symbol,
  setTheme,
  Theme = false, // Default to light mode
  setTakeSnapshot,
  mobileMenuOpen,
  setMobileMenuOpen,
  showStatsPanel,
  setShowStatsPanel,
  currentCandleData,
  twoScaleEnabled = false,
  setTwoScaleEnabled,
  showDecisionSignals = true,
  setShowDecisionSignals,
  showPlotline = true,
  setShowPlotline,
  onResetZoom,
  onRefresh,
  isRefreshing = false,
  onSupportChange,
  onResistanceChange,
}: HeaderProps) {
  const { data: session, status } = useSession(); // Get session data to check admin role

  // Session validation for admin features
  React.useEffect(() => {
    // Only log in development mode for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("Header: Session loaded", {
        hasSession: !!session,
        role: session?.user?.role,
        isAdmin: session?.user?.role === "admin",
      });
    }
  }, [session, status]);

  // CHART STABILITY: Enhanced screenshot handler with memoization
  const handleScreenshot = React.useCallback(() => {
    setTakeSnapshot(true);
    // Auto-download functionality will be handled in the main component
  }, [setTakeSnapshot]);

  // CHART STABILITY: Enhanced theme toggle with memoization to prevent unnecessary re-renders
  const handleThemeToggle = React.useCallback(() => {
    // Pass the new theme state (opposite of current) to the parent
    // Theme is true when dark mode is active, so we want to toggle to light mode
    setTheme(!Theme);
  }, [Theme, setTheme]);

  // CHART STABILITY: Enhanced two-scale toggle with memoization to prevent unnecessary re-renders
  const handleTwoScaleToggle = React.useCallback(() => {
    if (setTwoScaleEnabled) {
      setTwoScaleEnabled(!twoScaleEnabled);
    }
  }, [twoScaleEnabled, setTwoScaleEnabled]);

  // CHART STABILITY: Enhanced decision signals toggle with memoization to prevent unnecessary re-renders
  const handleDecisionSignalsToggle = React.useCallback(() => {
    if (setShowDecisionSignals) {
      setShowDecisionSignals(!showDecisionSignals);
    }
  }, [showDecisionSignals, setShowDecisionSignals]);

  // CHART STABILITY: Enhanced plotline toggle with memoization to prevent unnecessary re-renders
  const handlePlotlineToggle = React.useCallback(() => {
    if (setShowPlotline) {
      setShowPlotline(!showPlotline);
    }
  }, [showPlotline, setShowPlotline]);

  // Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  // Check if there's an active trade (for now using dummy data)
  const hasActiveTrade = dummy.Status === "open trade";

  return (
    <div className="relative w-full">
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

      {/* Header */}
      <div
        className={`${
          Theme
            ? "bg-gray-900 border-b border-gray-700 text-white shadow-xl"
            : "bg-white border-b border-gray-200 text-gray-900 shadow-lg"
        } w-full transition-all duration-300 ease-in-out backdrop-blur-sm`}
      >
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
          {/* Left - Symbol and Interval - Mobile responsive */}
          <div className="flex gap-1 sm:gap-2 md:gap-4 items-center">
            <div
              className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-blue-900/20 hover:bg-blue-900/30 text-blue-300 border border-blue-700/30"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              } text-xs sm:text-sm md:text-base font-medium`}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="hidden xs:inline">{exchange}:</span> {symbol}
            </div>
            <div
              className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } text-xs sm:text-sm md:text-base font-medium`}
            >
              <Clock className="size-4" />
              <span className="inline-block">{StockInterval}</span>
            </div>

            {/* Admin Pivot Management - Only show if user is admin */}
            {isAdmin && (
              <PivotManagement
                theme={Theme}
                symbol={symbol}
                onSupportChange={onSupportChange}
                onResistanceChange={onResistanceChange}
              />
            )}

            {/* Active Decision Section - Integrated within header */}
            {hasActiveTrade && (
              <div
                className={`hidden sm:flex items-center space-x-3 px-3 py-1.5 rounded-lg border ${
                  Theme
                    ? "bg-amber-900/20 border-amber-700/30 text-amber-200"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <AlertTriangle
                    className={`w-3 h-3 ${
                      Theme ? "text-amber-400" : "text-amber-600"
                    }`}
                  />
                  <span className="text-xs font-medium">Active Decision</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">DT:</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        Theme ? "bg-amber-900/30" : "bg-amber-100"
                      }`}
                    >
                      {dummy.datetime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Price:</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        Theme ? "bg-amber-900/30" : "bg-amber-100"
                      }`}
                    >
                      ₹{dummy.close_x.toFixed(2)}
                    </span>
                  </div>
                  {parseFloat(dummy["New Base"]) <= 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">SL:</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${
                          Theme ? "bg-amber-900/30" : "bg-amber-100"
                        }`}
                      >
                        ₹{dummy.SL.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Base:</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        Theme ? "bg-amber-900/30" : "bg-amber-100"
                      }`}
                    >
                      {dummy["New Base"] || "N/A"}
                    </span>
                  </div>
                </div>
                <div
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    Theme
                      ? "bg-green-900/30 text-green-300 border border-green-700/50"
                      : "bg-green-100 text-green-700 border border-green-300"
                  }`}
                >
                  Live
                </div>
              </div>
            )}
          </div>

          {/* Center - Current Candle Data - Hidden on mobile for space */}
          {currentCandleData && (
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className={`${Theme ? "text-gray-300" : "text-gray-700"}`}>
                Date: {currentCandleData.date}
              </div>
              <div className={`${Theme ? "text-gray-300" : "text-gray-700"}`}>
                O: {currentCandleData.open.toFixed(2)} H:{" "}
                {currentCandleData.high.toFixed(2)} L:{" "}
                {currentCandleData.low.toFixed(2)} C:{" "}
                {currentCandleData.close.toFixed(2)}
              </div>
              <div className={`${Theme ? "text-gray-300" : "text-gray-700"}`}>
                Vol: {(currentCandleData.volume / 1000000).toFixed(2)}M
              </div>
            </div>
          )}

          {/* Right - Controls - Hidden on mobile */}
          <div className="hidden md:flex gap-2 lg:gap-3 justify-center items-center mx-2 lg:mx-4">
            <div onClick={handleThemeToggle}>
              <ThemeButton
                isDark={Theme || false}
                onToggle={handleThemeToggle}
              />
            </div>

            <button
              onClick={handleScreenshot}
              className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } group`}
              title="Take Screenshot"
            >
              <Camera className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={handleDecisionSignalsToggle}
              className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                showDecisionSignals
                  ? Theme
                    ? "bg-green-900/20 hover:bg-green-900/30 text-green-300 border border-green-700/30"
                    : "bg-green-100 hover:bg-green-200 text-green-700 border border-green-300"
                  : Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } group`}
              title="Toggle Decision Signals"
            >
              <ArrowDownUp className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={handlePlotlineToggle}
              className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                showPlotline
                  ? Theme
                    ? "bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 border border-purple-700/30"
                    : "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300"
                  : Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } group`}
              title="Toggle Plotline Indicator"
            >
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={handleTwoScaleToggle}
              className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                twoScaleEnabled
                  ? Theme
                    ? "bg-orange-900/20 hover:bg-orange-900/30 text-orange-300 border border-orange-700/30"
                    : "bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300"
                  : Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } group`}
              title="Toggle Dual Price Scales"
            >
              <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                Dual Scale
              </span>
            </button>

            <button
              onClick={onResetZoom}
              className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } group`}
              title="Reset Zoom"
            >
              <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                Reset
              </span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                isRefreshing
                  ? Theme
                    ? "bg-blue-600 text-white border border-blue-500 cursor-not-allowed"
                    : "bg-blue-600 text-white border border-blue-500 cursor-not-allowed"
                  : Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } group`}
              title={isRefreshing ? "Refreshing..." : "Refresh Data (Ctrl+R)"}
            >
              <RefreshCw
                className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-500 ${
                  isRefreshing ? "animate-spin" : "group-hover:rotate-180"
                }`}
              />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>

          {/* Right - Mobile menu and stats panel toggles - Enhanced mobile experience */}
          <div className="flex gap-1 sm:gap-2 md:hidden">
            <button
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              }`}
              onClick={() =>
                setShowStatsPanel && setShowStatsPanel(!showStatsPanel)
              }
              title="Toggle Stats Panel"
            >
              <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu - Advanced responsive toggle with all actions and theme toggle */}
      <div
        className={`fixed md:hidden left-0 right-0 w-full z-50 transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "top-14 sm:top-16" : "-top-96"
        } ${
          Theme
            ? "bg-gray-900 border-b border-gray-700 text-white shadow-xl"
            : "bg-white border-b border-gray-200 text-gray-900 shadow-lg"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="text-xs sm:text-sm font-medium flex items-center">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Quick Actions
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className={`p-1 rounded-lg transition-all duration-200 ${
              Theme
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            title="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Toggle Section */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">Theme</span>
            <button
              onClick={handleThemeToggle}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              }`}
              title={Theme ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {Theme ? (
                <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="text-xs sm:text-sm font-medium">
                {Theme ? "Light" : "Dark"}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4">
          {/* Screenshot */}
          <button
            onClick={handleScreenshot}
            className={`flex flex-col items-center justify-center space-y-1 sm:space-y-2 cursor-pointer px-2 sm:px-3 py-3 sm:py-4 rounded-lg transition-all duration-200 ${
              Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400"
            } group`}
            title="Take Screenshot"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium text-center">
              Screenshot
            </span>
          </button>

          {/* Decision Signals */}
          <button
            onClick={handleDecisionSignalsToggle}
            className={`flex flex-col items-center justify-center space-y-1 sm:space-y-2 cursor-pointer px-2 sm:px-3 py-3 sm:py-4 rounded-lg transition-all duration-200 ${
              showDecisionSignals
                ? Theme
                  ? "bg-green-900/20 hover:bg-green-900/30 text-green-300 border border-green-700/30 hover:border-green-600/50"
                  : "bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 hover:border-green-400"
                : Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400"
            } group`}
            title="Toggle Decision Signals"
          >
            <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Plotline Trends */}
          <button
            onClick={handlePlotlineToggle}
            className={`flex flex-col items-center justify-center space-y-1 sm:space-y-2 cursor-pointer px-2 sm:px-3 py-3 sm:py-4 rounded-lg transition-all duration-200 ${
              showPlotline
                ? Theme
                  ? "bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 border border-purple-700/30 hover:border-purple-600/50"
                  : "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300 hover:border-purple-400"
                : Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400"
            } group`}
            title="Toggle Plotline Indicator"
          >
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Dual Scale */}
          <button
            onClick={handleTwoScaleToggle}
            className={`flex flex-col items-center justify-center space-y-1 sm:space-y-2 cursor-pointer px-2 sm:px-3 py-3 sm:py-4 rounded-lg transition-all duration-200 ${
              twoScaleEnabled
                ? Theme
                  ? "bg-orange-900/20 hover:bg-orange-900/30 text-orange-300 border border-orange-700/30 hover:border-orange-600/50"
                  : "bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300 hover:border-orange-400"
                : Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400"
            } group`}
            title="Toggle Dual Price Scales"
          >
            <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium text-center">
              Dual Scale
            </span>
          </button>

          {/* Reset Zoom */}
          <button
            onClick={onResetZoom}
            className={`flex flex-col items-center justify-center space-y-1 sm:space-y-2 cursor-pointer px-2 sm:px-3 py-3 sm:py-4 rounded-lg transition-all duration-200 ${
              Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400"
            } group`}
            title="Reset Zoom"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium text-center">
              Reset Zoom
            </span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`flex flex-col items-center justify-center space-y-1 sm:space-y-2 cursor-pointer px-2 sm:px-3 py-3 sm:py-4 rounded-lg transition-all duration-200 ${
              isRefreshing
                ? Theme
                  ? "bg-blue-600 text-white border border-blue-500 cursor-not-allowed"
                  : "bg-blue-600 text-white border border-blue-500 cursor-not-allowed"
                : Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400"
            } group`}
            title={isRefreshing ? "Refreshing..." : "Refresh Data (Ctrl+R)"}
          >
            <RefreshCw
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${
                isRefreshing ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
            <span className="text-xs sm:text-sm font-medium text-center">
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>

        {/* Menu Footer */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Header;
