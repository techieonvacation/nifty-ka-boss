"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MdPlayArrow } from "react-icons/md";

interface Feature {
  name: string;
  included: boolean;
  info?: string;
}

interface PricingPlan {
  title: string;
  monthlyPrice?: string;
  quarterlyPrice?: string;
  yearlyPrice?: string;
  description: string;
  features: Feature[];
  buttonText: string;
  popular?: boolean;
  href: string;
  icon: React.ReactNode;
}

type PlanDuration = "monthly" | "quarterly" | "yearly";
// type PlanDuration = "monthly" | "quarterly";

const pricingData: PricingPlan[] = [
  {
    title: "Intraday/BTST",
    monthlyPrice: "999",
    quarterlyPrice: "2700",
    yearlyPrice: "9999",
    description: "For Short Term Traders",
    href: "/subscriptions/intraday-btst-plan",
    features: [
      {
        name: "Monthly 15-20 Calls",
        included: true,
        info: "Receive up to 20 trading calls per month",
      },
      { name: "Entry Price", included: true },
      // { name: "Exit Price", included: true },
      // { name: "Stop Loss", included: true },
      // { name: "First Target", included: true },
      // { name: "Top Nifty 50 Companies", included: true },
      { name: "Index Trades", included: true },
    ],
    buttonText: "See More",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-purple-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Index & Option",
    monthlyPrice: "1999",
    quarterlyPrice: "5500",
    yearlyPrice: "19999",
    description: "For professionals",
    href: "/subscriptions/options-plan",
    features: [
      { name: "Monthly 10-15 Calls", included: true },
      { name: "Entry Price", included: true },
      { name: "Exit Price", included: true },
      { name: "Stop Loss", included: true },
      { name: "Top Nifty 50 Companies", included: true },
      {
        name: "Nifty, Bank Nifty, FINNIFTY, & MIDCPNIFTY",
        included: true,
        info: "Comprehensive index coverage",
      },
    ],
    buttonText: "See More",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-purple-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  // {
  //   title: "Option & Intraday",
  //   monthlyPrice: "1999",
  //   quarterlyPrice:"5999",
  //   // yearlyPrice: "19999",
  //   description: "For professionals",
  //   href: "/subscriptions/option-intraday",
  //   features: [
  //     { name: "Monthly 10-15 Calls", included: true },
  //     { name: "Entry Price", included: true },
  //     { name: "Exit Price", included: true },
  //     { name: "Stop Loss", included: true },
  //     { name: "Top Nifty 50 Companies", included: true },
  //     {
  //       name: "Nifty, Bank Nifty, FINNIFTY, & MIDCPNIFTY",
  //       included: true,
  //       info: "Comprehensive index coverage",
  //     },
  //   ],
  //   buttonText: "See More",
  //   icon: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       className="h-8 w-8 text-purple-600"
  //       viewBox="0 0 20 20"
  //       fill="currentColor"
  //     >
  //       <path
  //         fillRule="evenodd"
  //         d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
  //         clipRule="evenodd"
  //       />
  //     </svg>
  //   ),
  // },
  {
    title: "Mentorship",
    monthlyPrice: "3800",
    quarterlyPrice: "9999",
    yearlyPrice: "34999",
    description: "Most popular",
    href: "/subscriptions/mentorship-plan",
    features: [
      { name: "Quarterly 10-15 Calls", included: true },
      { name: "Entry Price", included: true },
      { name: "Exit Price", included: true },
      { name: "Short & Medium Term", included: true },
      {
        name: "Live Market Support",
        included: true,
        info: "Get real-time assistance during market hours",
      },
    ],
    buttonText: "See More",
    popular: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-green-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    ),
  },
  // {
  //   title: "Renko Subscription",
  //   quarterlyPrice: "1499",
  //   yearlyPrice: "5299",
  //   description: "Most popular",
  //   href: "/subscriptions/renko-charts-plan",
  //   features: [
  //     { name: "Yearly 10-12 Calls", included: true },
  //     { name: "Entry Price", included: true },
  //     { name: "Exit Price", included: true },
  //     { name: "Detailed Analysis", included: true },
  //     { name: "Medium & Long Term Trade Signals", included: true },
  //     { name: "Exclusive Community Forum Access", included: true },
  //     {
  //       name: "Live Market Support",
  //       included: true,
  //       info: "Get real-time assistance during market hours",
  //     },
  //   ],
  //   buttonText: "See More",
  //   popular: true,
  //   icon: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       className="h-8 w-8 text-green-600"
  //       viewBox="0 0 20 20"
  //       fill="currentColor"
  //     >
  //       <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
  //     </svg>
  //   ),
  // },
  {
    title: "Futures",
    monthlyPrice: "5000",
    quarterlyPrice: "13500",
    yearlyPrice: "50000",
    description: "For professionals",
    href: "/subscriptions/futures-plan",
    features: [
      { name: "Monthly 8-10 Calls", included: true },
      { name: "Entry Price", included: true },
      { name: "Exit Price", included: true },
      { name: "Stop Loss", included: true },
      {
        name: "Performance Reports",
        included: true,
        info: "Detailed monthly performance analysis",
      },
      { name: "Top Nifty 50 Companies", included: true },
    ],
    buttonText: "See More",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-purple-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Commodity",
    monthlyPrice: "3500",
    quarterlyPrice: "8999",
    yearlyPrice: "31999", // yearlyPrice: "31999",
    description: "For professionals",
    href: "/subscriptions/commodity-plan",
    features: [
      { name: "Monthly 10-15 Calls", included: true },
      { name: "Entry Price", included: true },
      { name: "Exit Price", included: true },
      { name: "Stop Loss", included: true },
      { name: "Performance Reports", included: true },
      {
        name: "Silver, Zinc, Aluminium, Gold, Copper and Crude Oil",
        included: true,
        info: "Diverse commodity options",
      },
    ],
    buttonText: "See More",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-green-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

const CardHeader = ({
  title,
  price,
  description,
  popular,
  duration,
  icon,
}: {
  title: string;
  price: string;
  description: string;
  popular?: boolean;
  duration: PlanDuration;
  icon: React.ReactNode;
}) => (
  <div className="p-6 relative bg-gradient-to-br from-purple-100 to-green-100 rounded-t-lg">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-sans font-semibold text-purple-700 mb-3 text-left">
        {title}
      </h2>
      {icon}
    </div>
    <div className="text-center mb-4">
      <span className="text-4xl font-bold text-purple-700">₹{price}</span>
      <span className="text-sm text-gray-600">/{duration}</span>
    </div>
    {popular && (
      <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
        Most Popular
      </span>
    )}
    <p className="text-sm text-gray-600 mt-2">{description}</p>
  </div>
);

const FeatureList = ({ features }: { features: Feature[] }) => (
  <ul className="space-y-3 p-6 flex-grow bg-white">
    {features.map((feature, index) => (
      <li key={index} className="flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
        <span className="text-black text-sm flex-grow">{feature.name}</span>
        {feature.info && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {feature.info}
            </div>
          </div>
        )}
      </li>
    ))}
  </ul>
);

const CardFooter = ({
  buttonText,
  href,
}: {
  buttonText: string;
  href: string;
}) => (
  <div className="p-6 bg-gradient-to-br from-purple-100 to-green-100 rounded-b-lg">
    <Link href={href}>
      <Button variant="gradient" size="lg" className="w-full">
        {buttonText}
      </Button>
    </Link>
  </div>
);

const PricingCard = ({
  plan,
  duration,
}: {
  plan: PricingPlan;
  duration: PlanDuration;
}) => {
  const price = plan[`${duration}Price`];

  if (!price) {
    return null; // Don't render the card if there's no price for the selected duration
  }

  return (
    <motion.div
      className={`rounded-lg overflow-hidden flex-grow h-[583px] flex flex-col justify-between hover:border-2 hover:border-purple-500 border-green-500 ${
        plan.popular ? "" : "border border-gray-200"
      } bg-white w-full max-w-sm text-black shadow-md hover:shadow-xl 
      transition-all duration-300 relative h-full flex-grow`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <CardHeader
        title={plan.title}
        price={price}
        description={plan.description}
        popular={plan.popular}
        duration={duration}
        icon={plan.icon}
      />
      <FeatureList features={plan.features} />
      <CardFooter buttonText={plan.buttonText} href={plan.href} />
    </motion.div>
  );
};

const Switch = ({
  options,
  selectedOption,
  onOptionChange,
}: {
  options: PlanDuration[];
  selectedOption: PlanDuration;
  onOptionChange: (option: PlanDuration) => void;
}) => (
  <div className="flex items-center justify-center space-x-2 bg-gray-100 p-1 rounded-full">
    {options.map((option) => (
      <button
        key={option}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
          selectedOption === option
            ? "bg-purple-600 text-white"
            : "text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => onOptionChange(option)}
      >
        {option.charAt(0).toUpperCase() + option.slice(1)}
      </button>
    ))}
  </div>
);

export default function Pricing() {
  const [duration, setDuration] = useState<PlanDuration>("monthly");
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const availablePlans = pricingData.filter((plan) => plan[`${duration}Price`]);

  useEffect(() => {
    // First, scroll to services section
    const servicesSection = document.getElementById("services-sec");
    if (servicesSection) {
      // Add a small delay to ensure the section is rendered
      setTimeout(() => {
        servicesSection.scrollIntoView({ behavior: "smooth" });

        // After 3 seconds, scroll back to top
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 3000);
      }, 100);
    }
  }, []); // Only run once on component mount

  const settings = {
    dots: false,
    infinite: availablePlans.length > 2,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: duration === "monthly",
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "10px",
        },
      },
    ],
  };

  const handleDurationChange = (newDuration: PlanDuration) => {
    setDuration(newDuration);
    setCurrentSlide(0);
  };

  const goToSlide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <div
      className="relative z-10 py-10 overflow-hidden bg-gradient-to-br from-purple-50 to-green-50"
      id="services-sec"
    >
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/10 to-green-900/10">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="pricing-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.05)" />
              <stop offset="50%" stopColor="rgba(16, 185, 129, 0.05)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.05)" />
            </linearGradient>
          </defs>
          <path fill="url(#pricing-grad)" d="M0 0 C 50 100, 80 100, 100 0 Z" />
        </svg>
      </div>
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="absolute"
            style={{ left: `${i * 25}%`, top: "20%" }}
            width="40"
            height="40"
            viewBox="0 0 40 40"
          >
            <path
              d="M20 2 L38 38 L2 38 Z"
              fill="none"
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="1"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur={`${10 + i * 2}s`}
                repeatCount="indefinite"
              />
            </path>
          </svg>
        ))}
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-green-600 mb-3 lg:mb-5">
            Our Services
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-8 mb-10"
        >
          <Switch
            options={["monthly", "quarterly", "yearly"]}
            // options={["monthly", "quarterly"]}
            selectedOption={duration}
            onOptionChange={handleDurationChange}
          />
          {duration === "yearly" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
              Save upto 30% with yearly billing
            </span>
          )}
        </motion.div>
        <div className="relative w-full">
          <Slider ref={sliderRef} {...settings}>
            {availablePlans.map((plan, index) => (
              <div
                key={index}
                className="outline-none px-2 py-2 w-full h-[580px]"
              >
                <PricingCard plan={plan} duration={duration} />
              </div>
            ))}
          </Slider>
          {availablePlans.length > 1 && (
            <>
              <div className="absolute -bottom-2 right-5 flex mt-4 border border-border  overflow-hidden">
                <div
                  onClick={() => sliderRef.current?.slickPrev()}
                  aria-label="Previous slide"
                  className="bg-purple-600 cursor-pointer p-1 flex items-center justify-center"
                >
                  <MdPlayArrow className="text-white size-8 rotate-180" />
                </div>
                <div
                  onClick={() => sliderRef.current?.slickNext()}
                  aria-label="Next slide"
                  className="bg-purple-600 border-l cursor-pointer p-1 flex items-center justify-center"
                >
                  <MdPlayArrow className="text-white size-8" />
                </div>
              </div>
              <div className="mt-8 flex justify-center items-center">
                {availablePlans.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-3 h-3 rounded-full mx-1 transition-all duration-300",
                      currentSlide === index
                        ? "bg-purple-600 scale-125"
                        : "bg-gray-400"
                    )}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
