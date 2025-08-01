import { Metadata } from "next";
import { notFound } from "next/navigation";
import Services from "@/components/Services/Services";
import FAQ from "@/components/ui/Faq";
import { serviceSlugToKey } from "@/components/Services/ServicesContent";

// --- Valid Service Slugs ---
const VALID_SERVICES = Object.keys(serviceSlugToKey);

// --- Types ---
type Params = {
  service: string;
};

type Props = {
  params: Promise<Params>; // Changed to Promise<Params>
};

// --- Static Path Generation ---
export async function generateStaticParams() {
  return VALID_SERVICES.map((service) => ({ service }));
}

// --- Metadata Generation ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params; // Await the params
  const serviceKey = serviceSlugToKey[service];

  // Centralized metadata map using slugs
  const metadataMap: Record<string, Metadata> = {
    "intraday-btst-plan": {
      title: "Rakesh Bansal Ventures - Intraday/BTST Service",
      description:
        "Start your journey to consistent trading success with our premium yet affordable subscription plan—only ₹999 per month. Get actionable insights, boost your confidence, and make better trading decisions with RKB Intraday/BTST.",
    },
    "options-plan": {
      title: "Profitable Option Intraday Strategies: Rakesh Bansal Ventures",
      description:
        "Get precise intraday option strategies including entry/exit signals & stop-loss levels. Focus on Nifty 50 and leverage Rakesh Bansal's proven track record.",
    },
    "mentorship-plan": {
      title: "Rakesh Bansal Mentorship: Personalized Stock Market Coaching",
      description:
        "Master the options trading game with precise intraday strategies, with entry & exit signals & stop-loss levels. Focus on Nifty 50 and leverage Rakesh Bansal's proven track record.",
    },
    "futures-plan": {
      title: "Strategic Futures Trading Signals: Rakesh Bansal Ventures",
      description:
        "Get expert futures trading signals from Rakesh Bansal. Our monthly plans provide 8-10 high-probability trades with precise entry, exit, and stop-loss levels.",
    },
    "renko-charts-plan": {
      title: "RKB - Renko Charts",
      description: "Chakravyuh Ka Tod – Master the Power of Renko Charts",
    },
    "commodity-plan": {
      title: "Master the Commodity Markets: Rakesh Bansal",
      description:
        "Capitalize on the commodity market with Rakesh Bansal's proven strategies. Receive timely signals and analysis for key commodities to maximize your profits.",
    },
    "hni-service": {
      title: "Rakesh Bansal's Secret Formula for HNI Success",
      description:
        "Exclusive strategies & insights used by Rakesh Bansal to help HNI clients achieve exceptional returns. Get personalized portfolio management & expert advice",
    },
  };

  if (!serviceKey) {
    return {
      title: "Rakesh Bansal Ventures: Stock Market Research & Education",
      description:
        "We offer stock market research services, including intraday/BTST, options, futures, commodities, and HNI services. Over 30 years of experience in the market.",
    };
  }

  return (
    metadataMap[service] || {
      title: "Premium Trading & Investment Services | Rakesh Bansal Ventures",
      description:
        "Access professional trading services for intraday, options, futures & more. Get expert-backed signals, real-time alerts & comprehensive market analysis from India's leading traders.",
    }
  );
}

// --- Page Component ---
export default async function ServicePage({ params }: Props) {
  const { service } = await params; // Await the params
  const serviceKey = serviceSlugToKey[service];

  // Validate the service slug
  if (!serviceKey) {
    notFound();
  }

  return (
    <div>
      <Services param={serviceKey} />
      <FAQ />
    </div>
  );
}