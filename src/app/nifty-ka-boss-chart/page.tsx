"use client";

import React, { useState } from "react";
import NiftyKaBossChart from "@/components/NiftyKaBossChart";

const NiftyKaBossChartPage: React.FC = () => {
  const [selectedSymbol] = useState("NIFTY");
  const [selectedInterval] = useState("1D");
  const [chartHeight] = useState(600);  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Chart Container */}
      <div className="container py-2 max-w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <NiftyKaBossChart
            symbol={selectedSymbol}
            exchange="NSE"
            interval={selectedInterval}
            height={chartHeight}
            className="w-full"
            enableTwoScale={false}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Multiple Chart Types
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Support for candlestick, line, area, bar, histogram, and baseline
              charts with customizable styling.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Technical Indicators
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built-in support for SMA, EMA, RSI, MACD, and other popular
              technical indicators.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Dark/Light Theme
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Seamless theme switching with automatic color adjustments for
              optimal viewing experience.
            </p>
          </div>

          {/* Feature 4 - Two Scale */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Dual Price Scales
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Compare multiple symbols or timeframes with left and right price
              scales for advanced analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NiftyKaBossChartPage;
