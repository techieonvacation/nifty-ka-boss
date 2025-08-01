import React from "react";
import DataPanel from "./DataPanel";

const DataPanelDemo: React.FC = () => {
  // Static data matching the image requirements
  const staticData = {
    theme: false, // Dark theme
    symbol: "NIFTY",
    currentPrice: 24830.4,
    priceChange: 156.45,
    priceChangePercent: 0.63,
    lastUpdate: "29 Jul 2025 15:15",
    ohlcData: {
      open: 24814.15,
      high: 24847.15,
      low: 24813.5,
      close: 24830.4,
      volume: 25514909,
    },
    lastDecisions: [
      {
        date: "24 Jul 2025",
        time: "11:15",
        decision: "SELL" as const,
        price: 25049.45,
        has: 25148.7,
        las: 24598.6,
        favMoves: 450.85,
        favMovesPercent: 1.8,
      },
      {
        date: "23 Jul 2025",
        time: "14:15",
        decision: "BUY" as const,
        price: 25229.35,
        has: 25246.25,
        las: 25146.85,
        favMoves: 16.9,
        favMovesPercent: 0.07,
      },
      {
        date: "10 Jul 2025",
        time: "11:15",
        decision: "SELL" as const,
        price: 25368.7,
        has: 25431.05,
        las: 24882.3,
        favMoves: 486.4,
        favMovesPercent: 1.92,
      },
      {
        date: "20 Jun 2025",
        time: "10:15",
        decision: "BUY" as const,
        price: 25016.55,
        has: 25669.35,
        las: 24824.85,
        favMoves: 652.8,
        favMovesPercent: 2.61,
      },
      {
        date: "12 Jun 2025",
        time: "13:15",
        decision: "SELL" as const,
        price: 24847.4,
        has: 25045.45,
        las: 24508.1,
        favMoves: 339.3,
        favMovesPercent: 1.37,
      },
    ],
    technicalIndicators: {
      rsi: 46.58,
      macd: -0.56,
      ma20: 24333.79,
      ma50: 23588.88,
      ma200: 22500.0, // Added placeholder value
    },
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Main chart area (placeholder) */}
      <div className="flex-1 bg-gray-900 p-4">
        <div className="h-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
          Chart Area (Main Content)
        </div>
      </div>

      {/* Data Panel */}
      <DataPanel {...staticData} />
    </div>
  );
};

export default DataPanelDemo;
