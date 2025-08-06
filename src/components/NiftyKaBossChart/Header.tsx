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
  Clock,
  ZoomIn,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";

interface HeaderProps {
  StockInterval: string;
  exchange: string;
  symbol: string;
  setTheme: (theme: boolean) => void;
  Theme: boolean;
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
}

function Header({
  StockInterval,
  exchange,
  symbol,
  setTheme,
  Theme,
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
}: HeaderProps) {
  const { data: session } = useSession(); // Get session data to check admin role
  const [adminDropdownOpen, setAdminDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({
    top: 0,
    left: 0,
  });

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAdminDropdownOpen(false);
      }
    };

    if (adminDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [adminDropdownOpen]);

  // Update dropdown position when it opens
  React.useEffect(() => {
    if (adminDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [adminDropdownOpen]);

  const handleScreenshot = () => {
    setTakeSnapshot(true);
    // Auto-download functionality will be handled in the main component
  };

  const handleThemeToggle = () => {
    // Pass the new theme state (opposite of current) to the parent
    // Theme is true when dark mode is active, so we want to toggle to light mode
    setTheme(!Theme);
  };

  const handleTwoScaleToggle = () => {
    if (setTwoScaleEnabled) {
      setTwoScaleEnabled(!twoScaleEnabled);
    }
  };

  const handleDecisionSignalsToggle = () => {
    if (setShowDecisionSignals) {
      setShowDecisionSignals(!showDecisionSignals);
    }
  };

  const handlePlotlineToggle = () => {
    if (setShowPlotline) {
      setShowPlotline(!showPlotline);
    }
  };

  // Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  // Handle RKB Support action
  const handleRkbSupport = () => {
    console.log("RKB Support action triggered");
    setAdminDropdownOpen(false);
    // Add your RKB Support logic here
  };

  // Handle RKB Resistance action
  const handleRkbResistance = () => {
    console.log("RKB Resistance action triggered");
    setAdminDropdownOpen(false);
    // Add your RKB Resistance logic here
  };

  return (
    <div className="relative w-full">
      {/* Header */}
      <div
        className={`${
          Theme
            ? "bg-gray-900 border-b border-gray-700 text-white shadow-xl"
            : "bg-white border-b border-gray-200 text-gray-900 shadow-lg"
        } w-full transition-all duration-300 ease-in-out backdrop-blur-sm`}
      >
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
          {/* Left - Symbol and Interval */}
          <div className="flex gap-2 md:gap-4 items-center">
            <div
              className={`flex items-center space-x-2 cursor-pointer px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-blue-900/20 hover:bg-blue-900/30 text-blue-300 border border-blue-700/30"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              } text-sm md:text-base font-medium`}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              {exchange}: {symbol}
            </div>
            <div
              className={`flex items-center space-x-2 cursor-pointer px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } text-sm md:text-base font-medium`}
            >
              <Clock size={14} className="mr-1" />
              {StockInterval}
            </div>

            {/* Admin Dropdown - Only show if user is admin */}
            {isAdmin && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  className={`flex items-center space-x-2 cursor-pointer px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${
                    Theme
                      ? "bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 border border-purple-700/30"
                      : "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300"
                  } text-sm md:text-base font-medium group`}
                >
                  <Shield size={14} className="mr-1" />
                  RKB Tools
                  <ChevronDown
                    size={14}
                    className={`ml-1 transition-transform duration-200 ${
                      adminDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Center - Current Candle Data */}
          {currentCandleData && (
            <div className="hidden md:flex items-center space-x-4 text-sm">
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

          {/* Right - Controls */}
          <div className="hidden md:flex gap-3 justify-center items-center mx-4">
            <div onClick={handleThemeToggle}>
              <ThemeButton isDark={Theme} onToggle={handleThemeToggle} />
            </div>

            <button
              onClick={handleScreenshot}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } group`}
              title="Take Screenshot"
            >
              <Camera
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
            </button>

            <button
              onClick={handleDecisionSignalsToggle}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
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
              <ArrowDownUp
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-medium">Signals</span>
            </button>

            <button
              onClick={handlePlotlineToggle}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
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
                    ? "bg-orange-900/20 hover:bg-orange-900/30 text-orange-300 border border-orange-700/30"
                    : "bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300"
                  : Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
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
              onClick={onResetZoom}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              } group`}
              title="Reset Zoom"
            >
              <ZoomIn
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-medium">Reset Zoom</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                Theme
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
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
                  ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300"
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
            ? "bg-gray-900 border-b border-gray-700 text-white shadow-xl"
            : "bg-white border-b border-gray-200 text-gray-900 shadow-lg"
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
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            } group`}
          >
            <Camera
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">Screenshot</span>
          </button>

          <button
            onClick={handleDecisionSignalsToggle}
            className={`flex items-center justify-center space-x-2 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
              showDecisionSignals
                ? Theme
                  ? "bg-green-900/20 hover:bg-green-900/30 text-green-300 border border-green-700/30"
                  : "bg-green-100 hover:bg-green-200 text-green-700 border border-green-300"
                : Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            } group`}
          >
            <ArrowDownUp
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">Signals</span>
          </button>

          <button
            onClick={handlePlotlineToggle}
            className={`flex items-center justify-center space-x-2 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
              showPlotline
                ? Theme
                  ? "bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 border border-purple-700/30"
                  : "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300"
                : Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
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
                  ? "bg-orange-900/20 hover:bg-orange-900/30 text-orange-300 border border-orange-700/30"
                  : "bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300"
                : Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            } group`}
          >
            <BarChart2
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">Dual Scale</span>
          </button>

          <button
            onClick={onResetZoom}
            className={`flex items-center justify-center space-x-2 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
              Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            } group`}
          >
            <ZoomIn
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">Reset Zoom</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className={`flex items-center justify-center space-x-2 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
              Theme
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
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

      {/* Portal-based dropdown menu to avoid clipping */}
      {adminDropdownOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className={`fixed rounded-lg shadow-xl z-[9999] ${
              Theme
                ? "bg-gray-800 border border-gray-600 text-white"
                : "bg-white border border-gray-200 text-gray-900"
            }`}
            style={{
              top: dropdownPosition.top + 8,
              left: dropdownPosition.left,
              minWidth: "12rem",
              zIndex: 9999,
            }}
          >
            <button
              onClick={handleRkbSupport}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-opacity-10 transition-colors ${
                Theme
                  ? "hover:bg-green-400 text-green-300 border-b border-gray-600"
                  : "hover:bg-green-100 text-green-700 border-b border-gray-200"
              }`}
            >
              RKB Support
            </button>
            <button
              onClick={handleRkbResistance}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-opacity-10 transition-colors ${
                Theme
                  ? "hover:bg-red-400 text-red-300"
                  : "hover:bg-red-100 text-red-700"
              }`}
            >
              RKB Resistance
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Header;
