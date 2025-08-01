"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles, ChevronUp, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const FloatingBuyNowButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 10px
      setIsVisible(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    // Animate button periodically
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(animationInterval);
    };
  }, []);

  const plans = [
    {
      name: "Early Birds",
      originalPrice: "₹5900",
      discountedPrice: "₹4720",
      discountBadge: "20% OFF",
      badgeColor: "bg-green-500",
      buttonColor: "from-green-500 to-emerald-600",
      link: "https://com.rpy.club/pdp/bansalkaabrahmastra",
      isBestValue: true,
    },
    // {
    //   name: "Kurukshetra Buyers",
    //   originalPrice: "₹5900",
    //   discountedPrice: "₹2006",
    //   discountBadge: "66% OFF",
    //   badgeColor: "bg-blue-500",
    //   buttonColor: "from-blue-500 to-blue-600",
    //   link: "https://forms.gle/Mst4oYmuSaj34xA98",
    //   isBestValue: false,
    // },
    // {
    //   name: "Chakravyuh Buyers",
    //   originalPrice: "₹5900",
    //   discountedPrice: "₹3835",
    //   discountBadge: "35% OFF",
    //   badgeColor: "bg-blue-500",
    //   buttonColor: "from-blue-500 to-blue-600",
    //   link: "https://forms.gle/Mst4oYmuSaj34xA98",
    //   isBestValue: false,
    // },
  ];

  const bestValuePlan = plans.find((plan) => plan.isBestValue) || plans[0];

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        {/* Options Panel */}
        {showOptions && (
          <div className="bg-background border-t-2 border-border shadow-2xl max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-bold text-lg font-montserrat">
                Choose Your Plan
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOptions(false)}
                className="p-1"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3 p-3">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative p-3 rounded-lg border-2 ${
                    plan.isBestValue
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {plan.isBestValue && (
                    <Badge className="absolute -top-3 left-3 bg-green-500 text-white text-xs">
                      BEST VALUE
                    </Badge>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm font-montserrat">
                        {plan.name}
                      </h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs line-through text-gray-500 font-inter">
                          {plan.originalPrice}
                        </span>
                        <span className="text-lg font-bold text-green-600 font-inter">
                          {plan.discountedPrice}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs hover:bg-transparent hover:text-primary"
                        >
                          {plan.discountBadge}
                        </Badge>
                      </div>
                    </div>
                    <Link href={plan.link} target="_blank">
                      <Button
                        size="sm"
                        className={`bg-gradient-to-r ${plan.buttonColor} text-white font-bold`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Mobile Button */}
        <div className="bg-primary shadow-2xl border-t-2 border-accent">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex flex-col flex-1 mr-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="secondary"
                  className="text-xs bg-background text-accent font-bold"
                >
                  {bestValuePlan.discountBadge}
                </Badge>
                <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                <ChevronUp
                  className={`h-4 w-4 text-white transition-transform ${
                    showOptions ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div className="flex items-baseline gap-1 text-white text-left">
                <span className="text-sm line-through opacity-75 font-inter">
                  {bestValuePlan.originalPrice}
                </span>
                <span className="text-lg font-bold font-inter">
                  {bestValuePlan.discountedPrice}
                </span>
              </div>
            </button>
            <Link href={bestValuePlan.link} target="_blank">
              <Button
                size="lg"
                className={`bg-background text-primary hover:bg-gray-100 font-inter font-bold px-6 py-3 shadow-xl border-2 border-border transition-all duration-300 ${
                  isAnimating ? "animate-pulse scale-105" : ""
                }`}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Buy Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Full-Width Fixed Button */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-50">
        {/* Options Panel for Desktop */}
        {showOptions && (
          <div className="bg-white border-t-2 border-gray-200 shadow-2xl">
            <div className="container">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-xl">Choose Your Plan</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptions(false)}
                  className="p-2"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      plan.isBestValue
                        ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md"
                        : "border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 hover:border-blue-300"
                    }`}
                  >
                    {plan.isBestValue && (
                      <Badge className="absolute -top-3 left-4 bg-green-500 text-white text-xs xl:text-sm px-3 py-1">
                        🏆 BEST VALUE
                      </Badge>
                    )}
                    <div className="flex items-center justify-between lg:flex-col">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2 font-montserrat">
                          {plan.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-lg line-through text-gray-500 font-inter">
                            {plan.originalPrice}
                          </span>
                          <span className="text-2xl xl:text-3xl font-bold text-green-600 font-inter">
                            {plan.discountedPrice}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-sm font-bold font-inter"
                          >
                            {plan.discountBadge}
                          </Badge>
                        </div>
                      </div>
                      <Link href={plan.link} target="_blank">
                        <Button
                          size="lg"
                          className={`bg-gradient-to-r ${plan.buttonColor} hover:scale-105 text-background font-bold px-6 py-3 shadow-xl transition-all duration-300`}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Desktop Button */}
        <div className="bg-primary shadow-2xl border-t-4 border-accent">
          <div className="container">
            <div className="flex items-center justify-between p-4">
              {/* Left Section - Plan Info */}
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-4 flex-1 mr-6 hover:bg-card/40 rounded-lg p-3 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Badge className="bg-accent text-white text-sm font-bold animate-pulse px-3 py-1">
                    {bestValuePlan.discountBadge}
                  </Badge>
                  <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                  <div className="text-white text-left">
                    <div className="font-bold text-lg font-montserrat">
                      {bestValuePlan.name}
                    </div>
                    <div className="flex items-baseline gap-2 text-sm">
                      <span className="line-through opacity-75 font-inter">
                        {bestValuePlan.originalPrice}
                      </span>
                      <span className="font-bold text-xl text-yellow-300 font-inter">
                        {bestValuePlan.discountedPrice}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronUp
                  className={`h-6 w-6 text-white transition-transform ml-auto ${
                    showOptions ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Right Section - Action Buttons */}
              <div className="flex items-center gap-4">
                <div className="text-white text-right hidden lg:block">
                  <div className="text-sm opacity-90 font-inter font-light">
                    Limited Time Offer
                  </div>
                  <div className="font-bold font-inter">⏰ Don't Miss Out!</div>
                </div>
                <Link href={bestValuePlan.link} target="_blank">
                  <Button
                    size="lg"
                    className={`bg-background font-inter text-primary hover:bg-gray-100 font-bold px-8 py-3 shadow-2xl border-3 border-green-200 transition-all duration-300 transform hover:scale-105 ${
                      isAnimating
                        ? "animate-pulse scale-105 shadow-white/50"
                        : ""
                    }`}
                  >
                    <ShoppingCart className="h-6 w-6 mr-3" />
                    <div className="flex flex-col">
                      <span className="text-lg">Buy Now</span>
                      <span className="text-xs opacity-75">Instant Access</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Overlay for Options */}
      {showOptions && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </>
  );
};

export default FloatingBuyNowButton;
