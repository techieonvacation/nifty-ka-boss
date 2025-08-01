"use client";

import React from "react";
import { InfiniteMovingCards } from "./infinite-moving-card";

const RegisteredBy = () => {
  return (
    <div className="bg-white py-2.5 md:py-3 -ml-2 -mr-2 relative z-10">
      <div className="flex items-center justify-between gap-x-6 sm:gap-x-6 md:gap-x-8 px-2">
        <InfiniteMovingCards
          items={SliderData}
          direction="left"
          speed="fast"
          pauseOnHover={false}
        />
      </div>
    </div>
  );
};

export default RegisteredBy;

const SliderData = [
  {
    name: "SEBI Registered",
  },
  {
    name: "Research Analyst Registration Number: INH100008984",
  },
  {
    name: "SEBI Registered",
  },
  {
    name: "Research Analyst Registration Number: INH100008984",
  },
];
