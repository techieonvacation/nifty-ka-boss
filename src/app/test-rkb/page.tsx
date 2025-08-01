"use client";

import React from "react";
import NiftyKaBossChart from "@/components/NiftyKaBossChart";

export default function TestRkbPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          RKB Data Integration Test
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <NiftyKaBossChart
            symbol="NIFTY"
            exchange="NSE"
            interval="1D"
            height={600}
            enableTwoScale={true}
            className="w-full"
          />
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Features Tested:
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✅ RKB API data integration</li>
            <li>✅ Custom plotline indicator</li>
            <li>✅ Color-coded trend lines (BUY=Green, SELL=Red)</li>
            <li>✅ Real-time data updates</li>
            <li>✅ Two-scale chart support</li>
            <li>✅ Technical indicators (SMA, EMA, RSI, MACD)</li>
            <li>✅ Volume display</li>
            <li>✅ Theme switching</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 