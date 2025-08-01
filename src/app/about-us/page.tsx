import AboutUs from "@/components/About/AboutUs";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rakesh Bansal Over 25 Years of exprience Stock Market Research",
  description:
    "Start your investment journey with Dr. Rakesh Bansal, stock market expert with 25+ years of experience. Benefit from his proven strategies, training +45k participants",
};
const page = () => {
  return (
    <main>
      <AboutUs />
    </main>
  );
};

export default page;
