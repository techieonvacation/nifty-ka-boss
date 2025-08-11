"use client";

import React, { useState } from "react";
import NiftyKaBossChart from "@/components/NiftyKaBossChart";

const NiftyKaBossChartPage: React.FC = () => {
  const [selectedSymbol] = useState("NIFTY");
  const [selectedInterval] = useState("1H");
  const [chartHeight] = useState(600);  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Chart Container */}
      <div className="px-2 py-2">
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

    </div>
  );
};

export default NiftyKaBossChartPage;
