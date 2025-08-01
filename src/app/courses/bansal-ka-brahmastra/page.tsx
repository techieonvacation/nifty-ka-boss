import BansalKaBhrahmastra from "@/components/BansalKaBhrahmastra/BansalKaBhrahmastra";
import FAQSection from "@/components/BansalKaBhrahmastra/faq/FAQ";
import Features from "@/components/BansalKaBhrahmastra/Features";
import FloatingBuyNowButton from "@/components/BansalKaBhrahmastra/FloatingBuyNowButton";
import Hero from "@/components/BansalKaBhrahmastra/Hero/Hero";
import Pricing from "@/components/BansalKaBhrahmastra/Pricing";
import WhyMatters from "@/components/BansalKaBhrahmastra/WhyMatters";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Bansal Ka Brahmastra – The Ultimate Stock Scanner by Dr. Rakesh Bansal",
  description:
    "Learn to scan, read charts, and act like a pro trader in just 1 hour with Bansal Ka Brahmastra – designed by Dr. Rakesh Bansal with 25+ years of market experience.",
  keywords:
    "Stock Scanner, Trading Course, Charting Blueprint, Dr. Rakesh Bansal, Stock Market, Technical Analysis, Stock Ideas, Learn Trading",
};


const BansalKaBhrahmastraPage = () => {
  return (
    <>
      <Hero />
      <WhyMatters />
      <Pricing />
      <BansalKaBhrahmastra />
      <Features />
      <FAQSection />
      <FloatingBuyNowButton />
    </>
  );
};

export default BansalKaBhrahmastraPage;
