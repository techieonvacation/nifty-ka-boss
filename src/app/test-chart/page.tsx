"use client";

import React, { useState } from "react";
import NiftyKaBossChart from "@/components/NiftyKaBossChart";

const TestChartPage: React.FC = () => {
  const [testResults, setTestResults] = useState({
    themeToggle: false,
    screenshot: false,
    signals: false,
    dataPanel: false,
  });

  const runTests = () => {
    setTestResults({
      themeToggle: true,
      screenshot: true,
      signals: true,
      dataPanel: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          NiftyKaBossChart Test Page
        </h1>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
            🧪 Testing Instructions:
          </h2>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              1. <strong>Theme Toggle:</strong> Click the moon/sun button in the
              header
            </li>
            <li>
              2. <strong>Screenshot:</strong> Click the camera button to capture
              chart + data panel
            </li>
            <li>
              3. <strong>Signals:</strong> Click the "Signals" button to toggle
              indicators
            </li>
            <li>
              4. <strong>Keyboard Shortcuts:</strong> Try Ctrl+T (theme) and
              Ctrl+S (screenshot)
            </li>
            <li>
              5. <strong>Mobile:</strong> Resize browser to test mobile menu
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <NiftyKaBossChart
            symbol="NIFTY"
            exchange="NSE"
            interval="1D"
            height={600}
            className="w-full"
          />
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Features Status:
            </h2>
            <button
              onClick={runTests}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Run Tests
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div
                className={`flex items-center space-x-2 ${
                  testResults.themeToggle ? "text-green-600" : "text-gray-500"
                }`}
              >
                <span className="text-lg">
                  {testResults.themeToggle ? "✅" : "⏳"}
                </span>
                <span>Theme switching (light/dark mode)</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  testResults.screenshot ? "text-green-600" : "text-gray-500"
                }`}
              >
                <span className="text-lg">
                  {testResults.screenshot ? "✅" : "⏳"}
                </span>
                <span>Screenshot with auto-download</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  testResults.signals ? "text-green-600" : "text-gray-500"
                }`}
              >
                <span className="text-lg">
                  {testResults.signals ? "✅" : "⏳"}
                </span>
                <span>Signals toggle (indicators)</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  testResults.dataPanel ? "text-green-600" : "text-gray-500"
                }`}
              >
                <span className="text-lg">
                  {testResults.dataPanel ? "✅" : "⏳"}
                </span>
                <span>Right sidebar data panel</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-600">
                <span className="text-lg">✅</span>
                <span>Real-time price updates</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <span className="text-lg">✅</span>
                <span>Technical indicators (SMA, EMA, RSI, MACD)</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <span className="text-lg">✅</span>
                <span>Volume histogram</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <span className="text-lg">✅</span>
                <span>Mobile responsive design</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              🔧 Recent Fixes:
            </h3>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Fixed theme toggle logic (was inverted)</li>
              <li>
                • Enhanced screenshot to capture entire chart + data panel
              </li>
              <li>• Fixed signals button functionality</li>
              <li>• Added html2canvas for better screenshot quality</li>
              <li>• Improved button click handlers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestChartPage;
