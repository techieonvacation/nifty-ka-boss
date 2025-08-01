import { Metadata } from "next";
import Disclaimer from "@/components/ui/Disclaimer";
import FAQ from "@/components/ui/Faq";
import React from "react";

export const metadata: Metadata = {
  title:
    "Rakesh Bansal Ventures Disclaimer | User Agreement | Important Notice",
  description:
    "Understand the terms of use for RKB Ventures' website and services. This disclaimer outlines limitations of liability, warranty information, & website guidelines.",
};

const page = () => {
  return (
    <div>
      <Disclaimer />
      <FAQ />
    </div>
  );
};

export default page;
