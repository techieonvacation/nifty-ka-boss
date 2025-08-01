import Pricing from "@/components/Home/Pricing/Pricing";
import FAQ from "@/components/ui/Faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rakesh Bansal Ventures - Stock Market Research & Education",
  description:
    "We offer stock market research services, including intraday/BTST, options, futures, commodities, and HNI services. Over 30 years of experience in the market.",
};
export default function SubscriptionsPage() {
  return (
    <div>
      <Pricing />
      <FAQ />
    </div>
  );
}
